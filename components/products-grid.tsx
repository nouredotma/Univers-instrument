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
    <div className="products-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
      {products.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <Package className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Products Found</h3>
          <p className="text-sm mx-auto max-w-sm font-medium text-neutral-500">
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
              <div className="relative aspect-square overflow-hidden bg-slate-50 rounded-xs md:rounded-md rounded-b-none md:rounded-b-none">
                <Image
                  src={product.mainImage || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-0.5 md:py-1 rounded-none  rounded-bl-md  text-[10px] md:text-xs font-bold z-10 shadow-sm">
                  Stock: {product.stock}
                </div>
              </div>

              {/* Content Section */}
              <div className="py-2 md:py-3 flex flex-col grow">
                <div className="flex mb-1">
                  <h3 className="text-sm md:text-lg font-bold text-black group-hover:text-primary transition-colors line-clamp-1 w-full">
                    {product.name}
                  </h3>
                </div>

                <p className="text-[10px] md:text-sm text-black font-light mb-1 line-clamp-2">
                  {product.shortDescription}
                </p>

                {/* Bottom Row */}
                <div className="mt-auto flex items-center justify-between pt-1 md:pt-2">
                  <div className="bg-primary text-white px-2 py-2 md:px-3 md:py-2.5 rounded-xs md:rounded-sm text-[10px] md:text-sm font-medium">
                    View Product
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    {product.oldPrice && (
                      <span className="text-[10px] md:text-sm text-neutral-400 line-through font-light leading-none">
                        €{product.oldPrice}
                      </span>
                    )}
                    <span className="text-sm md:text-lg font-bold text-black leading-none">
                      €{product.price}
                    </span>
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
