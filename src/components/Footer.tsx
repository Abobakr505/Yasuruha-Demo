import React from "react";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer
      dir="rtl"
      className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary text-white"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      <div className="relative container mx-auto px-8 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">

          {/* Contact */}
          <div>
            <h3 className="text-2xl font-extrabold mb-7 border-r-4 border-secondary pr-4">
              معلومات التواصل
            </h3>

            <ul className="space-y-5 text-lg text-white/90">
              <li className="flex items-center gap-4 hover:text-secondary transition">
                <Mail className="w-6 h-6 text-secondary" />
                example@email.com
              </li>
              <li className="flex items-center gap-4 hover:text-secondary transition">
                <Phone className="w-6 h-6 text-secondary" />
                +966 123 456 789
              </li>
              <li className="flex items-center gap-4 hover:text-secondary transition">
                <MapPin className="w-6 h-6 text-secondary" />
                الرياض، المملكة العربية السعودية
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-2xl font-extrabold mb-7 border-r-4 border-secondary pr-4">
              روابط سريعة
            </h3>

            <ul className="space-y-4 text-lg">
              {[
                { name: "من أنا", href: "#about" },
                { name: "المهارات", href: "#skills" },
                { name: "الشهادات", href: "#certificates" },
                { name: "خدماتي", href: "#services" },
                { name: "أعمالي", href: "#portfolio" },
                { name: "تواصل معي", href: "#contact" },
              ].map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="flex items-center gap-3 text-white/85 hover:text-secondary transition-all hover:translate-x-2"
                  >
                    <span className="w-2 h-2 bg-secondary rounded-full" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-2xl font-extrabold mb-7 border-r-4 border-secondary pr-4">
              تواصل اجتماعي
            </h3>

            <div className="flex gap-5">
              {[Github, Linkedin, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-4 rounded-full bg-white/10 hover:bg-secondary transition-all hover:scale-125 duration-300"
                >
                  <Icon className="w-6 h-6 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Branding */}
          <div>
            <h3 className="text-2xl font-extrabold mb-7 border-r-4 border-secondary pr-4">
              أسناني
            </h3>

            <p className="text-3xl font-extrabold mb-3">
              د/ أحمد محمد
            </p>

            <p className="text-lg text-white/80 leading-relaxed">
              طبيب أسنان متخصص في تجميل وعلاج الأسنان باستخدام أحدث التقنيات الطبية
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-white/20" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 text-base text-white/65">
          <p>
            © {new Date().getFullYear()} جميع الحقوق محفوظة لـ
            <span className="text-secondary font-semibold"> أسناني</span>
          </p>

          {/* Developer */}
          <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
            <span>تصميم وتطوير</span>
            <a
              href="https://yasuruha.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <img
                src="https://i.postimg.cc/9QLZ03rg/icon.png"
                alt="Tawrr"
                className="h-7 w-7"
              />
              <span className="font-semibold text-[#4ce19e]"> يسِّرها</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
