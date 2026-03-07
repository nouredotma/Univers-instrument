"use client"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Hero() {
  const { t } = useLanguage()
  const [currentSubtitle, setCurrentSubtitle] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSubtitle((prev) => (prev + 1) % t.hero.subtitles.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [t.hero.subtitles.length])

  return (
    <section className="relative w-full overflow-hidden rounded-b-2xl md:rounded-b-4xl" style={{ height: "100svh" }}>
      {/* Background Image - Light overlay added */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1602052577122-f73b9710adba?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Univers Instrument Service"
          className="w-full h-full object-cover select-none"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content - Centered */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 md:px-16 pt-16">
        <div className="max-w-4xl space-y-2 sm:space-y-4 text-center">
          <div className="space-y-1">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight drop-shadow-md"
            >
              {t.hero.title}
            </motion.h1>
            
            <div className="h-4 md:h-8 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentSubtitle}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-sm md:text-lg text-white/95 font-light leading-relaxed drop-shadow-sm"
                >
                  {t.hero.subtitles[currentSubtitle]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-4 pt-1 sm:pt-2">
            <Button 
              size="lg"
              className="flex-1 sm:flex-none h-10 sm:h-12 px-2 sm:px-8 rounded-md bg-primary hover:bg-primary/95 text-white transition-all duration-300 font-light text-xs sm:text-base shadow-lg"
              asChild
            >
              <a href="/products">
                {t.hero.productsButton}
              </a>
            </Button>
            
            <Button 
              size="lg"
              className="flex-1 sm:flex-none h-10 sm:h-12 px-1 sm:px-8 rounded-md bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-2 border-white/20 transition-all duration-300 font-light text-xs sm:text-base shadow-lg"
              asChild
            >
              <a href="tel:0666166945">
                <motion.span
                  animate={{ rotate: [-10, 10, -10], x: [-1, 1, -1] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2, 
                    ease: "easeInOut" 
                  }}
                  className="inline-block mr-1 sm:mr-3"
                >
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                </motion.span>
                {t.hero.phoneButton}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
