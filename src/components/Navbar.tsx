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

/* ================= Dark Mode Toggle ================= */
const DarkModeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <motion.button
      onClick={toggleDarkMode}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-flex items-center w-20 h-10 p-1 rounded-full
                 bg-gradient-to-r from-secondary to-primary
                 dark:from-gray-700 dark:to-gray-900"
    >
      <motion.div
        animate={{ x: darkMode ? -36 : 0 }}
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow
                   flex items-center justify-center"
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

/* ================= Navbar ================= */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  /* Scroll Effect */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Dark Mode */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const menuItems = [
    { href: "#about", icon: User, text: "من أنا" },
    { href: "#skills", icon: GraduationCap, text: "المهارات والشهادات" },
    { href: "#services", icon: Briefcase, text: "خدماتي" },
    { href: "#portfolio", icon: Award, text: "أعمالي" },
    { href: "#contact", icon: Phone, text: "تواصل معي" },
  ];

  const handleMobileClick = (hash) => (e) => {
    e.preventDefault();
    const el = document.querySelector(hash);
    el?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => setIsOpen(false), 200);
  };

  /* Animations */
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const menuVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const linkVariants = {
    hidden: { x: 30, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  return (
    <>
      {/* ================= Desktop Navbar ================= */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 w-full z-50 transition-all
          ${isScrolled
            ? "bg-white/90 dark:bg-gray-900/90 shadow backdrop-blur"
            : "bg-white dark:bg-gray-900"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://i.pinimg.com/736x/20/88/7f/20887f916437267a4e5e5927affc3570.jpg"
              className="w-12 h-12 rounded-full border-2 border-primary"
              alt="logo"
            />
            <span className="text-2xl font-bold bg-gradient-to-r
                             from-secondary to-primary text-transparent bg-clip-text">
              أسناني
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="nav-link flex items-center gap-2 px-4 py-2 rounded-full
                           hover:bg-secondary/10 transition"
              >
                <item.icon className="w-5 h-5 text-primary" />
                <span className="font-medium">{item.text}</span>
              </a>
            ))}
            <DarkModeToggle
              darkMode={darkMode}
              toggleDarkMode={() => setDarkMode((p) => !p)}
            />
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-3">
            <DarkModeToggle
              darkMode={darkMode}
              toggleDarkMode={() => setDarkMode((p) => !p)}
            />
            <button onClick={() => setIsOpen(true)}>
              <Menu size={28} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ================= Mobile Drawer ================= */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              className="fixed top-0 right-0 w-3/4 h-full z-50 md:hidden
                         bg-white dark:bg-gray-900 shadow-2xl
                         rounded-l-2xl p-6 flex flex-col"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="self-end mb-8"
              >
                <X size={26} />
              </button>

              {/* Links */}
              <div className="flex flex-col gap-6">
                {menuItems.map((item) => (
                  <motion.a
                    key={item.href}
                    variants={linkVariants}
                    href={item.href}
                    onClick={handleMobileClick(item.href)}
                    className="flex items-center gap-4 text-lg font-semibold"
                  >
                    <item.icon className="w-5 h-5 text-primary" />
                    {item.text}
                  </motion.a>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
