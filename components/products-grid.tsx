"use client"

import { useState, useMemo, memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShieldCheck, Package, ShoppingCart, Zap } from "lucide-react"
import type { Product } from "@/lib/products-data"
import { useLanguage } from "@/components/language-provider"
import { motion } from "framer-motion"

interface ProductsGridProps {
  products: Product[]
}

const ProductsGrid = memo(function ProductsGrid({ products }: ProductsGridProps) {
  const { t } = useLanguage()

  return (
    <div className="products-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Package className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">No Products Found</h3>
          <p className="text-slate-500 max-w-sm mx-auto font-medium">
            We couldn't find any instruments matching your current filters. Try resetting them.
          </p>
        </div>
      ) : (
        products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={`/products/${product.id}`}
              className="group block relative bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 h-full flex flex-col"
            >
              {/* Image Section */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={product.mainImage || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Condition Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
                    {product.condition}
                  </span>
                </div>

                {/* Stock Badge */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black shadow-lg border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    STOCK: {product.stock}
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                   <div className="bg-white text-primary px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      View Technical Specs
                   </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex flex-col grow">
                <div className="flex items-center gap-2 mb-3">
                   <ShieldCheck className="w-4 h-4 text-primary" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Guaranteed Quality</span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-1">
                  {product.name}
                </h3>

                <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Bottom Row */}
                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price starting at</span>
                    <span className="text-2xl font-black text-slate-900">€{product.price}</span>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))
      )}
    </div>
  )
})

export default ProductsGrid
