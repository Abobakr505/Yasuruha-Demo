import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { motion } from "framer-motion";
import { User } from "lucide-react";

const AboutManager = () => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    image_url: "",
    projects_count: 0,
    hours_experience: 0,
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("about")
          .select("*")
          .single();
        if (data) {
          setFormData(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching about data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileName = `about-${Date.now()}-${file.name}`;

    // رفع الصورة إلى التخزين
    const { error } = await supabase.storage
      .from("about-images")
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error);
      setMessage({ type: "error", content: "فشل في رفع الصورة" });
    } else {
      // الحصول على رابط الصورة
      const {
        data: { publicUrl },
      } = supabase.storage.from("about-images").getPublicUrl(fileName);

      setFormData({ ...formData, image_url: publicUrl });
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from("about")
        .upsert([formData], { onConflict: "id" });
      if (error) throw error;

      setMessage({
        type: "success",
        content: "تم حفظ التعديلات بنجاح ✅",
      });
      setTimeout(() => setMessage({ type: "", content: "" }), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        content: "حدث خطأ أثناء الحفظ ❌",
      });
      console.error("Submission error:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-400">
        جاري تحميل البيانات...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-8">
        <User className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
          إدارة قسم من أنا
        </h2>
      </div>

      {message.content && (
        <div
          className={`p-4 mb-6 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
          }`}
        >
          {message.content}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* قسم رفع الصورة */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            صورة الملف الشخصي
          </label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
              <div className="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors">
                {uploading ? "جاري الرفع..." : "اختر صورة"}
              </div>
            </label>
            {formData.image_url && (
              <img
                src={formData.image_url}
                alt="صورة الملف الشخصي"
                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-300 shadow-md"
              />
            )}
          </div>
        </div>

        {/* الحقول النصية */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              الاسم الكامل
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:text-white text-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              المسمى الوظيفي
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:text-white text-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            الوصف
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg h-40 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700  dark:text-gray-300">
              عدد المشاريع
            </label>
            <input
              type="number"
              value={formData.projects_count}
              onChange={(e) =>
                setFormData({ ...formData, projects_count: e.target.value })
              }
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:text-white text-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              min="0"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              ساعات الخبرة
            </label>
            <input
              type="number"
              value={formData.hours_experience}
              onChange={(e) =>
                setFormData({ ...formData, hours_experience: e.target.value })
              }
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:text-white text-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              min="0"
              required
            />
          </div>
        </div>

        {/* زر الإرسال مع خلفية primary وتأثير hover secondary */}
        <button
          type="submit"
          className="w-full py-3 px-6 bg-primary hover:bg-secondary text-white rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          حفظ التغييرات
        </button>
      </form>
    </motion.div>
  );
};

export default AboutManager;
