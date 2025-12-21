import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import { Trash2, Edit, X } from "lucide-react";
import { motion } from "framer-motion";

// تعريف schema التحقق باستخدام Zod
const serviceSchema = z.object({
  title: z.string().min(2, "العنوان يجب أن يكون حرفين على الأقل"),
  description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
  icon: z.string().min(10, "الرجاء إدخال رمز الأيقونة أو رفع ملف").or(z.any()),
});

type Service = z.infer<typeof serviceSchema> & { id?: string };

export default function ServicesManager() {
  const [services, setServices] = React.useState<Service[]>([]);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string>("");
  const [useSvgCode, setUseSvgCode] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Service>({
    resolver: zodResolver(serviceSchema),
  });

  const iconValue = watch("icon");

  React.useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      toast.error("حدث خطأ في جلب الخدمات");
    }
  };

  const handleEditClick = (service: Service) => {
    setEditingId(service.id!);
    reset({
      title: service.title,
      description: service.description,
      icon: service.icon,
    });
    if (!service.icon.startsWith("<svg")) {
      setPreview(service.icon);
      setUseSvgCode(false);
    } else {
      setUseSvgCode(true);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    reset();
    setSelectedFile(null);
    setPreview("");
    setUseSvgCode(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("الرجاء اختيار ملف صورة");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setUseSvgCode(false);
  };

  const uploadIcon = async () => {
    if (!selectedFile) {
      if (editingId) return preview;
      throw new Error("لم يتم اختيار ملف");
    }

    const fileExt = selectedFile.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 15)}.${fileExt}`;

    const { error } = await supabase.storage
      .from("service_icons")
      .upload(fileName, selectedFile);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("service_icons").getPublicUrl(fileName);

    return publicUrl;
  };

  const onSubmit = async (data: Service) => {
    try {
      setIsUploading(true);
      let iconContent = "";

      if (useSvgCode) {
        iconContent = data.icon;
      } else {
        if (!selectedFile && !preview) {
          toast.error("الرجاء اختيار ملف أو إدخال رمز SVG");
          return;
        }
        iconContent = preview || (await uploadIcon());
      }

      const serviceData = {
        title: data.title,
        description: data.description,
        icon: iconContent,
      };

      if (editingId) {
        // تحديث الخدمة الحالية
        const { error } = await supabase
          .from("services")
          .update(serviceData)
          .eq("id", editingId);
        if (error) throw error;
        toast.success("تم تحديث الخدمة بنجاح");
      } else {
        // إضافة خدمة جديدة
        const { error } = await supabase.from("services").insert([serviceData]);
        if (error) throw error;
        toast.success("تم إضافة الخدمة بنجاح");
      }

      reset();
      setSelectedFile(null);
      setPreview("");
      setEditingId(null);
      await fetchServices();
    } catch (error) {
      console.error("Error:", error);
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;

      toast.success("تم حذف الخدمة بنجاح");
      await fetchServices();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div className="space-y-8">
      {/* نموذج إضافة/تعديل الخدمة */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
      >
        <h2 className="text-3xl font-bold mb-8 text-primary dark:text-white">
          {editingId ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* حقل عنوان الخدمة */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                عنوان الخدمة
              </label>
              <input
                {...register("title")}
                type="text"
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>
            {/* حقل وصف الخدمة */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                وصف الخدمة
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* خيارات إدخال أو رفع أيقونة */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setUseSvgCode(false)}
                className={`px-4 py-2 rounded-lg ${
                  !useSvgCode
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                }`}
              >
                رفع أيقونة
              </button>
              <button
                type="button"
                onClick={() => setUseSvgCode(true)}
                className={`px-4 py-2 rounded-lg ${
                  useSvgCode
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                }`}
              >
                إدخال رمز SVG
              </button>
            </div>

            {!useSvgCode ? (
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                  اختر ملف الأيقونة (SVG/PNG/JPG)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                {preview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-800 dark:text-gray-300 mb-2">
                      معاينة الأيقونة:
                    </p>
                    <img
                      src={preview}
                      alt="Icon preview"
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                  أدخل رمز SVG
                </label>
                <textarea
                  {...register("icon")}
                  rows={4}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-mono"
                  placeholder='<svg xmlns="http://www.w3.org/2000/svg" ...></svg>'
                />
                {iconValue && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-800 dark:text-gray-300 mb-2">
                      معاينة الأيقونة:
                    </p>
                    <div
                      className="w-20 h-20 [&>svg]:w-full [&>svg]:h-full text-primary"
                      dangerouslySetInnerHTML={{ __html: iconValue }}
                    />
                  </div>
                )}
              </div>
            )}

            {errors.icon && (
              <p className="mt-1 text-sm text-red-600">{errors.icon.message}</p>
            )}
          </div>

          {/* أزرار الإرسال وإلغاء التعديل */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {isSubmitting || isUploading
                ? editingId
                  ? "جاري التحديث..."
                  : "جاري الإضافة..."
                : editingId
                ? "تحديث الخدمة"
                : "إضافة الخدمة"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-primary transition-colors dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* عرض قائمة الخدمات الحالية */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-8 text-primary dark:text-white">
            الخدمات الحالية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  {service.icon.startsWith("<svg") ? (
                    <div
                      className="w-16 h-16 [&>svg]:w-full [&>svg]:h-full text-primary"
                      dangerouslySetInnerHTML={{ __html: service.icon }}
                    />
                  ) : (
                    <img
                      src={service.icon}
                      alt={service.title}
                      className="w-16 h-16 object-contain"
                    />
                  )}
                </div>
                <h3 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                  {service.description}
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => handleEditClick(service)}
                    className="text-primary hover:text-secondary flex items-center gap-1 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Edit className="w-5 h-5" />
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(service.id!)}
                    className="text-red-600 hover:text-red-700 flex items-center gap-1 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-5 h-5" />
                    حذف
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
