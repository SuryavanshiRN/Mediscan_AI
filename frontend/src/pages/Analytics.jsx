import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Activity, Users, Calendar, Loader2 } from "lucide-react";
import { diagnosisAPI, patientsAPI } from "../services/api";
import toast from "react-hot-toast";

// Local animated stat card component to handle useCountUp properly
function AnimatedStatCard({ stat, index }) {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(stat.value.replace(/[^0-9]/g, "")) || 0;
  const countRef = useRef(null);

  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(easeOut * numericValue));

      if (progress < 1) {
        countRef.current = requestAnimationFrame(animate);
      }
    };

    countRef.current = requestAnimationFrame(animate);
    return () => {
      if (countRef.current) cancelAnimationFrame(countRef.current);
    };
  }, [numericValue]);

  const displayValue = stat.value.includes("%")
    ? `${count}%`
    : count.toString();

  return (
    <motion.div
      className="glass-card p-6 hover:shadow-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: index * 0.03 }}
      whileHover={{ scale: 1.02, y: -4 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary">{stat.title}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">
            {displayValue}
          </p>
          <p
            className={`text-sm mt-1 ${
              stat.trend === "up"
                ? "text-medical-success"
                : "text-medical-error"
            }`}
          >
            {stat.change} from last period
          </p>
        </div>
        <motion.div
          className={`p-3 rounded-lg ${
            stat.color === "blue"
              ? "bg-medical-primary/10"
              : stat.color === "green"
              ? "bg-medical-success/10"
              : stat.color === "purple"
              ? "bg-medical-accent/10"
              : "bg-medical-warning/10"
          }`}
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <stat.icon
            className={`w-6 h-6 ${
              stat.color === "blue"
                ? "text-medical-primary"
                : stat.color === "green"
                ? "text-medical-success"
                : stat.color === "purple"
                ? "text-medical-accent"
                : "text-medical-warning"
            }`}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("month");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [diseaseDistribution, setDiseaseDistribution] = useState([]);
  const [monthlyScans, setMonthlyScans] = useState([]);
  const [topDiseases, setTopDiseases] = useState([]);
  const [avgAccuracy, setAvgAccuracy] = useState(0);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [diagnosesRes, patientsRes] = await Promise.all([
        diagnosisAPI.getHistory(),
        patientsAPI.getAll(),
      ]);

      const diagnoses = Array.isArray(diagnosesRes) ? diagnosesRes : [];
      const patients = patientsRes.patients || [];

      console.log("📊 Analytics - Diagnoses:", diagnoses.length);
      console.log("📊 Analytics - Patients:", patients.length);

      // Filter by time range
      const now = new Date();
      const filteredDiagnoses = diagnoses.filter((d) => {
        const diagnosisDate = new Date(d.timestamp);
        const daysDiff = Math.floor(
          (now - diagnosisDate) / (1000 * 60 * 60 * 24)
        );

        if (timeRange === "week") return daysDiff <= 7;
        if (timeRange === "month") return daysDiff <= 30;
        if (timeRange === "quarter") return daysDiff <= 90;
        if (timeRange === "year") return daysDiff <= 365;
        return true;
      });

      // Calculate disease distribution
      const diseaseCount = {};
      filteredDiagnoses.forEach((d) => {
        const disease = d.diagnosis || "Unknown";
        diseaseCount[disease] = (diseaseCount[disease] || 0) + 1;
      });

      const colors = [
        "#00A86B",
        "#0066CC",
        "#6366F1",
        "#F59E0B",
        "#EF4444",
        "#8B5CF6",
        "#EC4899",
        "#10B981",
      ];
      const distribution = Object.entries(diseaseCount)
        .map(([name, value], index) => ({
          name,
          value,
          color: colors[index % colors.length],
        }))
        .sort((a, b) => b.value - a.value);

      setDiseaseDistribution(distribution);

      // Calculate top diseases with trends
      const top = distribution.slice(0, 5).map((d) => ({
        disease: d.name,
        cases: d.value,
        trend: "+0%", // Can calculate actual trend if we have historical data
        trendUp: true,
      }));
      setTopDiseases(top);

      // Calculate monthly scans
      const monthlyData = calculateMonthlyScans(filteredDiagnoses);
      setMonthlyScans(monthlyData);

      // Calculate average accuracy
      const totalConfidence = filteredDiagnoses.reduce(
        (sum, d) => sum + (d.confidence || 0),
        0
      );
      const avgConf =
        filteredDiagnoses.length > 0
          ? totalConfidence / filteredDiagnoses.length
          : 0;
      setAvgAccuracy(avgConf);

      // Calculate stats
      const today = new Date().toISOString().split("T")[0];
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonthScans = diagnoses.filter(
        (d) => new Date(d.timestamp) >= thisMonthStart
      ).length;

      setStats([
        {
          title: "Total Scans",
          value: filteredDiagnoses.length.toString(),
          change: "+0%",
          trend: "up",
          icon: Activity,
          color: "blue",
        },
        {
          title: "Active Patients",
          value: patients.length.toString(),
          change: "+0%",
          trend: "up",
          icon: Users,
          color: "green",
        },
        {
          title: "Avg Confidence",
          value: `${Math.round(avgConf)}%`,
          change: "+0%",
          trend: "up",
          icon: TrendingUp,
          color: "purple",
        },
        {
          title: "This Month",
          value: thisMonthScans.toString(),
          change: "+0%",
          trend: "up",
          icon: Calendar,
          color: "orange",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyScans = (diagnoses) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyData = {};

    // Initialize last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthlyData[key] = {
        month: monthNames[date.getMonth()],
        scans: 0,
        diseases: {},
      };
    }

    // Count scans per month
    diagnoses.forEach((d) => {
      const date = new Date(d.timestamp);
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      if (monthlyData[key]) {
        monthlyData[key].scans++;
        const disease = d.diagnosis || "Other";
        monthlyData[key].diseases[disease] =
          (monthlyData[key].diseases[disease] || 0) + 1;
      }
    });

    return Object.values(monthlyData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.15 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Analytics Dashboard
          </h1>
          <p className="text-text-secondary mt-1">
            Diagnostic trends and insights
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent hover:border-medical-primary/50 transition-all duration-200 cursor-pointer"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="quarter">Last 3 Months</option>
          <option value="year">Last Year</option>
        </select>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-4 flex justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-12 w-12 text-medical-primary" />
            </motion.div>
          </div>
        ) : (
          stats.map((stat, index) => (
            <AnimatedStatCard key={index} stat={stat} index={index} />
          ))
        )}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Scans Trend */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.05 }}
        >
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Monthly Scan Volume
          </h3>
          {monthlyScans.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-text-tertiary">
              No scan data available for the selected period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyScans}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="scans"
                  stroke="#2563EB"
                  strokeWidth={3}
                  name="Total Scans"
                  dot={{ r: 4, fill: "#2563EB" }}
                  activeDot={{
                    r: 6,
                    fill: "#2563EB",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Disease Distribution */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.08 }}
        >
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Disease Distribution
          </h3>
          {diseaseDistribution.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-text-tertiary">
              No diagnosis data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={diseaseDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {diseaseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Top Diseases Section */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Top Diagnoses
        </h3>
        {topDiseases.length === 0 ? (
          <div className="py-12 text-center text-text-tertiary">
            No diagnosis data available for the selected period
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {topDiseases.map((disease, index) => (
              <motion.div
                key={index}
                className="bg-background-secondary/50 rounded-lg p-4 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1, delay: index * 0.02 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <motion.span
                    className="text-2xl font-bold text-text-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1 }}
                  >
                    #{index + 1}
                  </motion.span>
                </div>
                <div className="text-sm font-medium text-text-primary mb-1">
                  {disease.disease}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-medical-primary">
                    {disease.cases}
                  </span>
                  <span className="text-xs text-text-tertiary">cases</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
