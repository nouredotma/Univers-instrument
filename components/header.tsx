"use client"

import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, ChevronRight, Facebook, Instagram, Mail, Phone, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Header({ isStatic = false, forceScrolled = false }: { isStatic?: boolean, forceScrolled?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(forceScrolled)
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const pathname = usePathname()
  const { t, languages, language, setLanguage } = useLanguage()
  
  // Check if we're in the users section
  const isUsersSection = pathname?.startsWith("/users") || isStatic

  useEffect(() => {
    if (forceScrolled) {
      setScrolled(true)
      return
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [forceScrolled])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (productsDropdownOpen && !target.closest('.products-dropdown-container')) {
        setProductsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [productsDropdownOpen])

  const productLinks = [
    { href: "/products?condition=consumables", label: t.footer.productNames.consumables },
    { href: "/products?condition=water", label: t.footer.productNames.water },
    { href: "/products?condition=agriculture", label: t.footer.productNames.agriculture },
    { href: "/products?condition=laboratory", label: t.footer.productNames.laboratory },
    { href: "/products?condition=medical", label: t.footer.productNames.medical },
    { href: "/products?condition=furniture", label: t.footer.productNames.furniture },
    { href: "/products?condition=weighing", label: t.footer.productNames.weighing },
    { href: "/products?condition=chemicals", label: t.footer.productNames.chemicals },
  ]

  return (
    <>
      <header
        className={cn(
          "top-0 z-40 w-full transition-all duration-300",
          isUsersSection 
            ? "sticky top-0 bg-white border-b border-gray-200" 
            : cn(
                "fixed",
                scrolled ? "bg-white border-b border-gray-200" : "bg-transparent"
              ),
        )}
      >
        {/* Top Bar - Hides on Scroll */}
        <div 
          className={cn(
            "w-full transition-all duration-300 overflow-hidden z-50 relative", 
            isUsersSection ? "bg-primary" : "bg-primary",
            scrolled ? "h-0 opacity-0" : "h-[60px] sm:h-10 opacity-100"
          )}
        >
          <Container className="max-w-full mx-auto px-4 md:px-12 h-full flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-between text-[11px] sm:text-xs font-medium text-white/90 py-1.5 sm:py-0">
            {/* Desktop: Phone & Email Left | Mobile: Row 1 - Phone */}
            <div className="flex items-center justify-start gap-6 mb-1 sm:mb-0">
              <a href="tel:0666166945" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="h-3.5 w-3.5" />
                <span>0666-166945</span>
              </a>
              <a href="mailto:uis.instruments@gmail.com" className="hidden sm:flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="h-3.5 w-3.5" />
                <span>uis.instruments@gmail.com</span>
              </a>
            </div>

            {/* Desktop: Socials Right | Mobile: Row 2 - Email & Socials */}
            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
              <a href="mailto:uis.instruments@gmail.com" className="flex sm:hidden items-center gap-2 hover:text-white transition-colors">
                <Mail className="h-3.5 w-3.5" />
                <span>uis.instruments@gmail.com</span>
              </a>
              
              <div className="flex items-center gap-4">
                <span className="hidden md:inline opacity-60">Follow us:</span>
                <div className="flex items-center gap-3">
                  <a href="https://www.facebook.com/universinstrument/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a href="https://www.linkedin.com/in/univers-instrument-service-b81575267/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-2.5v-8.99h2.5v8.99zm-1.25-10.25c-.8 0-1.45-.65-1.45-1.45 0-.8.65-1.45 1.45-1.45s1.45.65 1.45 1.45c0 .8-.65 1.45-1.45 1.45zm13 10.25h-2.5v-4.5c0-1.07-.02-2.45-1.5-2.45-1.5 0-1.73 1.17-1.73 2.38v4.57h-2.5v-8.99h2.4v1.23h.03c.33-.63 1.14-1.3 2.36-1.3 2.52 0 2.99 1.66 2.99 3.82v5.24z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </div>

        <Container className="max-w-full mx-auto px-4 md:px-12">
          {/* Mobile layout - logo left, menu right */}
          <div className="md:hidden flex h-16 items-center justify-between px-1">
            {/* Left: Logo */}
            <Link href="/" className="flex items-center z-10">
              <div className="relative h-20 w-40">
                <Image src={scrolled || isUsersSection ? "/logo.png" : "/whitelogo.png"} alt="Univers Instrument Service Logo" fill className="object-contain" priority sizes="(max-width: 768px) 112px, 128px" />
              </div>
            </Link>

            {/* Right: Menu Button */}
            <div className="flex items-center gap-2 z-20">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  "relative flex flex-col justify-center items-center w-10 h-10 rounded-lg transition-colors",
                  scrolled || isUsersSection ? "hover:bg-black/5" : "hover:bg-white/10"
                )}
                aria-label="Toggle menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-transform duration-300"
                >
                  <path
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3 12h18M3 6h18M3 18h18"}
                    stroke={scrolled || isUsersSection ? "#000000" : "#ffffff"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop layout - logo left, nav center, actions right */}
          <div className="hidden md:block">
            <div className="flex h-20 items-center justify-between gap-6">
              {/* Left: Logo */}
              <div className="flex items-center gap-6 shrink-0">
                <Link href="/" className="flex items-center">
                  <div className="relative h-28 w-44">
                    <Image src={scrolled || isUsersSection ? "/logo.png" : "/whitelogo.png"} alt="Univers Instrument Service Logo" fill className="object-contain" priority sizes="(max-width: 768px) 96px, 128px" />
                  </div>
                </Link>
              </div>

              {/* Center: Navigation Links */}
              <nav className="flex items-center gap-6 flex-1 justify-center">
                <Link
                  href="/"
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative group font-fauna tracking-wider hover:text-secondary",
                    pathname === "/" ? "text-secondary" : (scrolled || isUsersSection ? "text-gray-800" : "text-white")
                  )}
                >
                  {t.header.home}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
                </Link>

                <Link
                  href="/about"
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative group font-fauna tracking-wider hover:text-secondary",
                    pathname === "/about" ? "text-secondary" : (scrolled || isUsersSection ? "text-gray-800" : "text-white")
                  )}
                >
                  {t.header.about}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
                </Link>

                {/* Products Dropdown - Premium Grid */}
                <div 
                  className="relative products-dropdown-container group"
                  onMouseEnter={() => setProductsDropdownOpen(true)}
                  onMouseLeave={() => setProductsDropdownOpen(false)}
                >
                  <Link
                    href="/products"
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium transition-all duration-300 relative font-fauna tracking-wider hover:text-secondary py-4",
                      pathname === "/products" || productLinks.some((link: any) => pathname === link.href) ? "text-secondary" : (scrolled || isUsersSection ? "text-gray-800" : "text-white")
                    )}
                  >
                    {t.header.products}
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", productsDropdownOpen ? "rotate-180" : "")} />
                  </Link>
                  
                  <AnimatePresence>
                    {productsDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 w-[500px] bg-white rounded-md border border-gray-100 shadow-xl overflow-hidden p-2 grid grid-cols-2 gap-1.5"
                      >
                        {productLinks.map((link: any) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                              "flex items-center gap-2.5 p-2 rounded-sm transition-all hover:bg-primary/5 hover:scale-[1.02] group/item",
                              pathname === link.href ? "bg-primary/5 ring-1 ring-primary/20" : "bg-white"
                            )}
                            onClick={() => setProductsDropdownOpen(false)}
                          >
                            <div className={cn(
                              "h-8 w-8 rounded-full flex items-center justify-center transition-colors group-hover/item:bg-primary group-hover/item:text-white",
                              pathname === link.href ? "bg-primary text-white" : "bg-primary/10 text-primary"
                            )}>
                              {/* Icon placeholder logic */}
                              <ChevronRight className="h-3 w-3" />
                            </div>
                            <div className="flex flex-col">

                              <span className={cn(
                                "text-xs font-medium transition-colors",
                                pathname === link.href ? "text-primary" : "text-gray-800 group-hover/item:text-primary"
                              )}>
                                {link.label}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  href="/products?condition=used"
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative group font-fauna tracking-wider hover:text-secondary",
                    pathname === "/products" && typeof window !== 'undefined' && window.location.search.includes('condition=used') ? "text-secondary" : (scrolled || isUsersSection ? "text-gray-800" : "text-white")
                  )}
                >
                  {t.header.usedProducts}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
                </Link>



                <Link
                  href="/contact"
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative group font-fauna tracking-wider hover:text-secondary",
                    pathname === "/contact" ? "text-secondary" : (scrolled || isUsersSection ? "text-gray-800" : "text-white")
                  )}
                >
                  {t.header.contact}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </nav>

              {/* Right: Contact & Language */}
              <div className="flex items-center gap-3 shrink-0">
                {/* Desktop Language Dropdown */}
                <LanguageSwitcher
                  buttonClassName={cn(
                    "transition-colors",
                    (scrolled || isUsersSection)
                      ? "bg-primary/5 hover:bg-primary/10 border border-primary/20 text-gray-800"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  )}
                />
              </div>
            </div>
          </div>
        </Container>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop overlay with blur effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
                onClick={() => setIsMenuOpen(false)}
              />

              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 bottom-0 w-[80%] max-w-[320px] z-50 md:hidden overflow-hidden bg-white"
              >
                <div className="h-full flex flex-col">
                  {/* Header with close button */}
                  <div className="flex items-center justify-between px-3 py-4 bg-[#414141]">
                    <Link href="/" className="inline-block" onClick={() => setIsMenuOpen(false)}>
                      <div className="relative h-10 w-32">
                        <Image src="/whitelogo.png" alt="Univers Instrument Service Logo" fill className="object-contain" priority sizes="(max-width: 768px) 96px, 128px" />
                      </div>
                    </Link>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          stroke="#ffffff"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Navigation links */}
                  <div className="flex-1 overflow-y-auto py-3 px-1">
                    <nav className="space-y-0.5">
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 }}
                      >
                        <Link
                          href="/"
                          onClick={() => setIsMenuOpen(false)}
                          className={cn(
                            "flex items-center w-full py-4 px-4 transition-all duration-200 text-sm font-medium tracking-wide border-b border-gray-100 font-fauna",
                            pathname === "/" ? "bg-primary/5 text-primary" : "text-gray-700 hover:text-primary"
                          )}
                        >
                          {t.header.home}
                        </Link>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 }}
                      >
                        <Link
                          href="/about"
                          onClick={() => setIsMenuOpen(false)}
                          className={cn(
                            "flex items-center w-full py-4 px-4 transition-all duration-200 text-sm font-medium tracking-wide border-b border-gray-100 font-fauna",
                            pathname === "/about" ? "bg-primary/5 text-primary" : "text-gray-700 hover:text-primary"
                          )}
                        >
                          {t.header.about}
                        </Link>
                      </motion.div>

                      {/* Mobile Products Accordion */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="rounded-lg overflow-hidden">
                          <button
                            onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                            className={cn(
                              "flex items-center w-full py-3 px-4 transition-all duration-200 text-sm font-medium tracking-wide group font-fauna",
                              productLinks.some((link: any) => pathname === link.href) && !mobileProductsOpen
                                ? "bg-primary/5 text-primary"
                                : "text-gray-700 hover:bg-primary/5 hover:text-primary"
                            )}
                          >
                            <span className="flex-1 text-left">{t.header.products}</span>
                            <ChevronDown className={cn(
                              "h-4 w-4 transition-transform duration-200",
                               mobileProductsOpen ? "rotate-180" : "text-gray-400"
                            )} />
                          </button>

                          <AnimatePresence>
                            {mobileProductsOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white overflow-hidden"
                              >
                                {productLinks.map((link: any) => (
                                  <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                      "flex items-center py-2.5 pl-8 pr-4 text-sm transition-colors",
                                      pathname === link.href ? "text-primary font-medium" : "text-gray-600 hover:text-primary"
                                    )}
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 opacity-50"></span>
                                    {link.label}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.12 }}
                      >
                        <Link
                          href="/products?condition=used"
                          onClick={() => setIsMenuOpen(false)}
                          className={cn(
                            "flex items-center w-full py-4 px-4 transition-all duration-200 text-sm font-medium tracking-wide border-b border-gray-100 font-fauna",
                            pathname === "/products" && typeof window !== 'undefined' && window.location.search.includes('condition=used') ? "bg-primary/5 text-primary" : "text-gray-700 hover:text-primary"
                          )}
                        >
                          {t.header.usedProducts}
                        </Link>
                      </motion.div>



                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Link
                          href="/contact"
                          onClick={() => setIsMenuOpen(false)}
                          className={cn(
                            "flex items-center w-full py-4 px-4 transition-all duration-200 text-sm font-medium tracking-wide font-fauna",
                            pathname === "/contact" ? "bg-primary/5 text-primary" : "text-gray-700 hover:text-primary"
                          )}
                        >
                          {t.header.contact}
                        </Link>
                      </motion.div>
                    </nav>
                  </div>

                  {/* Footer with Language & Login */}
                  <div className="border-t border-gray-100 p-4 space-y-3 bg-white">
                    {/* Language Selector */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-1">{t.header.language}</p>
                      <div className="flex gap-2">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => setLanguage(lang.code as "en" | "fr" | "es")}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-sm text-sm font-medium transition-all duration-200",
                              lang.code === language
                                ? "bg-primary text-white shadow-sm"
                                : "bg-white text-gray-600 border border-gray-200 hover:border-primary/30 hover:bg-primary/5"
                            )}
                          >
                            <div className="relative w-5 h-3.5 shrink-0">
                              <Image
                                src={lang.flag || "/placeholder.svg"}
                                alt={lang.name}
                                fill
                                className="object-cover rounded-sm"
                                sizes="20px"
                              />
                            </div>
                            <span className="uppercase text-xs">{lang.code}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>


                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}