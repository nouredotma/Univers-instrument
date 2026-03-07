"use client"

import { Container } from "@/components/ui/container"
import { CheckCircle, ArrowRight, Globe, Users, Award, Zap } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"

export default function AboutUs() {
  const { t } = useLanguage()

  const highlights = [
    { icon: Globe, label: t.about.countries, value: "50+" },
    { icon: Users, label: t.about.travelers, value: "10K+" },
    { icon: Award, label: t.about.experience, value: "15 yrs" },
    { icon: Zap, label: t.about.guides, value: "100+" },
  ]

  const features = [
    t.about.features.hiddenGems,
    t.about.features.personalizedItineraries,
    t.about.features.excellenceInDetail,
    t.about.features.support247,
    t.about.features.transparentPricing,
    t.about.features.intimateGroupTours,
  ]

  return (
    <section className="py-16 md:py-20 bg-white">
      <Container className="max-w-full mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          {/* Image Column */}
          <div className="lg:col-span-2 order-1 lg:order-1">
            <div className="relative">
              <div className="aspect-square overflow-hidden">
                <Image
                  src="/about-us-lab.png"
                  alt="Laboratory Equipment"
                  fill
                  className="object-cover rounded-xl md:rounded-2xl"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-4">
            <span className="text-base md:text-lg font-semibold">{t.about.ourStory}</span>
          </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-5 leading-tight">
              {t.about.heroTitle} <span className="text-primary">{t.about.heroTitleHighlight}</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
              {t.about.heroDescription1}
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
              {t.about.heroDescription2}
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {features.map((item, index) => (
                <div key={index} className="flex items-center gap-2.5">
                  <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary shrink-0" />
                  <span className="text-xs md:text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>

            <a
              href="/contact"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              {t.about.startJourney} <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}