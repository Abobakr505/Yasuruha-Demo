import React from "react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import { Trash2, CheckCircle, XCircle, Send } from "lucide-react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";

export default function MessagesManager() {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [replyText, setReplyText] = React.useState<{ [key: string]: string }>(
    {}
  );
  const [newMessageNotification, setNewMessageNotification] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    fetchMessages();
    emailjs.init("1LubalZVKkXpu38Im"); // استبدل بالمفتاح العام الخاص بك

    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setNewMessageNotification(`New message from ${payload.new.name}`);
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("حدث خطأ في جلب الرسائل");
      return;
    }

    setMessages(data || []);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;

      toast.success("تم حذف الرسالة بنجاح");
      fetchMessages();
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الرسالة");
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ status })
        .eq("id", id);
      if (error) throw error;

      toast.success("تم تحديث حالة الرسالة بنجاح");
      fetchMessages();
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث حالة الرسالة");
    }
  };

  const handleReply = async (message: any) => {
    try {
      const replyContent = replyText[message.id];
      if (!replyContent) {
        toast.error("الرجاء كتابة رد");
        return;
      }

      await emailjs.send(
        "service_2j53e4k", // استبدل بمعرف الخدمة الخاص بك
        "template_6gjxnm8", // استبدل بمعرف القالب الخاص بك
        {
          to_email: message.email,
          to_name: message.name,
          message: replyContent,
          from_name: "Bakr", // استبدل باسمك أو اسم شركتك
          from_email: message.email,
        }
      );

      await handleStatusChange(message.id, "replied");

      setReplyText((prev) => ({ ...prev, [message.id]: "" }));

      toast.success("تم إرسال الرد بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الرد");
      console.error("Email error:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8 text-primary dark:text-white">
          الرسائل الواردة
        </h2>
        {newMessageNotification && (
          <div
            className="bg-blue-100 dark:bg-blue-900 border-l-4 border-primary dark:border-blue-700 text-secondary dark:text-white p-4 mb-6"
            role="alert"
          >
            <p>{newMessageNotification}</p>
          </div>
        )}
        <div className="space-y-6">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative border-l-4 rounded-r-xl p-6 shadow-sm transition-all
                ${
                  message.status === "replied"
                    ? "border-green-500 bg-green-100 dark:bg-green-700/20 dark:border-green-400"
                    : message.status === "read"
                    ? "border-primary bg-green-50 dark:bg-green-300/20 dark:border-primary"
                    : "border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600"
                } 
                hover:shadow-md group`}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* القسم الخاص بصورة الحرف الأول */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary dark:text-white">
                      {message.name[0]}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                    {new Date(message.created_at).toLocaleTimeString("ar")}
                  </p>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xl font-semibold text-text dark:text-white">
                      {message.name}
                    </h3>
                    <span className="text-sm text-text dark:text-gray-300">
                      •
                    </span>
                    <a
                      href={`mailto:${message.email}`}
                      className="text-primary hover:text-secondary text-sm dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {message.email}
                    </a>
                  </div>

                  <div className="prose max-w-none text-text dark:text-gray-300 mb-6">
                    {message.message}
                  </div>

                  <div className="space-y-4 mt-6">
                    <textarea
                      value={replyText[message.id] || ""}
                      onChange={(e) =>
                        setReplyText((prev) => ({
                          ...prev,
                          [message.id]: e.target.value,
                        }))
                      }
                      placeholder="اكتب ردك هنا..."
                      className="w-full p-4 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      rows={4}
                    />
                    <div className="flex items-center gap-3 justify-end">
                      <button
                        onClick={() =>
                          setReplyText((prev) => ({
                            ...prev,
                            [message.id]: "",
                          }))
                        }
                        className="px-4 py-2 text-secondary hover:text-primary dark:text-gray-300 dark:hover:text-white"
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={() => handleReply(message)}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors dark:bg-blue-600 dark:hover:bg-blue-500"
                      >
                        <Send className="w-4 h-4" />
                        إرسال الرد
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleStatusChange(message.id, "read")}
                    className={`p-2 rounded-full transition-colors ${
                      message.status === "read"
                        ? "bg-blue-100 text-primary dark:bg-blue-900 dark:text-blue-400"
                        : "text-gray-500 hover:bg-blue-100 hover:text-primary dark:text-gray-400 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                    }`}
                    disabled={message.status === "read"}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleStatusChange(message.id, "unread")}
                    className={`p-2 rounded-full transition-colors ${
                      message.status === "unread"
                        ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400"
                        : "text-gray-500 hover:bg-yellow-100 hover:text-yellow-600 dark:text-gray-400 dark:hover:bg-yellow-900 dark:hover:text-yellow-300"
                    }`}
                    disabled={message.status === "unread"}
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors dark:text-gray-400 dark:hover:bg-red-900 dark:hover:text-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
