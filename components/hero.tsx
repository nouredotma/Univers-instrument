"use client"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, Compass, MapPin, Search } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"


const SERVICES = [
  { id: "tours", label: { en: "Tours", fr: "Circuits", es: "Circuitos" }, path: "/tours" },
  { id: "excursions", label: { en: "Excursions", fr: "Excursions", es: "Excursiones" }, path: "/excursions" },
  { id: "activities", label: { en: "Activities", fr: "Activités", es: "Actividades" }, path: "/activities" },
  { id: "transfers", label: { en: "Transfers", fr: "Transferts", es: "Traslados" }, path: "/transfers" },
]

const CITIES = [
  "Agadir", "Al Hoceima", "Asilah", "Azemmour", "Azrou", "Beni Mellal",
  "Berkane", "Berrechid", "Boujdour", "Bouznika", "Casablanca", "Chefchaouen",
  "Dakhla", "El Jadida", "Errachidia", "Essaouira", "Fes", "Guelmim",
  "Ifrane", "Kelaat M'Gouna", "Kenitra", "Khemisset", "Khenifra", "Khouribga",
  "Ksar El Kebir", "Laayoune", "Larache", "Marrakech", "Meknes", "M'diq",
  "Midelt", "Mohammedia", "Nador", "Ouarzazate", "Ouezzane", "Oujda",
  "Rabat", "Safi", "Saidia", "Salé", "Settat", "Sidi Ifni", "Sidi Kacem",
  "Sidi Slimane", "Skhirat", "Tanger", "Tan-Tan", "Taroudant", "Tata",
  "Taza", "Témara", "Tétouan", "Tiznit", "Zagora"
].sort()

