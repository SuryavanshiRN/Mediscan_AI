import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import Diagnosis from "./pages/Diagnosis";
import Patients from "./pages/Patients";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";
import Login from "./pages/Login";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              className: "dark:bg-surface-dark dark:text-text-dark-primary",
              style: {
                borderRadius: "12px",
                backdropFilter: "blur(16px)",
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/diagnosis" element={<Diagnosis />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/subscription" element={<Subscription />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
