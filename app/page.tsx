"use client"

import Header from "@/components/header"
import Hero from "@/components/hero"
import AboutUs from "@/components/about-us"
import Partners from "@/components/partners"
import OurProducts from "@/components/our-products"
import Testimonials from "@/components/testimonials"
import Footer from "@/components/footer"
import FloatingContact from "@/components/floating-contact"


export default function HomePage() {
  return (
    <main className="w-full">
      <Header />
      <Hero />
      <AboutUs />
      <Partners />
      <OurProducts />
      <Testimonials />
      <Footer />
      <FloatingContact />
    </main>
  )
}
