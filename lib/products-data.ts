import type { Language } from "./translations"

export interface DetailSection {
  title: string
  content: string
}

export interface ProductDetails {
  overview: string
  highlights: string[]
  sections: DetailSection[]
}

export interface ProductTranslations {
  name: string
  description: string
  details: ProductDetails
}

export interface Product {
  id: string
  name: string
  description: string
  mainImage: string
  subImages: string[]
  price: number
  condition: "New" | "Used" | "Service" | string
  stock: number
  details: ProductDetails
  translations?: {
    en?: ProductTranslations
    fr?: ProductTranslations
    es?: ProductTranslations
  }
}

export const products: Product[] = [
  {
    id: "prod-1",
    name: "Premium Instrument Maintenance",
    description: "Expert level comprehensive maintenance for your valuable instruments.",
    mainImage: "https://images.unsplash.com/photo-1579737151125-1e377ce09855?q=80&w=2670&auto=format&fit=crop",
    subImages: [],
    price: 100,
    condition: "Service",
    stock: 99,
    details: {
      overview: "Get your instruments running seamlessly with our expert maintenance options.",
      highlights: ["Experienced technicians", "Premium care", "Fast turnaround"],
      sections: [
        { title: "What to expect", content: "Professional tuning, cleaning, and adjustments." }
      ],
    },
    translations: {
      en: {
        name: "Premium Instrument Maintenance",
        description: "Expert level comprehensive maintenance for your valuable instruments.",
        details: {
          overview: "Get your instruments running seamlessly with our expert maintenance options.",
          highlights: ["Experienced technicians", "Premium care", "Fast turnaround"],
          sections: [
            { title: "What to expect", content: "Professional tuning, cleaning, and adjustments." }
          ]
        },
      },
      fr: {
        name: "Entretien d'Instrument Premium",
        description: "Entretien complet de niveau expert pour vos instruments précieux.",
        details: {
          overview: "Faites fonctionner vos instruments parfaitement grâce à nos experts.",
          highlights: ["Techniciens expérimentés", "Soins premium", "Délai rapide"],
          sections: [
            { title: "À quoi s'attendre", content: "Accordage, nettoyage et réglages professionnels." }
          ]
        },
      },
      es: {
        name: "Mantenimiento Premium de Instrumentos",
        description: "Mantenimiento integral de nivel experto para sus valiosos instrumentos.",
        details: {
          overview: "Haga que sus instrumentos funcionen sin problemas con nuestras opciones de mantenimiento experto.",
          highlights: ["Técnicos experimentados", "Cuidado premium", "Entrega rápida"],
          sections: [
            { title: "Qué esperar", content: "Afinación, limpieza y ajustes profesionales." }
          ]
        },
      }
    },
  },
  {
    id: "prod-2",
    name: "Basic Checkup & Tuning",
    description: "A quick tune-up and cleaning to bring your instrument back to life.",
    mainImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2670&auto=format&fit=crop",
    subImages: [],
    price: 40,
    condition: "Service",
    stock: 99,
    details: {
      overview: "Standard checkup and minor adjustments for a perfect tune.",
      highlights: ["Quick service", "Standard tuning", "Affordable"],
      sections: [
        { title: "What to expect", content: "Basic surface cleaning and tuning." }
      ],
    },
    translations: {
      en: {
        name: "Basic Checkup & Tuning",
        description: "A quick tune-up and cleaning to bring your instrument back to life.",
        details: {
          overview: "Standard checkup and minor adjustments for a perfect tune.",
          highlights: ["Quick service", "Standard tuning", "Affordable"],
          sections: [
            { title: "What to expect", content: "Basic surface cleaning and tuning." }
          ]
        },
      },
      fr: {
        name: "Bilan et Accordage de base",
        description: "Un réglage rapide et un nettoyage pour redonner vie à votre instrument.",
        details: {
          overview: "Bilan standard et ajustements mineurs.",
          highlights: ["Service rapide", "Accordage standard", "Abordable"],
          sections: [
            { title: "À quoi s'attendre", content: "Nettoyage de base et accordage." }
          ]
        },
      },
      es: {
        name: "Revisión básica y afinación",
        description: "Un ajuste rápido y limpieza para devolverle la vida a su instrumento.",
        details: {
          overview: "Revisión estándar y ajustes menores.",
          highlights: ["Servicio rápido", "Afinación estándar", "Asequible"],
          sections: [
            { title: "Qué esperar", content: "Limpieza básica y afinación." }
          ]
        },
      }
    },
  }
]

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

export function getTranslatedProduct(product: Product, language: Language) {
  const translation = product.translations?.[language]
  
  if (!translation) {
    const englishTranslation = product.translations?.en
    if (englishTranslation && language !== "en") {
      return {
        ...product,
        name: englishTranslation.name,
        description: englishTranslation.description,
        details: englishTranslation.details,
      }
    }
    return product
  }
  
  return {
    ...product,
    name: translation.name,
    description: translation.description,
    details: translation.details,
  }
}
