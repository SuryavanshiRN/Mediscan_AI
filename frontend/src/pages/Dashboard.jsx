import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  Users,
  AlertTriangle,
  TrendingUp,
  Eye,
  FileText,
} from "lucide-react";
import { diagnosisAPI, patientsAPI } from "../services/api";
import toast from "react-hot-toast";
import { useCountUp } from "../hooks/useCountUp";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import StatCard from "../components/Dashboard/StatCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      name: "Total Scans",
      value: 0,
      change: "+0%",
      icon: Activity,
      color: "primary",
    },
    {
      name: "Today",
      value: 0,
      change: "+0",
      icon: TrendingUp,
      color: "secondary",
    },
    {
      name: "Patients",
      value: 0,
      change: "+0",
      icon: Users,
      color: "accent",
    },
    {
      name: "Critical Cases",
      value: 0,
      change: "0",
      icon: AlertTriangle,
      color: "danger",
    },
  ]);
  const [recentDiagnoses, setRecentDiagnoses] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch diagnosis history
      const diagnosesArray = await diagnosisAPI.getHistory();
      console.log("📊 Raw diagnoses response:", diagnosesArray);
      const diagnoses = Array.isArray(diagnosesArray) ? diagnosesArray : [];
      console.log("📊 Diagnoses array:", diagnoses.length, "items");

      // Fetch patients
      const patientsResponse = await patientsAPI.getAll();
      console.log("👥 Raw patients response:", patientsResponse);
      const patients = patientsResponse.patients || [];
      console.log("👥 Patients array:", patients.length, "items");

      // Calculate stats
      const today = new Date().toISOString().split("T")[0];
      console.log("📅 Today's date:", today);
      const todayScans = diagnoses.filter((d) =>
        d.timestamp?.startsWith(today)
      ).length;
      console.log("📅 Today's scans:", todayScans);
      const criticalDiseases = [
        "Lung Cancer",
        "COVID-19",
        "Tuberculosis",
        "Pneumonia",
      ];
      const criticalCases = diagnoses.filter((d) =>
        criticalDiseases.some((disease) => d.diagnosis?.includes(disease))
      ).length;
      console.log("🚨 Critical cases:", criticalCases);

      const newStats = [
        {
          name: "Total Scans",
          value: diagnoses.length,
          change: diagnoses.length > 0 ? "+12%" : "0%",
          icon: Activity,
          color: "primary",
        },
        {
          name: "Today",
          value: todayScans,
          change: `+${todayScans}`,
          icon: TrendingUp,
          color: "secondary",
        },
        {
          name: "Patients",
          value: patients.length,
          change: `+${patients.length}`,
          icon: Users,
          color: "accent",
        },
        {
          name: "Critical Cases",
          value: criticalCases,
          change: criticalCases > 0 ? `-${criticalCases}` : "0",
          icon: AlertTriangle,
          color: "danger",
        },
      ];

      console.log(
        "📈 New stats calculated:",
        newStats.map((s) => `${s.name}: ${s.value}`)
      );
      setStats(newStats);

      // Set recent diagnoses (last 5)
      const recent = diagnoses.slice(0, 5).map((d) => ({
        id: d.id || Math.random().toString(),
        patientId: d.patient_id || "N/A",
        patient: d.patient_name || "Unknown Patient",
        disease: d.diagnosis || "Unknown",
        confidence: Math.round(d.confidence) || 0,
        date: d.timestamp
          ? new Date(d.timestamp).toLocaleDateString()
          : new Date().toLocaleDateString(),
        critical: criticalDiseases.some((disease) =>
          d.diagnosis?.includes(disease)
        ),
      }));

      setRecentDiagnoses(recent);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDiagnosis = async (diagnosisId) => {
    try {
      const allDiagnoses = await diagnosisAPI.getHistory();
      const diagnosis = allDiagnoses.find((d) => d.id === diagnosisId);
      if (diagnosis) {
        setSelectedDiagnosis(diagnosis);
        setShowViewModal(true);
      } else {
        toast.error("Diagnosis not found");
      }
    } catch (error) {
      console.error("Error fetching diagnosis:", error);
      toast.error("Failed to load diagnosis details");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-medical-primary/30 border-t-medical-primary rounded-full"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-text-secondary"
        >
          Loading dashboard...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.15 }}
      >
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="mt-1 text-text-secondary">
          Welcome back! Here's what's happening today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} index={index} />
        ))}
      </div>

      {/* Recent Diagnoses Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, delay: 0.1 }}
        className="glass-card overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">
            Recent Diagnoses
          </h2>
        </div>
        {recentDiagnoses.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-text-tertiary">
              No diagnoses yet. Upload an X-ray to get started.
            </p>
            <button
              onClick={() => navigate("/diagnosis")}
              className="mt-4 px-4 py-2 bg-medical-primary text-white rounded-lg hover:bg-medical-primary-hover transition-colors"
            >
              New Diagnosis
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-background-secondary/50 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Patient ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Diagnosis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentDiagnoses.map((diagnosis, idx) => (
                  <motion.tr
                    key={diagnosis.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.1, delay: idx * 0.02 }}
                    className="hover:bg-primary/5 transition-all duration-200 group cursor-pointer"
                    onClick={() => handleViewDiagnosis(diagnosis.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-text-primary">
                        {diagnosis.patientId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-text-primary">
                        {diagnosis.patient}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            diagnosis.critical
                              ? "bg-medical-error/10 text-medical-error"
                              : "bg-medical-secondary/10 text-medical-secondary"
                          }`}
                        >
                          {diagnosis.disease}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-background-secondary rounded-full h-2 max-w-[100px]">
                          <div
                            className={`h-2 rounded-full ${
                              diagnosis.confidence >= 90
                                ? "bg-medical-success"
                                : diagnosis.confidence >= 70
                                ? "bg-medical-warning"
                                : "bg-medical-error"
                            }`}
                            style={{ width: `${diagnosis.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm text-text-primary font-medium">
                          {diagnosis.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {new Date(diagnosis.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDiagnosis(diagnosis.id);
                        }}
                        className="inline-flex items-center text-medical-primary hover:text-medical-primary-hover transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success("Report generation coming soon!");
                        }}
                        className="inline-flex items-center text-text-tertiary hover:text-text-primary transition-colors"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Report
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* View Diagnosis Modal */}
      {showViewModal && selectedDiagnosis && (
        <div className="fixed inset-0 glass-overlay flex items-center justify-center z-50 animate-fade-in">
          <div className="glass-modal rounded-2xl p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-text-primary">
                  Diagnosis Report
                </h2>
                <p className="text-sm text-text-tertiary mt-1">
                  {new Date(selectedDiagnosis.timestamp).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedDiagnosis(null);
                }}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            {/* Patient Information */}
            <div className="bg-background-secondary rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-3">
                Patient Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-text-tertiary uppercase mb-1">
                    Name
                  </div>
                  <div className="text-sm font-medium text-text-primary">
                    {selectedDiagnosis.patient_name}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-tertiary uppercase mb-1">
                    Patient ID
                  </div>
                  <div className="text-sm font-medium text-text-primary">
                    {selectedDiagnosis.patient_id}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-tertiary uppercase mb-1">
                    Age
                  </div>
                  <div className="text-sm font-medium text-text-primary">
                    {selectedDiagnosis.age} years
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-tertiary uppercase mb-1">
                    Gender
                  </div>
                  <div className="text-sm font-medium text-text-primary">
                    {selectedDiagnosis.sex}
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnosis Results */}
            <div className="bg-surface dark:bg-surface border border-border rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Diagnosis Results
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-text-tertiary mb-2">
                    Detected Condition
                  </div>
                  <div className="text-2xl font-bold text-text-primary">
                    {selectedDiagnosis.diagnosis}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-text-tertiary mb-2">
                    Confidence Level
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-background-secondary rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          selectedDiagnosis.confidence >= 90
                            ? "bg-medical-success"
                            : selectedDiagnosis.confidence >= 70
                            ? "bg-medical-warning"
                            : "bg-medical-error"
                        }`}
                        style={{ width: `${selectedDiagnosis.confidence}%` }}
                      />
                    </div>
                    <span className="text-2xl font-bold text-text-primary min-w-[80px]">
                      {Math.round(selectedDiagnosis.confidence)}%
                    </span>
                  </div>
                </div>

                {selectedDiagnosis.physician && (
                  <div>
                    <div className="text-sm text-text-tertiary mb-2">
                      Reviewing Physician
                    </div>
                    <div className="text-lg font-medium text-text-primary">
                      {selectedDiagnosis.physician}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Grad-CAM Visualization */}
            {selectedDiagnosis.gradcam_path && (
              <div className="bg-surface dark:bg-surface border border-border rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  AI Visualization (Grad-CAM)
                </h3>
                <div className="aspect-video bg-background-secondary rounded-lg overflow-hidden">
                  <img
                    src={selectedDiagnosis.gradcam_path}
                    alt="Grad-CAM Visualization"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-text-tertiary mt-2">
                  Heatmap shows areas of the X-ray that influenced the AI's
                  decision
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedDiagnosis(null);
                }}
                className="px-6 py-2 border border-border rounded-lg hover:bg-background-secondary transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigate("/diagnosis", {
                    state: { diagnosisData: selectedDiagnosis },
                  });
                }}
                className="px-6 py-2 bg-medical-primary text-white rounded-lg hover:bg-medical-primary/90 transition-colors"
              >
                Go to Full Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
