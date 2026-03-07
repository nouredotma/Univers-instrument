"use client"

import { memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Package } from "lucide-react"
import type { Product } from "@/lib/products-data"
import { useLanguage } from "@/components/language-provider"
import { motion } from "framer-motion"

interface ProductsGridProps {
  products: Product[]
}

const ProductsGrid = memo(function ProductsGrid({ products }: ProductsGridProps) {
  const { t } = useLanguage()

  return (
    <div className="products-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              className="group block relative bg-white transition-all duration-300 h-full flex flex-col"
            >
              {/* Image Section */}
              <div className="relative aspect-square overflow-hidden bg-slate-50 rounded-md rounded-b-none">
                <Image
                  src={product.mainImage || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Content Section */}
              <div className="py-3 flex flex-col grow">
                <div className="flex justify-between items-start mb-1 gap-1">
                  <h3 className="text-lg font-bold text-black group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="text-emerald-500 font-bold whitespace-nowrap text-sm mt-1">
                    Stock: {product.stock}
                  </div>
                </div>

                <p className="text-sm text-black font-light mb-2 line-clamp-2 leading-relaxed">
                  {product.shortDescription}
                </p>

                {/* Bottom Row */}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="bg-primary text-white px-3 py-2.5 rounded-sm text-sm font-medium">
                    View Product
                  </div>
                  <div className="text-lg font-bold text-black">
                    €{product.price}
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
