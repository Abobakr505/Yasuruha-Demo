import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Phone,
  Code,
  ExternalLink,
  User,
  Clock,
  Stethoscope,
  ArrowUp,
  
} from "lucide-react";
import { cardio } from "ldrs";
cardio.register(); // Default values shown

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";
import { supabase } from "../lib/supabase";
import img from '../images/home.webp'
// دالة لجلب إعدادات الألوان من Supabase وتطبيقها على متغيرات CSS
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

// مكون زر التمرير إلى الأعلى
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 border-4 border-white dark:border-gray-800 bg-primary text-white p-3 rounded-full shadow-lg transition-colors duration-300 z-50"
          aria-label="التمرير إلى الأعلى"
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default function Home() {
  useEffect(() => {
    applyThemeColors();
  }, []);

  const [certificates, setCertificates] = React.useState([]);
  const [services, setServices] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [aboutData, setAboutData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: certs },
          { data: servs },
          { data: projs },
          { data: about },
        ] = await Promise.all([
          supabase
            .from("certificates")
            .select("*")
            .order("date", { ascending: false }),
          supabase
            .from("services")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase.from("about").select("*").single(),
        ]);

        setCertificates(certs || []);
        setServices(servs || []);
        setProjects(projs || []);
        setAboutData(about || null);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <l-cardio
          size="125"
          stroke="4"
          speed="0.5"
          color="var(--primary-color)"
        ></l-cardio>
      </div>
    );

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 text-right dark:text-gray-100"
      dir="rtl"
    >
      <Navbar />

      {/* قسم الـ Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-secondary to-primary text-white py-32 relative overflow-hidden dark:from-secondary dark:to-primary"
      >
        {/* دوائر خلفية متحركة */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full animate-pulse" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-primary/20 rounded-full animate-pulse delay-300" />

        <div className="container mx-auto px-4 relative flex flex-col md:flex-row items-center justify-between pt-12">
          {/* النصوص والعناصر */}
          <div className="md:w-1/2 mb-12 md:mb-0">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-4xl mb-6 leading-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white/35 to-white py-8 font-bold">
                مرحباً بكم معكم د / احمد محمد
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-secondary/80"
            >
              دكتور متخصص في علاج الأسنان
            </motion.p>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl mb-8 text-secondary/60 max-w-2xl"
            >
              {aboutData?.experience_text}
            </motion.p>

            <motion.a
              href="#contact"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="inline-block font-bold bg-white text-secondary  px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 hover:bg-secondary/10 "
            >
              تواصل معي الآن
            </motion.a>
          </div>

          {/* الصورة الشخصية */}
          <motion.div
            animate={{
              x: [0, 20, 0, -20, 0],
              y: [0, 10, 0, -10, 0],
            }}
            transition={{
              duration: 10,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            className="md:w-1/2 flex justify-center relative"
          >
            <div className="relative rounded-full w-72 h-72 overflow-hidden border-4 border-white dark:border-gray-700 shadow-2xl">
              <img
                src={img}
                alt="الصورة الشخصية"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* قسم من نحن */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -150px 0px" }}
        className="py-20 bg-white dark:bg-gray-900"
        id="about"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-gradient-to-br from-primary to-white rounded-xl">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold dark:text-gray-100 border-r-4 border-primary pr-4">
              من أنا ؟
            </h2>
          </div>

          {aboutData && (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                variants={itemVariants}
                className="relative h-96 rounded-2xl overflow-hidden shadow-xl border-8 border-white dark:border-gray-700 transform hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={aboutData.image_url}
                  alt="صورة المطور"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-6">
                <h3 className="text-2xl  bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary p-1 font-bold">
                  {aboutData.name} - {aboutData.title}
                </h3>

                <p className="text-gray-900 dark:text-gray-300 leading-relaxed text-lg border-r-4 border-secondary/20 dark:border-primary pr-4">
                  {aboutData.description}
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-secondary to-white/20 p-5 rounded-xl shadow-sm border border-secondary">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-7 h-7 text-primary dark:text-secondary" />
                      <span className="text-lg text-gray-900 dark:text-gray-100 font-bold">
                        {aboutData.projects_count}+ مشروع
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm">
                      منجز بنجاح
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-primary to-white/20 p-5 rounded-xl shadow-sm border border-primary">
                    <div className="flex items-center gap-3">
                      <Clock className="w-7 h-7 text-primary dark:text-secondary" />
                      <span className="text-lg text-gray-900 dark:text-gray-100 font-bold">
                        {aboutData.hours_experience}+ سنه
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm">
                      العمل وخبرة
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </motion.section>

      {/* قسم الشهادات والمهارات */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-br from-secondary/10 to-primary/10 dark:from-secondary/20 dark:to-primary/20"
        id="skills"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-gradient-to-br from-primary to-white rounded-xl shadow-lg">
              <GraduationCap className="w-8 h-8 text-primary transform hover:rotate-12 transition-transform" />
            </div>
            <h2 className="text-3xl font-bold dark:text-gray-100 border-r-4 border-primary pr-4">
              الشهادات والمهارات
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <motion.div
                key={cert.id}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
              >
                <div className="relative h-48">
                  <img
                    src={cert.image_url}
                    alt={cert.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl mb-2 font-bold text-primary dark:text-white">
                    {cert.title}
                  </h3>
                  <p className="text-secondary font-bold dark:text-secondary text-sm">
                    {cert.issuer}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="bg-secondary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {cert.category}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      {new Date(cert.date).toLocaleDateString("ar")}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* قسم الخدمات */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        className="py-24 bg-gradient-to-b from-secondary/10 to-white dark:from-secondary/20 dark:to-gray-800"
        id="services"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-3 mb-16">
            <div className="p-3 bg-gradient-to-br from-primary to-white rounded-xl shadow-inner">
              <Briefcase className="w-8 h-8 text-primary transform hover:rotate-12 transition-transform" />
            </div>
            <h2 className="text-4xl font-bold dark:text-gray-100 border-r-4 border-primary pr-5 tracking-tight">
              خدماتي المميزة
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-primary group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="text-primary dark:text-secondary mb-6 flex justify-center">
                    {service.icon.startsWith("<svg") ? (
                      <div
                        className="w-16 h-16 p-4 bg-gradient-to-br from-secondary to-white/20 rounded-2xl shadow-sm group-hover:bg-secondary/20 transition-colors flex justify-center items-center "
                        dangerouslySetInnerHTML={{ __html: service.icon }}
                      />
                    ) : (
                      <img
                        src={service.icon}
                        alt={service.title}
                        className="w-16 h-16 p-4 bg-gradient-to-br from-secondary to-white rounded-2xl shadow-sm object-contain "
                        loading="lazy"
                      />
                    )}
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 text-center">
                    {service.title}
                  </h3>

                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed text-center mb-6">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* قسم المشاريع */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        className="py-24 bg-gradient-to-b from-white to-secondary/10 dark:from-gray-800 dark:to-secondary/10"
        id="portfolio"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-3 mb-16">
            <div className="p-3 bg-gradient-to-br from-primary to-white rounded-xl shadow-inner">
              <Stethoscope className="w-8 h-8 text-primary transform hover:rotate-12 transition-transform" />
            </div>
            <h2 className="text-4xl font-bold dark:text-gray-100 border-r-4 border-primary pr-5 tracking-tight">
              أعمالي
            </h2>
          </div>

          {projects.length === 0 ? (
            <div className="text-center text-gray-700 dark:text-gray-300 text-xl py-12">
              لا توجد مشاريع متاحة حالياً
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                  </div>

                  <div className="p-8 relative">
                    <h3 className="text-2xl font-bold mb-3 text-white bg-primary px-4 py-2 rounded-lg inline-block -mt-12 shadow-lg">
                      {project.title}
                    </h3>

                    <p className="text-gray-900 dark:text-gray-200 text-lg leading-relaxed mb-4 min-h-[80px]">
                      {project.description}
                    </p>

                    <div className="flex justify-end">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex  items-center gap-2 px-6 py-2 bg-primary text-white rounded-full hover:bg-secondary transition-colors duration-300 shadow-md hover:shadow-lg"
                      >
                        <ExternalLink className="w-5 h-5" />
                        <span className="font-bold">زيارة المشروع</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* قسم تواصل معنا */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-br from-secondary/10 to-white dark:from-gray-900 dark:to-gray-900"
        id="contact"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-gradient-to-br from-primary to-white rounded-xl">
              <Phone className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold dark:text-gray-100 border-r-4 border-primary pr-4">
              تواصل معنا
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </motion.section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
