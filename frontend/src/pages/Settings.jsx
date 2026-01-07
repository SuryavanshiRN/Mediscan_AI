import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Bell,
  Palette,
  Shield,
  Database,
  LogOut,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const isDark = theme === "dark";

  const [profileData, setProfileData] = useState({
    name: user?.name || "Dr. Smith",
    email: user?.email || "demo@mediscan.ai",
    role: user?.role || "Radiologist",
    phone: "+1 234 567 8900",
    license: "MD-12345",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    diagnosticAlerts: true,
    weeklyReports: true,
    autoSave: true,
  });

  const [appearanceSettings, setAppearanceSettings] = useState(() => {
    const saved = localStorage.getItem("appearanceSettings");
    return saved
      ? JSON.parse(saved)
      : {
          compactMode: false,
          fontSize: "medium",
          accentColor: "blue",
        };
  });

  // Apply appearance settings on mount
  useEffect(() => {
    const root = document.documentElement;
    const fontSizes = {
      small: "14px",
      medium: "16px",
      large: "18px",
    };
    root.style.fontSize = fontSizes[appearanceSettings.fontSize];

    if (appearanceSettings.compactMode) {
      root.classList.add("compact-mode");
    } else {
      root.classList.remove("compact-mode");
    }

    // Apply accent color by setting CSS variables
    const accentColors = {
      blue: { primary: "37 99 235", hover: "29 78 216", light: "219 234 254" },
      green: {
        primary: "16 185 129",
        hover: "5 150 105",
        light: "209 250 229",
      },
      purple: {
        primary: "139 92 246",
        hover: "124 58 237",
        light: "233 213 255",
      },
      red: { primary: "239 68 68", hover: "220 38 38", light: "254 226 226" },
    };
    const colors = accentColors[appearanceSettings.accentColor];
    root.style.setProperty("--primary-color", colors.primary);
    root.style.setProperty("--primary-hover", colors.hover);
    root.style.setProperty("--primary-light", colors.light);
  }, [appearanceSettings]);

  const handleProfileUpdate = () => {
    toast.success("Profile updated successfully!");
  };

  const handlePreferencesUpdate = () => {
    toast.success("Preferences saved!");
  };

  const handleAppearanceUpdate = () => {
    // Save appearance settings to localStorage
    localStorage.setItem(
      "appearanceSettings",
      JSON.stringify(appearanceSettings)
    );

    // Apply font size
    const root = document.documentElement;
    const fontSizes = {
      small: "14px",
      medium: "16px",
      large: "18px",
    };
    root.style.fontSize = fontSizes[appearanceSettings.fontSize];

    // Apply compact mode
    if (appearanceSettings.compactMode) {
      root.classList.add("compact-mode");
    } else {
      root.classList.remove("compact-mode");
    }

    // Apply accent color by updating CSS variables
    const accentColors = {
      blue: { primary: "37 99 235", hover: "29 78 216", light: "219 234 254" },
      green: {
        primary: "16 185 129",
        hover: "5 150 105",
        light: "209 250 229",
      },
      purple: {
        primary: "139 92 246",
        hover: "124 58 237",
        light: "233 213 255",
      },
      red: { primary: "239 68 68", hover: "220 38 38", light: "254 226 226" },
    };
    const colors = accentColors[appearanceSettings.accentColor];
    root.style.setProperty("--primary-color", colors.primary);
    root.style.setProperty("--primary-hover", colors.hover);
    root.style.setProperty("--primary-light", colors.light);

    toast.success("Appearance settings saved!");
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "appearance", name: "Appearance", icon: Palette },
    { id: "security", name: "Security", icon: Shield },
    { id: "data", name: "Data & Privacy", icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.15 }}
      >
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
        <p className="mt-1 text-text-secondary">
          Manage your account settings and preferences
        </p>
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <motion.div
          className="col-span-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="glass-card p-4 space-y-1">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? "bg-primary-50 text-primary font-medium"
                      : "text-text-secondary hover:bg-background-secondary"
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div whileHover={{ rotate: 10 }}>
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <span>{tab.name}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-medical-primary"
                      layoutId="activeIndicator"
                    />
                  )}
                </motion.button>
              );
            })}

            <div className="pt-4 border-t border-border mt-4">
              <motion.button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-medical-error hover:bg-medical-error/10 transition-all"
                whileHover={{ x: 4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="col-span-9"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.05 }}
        >
          <div className="glass-card p-6">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  className="space-y-6"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <h2 className="text-xl font-semibold text-text-primary">
                    Profile Information
                  </h2>

                  <div className="grid grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl text-text-primary input-focus hover:border-medical-primary/50 transition-all duration-200"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl text-text-primary input-focus hover:border-medical-primary/50 transition-all duration-200"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        value={profileData.role}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            role: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl text-text-primary input-focus hover:border-medical-primary/50 transition-all duration-200"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl text-text-primary input-focus hover:border-medical-primary/50 transition-all duration-200"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Medical License
                      </label>
                      <input
                        type="text"
                        value={profileData.license}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            license: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl text-text-primary input-focus hover:border-medical-primary/50 transition-all duration-200"
                      />
                    </motion.div>
                  </div>

                  <motion.button
                    onClick={handleProfileUpdate}
                    className="btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Save Changes
                  </motion.button>
                </motion.div>
              )}

              {activeTab === "notifications" && (
                <motion.div
                  key="notifications"
                  className="space-y-6"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <h2 className="text-xl font-semibold text-text-primary">
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    {Object.entries({
                      emailNotifications: "Email Notifications",
                      pushNotifications: "Push Notifications",
                      diagnosticAlerts: "Critical Diagnostic Alerts",
                      weeklyReports: "Weekly Summary Reports",
                    }).map(([key, label], index) => (
                      <motion.div
                        key={key}
                        className="flex items-center justify-between p-4 bg-background-secondary/50 rounded-xl hover:bg-background-secondary transition-colors"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="text-text-primary">{label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences[key]}
                            onChange={(e) =>
                              setPreferences({
                                ...preferences,
                                [key]: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-border-medium peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    onClick={handlePreferencesUpdate}
                    className="btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Save Preferences
                  </motion.button>
                </motion.div>
              )}

              {activeTab === "appearance" && (
                <motion.div
                  key="appearance"
                  className="space-y-6"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <h2 className="text-xl font-semibold text-text-primary">
                    Appearance
                  </h2>

                  <div className="space-y-4">
                    <motion.div
                      className="flex items-center justify-between p-4 bg-background-secondary/50 rounded-xl hover:bg-background-secondary transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div>
                        <p className="font-medium text-text-primary">
                          Dark Mode
                        </p>
                        <p className="text-sm text-text-tertiary">
                          Switch between light and dark theme
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isDark}
                          onChange={toggleTheme}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-border-medium peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </motion.div>

                    <motion.div
                      className="p-4 bg-background-secondary/50 rounded-xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <p className="font-medium text-text-primary mb-4">
                        Font Size
                      </p>
                      <div className="flex gap-3">
                        {["small", "medium", "large"].map((size) => (
                          <motion.button
                            key={size}
                            onClick={() =>
                              setAppearanceSettings({
                                ...appearanceSettings,
                                fontSize: size,
                              })
                            }
                            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                              appearanceSettings.fontSize === size
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border text-text-secondary hover:border-primary/50"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {size.charAt(0).toUpperCase() + size.slice(1)}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      className="p-4 bg-background-secondary/50 rounded-xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="font-medium text-text-primary mb-4">
                        Accent Color
                      </p>
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { name: "blue", color: "bg-blue-500" },
                          { name: "green", color: "bg-green-500" },
                          { name: "purple", color: "bg-purple-500" },
                          { name: "red", color: "bg-red-500" },
                        ].map((accent, index) => (
                          <button
                            key={accent.name}
                            onClick={() =>
                              setAppearanceSettings({
                                ...appearanceSettings,
                                accentColor: accent.name,
                              })
                            }
                            className={`h-12 rounded-lg ${
                              accent.color
                            } transition-all ${
                              appearanceSettings.accentColor === accent.name
                                ? "ring-4 ring-offset-2 ring-offset-background-primary ring-current"
                                : "opacity-50 hover:opacity-100"
                            }`}
                          />
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-center justify-between p-4 bg-background-secondary/50 rounded-xl hover:bg-background-secondary transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <div>
                        <p className="font-medium text-text-primary">
                          Compact Mode
                        </p>
                        <p className="text-sm text-text-tertiary">
                          Reduce spacing for more content
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={appearanceSettings.compactMode}
                          onChange={(e) =>
                            setAppearanceSettings({
                              ...appearanceSettings,
                              compactMode: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-border-medium peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </motion.div>

                    <motion.div
                      className="p-4 bg-background-secondary/50 rounded-xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p className="font-medium text-text-primary mb-4">
                        Theme Preview
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          className="p-4 bg-surface border border-border rounded-lg cursor-pointer"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="w-full h-20 bg-gradient-primary rounded mb-2"></div>
                          <p className="text-sm text-text-secondary">
                            Light Theme
                          </p>
                        </motion.div>
                        <motion.div
                          className="p-4 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="w-full h-20 bg-gradient-primary rounded mb-2"></div>
                          <p className="text-sm text-text-tertiary">
                            Dark Theme
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  <motion.button
                    onClick={handleAppearanceUpdate}
                    className="btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Save Appearance Settings
                  </motion.button>
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="security"
                  className="space-y-6"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <h2 className="text-xl font-semibold text-text-primary">
                    Security Settings
                  </h2>

                  <div className="space-y-4">
                    <motion.div
                      className="p-4 bg-background-secondary/50 rounded-xl hover:bg-background-secondary transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h3 className="font-medium text-text-primary mb-2">
                        Change Password
                      </h3>
                      <motion.button
                        className="btn-outline"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Update Password
                      </motion.button>
                    </motion.div>

                    <motion.div
                      className="p-4 bg-background-secondary/50 rounded-xl hover:bg-background-secondary transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <h3 className="font-medium text-text-primary mb-2">
                        Two-Factor Authentication
                      </h3>
                      <p className="text-sm text-text-tertiary mb-4">
                        Add an extra layer of security to your account
                      </p>
                      <motion.button
                        className="btn-outline"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Enable 2FA
                      </motion.button>
                    </motion.div>

                    <motion.div
                      className="p-4 bg-background-secondary/50 rounded-xl hover:bg-background-secondary transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="font-medium text-text-primary mb-2">
                        Active Sessions
                      </h3>
                      <p className="text-sm text-text-tertiary mb-4">
                        Manage your active login sessions
                      </p>
                      <motion.button
                        className="btn-outline"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        View Sessions
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {activeTab === "data" && (
                <motion.div
                  key="data"
                  className="space-y-6"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <h2 className="text-xl font-semibold text-text-primary">
                    Data & Privacy
                  </h2>

                  <div className="space-y-4">
                    <motion.div
                      className="p-4 bg-background-secondary/50 rounded-xl hover:bg-background-secondary transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h3 className="font-medium text-text-primary mb-2">
                        Data Export
                      </h3>
                      <p className="text-sm text-text-tertiary mb-4">
                        Download all your data
                      </p>
                      <motion.button
                        className="btn-outline"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Export Data
                      </motion.button>
                    </motion.div>

                    <motion.div
                      className="p-4 bg-background-secondary/50 rounded-xl hover:bg-background-secondary transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <h3 className="font-medium text-text-primary mb-2">
                        Privacy Settings
                      </h3>
                      <p className="text-sm text-text-tertiary mb-4">
                        Control who can see your information
                      </p>
                      <motion.button
                        className="btn-outline"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Manage Privacy
                      </motion.button>
                    </motion.div>

                    <motion.div
                      className="p-4 bg-medical-error/10 border border-medical-error/20 rounded-xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <h3 className="font-medium text-medical-error mb-2">
                        Delete Account
                      </h3>
                      <p className="text-sm text-text-tertiary mb-4">
                        Permanently delete your account and all data
                      </p>
                      <motion.button
                        className="px-4 py-2 bg-medical-error text-white rounded-xl hover:bg-medical-error/90 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Delete Account
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
