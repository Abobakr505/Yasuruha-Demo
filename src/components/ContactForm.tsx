import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";

// التحقق من صحة البيانات باستخدام Zod
const contactSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  message: z.string().min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
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
        from_email: data.email,
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
    >
      <h2 className="text-2xl  font-bold text-center text-primary mb-4">
        📩
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          {" "}
          تواصل معنا
        </span>
      </h2>

      <div className="space-y-4">
        {/* حقل الاسم */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            الاسم
          </label>
          <input
            {...register("name")}
            type="text"
            className="w-full p-3 mt-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 dark:focus:ring-primary"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* حقل البريد الإلكتروني */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            البريد الإلكتروني
          </label>
          <input
            {...register("email")}
            type="email"
            className="w-full p-3 mt-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 dark:focus:ring-primary"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* حقل الرسالة */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            الرسالة
          </label>
          <textarea
            {...register("message")}
            rows={4}
            className="w-full p-3 mt-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-indigo-200 dark:focus:ring-primary"
          />
          {errors.message && (
            <p className="text-red-600 text-sm mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* زر الإرسال */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 text-white bg-gradient-to-r from-primary to-secondary rounded-md shadow-md transition-all duration-200 disabled:opacity-50"
        >
          {isSubmitting ? "⏳ جاري الإرسال..." : "📨 إرسال"}
        </button>
      </div>
    </form>
  );
}
