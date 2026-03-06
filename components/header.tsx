"use client"

import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/login-modal"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, ChevronRight, Facebook, Instagram, Mail, Phone, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Header({ isStatic = false }: { isStatic?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const pathname = usePathname()
  const { isLoggedIn, openLoginModal } = useAuth()
  const { t, languages, language, setLanguage } = useLanguage()
  
  // Check if we're in the users section
  const isUsersSection = pathname?.startsWith("/users") || isStatic

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

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
      if (servicesDropdownOpen && !target.closest('.services-dropdown-container')) {
        setServicesDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [servicesDropdownOpen])

  const serviceLinks = [
    { href: "/tours", label: t.header.tours },
  ]

  const otherLinks = [
    { href: "/", label: t.header.home },
    { href: "/about", label: t.header.about },
    // Services will be inserted here
    { href: "/blog", label: t.header.blog },
    { href: "/contact", label: t.header.contact },
  ]

  return (
    <>
      <header
        className={cn(
          "top-0 z-40 w-full transition-all duration-300",
          isUsersSection 
            ? "sticky top-0 bg-primary shadow-md border-b border-primary/20" 
            : cn(
                "fixed",
                scrolled ? "bg-primary shadow-md border-b border-primary/20" : "bg-transparent"
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
          <Container className="max-w-7xl mx-auto h-full flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-between px-4 text-[11px] sm:text-xs font-medium text-white/90 py-1.5 sm:py-0">
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

        <Container className="max-w-7xl mx-auto">
          {/* Mobile layout - centered logo, login left, menu right */}
          <div className="md:hidden relative flex h-16 items-center justify-between px-1">
            {/* Left: Login (or user) */}
            <div className="flex items-center z-20">
              {isLoggedIn ? (
                <Link href="/users/profile">
                  <Button
                    size="icon-sm"
                    className={cn(
                      "rounded-full transition-all duration-300 border cursor-pointer",
                      (scrolled || isUsersSection)
                        ? "bg-linear-to-r from-[#fac360] to-[#fce97c] text-primary border-[#fac360]/50 hover:opacity-90"
                        : "bg-primary text-white border-white/30 hover:bg-primary/90"
                    )}
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button
                  size="sm"
                  onClick={() => openLoginModal()}
                  className={cn(
                    "text-xs font-medium rounded-full px-4 py-1.5 transition-all duration-300 border cursor-pointer",
                    (scrolled || isUsersSection)
                      ? "bg-linear-to-r from-[#fac360] to-[#fce97c] text-primary border-[#fac360]/50 hover:opacity-90"
                      : "bg-primary text-white border-white/30 hover:bg-primary/90"
                  )}
                >
                  {t.header.login}
                </Button>
              )}
            </div>

            {/* Center: Logo (absolutely centered for mobile) */}
            <Link href="/" className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="pointer-events-auto relative h-12 w-24">
                <Image src="/logo.png" alt="Univers Instrument Service Logo" fill className="object-contain" priority sizes="(max-width: 768px) 96px, 128px" />
              </div>
            </Link>

            {/* Right: Menu Button */}
            <div className="flex items-center gap-2 z-20">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors"
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
                    stroke="#ffffff"
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
                  <div className="relative h-16 w-32">
                    <Image src="/logo.png" alt="Univers Instrument Service Logo" fill className="object-contain" priority sizes="(max-width: 768px) 96px, 128px" />
                  </div>
                </Link>
              </div>

              {/* Center: Navigation Links */}
              <nav className="flex items-center gap-6 flex-1 justify-center">
                <Link
                  href="/"
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative group font-trajan-pro uppercase tracking-wider hover:text-secondary",
                    pathname === "/" ? "text-secondary" : "text-white"
                  )}
                >
                  {t.header.home}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
                </Link>

                {/* Services Dropdown - Premium Grid */}
                <div 
                  className="relative services-dropdown-container group"
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium transition-all duration-300 relative font-trajan-pro uppercase tracking-wider hover:text-secondary py-4",
                      serviceLinks.some(link => pathname === link.href) ? "text-secondary" : "text-white"
                    )}
                  >
                    {t.header.services}
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", servicesDropdownOpen ? "rotate-180" : "")} />
                  </button>
                  
                  <AnimatePresence>
                    {servicesDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 w-[400px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden p-2 grid grid-cols-2 gap-2"
                      >
                        {serviceLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-primary/5 hover:scale-[1.02] group/item",
                              pathname === link.href ? "bg-primary/5 ring-1 ring-primary/20" : "bg-gray-50/50"
                            )}
                            onClick={() => setServicesDropdownOpen(false)}
                          >
                            <div className={cn(
                              "h-10 w-10 rounded-full flex items-center justify-center transition-colors group-hover/item:bg-primary group-hover/item:text-white",
                              pathname === link.href ? "bg-primary text-white" : "bg-primary/10 text-primary"
                            )}>
                              {/* Icon placeholder logic */}
                              <ChevronRight className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className={cn(
                                "text-sm font-semibold transition-colors",
                                pathname === link.href ? "text-primary" : "text-gray-800 group-hover/item:text-primary"
                              )}>
                                {link.label}
                              </span>
                              <span className="text-[10px] text-gray-500 uppercase tracking-wide">
                                {t.common?.viewAll || "View"}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  href="/about"
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative group font-trajan-pro uppercase tracking-wider hover:text-secondary",
                    pathname === "/about" ? "text-secondary" : "text-white"
                  )}
                >
                  {t.header.about}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
                </Link>

                <Link
                  href="/contact"
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative group font-trajan-pro uppercase tracking-wider hover:text-secondary",
                    pathname === "/contact" ? "text-secondary" : "text-white"
                  )}
                >
                  {t.header.contact}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </nav>

              {/* Right: Contact & Login Buttons */}
              <div className="flex items-center gap-3 shrink-0">    
                {isLoggedIn ? (
                  <Link href="/users/profile">
                    <Button 
                      className={cn(
                        "rounded-full px-4 py-2 transition-all duration-300 cursor-pointer flex items-center gap-2",
                        (scrolled || isUsersSection)
                          ? "bg-linear-to-r from-[#fac360] to-[#fce97c] text-primary hover:opacity-90" 
                          : "bg-primary text-white hover:bg-primary/90"
                      )}
                    >
                      <User className="h-5 w-5" />
                      <span className="text-sm font-medium">{t.header.myAccount}</span>
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    onClick={() => openLoginModal()}
                    className={cn(
                      "text-sm font-medium rounded-full px-6 transition-all duration-300 cursor-pointer",
                      (scrolled || isUsersSection)
                        ? "bg-linear-to-r from-[#fac360] to-[#fce97c] text-primary hover:opacity-90" 
                        : "bg-primary text-white hover:bg-primary/90"
                    )}
                  >
                    {t.header.login}
                  </Button>
                )}
                {/* Desktop Language Dropdown */}
                <LanguageSwitcher 
                  buttonClassName={cn(
                    "bg-white/10 hover:bg-white/20",
                    (scrolled || isUsersSection) && "bg-primary/5 hover:bg-primary/10 border border-primary/20"
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
                className="fixed top-0 right-0 bottom-0 w-[80%] max-w-[320px] z-50 md:hidden overflow-hidden shadow-2xl bg-white"
              >
                <div className="h-full flex flex-col">
                  {/* Header with close button */}
                  <div className="flex items-center justify-between px-5 py-4 bg-primary">
                    <Link href="/" className="inline-block" onClick={() => setIsMenuOpen(false)}>
                      <div className="relative h-9 w-24">
                        <Image src="/logo.png" alt="Univers Instrument Service Logo" fill className="object-contain" priority sizes="(max-width: 768px) 96px, 128px" />
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
                  <div className="flex-1 overflow-y-auto py-3 px-3">
                    <nav className="space-y-0.5">
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 }}
                      >
                        <Link
                          href="/"
                          className={cn(
                            "flex items-center py-3 px-4 rounded-lg transition-all duration-200 text-sm font-medium tracking-wide group",
                            pathname === "/" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                          )}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="flex-1">{t.header.home}</span>
                          <ChevronRight className={cn("h-4 w-4 transition-transform duration-200", pathname === "/" ? "text-white/70" : "text-gray-400")} />
                        </Link>
                      </motion.div>

                      {/* Mobile Services Accordion */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="rounded-lg overflow-hidden">
                          <button
                            onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                            className={cn(
                              "flex items-center w-full py-3 px-4 transition-all duration-200 text-sm font-medium tracking-wide group",
                              serviceLinks.some(link => pathname === link.href) && !mobileServicesOpen
                                ? "bg-primary/5 text-primary" 
                                : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                            )}
                          >
                            <span className="flex-1 text-left">{t.header.services}</span>
                            <ChevronDown className={cn(
                              "h-4 w-4 transition-transform duration-200",
                               mobileServicesOpen ? "rotate-180" : "text-gray-400"
                            )} />
                          </button>
                          
                          <AnimatePresence>
                            {mobileServicesOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="bg-gray-50/50 overflow-hidden"
                              >
                                {serviceLinks.map((link) => (
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
                        transition={{ delay: 0.15 }}
                      >
                        <Link
                          href="/about"
                          className={cn(
                            "flex items-center py-3 px-4 rounded-lg transition-all duration-200 text-sm font-medium tracking-wide group",
                            pathname === "/about" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                          )}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="flex-1">{t.header.about}</span>
                          <ChevronRight className={cn("h-4 w-4 transition-transform duration-200", pathname === "/about" ? "text-white/70" : "text-gray-400")} />
                        </Link>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Link
                          href="/contact"
                          className={cn(
                            "flex items-center py-3 px-4 rounded-lg transition-all duration-200 text-sm font-medium tracking-wide group",
                            pathname === "/contact" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                          )}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="flex-1">{t.header.contact}</span>
                          <ChevronRight className={cn("h-4 w-4 transition-transform duration-200", pathname === "/contact" ? "text-white/70" : "text-gray-400")} />
                        </Link>
                      </motion.div>
                    </nav>
                  </div>

                  {/* Footer with Language & Login */}
                  <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50/50">
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
                              "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200",
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

                    {/* Login Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      {isLoggedIn ? (
                        <Link
                          href="/users/profile"
                          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-linear-to-r from-[#fac360] to-[#fce97c] text-primary font-semibold text-sm rounded-lg hover:opacity-90 transition-all duration-200 shadow-sm"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="h-5 w-5" />
                          {t.header.myAccount}
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            setIsMenuOpen(false)
                            openLoginModal()
                          }}
                          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-linear-to-r from-[#fac360] to-[#fce97c] text-primary font-semibold text-sm rounded-lg hover:opacity-90 transition-all duration-200 shadow-sm"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {t.header.login}
                        </button>
                      )}
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