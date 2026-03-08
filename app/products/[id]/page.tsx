"use client"

import { useLanguage } from "@/components/language-provider"
import { getProductById, getTranslatedProduct } from "@/lib/products-data"
import { notFound } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import FloatingContact from "@/components/floating-contact"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowLeft, Package, Minus, Plus, Truck, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { use, useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import OurProducts from "@/components/our-products"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { language } = useLanguage()
  const resolvedParams = use(params)
  const productRaw = getProductById(resolvedParams.id)

  if (!productRaw) {
    notFound()
  }

  const product = getTranslatedProduct(productRaw, language)
  const [activeImage, setActiveImage] = useState(product.mainImage)

  const [quantity, setQuantity] = useState(1)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const allImages = [product.mainImage, ...product.thumbnailImages].filter(Boolean)

  const handleDecreaseQuantity = () => {
    if (quantity > 1) setQuantity(q => q - 1)
  }

  const handleIncreaseQuantity = () => {
    if (quantity < product.stock) setQuantity(q => q + 1)
  }

  const handlePrevImage = () => {
    const currentIndex = allImages.indexOf(activeImage)
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length
    setActiveImage(allImages[prevIndex])
  }

  const handleNextImage = () => {
    const currentIndex = allImages.indexOf(activeImage)
    const nextIndex = (currentIndex + 1) % allImages.length
    setActiveImage(allImages[nextIndex])
  }

  const thumbnailsRef = useRef<HTMLDivElement>(null)

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailsRef.current) {
      const scrollAmount = 200
      thumbnailsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Handle keyboard navigation for lightbox
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isLightboxOpen) return
    if (e.key === "ArrowLeft") handlePrevImage()
    if (e.key === "ArrowRight") handleNextImage()
    if (e.key === "Escape") setIsLightboxOpen(false)
  }

  // Prevent scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isLightboxOpen])

  return (
    <main 
      className="w-full bg-neutral-50/50 min-h-screen"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <Header forceScrolled />
      
      {/* Breadcrumb / Back Button */}
      <div className="pt-32 pb-4">
        <Container className="max-w-full mx-auto px-4 md:px-12">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Products
          </Link>
        </Container>
      </div>

      <section className="pb-10 md:pb-20">
        <Container className="max-w-full mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 md:gap-8 items-start">
            
            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-5 flex flex-col gap-1">
              <motion.div 
                layoutId="main-image"
                className="relative aspect-square rounded-xs md:rounded-md overflow-hidden bg-white border border-neutral-200 w-full shrink-0 group/gallery"
              >
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  className="object-cover cursor-zoom-in"
                  priority
                  onClick={() => setIsLightboxOpen(true)}
                />

                {allImages.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => {
                        e.preventDefault()
                        handlePrevImage()
                      }}
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-md border border-white/50 text-neutral-900 opacity-100 lg:opacity-0 lg:group-hover/gallery:opacity-100 transition-all hover:bg-white/60 shadow-sm z-10 cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault()
                        handleNextImage()
                      }}
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-md border border-white/50 text-neutral-900 opacity-100 lg:opacity-0 lg:group-hover/gallery:opacity-100 transition-all hover:bg-white/60 shadow-sm z-10 cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </>
                )}
              </motion.div>

              {allImages.length > 1 && (
                <div className="relative group/thumbs w-full">
                  <div 
                    ref={thumbnailsRef}
                    className="flex gap-3 overflow-x-auto p-1 scrollbar-hide scroll-smooth"
                  >
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xs md:rounded-md overflow-hidden transition-all duration-300 shrink-0 cursor-pointer ${
                          activeImage === img 
                            ? "ring-2 ring-primary ring-offset-1 ring-offset-neutral-50" 
                            : "border border-neutral-200 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image src={img} alt={`${product.name} thumbnail ${idx}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>

                  {/* Thumbnail Navigation Arrows - Desktop Only */}
                  <button 
                    onClick={() => scrollThumbnails('left')}
                    className="absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 border border-neutral-200 text-neutral-900 opacity-0 group-hover/thumbs:opacity-100 transition-all shadow-md z-10 hidden lg:flex cursor-pointer hover:bg-white hover:scale-110"
                    aria-label="Scroll thumbnails left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => scrollThumbnails('right')}
                    className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 border border-neutral-200 text-neutral-900 opacity-0 group-hover/thumbs:opacity-100 transition-all shadow-md z-10 hidden lg:flex cursor-pointer hover:bg-white hover:scale-110"
                    aria-label="Scroll thumbnails right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Product Info & CTA */}
            <div className="lg:col-span-7 flex flex-col pt-2 lg:pt-0">
              <div className="flex flex-col gap-4 md:gap-5 lg:max-w-3xl">
                
                {/* 1. Product Name & Stock */}
                <div className="flex items-center justify-between gap-4">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-900 tracking-tight font-fauna">
                    {product.name}
                  </h1>
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 border border-emerald-100 shrink-0 rounded-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>In Stock ({product.stock})</span>
                  </div>
                </div>

                {/* 2. Category & Condition */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] md:text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500 tracking-wider">Category:</span>
                    <span className="font-semibold text-neutral-900 capitalize">{product.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500 tracking-wider">Condition:</span>
                    <span className="font-semibold text-neutral-900">{product.category === 'used' ? 'Used' : 'New'}</span>
                  </div>
                </div>

                {/* 3. Pricing (Old, New, Savings) */}
                <div className="flex flex-col gap-1 pt-0.5">
                  {product.oldPrice && (
                    <span className="text-sm md:text-base font-light text-neutral-400 line-through">
                      {product.oldPrice} MAD
                    </span>
                  )}
                  <span className="text-2xl md:text-2xl font-extrabold text-neutral-900 tracking-tight font-fauna">
                    {product.price} MAD
                  </span>
                  {product.oldPrice && (
                    <div className="inline-flex w-fit  text-green-500 px-0 text-[10px] md:text-xs font-bol">
                      Save {product.oldPrice - product.price} MAD
                    </div>
                  )}
                </div>

                {/* 4. Short Description */}
                <p className="text-sm md:text-base text-neutral-600 leading-relaxed font-light">
                  {product.shortDescription}
                </p>

                {/* 5. Delivery Div */}
                <div className="border-l-4 border-green-500 bg-green-50 p-2.5 flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4" />
                   </div>
                   <div className="space-y-0.5">
                      <p className="text-xs md:text-sm font-bold text-green-900">Nationwide Delivery</p>
                      <p className="text-[10px] md:text-xs font-medium text-emerald-600">Available in all Morocco</p>
                   </div>
                </div>

                {/* 6. Quantity Selector */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-neutral-900 text-[10px] md:text-xs">Quantity</span>
                  <div className="flex border border-neutral-200 rounded-xs overflow-hidden bg-white w-fit">
                    <button 
                      onClick={handleDecreaseQuantity}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 disabled:opacity-30 transition-all cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-12 h-10 flex items-center justify-center text-sm font-medium text-neutral-800 font-mono border-x border-neutral-200">
                      {quantity}
                    </div>
                    <button 
                      onClick={handleIncreaseQuantity}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 disabled:opacity-30 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 7. CTA Buttons */}
                <div className="flex flex-row gap-2 pt-0">
                  <Button className="flex-2 h-12 md:h-14 rounded-xs text-xs md:text-sm font-bold" asChild>
                    <a href={`mailto:uis.instruments@gmail.com?subject=Order for ${product.name}&body=I would like to order ${quantity}x ${product.name}.`}>
                      <Package className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Order Now
                    </a>
                  </Button>
                  <Button className="flex-1 h-12 md:h-14 rounded-xs text-xs md:text-sm font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white" asChild>
                    <a href={`https://wa.me/212666166945?text=Hello, I'm interested in ordering ${quantity}x ${product.name}`}>
                      <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                  </Button>
                </div>

                {/* 8. Long Description */}
                <div className="pt-4 border-t border-neutral-200 flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-neutral-900 tracking-tight font-fauna">Overview</h3>
                  <div className="text-sm md:text-base text-neutral-600 leading-relaxed space-y-4 font-light">
                    {product.longDescription}
                  </div>
                </div>

                {/* 9. Specifications Table */}
                {product.specificationsTable && (
                  <div className="pt-8 border-t border-neutral-200 flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-neutral-900 tracking-tight font-fauna">Technical Specifications</h3>
                    <div className="rounded-xs border border-neutral-200 overflow-hidden bg-white">
                      <Table className="text-[10px] md:text-xs">
                        <TableHeader className="bg-neutral-50/50">
                          <TableRow className="hover:bg-transparent">
                            {product.specificationsTable.headers.map((header, index) => (
                              <TableHead key={index} className="font-bold text-neutral-900 border-r last:border-r-0 h-10 px-2 md:px-4">
                                {header}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {product.specificationsTable.rows.map((row, rowIndex) => (
                            <TableRow key={rowIndex} className="last:border-0">
                              {row.map((cell, cellIndex) => (
                                <TableCell key={cellIndex} className="border-r last:border-r-0 text-neutral-600 py-2.5 px-2 md:px-4">
                                  {cell}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* Lightbox / Image Zoom */}
      {isLightboxOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-10"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 cursor-pointer z-[110]"
            onClick={() => setIsLightboxOpen(false)}
          >
            <Plus className="w-8 h-8 rotate-45" />
          </button>

          <div className="relative w-full max-w-5xl aspect-square md:aspect-[4/3] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full h-full"
            >
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            {allImages.length > 1 && (
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-4 md:contents">
                <button 
                  onClick={handlePrevImage}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer border border-white/30 backdrop-blur-md z-50 md:absolute md:top-1/2 md:-translate-y-1/2 md:-left-16"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <button 
                  onClick={handleNextImage}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer border border-white/30 backdrop-blur-md z-50 md:absolute md:top-1/2 md:-translate-y-1/2 md:-right-16"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <OurProducts />

      <Footer />
      <FloatingContact />
    </main>
  )
}
