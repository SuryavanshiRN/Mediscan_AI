import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2,
  Sparkles,
  Pill,
  AlertTriangle,
  Heart,
  Calendar,
  Stethoscope,
  UserCheck,
  MapPin,
  Star,
  Phone,
  Clock,
  Plus,
  Image,
} from "lucide-react";
import toast from "react-hot-toast";
import { diagnosisAPI, prescriptionAPI } from "../services/api";

// Sample doctor data based on specializations
const sampleDoctors = {
  Pulmonologist: [
    {
      id: 1,
      name: "Dr. Sarah Mitchell",
      specialty: "Pulmonologist",
      experience: "15 years",
      rating: 4.9,
      reviews: 342,
      location: "City Medical Center",
      distance: "2.3 km",
      availability: "Available Today",
      phone: "+1 234-567-8901",
      image: null,
    },
    {
      id: 2,
      name: "Dr. James Wilson",
      specialty: "Pulmonologist",
      experience: "12 years",
      rating: 4.7,
      reviews: 256,
      location: "Metro Health Hospital",
      distance: "4.1 km",
      availability: "Next Available: Tomorrow",
      phone: "+1 234-567-8902",
      image: null,
    },
    {
      id: 3,
      name: "Dr. Emily Chen",
      specialty: "Pulmonologist",
      experience: "20 years",
      rating: 4.8,
      reviews: 489,
      location: "University Medical",
      distance: "5.8 km",
      availability: "Available Today",
      phone: "+1 234-567-8903",
      image: null,
    },
  ],
  Cardiologist: [
    {
      id: 4,
      name: "Dr. Michael Roberts",
      specialty: "Cardiologist",
      experience: "18 years",
      rating: 4.9,
      reviews: 521,
      location: "Heart Care Institute",
      distance: "3.2 km",
      availability: "Available Today",
      phone: "+1 234-567-8904",
      image: null,
    },
    {
      id: 5,
      name: "Dr. Lisa Anderson",
      specialty: "Cardiologist",
      experience: "14 years",
      rating: 4.8,
      reviews: 398,
      location: "City Medical Center",
      distance: "2.3 km",
      availability: "Next Available: Wed",
      phone: "+1 234-567-8905",
      image: null,
    },
  ],
  Oncologist: [
    {
      id: 6,
      name: "Dr. David Kim",
      specialty: "Oncologist",
      experience: "22 years",
      rating: 4.9,
      reviews: 612,
      location: "Cancer Care Center",
      distance: "6.5 km",
      availability: "Next Available: Tomorrow",
      phone: "+1 234-567-8906",
      image: null,
    },
    {
      id: 7,
      name: "Dr. Rachel Green",
      specialty: "Oncologist",
      experience: "16 years",
      rating: 4.7,
      reviews: 334,
      location: "University Medical",
      distance: "5.8 km",
      availability: "Available Today",
      phone: "+1 234-567-8907",
      image: null,
    },
  ],
  "General Physician": [
    {
      id: 8,
      name: "Dr. John Smith",
      specialty: "General Physician",
      experience: "10 years",
      rating: 4.6,
      reviews: 245,
      location: "Family Health Clinic",
      distance: "1.2 km",
      availability: "Available Today",
      phone: "+1 234-567-8908",
      image: null,
    },
    {
      id: 9,
      name: "Dr. Maria Garcia",
      specialty: "General Physician",
      experience: "8 years",
      rating: 4.5,
      reviews: 189,
      location: "Community Medical",
      distance: "2.1 km",
      availability: "Available Today",
      phone: "+1 234-567-8909",
      image: null,
    },
  ],
};

// Map diseases to specialist types
const diseaseToSpecialist = {
  Pneumonia: "Pulmonologist",
  "COVID-19": "Pulmonologist",
  Tuberculosis: "Pulmonologist",
  "Lung Opacity": "Pulmonologist",
  Effusion: "Pulmonologist",
  Cardiomegaly: "Cardiologist",
  "Heart Disease": "Cardiologist",
  "Lung Cancer": "Oncologist",
  Malignant: "Oncologist",
  Normal: "General Physician",
  Benign: "General Physician",
};

