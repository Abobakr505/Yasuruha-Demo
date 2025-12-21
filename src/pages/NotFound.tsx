import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Ghost, Home } from "lucide-react";
import { supabase } from "../lib/supabase";

const NotFound = () => {
  const location = useLocation();

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

  useEffect(() => {
    document.title = "404 | الصفحة غير موجودة";
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    applyThemeColors();
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-primary to-secondary 
      dark:from-gray-900 dark:to-gray-800 px-6">

      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 
        max-w-md w-full text-center shadow-2xl animate-fade-in">

        {/* أيقونة */}
        <div className="flex justify-center mb-6">
          <Ghost className="w-16 h-16 text-white opacity-90 animate-bounce" />
        </div>

        {/* العنوان */}
        <h1 className="text-5xl font-extrabold text-white mb-4">
          404
        </h1>

        {/* الوصف */}
        <p className="text-lg text-white/90 mb-8 leading-relaxed">
          عذرًا، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>

        {/* زر الرجوع */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 
            bg-white text-primary px-8 py-4 rounded-full 
            font-bold transition-all duration-300 
            hover:scale-105 hover:shadow-xl"
        >
          <Home className="w-5 h-5" />
          العودة إلى الرئيسية
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
