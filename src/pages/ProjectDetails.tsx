import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, Info, Image as ImageIcon, FileText } from "lucide-react";

type ProjectDetailsType = {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  link: string;
  image_url: string;
  sub_images: string[];
};

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

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetailsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applyThemeColors();
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", id)
          .single();
        if (projectError) throw projectError;

        const { data: subImagesData } = await supabase
          .from("project_images")
          .select("image_url")
          .eq("project_id", id);

        setProject({
          ...projectData,
          sub_images: subImagesData?.map((img) => img.image_url) || [],
        });
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-700 transition-all duration-500">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-2xl font-bold text-primary dark:text-secondary flex items-center gap-2"
        >
          جاري التحميل...
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-t-primary border-primary/30 rounded-full"
          />
        </motion.div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-700">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-primary dark:text-secondary"
        >
          المشروع غير موجود
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-700 text-right dark:text-gray-100 py-16 overflow-hidden transition-all duration-500"
      dir="rtl"
    >
      <div className="container mx-auto px-6 lg:px-16">
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-12"
        >
          <Link to="/#portfolio" className="flex items-center gap-2 text-primary dark:text-secondary hover:text-secondary dark:hover:text-primary transition-colors">
            <ArrowLeft className="w-6 h-6" />
            <span className="font-semibold text-lg">عودة إلى الأعمال</span>
          </Link>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full hover:bg-secondary hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            زيارة المشروع
            <ExternalLink className="w-5 h-5" />
          </a>
        </motion.header>

        <motion.main
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 lg:p-12 overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 text-primary dark:text-secondary tracking-tight leading-tight">
                {project.title}
              </h1>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative mb-8"
              >
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-80 lg:h-[600px] object-cover rounded-3xl shadow-xl transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">صورة المشروع الرئيسية</span>
                </div>
              </motion.div>
            </div>

            <div className="lg:w-1/2">
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-6 h-6 text-primary dark:text-secondary" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">الوصف</h2>
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{lineBreak : 'anywhere'}}
                  className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed prose prose-invert max-w-none"
                >
                  {project.description}
                </motion.p>
              </section>

              {project.long_description && (
                <section className="mb-12">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-6 h-6 text-primary dark:text-secondary" />
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">تفاصيل إضافية</h2>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    style={{lineBreak : 'anywhere'}}
                    className="text-gray-700 dark:text-gray-300 text-base leading-loose whitespace-pre-wrap prose prose-invert"
                  >
                    {project.long_description}
                  </motion.p>
                </section>
              )}
            </div>
          </div>

          {project.sub_images.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center gap-2 mb-6">
                <ImageIcon className="w-6 h-6 text-primary dark:text-secondary" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">صور إضافية</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {project.sub_images.map((url, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
                      className="relative overflow-hidden rounded-2xl shadow-md group"
                    >
                      <img
                        src={url}
                        alt={`صورة فرعية ${index + 1}`}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                        <span className="text-white text-sm font-medium">صورة {index + 1}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}
        </motion.main>

        <motion.footer
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm"
        >
          © {new Date().getFullYear()} جميع الحقوق محفوظة
        </motion.footer>
      </div>
    </div>
  );
}