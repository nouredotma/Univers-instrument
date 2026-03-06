import type { Language } from "./translations"

export type OfferType = "tours" | "excursions" | "activities" | "packages" | "transfers" | "best-offers" | "blog"

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

export interface GroupPricing {
  personsPerGroup: number
  price: number
}

export interface PersonPricing {
  priceFor2: number
  priceFor4: number
  priceFor6: number
  priceFor8: number
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
  pricingType?: 'per_group' | 'per_person'
  groupPricing?: GroupPricing
  personPricing?: PersonPricing
  availabilityDates: {
    startDate: string
    endDate: string
  }
  // Transfer-specific fields
  transferDetails?: {
    from: string
    to: string
    duration: string
    distance?: string
    vehicleOptions: {
      type: string
      capacity: string
      price: number
      features: string[]
    }[]
  }
}

// Tours offers
export const toursOffers: Offer[] = []


// Excursions offers
export const excursionsOffers: Offer[] = []


// Activities offers
export const activitiesOffers: Offer[] = []


// Packages offers
export const packagesOffers: Offer[] = []


// Transfer offers
export const transfersOffers: Offer[] = []


// Best Offers (mix from other types)
export const bestOffers: Offer[] = [
  // Pick up to 3 offers from each category to highlight
  ...toursOffers.slice(0, 3),
  ...excursionsOffers.slice(0, 3),
  ...activitiesOffers.slice(0, 3),
  ...packagesOffers.slice(0, 3),
  ...transfersOffers.slice(0, 3),
]

export const allOffers = {
  tours: toursOffers,
  excursions: excursionsOffers,
  activities: activitiesOffers,
  packages: packagesOffers,
  transfers: transfersOffers,
  "best-offers": bestOffers,
}

// Blog posts
export interface BlogPost {
  id: string
  type: "blog"
  title: string
  description: string
  content: string
  mainImage: string
  thumbnailImages: string[]
  author: string
  publishDate: string
  translations?: {
    en?: {
      title: string
      description: string
      content: string
    }
    fr?: {
      title: string
      description: string
      content: string
    }
    es?: {
      title: string
      description: string
      content: string
    }
  }
}

