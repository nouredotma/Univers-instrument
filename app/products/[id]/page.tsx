"use client"

import { useLanguage } from "@/components/language-provider"
import { getProductById, getTranslatedProduct } from "@/lib/products-data"
import { notFound } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import FloatingContact from "@/components/floating-contact"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Package, ShieldCheck, ArrowLeft, Mail, Phone, Info, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { use, useState } from "react"
import { motion } from "framer-motion"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { language } = useLanguage()
  const resolvedParams = use(params)
  const productRaw = getProductById(resolvedParams.id)

  if (!productRaw) {
    notFound()
  }

  const product = getTranslatedProduct(productRaw, language)
  const [activeImage, setActiveImage] = useState(product.mainImage)

  const allImages = [product.mainImage, ...product.thumbnailImages].filter(Boolean)

  return (
    <main className="w-full bg-slate-50/50 min-h-screen">
      <Header />
      
      {/* Breadcrumb / Back Button */}
      <div className="pt-56 pb-6 px-4 md:px-8">
        <Container className="max-w-full mx-auto px-4 md:px-12">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            BACK TO PRODUCTS
          </Link>
        </Container>
      </div>

      <section className="pb-20">
        <Container className="max-w-full mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
            
            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div 
                layoutId="main-image"
                className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-slate-200"
              >
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-6 left-6 flex flex-col gap-3">
                   <div className="bg-primary/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/20">
                    {product.category}
                  </div>
                </div>
              </motion.div>

              {allImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all duration-300 shrink-0 ${
                        activeImage === img ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt={`${product.name} thumbnail ${idx}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Info & CTA */}
            <div className="lg:col-span-5 flex flex-col pt-4">
              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1.5 text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>IN STOCK ({product.stock})</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                      <ShieldCheck className="w-4 h-4" />
                      <span>GUARANTEED QUALITY</span>
                   </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                  {product.name}
                </h1>

                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  {product.longDescription}
                </p>

                <div className="p-8 rounded-3xl bg-white border border-slate-200 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap className="w-20 h-20 text-primary rotate-12" />
                  </div>
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Request your quote today</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-primary">€{product.price}</span>
                    <span className="text-slate-400 font-bold text-sm uppercase ml-2">Excl. VAT</span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 mt-8">
                     <Button size="lg" className="h-16 rounded-2xl text-base font-black uppercase tracking-widest transition-all" asChild>
                        <a href="tel:0666166945">
                          <Phone className="w-5 h-5 mr-3" />
                          Call Now for Details
                        </a>
                     </Button>
                     <Button size="lg" variant="outline" className="h-16 rounded-2xl border-2 text-base font-black uppercase tracking-widest hover:bg-slate-50 transition-all" asChild>
                        <a href={`mailto:uis.instruments@gmail.com?subject=Inquiry about ${product.name}`}>
                          <Mail className="w-5 h-5 mr-3" />
                          Email Inquiry
                        </a>
                     </Button>
                  </div>
                  
                  <p className="text-center mt-6 text-xs text-slate-400 font-bold flex items-center justify-center gap-2">
                    <Info className="w-4 h-4" />
                    AVERAGE RESPONSE TIME: UNDER 2 HOURS
                  </p>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 gap-4">
                 <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/50 border border-slate-200">
                    <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900 uppercase tracking-wide">Fast Setup</h4>
                      <p className="text-xs font-medium text-slate-500">Ready for deployment in your lab within 24-48 hours.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/50 border border-slate-200">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900 uppercase tracking-wide">Expert Support</h4>
                      <p className="text-xs font-medium text-slate-500">Full technical assistance from our specialized engineers.</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="mt-24 pt-20 border-t border-slate-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-8">
                <div className="space-y-6">
                  <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
                    <span className="h-1.5 w-12 bg-primary rounded-full"></span>
                    Overview
                  </h2>
                  <div className="prose prose-slate prose-lg max-w-none font-medium text-slate-600">
                    {product.longDescription}
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="lg:col-span-4 space-y-8">
                <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
                   <div className="absolute -bottom-10 -right-10 opacity-20 transform rotate-12">
                      <div className="relative h-24 w-40">
                        <Image src="/whitelogo.png" alt="UIS" fill className="object-contain" />
                      </div>
                   </div>
                   <h3 className="text-xl font-black border-b border-white/10 pb-4 mb-6 uppercase tracking-widest">Global Support</h3>
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">Deployment</p>
                        <p className="text-white/80 font-medium">Available for all regions in Morocco with special focus on the Souss-Massa region.</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">Maintenance</p>
                        <p className="text-white/80 font-medium">On-site maintenance contracts available for periodic inspections.</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">Guarantee</p>
                        <p className="text-white/80 font-medium">Minimum 12 months standard guarantee on all new high-precision instruments.</p>
                      </div>
                   </div>
                   
                   <Button variant="outline" className="w-full mt-10 rounded-xl bg-white/5 border-white/20 text-white hover:bg-white/10 h-14 font-black uppercase tracking-widest text-xs" asChild>
                      <Link href="/contact">Visit Service Center</Link>
                   </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
      <FloatingContact />
    </main>
  )
}
