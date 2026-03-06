"use client"

import { useState, useEffect } from "react"
import { Cookie, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

const COOKIE_CONSENT_KEY = "mts_cookie_consent"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export default function CookieBanner() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: true,
    marketing: false,
  })

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(allAccepted))
    setIsVisible(false)
  }

  const handleSavePreferences = () => {
    const saved = {
      ...preferences,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(saved))
    setIsVisible(false)
  }

  const handleRejectNonEssential = () => {
    const essential = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(essential))
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5 duration-500">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {!showPreferences ? (
          // Simple consent view
          <div className="p-4 md:p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0 hidden md:flex">
                <Cookie className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Cookie className="h-4 w-4 text-primary md:hidden" />
                    {t.cookies?.title || "We use cookies"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {t.cookies?.description || "We use cookies to enhance your experience. By continuing to visit this site, you agree to our use of cookies."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={handleAcceptAll}
                    className="rounded-full px-5 h-9 font-medium shadow-sm cursor-pointer"
                  >
                    {t.cookies?.acceptAll || "Accept All"}
                  </Button>
                  <Button
                    onClick={handleRejectNonEssential}
                    variant="outline"
                    className="rounded-full px-5 h-9 font-medium cursor-pointer"
                  >
                    {t.cookies?.rejectNonEssential || "Essential Only"}
                  </Button>
                  <button
                    onClick={() => setShowPreferences(true)}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    {t.cookies?.preferences || "Preferences"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Preferences view
          <div className="p-4 md:p-5">
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900">
                {t.cookies?.preferencesTitle || "Cookie Preferences"}
              </h3>
            </div>
            
            <div className="space-y-2 mb-4">
              {/* Necessary Cookies */}
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{t.cookies?.necessary || "Essential Cookies"}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.cookies?.necessaryDesc || "Required for the website to function"}</p>
                </div>
                <div className="text-xs text-gray-400 font-medium px-2 py-0.5 bg-gray-200 rounded-full">
                  {t.cookies?.required || "Required"}
                </div>
              </div>
              
              {/* Analytics Cookies */}
              <label className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{t.cookies?.analytics || "Analytics Cookies"}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.cookies?.analyticsDesc || "Help us improve your experience"}</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
              </label>
              
              {/* Marketing Cookies */}
              <label className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{t.cookies?.marketing || "Marketing Cookies"}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.cookies?.marketingDesc || "Used for personalized advertising"}</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
              </label>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleSavePreferences}
                className="flex-1 rounded-full h-9 font-medium cursor-pointer"
              >
                {t.cookies?.save || "Save Preferences"}
              </Button>
              <Button
                onClick={handleAcceptAll}
                variant="outline"
                className="flex-1 rounded-full h-9 font-medium cursor-pointer"
              >
                {t.cookies?.acceptAll || "Accept All"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}