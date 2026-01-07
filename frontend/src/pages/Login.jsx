import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Stethoscope,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const { login, signup } = useAuth();
  const [activeTab, setActiveTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);

  // Doctor images - using professional stock photo URLs
  const doctorImages = [
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=1000&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&h=1000&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&h=1000&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=800&h=1000&fit=crop&crop=faces",
  ];

  const taglines = [
    { text: "AI-Powered Diagnosis", icon: Activity },
    { text: "Trusted by 10,000+ Doctors", icon: Stethoscope },
    { text: "99.2% Accuracy Rate", icon: HeartPulse },
    { text: "HIPAA Compliant & Secure", icon: ShieldCheck },
  ];

  // Auto-rotate images
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % doctorImages.length);
    }, 4000);
    return () => clearInterval(imageInterval);
  }, []);

  // Auto-rotate taglines
  useEffect(() => {
    const taglineInterval = setInterval(() => {
      setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(taglineInterval);
  }, []);

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(signInData.email, signInData.password);
      toast.success("Welcome back, Doctor!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await signup(signUpData);
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary relative overflow-hidden flex">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-0 -right-4 w-96 h-96 bg-medical-secondary/20 rounded-full filter blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -80, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute -bottom-8 left-20 w-96 h-96 bg-medical-accent/20 rounded-full filter blur-3xl"
        />
      </div>

      {/* Left Side - Doctor Images Carousel */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 relative z-10 flex-col items-center justify-center p-4 xl:p-6"
      >
        {/* Image Carousel */}
        <div className="relative w-full max-w-xs xl:max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={doctorImages[currentImageIndex]}
              alt="Medical Professional"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Image indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {doctorImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex
                    ? "bg-white w-6"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Animated Taglines */}
        <div className="mt-3 h-12 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTaglineIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex items-center gap-2 text-center"
            >
              {(() => {
                const TaglineIcon = taglines[currentTaglineIndex].icon;
                return (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-lg"
                    >
                      <TaglineIcon className="w-4 h-4 text-white" />
                    </motion.div>
                    <div className="text-left">
                      <p className="text-base xl:text-lg font-bold text-text-primary">
                        {taglines[currentTaglineIndex].text}
                      </p>
                      <p className="text-xs text-text-secondary">
                        Revolutionizing Medical Diagnostics
                      </p>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-3 flex items-center gap-3 text-text-tertiary text-xs"
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-medical-success" />
            <span>HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-medical-error" />
            <span>FDA Approved</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Side - Login/Signup Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Card Container */}
          <div className="glass-modal rounded-2xl p-5">
            {/* Logo & Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center mb-3"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary mb-3 shadow-lg"
              >
                <Activity className="w-6 h-6 text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold text-text-primary">
                MediScan AI
              </h1>
              <p className="text-text-secondary text-sm mt-1">
                AI-Powered Chest Disease Detection
              </p>
            </motion.div>

            {/* Tab Switcher */}
            <div className="flex gap-2 mb-4 p-1 glass rounded-xl">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("signin")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 relative ${
                  activeTab === "signin"
                    ? "bg-surface dark:bg-surface text-primary shadow-lg"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                  activeTab === "signup"
                    ? "bg-surface dark:bg-surface text-primary shadow-lg"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                Sign Up
              </motion.button>
            </div>

            {/* Forms */}
            <AnimatePresence mode="wait">
              {activeTab === "signin" ? (
                <motion.form
                  key="signin"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSignIn}
                  className="space-y-3"
                >
                  {/* Email Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative group"
                  >
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary group-focus-within:text-primary transition-colors pointer-events-none" />
                      <input
                        type="email"
                        value={signInData.email}
                        onChange={(e) =>
                          setSignInData({
                            ...signInData,
                            email: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2.5 text-sm glass border border-border rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/30"
                        placeholder="Email address"
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-text-tertiary">
                      Demo:{" "}
                      <span className="font-semibold text-primary">
                        doctor@mediscan.ai
                      </span>{" "}
                      /{" "}
                      <span className="font-semibold text-primary">
                        password123
                      </span>
                    </p>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative group"
                  >
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary group-focus-within:text-primary transition-colors pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={signInData.password}
                        onChange={(e) =>
                          setSignInData({
                            ...signInData,
                            password: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-10 py-2.5 text-sm glass border border-border rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/30"
                        placeholder="Password"
                        required
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-primary transition-colors"
                      >
                        {showPassword ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Remember & Forgot */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-between text-xs"
                  >
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 rounded border-border-medium text-primary focus:ring-2 focus:ring-primary transition-transform group-hover:scale-110"
                      />
                      <span className="text-text-secondary group-hover:text-text-primary transition-colors">
                        Remember me
                      </span>
                    </label>
                    <motion.button
                      type="button"
                      whileHover={{ x: 3 }}
                      className="text-primary hover:text-primary-600 transition-colors font-medium"
                    >
                      Forgot password?
                    </motion.button>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full bg-gradient-primary text-white py-2.5 rounded-lg font-semibold text-sm shadow-medium hover:shadow-large transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSignUp}
                  className="space-y-3"
                >
                  {/* Name Field */}
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                    <input
                      type="text"
                      value={signUpData.name}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, name: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-background-secondary border border-border rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Full name"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                    <input
                      type="email"
                      value={signUpData.email}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, email: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-background-secondary border border-border rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Email address"
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={signUpData.password}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          password: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-background-secondary border border-border rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
                    >
                      {showPassword ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={signUpData.confirmPassword}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-background-secondary border border-border rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Confirm password"
                      required
                    />
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-2 text-xs">
                    <input
                      type="checkbox"
                      required
                      className="w-3.5 h-3.5 mt-0.5 rounded border-border-medium text-primary focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-text-secondary">
                      I agree to the{" "}
                      <button
                        type="button"
                        className="text-primary hover:underline"
                      >
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        className="text-primary hover:underline"
                      >
                        Privacy Policy
                      </button>
                    </span>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full bg-gradient-primary text-white py-2.5 rounded-lg font-semibold text-sm shadow-medium hover:shadow-large transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Footer Message */}
            <div className="mt-4 text-center text-xs text-text-tertiary">
              <p>Protected by enterprise-grade encryption</p>
              <p className="mt-0.5 text-xs">
                HIPAA Compliant • ISO 27001 Certified
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
