import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  GraduationCap,
  Briefcase,
  Award,
  Phone,
  User,
  Sun,
  Moon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// مكوّن زر تبديل Dark Mode بتصميم محسّن
const DarkModeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <motion.button
      onClick={toggleDarkMode}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-flex items-center w-20 h-10 overflow-hidden bg-gradient-to-r from-secondary to-primary dark:from-gray-700 dark:to-gray-900 rounded-full p-1 cursor-pointer focus:outline-none transition-all duration-300"
    >
      <motion.div
        // تقليل قيمة الإزاحة إلى 36px بدلاً من 40px لضمان بقاء المقبض داخل الحاوية
        animate={{ x: darkMode ? -36 : 0 }}
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center"
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-blue-700" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // قراءة حالة الـ Dark Mode من localStorage أو تعيين false بشكل افتراضي
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  // تغيير خلفية النافبار عند التمرير
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // تفعيل Dark Mode على عنصر الـ <html> وتخزين القيمة في localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const menuItems = [
    { href: "#about", icon: User, text: "من أنا" },
    { href: "#skills", icon: GraduationCap, text: "المهارات والشهادات" },
    { href: "#services", icon: Briefcase, text: "خدماتي" },
    { href: "#portfolio", icon: Award, text: "أعمالي" },
    { href: "#contact", icon: Phone, text: "تواصل معي" },
  ];

  const handleMobileClick = (hash) => (e) => {
    e.preventDefault();
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setTimeout(() => setIsOpen(false), 300);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      transition={{ duration: 0.5 }}
      className={`fixed w-full top-0 z-50 ${
        isScrolled
          ? "bg-white dark:bg-gray-900 shadow-lg backdrop-blur-sm bg-opacity-90"
          : "bg-white dark:bg-gray-900 bg-opacity-80"
      } transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* الشعار */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.img
              src="https://i.pinimg.com/736x/20/88/7f/20887f916437267a4e5e5927affc3570.jpg"
              alt="Logo"
              className="h-12 w-12 rounded-full border-2 border-primary p-[1px] transition-all duration-300 group-hover:border-secondary group-hover:scale-105"
              whileHover={{ rotate: 10 }}
              loading="lazy"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              أسناني
            </span>
          </Link>

          {/* قائمة سطح المكتب */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="relative inline-block"
                initial="rest"
                whileHover="hover"
                animate="rest"
                transition={{ delay: index * 0.1 }}
                variants={{
                  rest: { scale: 1 },
                  hover: { scale: 1.05 },
                }}
              >
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 hover:bg-secondary/10 dark:hover:bg-secondary-dark/10">
                  <item.icon className="w-5 h-5 text-primary dark:text-primary transition-colors group-hover:text-secondary" />
                  <span className="text-gray-900 dark:text-gray-100 group-hover:text-secondary font-medium text-sm">
                    {item.text}
                  </span>
                </div>
                <motion.span
                  className="block h-[2px] bg-secondary dark:bg-secondary mt-1"
                  variants={{
                    rest: { width: 0 },
                    hover: { width: "100%" },
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
            {/* زر تبديل الوضع الداكن */}
            <DarkModeToggle
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          </div>

          {/* قائمة الجوال */}
          <div className="md:hidden flex items-center gap-2">
            <DarkModeToggle
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-900 dark:text-gray-100 hover:text-secondary rounded-lg transition-colors focus:outline-none"
            >
              {isOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* القائمة المتنقلة للجوال */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900/95 backdrop-blur-sm border-t border-secondary/10"
          >
            <div className="px-4 py-4 space-y-3">
              {menuItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/5 dark:bg-secondary-dark/5 hover:bg-secondary/10 dark:hover:bg-secondary-dark/10 transition-colors"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={handleMobileClick(item.href)}
                >
                  <item.icon className="w-5 h-5 text-primary dark:text-primary" />
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {item.text}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
