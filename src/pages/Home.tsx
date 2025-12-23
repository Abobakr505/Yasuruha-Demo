import React, { useEffect, useState } from "react";
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
cardio.register();
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";
import { supabase } from "../lib/supabase";
import img from '../../public/assets/images/home.webp';

// دالة لجلب إعدادات الألوان من Supabase وتطبيقها على متغيرات CSS
const applyThemeColors = async () => {
  try {
    const { data } = await supabase.from("site_theme").select("*").single();
    if (data) {
      document.documentElement.style.setProperty("--primary-color", data.primary_color);
      document.documentElement.style.setProperty("--secondary-color", data.secondary_color);
      document.documentElement.style.setProperty("--text-color", data.text_color);
    }
  } catch (error) {
    console.error("Error applying theme colors:", error);
  }
};

// مكون زر التمرير إلى الأعلى مع أنميشن أكثر سلاسة وتصميم أنيق
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => {
    setIsVisible(window.pageYOffset > 300);
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 bg-primary text-white p-4 rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 z-50 border-2 border-white dark:border-gray-800"
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

  const [certificates, setCertificates] = useState([]);
  const [skills, setSkills] = useState([]);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: certs },
          { data: sks },
          { data: servs },
          { data: projs },
          { data: about },
        ] = await Promise.all([
          supabase.from("certificates").select("*").order("date", { ascending: false }),
          supabase.from("skills").select("*").order("created_at", { ascending: false }),
          supabase.from("services").select("*").order("created_at", { ascending: false }),
          supabase.from("projects").select("*").order("created_at", { ascending: false }),
          supabase.from("about").select("*").single(),
        ]);
        setCertificates(certs || []);
        setSkills(sks || []);
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
      transition: { staggerChildren: 0.2, duration: 1 },
    },
  };

  const itemVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 80, damping: 20 } },
  };

  const heroImageVariants = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 2, -2, 0],
      transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
    },
  };

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center flex-col gap-4 text-secondary bg-gray-50 dark:bg-gray-900 ">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin "></div>
       ... جاري التحميل 
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-right dark:text-gray-100" dir="rtl">
      <Navbar />
      {/* قسم الـ Hero مع أنميشن parallax وتأثيرات حديثة أكثر */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="relative overflow-hidden py-40 bg-gradient-to-br from-primary to-secondary text-white"
      >
        {/* خلفية متحركة مع تأثيرات بلورية وأنميشن */}
        <motion.div
          className="absolute inset-0 opacity-30 backdrop-blur-md"
          animate={{
            background: [
              "radial-gradient(circle at 30% 40%, var(--primary-color) 0%, transparent 60%)",
              "radial-gradient(circle at 70% 60%, var(--secondary-color) 0%, transparent 60%)",
              "radial-gradient(circle at 50% 50%, var(--primary-color) 0%, transparent 60%)",
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between relative z-10">
          <motion.div
            className="md:w-1/2 mb-16 md:mb-0"
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 drop-shadow-lg">
              مرحباً بكم معكم د / احمد محمد
            </h1>
            <p className="text-2xl md:text-3xl mb-6 text-white/90 font-semibold">دكتور متخصص في علاج الأسنان</p>
            <p className="text-lg md:text-xl mb-10 text-white/70 max-w-2xl leading-relaxed">{aboutData?.experience_text}</p>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.1, boxShadow: "0px 0px 20px rgba(255,255,255,0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-white text-primary font-bold px-10 py-5 rounded-full shadow-2xl hover:bg-white/90 transition-all duration-300 text-lg"
            >
              تواصل معي الآن
            </motion.a>
          </motion.div>
          <motion.div
            variants={heroImageVariants}
            animate="animate"
            className="md:w-1/2 flex justify-center"
          >
            <div className="relative w-80 h-80 md:w-112 md:h-112 rounded-full overflow-hidden border-8 border-white/40 shadow-2xl backdrop-blur-lg transform hover:scale-105 transition-transform duration-500">
              <img src={img} alt="الصورة الشخصية" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* قسم من نحن - متجاوب بالكامل */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        className="py-16 md:py-24 bg-white dark:bg-gray-900"
        id="about"
      >
        <div className="container mx-auto px-4 md:px-6">

          <motion.div
            className="flex items-center gap-4 mb-16 text-left" // محاذاة إلى اليسار
            variants={itemVariants}
          >
            <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-xl">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold dark:text-gray-100 border-r-4 border-l-4 border-primary pl-5 pr-5 rounded-lg">من أنا ؟</h2> {/* border-l لليسار */}
          </motion.div>

          {aboutData && (
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">

              {/* الصورة */}
              <motion.div
                variants={itemVariants}
                className="relative h-72 sm:h-80 md:h-[28rem] rounded-3xl 
                           overflow-hidden shadow-2xl border-4 border-primary"
                whileHover={{ rotate: 2 }}
              >
                <img
                  src={aboutData.image_url}
                  alt="صورة المطور"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              </motion.div>

              {/* المحتوى */}
              <motion.div
                variants={itemVariants}
                className="space-y-6 md:space-y-8 
                           text-center md:text-left"
              >
                <h3 className="text-2xl md:text-4xl font-bold 
                               bg-clip-text text-transparent 
                               bg-gradient-to-r from-primary to-secondary">
                  {aboutData.name} – {aboutData.title}
                </h3>

                <p className="text-gray-800 dark:text-gray-300 
                              leading-relaxed text-base md:text-xl 
                              md:border-l-4 md:border-secondary md:pl-5">
                  {aboutData.description}
                </p>

                {/* الإحصائيات */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">

                  <motion.div
                    className="bg-gradient-to-br from-primary to-secondary 
                               p-6 md:p-8 rounded-2xl shadow-xl"
                    whileHover={{ y: -8 }}
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-7 h-7 text-white" />
                      <span className="text-lg md:text-xl font-bold text-white">
                        {aboutData.projects_count}+ مشروع
                      </span>
                    </div>
                    <p className="text-white/80 mt-2 text-sm md:text-base">
                      منجز بنجاح
                    </p>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-secondary to-primary 
                               p-6 md:p-8 rounded-2xl shadow-xl"
                    whileHover={{ y: -8 }}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-7 h-7 text-white" />
                      <span className="text-lg md:text-xl font-bold text-white">
                        {aboutData.hours_experience}+ سنة
                      </span>
                    </div>
                    <p className="text-white/80 mt-2 text-sm md:text-base">
                      خبرة وعمل
                    </p>
                  </motion.div>

                </div>
              </motion.div>
            </div>
          )}
        </div>
      </motion.section>
      {/* قسم المهارات */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-200px" }}
        className="py-24 bg-gradient-to-br from-secondary/10 to-primary/10 dark:from-secondary/20 dark:to-primary/20"
        id="skills"
      >
        <div className="container mx-auto px-6">
          <motion.div
            className="flex items-center gap-4 mb-16 text-left"
            variants={itemVariants}
          >
            <div className="p-4 bg-gradient-to-br from-secondary to-primary rounded-2xl shadow-xl">
              <Code className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold dark:text-gray-100 border-r-4 border-l-4 border-secondary pl-5 pr-5 rounded-lg">المهارات</h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {skills.map((skill) => (
              <motion.div
                key={skill.id}
                variants={itemVariants}
                whileHover={{ scale: 1.1, rotate: 3, boxShadow: "0px 10px 30px rgba(0,0,0,0.1)" }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-secondary flex flex-col items-center p-6"
              >
                <div className="relative w-24 h-24 mb-4 overflow-hidden rounded-full border-2 border-secondary">
                  <motion.img
                    src={skill.image_url}
                    alt={skill.title}
                    className="w-full h-full object-contain"
                    initial={{ scale: 1.1 }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <h3 className="text-xl font-bold text-secondary text-center">{skill.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      {/* قسم الشهادات */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-200px" }}
        className="py-24 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20"
        id="certificates"
      >
        <div className="container mx-auto px-6">
          <motion.div
            className="flex items-center gap-4 mb-16 text-left"
            variants={itemVariants}
          >
            <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-xl">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold dark:text-gray-100 border-r-4 border-l-4 border-primary pl-5 pr-5 rounded-lg">الشهادات</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert) => (
              <motion.div
                key={cert.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05, rotate: 3, boxShadow: "0px 10px 30px rgba(0,0,0,0.1)" }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-primary"
              >
                <div className="relative h-56 overflow-hidden">
                  <motion.img
                    src={cert.image_url}
                    alt={cert.title}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <div className="p-8 text-left">
                  <h3 className="text-2xl font-bold mb-3 text-primary">{cert.title}</h3>
                  <p className="text-secondary text-base font-medium mb-4">{cert.issuer}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="bg-primary/20 text-primary px-4 py-2 rounded-full font-semibold">{cert.category}</span>
                    <span className="text-gray-600 dark:text-gray-400">{new Date(cert.date).toLocaleDateString("ar")}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>



      {/* قسم الخدمات مع أنميشن أفضل وتصميم عصري */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        className="py-28 bg-gradient-to-b from-white to-primary/10 dark:from-gray-900 dark:to-primary/20"
        id="services"
      >
        <div className="container mx-auto px-6">
          <motion.div
            className="flex items-center gap-4 mb-16 text-left"
            variants={itemVariants}
          >
            <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-xl">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold dark:text-gray-100 border-r-4 border-l-4 border-primary pl-5 pr-5 rounded-lg">خدماتي </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={{ scale: 1.08, y: -15, boxShadow: "0px 15px 40px rgba(0,0,0,0.15)" }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center border border-primary overflow-hidden"
              >
                <motion.div
                  className="mb-8 flex justify-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {service.icon.startsWith("<svg") ? (
                    <div
                      className="w-20 h-20 p-5 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full shadow-lg"
                      dangerouslySetInnerHTML={{ __html: service.icon }}
                    />
                  ) : (
                    <img
                      src={service.icon}
                      alt={service.title}
                      className="w-20 h-20 object-contain rounded-full shadow-md"
                      loading="lazy"
                    />
                  )}
                </motion.div>
                <h3 className="text-2xl font-bold mb-5 text-gray-900 dark:text-gray-100">{service.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* قسم المشاريع مع تحسينات */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        className="py-28 bg-gradient-to-b from-primary/10 to-white dark:from-primary/20 dark:to-gray-900"
        id="portfolio"
      >
        <div className="container mx-auto px-6">
          <motion.div
            className="flex items-center gap-4 mb-16 text-left"
            variants={itemVariants}
          >
            <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-xl">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold dark:text-gray-100 border-r-4 border-l-4 border-primary pl-5 pr-5 rounded-lg">أعمالي</h2>
          </motion.div>
          {projects.length === 0 ? (
            <p className="text-center text-gray-700 dark:text-gray-300 text-2xl py-16 font-semibold">لا توجد مشاريع متاحة حالياً</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.08, rotate: -2 }}
                  className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-secondary"
                >
                  <div className="relative h-72 overflow-hidden">
                    <motion.img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.05 }}
                      whileHover={{ scale: 1.15, y: -20 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <div className="p-8 text-left">
                    <h3 className="text-2xl font-bold mb-4 text-primary">{project.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 leading-relaxed">{project.description}</p>
                    <motion.a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 font-semibold"
                      whileHover={{ scale: 1.05 }}
                    >
                      <ExternalLink className="w-5 h-5" />
                      زيارة المشروع
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* قسم التواصل مع تحسينات */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-200px" }}
        className="py-24 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-gray-900 dark:to-gray-900"
        id="contact"
      >
        <div className="container mx-auto px-6">
          <motion.div
            className="flex items-center gap-4 mb-16 text-left"
            variants={itemVariants}
          >
            <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-xl">
              <Phone className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold dark:text-gray-100 border-r-4 border-l-4 border-primary pl-5 pr-5 rounded-lg">تواصل معنا</h2>
          </motion.div>
            <ContactForm />
        </div>
      </motion.section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}