export default function Diagnosis() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    id: "",
    gender: "Female",
  });

  // Load diagnosis result from localStorage on mount
  useEffect(() => {
    const savedResult = localStorage.getItem("lastDiagnosisResult");
    const savedPatientInfo = localStorage.getItem("lastPatientInfo");
    const savedPreviews = localStorage.getItem("lastDiagnosisPreviews");
    const savedPrescription = localStorage.getItem("lastPrescription");

    if (savedResult) {
      try {
        setResult(JSON.parse(savedResult));
      } catch (e) {
        console.error("Error loading saved diagnosis:", e);
      }
    }

    if (savedPatientInfo) {
      try {
        setPatientInfo(JSON.parse(savedPatientInfo));
      } catch (e) {
        console.error("Error loading saved patient info:", e);
      }
    }

    if (savedPreviews) {
      try {
        const parsed = JSON.parse(savedPreviews);
        setPreviews(parsed);
        // Ensure activeImageIndex is within bounds
        if (parsed.length > 0) {
          setActiveImageIndex(0);
        }
      } catch (e) {
        console.error("Error loading saved previews:", e);
      }
    }

    if (savedPrescription) {
      try {
        setPrescription(JSON.parse(savedPrescription));
      } catch (e) {
        console.error("Error loading saved prescription:", e);
      }
    }
  }, []);

  // Get recommended doctors based on diagnosis
  const getRecommendedDoctors = () => {
    if (!result?.disease) return [];
    const specialty =
      diseaseToSpecialist[result.disease] || "General Physician";
    return sampleDoctors[specialty] || sampleDoctors["General Physician"];
  };

  const generatePrescription = async () => {
    if (!result) return;

    setPrescriptionLoading(true);
    try {
      const response = await prescriptionAPI.generate({
        disease: result.disease,
        confidence: result.confidence,
        patient_name: patientInfo.name,
        patient_age: patientInfo.age,
        patient_gender: patientInfo.gender,
        clinical_info: result.clinicalInfo,
      });

      setPrescription(response.prescription);
      localStorage.setItem(
        "lastPrescription",
        JSON.stringify(response.prescription)
      );
      toast.success("Prescription generated successfully!");
    } catch (error) {
      console.error("Prescription generation error:", error);
      toast.error("Failed to generate prescription. Please try again.");
    } finally {
      setPrescriptionLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if adding these would exceed max (4 images)
    if (selectedImages.length + files.length > 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImages((prev) => [...prev, file]);
        setPreviews((prev) => [...prev, reader.result]);
        setActiveImageIndex(selectedImages.length);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files?.length > 0) {
      handleImageSelect({ target: { files } });
    }
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    if (activeImageIndex >= index && activeImageIndex > 0) {
      setActiveImageIndex((prev) => prev - 1);
    }
  };

  const handleAnalyze = async () => {
    if (selectedImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    if (!patientInfo.name || !patientInfo.age || !patientInfo.id) {
      toast.error("Please fill in all patient information");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      // Append primary image (first one) for analysis
      formData.append("image", selectedImages[0]);

      // Append additional images if available
      selectedImages.forEach((img, idx) => {
        if (idx > 0) {
          formData.append(`image_${idx + 1}`, img);
        }
      });

      // Send patient data as JSON string to match backend expectation
      formData.append(
        "patient_data",
        JSON.stringify({
          name: patientInfo.name,
          id: patientInfo.id,
          age: patientInfo.age,
          gender: patientInfo.gender,
          image_count: selectedImages.length,
        })
      );

      const response = await diagnosisAPI.predict(formData);

      const diagnosisResult = {
        disease: response.disease,
        confidence: response.confidence,
        gradcamImage: response.gradcam_image,
        clinicalInfo: response.clinical_info,
        timestamp: new Date().toLocaleString(),
        imageCount: selectedImages.length,
      };

      setResult(diagnosisResult);

      // Save to localStorage for persistence across navigation
      localStorage.setItem(
        "lastDiagnosisResult",
        JSON.stringify(diagnosisResult)
      );
      localStorage.setItem("lastPatientInfo", JSON.stringify(patientInfo));
      localStorage.setItem("lastDiagnosisPreviews", JSON.stringify(previews));

      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(
        error.response?.data?.error || "Analysis failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearImages = () => {
    setSelectedImages([]);
    setPreviews([]);
    setActiveImageIndex(0);
  };

  const clearResult = () => {
    setResult(null);
    setPrescription(null);
    localStorage.removeItem("lastDiagnosisResult");
    localStorage.removeItem("lastPatientInfo");
    localStorage.removeItem("lastDiagnosisPreviews");
    localStorage.removeItem("lastPrescription");
    toast.success("Diagnosis cleared");
  };

  const handleDownloadPDF = async () => {
    if (!result) {
      toast.error("No diagnosis result to download");
      return;
    }

    try {
      toast.loading("Generating PDF report...");

      // Build prescription HTML if available
      let prescriptionHTML = "";
      if (prescription) {
        const medicationsHTML =
          prescription.medications
            ?.map(
              (med) =>
                `<tr><td style="padding: 8px; border: 1px solid #E2E8F0;">${med.name}</td><td style="padding: 8px; border: 1px solid #E2E8F0;">${med.dosage}</td><td style="padding: 8px; border: 1px solid #E2E8F0;">${med.frequency}</td><td style="padding: 8px; border: 1px solid #E2E8F0;">${med.duration}</td></tr>`
            )
            .join("") || "";

        const precautionsHTML =
          prescription.precautions?.map((p) => `<li>${p}</li>`).join("") || "";
        const lifestyleHTML =
          prescription.lifestyle_recommendations
            ?.map((l) => `<li>${l}</li>`)
            .join("") || "";
        const emergencyHTML =
          prescription.emergency_signs
            ?.map((e) => `<li style="color: #DC2626;">${e}</li>`)
            .join("") || "";

        prescriptionHTML = `
          <div class="info-section" style="page-break-before: always;">
            <h2 style="color: #7C3AED;">AI-Generated Prescription</h2>
            <p style="background: #FEF3C7; padding: 10px; border-radius: 8px; color: #92400E; font-size: 12px;">
              ⚠️ ${
                prescription.disclaimer ||
                "This prescription is AI-generated and should be reviewed by a licensed healthcare provider."
              }
            </p>
            
            <h3 style="margin-top: 20px;">Medications</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
              <thead>
                <tr style="background: #F1F5F9;">
                  <th style="padding: 8px; border: 1px solid #E2E8F0; text-align: left;">Medication</th>
                  <th style="padding: 8px; border: 1px solid #E2E8F0; text-align: left;">Dosage</th>
                  <th style="padding: 8px; border: 1px solid #E2E8F0; text-align: left;">Frequency</th>
                  <th style="padding: 8px; border: 1px solid #E2E8F0; text-align: left;">Duration</th>
                </tr>
              </thead>
              <tbody>${medicationsHTML}</tbody>
            </table>

            <h3 style="margin-top: 20px;">Precautions</h3>
            <ul>${precautionsHTML}</ul>

            <h3 style="margin-top: 20px;">Lifestyle Recommendations</h3>
            <ul>${lifestyleHTML}</ul>

            <h3 style="margin-top: 20px; color: #DC2626;">⚠️ Emergency Warning Signs</h3>
            <ul>${emergencyHTML}</ul>

            <h3 style="margin-top: 20px;">Follow-up</h3>
            <p>${
              prescription.follow_up || "Schedule follow-up with your physician"
            }</p>
          </div>
        `;
      }

      // Create a simple PDF report using browser print API
      const reportWindow = window.open("", "_blank");
      reportWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Medical Diagnosis Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
              h1 { color: #2563EB; border-bottom: 2px solid #2563EB; padding-bottom: 10px; }
              h2 { color: #1E40AF; margin-top: 30px; }
              h3 { color: #374151; margin-top: 15px; }
              .header { margin-bottom: 30px; }
              .info-section { margin: 20px 0; }
              .label { font-weight: bold; color: #64748B; }
              .value { color: #1E293B; margin-left: 10px; }
              .diagnosis { background: #F1F5F9; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .confidence { font-size: 24px; color: #14B8A6; font-weight: bold; }
              img { max-width: 400px; margin: 20px 0; }
              ul { margin: 10px 0; padding-left: 20px; }
              li { margin: 5px 0; }
              @media print {
                body { padding: 20px; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🏥 MediScan AI - X-Ray Diagnosis Report</h1>
              <p><span class="label">Report ID:</span><span class="value">${Date.now()}</span></p>
              <p><span class="label">Generated:</span><span class="value">${
                result.timestamp
              }</span></p>
            </div>
            
            <div class="info-section">
              <h2>👤 Patient Information</h2>
              <p><span class="label">Name:</span><span class="value">${
                patientInfo.name
              }</span></p>
              <p><span class="label">Age:</span><span class="value">${
                patientInfo.age
              } years</span></p>
              <p><span class="label">Patient ID:</span><span class="value">${
                patientInfo.id
              }</span></p>
              <p><span class="label">Gender:</span><span class="value">${
                patientInfo.gender
              }</span></p>
            </div>
            
            <div class="diagnosis">
              <h2>🔬 Diagnosis Result</h2>
              <p><span class="label">Detected Condition:</span><span class="value" style="font-size: 20px; font-weight: bold;">${
                result.disease
              }</span></p>
              <p><span class="label">Confidence Score:</span><span class="confidence">${
                result.confidence
              }%</span></p>
            </div>
            
            <div class="info-section">
              <h2>📋 Clinical Information</h2>
              <p>${result.clinicalInfo}</p>
            </div>
            
            <div class="info-section">
              <h2>🔍 Grad-CAM Visualization</h2>
              <img src="${result.gradcamImage}" alt="Grad-CAM Heatmap" />
              <p><i>Highlighted regions indicate areas of diagnostic interest identified by the AI model.</i></p>
            </div>
            
            ${prescriptionHTML}
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #E2E8F0;">
              <p style="color: #64748B; font-size: 12px;">
                <strong>Disclaimer:</strong> This report was generated by MediScan AI using advanced machine learning algorithms. 
                It is intended for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. 
                Always consult with a qualified healthcare provider for proper medical evaluation.
              </p>
              <p style="color: #64748B; font-size: 11px; margin-top: 10px;">
                Powered by MediScan AI • ${new Date().getFullYear()} • Generated with Gemini AI
              </p>
            </div>
          </body>
        </html>
      `);

      reportWindow.document.close();

      // Wait for content to load before printing
      setTimeout(() => {
        reportWindow.print();
        toast.dismiss();
        toast.success("PDF report generated!");
      }, 500);
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.dismiss();
      toast.error("Failed to generate PDF report");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.15 }}
      >
        <h1 className="text-3xl font-bold text-text-primary">New Diagnosis</h1>
        <p className="mt-1 text-text-secondary">
          Upload a chest X-ray for AI-powered analysis
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Upload & Patient Info */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Image Upload */}
          <motion.div
            className="glass-card p-6"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center justify-between">
              <span>Upload Images</span>
              <span className="text-sm font-normal text-text-tertiary">
                {previews.length}/4 images
              </span>
            </h2>

            <AnimatePresence mode="wait">
              {previews.length === 0 ? (
                <motion.div
                  key="upload-zone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-medical-primary hover:bg-primary-50/30 transition-all duration-300 cursor-pointer group"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                    multiple
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Upload className="w-12 h-12 mx-auto text-text-tertiary mb-4 group-hover:text-medical-primary transition-colors" />
                    </motion.div>
                    <p className="text-text-primary font-medium mb-2">
                      Drop your images here, or click to browse
                    </p>
                    <p className="text-sm text-text-secondary">
                      Upload up to 4 X-ray views (JPG, PNG - Max 10MB each)
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-3 text-xs text-text-tertiary">
                      <Image className="w-4 h-4" />
                      <span>Frontal, Lateral, Oblique views recommended</span>
                    </div>
                  </label>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  className="space-y-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Main Preview */}
                  <div className="relative">
                    <motion.img
                      src={previews[activeImageIndex] || previews[0]}
                      alt={`Preview ${activeImageIndex + 1}`}
                      className="w-full h-64 object-contain rounded-lg bg-background-secondary"
                      layoutId="preview-image"
                    />
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded-lg">
                      View {activeImageIndex + 1} of {previews.length}
                    </div>
                    <motion.button
                      onClick={() => removeImage(activeImageIndex)}
                      className="absolute top-2 right-2 p-2 bg-surface dark:bg-surface rounded-full shadow-large hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-5 h-5 text-text-secondary hover:text-red-500" />
                    </motion.button>
                  </div>

                  {/* Thumbnail Gallery */}
                  <div className="flex items-center gap-2">
                    {previews.map((previewImg, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === activeImageIndex
                            ? "border-medical-primary ring-2 ring-medical-primary/30"
                            : "border-border hover:border-medical-primary/50"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img
                          src={previewImg}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs font-medium">
                          {idx + 1}
                        </div>
                      </motion.button>
                    ))}

                    {/* Add More Button */}
                    {previews.length < 4 && (
                      <motion.label
                        htmlFor="image-upload-more"
                        className="w-16 h-16 rounded-lg border-2 border-dashed border-border hover:border-medical-primary flex items-center justify-center cursor-pointer transition-all"
                        whileHover={{
                          scale: 1.05,
                          borderColor: "var(--medical-primary)",
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                          id="image-upload-more"
                          multiple
                        />
                        <Plus className="w-6 h-6 text-text-tertiary" />
                      </motion.label>
                    )}
                  </div>

                  {/* Clear All Button */}
                  <motion.button
                    onClick={clearImages}
                    className="w-full py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.01 }}
                  >
                    Clear All Images
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Patient Information */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Patient Information
            </h2>
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={patientInfo.name}
                  onChange={(e) =>
                    setPatientInfo({ ...patientInfo, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-medical-primary/50 transition-all duration-200"
                  placeholder="Jane Doe"
                />
              </motion.div>
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={patientInfo.age}
                    onChange={(e) =>
                      setPatientInfo({ ...patientInfo, age: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-medical-primary/50 transition-all duration-200"
                    placeholder="55"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Gender
                  </label>
                  <select
                    value={patientInfo.gender}
                    onChange={(e) =>
                      setPatientInfo({ ...patientInfo, gender: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-medical-primary/50 transition-all duration-200 cursor-pointer"
                  >
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                  </select>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
              >
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Patient ID
                </label>
                <input
                  type="text"
                  value={patientInfo.id}
                  onChange={(e) =>
                    setPatientInfo({ ...patientInfo, id: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-medical-primary/50 transition-all duration-200"
                  placeholder="MRN-10293"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Analyze Button */}
          <motion.button
            onClick={handleAnalyze}
            disabled={selectedImages.length === 0 || loading}
            className="w-full py-3 bg-medical-primary text-white font-medium rounded-lg hover:bg-medical-primary-hover disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 40px rgba(var(--primary-color), 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <motion.span
                className="flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Analyzing...
              </motion.span>
            ) : (
              "Analyze Image"
            )}
          </motion.button>
        </motion.div>

        {/* Right Column - Results */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="space-y-6"
              >
                {/* Diagnosis Result */}
                <motion.div
                  className="glass-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-lg font-semibold text-text-primary">
                      Diagnosis Result
                    </h2>
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        delay: 0.3,
                      }}
                    >
                      {result.confidence >= 80 ? (
                        <CheckCircle2 className="w-6 h-6 text-medical-success" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-medical-warning" />
                      )}
                    </motion.div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">
                        Detected Condition
                      </p>
                      <motion.p
                        className="text-2xl font-bold text-text-primary"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {result.disease}
                      </motion.p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-text-secondary">
                          Confidence Score
                        </p>
                        <motion.p
                          className="text-sm font-semibold text-text-primary"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          {result.confidence}%
                        </motion.p>
                      </div>
                      <div className="w-full bg-background-secondary rounded-full h-3 overflow-hidden">
                        <motion.div
                          className={`h-3 rounded-full ${
                            result.confidence >= 90
                              ? "bg-medical-success"
                              : result.confidence >= 70
                              ? "bg-medical-warning"
                              : "bg-medical-error"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence}%` }}
                          transition={{
                            duration: 1,
                            delay: 0.3,
                            ease: "easeOut",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Grad-CAM Visualization */}
                <motion.div
                  className="glass-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <h2 className="text-lg font-semibold text-text-primary mb-4">
                    Grad-CAM Heatmap
                  </h2>
                  <motion.img
                    src={result.gradcamImage}
                    alt="Grad-CAM"
                    className="w-full h-64 object-contain rounded-lg bg-background-secondary"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    whileHover={{ scale: 1.02 }}
                  />
                  <p className="text-sm text-text-tertiary mt-2">
                    Highlighted regions indicate areas of interest
                  </p>
                </motion.div>

                {/* Clinical Information */}
                <motion.div
                  className="glass-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-lg font-semibold text-text-primary mb-3">
                    Clinical Information
                  </h2>
                  <motion.p
                    className="text-text-secondary leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {result.clinicalInfo}
                  </motion.p>
                </motion.div>

                {/* AI Prescription Card */}
                <motion.div
                  className="glass-card p-6 border-2 border-purple-200 dark:border-purple-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-text-primary">
                          AI Prescription
                        </h2>
                        <p className="text-xs text-text-tertiary">
                          Powered by Gemini AI
                        </p>
                      </div>
                    </div>
                    {!prescription && (
                      <motion.button
                        onClick={generatePrescription}
                        disabled={prescriptionLoading}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {prescriptionLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Generate Prescription
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {prescription ? (
                      <motion.div
                        key="prescription"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        {/* Disclaimer */}
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-amber-800 dark:text-amber-200">
                              {prescription.disclaimer ||
                                "This AI-generated prescription should be reviewed by a licensed healthcare provider."}
                            </p>
                          </div>
                        </div>

                        {/* Medications */}
                        {prescription.medications &&
                          prescription.medications.length > 0 && (
                            <div>
                              <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
                                <Pill className="w-4 h-4 text-purple-600" />
                                Medications
                              </h3>
                              <div className="space-y-2">
                                {prescription.medications.map((med, idx) => (
                                  <motion.div
                                    key={idx}
                                    className="bg-background-secondary/50 rounded-lg p-3"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                  >
                                    <div className="font-medium text-text-primary">
                                      {med.name}
                                    </div>
                                    <div className="text-sm text-text-secondary flex flex-wrap gap-3 mt-1">
                                      <span>💊 {med.dosage}</span>
                                      <span>⏰ {med.frequency}</span>
                                      <span>📅 {med.duration}</span>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Precautions */}
                        {prescription.precautions &&
                          prescription.precautions.length > 0 && (
                            <div>
                              <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
                                <AlertCircle className="w-4 h-4 text-orange-600" />
                                Precautions
                              </h3>
                              <ul className="space-y-1">
                                {prescription.precautions.map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="text-sm text-text-secondary flex items-start gap-2"
                                  >
                                    <span className="text-orange-500 mt-1">
                                      •
                                    </span>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                        {/* Lifestyle Recommendations */}
                        {prescription.lifestyle_recommendations &&
                          prescription.lifestyle_recommendations.length > 0 && (
                            <div>
                              <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
                                <Heart className="w-4 h-4 text-pink-600" />
                                Lifestyle Recommendations
                              </h3>
                              <ul className="space-y-1">
                                {prescription.lifestyle_recommendations.map(
                                  (item, idx) => (
                                    <li
                                      key={idx}
                                      className="text-sm text-text-secondary flex items-start gap-2"
                                    >
                                      <span className="text-pink-500 mt-1">
                                        •
                                      </span>
                                      {item}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {/* Emergency Signs */}
                        {prescription.emergency_signs &&
                          prescription.emergency_signs.length > 0 && (
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                              <h3 className="flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                                <AlertTriangle className="w-4 h-4" />
                                Emergency Warning Signs
                              </h3>
                              <ul className="space-y-1">
                                {prescription.emergency_signs.map(
                                  (item, idx) => (
                                    <li
                                      key={idx}
                                      className="text-sm text-red-600 dark:text-red-300 flex items-start gap-2"
                                    >
                                      <span className="mt-1">⚠️</span>
                                      {item}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {/* Follow-up */}
                        {prescription.follow_up && (
                          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Calendar className="w-4 h-4 text-blue-600 mt-0.5" />
                            <div>
                              <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                                Follow-up
                              </h3>
                              <p className="text-sm text-blue-600 dark:text-blue-300">
                                {prescription.follow_up}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <span className="text-xs text-text-tertiary flex items-center gap-1">
                            <Stethoscope className="w-3 h-3" />
                            Generated by {prescription.generated_by || "AI"}
                          </span>
                          <motion.button
                            onClick={() => {
                              setPrescription(null);
                              localStorage.removeItem("lastPrescription");
                            }}
                            className="text-xs text-red-500 hover:text-red-600"
                            whileHover={{ scale: 1.05 }}
                          >
                            Clear Prescription
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty-prescription"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-6 text-text-tertiary"
                      >
                        <Pill className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          Click "Generate Prescription" to get AI-powered
                          medical recommendations
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Recommended Doctors Section */}
                <motion.div
                  className="glass-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-medical-primary" />
                      Recommended Specialists
                    </h2>
                    <span className="text-xs text-text-tertiary bg-background-secondary px-2 py-1 rounded-full">
                      {diseaseToSpecialist[result.disease] ||
                        "General Physician"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {getRecommendedDoctors()
                      .slice(0, 3)
                      .map((doctor, idx) => (
                        <motion.div
                          key={doctor.id}
                          className="p-4 bg-background-secondary/50 rounded-xl hover:bg-background-secondary transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + idx * 0.1 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex items-start gap-4">
                            {/* Doctor Avatar */}
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-medical-primary to-medical-secondary flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                              {doctor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-semibold text-text-primary">
                                    {doctor.name}
                                  </h3>
                                  <p className="text-sm text-text-secondary">
                                    {doctor.specialty} • {doctor.experience}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500">
                                  <Star className="w-4 h-4 fill-current" />
                                  <span className="text-sm font-medium text-text-primary">
                                    {doctor.rating}
                                  </span>
                                  <span className="text-xs text-text-tertiary">
                                    ({doctor.reviews})
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 mt-2 text-sm text-text-tertiary">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {doctor.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {doctor.distance}
                                </span>
                              </div>

                              <div className="flex items-center justify-between mt-3">
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    doctor.availability.includes("Today")
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  }`}
                                >
                                  {doctor.availability}
                                </span>
                                <div className="flex items-center gap-2">
                                  <motion.button
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        doctor.phone
                                      );
                                      toast.success("Phone number copied!");
                                    }}
                                    className="p-2 text-text-tertiary hover:text-medical-primary hover:bg-medical-primary/10 rounded-lg transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Phone className="w-4 h-4" />
                                  </motion.button>
                                  <motion.button
                                    onClick={() =>
                                      toast.success(
                                        "Booking feature coming soon!"
                                      )
                                    }
                                    className="px-3 py-1.5 bg-medical-primary text-white text-sm font-medium rounded-lg hover:bg-medical-primary-hover transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Book
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>

                  <p className="text-xs text-text-tertiary text-center mt-4">
                    💡 These are sample recommendations. Real doctor
                    availability may vary.
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  className="flex gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button
                    onClick={handleDownloadPDF}
                    className="flex-1 py-2 bg-medical-secondary text-white font-medium rounded-lg hover:bg-medical-secondary/90 transition-colors flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </motion.button>
                  <motion.button
                    onClick={clearResult}
                    className="flex-1 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <X className="w-4 h-4" />
                    <span>Clear Result</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="glass-card p-12 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <motion.div
                  className="w-16 h-16 bg-background-secondary rounded-full mx-auto mb-4 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <AlertCircle className="w-8 h-8 text-text-tertiary" />
                </motion.div>
                <p className="text-text-secondary">
                  Upload an image and click "Analyze Image" to see results
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
