"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import FloatingContact from "@/components/floating-contact"
import PageHero from "@/components/page-hero"
import { Container } from "@/components/ui/container"
import ProductsGrid from "@/components/products-grid"
import SearchFilter, { type Filters } from "@/components/search-filter"
import { products, getTranslatedProduct, type Product } from "@/lib/products-data"
import { useLanguage } from "@/components/language-provider"
import { Loader2 } from "lucide-react"

import { useRouter, usePathname, useSearchParams } from "next/navigation"

function ProductsContent() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchParam = searchParams.get('q')
  
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState<Filters>({
    search: searchParam ?? "",
    condition: "all"
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = () => {
      setIsLoading(true)
      // Products are local now
      const localProducts = products.map(p => getTranslatedProduct(p, language))
      setAllProducts(localProducts)
      setIsLoading(false)
    }

    fetchProducts()
  }, [language])

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      // Price filtering
      if (filters.minPrice != null && p.price < filters.minPrice) return false
      if (filters.maxPrice != null && p.price > filters.maxPrice) return false

      // Condition filtering
      if (filters.condition && filters.condition !== "all") {
        if (p.condition !== filters.condition) return false
      }

      // Search filtering
      if (filters.search) {
        const searchStr = filters.search.toLowerCase()
        const hay = (p.name + " " + p.description).toLowerCase()
        if (!hay.includes(searchStr)) return false
      }

      return true
    })
  }, [allProducts, filters])

  useEffect(() => {
    if (searchParam && filters.search !== searchParam) {
      setFilters(prev => ({ ...prev, search: searchParam }))
    }
  }, [searchParam])

  const handleFilterChange = (newFilters: Filters) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newFilters.search) {
      params.set('q', newFilters.search)
    } else {
      params.delete('q')
    }
    
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.replace(newUrl, { scroll: false })

    setFilters(newFilters)
  }

  return (
    <main className="w-full">
      <Header />
      <PageHero 
        title={t.header.products} 
        backgroundImage="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1170&auto=format&fit=crop"
      />

      <section className="py-12 md:py-20 bg-white">
        <Container className="max-w-7xl px-4 md:px-8">
          <SearchFilter 
            onChange={handleFilterChange} 
            initial={{ 
              search: searchParam ?? "",
              condition: "all"
            }} 
          />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-6" />
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Initializing Inventory...</p>
            </div>
          ) : (
            <ProductsGrid products={filteredProducts} />
          )}
        </Container>
      </section>

      <Footer />
      <FloatingContact />
    </main>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
      <ProductsContent />
    </Suspense>
  )
}
