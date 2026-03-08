"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import FloatingContact from "@/components/floating-contact"
import PageHero from "@/components/page-hero"
import AboutUs from "@/components/about-us"
import { Container } from "@/components/ui/container"
import { FlaskConical, Users, Award, Microscope, CheckCircle, Globe, Zap, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
export default function AboutPage() {
  const { t } = useLanguage()

  const values = [
    {
      icon: FlaskConical,
      title: t.about.values.localExpertise,
      description: t.about.values.localExpertiseDesc,
    },
    {
      icon: Users,
      title: t.about.values.personalizedService,
      description: t.about.values.personalizedServiceDesc,
    },
    {
      icon: Award,
      title: t.about.values.qualityExcellence,
      description: t.about.values.qualityExcellenceDesc,
    },
    {
      icon: Microscope,
      title: t.about.values.passionForTravel,
      description: t.about.values.passionForTravelDesc,
    },
  ]

  return (
    <main className="w-full">
      <Header />
      <PageHero title={t.about.pageTitle} backgroundImage="/2.jpg" />

      <AboutUs />

      {/* Core Values Section */}
      <section className="py-14 md:py-18 bg-white">
        <Container className="max-w-full mx-auto px-4 md:px-12">
          <div className="text-center mb-10">
            <span className="inline-block text-sm font-medium text-primary mb-2 tracking-wide uppercase">
              {t.about.valuesTitle}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-fauna">{t.about.valuesSubtitle}</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative bg-background rounded-xl px-2 py-2 md:p-5 border border-border/60 hover:border-primary transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-all duration-300">
                  <value.icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors font-fauna">
                  {value.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-white">
        <Container className="max-w-4xl mx-auto px-2 md:px-8">
          <div className="bg-linear-to-br from-primary to-primary/90 rounded-2xl p-5 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div>
                <h2 className="text-xl md:text-3xl font-bold text-white mb-2 font-fauna">{t.about.ctaTitle}</h2>
                <p className="text-sm md:text-base text-white/80">
                  {t.about.ctaDescription}
                </p>
              </div>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/95 hover:gap-3 transition-all duration-300 shadow-none shrink-0 font-fauna"
              >
                {t.about.getStarted} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
      <FloatingContact />
    </main>
  )
}
