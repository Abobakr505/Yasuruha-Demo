import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { User, Mail, MessageSquare, Send } from "lucide-react";

// التحقق من صحة البيانات باستخدام Zod
const contactSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  message: z.string().min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل"),
});

type ContactFormType = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormType>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormType) => {
    try {
      // إدراج البيانات في Supabase
      const { error: supabaseError } = await supabase
        .from("messages")
        .insert([data]);

      if (supabaseError) {
        console.error("Supabase Error:", supabaseError);
        throw new Error("فشل في حفظ البيانات");
      }

      // إعداد معاملات البريد الإلكتروني
      const emailParams = {
        from_name: data.name,
        user_email: data.email,
        to_email: "bakrcode446@gmail.com",
        message: data.message,
      };

      // إرسال البريد عبر EmailJS
      const emailResponse = await emailjs.send(
        "service_vg0nmoj", // Service ID
        "template_2doo1xe", // Template ID
        emailParams,
        "1LubalZVKkXpu38Im" // User ID
      );

      console.log("EmailJS Response:", emailResponse);

      toast.success("تم إرسال رسالتك بنجاح وتم إشعار الأدمن");
      reset();
    } catch (error) {
      console.error("تفاصيل الخطأ الكاملة:", error);
      toast.error("حدث خطأ أثناء الإرسال. الرجاء المحاولة لاحقًا");
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, borderColor: "var(--primary-color)" },
    blur: { scale: 1, borderColor: "#d1d5db" },
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-primary"
    >
      <h2 className="text-3xl font-bold text-center text-primary mb-8 flex items-center justify-center gap-2">
        <Send className="w-8 h-8" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          تواصل معنا
        </span>
      </h2>

      <div className="space-y-6">
        {/* حقل الاسم */}
        <motion.div
          className="relative"
          variants={inputVariants}
          whileFocus="focus"
          animate="blur"
        >
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            الاسم
          </label>
          <input
            {...register("name")}
            type="text"
            className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-inner focus:outline-none focus:border-primary transition-all duration-300"
            placeholder="أدخل اسمك"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-2 animate-pulse">{errors.name.message}</p>
          )}
        </motion.div>

        {/* حقل البريد الإلكتروني */}
        <motion.div
          className="relative"
          variants={inputVariants}
          whileFocus="focus"
          animate="blur"
        >
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            البريد الإلكتروني
          </label>
          <input
            {...register("email")}
            type="email"
            className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-inner focus:outline-none focus:border-primary transition-all duration-300"
            placeholder="أدخل بريدك الإلكتروني"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-2 animate-pulse">{errors.email.message}</p>
          )}
        </motion.div>

        {/* حقل الرسالة */}
        <motion.div
          className="relative"
          variants={inputVariants}
          whileFocus="focus"
          animate="blur"
        >
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            الرسالة
          </label>
          <textarea
            {...register("message")}
            rows={5}
            className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-inner focus:outline-none focus:border-primary transition-all duration-300"
            placeholder="اكتب رسالتك هنا..."
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-2 animate-pulse">{errors.message.message}</p>
          )}
        </motion.div>

        {/* زر الإرسال */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 text-white font-bold bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              جاري الإرسال...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              إرسال الرسالة
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}