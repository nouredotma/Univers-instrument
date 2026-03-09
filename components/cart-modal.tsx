"use client"

import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2, X, Package, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function CartModal() {
  const { items, removeFromCart, updateQuantity, clearCart, isCartOpen, toggleCartModal, cartStep, setCartStep, totalPrice } = useCart()
  const { t } = useLanguage()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    message: "",
  })
  const [orderPlaced, setOrderPlaced] = useState(false)

  // Handle body lock and back button
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden"
      
      // Push state to handle back button
      window.history.pushState({ modal: "cart" }, "")
      
      const handlePopState = () => {
        toggleCartModal(false)
      }

      window.addEventListener("popstate", handlePopState)
      
      return () => {
        document.body.style.overflow = "unset"
        window.removeEventListener("popstate", handlePopState)
      }
    }
  }, [isCartOpen, toggleCartModal])

  const handlePlaceOrder = () => {
    const productList = items
      .map(i => `- ${i.name} (x${i.quantity}) = ${i.price * i.quantity} MAD`)
      .join("\n")

    const body = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Address: ${formData.address}
City: ${formData.city}
Message: ${formData.message}

Products:
${productList}

Total: ${totalPrice} MAD
    `.trim()

    window.location.href = `mailto:uis.instruments@gmail.com?subject=New Order&body=${encodeURIComponent(body)}`

    setOrderPlaced(true)
    setTimeout(() => {
      clearCart()
      setOrderPlaced(false)
      setCartStep(1)
      toggleCartModal(false)
    }, 2000)
  }

  const isFormValid = formData.name && formData.email && formData.phone

  if (!isCartOpen) return null

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100"
            onClick={() => toggleCartModal(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[calc(100%-2rem)] md:w-full md:max-w-lg h-auto max-h-[70vh] bg-white rounded-sm z-101 flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white grow-0 shrink-0">
              <div className="flex items-center gap-2">
                {cartStep > 1 && !orderPlaced && (
                  <button
                    onClick={() => setCartStep(cartStep - 1)}
                    className="w-7 h-7 rounded-sm hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <div>
                  <h2 className="text-base md:text-lg font-bold text-gray-900 font-fauna leading-tight">
                    {cartStep === 1 && t.cart.myCart}
                    {cartStep === 2 && t.cart.orderForm}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => toggleCartModal(false)}
                className="w-7 h-7 rounded-sm hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
              <AnimatePresence mode="wait">
                {/* Order Placed Success */}
                {orderPlaced && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full py-12 px-6"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-base font-bold text-gray-900 font-fauna">{t.cart.orderPlaced}</p>
                  </motion.div>
                )}

                {/* Step 1: Cart Items */}
                {!orderPlaced && cartStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="p-3"
                  >
                    {items.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                          <ShoppingCart className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700">{t.cart.emptyCart}</p>
                        <p className="text-[11px] text-gray-500 mt-1 max-w-[200px]">{t.cart.emptyCartDesc}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {items.map(item => (
                          <motion.div
                            key={item.productId}
                            layout
                            className="flex gap-2.5 p-2 rounded-sm bg-gray-50 border border-gray-100"
                          >
                            <div className="relative w-12 h-12 rounded-sm overflow-hidden shrink-0 bg-white border border-gray-200">
                              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">{item.name}</h4>
                              <p className="text-[11px] md:text-xs font-bold text-primary mt-0.5">{item.price} MAD</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="flex items-center border border-gray-200 rounded-sm overflow-hidden bg-white">
                                  <button
                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                    className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                  >
                                    <Minus className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                  </button>
                                  <span className="w-6 md:w-8 text-center text-[11px] md:text-xs font-medium text-gray-800">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                    className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                  >
                                    <Plus className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                  </button>
                                </div>
                                <span className="text-[11px] md:text-xs font-bold text-gray-700 ml-auto">
                                  {item.price * item.quantity} MAD
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="self-start w-6 h-6 rounded-sm hover:bg-red-50 flex items-center justify-center text-red-500 hover:text-red-600 transition-colors shrink-0 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Order Form */}
                {!orderPlaced && cartStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="p-3"
                  >
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[11px] md:text-xs font-semibold text-gray-700 mb-0.5 block">
                          {t.cart.formName} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full h-9 md:h-11 px-3 rounded-sm border border-gray-200 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-colors pointer-events-auto"
                          placeholder={t.cart.formNamePlaceholder}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] md:text-xs font-semibold text-gray-700 mb-0.5 block">
                            {t.cart.formEmail} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full h-9 md:h-11 px-3 rounded-sm border border-gray-200 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-colors pointer-events-auto"
                            placeholder={t.cart.formEmailPlaceholder}
                          />
                        </div>
                        <div>
                          <label className="text-[11px] md:text-xs font-semibold text-gray-700 mb-0.5 block">
                            {t.cart.formPhone} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full h-9 md:h-11 px-3 rounded-sm border border-gray-200 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-colors pointer-events-auto"
                            placeholder={t.cart.formPhonePlaceholder}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] md:text-xs font-semibold text-gray-700 mb-0.5 block">
                            {t.cart.formAddress}
                          </label>
                          <input
                            type="text"
                            value={formData.address}
                            onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full h-9 md:h-11 px-3 rounded-sm border border-gray-200 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-colors pointer-events-auto"
                            placeholder={t.cart.formAddressPlaceholder}
                          />
                        </div>
                        <div>
                          <label className="text-[11px] md:text-xs font-semibold text-gray-700 mb-0.5 block">
                            {t.cart.formCity}
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full h-9 md:h-11 px-3 rounded-sm border border-gray-200 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-colors pointer-events-auto"
                            placeholder={t.cart.formCityPlaceholder}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] md:text-xs font-semibold text-gray-700 mb-0.5 block">
                          {t.cart.formMessage}
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                          className="w-full h-16 md:h-24 px-3 py-2 rounded-sm border border-gray-200 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-colors resize-none pointer-events-auto"
                          placeholder={t.cart.formMessagePlaceholder}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {!orderPlaced && (
              <div className="border-t border-gray-100 px-4 py-3 bg-white grow-0 shrink-0">
                {cartStep === 1 && items.length > 0 && (
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs md:text-sm text-gray-600">{t.cart.total}</span>
                    <span className="text-sm md:text-lg font-bold text-gray-900">{totalPrice} MAD</span>
                  </div>
                )}
                <div className="flex gap-2">
                  {cartStep === 1 && items.length > 0 && (
                    <Button
                      onClick={() => setCartStep(2)}
                      className="w-full h-10 md:h-12 rounded-sm text-xs md:text-sm font-bold cursor-pointer"
                    >
                      {t.cart.next}
                    </Button>
                  )}
                  {cartStep === 2 && (
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={!isFormValid}
                      className="w-full h-10 md:h-12 rounded-sm text-xs md:text-sm font-bold cursor-pointer"
                    >
                      <Package className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2" />
                      {t.cart.placeOrder}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
