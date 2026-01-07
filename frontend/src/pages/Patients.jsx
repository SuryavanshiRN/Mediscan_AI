import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
  Download,
  Eye,
  Loader2,
  Sparkles,
  Pill,
  AlertTriangle,
  Heart,
  Calendar,
  Stethoscope,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { patientsAPI, diagnosisAPI, prescriptionAPI } from "../services/api";
import { useCountUp } from "../hooks/useCountUp";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientReports, setPatientReports] = useState([]);
  const [newPatient, setNewPatient] = useState({
    id: "",
    name: "",
    age: "",
    gender: "Male",
    contact: "",
  });
  const [reportPrescriptions, setReportPrescriptions] = useState({});
  const [prescriptionLoading, setPrescriptionLoading] = useState({});
  const [expandedReports, setExpandedReports] = useState({});

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientsAPI.getAll();
      const patientsData = response.patients || [];

      // Transform backend data to match frontend format
      const formattedPatients = patientsData.map((p) => ({
        id: p.id || p.patient_id || Math.random().toString(),
        name: p.name || p.patient_name || "Unknown",
        age: p.age || 0,
        gender: p.gender || p.sex || "Unknown",
        contact: p.contact || p.phone || "N/A",
        lastVisit:
          p.last_visit ||
          p.created_at ||
          new Date().toISOString().split("T")[0],
        totalScans: p.total_scans || 0,
        latestDiagnosis: p.latest_diagnosis || "None",
        status: p.status || "Active",
      }));

      setPatients(formattedPatients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to load patients");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();

    if (!newPatient.name || !newPatient.age) {
      toast.error("Please fill in name and age");
      return;
    }

    try {
      await patientsAPI.create(newPatient);
      toast.success("Patient added successfully!");
      setShowAddModal(false);
      setNewPatient({ id: "", name: "", age: "", gender: "Male", contact: "" });
      fetchPatients(); // Refresh the list
    } catch (error) {
      console.error("Error adding patient:", error);
      toast.error(error.response?.data?.error || "Failed to add patient");
    }
  };

  const handleEditPatient = async (e) => {
    e.preventDefault();

    if (!selectedPatient.name || !selectedPatient.age) {
      toast.error("Please fill in name and age");
      return;
    }

    try {
      await patientsAPI.update(selectedPatient.id, selectedPatient);
      toast.success("Patient updated successfully!");
      setShowEditModal(false);
      setSelectedPatient(null);
      fetchPatients(); // Refresh the list
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error(error.response?.data?.error || "Failed to update patient");
    }
  };

  const openEditModal = (patient) => {
    setSelectedPatient({ ...patient });
    setShowEditModal(true);
  };

  const exportToCSV = () => {
    if (patients.length === 0) {
      toast.error("No patients to export");
      return;
    }

    try {
      // Define CSV headers
      const headers = [
        "Patient ID",
        "Name",
        "Age",
        "Gender",
        "Contact",
        "Last Visit",
        "Total Scans",
        "Latest Diagnosis",
        "Status",
      ];

      // Convert patients data to CSV rows
      const rows = patients.map((p) => [
        p.id,
        p.name,
        p.age,
        p.gender,
        p.contact,
        p.lastVisit,
        p.totalScans,
        p.latestDiagnosis,
        p.status,
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row
            .map((cell) => {
              // Escape cells that contain commas or quotes
              const cellStr = String(cell || "");
              if (
                cellStr.includes(",") ||
                cellStr.includes('"') ||
                cellStr.includes("\n")
              ) {
                return `"${cellStr.replace(/"/g, '""')}"`;
              }
              return cellStr;
            })
            .join(",")
        ),
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      const timestamp = new Date().toISOString().split("T")[0];
      link.setAttribute("href", url);
      link.setAttribute("download", `patients_export_${timestamp}.csv`);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${patients.length} patients successfully!`);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.error("Failed to export data");
    }
  };

  const exportToExcel = () => {
    if (patients.length === 0) {
      toast.error("No patients to export");
      return;
    }

    try {
      // Create worksheet data with headers
      const headers = [
        "Patient ID",
        "Name",
        "Age",
        "Gender",
        "Contact",
        "Last Visit",
        "Total Scans",
        "Latest Diagnosis",
        "Status",
      ];
      const data = [
        headers,
        ...patients.map((p) => [
          p.id,
          p.name,
          p.age,
          p.gender,
          p.contact,
          p.lastVisit,
          p.totalScans,
          p.latestDiagnosis,
          p.status,
        ]),
      ];

      // Convert to HTML table format for Excel
      let htmlContent =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
      htmlContent +=
        '<head><meta charset="utf-8"><style>table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } th { background-color: #4CAF50; color: white; }</style></head>';
      htmlContent += "<body><table>";

      data.forEach((row, index) => {
        const tag = index === 0 ? "th" : "td";
        htmlContent +=
          "<tr>" +
          row.map((cell) => `<${tag}>${cell || ""}</${tag}>`).join("") +
          "</tr>";
      });

      htmlContent += "</table></body></html>";

      // Create blob and download
      const blob = new Blob([htmlContent], {
        type: "application/vnd.ms-excel",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      const timestamp = new Date().toISOString().split("T")[0];
      link.setAttribute("href", url);
      link.setAttribute("download", `patients_export_${timestamp}.xls`);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${patients.length} patients to Excel!`);
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.error("Failed to export data");
    }
  };

  const generatePrescriptionForReport = async (report) => {
    const reportId = report.id;

    if (prescriptionLoading[reportId]) return;

    setPrescriptionLoading((prev) => ({ ...prev, [reportId]: true }));

    try {
      const diagnosisData = {
        diagnosis: report.diagnosis,
        confidence: report.confidence,
        patient_name: selectedPatient?.name || "Patient",
        age: report.age || selectedPatient?.age,
        sex: report.sex || selectedPatient?.gender,
        clinical_info: report.clinical_info || "",
      };

      const response = await prescriptionAPI.generate(diagnosisData);

      setReportPrescriptions((prev) => ({
        ...prev,
        [reportId]: response.prescription,
      }));

      setExpandedReports((prev) => ({
        ...prev,
        [reportId]: true,
      }));

      toast.success("Prescription generated successfully!");
    } catch (error) {
      console.error("Error generating prescription:", error);
      toast.error("Failed to generate prescription");
    } finally {
      setPrescriptionLoading((prev) => ({ ...prev, [reportId]: false }));
    }
  };

  const toggleReportExpansion = (reportId) => {
    setExpandedReports((prev) => ({
      ...prev,
      [reportId]: !prev[reportId],
    }));
  };

  const generateMockPatients = () => {
    return [
      {
        id: "P001",
        name: "John Smith",
        age: 45,
        gender: "Male",
        contact: "+1 234-567-8900",
        lastVisit: "2024-12-15",
        totalScans: 3,
        latestDiagnosis: "Pneumonia",
        status: "Active",
      },
      {
        id: "P002",
        name: "Sarah Johnson",
        age: 32,
        gender: "Female",
        contact: "+1 234-567-8901",
        lastVisit: "2024-12-20",
        totalScans: 5,
        latestDiagnosis: "Normal",
        status: "Active",
      },
      {
        id: "P003",
        name: "Michael Chen",
        age: 58,
        gender: "Male",
        contact: "+1 234-567-8902",
        lastVisit: "2024-12-10",
        totalScans: 2,
        latestDiagnosis: "Lung Opacity",
        status: "Inactive",
      },
      {
        id: "P004",
        name: "Emily Davis",
        age: 41,
        gender: "Female",
        contact: "+1 234-567-8903",
        lastVisit: "2024-12-22",
        totalScans: 7,
        latestDiagnosis: "Effusion",
        status: "Active",
      },
      {
        id: "P005",
        name: "Robert Wilson",
        age: 67,
        gender: "Male",
        contact: "+1 234-567-8904",
        lastVisit: "2024-12-18",
        totalScans: 4,
        latestDiagnosis: "Cardiomegaly",
        status: "Active",
      },
    ];
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender =
      filterGender === "all" || patient.gender === filterGender;
    return matchesSearch && matchesGender;
  });

  const handleDelete = async (patientId) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await patientsAPI.delete(patientId);
        toast.success("Patient deleted successfully");
        fetchPatients(); // Refresh the list
      } catch (error) {
        console.error("Error deleting patient:", error);
        toast.error("Failed to delete patient");
      }
    }
  };

  const handleView = async (patient) => {
    try {
      setSelectedPatient(patient);
      setShowViewModal(true);

      // Fetch all diagnosis reports for this patient
      const allReports = await diagnosisAPI.getHistory();
      const patientDiagnoses = allReports.filter(
        (r) => r.patient_id === patient.id
      );
      setPatientReports(patientDiagnoses);
    } catch (error) {
      console.error("Error fetching patient reports:", error);
      toast.error("Failed to load patient reports");
    }
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
            Patient Management
          </h1>
          <p className="text-text-secondary mt-1">
            Manage and track patient records
          </p>
        </div>
        <motion.button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-medical-primary text-white rounded-lg hover:bg-medical-primary-hover transition-colors shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          Add Patient
        </motion.button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="glass-card p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex gap-4 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-medical-primary transition-colors" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent hover:border-medical-primary/50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Gender Filter */}
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent hover:border-medical-primary/50 transition-all duration-200 cursor-pointer"
          >
            <option value="all">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {/* Export Button */}
          <motion.button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-background-secondary transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-5 h-5" />
            Export CSV
          </motion.button>

          {/* Export Excel Button */}
          <motion.button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-medical-success text-white rounded-lg hover:bg-medical-success/90 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-5 h-5" />
            Export Excel
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Patients",
            value: patients.length,
            color: "text-text-primary",
          },
          {
            label: "Active Patients",
            value: patients.filter((p) => p.status === "Active").length,
            color: "text-medical-success",
          },
          {
            label: "Total Scans",
            value: patients.reduce((sum, p) => sum + p.totalScans, 0),
            color: "text-medical-primary",
          },
          {
            label: "Avg Scans/Patient",
            value:
              patients.length > 0
                ? (
                    patients.reduce((sum, p) => sum + p.totalScans, 0) /
                    patients.length
                  ).toFixed(1)
                : 0,
            color: "text-medical-accent",
          },
        ].map((stat, index) => {
          const { count } = useCountUp(
            typeof stat.value === "string"
              ? parseFloat(stat.value)
              : stat.value,
            1500
          );
          return (
            <motion.div
              key={stat.label}
              className="glass-card p-4 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: index * 0.03 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="text-sm text-text-secondary">{stat.label}</div>
              <div className={`text-2xl font-bold ${stat.color} mt-1`}>
                {stat.label === "Avg Scans/Patient"
                  ? count.toFixed(1)
                  : Math.round(count)}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Patients Table */}
      <motion.div
        className="glass-card overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, delay: 0.05 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Patient ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Total Scans
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-12 text-center text-text-secondary"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="inline-block"
                    >
                      <Loader2 className="h-8 w-8 text-medical-primary" />
                    </motion.div>
                    <p className="mt-2">Loading patients...</p>
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-12 text-center text-text-secondary"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      No patients found
                    </motion.div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient, index) => (
                  <motion.tr
                    key={patient.id}
                    className="hover:bg-background-secondary/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                      {patient.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {patient.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {patient.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {patient.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {patient.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {new Date(patient.lastVisit).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-medical-primary/10 text-medical-primary">
                        {patient.totalScans}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          patient.status === "Active"
                            ? "bg-medical-success/10 text-medical-success"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-100"
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleView(patient)}
                          className="p-1 text-medical-primary hover:bg-medical-primary/10 rounded transition-colors"
                          title="View Details"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => openEditModal(patient)}
                          className="p-1 text-medical-success hover:bg-medical-success/10 rounded transition-colors"
                          title="Edit Patient"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(patient.id)}
                          className="p-1 text-medical-error hover:bg-medical-error/10 rounded transition-colors"
                          title="Delete Patient"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 glass-overlay flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-modal rounded-2xl p-6 w-full max-w-md mx-4"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary">
                  Add New Patient
                </h2>
                <motion.button
                  onClick={() => setShowAddModal(false)}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-2xl">&times;</span>
                </motion.button>
              </div>

              <form onSubmit={handleAddPatient} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Patient ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={newPatient.id}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, id: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-medical-primary focus:border-transparent hover:border-medical-primary/50 transition-all duration-200"
                    placeholder="Auto-generated if empty"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPatient.name}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent hover:border-medical-primary/50 transition-all duration-200"
                    placeholder="Enter patient name"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    value={newPatient.age}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, age: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-medical-primary focus:border-transparent hover:border-medical-primary/50 transition-all duration-200"
                    placeholder="Enter age"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Gender
                  </label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, gender: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-medical-primary focus:border-transparent hover:border-medical-primary/50 transition-all duration-200 cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Contact (Optional)
                  </label>
                  <input
                    type="text"
                    value={newPatient.contact}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, contact: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-medical-primary focus:border-transparent hover:border-medical-primary/50 transition-all duration-200"
                    placeholder="Phone or email"
                  />
                </motion.div>

                <div className="flex gap-3 mt-6">
                  <motion.button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-background-secondary transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-medical-primary text-white rounded-lg hover:bg-medical-primary/90 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add Patient
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Patient Modal */}
      <AnimatePresence>
        {showEditModal && selectedPatient && (
          <motion.div
            className="fixed inset-0 glass-overlay flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-modal rounded-2xl p-6 w-full max-w-md mx-4"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary">
                  Edit Patient
                </h2>
                <motion.button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedPatient(null);
                  }}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-2xl">&times;</span>
                </motion.button>
              </div>

              <form onSubmit={handleEditPatient} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Patient ID
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedPatient.id}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background-secondary dark:bg-background-secondary text-text-tertiary cursor-not-allowed"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedPatient.name}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-medical-primary focus:border-transparent hover:border-medical-primary/50 transition-all duration-200"
                    placeholder="Enter patient name"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    value={selectedPatient.age}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        age: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-medical-primary focus:border-transparent hover:border-medical-primary/50 transition-all duration-200"
                    placeholder="Enter age"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Gender
                  </label>
                  <select
                    value={selectedPatient.gender}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        gender: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-medical-primary focus:border-transparent hover:border-medical-primary/50 transition-all duration-200 cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Contact (Optional)
                  </label>
                  <input
                    type="text"
                    value={selectedPatient.contact || ""}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        contact: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-medical-primary focus:border-transparent hover:border-medical-primary/50 transition-all duration-200"
                    placeholder="Phone or email"
                  />
                </motion.div>

                <div className="flex gap-3 mt-6">
                  <motion.button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedPatient(null);
                    }}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-background-secondary transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-medical-success text-white rounded-lg hover:bg-medical-success/90 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Update Patient
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Patient Reports Modal */}
      <AnimatePresence>
        {showViewModal && selectedPatient && (
          <motion.div
            className="fixed inset-0 glass-overlay flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-modal rounded-2xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">
                    {selectedPatient.name}'s Medical Reports
                  </h2>
                  <p className="text-sm text-text-tertiary mt-1">
                    Patient ID: {selectedPatient.id} • Age:{" "}
                    {selectedPatient.age} • Gender: {selectedPatient.gender}
                  </p>
                </div>
                <motion.button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedPatient(null);
                    setPatientReports([]);
                    setReportPrescriptions({});
                    setExpandedReports({});
                  }}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-2xl">&times;</span>
                </motion.button>
              </div>

              {/* Patient Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <motion.div
                  className="bg-medical-primary/10 rounded-lg p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="text-sm text-text-tertiary">Total Scans</div>
                  <div className="text-2xl font-bold text-medical-primary mt-1">
                    {patientReports.length}
                  </div>
                </motion.div>
                <motion.div
                  className="bg-medical-success/10 rounded-lg p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <div className="text-sm text-text-tertiary">
                    Latest Diagnosis
                  </div>
                  <div className="text-sm font-bold text-medical-success mt-1">
                    {selectedPatient.latestDiagnosis}
                  </div>
                </motion.div>
                <motion.div
                  className="bg-medical-secondary/10 rounded-lg p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-sm text-text-tertiary">Last Visit</div>
                  <div className="text-sm font-bold text-medical-secondary mt-1">
                    {new Date(selectedPatient.lastVisit).toLocaleDateString()}
                  </div>
                </motion.div>
              </div>

              {/* Reports List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  Diagnosis History ({patientReports.length})
                </h3>

                {patientReports.length === 0 ? (
                  <motion.div
                    className="text-center py-12 text-text-tertiary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    No diagnosis records found for this patient
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    {patientReports.map((report, index) => (
                      <motion.div
                        key={report.id}
                        className="border border-border rounded-lg p-4 hover:bg-background-secondary/50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-semibold text-text-tertiary uppercase">
                                Scan #{patientReports.length - index}
                              </span>
                              <span className="text-xs text-text-tertiary">
                                {new Date(report.timestamp).toLocaleString()}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <div className="text-lg font-semibold text-text-primary mb-1">
                                  {report.diagnosis}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-text-secondary">
                                  <span>Age: {report.age}</span>
                                  <span>Gender: {report.sex}</span>
                                  {report.physician && (
                                    <span>Physician: {report.physician}</span>
                                  )}
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-sm text-text-tertiary mb-1">
                                  Confidence
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 bg-background-secondary rounded-full h-2 overflow-hidden">
                                    <motion.div
                                      className={`h-2 rounded-full ${
                                        report.confidence >= 90
                                          ? "bg-medical-success"
                                          : report.confidence >= 70
                                          ? "bg-medical-warning"
                                          : "bg-medical-error"
                                      }`}
                                      initial={{ width: 0 }}
                                      animate={{
                                        width: `${report.confidence}%`,
                                      }}
                                      transition={{
                                        duration: 0.8,
                                        delay: 0.2 + index * 0.05,
                                      }}
                                    />
                                  </div>
                                  <span className="text-lg font-bold text-text-primary">
                                    {Math.round(report.confidence)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {report.gradcam_path && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <motion.button
                              onClick={() =>
                                window.open(report.gradcam_path, "_blank")
                              }
                              className="text-sm text-medical-primary hover:text-medical-primary-hover font-medium"
                              whileHover={{ x: 5 }}
                            >
                              View Grad-CAM Visualization →
                            </motion.button>
                          </div>
                        )}

                        {/* Prescription Section */}
                        <div className="mt-3 pt-3 border-t border-border">
                          {!reportPrescriptions[report.id] ? (
                            <motion.button
                              onClick={() =>
                                generatePrescriptionForReport(report)
                              }
                              disabled={prescriptionLoading[report.id]}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {prescriptionLoading[report.id] ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4" />
                                  Generate AI Prescription
                                </>
                              )}
                            </motion.button>
                          ) : (
                            <div>
                              <motion.button
                                onClick={() => toggleReportExpansion(report.id)}
                                className="flex items-center gap-2 w-full text-left text-purple-600 dark:text-purple-400 font-medium text-sm"
                              >
                                <Sparkles className="w-4 h-4" />
                                AI Prescription Available
                                {expandedReports[report.id] ? (
                                  <ChevronUp className="w-4 h-4 ml-auto" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 ml-auto" />
                                )}
                              </motion.button>

                              <AnimatePresence>
                                {expandedReports[report.id] &&
                                  reportPrescriptions[report.id] && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="mt-3 space-y-3"
                                    >
                                      {/* Disclaimer */}
                                      <div className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                          {reportPrescriptions[report.id]
                                            .disclaimer ||
                                            "AI-generated. Consult a physician."}
                                        </p>
                                      </div>

                                      {/* Medications */}
                                      {reportPrescriptions[report.id]
                                        .medications?.length > 0 && (
                                        <div>
                                          <h5 className="text-xs font-semibold text-text-primary mb-2 flex items-center gap-1">
                                            <Pill className="w-3 h-3 text-medical-primary" />
                                            Medications
                                          </h5>
                                          <div className="space-y-1">
                                            {reportPrescriptions[
                                              report.id
                                            ].medications
                                              .slice(0, 3)
                                              .map((med, idx) => (
                                                <div
                                                  key={idx}
                                                  className="text-xs text-text-secondary bg-background-secondary/50 p-2 rounded"
                                                >
                                                  <span className="font-medium text-text-primary">
                                                    {med.name}
                                                  </span>
                                                  <span className="text-text-tertiary">
                                                    {" "}
                                                    - {med.dosage},{" "}
                                                    {med.frequency}
                                                  </span>
                                                </div>
                                              ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Precautions */}
                                      {reportPrescriptions[report.id]
                                        .precautions?.length > 0 && (
                                        <div>
                                          <h5 className="text-xs font-semibold text-text-primary mb-1 flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3 text-medical-warning" />
                                            Key Precautions
                                          </h5>
                                          <ul className="text-xs text-text-secondary space-y-0.5">
                                            {reportPrescriptions[
                                              report.id
                                            ].precautions
                                              .slice(0, 3)
                                              .map((p, idx) => (
                                                <li
                                                  key={idx}
                                                  className="flex items-start gap-1"
                                                >
                                                  <span className="text-medical-warning">
                                                    •
                                                  </span>
                                                  {p}
                                                </li>
                                              ))}
                                          </ul>
                                        </div>
                                      )}

                                      {/* Emergency Signs */}
                                      {reportPrescriptions[report.id]
                                        .emergency_signs?.length > 0 && (
                                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                          <h5 className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1 flex items-center gap-1">
                                            <Heart className="w-3 h-3" />
                                            Emergency Signs
                                          </h5>
                                          <ul className="text-xs text-red-600 dark:text-red-400 space-y-0.5">
                                            {reportPrescriptions[
                                              report.id
                                            ].emergency_signs
                                              .slice(0, 2)
                                              .map((sign, idx) => (
                                                <li key={idx}>• {sign}</li>
                                              ))}
                                          </ul>
                                        </div>
                                      )}

                                      {/* Follow-up */}
                                      {reportPrescriptions[report.id]
                                        .follow_up && (
                                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                                          <Calendar className="w-3 h-3 text-medical-primary" />
                                          <span>
                                            {
                                              reportPrescriptions[report.id]
                                                .follow_up
                                            }
                                          </span>
                                        </div>
                                      )}
                                    </motion.div>
                                  )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-border flex justify-end">
                <motion.button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedPatient(null);
                    setPatientReports([]);
                    setReportPrescriptions({});
                    setExpandedReports({});
                  }}
                  className="px-6 py-2 bg-medical-primary text-white rounded-lg hover:bg-medical-primary/90 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
