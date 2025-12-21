import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import { Trash2, Edit, X } from "lucide-react";
import { motion } from "framer-motion";

// Schema for both certificate and skill (same fields)
const itemSchema = z.object({
  title: z.string().min(2, "العنوان يجب أن يكون حرفين على الأقل"),
  issuer: z.string().min(2, "الجهة المانحة يجب أن تكون حرفين على الأقل"),
  date: z.string().min(1, "التاريخ مطلوب"),
  category: z.string().min(1, "الفئة مطلوبة"),
  image_url: z.string().url().optional(),
});

type Item = z.infer<typeof itemSchema> & {
  id?: string;
  image_url: string;
};

export default function ItemsManager() {
  const [certificates, setCertificates] = React.useState<Item[]>([]);
  const [skills, setSkills] = React.useState<Item[]>([]);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [useFileUpload, setUseFileUpload] = React.useState(true);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [itemType, setItemType] = React.useState<"certificate" | "skill">("certificate");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Item>({
    resolver: zodResolver(itemSchema),
  });

  const imageUrlValue = watch("image_url");

  React.useEffect(() => {
    fetchItems();
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, []);

  const fetchItems = async () => {
    try {
      const { data: certData, error: certError } = await supabase.rpc("get_certificates");
      if (certError) throw certError;
      setCertificates(certData || []);

      const { data: skillData, error: skillError } = await supabase.rpc("get_skills");
      if (skillError) throw skillError;
      setSkills(skillData || []);
    } catch (error) {
      toast.error("حدث خطأ في جلب البيانات");
    }
  };

  const handleEditClick = (item: Item, type: "certificate" | "skill") => {
    setItemType(type);
    setEditingId(item.id!);
    reset({
      ...item,
      date: new Date(item.date).toISOString().split("T")[0],
    });
    setPreviewUrl(item.image_url);
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
      toast.error("حجم الصورة يجب ألا يتجاوز 5 ميجابايت");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

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
      .from("certificate_images")  // You can change bucket if needed for skills
      .upload(fileName, selectedFile);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("certificate_images").getPublicUrl(fileName);

    return publicUrl;
  };

  const onSubmit = async (data: Item) => {
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

      const itemData = { ...data, image_url: finalImageUrl };

      if (editingId) {
        // Update based on type
        const rpcFunction = itemType === "certificate" ? "update_certificate" : "update_skill";
        const { error } = await supabase.rpc(rpcFunction, {
          id: editingId,
          title: itemData.title,
          issuer: itemData.issuer,
          date: itemData.date,
          category: itemData.category,
          image_url: itemData.image_url,
        });

        if (error) throw error;
        toast.success(`تم تحديث ال${itemType === "certificate" ? "شهادة" : "مهارة"} بنجاح`);
      } else {
        // Insert based on type
        const rpcFunction = itemType === "certificate" ? "insert_certificate" : "insert_skill";
        const { error } = await supabase.rpc(rpcFunction, {
          title: itemData.title,
          issuer: itemData.issuer,
          date: itemData.date,
          category: itemData.category,
          image_url: itemData.image_url,
        });
        if (error) throw error;
        toast.success(`تم إضافة ال${itemType === "certificate" ? "شهادة" : "مهارة"} بنجاح`);
      }

      reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      setEditingId(null);
      await fetchItems();
    } catch (error) {
      console.error("Error saving item:", error);
      toast.error(
        error instanceof Error ? error.message : "حدث خطأ غير متوقع أثناء الحفظ"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, type: "certificate" | "skill") => {
    try {
      const rpcFunction = type === "certificate" ? "delete_certificate" : "delete_skill";
      const { error } = await supabase.rpc(rpcFunction, { id });
      if (error) throw error;

      toast.success(`تم حذف ال${type === "certificate" ? "شهادة" : "مهارة"} بنجاح`);
      await fetchItems();
    } catch (error) {
      toast.error(`حدث خطأ أثناء حذف ال${type === "certificate" ? "شهادة" : "مهارة"}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* قسم النموذج */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
      >
        <h2 className="text-3xl font-bold mb-8 text-primary dark:text-white">
          {editingId ? "تعديل" : "إضافة"} {itemType === "certificate" ? "شهادة" : "مهارة"}
        </h2>
        <div className="mb-6">
          <label className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
            نوع العنصر
          </label>
          <select
            value={itemType}
            onChange={(e) => setItemType(e.target.value as "certificate" | "skill")}
            disabled={!!editingId}  // Disable during edit
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="certificate">شهادة</option>
            <option value="skill">مهارة</option>
          </select>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
                عنوان
              </label>
              <input
                {...register("title")}
                type="text"
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
                الجهة المانحة
              </label>
              <input
                {...register("issuer")}
                type="text"
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {errors.issuer && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.issuer.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
                الفئة
              </label>
              <input
                {...register("category")}
                type="text"
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
                تاريخ الحصول
              </label>
              <input
                {...register("date")}
                type="date"
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.date.message}
                </p>
              )}
            </div>
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
                  صورة
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {previewUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-text dark:text-gray-300 mb-2">
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
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://example.com/image.jpg"
                />
                {errors.image_url && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.image_url.message}
                  </p>
                )}
                {imageUrlValue && (
                  <div className="mt-4">
                    <p className="text-sm text-text dark:text-gray-300 mb-2">
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
              disabled={isUploading}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
            >
              {isUploading
                ? editingId
                  ? "جاري التحديث..."
                  : "جاري الإضافة..."
                : editingId
                ? "تحديث"
                : "إضافة"}
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

      {/* قسم عرض الشهادات */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-8 text-primary dark:text-white">
            الشهادات الحالية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden card-hover"
              >
                <div className="relative h-48">
                  <img
                    src={cert.image_url}
                    alt={cert.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">
                    {cert.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {cert.issuer}
                  </p>
                  <p className="text-text text-sm dark:text-gray-300">
                    {new Date(cert.date).toLocaleDateString("ar-EG")}
                  </p>
                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={() => handleEditClick(cert, "certificate")}
                      className="text-primary hover:text-secondary flex items-center gap-1 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Edit className="w-5 h-5" />
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(cert.id!, "certificate")}
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

      {/* قسم عرض المهارات */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-8 text-primary dark:text-white">
            المهارات الحالية
          </h2>
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
                  <img
                    src={skill.image_url}
                    alt={skill.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">
                    {skill.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {skill.issuer}
                  </p>
                  <p className="text-text text-sm dark:text-gray-300">
                    {new Date(skill.date).toLocaleDateString("ar-EG")}
                  </p>
                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={() => handleEditClick(skill, "skill")}
                      className="text-primary hover:text-secondary flex items-center gap-1 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Edit className="w-5 h-5" />
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id!, "skill")}
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