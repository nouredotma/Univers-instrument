"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"

interface LanguageSwitcherProps {
  className?: string
  buttonClassName?: string
  dropdownClassName?: string
}

export function LanguageSwitcher({ 
  className, 
  buttonClassName, 
  dropdownClassName 
}: LanguageSwitcherProps) {
  const { language, setLanguage, languages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isOpen && !target.closest('.language-switcher-container')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className={cn("relative language-switcher-container", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer relative overflow-hidden",
          buttonClassName
        )}
        aria-label="Open language selector"
      >
        <Image
          src={languages.find((lang) => lang.code === language)?.flag || "/placeholder.svg"}
          alt={language}
          fill
          className="object-cover"
          sizes="32px"
        />
      </button>

      {isOpen && (
        <div className={cn(
          "absolute right-0 mt-2 bg-white rounded-md shadow-lg border border-gray-200 py-2 min-w-[160px] z-50 overflow-hidden",
          dropdownClassName
        )}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code as "en" | "fr")
                setIsOpen(false)
              }}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-primary/10 transition-colors cursor-pointer",
                lang.code === language ? "bg-primary/5" : ""
              )}
            >
              <div className="relative w-6 h-4 shrink-0">
                <Image 
                  src={lang.flag || "/placeholder.svg"} 
                  alt={lang.name} 
                  fill
                  className="object-cover rounded-sm"
                  sizes="24px"
                />
              </div>
              <span className="text-sm font-medium text-gray-800">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