export const blogPosts: BlogPost[] = [
  {
    id: "blog-001",
    type: "blog",
    title: "Top 10 Hidden Gems in Marrakesh's Medina",
    description: "Discover secret spots and hidden treasures in the heart of Marrakesh that most tourists miss. From hidden rooftop terraces to artisan workshops tucked away in narrow alleys.",
    content: "Marrakesh's medina is a UNESCO World Heritage site filled with centuries of history, culture, and hidden treasures waiting to be discovered. While the famous Jemaa el-Fnaa square draws millions of visitors, the real magic lies in the lesser-known corners of this ancient city.\n\nStart your journey at the Bahia Palace gardens, where peaceful courtyards offer a respite from the bustling streets. Continue to the Mellah, the historic Jewish quarter, where you'll find beautifully ornate synagogues and the moving Miâara Jewish Cemetery.\n\nVenture into the souks beyond the main tourist paths to discover master craftsmen creating traditional Moroccan goods. Look for the tiny doorways that lead to hidden riads, some of which have been transformed into stunning boutique hotels and restaurants.\n\nDon't miss the Mouassine fountain, a 16th-century masterpiece, or the secret garden of Le Jardin Secret, recently restored to its former glory. For the best views, seek out one of the many rooftop cafés where you can watch the sunset over the Atlas Mountains while sipping mint tea.",
    mainImage: "https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    thumbnailImages: [
      "https://images.pexels.com/photos/4388167/pexels-photo-4388167.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    author: "Ahmed Benali",
    publishDate: "2025-12-01",
    translations: {
      en: {
        title: "Top 10 Hidden Gems in Marrakesh's Medina",
        description: "Discover secret spots and hidden treasures in the heart of Marrakesh that most tourists miss. From hidden rooftop terraces to artisan workshops tucked away in narrow alleys.",
        content: "Marrakesh's medina is a UNESCO World Heritage site filled with centuries of history, culture, and hidden treasures waiting to be discovered. While the famous Jemaa el-Fnaa square draws millions of visitors, the real magic lies in the lesser-known corners of this ancient city.\n\nStart your journey at the Bahia Palace gardens, where peaceful courtyards offer a respite from the bustling streets. Continue to the Mellah, the historic Jewish quarter, where you'll find beautifully ornate synagogues and the moving Miâara Jewish Cemetery.\n\nVenture into the souks beyond the main tourist paths to discover master craftsmen creating traditional Moroccan goods. Look for the tiny doorways that lead to hidden riads, some of which have been transformed into stunning boutique hotels and restaurants.\n\nDon't miss the Mouassine fountain, a 16th-century masterpiece, or the secret garden of Le Jardin Secret, recently restored to its former glory. For the best views, seek out one of the many rooftop cafés where you can watch the sunset over the Atlas Mountains while sipping mint tea.",
      },
      fr: {
        title: "Top 10 des Trésors Cachés de la Médina de Marrakech",
        description: "Découvrez des endroits secrets et des trésors cachés au cœur de Marrakech que la plupart des touristes manquent. Des terrasses cachées aux ateliers d'artisans dans des ruelles étroites.",
        content: "La médina de Marrakech est un site du patrimoine mondial de l'UNESCO rempli de siècles d'histoire, de culture et de trésors cachés qui attendent d'être découverts. Alors que la célèbre place Jemaa el-Fnaa attire des millions de visiteurs, la vraie magie se trouve dans les coins moins connus de cette ville ancienne.\n\nCommencez votre voyage dans les jardins du Palais Bahia, où des cours paisibles offrent un répit des rues animées. Continuez vers le Mellah, le quartier juif historique, où vous trouverez des synagogues magnifiquement ornées et l'émouvant cimetière juif Miâara.\n\nAventurez-vous dans les souks au-delà des sentiers touristiques pour découvrir des maîtres artisans créant des produits marocains traditionnels. Cherchez les petites portes qui mènent à des riads cachés, dont certains ont été transformés en superbes hôtels-boutiques et restaurants.\n\nNe manquez pas la fontaine Mouassine, un chef-d'œuvre du 16ème siècle, ou le jardin secret du Jardin Secret, récemment restauré dans sa gloire d'antan. Pour les meilleures vues, cherchez l'un des nombreux cafés sur les toits où vous pouvez regarder le coucher du soleil sur les montagnes de l'Atlas en sirotant un thé à la menthe.",
      },
      es: {
        title: "Los 10 Tesoros Ocultos de la Medina de Marrakech",
        description: "Descubre lugares secretos y tesoros ocultos en el corazón de Marrakech que la mayoría de los turistas pasan por alto. Desde terrazas ocultas hasta talleres de artesanos en callejones estrechos.",
        content: "La medina de Marrakech es un sitio del Patrimonio Mundial de la UNESCO lleno de siglos de historia, cultura y tesoros ocultos esperando ser descubiertos. Mientras que la famosa plaza Jemaa el-Fnaa atrae a millones de visitantes, la verdadera magia se encuentra en los rincones menos conocidos de esta antigua ciudad.\n\nComienza tu viaje en los jardines del Palacio Bahía, donde patios tranquilos ofrecen un respiro de las calles bulliciosas. Continúa hacia el Mellah, el histórico barrio judío, donde encontrarás sinagogas bellamente ornamentadas y el conmovedor Cementerio Judío Miâara.\n\nAventúrate en los zocos más allá de las rutas turísticas principales para descubrir maestros artesanos creando productos marroquíes tradicionales. Busca las pequeñas puertas que conducen a riads ocultos, algunos de los cuales se han transformado en impresionantes hoteles boutique y restaurantes.\n\nNo te pierdas la fuente Mouassine, una obra maestra del siglo XVI, o el jardín secreto de Le Jardin Secret, recientemente restaurado a su antigua gloria. Para las mejores vistas, busca uno de los muchos cafés en las azoteas donde puedes ver la puesta de sol sobre las montañas del Atlas mientras bebes té de menta.",
      },
    },
  },
  {
    id: "blog-002",
    type: "blog",
    title: "A Complete Guide to Moroccan Cuisine",
    description: "From tagines to pastilla, explore the rich flavors of Moroccan cooking. Learn about traditional spices, cooking techniques, and the best dishes to try during your visit.",
    content: "Moroccan cuisine is a vibrant tapestry of flavors, aromas, and textures that reflects centuries of cultural exchange along ancient trade routes. From the aromatic tagines slow-cooked in earthenware pots to the sweet and savory layers of pastilla, every dish tells a story.\n\nThe foundation of Moroccan cooking lies in its spice blends, particularly ras el hanout, which can contain over 30 different spices. Cumin, coriander, saffron, and cinnamon play starring roles, creating the distinctive flavor profiles that make Moroccan food unforgettable.\n\nTagine, named after the conical clay pot it's cooked in, is the heart of Moroccan cuisine. Whether prepared with chicken and preserved lemons, lamb with prunes and almonds, or vegetables and chickpeas, this slow-cooking method creates incredibly tender and flavorful dishes.\n\nCouscous holds a special place in Moroccan culture, traditionally served on Fridays after prayers. The tiny semolina granules are steamed multiple times until light and fluffy, then topped with a rich vegetable and meat stew.\n\nFor the adventurous eater, don't miss the street food scene. Try msemmen (layered flatbread), harira (hearty soup), and of course, the ubiquitous Moroccan mint tea, poured from height to create a perfect foam.",
    mainImage: "https://images.pexels.com/photos/5409015/pexels-photo-5409015.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    thumbnailImages: [
      "https://images.pexels.com/photos/5409020/pexels-photo-5409020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/5409023/pexels-photo-5409023.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    author: "Fatima Zahra",
    publishDate: "2025-11-25",
    translations: {
      en: {
        title: "A Complete Guide to Moroccan Cuisine",
        description: "From tagines to pastilla, explore the rich flavors of Moroccan cooking. Learn about traditional spices, cooking techniques, and the best dishes to try during your visit.",
        content: "Moroccan cuisine is a vibrant tapestry of flavors, aromas, and textures that reflects centuries of cultural exchange along ancient trade routes. From the aromatic tagines slow-cooked in earthenware pots to the sweet and savory layers of pastilla, every dish tells a story.\n\nThe foundation of Moroccan cooking lies in its spice blends, particularly ras el hanout, which can contain over 30 different spices. Cumin, coriander, saffron, and cinnamon play starring roles, creating the distinctive flavor profiles that make Moroccan food unforgettable.\n\nTagine, named after the conical clay pot it's cooked in, is the heart of Moroccan cuisine. Whether prepared with chicken and preserved lemons, lamb with prunes and almonds, or vegetables and chickpeas, this slow-cooking method creates incredibly tender and flavorful dishes.\n\nCouscous holds a special place in Moroccan culture, traditionally served on Fridays after prayers. The tiny semolina granules are steamed multiple times until light and fluffy, then topped with a rich vegetable and meat stew.\n\nFor the adventurous eater, don't miss the street food scene. Try msemmen (layered flatbread), harira (hearty soup), and of course, the ubiquitous Moroccan mint tea, poured from height to create a perfect foam.",
      },
      fr: {
        title: "Guide Complet de la Cuisine Marocaine",
        description: "Des tajines à la pastilla, explorez les riches saveurs de la cuisine marocaine. Découvrez les épices traditionnelles, les techniques de cuisson et les meilleurs plats à essayer pendant votre visite.",
        content: "La cuisine marocaine est une tapisserie vibrante de saveurs, d'arômes et de textures qui reflète des siècles d'échanges culturels le long des anciennes routes commerciales. Des tajines aromatiques mijotés dans des pots en terre cuite aux couches sucrées et salées de la pastilla, chaque plat raconte une histoire.\n\nLe fondement de la cuisine marocaine repose sur ses mélanges d'épices, en particulier le ras el hanout, qui peut contenir plus de 30 épices différentes. Le cumin, la coriandre, le safran et la cannelle jouent des rôles principaux, créant les profils de saveurs distinctifs qui rendent la nourriture marocaine inoubliable.\n\nLe tajine, nommé d'après le pot en argile conique dans lequel il est cuit, est le cœur de la cuisine marocaine. Qu'il soit préparé avec du poulet et des citrons confits, de l'agneau aux pruneaux et amandes, ou des légumes et pois chiches, cette méthode de cuisson lente crée des plats incroyablement tendres et savoureux.\n\nLe couscous occupe une place spéciale dans la culture marocaine, traditionnellement servi le vendredi après les prières. Les minuscules grains de semoule sont cuits à la vapeur plusieurs fois jusqu'à être légers et aérés, puis garnis d'un riche ragoût de légumes et de viande.\n\nPour les mangeurs aventureux, ne manquez pas la scène de la cuisine de rue. Essayez le msemmen (pain plat feuilleté), la harira (soupe copieuse) et, bien sûr, l'omniprésent thé à la menthe marocain, versé de haut pour créer une mousse parfaite.",
      },
      es: {
        title: "Guía Completa de la Cocina Marroquí",
        description: "Desde tajines hasta pastilla, explora los ricos sabores de la cocina marroquí. Aprende sobre especias tradicionales, técnicas de cocina y los mejores platos para probar durante tu visita.",
        content: "La cocina marroquí es un tapiz vibrante de sabores, aromas y texturas que refleja siglos de intercambio cultural a lo largo de las antiguas rutas comerciales. Desde los aromáticos tajines cocinados a fuego lento en ollas de barro hasta las capas dulces y saladas de la pastilla, cada plato cuenta una historia.\n\nLa base de la cocina marroquí radica en sus mezclas de especias, particularmente el ras el hanout, que puede contener más de 30 especias diferentes. El comino, el cilantro, el azafrán y la canela juegan roles protagonistas, creando los perfiles de sabor distintivos que hacen que la comida marroquí sea inolvidable.\n\nEl tajine, que lleva el nombre de la olla de arcilla cónica en la que se cocina, es el corazón de la cocina marroquí. Ya sea preparado con pollo y limones en conserva, cordero con ciruelas y almendras, o verduras y garbanzos, este método de cocción lenta crea platos increíblemente tiernos y sabrosos.\n\nEl cuscús ocupa un lugar especial en la cultura marroquí, tradicionalmente servido los viernes después de las oraciones. Los diminutos granos de sémola se cuecen al vapor varias veces hasta quedar ligeros y esponjosos, luego se cubren con un rico estofado de verduras y carne.\n\nPara el comensal aventurero, no te pierdas la escena de la comida callejera. Prueba el msemmen (pan plano en capas), la harira (sopa abundante) y, por supuesto, el omnipresente té de menta marroquí, servido desde altura para crear una espuma perfecta.",
      },
    },
  },
  {
    id: "blog-003",
    type: "blog",
    title: "Desert Adventures: What to Expect on a Sahara Trip",
    description: "Planning a Sahara desert adventure? Here's everything you need to know about camel treks, desert camps, and experiencing the magic of the world's largest hot desert.",
    content: "The Sahara Desert is one of the most awe-inspiring landscapes on Earth, and experiencing it firsthand is a bucket-list adventure for many travelers. From the towering dunes of Erg Chebbi to the peaceful silence of the desert night, a Sahara trip offers unforgettable memories.\n\nMost Sahara adventures begin in Marrakesh, with a scenic drive through the Atlas Mountains and the Draa Valley. Along the way, you'll pass through ancient kasbahs, including the famous Ait Benhaddou, a UNESCO World Heritage site that has served as a backdrop for countless films.\n\nUpon reaching the desert's edge, you'll trade your vehicle for a camel and embark on the iconic trek into the dunes. The rhythmic swaying of the camel, the changing colors of the sand as the sun sets, and the gradual transformation of the landscape create a truly magical experience.\n\nDesert camps range from basic Berber tents to luxury glamping experiences. Regardless of the level of comfort, the highlight remains the same: the night sky. Far from light pollution, the Sahara offers some of the clearest stargazing on the planet.\n\nPrepare for extreme temperature variations – scorching days and surprisingly cold nights. Pack layers, sunscreen, and a sense of adventure. The Sahara will reward you with an experience unlike any other.",
    mainImage: "https://images.pexels.com/photos/3889927/pexels-photo-3889927.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    thumbnailImages: [
      "https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/4356144/pexels-photo-4356144.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    author: "Omar Tazi",
    publishDate: "2025-11-18",
    translations: {
      en: {
        title: "Desert Adventures: What to Expect on a Sahara Trip",
        description: "Planning a Sahara desert adventure? Here's everything you need to know about camel treks, desert camps, and experiencing the magic of the world's largest hot desert.",
        content: "The Sahara Desert is one of the most awe-inspiring landscapes on Earth, and experiencing it firsthand is a bucket-list adventure for many travelers. From the towering dunes of Erg Chebbi to the peaceful silence of the desert night, a Sahara trip offers unforgettable memories.\n\nMost Sahara adventures begin in Marrakesh, with a scenic drive through the Atlas Mountains and the Draa Valley. Along the way, you'll pass through ancient kasbahs, including the famous Ait Benhaddou, a UNESCO World Heritage site that has served as a backdrop for countless films.\n\nUpon reaching the desert's edge, you'll trade your vehicle for a camel and embark on the iconic trek into the dunes. The rhythmic swaying of the camel, the changing colors of the sand as the sun sets, and the gradual transformation of the landscape create a truly magical experience.\n\nDesert camps range from basic Berber tents to luxury glamping experiences. Regardless of the level of comfort, the highlight remains the same: the night sky. Far from light pollution, the Sahara offers some of the clearest stargazing on the planet.\n\nPrepare for extreme temperature variations – scorching days and surprisingly cold nights. Pack layers, sunscreen, and a sense of adventure. The Sahara will reward you with an experience unlike any other.",
      },
      fr: {
        title: "Aventures dans le Désert : À Quoi S'Attendre lors d'un Voyage au Sahara",
        description: "Vous planifiez une aventure dans le désert du Sahara ? Voici tout ce que vous devez savoir sur les randonnées à dos de chameau, les camps du désert et la magie du plus grand désert chaud du monde.",
        content: "Le désert du Sahara est l'un des paysages les plus impressionnants de la Terre, et le vivre de première main est une aventure incontournable pour de nombreux voyageurs. Des dunes imposantes de l'Erg Chebbi au silence paisible de la nuit désertique, un voyage au Sahara offre des souvenirs inoubliables.\n\nLa plupart des aventures au Sahara commencent à Marrakech, avec une route panoramique à travers les montagnes de l'Atlas et la vallée du Draa. En chemin, vous passerez par d'anciennes kasbahs, dont la célèbre Aït Benhaddou, un site du patrimoine mondial de l'UNESCO qui a servi de décor à d'innombrables films.\n\nEn atteignant le bord du désert, vous échangerez votre véhicule contre un chameau et embarquerez pour le trek emblématique dans les dunes. Le balancement rythmique du chameau, les couleurs changeantes du sable au coucher du soleil et la transformation progressive du paysage créent une expérience vraiment magique.\n\nLes camps du désert vont des tentes berbères basiques aux expériences de glamping de luxe. Quel que soit le niveau de confort, le point culminant reste le même : le ciel nocturne. Loin de la pollution lumineuse, le Sahara offre l'une des observations d'étoiles les plus claires de la planète.\n\nPréparez-vous à des variations de température extrêmes – des journées brûlantes et des nuits étonnamment froides. Emportez des couches, de la crème solaire et un sens de l'aventure. Le Sahara vous récompensera d'une expérience unique.",
      },
      es: {
        title: "Aventuras en el Desierto: Qué Esperar en un Viaje al Sahara",
        description: "¿Planeas una aventura en el desierto del Sahara? Aquí está todo lo que necesitas saber sobre paseos en camello, campamentos del desierto y experimentar la magia del desierto caliente más grande del mundo.",
        content: "El desierto del Sahara es uno de los paisajes más impresionantes de la Tierra, y experimentarlo de primera mano es una aventura imperdible para muchos viajeros. Desde las imponentes dunas de Erg Chebbi hasta el silencio pacífico de la noche del desierto, un viaje al Sahara ofrece recuerdos inolvidables.\n\nLa mayoría de las aventuras en el Sahara comienzan en Marrakech, con un recorrido escénico a través de las montañas del Atlas y el Valle del Draa. En el camino, pasarás por antiguas kasbahs, incluyendo la famosa Ait Benhaddou, un sitio del Patrimonio Mundial de la UNESCO que ha servido como telón de fondo para innumerables películas.\n\nAl llegar al borde del desierto, cambiarás tu vehículo por un camello y emprenderás el icónico trek hacia las dunas. El balanceo rítmico del camello, los colores cambiantes de la arena mientras se pone el sol y la transformación gradual del paisaje crean una experiencia verdaderamente mágica.\n\nLos campamentos del desierto van desde tiendas bereberes básicas hasta experiencias de glamping de lujo. Independientemente del nivel de comodidad, lo más destacado sigue siendo el mismo: el cielo nocturno. Lejos de la contaminación lumínica, el Sahara ofrece una de las observaciones de estrellas más claras del planeta.\n\nPrepárate para variaciones extremas de temperatura – días abrasadores y noches sorprendentemente frías. Empaca capas, protector solar y un sentido de aventura. El Sahara te recompensará con una experiencia única.",
      },
    },
  },
]

// Helper function to get a blog post by ID
export function getBlogById(id: string): BlogPost | undefined {
  return blogPosts.find((post) => post.id === id)
}

// Helper function to get translated blog content
export function getTranslatedBlog(post: BlogPost, language: Language) {
  const translation = post.translations?.[language]
  
  if (!translation) {
    const englishTranslation = post.translations?.en
    if (englishTranslation && language !== "en") {
      return {
        ...post,
        title: englishTranslation.title,
        description: englishTranslation.description,
        content: englishTranslation.content,
      }
    }
    return post
  }
  
  return {
    ...post,
    title: translation.title,
    description: translation.description,
    content: translation.content,
  }
}

// Helper function to get an offer by its ID
export function getOfferById(id: string): Offer | undefined {
  const allOffersArray = [
    ...toursOffers,
    ...excursionsOffers,
    ...activitiesOffers,
    ...packagesOffers,
    ...transfersOffers,
  ]
  return allOffersArray.find((offer) => offer.id === id)
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
