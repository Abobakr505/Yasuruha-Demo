import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import emailjs from "@emailjs/browser";
import {
  Headset,
  Mail,
  Phone,
  Globe,
  MessageSquare,
  MapPin,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// 1. تعريف مخطط Zod للتحقق من الصحة
const contactSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  subject: z.string().min(1, "الموضوع مطلوب"),
  message: z.string().min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل"),
});

type ContactForm = z.infer<typeof contactSchema>;

const SupportManager = () => {
  // 2. إعداد useForm مع Zod resolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  // 3. وظيفة الإرسال عبر EmailJS
  const onSubmit = async (data: ContactForm) => {
    try {
      // إعداد معاملات البريد
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        subject: data.subject,
        message: data.message,
        to_email: "bakrcode446@gmail.com", // البريد المُستقبِل
      };

      // إرسال البريد عبر EmailJS
      await emailjs.send(
        "service_as6ojxk", // Service ID
        "template_duyyl4b", // Template ID
        templateParams,
        "JTEBbvZll8o0M_Qvm" // User ID
      );

      toast.success("تم استلام رسالتك بنجاح، سنقوم بالرد في أقرب وقت ممكن");
      reset(); // إعادة تعيين النموذج بعد الإرسال
    } catch (error) {
      console.error("حدث خطأ أثناء الإرسال:", error);
      toast.error("حدث خطأ أثناء الإرسال. الرجاء المحاولة لاحقًا");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-4"
    >
      <h1 className="text-3xl font-bold text-primary mb-8 dark:text-white">
        الدعم الفني
      </h1>

      <div className="grid md:grid-cols-2 gap-12">
        {/* نموذج التواصل */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
            تواصل معنا
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">
                الاسم الكامل
              </label>
              <input
                {...register("name")}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.name && (
                <span className="text-red-600 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.email && (
                <span className="text-red-600 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">
                الموضوع
              </label>
              <input
                {...register("subject")}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.subject && (
                <span className="text-red-600 text-sm">
                  {errors.subject.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">
                الرسالة
              </label>
              <textarea
                {...register("message")}
                rows={4}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              ></textarea>
              {errors.message && (
                <span className="text-red-600 text-sm">
                  {errors.message.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}
            </button>
          </form>
        </div>

        {/* معلومات التواصل */}
        <div className="space-y-8">
          <motion.div
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              وسائل التواصل
            </h2>

            <div className="space-y-6">
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-start gap-4"
              >
                <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    الهاتف
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    +20 10 80115240
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-start gap-4"
              >
                <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                  <FaWhatsapp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    الواتس اب
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    +20 10 80115240
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-start gap-4"
              >
                <div className="p-3 bg-purple-50 dark:bg-purple-900 rounded-lg">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    البريد الإلكتروني
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    support@tawrr.com
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-start gap-4"
              >
                <div className="p-3 bg-orange-50 dark:bg-orange-900 rounded-lg">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    الموقع الإلكتروني
                  </p>
                  <a
                    href="https://tawrr.com"
                    className="text-primary hover:underline dark:text-blue-400"
                  >
                    www.tawrr.com
                  </a>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-start gap-4"
              >
                <div className="p-3 bg-red-50 dark:bg-red-900 rounded-lg">
                  <MapPin className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    العنوان
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    مصر - القاهرة - المعادي
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              الأسئلة الشائعة
            </h2>
            <div className="space-y-3">
              <div className="border-b pb-3 border-gray-200 dark:border-gray-700">
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  كم تستغرق مدة الرد على الاستفسارات؟
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  عادةً ما يتم الرد خلال 1 ساعة تقريباً
                </p>
              </div>
              <div className="border-b pb-3 border-gray-200 dark:border-gray-700">
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  ما هي أوقات الدعم الفني؟
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  متواجدون 24/7 ساعة
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SupportManager;
