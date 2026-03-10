import type { Language } from "./translations"

export type ProductCategory =
  | "consumables"
  | "water"
  | "agriculture"
  | "laboratory"
  | "medical"
  | "furniture"
  | "weighing"
  | "chemicals"
  | "used"

export interface SpecificationsTable {
  headers: string[]
  rows: string[][]
}

export interface ProductTranslations {
  name: string
  shortDescription: string
  longDescription: string
  specificationsTable?: SpecificationsTable
}

export interface Product {
  id: string
  name: string
  shortDescription: string
  longDescription: string
  specificationsTable?: SpecificationsTable
  mainImage: string
  thumbnailImages: string[]
  category: ProductCategory
  price: number
  oldPrice?: number
  stock: number
  translations?: {
    en?: ProductTranslations
    fr?: ProductTranslations
  }
}

// Single image used across all products
const PRODUCT_IMAGE = "/unnamed.jpg"

export const products: Product[] = [
  {
    id: "prod-1",
    name: "Digital pH Meter Pro",
    shortDescription: "High-precision benchtop pH meter for laboratory analysis.",
    longDescription:
      "The Digital pH Meter Pro is a state-of-the-art benchtop instrument designed for accurate and reliable pH measurement in research and quality control laboratories. Featuring a large backlit LCD display, automatic temperature compensation (ATC), and a 3-point calibration system, this meter delivers exceptional accuracy (±0.01 pH). Its robust design includes a built-in electrode holder, data logging capability with USB export, and GLP-compliant results. Ideal for pharmaceutical, food & beverage, environmental, and educational applications.",
    mainImage: PRODUCT_IMAGE,
    thumbnailImages: [PRODUCT_IMAGE, PRODUCT_IMAGE, PRODUCT_IMAGE],
    category: "laboratory",
    price: 850,
    oldPrice: 1050,
    stock: 12,
    specificationsTable: {
      headers: ["Parameter", "Range", "Resolution", "Accuracy"],
      rows: [
        ["pH", "0.00 to 14.00 pH", "0.01 pH", "±0.01 pH"],
        ["mV", "±1999.9 mV", "0.1 mV", "±0.2 mV"],
        ["Temperature", "0.0 to 100.0 °C", "0.1 °C", "±0.5 °C"],
      ],
    },
    translations: {
      en: {
        name: "Digital pH Meter Pro",
        shortDescription: "High-precision benchtop pH meter for laboratory analysis.",
        longDescription:
          "The Digital pH Meter Pro is a state-of-the-art benchtop instrument designed for accurate and reliable pH measurement in research and quality control laboratories. Featuring a large backlit LCD display, automatic temperature compensation (ATC), and a 3-point calibration system, this meter delivers exceptional accuracy (±0.01 pH). Its robust design includes a built-in electrode holder, data logging capability with USB export, and GLP-compliant results. Ideal for pharmaceutical, food & beverage, environmental, and educational applications.",
        specificationsTable: {
          headers: ["Parameter", "Range", "Resolution", "Accuracy"],
          rows: [
            ["pH", "0.00 to 14.00 pH", "0.01 pH", "±0.01 pH"],
            ["mV", "±1999.9 mV", "0.1 mV", "±0.2 mV"],
            ["Temperature", "0.0 to 100.0 °C", "0.1 °C", "±0.5 °C"],
          ],
        },
      },
      fr: {
        name: "pH-mètre numérique Pro",
        shortDescription: "pH-mètre de paillasse haute précision pour analyses en laboratoire.",
        longDescription:
          "Le pH-mètre numérique Pro est un instrument de paillasse de pointe conçu pour des mesures de pH précises et fiables dans les laboratoires de recherche et de contrôle qualité. Doté d'un grand écran LCD rétroéclairé, d'une compensation automatique de température (ATC) et d'un système de calibration à 3 points, il offre une précision exceptionnelle (±0.01 pH). Sa conception robuste inclut un support d'électrode intégré, une capacité d'enregistrement des données avec export USB et des résultats conformes aux BPL.",
        specificationsTable: {
          headers: ["Paramètre", "Plage", "Résolution", "Précision"],
          rows: [
            ["pH", "0.00 à 14.00 pH", "0.01 pH", "±0.01 pH"],
            ["mV", "±1999.9 mV", "0.1 mV", "±0.2 mV"],
            ["Température", "0.0 à 100.0 °C", "0.1 °C", "±0.5 °C"],
          ],
        },
      },
    },
  },
  {
    id: "prod-2",
    name: "Portable Turbidity Meter",
    shortDescription: "Compact handheld turbidity meter for water quality testing.",
    longDescription:
      "The Portable Turbidity Meter is an essential field instrument for rapid and accurate turbidity measurement in water and environmental applications. Conforming to ISO 7027 standards, it uses infrared LED technology to eliminate color interference and provide reliable readings from 0 to 1000 NTU. The rugged IP67-rated housing is designed for harsh field conditions, while the intuitive interface and automatic range selection make operation effortless. Features include a rechargeable battery with 200+ hour life, data memory for 500 measurements, and Bluetooth connectivity for wireless data transfer to smartphones or tablets.",
    mainImage: PRODUCT_IMAGE,
    thumbnailImages: [PRODUCT_IMAGE, PRODUCT_IMAGE, PRODUCT_IMAGE, PRODUCT_IMAGE, PRODUCT_IMAGE, PRODUCT_IMAGE],
    category: "water",
    price: 1200,
    oldPrice: 1450,
    stock: 8,
    specificationsTable: {
      headers: ["Feature", "Specification"],
      rows: [
        ["Measurement Range", "0.00 to 1000 NTU"],
        ["Accuracy", "±2% of reading or 0.02 NTU"],
        ["Light Source", "Infrared LED (860 nm)"],
        ["Data Memory", "500 measurements"],
      ],
    },
    translations: {
      en: {
        name: "Portable Turbidity Meter",
        shortDescription: "Compact handheld turbidity meter for water quality testing.",
        longDescription:
          "The Portable Turbidity Meter is an essential field instrument for rapid and accurate turbidity measurement in water and environmental applications.",
        specificationsTable: {
          headers: ["Feature", "Specification"],
          rows: [
            ["Measurement Range", "0.00 to 1000 NTU"],
            ["Accuracy", "±2% of reading or 0.02 NTU"],
            ["Light Source", "Infrared LED (860 nm)"],
            ["Data Memory", "500 measurements"],
          ],
        },
      },
      fr: {
        name: "Turbidimètre portable",
        shortDescription: "Turbidimètre portable compact pour l'analyse de la qualité de l'eau.",
        longDescription:
          "Le Turbidimètre portable est un instrument de terrain essentiel pour la mesure rapide et précise de la turbidité dans les applications liées à l'eau et à l'environnement.",
        specificationsTable: {
          headers: ["Caractéristique", "Spécification"],
          rows: [
            ["Plage de mesure", "0.00 à 1000 NTU"],
            ["Précision", "±2% de la lecture ou 0.02 NTU"],
            ["Source lumineuse", "LED Infrarouge (860 nm)"],
            ["Mémoire", "500 mesures"],
          ],
        },
      },
    },
  },
  {
    id: "prod-3",
    name: "Soil Analysis Kit Pro",
    shortDescription: "Complete portable soil testing kit for agriculture and agronomy.",
    longDescription:
      "The Soil Analysis Kit Pro is a comprehensive portable testing solution designed for agronomists, farmers, and environmental scientists. This all-in-one kit enables rapid on-site measurement of soil pH, moisture, NPK (nitrogen, phosphorus, potassium) levels, electrical conductivity, and organic matter content. It includes a rugged carrying case, digital meter with interchangeable probes, reagent set for 200+ tests, and a companion mobile app for data tracking and field mapping. Ideal for precision agriculture, land assessment, and environmental soil studies.",
    mainImage: PRODUCT_IMAGE,
    thumbnailImages: [PRODUCT_IMAGE, PRODUCT_IMAGE, PRODUCT_IMAGE],
    category: "agriculture",
    price: 680,
    oldPrice: 850,
    stock: 15,
    specificationsTable: {
      headers: ["Parameter", "Testing Method"],
      rows: [
        ["pH", "Digital Probe (0-14 pH)"],
        ["NPK", "Colorimetric / Reagents"],
        ["Moisture", "TDR Sensor (0-100%)"],
        ["Conductivity", "Direct Soil Electrode"],
      ],
    },
    translations: {
      en: {
        name: "Soil Analysis Kit Pro",
        shortDescription: "Complete portable soil testing kit for agriculture and agronomy.",
        longDescription:
          "The Soil Analysis Kit Pro is a comprehensive portable testing solution designed for agronomists, farmers, and environmental scientists.",
        specificationsTable: {
          headers: ["Parameter", "Testing Method"],
          rows: [
            ["pH", "Digital Probe (0-14 pH)"],
            ["NPK", "Colorimetric / Reagents"],
            ["Moisture", "TDR Sensor (0-100%)"],
            ["Conductivity", "Direct Soil Electrode"],
          ],
        },
      },
      fr: {
        name: "Kit d'analyse de sol Pro",
        shortDescription: "Kit d'analyse de sol portable complet pour l'agriculture et l'agronomie.",
        longDescription:
          "Le Kit d'analyse de sol Pro est une solution de test portable complète conçue pour les agronomes, les agriculteurs et les scientifiques environnementaux.",
        specificationsTable: {
          headers: ["Paramètre", "Méthode de test"],
          rows: [
            ["pH", "Sonde numérique (0-14 pH)"],
            ["NPK", "Colorimétrie / Réactifs"],
            ["Humidité", "Capteur TDR (0-100%)"],
            ["Conductivité", "Électrode de sol directe"],
          ],
        },
      },
    },
  },
  {
    id: "prod-4",
    name: "Precision Analytical Balance",
    shortDescription: "0.0001g readability analytical balance for precise weighing.",
    longDescription:
      "The Precision Analytical Balance is engineered for the most demanding weighing applications in pharmaceutical, chemical, and research laboratories. With a readability of 0.0001 g (0.1 mg) and a capacity of 220 g, it features an internal automatic calibration system that adjusts for temperature changes to maintain accuracy throughout the day. The glass draft shield with anti-static coating minimizes environmental interference, while the color touchscreen interface provides intuitive operation with user-defined applications including piece counting, percentage weighing, density determination, and formulation. GLP/GMP compliant with full audit trail and RS-232/USB connectivity.",
    mainImage: PRODUCT_IMAGE,
    thumbnailImages: [PRODUCT_IMAGE, PRODUCT_IMAGE, PRODUCT_IMAGE],
    category: "weighing",
    price: 2450,
    oldPrice: 2800,
    stock: 5,
    specificationsTable: {
      headers: ["Model Feature", "Analytical Specification"],
      rows: [
        ["Max Capacity", "220 g"],
        ["Readability", "0.0001 g (0.1 mg)"],
        ["Repeatability", "±0.0001 g"],
        ["Pan Size", "Ø 90 mm"],
      ],
    },
    translations: {
      en: {
        name: "Precision Analytical Balance",
        shortDescription: "0.0001g readability analytical balance for precise weighing.",
        longDescription:
          "The Precision Analytical Balance is engineered for the most demanding weighing applications in pharmaceutical, chemical, and research laboratories.",
        specificationsTable: {
          headers: ["Model Feature", "Analytical Specification"],
          rows: [
            ["Max Capacity", "220 g"],
            ["Readability", "0.0001 g (0.1 mg)"],
            ["Repeatability", "±0.0001 g"],
            ["Pan Size", "Ø 90 mm"],
          ],
        },
      },
      fr: {
        name: "Balance analytique de précision",
        shortDescription: "Balance analytique avec lisibilité de 0.0001 g pour pesée de précision.",
        longDescription:
          "La Balance analytique de précision est conçue pour les applications de pesée les plus exigeantes dans les laboratoires pharmaceutiques, chimiques et de recherche.",
        specificationsTable: {
          headers: ["Caractéristique", "Spécification"],
          rows: [
            ["Capacité max", "220 g"],
            ["Lisibilité", "0.0001 g (0.1 mg)"],
            ["Répétabilité", "±0.0001 g"],
            ["Plateau", "Ø 90 mm"],
          ],
        },
      },
    },
  },
  {
    id: "prod-5",
    name: "Laboratory Pipette Set",
    shortDescription: "Premium micropipette set with calibration certificate.",
    longDescription:
      "This Laboratory Pipette Set includes three ergonomic single-channel micropipettes covering volumes from 0.5 µL to 1000 µL: P10 (0.5–10 µL), P200 (20–200 µL), and P1000 (100–1000 µL). Each pipette features a lightweight composite body with a soft-touch thumb button that reduces repetitive strain, a digital volume display with quick-set lock, and autoclavable lower parts for decontamination. All three pipettes come factory-calibrated with individual calibration certificates traceable to international standards. The set includes a rotating carousel stand and a starter pack of compatible filter tips.",
    mainImage: PRODUCT_IMAGE,
    thumbnailImages: [PRODUCT_IMAGE, PRODUCT_IMAGE, PRODUCT_IMAGE],
    category: "consumables",
    price: 520,
    oldPrice: 650,
    stock: 25,
    specificationsTable: {
      headers: ["Pipette Type", "Volume Range", "Increment"],
      rows: [
        ["Single Channel P10", "0.5 – 10 µL", "0.01 µL"],
        ["Single Channel P200", "20 – 200 µL", "0.2 µL"],
        ["Single Channel P1000", "100 – 1000 µL", "1.0 µL"],
      ],
    },
    translations: {
      en: {
        name: "Laboratory Pipette Set",
        shortDescription: "Premium micropipette set with calibration certificate.",
        longDescription:
          "This Laboratory Pipette Set includes three ergonomic single-channel micropipettes covering volumes from 0.5 µL to 1000 µL.",
        specificationsTable: {
          headers: ["Pipette Type", "Volume Range", "Increment"],
          rows: [
            ["Single Channel P10", "0.5 – 10 µL", "0.01 µL"],
            ["Single Channel P200", "20 – 200 µL", "0.2 µL"],
            ["Single Channel P1000", "100 – 1000 µL", "1.0 µL"],
          ],
        },
      },
      fr: {
        name: "Set de pipettes de laboratoire",
        shortDescription: "Set de micropipettes premium avec certificat de calibration.",
        longDescription:
          "Ce Set de pipettes de laboratoire comprend trois micropipettes monocanal ergonomiques couvrant des volumes de 0,5 µL à 1000 µL.",
        specificationsTable: {
          headers: ["Type de pipette", "Plage de volume", "Incrément"],
          rows: [
            ["Monocanal P10", "0,5 – 10 µL", "0,01 µL"],
            ["Monocanal P200", "20 – 200 µL", "0,2 µL"],
            ["Monocanal P1000", "100 – 1000 µL", "1,0 µL"],
          ],
        },
      },
    },
  },
  {
    id: "prod-6",
    name: "Patient Vital Signs Monitor",
    shortDescription: "Multi-parameter bedside vital signs monitor for clinical use.",
    longDescription:
      "The Patient Vital Signs Monitor is a professional-grade multi-parameter monitoring system designed for hospitals, clinics, and ambulatory care. It simultaneously tracks ECG (3/5-lead), SpO2, NIBP (non-invasive blood pressure), respiration rate, and body temperature on a high-resolution 12.1\" color TFT display. Featuring configurable alarm thresholds, 72-hour trend review, and HL7 compatibility for integration with hospital information systems (HIS), this monitor ensures continuous and reliable patient surveillance. The compact, wall-mountable design with a built-in carry handle provides flexibility for bedside, transport, and emergency scenarios.",
    mainImage: PRODUCT_IMAGE,
    thumbnailImages: [PRODUCT_IMAGE, PRODUCT_IMAGE, PRODUCT_IMAGE],
    category: "medical",
    price: 3200,
    oldPrice: 3800,
    stock: 3,
    specificationsTable: {
      headers: ["Paramater", "Range / Spec"],
      rows: [
        ["Display", "12.1\" Color TFT LCD"],
        ["ECG", "3/5-lead (Heart Rate, ST)"],
        ["SpO2", "0% – 100%"],
        ["NIBP", "Manual, Auto, Continuous"],
      ],
    },
    translations: {
      en: {
        name: "Patient Vital Signs Monitor",
        shortDescription: "Multi-parameter bedside vital signs monitor for clinical use.",
        longDescription:
          "The Patient Vital Signs Monitor is a professional-grade multi-parameter monitoring system designed for hospitals, clinics, and ambulatory care.",
        specificationsTable: {
          headers: ["Paramater", "Range / Spec"],
          rows: [
            ["Display", "12.1\" Color TFT LCD"],
            ["ECG", "3/5-lead (Heart Rate, ST)"],
            ["SpO2", "0% – 100%"],
            ["NIBP", "Manual, Auto, Continuous"],
          ],
        },
      },
      fr: {
        name: "Moniteur de signes vitaux patient",
        shortDescription: "Moniteur multi-paramètres de chevet pour utilisation clinique.",
        longDescription:
          "Le Moniteur de signes vitaux patient est un système de surveillance multi-paramètres de grade professionnel conçu pour les hôpitaux, les cliniques et les soins ambulatoires.",
        specificationsTable: {
          headers: ["Paramètre", "Plage / Spéc."],
          rows: [
            ["Écran", "12.1\" TFT LCD Couleur"],
            ["ECG", "3/5-fils (FC, Segment ST)"],
            ["SpO2", "0% – 100%"],
            ["PNI", "Manuel, Auto, Continu"],
          ],
        },
      },
    },
  },
  {
    id: "prod-7",
    name: "C-Frame Laboratory Workstation",
    shortDescription: "Modular laboratory workstation with chemical-resistant surface.",
    longDescription:
      "The C-Frame Laboratory Workstation is a premium modular bench designed for modern research and teaching laboratories. Its C-frame steel structure provides maximum legroom and flexibility for under-bench equipment, while the 30 mm solid phenolic resin worktop delivers outstanding resistance to chemicals, heat (up to 180 °C), scratches, and moisture. The workstation is available in standard widths of 1500 mm and 1800 mm and can be configured with overhead shelving, reagent racks, electrical outlets, gas and water connections, and integrated LED task lighting. The powder-coated steel frame meets ISO 9001 quality standards and comes with a height-adjustable leveling system for uneven floors.",
    mainImage: PRODUCT_IMAGE,
    thumbnailImages: [PRODUCT_IMAGE, PRODUCT_IMAGE, PRODUCT_IMAGE],
    category: "furniture",
    price: 1850,
    oldPrice: 2200,
    stock: 7,
    specificationsTable: {
      headers: ["Component", "Specification"],
      rows: [
        ["Frame Structure", "Powder-coated C-Frame Steel"],
        ["Worktop", "30 mm Phenolic Resin"],
        ["Standard Width", "1500 / 1800 mm"],
        ["Load Capacity", "250 kg per linear meter"],
      ],
    },
    translations: {
      en: {
        name: "C-Frame Laboratory Workstation",
        shortDescription: "Modular laboratory workstation with chemical-resistant surface.",
        longDescription:
          "The C-Frame Laboratory Workstation is a premium modular bench designed for modern research and teaching laboratories.",
        specificationsTable: {
          headers: ["Component", "Specification"],
          rows: [
            ["Frame Structure", "Powder-coated C-Frame Steel"],
            ["Worktop", "30 mm Phenolic Resin"],
            ["Standard Width", "1500 / 1800 mm"],
            ["Load Capacity", "250 kg per linear meter"],
          ],
        },
      },
      fr: {
        name: "Paillasse de laboratoire en C",
        shortDescription: "Paillasse de laboratoire modulaire avec surface résistante aux produits chimiques.",
        longDescription:
          "La Paillasse de laboratoire en C est une paillasse modulaire premium conçue pour les laboratoires de recherche et d'enseignement modernes.",
        specificationsTable: {
          headers: ["Composant", "Spécification"],
          rows: [
            ["Structure", "Acier en C avec revêtement époxy"],
            ["Plan de travail", "Résine phénolique 30 mm"],
            ["Largeur standard", "1500 / 1800 mm"],
            ["Charge utile", "250 kg par mètre linéaire"],
          ],
        },
      },
    },
  },
  {
    id: "prod-8",
    name: "Analytical Grade Reagent Kit",
    shortDescription: "Complete analytical-grade chemical reagent kit for laboratory analyses.",
    longDescription:
      "The Analytical Grade Reagent Kit is a curated collection of high-purity chemicals essential for routine and advanced laboratory analyses. This kit contains 12 commonly used reagents including hydrochloric acid (37%), sulfuric acid (95–98%), sodium hydroxide pellets, potassium permanganate, silver nitrate, EDTA disodium salt, phenolphthalein indicator, methyl orange indicator, starch indicator, buffer solutions (pH 4.0, 7.0, 10.0), and distilled water (5 L). All reagents are ACS reagent grade or higher with detailed certificates of analysis (CoA) and Safety Data Sheets (SDS) included. Packaged in amber glass or HDPE bottles with tamper-evident seals for safe storage and transport.",
    mainImage: PRODUCT_IMAGE,
    thumbnailImages: [PRODUCT_IMAGE, PRODUCT_IMAGE, PRODUCT_IMAGE],
    category: "chemicals",
    price: 390,
    oldPrice: 480,
    stock: 20,
    specificationsTable: {
      headers: ["Reagent Name", "Grade / Concentration"],
      rows: [
        ["Hydrochloric Acid", "ACS Grade (37%)"],
        ["Sulfuric Acid", "ACS Grade (95-98%)"],
        ["Sodium Hydroxide", "Analytical Pellets"],
        ["Buffer Solutions", "pH 4, 7, 10"],
      ],
    },
    translations: {
      en: {
        name: "Analytical Grade Reagent Kit",
        shortDescription: "Complete analytical-grade chemical reagent kit for laboratory analyses.",
        longDescription:
          "The Analytical Grade Reagent Kit is a curated collection of high-purity chemicals essential for routine and advanced laboratory analyses.",
        specificationsTable: {
          headers: ["Reagent Name", "Grade / Concentration"],
          rows: [
            ["Hydrochloric Acid", "ACS Grade (37%)"],
            ["Sulfuric Acid", "ACS Grade (95-98%)"],
            ["Sodium Hydroxide", "Analytical Pellets"],
            ["Buffer Solutions", "pH 4, 7, 10"],
          ],
        },
      },
      fr: {
        name: "Kit de réactifs de grade analytique",
        shortDescription: "Kit complet de réactifs chimiques de grade analytique pour analyses en laboratoire.",
        longDescription:
          "Le Kit de réactifs de grade analytique est une collection soigneusement sélectionnée de produits chimiques de haute pureté essentiels pour les analyses de laboratoire courantes et avancées.",
        specificationsTable: {
          headers: ["Nom du réactif", "Grade / Concentration"],
          rows: [
            ["Acide chlorhydrique", "Grade ACS (37%)"],
            ["Acide sulfurique", "Grade ACS (95-98%)"],
            ["Hydroxyde de sodium", "Pastilles analytiques"],
            ["Solutions tampons", "pH 4, 7, 10"],
          ],
        },
      },
    },
  },
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
        shortDescription: englishTranslation.shortDescription,
        longDescription: englishTranslation.longDescription,
        specificationsTable: englishTranslation.specificationsTable,
      }
    }
    return product
  }

  return {
    ...product,
    name: translation.name,
    shortDescription: translation.shortDescription,
    longDescription: translation.longDescription,
    specificationsTable: translation.specificationsTable,
  }
}

export const bestSellers: Product[] = products.slice(0, 4);
