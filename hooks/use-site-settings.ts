"use client"

import { useState, useEffect, useCallback } from "react"

interface SiteSettings {
  whatsapp_number?: string
  hero_home?: string
  hero_tours?: string
  hero_excursions?: string
  hero_activities?: string
  hero_transfers?: string
  hero_packages?: string
  hero_about?: string
  hero_contact?: string
  hero_blog?: string
  hero_terms?: string
}

// Use the same API base URL as in api.ts
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Check if NEXT_PUBLIC_API_URL includes /api/v1, if not add it
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030'
    if (baseUrl.includes('/api/v1')) {
      return baseUrl
    }
    return `${baseUrl}/api/v1`
  }
  return 'http://localhost:3030/api/v1'
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [loading, setLoading] = useState(true)

  const fetchSettings = useCallback(async () => {
    try {
      const apiUrl = getApiBaseUrl()
      // Use the public settings endpoint with cache busting
      const response = await fetch(`${apiUrl}/settings?t=${Date.now()}`, {
        cache: 'no-store',
      })
      if (response.ok) {
        const data = await response.json()
        const settingsData = data.settings || {}
        setSettings(settingsData)
        
        // Debug log in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Site settings loaded:', settingsData)
        }
      } else {
        console.error('Failed to fetch site settings:', response.status, response.statusText)
        // Set empty settings if fetch fails
        setSettings({})
      }
    } catch (error) {
      console.error('Failed to fetch site settings:', error)
      // Set empty settings if fetch fails
      setSettings({})
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
    
    // Refresh settings every 30 seconds to get updates
    const interval = setInterval(() => {
      fetchSettings()
    }, 30000)

    // Listen for custom event to refresh settings
    const handleSettingsUpdate = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Settings update event received, refreshing...')
      }
      fetchSettings()
    }
    
    window.addEventListener('settings-updated', handleSettingsUpdate)

    return () => {
      clearInterval(interval)
      window.removeEventListener('settings-updated', handleSettingsUpdate)
    }
  }, [fetchSettings])

  return { settings, loading, refresh: fetchSettings }
}

