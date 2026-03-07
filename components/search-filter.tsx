"use client"

import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, DollarSign, Search, SlidersHorizontal, X, Package, ShieldCheck } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export interface Filters {
  minPrice?: number | null
  maxPrice?: number | null
  search?: string
  condition?: string | null
}

interface Props {
  onChange: (filters: Filters) => void
  initial?: Filters
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
          "w-full px-4 py-2.5 bg-background border border-border rounded-lg text-xs md:text-sm font-medium",
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
          "absolute left-0 top-full mt-2 w-full min-w-[200px] bg-card rounded-xl shadow-2xl border border-border overflow-hidden",
          "transition-all duration-200 origin-top",
          isOpen 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        )}
        style={{ zIndex: 9999 }}
      >
        <div className="py-2 max-h-64 overflow-y-auto">
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
                  "w-full px-4 py-2.5 flex items-center gap-3 text-left transition-all duration-150",
                  isSelected 
                    ? "bg-primary/10 text-primary font-semibold" 
                    : "text-foreground hover:bg-muted/50"
                )}
              >
                <span className="flex-1 text-xs md:text-sm">{option.name}</span>
                {isSelected && <Check className="w-4 h-4 text-primary" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function SearchFilter({ onChange, initial }: Props) {
  const { t } = useLanguage()
  const [minPrice, setMinPrice] = useState<number | "">(initial?.minPrice ?? "")
  const [maxPrice, setMaxPrice] = useState<number | "">(initial?.maxPrice ?? "")
  const [search, setSearch] = useState<string>(initial?.search ?? "")
  // Whenever the URL changes outside, update the local state if needed
  useEffect(() => {
    setSearch(initial?.search ?? "")
    setMinPrice(initial?.minPrice ?? "")
    setMaxPrice(initial?.maxPrice ?? "")
    setCondition(initial?.condition ?? "all")
  }, [initial?.search, initial?.minPrice, initial?.maxPrice, initial?.condition])

  const [condition, setCondition] = useState<string>(initial?.condition ?? "all")

  const CONDITIONS = [
    { name: "All Categories", value: "all" },
    { name: "Laboratory Instruments", value: "laboratory" },
    { name: "Consumables & Accessories", value: "consumables" },
    { name: "Water & Environment", value: "water" },
    { name: "Agricultural Instruments", value: "agriculture" },
    { name: "Medical", value: "medical" },
    { name: "Laboratory Furniture", value: "furniture" },
    { name: "Weighing", value: "weighing" },
    { name: "Chemicals & Reagents", value: "chemicals" },
    { name: "Used Products", value: "used" },
  ]

  const emit = () => {
    onChange({
      minPrice: minPrice === "" ? null : Number(minPrice),
      maxPrice: maxPrice === "" ? null : Number(maxPrice),
      search: search || "",
      condition: condition === "all" ? null : condition,
    })
  }

  const reset = () => {
    setMinPrice("")
    setMaxPrice("")
    setSearch("")
    setCondition("all")
    setTimeout(() => {
      onChange({})
    }, 0)
  }

  return (
    <div className="w-full">
      <div className="bg-[#414141] rounded-md px-3 py-4 lg:p-5 h-fit">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4 lg:mb-6 border-b border-white/20 pb-3 lg:pb-4 text-amber-400">Filters</h3>
        
        <div className="flex flex-col gap-4 lg:gap-6">
          {/* Search Bar */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white">
              Search Products
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && emit()}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-xs md:text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 transition-all"
              placeholder="Keywords..."
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-6">
            {/* Condition / Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white">
                Category
              </label>
              <FilterDropdown
                options={CONDITIONS}
                value={condition}
                onChange={(val) => { setCondition(val); }}
                placeholder="Select category"
              />
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white">
                Price Range (€)
              </label>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <input
                  type="number"
                  value={minPrice as any}
                  onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-2 sm:px-3 py-2 bg-white/10 border border-white/20 rounded-md text-xs md:text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 transition-all min-w-0"
                  placeholder="Min"
                />
                <span className="text-white/50 text-xs shrink-0">-</span>
                <input
                  type="number"
                  value={maxPrice as any}
                  onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-2 sm:px-3 py-2 bg-white/10 border border-white/20 rounded-md text-xs md:text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 transition-all min-w-0"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-row lg:flex-col gap-2 mt-1">
            <button
              type="button"
              onClick={emit}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-white text-[#414141] text-xs font-bold rounded-sm hover:bg-white/90 transition-all cursor-pointer"
            >
              Apply Filter
            </button>
            <button
              type="button"
              onClick={reset}
              className="flex-1 px-3 py-2.5 text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 border border-white/20 lg:border-transparent rounded-sm cursor-pointer transition-all"
            >
              Clear all
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
