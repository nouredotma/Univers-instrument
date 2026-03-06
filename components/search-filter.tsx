"use client"

import { useLanguage } from "@/components/language-provider"
import type { OfferType } from "@/lib/offers-data"
import { cn } from "@/lib/utils"
import { Calendar, Check, ChevronDown, DollarSign, MapPin, Search, SlidersHorizontal, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

const CITIES_DATA = [
  "Agadir", "Al Hoceima", "Asilah", "Azemmour", "Azrou", "Beni Mellal",
  "Berkane", "Berrechid", "Boujdour", "Bouznika", "Casablanca", "Chefchaouen",
  "Dakhla", "El Jadida", "Errachidia", "Essaouira", "Fes", "Guelmim",
  "Ifrane", "Kelaat M'Gouna", "Kenitra", "Khemisset", "Khenifra", "Khouribga",
  "Ksar El Kebir", "Laayoune", "Larache", "Marrakech", "Meknes", "M'diq",
  "Midelt", "Mohammedia", "Nador", "Ouarzazate", "Ouezzane", "Oujda",
  "Rabat", "Safi", "Saidia", "Salé", "Settat", "Sidi Ifni", "Sidi Kacem",
  "Sidi Slimane", "Skhirat", "Tanger", "Tan-Tan", "Taroudant", "Tata",
  "Taza", "Témara", "Tétouan", "Tiznit", "Zagora"
]

export interface Filters {
  minPrice?: number | null
  maxPrice?: number | null
  theme?: string
  category?: OfferType | "all"
  availableOn?: string | null
  departureCity?: string | null
}

interface Props {
  onChange: (filters: Filters) => void
  initial?: Filters
  showCategoryFilter?: boolean
}

// Custom Dropdown Component
function FilterDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder 
}: { 
  options: { name: string; value: string }[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find(o => o.value === value)

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-3 py-2 sm:py-2.5 bg-background border border-border rounded-lg text-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          "transition-all cursor-pointer flex items-center justify-between gap-2",
          isOpen && "ring-2 ring-primary/20 border-primary"
        )}
      >
        <span className="flex items-center gap-2 truncate">
          <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
            {selectedOption?.name || placeholder || "Select..."}
          </span>
        </span>
        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown Menu */}
      <div 
        className={cn(
          "absolute left-0 top-full mt-1.5 w-full min-w-[200px] bg-card rounded-xl shadow-xl border border-border overflow-hidden",
          "transition-all duration-200 origin-top",
          isOpen 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        )}
        style={{ zIndex: 9999 }}
      >
        <div className="py-1.5 max-h-64 overflow-y-auto">
          {options.map((option) => {
            const isSelected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full px-3 py-2 flex items-center gap-2.5 text-left transition-all duration-150",
                  isSelected 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground hover:bg-muted/50"
                )}
              >
                <span className="flex-1 font-medium text-sm">{option.name}</span>
                {isSelected && <Check className="w-4 h-4 text-primary" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function SearchFilter({ onChange, initial, showCategoryFilter = true }: Props) {
  const { t, language } = useLanguage()
  const [minPrice, setMinPrice] = useState<number | "">(initial?.minPrice ?? "")
  const [maxPrice, setMaxPrice] = useState<number | "">(initial?.maxPrice ?? "")
  const [availableOn, setAvailableOn] = useState<string>(initial?.availableOn ?? "")
  const [departureCity, setDepartureCity] = useState<string>(initial?.departureCity ?? "all")
  const [isExpanded, setIsExpanded] = useState(false)

  const CITIES = useMemo(() => [
    { name: t.searchFilter.allCities, value: "all" },
    ...CITIES_DATA.map(city => ({ name: city, value: city }))
  ], [t.searchFilter.allCities])

  const emit = () => {
    onChange({
      minPrice: minPrice === "" ? null : Number(minPrice),
      maxPrice: maxPrice === "" ? null : Number(maxPrice),
      // category removed from UI but keeping type compatibility if needed, though strictly it should be removed. 
      // The parent component expects Filters which includes category, so we can just omit it or pass 'all' / undefined effectively.
      // Actually, let's keep passing whatever the parent might expect or just omit it if the parent handles 'all' default.
      // Based on previous code, category was part of state. 
      // We'll pass category: "all" or simply omit if the interface allows optional.
      // Checking interface: category?: OfferType | "all". So acceptable.
      category: "all",
      availableOn: availableOn || null,
      departureCity: departureCity === "all" ? null : departureCity,
    })
  }

  const reset = () => {
    setMinPrice("")
    setMaxPrice("")
    setAvailableOn("")
    setDepartureCity("all")
    onChange({})
  }

  const hasActiveFilters = minPrice !== "" || maxPrice !== "" || availableOn !== "" || departureCity !== "all"

  return (
    <div className="w-full mb-8">
      {/* Compact Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
            "border shadow-sm hover:shadow-md",
            isExpanded
              ? "bg-primary text-white border-primary"
              : "bg-background text-foreground border-border hover:border-primary/50"
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t.searchFilter.title}
          {hasActiveFilters && (
            <span className="ml-1 w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center">
              {[minPrice, maxPrice, availableOn, departureCity !== "all" ? departureCity : ""].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {(minPrice !== "" || maxPrice !== "") && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <DollarSign className="w-3 h-3" />
              {minPrice !== "" && maxPrice !== "" 
                ? `€ ${minPrice} - € ${maxPrice}` 
                : minPrice !== "" 
                  ? `${t.searchFilter.fromPrice} € ${minPrice}` 
                  : `${t.searchFilter.upToPrice} € ${maxPrice}`}
              <button onClick={() => { setMinPrice(""); setMaxPrice(""); emit() }} className="ml-1 hover:bg-primary/20 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {availableOn && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <Calendar className="w-3 h-3" />
              {new Date(availableOn).toLocaleDateString(language === 'en' ? 'en-US' : language === 'fr' ? 'fr-FR' : 'es-ES', { month: "short", day: "numeric" })}
              <button onClick={() => { setAvailableOn(""); emit() }} className="ml-1 hover:bg-primary/20 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {departureCity !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <MapPin className="w-3 h-3" />
              {departureCity}
              <button onClick={() => { setDepartureCity("all"); emit() }} className="ml-1 hover:bg-primary/20 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        {/* Clear All */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={reset}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
          >
            {t.searchFilter.clearAll}
          </button>
        )}
      </div>

      {/* Expanded Filter Panel */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isExpanded ? "opacity-100 mt-2 sm:mt-4 max-h-[500px]" : "opacity-0 max-h-0 overflow-hidden pointer-events-none"
        )}
      >
        <div className="relative">
          <div className="p-3 sm:p-5 bg-card rounded-xl border border-border shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Price Range */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <DollarSign className="w-3.5 h-3.5" />
                  {t.searchFilter.priceRange}
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-semibold">€</span>
                    <input
                      type="number"
                      value={minPrice as any}
                      onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
                      onBlur={emit}
                      className="w-full pl-11 pr-3 py-2 sm:py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder={t.searchFilter.minPrice}
                      min={0}
                    />
                  </div>
                  <span className="text-muted-foreground text-sm">–</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-semibold">€</span>
                    <input
                      type="number"
                      value={maxPrice as any}
                      onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                      onBlur={emit}
                      className="w-full pl-11 pr-3 py-2 sm:py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder={t.searchFilter.maxPrice}
                      min={0}
                    />
                  </div>
                </div>
              </div>

              {/* Departure City */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <MapPin className="w-3.5 h-3.5" />
                  {t.searchFilter.departureCity}
                </label>
                <FilterDropdown
                  options={CITIES}
                  value={departureCity}
                  onChange={(val) => { setDepartureCity(val); setTimeout(emit, 0) }}
                  placeholder={t.searchFilter.selectCity}
                />
              </div>

              {/* Available On */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <Calendar className="w-3.5 h-3.5" />
                  {t.searchFilter.availableOn}
                </label>
                <input
                  type="date"
                  value={availableOn}
                  onChange={(e) => { setAvailableOn(e.target.value); setTimeout(emit, 0) }}
                  className="w-full px-3 py-2 sm:py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                />
              </div>

              {/* Actions */}
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={emit}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  {t.searchFilter.search}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="px-4 py-2 sm:py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {t.searchFilter.reset}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

