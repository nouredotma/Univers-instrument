"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import FloatingContact from "@/components/floating-contact"
import PageHero from "@/components/page-hero"
import { Container } from "@/components/ui/container"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
export default function TermsPage() {
  const { t } = useLanguage()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const sections = [
    {
      title: t.terms.sections.introduction,
      content: t.terms.sections.introductionContent,
    },
    {
      title: t.terms.sections.object,
      content: t.terms.sections.objectContent,
      subContent: t.terms.sections.objectSubContent,
    },
    {
      title: t.terms.sections.paymentMethod,
      content: t.terms.sections.paymentMethodContent,
      items: [
        t.terms.sections.paymentMethodItems.creditCards,
        t.terms.sections.paymentMethodItems.digitalWallets,
        t.terms.sections.paymentMethodItems.cashPayment,
      ],
      note: t.terms.sections.paymentMethodNote,
    },
    {
      title: t.terms.sections.paymentSecurity,
      content: t.terms.sections.paymentSecurityContent,
    },
    {
      title: t.terms.sections.proofOfTransactions,
      content: t.terms.sections.proofOfTransactionsContent,
    },
    {
      title: t.terms.sections.cancellationRefunds,
      content: t.terms.sections.cancellationRefundsContent,
    },
    {
      title: t.terms.sections.liability,
      content: t.terms.sections.liabilityContent,
    },
    {
      title: t.terms.sections.intellectualProperty,
      content: t.terms.sections.intellectualPropertyContent,
    },
  ]

  return (
    <main className="w-full">
      <Header />
      <PageHero title={t.terms.pageTitle} backgroundImage="/2.jpg" />
      <section className="py-20 md:py-28 bg-background">
        <Container className="max-w-4xl mx-auto px-4">
          <div className="mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t.terms.intro}
            </p>
          </div>

          <div className="space-y-3">
            {sections.map((section, index) => (
              <div
                key={index}
                className="border border-border rounded-lg overflow-hidden transition-all duration-300 hover:border-primary/50"
              >
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 bg-card hover:bg-card/80 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 text-left flex-1">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                      {index + 1}
                    </div>
                    <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {section.title}
                    </h2>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-all duration-300 shrink-0 ${
                      expandedIndex === index ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-6 py-5 bg-background border-t border-border space-y-4">
                    <p className="leading-relaxed text-muted-foreground">{section.content}</p>

                    {section.items && (
                      <ul className="list-disc list-inside space-y-2 ml-2">
                        {section.items.map((item, i) => (
                          <li key={i} className="leading-relaxed text-muted-foreground">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.subContent && (
                      <p className="leading-relaxed text-sm text-muted-foreground">{section.subContent}</p>
                    )}

                    {section.note && (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
                        <p className="text-sm font-medium text-primary">{section.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-12 border-t border-border">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold text-foreground mb-3">{t.terms.questionsTitle}</h3>
              <p className="text-muted-foreground mb-6">
                {t.terms.questionsDescription}
              </p>
              <a
                href="/contact"
                className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                {t.terms.getInTouch}
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
