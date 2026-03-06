"use client"

import { useState, useEffect, useMemo, memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, MapPin, ArrowRight, Search } from "lucide-react"
import type { Offer } from "@/lib/offers-data"
import { getTranslatedOffer } from "@/lib/offers-data"
import { useAuth } from "@/components/login-modal"
import { useLanguage } from "@/components/language-provider"
import { userApi } from "@/lib/api"
import { toast } from "sonner"

interface OffersGridProps {
  offers: Offer[]
}

const OffersGrid = memo(function OffersGrid({ offers }: OffersGridProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [isToggling, setIsToggling] = useState<string | null>(null)
  const { isLoggedIn, openLoginModal } = useAuth()
  const { language, t } = useLanguage()

  // Get translated offers based on current language
  const translatedOffers = useMemo(() => {
    return offers.map(offer => getTranslatedOffer(offer, language))
  }, [offers, language])

  // Load favorites from backend API on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isLoggedIn) {
        const storedFavorites = localStorage.getItem("favorites")
        if (storedFavorites) {
          try {
            setFavorites(new Set(JSON.parse(storedFavorites)))
          } catch {
            localStorage.removeItem("favorites")
          }
        }
        return
      }

      try {
        const response = await userApi.getFavorites(language)
        const backendFavoriteIds = new Set((response.favorites || []).map((fav: any) => fav.id))
        setFavorites(backendFavoriteIds)
      } catch (error) {
        console.error('Error loading favorites:', error)
        const storedFavorites = localStorage.getItem("favorites")
        if (storedFavorites) {
          try {
            setFavorites(new Set(JSON.parse(storedFavorites)))
          } catch {
            localStorage.removeItem("favorites")
          }
        }
      }
    }

    fetchFavorites()
  }, [isLoggedIn, language])

  // Sync localStorage favorites to backend once we have offers
  useEffect(() => {
    if (!isLoggedIn || offers.length === 0) return

    const syncFavorites = async () => {
      const storedFavorites = localStorage.getItem("favorites")
      if (!storedFavorites) return

      try {
        const localFavoriteIds = JSON.parse(storedFavorites) as string[]
        const currentFavorites = new Set(favorites)
        let hasChanges = false

        for (const offerId of localFavoriteIds) {
          if (!currentFavorites.has(offerId)) {
            const offer = offers.find(o => o.id === offerId)
            if (offer) {
              try {
                await userApi.addFavorite(offerId, offer.type.toUpperCase())
                currentFavorites.add(offerId)
                hasChanges = true
              } catch (syncError) {
                console.warn('Failed to sync favorite:', offerId, syncError)
              }
            }
          }
        }

        if (hasChanges) {
          setFavorites(currentFavorites)
        }
        localStorage.removeItem("favorites")
      } catch (e) {
        console.warn('Error syncing localStorage favorites:', e)
      }
    }

    syncFavorites()
  }, [isLoggedIn, offers.length > 0]) // Only run when login status changes or offers first arrive

  const handleToggleFavorite = async (e: React.MouseEvent, offerId: string, offerType: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      openLoginModal("Please sign in to add items to your favorites")
      return
    }

    const isFavorite = favorites.has(offerId)
    setIsToggling(offerId)

    try {
      if (isFavorite) {
        await userApi.removeFavorite(offerId)
        setFavorites(prev => {
          const next = new Set(prev)
          next.delete(offerId)
          return next
        })
        toast.success('Removed from favorites')
      } else {
        await userApi.addFavorite(offerId, offerType.toUpperCase())
        setFavorites(prev => {
          const next = new Set(prev)
          next.add(offerId)
          return next
        })
        toast.success('Added to favorites')
      }
      
      window.dispatchEvent(new Event('favorites-updated'))
    } catch (error: any) {
      console.error('Error toggling favorite:', error)
      toast.error(error.message || 'Failed to update favorite')
    } finally {
      setIsToggling(null)
    }
  }

  return (
    <div className="offers-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
      {translatedOffers.length === 0 ? (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">{t.common?.noOffersFound || "No offers found"}</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            {t.common?.noOffersDescription || "We couldn't find any offers matching your criteria. Try adjusting your filters or search for something else."}
          </p>
        </div>
      ) : (
        translatedOffers.map((offer, index) => (
          <Link
            key={offer.id}
            href={`/offers/${offer.id}`}
            className="offer-card rounded-sm md:rounded-lg bg-background border border-border transition-all duration-300 hover:border-primary overflow-hidden hover:shadow-lg group flex flex-col relative h-full"
          >
            <div className="relative overflow-hidden h-52 md:h-56 lg:h-64">
              {offer.mainImage && (offer.mainImage.includes('localhost:3030') || offer.mainImage.includes('api.marrakeshtravelservices.com')) ? (
                <img
                  src={offer.mainImage || "/placeholder.svg"}
                  alt={offer.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder.svg'
                  }}
                />
              ) : (
                <Image
                  src={offer.mainImage || "/placeholder.svg"}
                  alt={offer.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={index < 3}
                  loading={index < 3 ? undefined : "lazy"}
                />
              )}
              <button
                onClick={(e) => handleToggleFavorite(e, offer.id, offer.type)}
                disabled={isToggling === offer.id}
                className="absolute top-2 right-2 md:top-3 md:right-3 bg-background/80 hover:bg-background rounded-full p-1.5 md:p-2 transition-all duration-200 backdrop-blur-sm transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={favorites.has(offer.id) ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart
                  className={`w-4 h-4 md:w-5 md:h-5 transform transition-transform duration-200 ${
                    favorites.has(offer.id)
                      ? "scale-110 fill-red-500 text-red-500"
                      : "text-foreground"
                  } ${isToggling === offer.id ? "animate-pulse" : ""}`}
                />
              </button>
            </div>

            <div className="p-1.5 md:p-4 grow flex flex-col">
              <h3 className="text-xs sm:text-base md:text-lg font-semibold text-foreground mb-1 md:mb-2 line-clamp-2">{offer.title}</h3>

              <p className="text-[11px] sm:text-sm text-muted-foreground mb-2 md:mb-2 line-clamp-2">{offer.description}</p>

              {/* Show transfer route for transfers, availability dates for others */}
              {offer.type === "transfers" && offer.transferDetails ? (
                <div className="text-[9px] sm:text-xs text-muted-foreground mb-1.5 md:mb-2 flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-primary shrink-0" />
                  <span className="truncate">{offer.transferDetails.from}</span>
                  <ArrowRight className="w-2.5 h-2.5 text-primary shrink-0" />
                  <span className="truncate">{offer.transferDetails.to}</span>
                </div>
              ) : (
                <div className="text-[9px] sm:text-xs text-muted-foreground mb-1.5 md:mb-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-primary"></span>
                  {(t?.offerDetails?.availability ?? "Available") + ":"} {" "}
                  {new Date(offer.availabilityDates.startDate).toLocaleDateString(language || "en", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(offer.availabilityDates.endDate).toLocaleDateString(language || "en", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              )}
            </div>

            <div className="bg-primary p-1.5 sm:p-3 md:p-4 mt-auto">
              {offer.type === "packages" ? (
                <div className="flex justify-center items-center h-full">
                   <p className="text-xs md:text-base font-semibold text-secondary uppercase tracking-wider">{t?.common?.custom ?? "Custom"}</p>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[9px] sm:text-xs text-secondary opacity-90">{t?.common?.from ?? "From"}</p>
                    <p className="text-[13px] md:text-base font-semibold text-primary-foreground">€ {offer.priceAdult}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] sm:text-xs text-secondary opacity-90">{offer.type === "transfers" ? (t?.offerDetails?.perVehicle ?? "per vehicle") : (t?.common?.perPerson ?? "per person")}</p>
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))
      )}
    </div>
  )
})

export default OffersGrid
