import React from "react";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-primary to-secondary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-4 border-b-2 border-secondary/50 pb-2">
              معلومات التواصل
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 hover:text-secondary/80 transition-colors">
                <Mail className="w-6 h-6 text-secondary/80" />
                <span className="text-lg">example@email.com</span>
              </div>
              <div className="flex items-center gap-3 hover:text-secondary/80 transition-colors">
                <Phone className="w-6 h-6 text-secondary/80" />
                <span className="text-lg">+966 123 456 789</span>
              </div>
              <div className="flex items-center gap-3 hover:text-secondary/80 transition-colors">
                <MapPin className="w-6 h-6 text-secondary/80" />
                <span className="text-lg">
                  الرياض، المملكة العربية السعودية
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-4 border-b-2 border-secondary/50 pb-2">
              التنقل السريع
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#about"
                  className="flex items-center gap-2 text-lg hover:text-secondary/80 
                transition-all hover:translate-x-2"
                >
                  <span className="w-2 h-2 bg-secondary/80 rounded-full"></span>
                  من انا
                </a>
              </li>

              <li>
                <a
                  href="#skills"
                  className="flex items-center gap-2 text-lg hover:text-secondary/80 
                transition-all hover:translate-x-2"
                >
                  <span className="w-2 h-2 bg-secondary/80 rounded-full"></span>
                  المهارات والشهادات
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="flex items-center gap-2 text-lg hover:text-secondary/80 
                transition-all hover:translate-x-2"
                >
                  <span className="w-2 h-2 bg-secondary/80 rounded-full"></span>
                  خدماتي
                </a>
              </li>
              <li>
                <a
                  href="#portfolio"
                  className="flex items-center gap-2 text-lg hover:text-secondary/80 
                transition-all hover:translate-x-2"
                >
                  <span className="w-2 h-2 bg-secondary/80 rounded-full"></span>
                  أعمالي
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="flex items-center gap-2 text-lg hover:text-secondary/80 
                transition-all hover:translate-x-2"
                >
                  <span className="w-2 h-2 bg-secondary/80 rounded-full"></span>
                  تواصل معي
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-4 border-b-2 border-secondary/50 pb-2">
              وسائل التواصل
            </h3>
            <div className="flex gap-6 justify-start">
              <a
                href="#"
                className="p-3 bg-primary/20 rounded-full hover:bg-secondary/20 
              transition-all hover:scale-110"
              >
                <Github className="w-6 h-6 text-secondary/80" />
              </a>
              <a
                href="#"
                className="p-3 bg-primary/20 rounded-full hover:bg-secondary/20 
              transition-all hover:scale-110"
              >
                <Linkedin className="w-6 h-6 text-secondary/80" />
              </a>
              <a
                href="#"
                className="p-3 bg-primary/20 rounded-full hover:bg-secondary/20 
              transition-all hover:scale-110"
              >
                <Twitter className="w-6 h-6 text-secondary/80" />
              </a>
            </div>
          </div>

          {/* Branding Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-4 border-b-2 border-secondary/50 pb-2">
              <span className="bg-white bg-clip-text text-transparent p-1">
                أسناني
              </span>
            </h3>
            <div className="flex flex-col items-start gap-4">
              <div className="text-3xl font-arabic font-bold tracking-wide">
                د/احمد محمد
              </div>
              <p className="text-white/80 text-lg leading-relaxed">
                الدكتور أحمد محمد طبيب أسنان متخصص في تجميل وعلاج الأسنان
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-primary/20 text-center">
          <p className="text-lg text-white/80">
            © {new Date().getFullYear()} جميع الحقوق محفوظة لـ
            <span className="text-secondary/80 hover:text-secondary cursor-pointer">
              {" "}
              أسناني
            </span>
          </p>
          <p className="text-sm text-white/60 mt-2 transition-transform hover:scale-95">
            تصميم وتطوير بكل ❤️ من{" "}
            <a
              href="https://tawrr.com/"
              target="_blank"
            >
              <img
                src="https://i.postimg.cc/9QLZ03rg/icon.png"
                alt=""
                className="h-14 w-14 inline-block"
              />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
