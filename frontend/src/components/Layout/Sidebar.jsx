import { Fragment, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  LayoutDashboard,
  Stethoscope,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  Crown,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "New Diagnosis", href: "/diagnosis", icon: Stethoscope },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Subscription", href: "/subscription", icon: Crown, highlight: true },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div
      className={`flex flex-col h-screen glass-sidebar transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-medium">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">
              MediScan AI
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-background-secondary transition-colors"
        >
          {collapsed ? (
            <Menu className="w-5 h-5 text-text-secondary" />
          ) : (
            <X className="w-5 h-5 text-text-secondary" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item, index) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1, delay: index * 0.02 }}
            >
              <Link
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  item.highlight
                    ? "bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20 text-purple-600 dark:text-purple-400"
                    : isActive
                    ? "bg-primary/10 text-primary font-medium shadow-lg"
                    : "text-text-secondary hover:bg-primary/5 hover:text-primary"
                }`}
              >
                {isActive && !item.highlight && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                  />
                )}
                {item.highlight && (
                  <motion.div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-r-full" />
                )}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      item.highlight
                        ? "text-purple-500"
                        : isActive
                        ? "text-primary"
                        : "text-text-tertiary group-hover:text-primary"
                    }`}
                  />
                </motion.div>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group-hover:translate-x-1 transition-transform flex items-center gap-2"
                  >
                    {item.name}
                    {item.highlight && (
                      <span className="text-[10px] font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-1.5 py-0.5 rounded-full">
                        PRO
                      </span>
                    )}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-t border-border relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-background-secondary cursor-pointer transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-medium">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0) || "D"}R
              </span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-text-primary">
                {user?.name || "Dr. Smith"}
              </p>
              <p className="text-xs text-text-tertiary">
                {user?.role || "Radiologist"}
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-text-tertiary transition-transform ${
                showUserMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute bottom-full left-4 right-4 mb-2 bg-surface dark:bg-surface border border-border rounded-xl shadow-large overflow-hidden"
              >
                <Link
                  to="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-background-secondary transition-colors"
                >
                  <User className="w-4 h-4 text-text-tertiary" />
                  <span className="text-sm text-text-primary">
                    Profile & Settings
                  </span>
                </Link>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-medical-error/10 transition-colors text-medical-error"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
