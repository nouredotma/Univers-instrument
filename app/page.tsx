"use client"

import Header from "@/components/header"
import Hero from "@/components/hero"
import AboutUs from "@/components/about-us"
import OurBestOffers from "@/components/our-best-offers"
import Testimonials from "@/components/testimonials"
import Footer from "@/components/footer"
import FloatingContact from "@/components/floating-contact"

import Partners from "@/components/partners"

export default function HomePage() {
  return (
    <main className="w-full">
      <Header />
      <Hero />
      <AboutUs />
      <Partners />
      <OurBestOffers />
      <Testimonials />
      <Footer />
      <FloatingContact />
    </main>
  )
}
