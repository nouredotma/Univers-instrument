import type { Language } from "./translations"

export type OfferType = "offer" | "tours" | "excursions" | "activities" | "transfers" | "packages"

export interface DetailSection {
  title: string
  content: string
}

export interface DetailedDescription {
  overview: string
  highlights: string[]
  sections: DetailSection[]
  itinerary?: {
    time: string
    activity: string
  }[]
  tips?: string[]
  duration?: string
  difficulty?: string
  groupSize?: string
}

export interface OfferTranslations {
  title: string
  description: string
  detailedDescription: DetailedDescription
  includedItems: string[]
  excludedItems: string[]
}

export interface Offer {
  id: string
  type: OfferType
  departCity: string
  title: string
  description: string
  detailedDescription: DetailedDescription
  translations?: {
    en?: OfferTranslations
    fr?: OfferTranslations
    es?: OfferTranslations
  }
  mainImage: string
  thumbnailImages: string[]
  video?: string
  includedItems: string[]
  excludedItems: string[]
  priceAdult: number
  priceChild: number
  availabilityDates?: {
    startDate: string
    endDate: string
  }
  transferDetails?: {
    from: string
    to: string
    duration: string
    distance: string
    vehicleOptions: string[]
  }
}

export const offers: Offer[] = [
  {
    id: "offer-1",
    type: "offer",
    departCity: "Agadir",
    title: "Premium Instrument Maintenance",
    description: "Expert level comprehensive maintenance for your valuable instruments.",
    detailedDescription: {
      overview: "Get your instruments running seamlessly with our expert maintenance options.",
      highlights: ["Experienced technicians", "Premium care", "Fast turnaround"],
      sections: [
        { title: "What to expect", content: "Professional tuning, cleaning, and adjustments." }
      ],
      duration: "1 to 2 days",
    },
    translations: {
      en: {
        title: "Premium Instrument Maintenance",
        description: "Expert level comprehensive maintenance for your valuable instruments.",
        detailedDescription: {
          overview: "Get your instruments running seamlessly with our expert maintenance options.",
          highlights: ["Experienced technicians", "Premium care", "Fast turnaround"],
          sections: [
            { title: "What to expect", content: "Professional tuning, cleaning, and adjustments." }
          ]
        },
        includedItems: ["Tuning", "Cleaning", "Calibration"],
        excludedItems: ["Major hardware replacements"]
      },
      fr: {
        title: "Entretien d'Instrument Premium",
        description: "Entretien complet de niveau expert pour vos instruments précieux.",
        detailedDescription: {
          overview: "Faites fonctionner vos instruments parfaitement grâce à nos experts.",
          highlights: ["Techniciens expérimentés", "Soins premium", "Délai rapide"],
          sections: [
            { title: "À quoi s'attendre", content: "Accordage, nettoyage et réglages professionnels." }
          ]
        },
        includedItems: ["Accordage", "Nettoyage", "Étalonnage"],
        excludedItems: ["Remplacements majeurs de matériel"]
      },
      es: {
        title: "Mantenimiento Premium de Instrumentos",
        description: "Mantenimiento integral de nivel experto para sus valiosos instrumentos.",
        detailedDescription: {
          overview: "Haga que sus instrumentos funcionen sin problemas con nuestras opciones de mantenimiento experto.",
          highlights: ["Técnicos experimentados", "Cuidado premium", "Entrega rápida"],
          sections: [
            { title: "Qué esperar", content: "Afinación, limpieza y ajustes profesionales." }
          ]
        },
        includedItems: ["Afinación", "Limpieza", "Calibración"],
        excludedItems: ["Reemplazos de hardware importantes"]
      }
    },
    mainImage: "https://images.unsplash.com/photo-1579737151125-1e377ce09855?q=80&w=2670&auto=format&fit=crop",
    thumbnailImages: [],
    includedItems: ["Tuning", "Cleaning", "Calibration"],
    excludedItems: ["Major hardware replacements"],
    priceAdult: 100,
    priceChild: 0,
    availabilityDates: { startDate: new Date().toISOString(), endDate: new Date().toISOString() }
  },
  {
    id: "offer-2",
    type: "offer",
    departCity: "Agadir",
    title: "Basic Checkup & Tuning",
    description: "A quick tune-up and cleaning to bring your instrument back to life.",
    detailedDescription: {
      overview: "Standard checkup and minor adjustments for a perfect tune.",
      highlights: ["Quick service", "Standard tuning", "Affordable"],
      sections: [
        { title: "What to expect", content: "Basic surface cleaning and tuning." }
      ],
      duration: "2-3 hours",
    },
    translations: {
      en: {
        title: "Basic Checkup & Tuning",
        description: "A quick tune-up and cleaning to bring your instrument back to life.",
        detailedDescription: {
          overview: "Standard checkup and minor adjustments for a perfect tune.",
          highlights: ["Quick service", "Standard tuning", "Affordable"],
          sections: [
            { title: "What to expect", content: "Basic surface cleaning and tuning." }
          ]
        },
        includedItems: ["Basic Cleaning", "Tuning"],
        excludedItems: ["Deep Calibration"]
      },
      fr: {
        title: "Bilan et Accordage de base",
        description: "Un réglage rapide et un nettoyage pour redonner vie à votre instrument.",
        detailedDescription: {
          overview: "Bilan standard et ajustements mineurs.",
          highlights: ["Service rapide", "Accordage standard", "Abordable"],
          sections: [
            { title: "À quoi s'attendre", content: "Nettoyage de base et accordage." }
          ]
        },
        includedItems: ["Nettoyage de base", "Accordage"],
        excludedItems: ["Étalonnage en profondeur"]
      },
      es: {
        title: "Revisión básica y afinación",
        description: "Un ajuste rápido y limpieza para devolverle la vida a su instrumento.",
        detailedDescription: {
          overview: "Revisión estándar y ajustes menores.",
          highlights: ["Servicio rápido", "Afinación estándar", "Asequible"],
          sections: [
            { title: "Qué esperar", content: "Limpieza básica y afinación." }
          ]
        },
        includedItems: ["Limpieza básica", "Afinación"],
        excludedItems: ["Calibración profunda"]
      }
    },
    mainImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2670&auto=format&fit=crop",
    thumbnailImages: [],
    includedItems: ["Basic Cleaning", "Tuning"],
    excludedItems: ["Deep Calibration"],
    priceAdult: 40,
    priceChild: 0,
    availabilityDates: { startDate: new Date().toISOString(), endDate: new Date().toISOString() }
  }
]

// Helper function to get an offer by its ID
export function getOfferById(id: string): Offer | undefined {
  return offers.find((offer) => offer.id === id)
}

// Helper function to get translated offer content
export function getTranslatedOffer(offer: Offer, language: Language) {
  const translation = offer.translations?.[language]
  
  // If no translation exists for this language, fall back to English, then to default fields
  if (!translation) {
    const englishTranslation = offer.translations?.en
    if (englishTranslation && language !== "en") {
      return {
        ...offer,
        title: englishTranslation.title,
        description: englishTranslation.description,
        detailedDescription: englishTranslation.detailedDescription,
        includedItems: englishTranslation.includedItems,
        excludedItems: englishTranslation.excludedItems,
      }
    }
    // Fall back to default fields if no translations exist
    return offer
  }
  
  return {
    ...offer,
    title: translation.title,
    description: translation.description,
    detailedDescription: translation.detailedDescription,
    includedItems: translation.includedItems,
    excludedItems: translation.excludedItems,
  }
}
