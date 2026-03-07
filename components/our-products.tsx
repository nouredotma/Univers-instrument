"use client"

import { useState, useEffect } from "react"
import ProductsGrid from "./products-grid"
import { useLanguage } from "@/components/language-provider"
import { products, getTranslatedProduct, type Product } from "@/lib/products-data"
import { Loader2 } from "lucide-react"

export default function OurProducts() {
  const { t, language } = useLanguage()
  const [bestProducts, setBestProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBestProducts = () => {
      setIsLoading(true)
      
      // Get all products from local data
      const localProducts = products
        .map(product => getTranslatedProduct(product, language))
      
      setBestProducts(localProducts)
      setIsLoading(false)
    }

    fetchBestProducts()
  }, [language])

  if (isLoading) {
    return (
      <section className="w-full py-20 px-2 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-20 px-2 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-4">
            <span className="text-lg font-semibold">{t.bestOffers.sectionTitle}</span>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t.bestOffers.sectionDescription}
          </p>
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