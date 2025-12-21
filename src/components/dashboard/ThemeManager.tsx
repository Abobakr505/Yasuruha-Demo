import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { motion } from "framer-motion";
import { Palette, Check, AlertTriangle, Moon, Sun } from "lucide-react";
import chroma from "chroma-js"; // مكتبة للتعامل مع الحسابات اللونية

const ThemeManager = () => {
  // الحالة الافتراضية للألوان
  const [theme, setTheme] = useState({
    primary_color: "#2563eb",
    secondary_color: "#4f46e5",
    text_color: "#1f2937",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", content: "" });
  const [darkMode, setDarkMode] = useState(false);

  // جلب الإعدادات من قاعدة البيانات
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const { data } = await supabase.from("site_theme").select("*").single();
        if (data) setTheme(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching theme:", error);
        setLoading(false);
      }
    };

    fetchTheme();
  }, []);

  // تحديث المتغيرات اللونية فور تغيير الألوان
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary-color",
      theme.primary_color
    );
    document.documentElement.style.setProperty(
      "--secondary-color",
      theme.secondary_color
    );
    document.documentElement.style.setProperty(
      "--text-color",
      theme.text_color
    );
  }, [theme]);


  // حفظ الإعدادات في قاعدة البيانات
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from("site_theme").upsert(
        {
          id: 1,
          ...theme,
          updated_at: new Date(),
        },
        { onConflict: "id" }
      );

      if (error) throw error;

      setMessage({ type: "success", content: "تم التحديث بنجاح 🎨" });
      setTimeout(() => setMessage({ type: "", content: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", content: "خطأ في الحفظ ❌" });
      console.error("Error:", error);
    }
  };

  // تحقق من توافق الألوان
  const getContrastWarning = () => {
    const textContrast = chroma.contrast(theme.text_color, "#ffffff");
    const primaryContrast = chroma.contrast(
      theme.primary_color,
      theme.secondary_color
    );

    const warnings = [];
    if (textContrast < 4.5) warnings.push("نص غير واضح على الخلفية البيضاء");
    if (primaryContrast < 3) warnings.push("تناقض ضعيف بين الألوان الأساسية");

    return warnings;
  };

  // السمات الجاهزة
  const PRESET_THEMES = [
    {
      name: "أزرق كلاسيكي",
      primary: "#1350a3",
      secondary: "#08afee",
      text: "#1f2937",
    },
    {
      name: "أخضر طبيعي",
      primary: "#16a34a",
      secondary: "#15803d",
      text: "#1a2e05",
    },
    {
      name: "بنفسجي إبداعي",
      primary: "#9333ea",
      secondary: "#6b21a8",
      text: "#f3e8ff",
    },
  ];

  // معاينة تفاعلية للألوان
  const ThemePreview = () => (
    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 space-y-4">
      <h3 className="text-lg font-medium">معاينة حية:</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {/* معاينة زر */}
        <div
          className="py-2 px-4 rounded-lg transition-transform hover:scale-95 flex justify-center items-center"
          style={{ backgroundColor: theme.primary_color }}
        >
          <span style={{ color: theme.text_color }}>زر تجريبي</span>
        </div>

        {/* معاينة بطاقة */}
        <div
          className="p-4 rounded-lg shadow dark:shadow-lg"
          style={{ backgroundColor: theme.secondary_color }}
        >
          <h4 className="font-medium mb-2" style={{ color: theme.text_color }}>
            عنوان البطاقة
          </h4>
          <p className="text-sm opacity-90" style={{ color: theme.text_color }}>
            محتوى بطاقة تجريبية مع نص توضيحي
          </p>
        </div>

        {/* معاينة نصية */}
        <div style={{ color: theme.text_color }}>
          <h3 className="text-xl font-bold mb-2">عنوان رئيسي</h3>
          <p className="opacity-90">
            نص جسم المقالة هنا مع أمثلة للكتابة الطويلة...
          </p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-400">
        جاري تحميل إعدادات الألوان...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 text-gray-800 dark:text-gray-100"
    >
      {/* رأس الصفحة مع زر تبديل الوضع الداكن */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Palette className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">إدارة ألوان الموقع</h2>
        </div>
      </div>

      {/* رسائل التفعيل */}
      {message.content && (
        <div
          className={`p-4 mb-6 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100"
          }`}
        >
          {message.content}
        </div>
      )}

      {/* تحذيرات توافق الألوان */}
      {getContrastWarning().length > 0 && (
        <div className="bg-amber-100 text-amber-700 dark:bg-amber-700 dark:text-amber-200 p-4 rounded-lg mb-6 flex gap-2">
          <AlertTriangle className="shrink-0" />
          <div>
            {getContrastWarning().map((msg, i) => (
              <p key={i}>⚠️ {msg}</p>
            ))}
          </div>
        </div>
      )}

      {/* السمات الجاهزة */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">السمات الجاهزة:</h3>
        <div className="flex flex-wrap gap-3">
          {PRESET_THEMES.map((preset, i) => (
            <button
              key={i}
              onClick={() =>
                setTheme({
                  primary_color: preset.primary,
                  secondary_color: preset.secondary,
                  text_color: preset.text,
                })
              }
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border dark:border-gray-600 hover:border-primary transition-colors"
            >
              <span
                className="w-4 h-4 rounded-full shadow-inner"
                style={{ backgroundColor: preset.primary }}
              />
              <span
                className="w-4 h-4 rounded-full shadow-inner"
                style={{ backgroundColor: preset.secondary }}
              />
              <span className="text-sm">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* حقول إدخال الألوان */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(theme).map(([key, value]) => (
            <div key={key} className="space-y-4">
              <label className="block text-sm font-medium">
                {
                  {
                    primary_color: "اللون الأساسي",
                    secondary_color: "اللون الثانوي",
                    text_color: "لون النص",
                  }[key]
                }
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={value}
                  onChange={(e) =>
                    setTheme({ ...theme, [key]: e.target.value })
                  }
                  className="h-12 w-12 rounded-lg cursor-pointer border dark:border-gray-600"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    setTheme({ ...theme, [key]: e.target.value })
                  }
                  className="flex-1 p-2 border rounded-lg font-mono text-sm dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                  placeholder="Hex code"
                />
              </div>
              <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded border shadow-inner"
                  style={{ backgroundColor: value }}
                />
                <code className="text-sm">{value}</code>
              </div>
            </div>
          ))}
        </div>

        {/* معاينة الألوان */}
        <ThemePreview />

        {/* زر الحفظ */}
        <button
          type="submit"
          className="w-full py-3 px-6 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors flex justify-center items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12C19 15.866 15.866 19 12 19Z"
                  fill="currentColor"
                />
                <path
                  d="M12 5C15.866 5 19 8.13401 19 12C19 13.8565 18.2625 15.637 16.9497 16.9497C15.637 18.2625 13.8565 19 12 19V22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2V5Z"
                  fill="currentColor"
                />
              </svg>
              جاري الحفظ...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              حفظ الألوان الجديدة
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default ThemeManager;
