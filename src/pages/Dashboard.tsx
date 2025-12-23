// src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  MessageSquare,
  Code,
  Headset,
  Menu,
  X,
  User,
  Sun,
  Moon,
  Palette,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

// مكونات الإدارة
import CertificatesManager from "../components/dashboard/CertificatesManager";
import ServicesManager from "../components/dashboard/ServicesManager";
import MessagesManager from "../components/dashboard/MessagesManager";
import PortfolioManager from "../components/dashboard/PortfolioManager";
import SupportManager from "../components/dashboard/SupportManager";
import AboutManager from "../components/dashboard/AboutManager";
import ThemeManager from "../components/dashboard/ThemeManager";
import SkillsManager from "../components/Dashboard/SkillsManager";

const applyThemeColors = async () => {
  try {
    const { data } = await supabase.from("site_theme").select("*").single();
    if (data) {
      document.documentElement.style.setProperty(
        "--primary-color",
        data.primary_color
      );
      document.documentElement.style.setProperty(
        "--secondary-color",
        data.secondary_color
      );
      document.documentElement.style.setProperty(
        "--text-color",
        data.text_color
      );
    }
  } catch (error) {
    console.error("Error applying theme colors:", error);
  }
};

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  };

  return (
    <motion.button
      onClick={toggleDarkMode}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-flex items-center w-20 h-10 overflow-hidden bg-gradient-to-r from-secondary to-primary dark:from-gray-700 dark:to-gray-900 rounded-full p-1 cursor-pointer focus:outline-none transition-all duration-300"
      aria-label="تبديل الوضع الداكن"
    >
      <motion.div
        animate={{ x: darkMode ? -36 : 0 }}
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center relative"
      >
        <AnimatePresence mode="wait">
          {darkMode ? (
            <motion.div
              key="sun"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="w-5 h-5 text-yellow-500" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="w-5 h-5 text-blue-700" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
};

export default function Dashboard() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated, userRole, logout } = useAuth();

  if (!isAuthenticated || userRole !== "admin") {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    document.title = "لوحة التحكم";
    applyThemeColors();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuItems = [
    { path: "/dashboard/theme", icon: Palette, text: "إدارة الألوان" },
    { path: "/dashboard/about", icon: User, text: "من أنا" },
    { path: "/dashboard/skills", icon: Code, text: " المهارات " },
    { path: "/dashboard/certificates", icon: GraduationCap, text: "الشهادات   " },
    { path: "/dashboard/services", icon: Briefcase, text: "الخدمات" },
    { path: "/dashboard/portfolio", icon: Code, text: "الأعمال" },
    { path: "/dashboard/messages", icon: MessageSquare, text: "الرسائل" },
    { path: "/dashboard/support", icon: Headset, text: "الدعم الفني" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-900"
      dir="rtl"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-blue-50 transition-colors"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-primary" />
        ) : (
          <Menu className="w-6 h-6 text-primary" />
        )}
      </button>

      <div className="flex">
        <AnimatePresence>
          {(isOpen || !isMobile) && (
            <motion.div
              initial={{ x: isMobile ? -300 : 0 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`w-72 min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl fixed md:relative z-40 ${
                isMobile ? "inset-0" : ""
              }`}
            >
              <div className="p-6 flex justify-between items-center border-b border-blue-100 dark:border-gray-600">
                <div className="flex items-center gap-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 text-2xl font-bold text-secondary"
                  >
                    <LayoutDashboard className="w-8 h-8" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                      لوحة التحكم
                    </span>
                  </Link>
                </div>
                {isMobile && (
                  <X
                    className="w-6 h-6 text-gray-500 dark:text-gray-300 hover:text-primary cursor-pointer transition-colors"
                    onClick={() => setIsOpen(false)}
                  />
                )}
              </div>

              <nav className="mt-6 px-3">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-5 py-3.5 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-primary rounded-xl transition-all group border border-transparent hover:border-primary ${
                        location.pathname === item.path
                          ? "bg-white dark:bg-gray-900 text-primary shadow-md border-blue-100"
                          : ""
                      }`}
                    >
                      <item.icon
                        className={`w-5 h-5 ${
                          location.pathname === item.path
                            ? "text-primary"
                            : "text-gray-400 group-hover:text-primary"
                        }`}
                      />
                      <span className="font-medium text-sm">{item.text}</span>
                    </Link>
                  </motion.div>
                ))}
                <div className="mt-4 pr-4">
                  <DarkModeToggle />
                </div>
              </nav>

              <div className="absolute bottom-0 w-full p-6 border-t border-blue-100 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-gray-800 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      المشرف
                    </p>
                    <button
                      onClick={handleLogout}
                      className="text-xs text-primary hover:underline"
                    >
                      تسجيل الخروج
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 transition-all duration-300 p-4 md:p-8">
          {isOpen && isMobile && (
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
              onClick={() => setIsOpen(false)}
            />
          )}

          <Routes>
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto mt-16"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-primary dark:border-gray-600">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4 text-center leading-[1.5]">
                      مرحباً بك في لوحة التحكم
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg text-center mb-8">
                      اختر من القائمة الجانبية لإدارة محتويات موقعك
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {menuItems.slice(0, 3).map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="bg-blue-50 dark:bg-gray-900 hover:bg-blue-100 dark:hover:bg-gray-700 p-4 rounded-xl text-center transition-colors"
                        >
                          <item.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {item.text}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              }
            />
            <Route path="/theme" element={<ThemeManager />} />
            <Route path="/about" element={<AboutManager />} />
            <Route path="/skills" element={<SkillsManager />} />
            <Route path="/certificates" element={<CertificatesManager />} />
            <Route path="/services" element={<ServicesManager />} />
            <Route path="/portfolio" element={<PortfolioManager />} />
            <Route path="/messages" element={<MessagesManager />} />
            <Route path="/support" element={<SupportManager />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
