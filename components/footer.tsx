"use client";

import { useLanguage } from "@/components/language-provider";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { href: "/", label: t.header.home },
    { href: "/tours", label: t.header.tours },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <footer className="w-full bg-primary text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <a href="/" className="inline-block">
              <img
                src="/logo.png"
                alt="Univers Instrument Service"
                className="h-14 w-auto object-contain"
              />
            </a>
            <p className="text-sm text-white/80 leading-relaxed">
              {t.footer.brandDescription}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.facebook.com/universinstrument/"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-amber-400 transition-colors duration-200"
              >
                <Facebook className="w-5 h-5" />
              </a>

              <a
                href="https://www.linkedin.com/in/univers-instrument-service-b81575267/"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-amber-400 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-2.5v-8.99h2.5v8.99zm-1.25-10.25c-.8 0-1.45-.65-1.45-1.45 0-.8.65-1.45 1.45-1.45s1.45.65 1.45 1.45c0 .8-.65 1.45-1.45 1.45zm13 10.25h-2.5v-4.5c0-1.07-.02-2.45-1.5-2.45-1.5 0-1.73 1.17-1.73 2.38v4.57h-2.5v-8.99h2.4v1.23h.03c.33-.63 1.14-1.3 2.36-1.3 2.52 0 2.99 1.66 2.99 3.82v5.24z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-5">
              {t.footer.explore}
            </h4>
            <nav className="space-y-2.5">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-white/70 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-5">
              {t.footer.contactTitle}
            </h4>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-white">
                    {t.footer.phone}
                  </span>
                </div>
                <div className="pl-6 space-y-1">
                  <a
                    href="tel:0666166945"
                    className="block text-sm text-white/70 hover:text-white transition-colors"
                  >
                    0666-166945
                  </a>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-white">
                    {t.footer.email}
                  </span>
                </div>
                <a
                  href="mailto:uis.instruments@gmail.com"
                  className="pl-6 block text-sm text-white/70 hover:text-white transition-colors break-all"
                >
                  uis.instruments@gmail.com
                </a>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-white">
                    {t.footer.address}
                  </span>
                </div>
                <p className="pl-6 text-sm text-white/70 leading-relaxed">
                  {t.footer.addressLine1}
                  <br />
                  {t.footer.addressLine2}
                  <br />
                  {t.footer.addressLine3}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-white/60">
            <p>{t.footer.copyright}</p>
            <div className="flex items-center gap-4">
              <a href="/terms" className="hover:text-white transition-colors">
                {t.footer.terms}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
