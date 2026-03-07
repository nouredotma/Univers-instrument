"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import ProductsGrid from "./products-grid"
import { useLanguage } from "@/components/language-provider"
import { bestSellers, getTranslatedProduct, type Product } from "@/lib/products-data"
import { Loader2 } from "lucide-react"

export default function OurProducts() {
  const { t, language } = useLanguage()
  const [bestProducts, setBestProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBestProducts = () => {
      setIsLoading(true)
      
      // Get best products from local data
      const localProducts = bestSellers
        .map(product => getTranslatedProduct(product, language))
      
      setBestProducts(localProducts)
      setIsLoading(false)
    }

    fetchBestProducts()
  }, [language])

  if (isLoading) {
    return (
      <section className="w-full py-20 bg-white">
        <div className="max-w-full mx-auto px-4 md:px-12">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-full mx-auto px-4 md:px-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg md:text-3xl font-bold text-black">{t.bestOffers.sectionTitle}</h2>
          <Link href="/products" className="bg-primary hover:bg-primary/90 transition-colors text-white px-4 py-2.5 rounded-xs md:rounded-sm text-xs md:text-sm font-medium">
            View all products
          </Link>
        </div>

        {bestProducts.length > 0 ? (
          <div className="w-full">
            <ProductsGrid products={bestProducts} />
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}