export default function Hero() {
  const router = useRouter()
  const { language } = useLanguage()
  const [activeService, setActiveService] = useState(SERVICES[0])
  const [selectedCity, setSelectedCity] = useState("Marrakech")
  
  const [openService, setOpenService] = useState(false)
  const [openCity, setOpenCity] = useState(false)

  const handleSearch = () => {
    router.push(`${activeService.path}?city=${selectedCity}`)
  }



  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100svh" }}>
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <img
          src="/hero-bg.png"
          alt="Univers Instrument Service"
          className="w-full h-full object-cover select-none"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-2">
        <div className="w-full max-w-5xl mx-auto space-y-6 px-14 md:px-0">
          
          {/* Main Search Bar */}
          <div className="bg-white/20 md:bg-white/95 backdrop-blur-md rounded-md p-1.5 md:p-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20 flex flex-col md:flex-row items-stretch gap-2">
            
            {/* Service Selector */}
            <div className="w-full md:flex-1 relative">
              <Popover open={openService} onOpenChange={setOpenService}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={openService}
                    className="w-full h-12 md:h-16 justify-start text-left font-normal hover:bg-primary/10 rounded-md px-3 md:px-4 gap-3 md:gap-4 transition-all duration-200 group border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer text-white md:text-gray-900 bg-black/20 md:bg-transparent"
                  >
                    <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-white/20 md:bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                      <Compass className="h-4 w-4 md:h-5 md:w-5 text-white md:text-primary" />
                    </div>
                    <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
                      <span className="text-[9px] md:text-xs font-bold text-white/80 md:text-gray-500 uppercase tracking-wider">
                        {language === 'fr' ? 'Service' : language === 'es' ? 'Servicio' : 'Service'}
                      </span>
                      <span className="text-xs md:text-base font-semibold text-white md:text-gray-900 truncate">
                        {activeService.label[language as keyof typeof activeService.label] || activeService.label.en}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-white md:text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0 rounded-md overflow-hidden shadow-xl border-gray-100" align="start">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {SERVICES.map((service) => (
                          <CommandItem
                            key={service.id}
                            value={service.id}
                            onSelect={() => {
                              setActiveService(service)
                              setOpenService(false)
                            }}
                            className="flex items-center gap-3 px-3 py-2 cursor-pointer aria-selected:bg-primary/10 hover:bg-primary/5 mb-1 rounded-sm mx-1"
                          >
                            <div className={cn(
                              "flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-200",
                              activeService.id === service.id ? "border-primary bg-primary/10 text-primary" : "border-gray-200 text-transparent"
                            )}>
                              <Check className="h-3 w-3" />
                            </div>
                            <span className={cn(
                              "flex-1 text-sm font-medium",
                              activeService.id === service.id ? "text-primary" : "text-gray-700"
                            )}>
                              {service.label[language as keyof typeof service.label] || service.label.en}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 md:h-10 bg-gray-200/80" />
            </div>

            {/* City Selector */}
            <div className="w-full md:flex-1 relative">
              <Popover open={openCity} onOpenChange={setOpenCity}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={openCity}
                    className="w-full h-12 md:h-16 justify-start text-left font-normal hover:bg-primary/10 rounded-md px-3 md:px-4 gap-3 md:gap-4 transition-all duration-200 group border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer text-white md:text-gray-900 bg-black/20 md:bg-transparent"
                  >
                    <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-white/20 md:bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                      <MapPin className="h-4 w-4 md:h-5 md:w-5 text-white md:text-primary" />
                    </div>
                    <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
                      <span className="text-[9px] md:text-xs font-bold text-white/80 md:text-gray-500 uppercase tracking-wider">
                        {language === 'fr' ? 'Ville de départ' : language === 'es' ? 'Ciudad de salida' : 'Departure City'}
                      </span>
                      <span className="text-xs md:text-base font-semibold text-white md:text-gray-900 truncate">
                        {selectedCity}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-white md:text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0 rounded-md overflow-hidden shadow-xl border-gray-100" align="start">
                  <Command>
                    <CommandInput placeholder={language === 'fr' ? 'Rechercher une ville...' : 'Search city...'} className="h-10 text-sm" />
                    <CommandList>
                      <CommandEmpty className="py-4 text-center text-xs text-gray-500">
                        {language === 'fr' ? 'Aucune ville trouvée.' : 'No city found.'}
                      </CommandEmpty>
                      <CommandGroup className="max-h-[300px] overflow-y-auto p-1">
                        {CITIES.map((city) => (
                          <CommandItem
                            key={city}
                            value={city}
                            onSelect={(currentValue) => {
                              setSelectedCity(city)
                              setOpenCity(false)
                            }}
                            className="flex items-center gap-3 px-3 py-2 cursor-pointer aria-selected:bg-primary/10 hover:bg-primary/5 rounded-sm mb-1"
                          >
                            <div className={cn(
                              "flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-200",
                              selectedCity === city ? "border-primary bg-primary/10 text-primary" : "border-gray-200 text-transparent"
                            )}>
                              <Check className="h-3 w-3" />
                            </div>
                            <span className={cn(
                              "flex-1 text-sm font-medium",
                              selectedCity === city ? "text-primary" : "text-gray-700"
                            )}>
                              {city}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Search Button */}
            <div className="w-full md:w-auto p-0">
              <Button 
                onClick={handleSearch}
                size="lg"
                className="w-full md:w-auto h-12 md:h-16 px-8 md:px-12 rounded-md bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 font-bold text-sm md:text-lg group cursor-pointer"
              >
                <Search className="h-5 w-5 mr-0 md:mr-2 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline">
                  {language === 'fr' ? 'Rechercher' : language === 'es' ? 'Buscar' : 'Search'}
                </span>
                <span className="md:hidden">
                  {language === 'fr' ? 'Rechercher' : language === 'es' ? 'Buscar' : 'Search'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* TripAdvisor Badge */}
      <a
        href="https://www.tripadvisor.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex lg:hidden flex-col items-center gap-1 mt-6 glass px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
      >
        <Image
          src="/certif.png"
          alt="TripAdvisor"
          width={56}
          height={56}
          className="w-10 h-10 md:w-14 md:h-14 rounded-sm"
          sizes="(max-width: 768px) 40px, 56px"
        />
      </a>
    </section>
  )
}
