"use client"

import type React from "react"

import FloatingContact from "@/components/floating-contact"
import Footer from "@/components/footer"
import Header from "@/components/header"
import { useLanguage } from "@/components/language-provider"
import PageHero from "@/components/page-hero"
import { Container } from "@/components/ui/container"
import { useSiteSettings } from "@/hooks/use-site-settings"
import { ArrowRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const { t } = useLanguage()
  const { settings } = useSiteSettings()
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 4000)
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    }, 1000)
  }

  const contactInfo = [
    {
      icon: Phone,
      title: t.contact.callUs,
      value: "0666-166945",
      action: "tel:0666166945",
    },
    {
      icon: Mail,
      title: t.contact.emailUs,
      value: "uis.instruments@gmail.com",
      action: "mailto:uis.instruments@gmail.com",
    },
    {
      icon: MapPin,
      title: t.contact.visitUs,
      value: "Bloc B, N 255 Hay assaka Tikiouine",
      subValue: "Agadir, Morocco 80000",
    },
    {
      icon: Clock,
      title: t.contact.workingHours,
      value: t.contact.workingDays,
      subValue: t.contact.workingTime,
    },
  ]

  const subjects = [
    { value: "General Inquiry", label: t.contact.subjects.generalInquiry },
    { value: "Tour Booking", label: t.contact.subjects.tourBooking },
    { value: "Custom Package", label: t.contact.subjects.customPackage },
    { value: "Group Travel", label: t.contact.subjects.groupTravel },
    { value: "Transportation", label: t.contact.subjects.transportation },
    { value: "Other", label: t.contact.subjects.other },
  ]

  const whyChooseUsItems = [
    t.contact.whyChooseUsItems.localExpertise,
    t.contact.whyChooseUsItems.personalizedExperiences,
    t.contact.whyChooseUsItems.support247,
    t.contact.whyChooseUsItems.bestPrice,
  ]

  return (
    <main className="w-full">
      <Header />
      <PageHero title={t.contact.pageTitle} backgroundImage="https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/07/a5/17/55.jpg" />

      <section className="py-16 md:py-24 bg-linear-to-b from-background to-muted/20">
        <Container className="max-w-7xl mx-auto px-2 md:px-8">
          {/* Quick Contact Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.action || "#"}
                className="group relative bg-card rounded-xl p-4 md:p-5 border border-border/50 hover:border-primary/40 hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col items-center text-center gap-3 w-full">
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <info.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <div className="w-full overflow-hidden">
                    <p className="text-xs text-muted-foreground mb-1">{info.title}</p>
                    <p className="text-[10px] md:text-sm font-medium text-foreground leading-tight break-all">{info.value}</p>
                    {info.subValue && (
                      <p className="text-xs text-muted-foreground mt-0.5">{info.subValue}</p>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left Side - Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {t.contact.letsTalk}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  {t.contact.readyToPlan} <span className="text-primary">{t.contact.adventure}</span>
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t.contact.contactDescription}
                </p>
              </div>

              {/* Why Choose Us */}
              <div className="bg-linear-to-br from-primary/5 via-primary/3 to-transparent rounded-xl p-5 border border-primary/10">
                <h3 className="font-semibold text-foreground mb-3 text-sm">{t.contact.whyChooseUs}</h3>
                <ul className="space-y-2.5">
                  {whyChooseUsItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Response Time */}
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-sm text-green-700 dark:text-green-400">
                  {t.contact.responseTime} <span className="font-semibold">{t.contact.under2Hours}</span>
                </p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-medium text-foreground mb-2">
                        {t.contact.formLabels.fullName}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                        placeholder={t.contact.formLabels.namePlaceholder}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-medium text-foreground mb-2">
                        {t.contact.formLabels.phoneNumber}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                        placeholder={t.contact.formLabels.phonePlaceholder}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-foreground mb-2">
                        {t.contact.formLabels.emailAddress}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                        placeholder={t.contact.formLabels.emailPlaceholder}
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-xs font-medium text-foreground mb-2">
                        {t.contact.formLabels.subject}
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">{t.contact.formLabels.selectTopic}</option>
                        {subjects.map((subject) => (
                          <option key={subject.value} value={subject.value}>
                            {subject.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-medium text-foreground mb-2">
                      {t.contact.formLabels.yourMessage}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
                      placeholder={t.contact.formLabels.messagePlaceholder}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-6 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-70 transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t.contact.sending}
                      </>
                    ) : (
                      <>
                        {t.contact.sendMessage}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>

                  {submitted && (
                    <div className="p-3.5 rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 animate-in fade-in slide-in-from-bottom-2">
                      <p className="text-sm text-green-700 dark:text-green-400 font-medium flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</span>
                        {t.contact.messageSent}
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-12 md:mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">{t.contact.ourLocation}</h2>
              <a
                href="https://maps.google.com/?q=Rue+Bani+marine,+Marrakech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
              >
                {t.contact.getDirections}
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="rounded-xl overflow-hidden border border-border shadow-sm h-72 md:h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3440.07662588147!2d-9.5298453!3d30.4049876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3c80ca86a87cb%3A0xc3b5ed7f12e86bf4!2sHay%20Assaka%20Tikiouine%2C%20Agadir!5e0!3m2!1sen!2sma!4v1709400000000!5m2!1sen!2sma"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Container>
      </section>

      <Footer />
      <FloatingContact />
    </main>
  )
}
