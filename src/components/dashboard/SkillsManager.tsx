// SkillsManager.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import { Trash2, Edit, X } from "lucide-react";
import { motion } from "framer-motion";

const skillSchema = z.object({
  title: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  image_url: z.string().url().optional(),
});

type Skill = z.infer<typeof skillSchema> & {
  id?: string;
  image_url: string;
};

export default function SkillsManager() {
  const [skills, setSkills] = React.useState<Skill[]>([]);
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
    formState: { errors },
  } = useForm<Skill>({
    resolver: zodResolver(skillSchema),
  });

  const imageUrlValue = watch("image_url");

  React.useEffect(() => {
    fetchSkills();
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, []);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase.rpc("get_skills");
      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      toast.error("حدث خطأ في جلب المهارات");
    }
  };

  const handleEditClick = (skill: Skill) => {
    setEditingId(skill.id!);
    reset(skill);
    setPreviewUrl(skill.image_url);
    setUseFileUpload(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    reset();
    setSelectedFile(null);
    setPreviewUrl(null);
    setUseFileUpload(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("الرجاء اختيار ملف صورة صالح");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الأيقونة يجب ألا يتجاوز 5 ميجابايت");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!selectedFile) {
      if (editingId) return previewUrl;
      throw new Error("لم يتم اختيار أيقونة");
    }
    const fileExt = selectedFile.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const { error } = await supabase.storage
      .from("skills_images") // يمكن تغيير البكيت إذا لزم الأمر
      .upload(fileName, selectedFile);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from("certificate_images").getPublicUrl(fileName);
    return publicUrl;
  };

  const onSubmit = async (data: Skill) => {
    try {
      setIsUploading(true);
      let finalImageUrl = "";
      if (useFileUpload) {
        finalImageUrl = await uploadImage();
      } else {
        if (!data.image_url) {
          toast.error("الرجاء إدخال رابط الأيقونة");
          return;
        }
        finalImageUrl = data.image_url;
      }
      const itemData = { ...data, image_url: finalImageUrl };
      if (editingId) {
        const { error } = await supabase.rpc("update_skill", {
          id: editingId,
          title: itemData.title,
          image_url: itemData.image_url,
          // أزل الحقول الأخرى إذا كان الـ RPC يتوقعها، أو قم بتعديل الـ RPC في Supabase
        });
        if (error) throw error;
        toast.success("تم تحديث المهارة بنجاح");
      } else {
        const { error } = await supabase.rpc("insert_skill", {
          title: itemData.title,
          image_url: itemData.image_url,
          // أزل الحقول الأخرى
        });
        if (error) throw error;
        toast.success("تم إضافة المهارة بنجاح");
      }
      reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      setEditingId(null);
      await fetchSkills();
    } catch (error) {
      console.error("Error saving skill:", error);
      toast.error(error instanceof Error ? error.message : "حدث خطأ غير متوقع أثناء الحفظ");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.rpc("delete_skill", { id });
      if (error) throw error;
      toast.success("تم حذف المهارة بنجاح");
      await fetchSkills();
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف المهارة");
    }
  };

  return (
    <div className="space-y-8">
      {/* قسم النموذج للمهارات */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
      >
        <h2 className="text-3xl font-bold mb-8 text-primary dark:text-white">
          {editingId ? "تعديل" : "إضافة"} مهارة
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
              الاسم
            </label>
            <input
              {...register("title")}
              type="text"
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setUseFileUpload(true)}
                className={`px-4 py-2 rounded-lg ${useFileUpload ? "bg-primary text-white" : "bg-gray-100 text-text dark:bg-gray-600 dark:text-gray-200"}`}
              >
                رفع أيقونة من الجهاز
              </button>
              <button
                type="button"
                onClick={() => setUseFileUpload(false)}
                className={`px-4 py-2 rounded-lg ${!useFileUpload ? "bg-primary text-white" : "bg-gray-100 text-text dark:bg-gray-600 dark:text-gray-200"}`}
              >
                استخدام رابط خارجي
              </button>
            </div>
            {useFileUpload ? (
              <div>
                <label className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
                  أيقونة
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {previewUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-text dark:text-gray-300 mb-2">معاينة الأيقونة:</p>
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
                  رابط الأيقونة
                </label>
                <input
                  {...register("image_url")}
                  type="url"
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://example.com/icon.jpg"
                />
                {errors.image_url && <p className="mt-1 text-sm text-red-600">{errors.image_url.message}</p>}
                {imageUrlValue && (
                  <div className="mt-4">
                    <p className="text-sm text-text dark:text-gray-300 mb-2">معاينة الأيقونة:</p>
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
              disabled={isUploading}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
            >
              {isUploading ? (editingId ? "جاري التحديث..." : "جاري الإضافة...") : editingId ? "تحديث" : "إضافة"}
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
      {/* قسم عرض المهارات */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-8 text-primary dark:text-white">المهارات الحالية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden card-hover"
              >
                <div className="relative h-48">
                  <img src={skill.image_url} alt={skill.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">{skill.title}</h3>
                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={() => handleEditClick(skill)}
                      className="text-primary hover:text-secondary flex items-center gap-1 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Edit className="w-5 h-5" />
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id!)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                      حذف
                    </button>
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
