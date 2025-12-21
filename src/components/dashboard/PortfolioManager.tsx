import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import { Trash2, Plus, Link as LinkIcon, Edit, X } from "lucide-react";
import { motion } from "framer-motion";

// تعريف schema التحقق باستخدام Zod
const projectSchema = z.object({
  title: z.string().min(2, "العنوان يجب أن يكون حرفين على الأقل"),
  description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
  link: z.string().url("الرجاء إدخال رابط صحيح"),
  image_url: z.string().url().optional(),
});

type Project = z.infer<typeof projectSchema> & {
  id?: string;
  image_url: string;
};

export default function PortfolioManager() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [useFileUpload, setUseFileUpload] = React.useState(true);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Project>({
    resolver: zodResolver(projectSchema),
  });

  const imageUrlValue = watch("image_url");

  // جلب المشاريع عند تحميل المكون
  React.useEffect(() => {
    fetchProjects();
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, []);

  // جلب المشاريع من Supabase
  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      toast.error("حدث خطأ في جلب المشاريع");
    }
  };

  // معالجة النقر على زر التعديل
  const handleEditClick = (project: Project) => {
    setEditingId(project.id!);
    reset({
      ...project,
    });
    setPreviewUrl(project.image_url);
    setUseFileUpload(false);
  };

  // إلغاء التعديل
  const cancelEdit = () => {
    setEditingId(null);
    reset();
    setSelectedFile(null);
    setPreviewUrl(null);
    setUseFileUpload(true);
  };

  // معالجة تغيير ملف الصورة
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("الرجاء اختيار ملف صورة صالح");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب ألا يتجاوز 5 ميجابايت");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // رفع الصورة إلى Supabase Storage
  const uploadImage = async () => {
    if (!selectedFile) {
      if (editingId) return previewUrl;
      throw new Error("لم يتم اختيار صورة");
    }

    const fileExt = selectedFile.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 15)}.${fileExt}`;

    const { error } = await supabase.storage
      .from("project_images")
      .upload(fileName, selectedFile);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("project_images").getPublicUrl(fileName);

    return publicUrl;
  };

  // معالجة إرسال النموذج
  const onSubmit = async (data: Project) => {
    try {
      setIsUploading(true);

      let finalImageUrl = "";

      if (useFileUpload) {
        finalImageUrl = await uploadImage();
      } else {
        if (!data.image_url) {
          toast.error("الرجاء إدخال رابط الصورة");
          return;
        }
        finalImageUrl = data.image_url;
      }

      const projectData = { ...data, image_url: finalImageUrl };

      if (editingId) {
        // تحديث المشروع الموجود
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("تم تحديث المشروع بنجاح");
      } else {
        // إضافة مشروع جديد
        const { error } = await supabase.from("projects").insert([projectData]);
        if (error) throw error;
        toast.success("تم إضافة المشروع بنجاح");
      }

      reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      setEditingId(null);
      await fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error(
        error instanceof Error ? error.message : "حدث خطأ غير متوقع أثناء الحفظ"
      );
    } finally {
      setIsUploading(false);
    }
  };

  // حذف مشروع
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;

      toast.success("تم حذف المشروع بنجاح");
      await fetchProjects();
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف المشروع");
    }
  };

  return (
    <div className="space-y-8">
      {/* نموذج إضافة/تعديل مشروع */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
      >
        <h2 className="text-3xl font-bold mb-8 text-primary dark:text-white">
          {editingId ? "تعديل المشروع" : "إضافة مشروع جديد"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
                عنوان المشروع
              </label>
              <input
                {...register("title")}
                type="text"
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="أدخل عنوان المشروع"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
                رابط المشروع
              </label>
              <input
                {...register("link")}
                type="url"
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="https://example.com"
              />
              {errors.link && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.link.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
              وصف المشروع
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="اكتب وصفاً مختصراً للمشروع"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setUseFileUpload(true)}
                className={`px-4 py-2 rounded-lg ${
                  useFileUpload
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-text dark:bg-gray-600 dark:text-gray-200"
                }`}
              >
                رفع صورة من الجهاز
              </button>
              <button
                type="button"
                onClick={() => setUseFileUpload(false)}
                className={`px-4 py-2 rounded-lg ${
                  !useFileUpload
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-text dark:bg-gray-600 dark:text-gray-200"
                }`}
              >
                استخدام رابط خارجي
              </button>
            </div>

            {useFileUpload ? (
              <div>
                <label className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
                  صورة المشروع
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                {previewUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                      معاينة الصورة:
                    </p>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-500"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
                  رابط الصورة
                </label>
                <input
                  {...register("image_url")}
                  type="url"
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="https://example.com/image.jpg"
                />
                {errors.image_url && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.image_url.message}
                  </p>
                )}
                {imageUrlValue && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                      معاينة الصورة:
                    </p>
                    <img
                      src={imageUrlValue}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-500"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {isSubmitting || isUploading
                ? editingId
                  ? "جاري التحديث..."
                  : "جاري الإضافة..."
                : editingId
                ? "تحديث المشروع"
                : "إضافة المشروع"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-primary transition-colors dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                <X className="w-5 h-5" />
                إلغاء التعديل
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* عرض المشاريع الحالية */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-8 text-primary dark:text-white">
            المشاريع الحالية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden card-hover"
              >
                <div className="relative h-48">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-secondary dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                    >
                      <LinkIcon className="w-4 h-4" />
                      زيارة المشروع
                    </a>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleEditClick(project)}
                        className="text-primary hover:text-secondary transition-colors dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id!)}
                        className="text-red-600 hover:text-red-700 transition-colors dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
