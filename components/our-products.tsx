"use client"

import { useState, useEffect, useMemo } from "react"
import ProductsGrid from "./products-grid"
import { useLanguage } from "@/components/language-provider"
import { offersApi, type ApiError } from "@/lib/api"
import { type Offer } from "@/lib/offers-data"
import { Loader2 } from "lucide-react"

export default function OurProducts() {
  const { t, language } = useLanguage()
  const [bestOffers, setBestOffers] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch 3 offers from each category
  useEffect(() => {
    const fetchBestOffers = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch offers from all categories in parallel
        const [toursResponse] = await Promise.all([
          offersApi.getOffers('TOURS', language),
        ])

        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://api.marrakeshtravelservices.com/api/v1'
        const baseUrl = apiBaseUrl.replace('/api/v1', '')

        // Transform function for backend offers
        const transformOffer = (backendOffer: any, type: 'tours' | 'excursions' | 'activities' | 'transfers' | 'packages'): Offer => {
          // Handle image URL - getOffers doesn't return images array, so use main_image
          let mainImage = '/placeholder.svg'
          if (backendOffer.main_image) {
            if (backendOffer.main_image.startsWith('http://') || backendOffer.main_image.startsWith('https://')) {
              mainImage = backendOffer.main_image
            } else if (backendOffer.main_image.startsWith('/')) {
              mainImage = `${baseUrl}${backendOffer.main_image}`
            } else {
              mainImage = `${baseUrl}/uploads/${backendOffer.main_image}`
            }
          }

          // If images array is available (from getOfferById), use it
          if (backendOffer.images && Array.isArray(backendOffer.images)) {
            const mainImageObj = backendOffer.images.find((img: any) => img.type === 'MAIN')
            if (mainImageObj?.url) {
              if (mainImageObj.url.startsWith('http')) {
                mainImage = mainImageObj.url
              } else if (mainImageObj.url.startsWith('/')) {
                mainImage = `${baseUrl}${mainImageObj.url}`
              } else {
                mainImage = `${baseUrl}/uploads/${mainImageObj.url}`
              }
            }
          }

          const priceAdult = backendOffer.price_adult ? parseFloat(backendOffer.price_adult) : 0
          const priceChild = backendOffer.price_child ? parseFloat(backendOffer.price_child) : 0
          const availabilityStart = backendOffer.availability_start 
            ? new Date(backendOffer.availability_start).toISOString().split('T')[0] 
            : new Date().toISOString().split('T')[0]
          const availabilityEnd = backendOffer.availability_end 
            ? new Date(backendOffer.availability_end).toISOString().split('T')[0] 
            : new Date().toISOString().split('T')[0]

          const baseOffer: Offer = {
            id: backendOffer.id,
            type: type,
            departCity: backendOffer.depart_city || 'Marrakech',
            title: backendOffer.title || `Untitled ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            description: backendOffer.description || '',
            detailedDescription: {
              overview: backendOffer.overview || '',
              highlights: backendOffer.highlights || [],
              sections: backendOffer.sections || [],
              itinerary: [],
              tips: [],
              duration: backendOffer.duration || backendOffer.tourDetails?.duration || backendOffer.activityDetails?.duration || '',
              difficulty: backendOffer.difficulty || backendOffer.tourDetails?.difficulty || '',
              groupSize: backendOffer.groupSize || backendOffer.tourDetails?.group_size || backendOffer.activityDetails?.group_size || '',
            },
            mainImage: mainImage,
            thumbnailImages: backendOffer.images && Array.isArray(backendOffer.images) 
              ? backendOffer.images.filter((img: any) => img.type === 'GALLERY').map((img: any) => {
                  if (img.url.startsWith('http')) return img.url
                  if (img.url.startsWith('/')) return `${baseUrl}${img.url}`
                  return `${baseUrl}/uploads/${img.url}`
                })
              : [],
            video: backendOffer.video || '',
            includedItems: backendOffer.included_items || [],
            excludedItems: backendOffer.excluded_items || [],
            priceAdult: priceAdult,
            priceChild: priceChild,
            availabilityDates: {
              startDate: availabilityStart,
              endDate: availabilityEnd,
            },
          }

          // Add transfer-specific details
          if (type === 'transfers') {
            baseOffer.transferDetails = {
              from: backendOffer.transferDetails?.from_location || backendOffer.from_location || '',
              to: backendOffer.transferDetails?.to_location || backendOffer.to_location || '',
              duration: backendOffer.transferDetails?.duration || backendOffer.duration || '',
              distance: backendOffer.transferDetails?.distance || backendOffer.distance || '',
              vehicleOptions: backendOffer.transferDetails?.vehicle_options || backendOffer.vehicle_options || [],
            }
          }

          return baseOffer
        }

        const allBestOffers: Offer[] = [
          ...(toursResponse.offers || []).slice(0, 3).map((offer: any) => transformOffer(offer, 'tours')),
        ]

        setBestOffers(allBestOffers)
      } catch (err) {
        const apiError = err as ApiError
        console.error('Error fetching best offers:', err)
        setError(apiError.message || 'Failed to load offers')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBestOffers()
  }, [language])

  // Helper to get readable subtitle for a given type
  const getSubtitle = (type: string) => {
    const badge = (t && t.bestOffers && t.bestOffers.badge) || {
      tours: "Best Tour",
      excursions: "Best Excursion",
      activities: "Best Activity",
      packages: "Best Package",
      transfers: "Best Transfer",
      default: "Best Offer",
    }

    const map: Record<string, string> = {
      tours: badge.tours,
      excursions: badge.excursions,
      activities: badge.activities,
      packages: badge.packages,
      transfers: badge.transfers,
    }

    return map[type] ?? badge.default
  }

  // Group offers by type so we can render a subtitle then the grid underneath
  const groups = useMemo(() => {
    const map = new Map<string, Offer[]>()
    ;(bestOffers || []).forEach(offer => {
      const arr = map.get(offer.type) || []
      arr.push(offer)
      map.set(offer.type, arr)
    })
    return Array.from(map.entries())
  }, [bestOffers])

  if (isLoading) {
    return (
      <section className="w-full py-20 px-2 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-full py-20 px-2 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-20 px-2 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-4">
            <span className="text-lg font-semibold">{t.header.ourProducts}</span>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t.bestOffers.sectionDescription}
          </p>
        </div>

        {groups.length > 0 ? (
          <div className="flex flex-col gap-8">
            {groups.map(([type, offersForType]: [string, Offer[]]) => (
              <div key={type} className="w-full">
                <div className="text-center mb-3">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-2">
                    <span className="text-sm md:text-base font-semibold">{getSubtitle(type)}</span>
                  </div>
                  {t.bestOffers && t.bestOffers[`desc_${type}`] && (
                    <p className="text-muted-foreground mx-auto hidden md:block">{t.bestOffers[`desc_${type}`]}</p>
                  )}
                </div>

                <ProductsGrid products={offersForType} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No offers available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}