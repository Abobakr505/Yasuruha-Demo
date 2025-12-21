import { createClient } from "@supabase/supabase-js";

// تأكد من أن أسماء المتغيرات البيئية تطابق ما في ملف .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// تحقق من وجود القيم قبل إنشاء العميل
if (!supabaseUrl || !supabaseKey) {
  throw new Error(`
    ❌ خطأ في إعداد Supabase! 
    تأكد من وجود المتغيرات البيئية التالية في ملف .env:
    VITE_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY
  `);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
