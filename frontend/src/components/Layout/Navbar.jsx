import { Bell, Search, Moon, Sun, User, FileText, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { patientsAPI, diagnosisAPI } from "../../services/api";

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    patients: [],
    diagnoses: [],
  });
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchData = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults({ patients: [], diagnoses: [] });
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const [patientsRes, diagnosesRes] = await Promise.all([
          patientsAPI.getAll(),
          diagnosisAPI.getHistory(),
        ]);

        const patients = (patientsRes.patients || [])
          .filter(
            (p) =>
              p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.id?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5);

        const diagnoses = (diagnosesRes || [])
          .filter(
            (d) =>
              d.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              d.patient_name?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5);

        setSearchResults({ patients, diagnoses });
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handlePatientClick = (patientId) => {
    navigate("/patients");
    setShowResults(false);
    setSearchQuery("");
  };

  const handleDiagnosisClick = (diagnosis) => {
    navigate("/diagnosis", { state: { diagnosisId: diagnosis.id } });
    setShowResults(false);
    setSearchQuery("");
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 glass-nav sticky top-0 z-50 flex items-center justify-between px-6 transition-all"
    >
      {/* Search */}
      <div className="flex-1 max-w-2xl" ref={searchRef}>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary transition-colors" />
          <input
            type="text"
            placeholder="Search patients, diagnoses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() =>
              searchQuery.trim().length >= 2 && setShowResults(true)
            }
            className="w-full pl-10 pr-10 py-2 bg-background-secondary border border-border rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showResults &&
              (searchResults.patients.length > 0 ||
                searchResults.diagnoses.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 glass-modal rounded-xl max-h-96 overflow-y-auto z-50"
                >
                  {searchResults.patients.length > 0 && (
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-semibold text-text-tertiary uppercase">
                        Patients ({searchResults.patients.length})
                      </div>
                      {searchResults.patients.map((patient) => (
                        <button
                          key={patient.id}
                          onClick={() => handlePatientClick(patient.id)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-background-secondary transition-colors text-left"
                        >
                          <div className="p-2 bg-medical-primary/10 rounded-lg">
                            <User className="w-4 h-4 text-medical-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-text-primary">
                              {patient.name}
                            </div>
                            <div className="text-xs text-text-tertiary">
                              ID: {patient.id} • Age: {patient.age} •{" "}
                              {patient.gender}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchResults.diagnoses.length > 0 && (
                    <div className="p-2 border-t border-border">
                      <div className="px-3 py-2 text-xs font-semibold text-text-tertiary uppercase">
                        Recent Diagnoses ({searchResults.diagnoses.length})
                      </div>
                      {searchResults.diagnoses.map((diagnosis) => (
                        <button
                          key={diagnosis.id}
                          onClick={() => handleDiagnosisClick(diagnosis)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-background-secondary transition-colors text-left"
                        >
                          <div className="p-2 bg-medical-secondary/10 rounded-lg">
                            <FileText className="w-4 h-4 text-medical-secondary" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-text-primary">
                              {diagnosis.diagnosis}
                            </div>
                            <div className="text-xs text-text-tertiary">
                              Patient: {diagnosis.patient_name} •{" "}
                              {Math.round(diagnosis.confidence)}% confidence
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

            {showResults &&
              !isSearching &&
              searchResults.patients.length === 0 &&
              searchResults.diagnoses.length === 0 &&
              searchQuery.trim().length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 w-full bg-surface dark:bg-surface border border-border rounded-lg shadow-lg p-4 z-50 text-center text-text-tertiary"
                >
                  No results found for "{searchQuery}"
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg hover:bg-background-secondary transition-colors"
          aria-label="Toggle dark mode"
        >
          <motion.div
            initial={false}
            animate={{ rotate: isDark ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-text-secondary" />
            )}
          </motion.div>
        </motion.button>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-lg hover:bg-background-secondary transition-colors"
        >
          <Bell className="w-5 h-5 text-text-secondary" />
          <motion.span
            className="absolute top-1 right-1 w-2 h-2 bg-medical-error rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
      </div>
    </motion.header>
  );
}
