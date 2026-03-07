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
          "w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm font-medium",
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
                <span className="flex-1 text-sm">{option.name}</span>
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
  const [condition, setCondition] = useState<string>(initial?.condition ?? "all")
  const [isExpanded, setIsExpanded] = useState(false)

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
    onChange({})
  }

  const hasActiveFilters = minPrice !== "" || maxPrice !== "" || search !== "" || condition !== "all"

  return (
    <div className="w-full mb-10">
      {/* Compact Filter Bar */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300",
            "border shadow-sm hover:shadow-lg",
            isExpanded
              ? "bg-primary text-white border-primary"
              : "bg-background text-foreground border-border hover:border-primary/50"
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          FILTERS
          {hasActiveFilters && (
            <span className="ml-1 w-6 h-6 rounded-full bg-white/20 text-[10px] flex items-center justify-center border border-white/30">
              {[minPrice, maxPrice, search, condition !== "all" ? condition : ""].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {search && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-primary/20">
              <Search className="w-3.5 h-3.5" />
              "{search}"
              <button onClick={() => { setSearch(""); emit() }} className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {(minPrice !== "" || maxPrice !== "") && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-primary/20">
              <DollarSign className="w-3.5 h-3.5" />
              {minPrice !== "" && maxPrice !== "" 
                ? `€${minPrice} - €${maxPrice}` 
                : minPrice !== "" 
                  ? `From €${minPrice}` 
                  : `Up to €${maxPrice}`}
              <button onClick={() => { setMinPrice(""); setMaxPrice(""); emit() }} className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {condition !== "all" && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-primary/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              {condition}
              <button onClick={() => { setCondition("all"); emit() }} className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
        </div>

        {/* Clear All */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={reset}
            className="text-xs text-muted-foreground hover:text-primary font-bold uppercase tracking-widest transition-colors"
          >
            {t.searchFilter.clearAll}
          </button>
        )}
      </div>

      {/* Expanded Filter Panel */}
      <div
        className={cn(
          "transition-all duration-500 ease-in-out",
          isExpanded ? "opacity-100 mt-6 max-h-[800px]" : "opacity-0 max-h-0 overflow-hidden pointer-events-none"
        )}
      >
        <div className="relative">
          <div className="p-6 sm:p-8 bg-card rounded-2xl border border-border shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search Bar */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  <Search className="w-4 h-4" />
                  Search Products
                </label>
                <div className="relative">
                   <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && emit()}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    placeholder="Keywords..."
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  <DollarSign className="w-4 h-4" />
                  Price Range (€)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={minPrice as any}
                    onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    placeholder="Min"
                  />
                  <span className="text-muted-foreground font-black text-xs">TO</span>
                  <input
                    type="number"
                    value={maxPrice as any}
                    onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Condition */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  <ShieldCheck className="w-4 h-4" />
                  Category
                </label>
                <FilterDropdown
                  options={CONDITIONS}
                  value={condition}
                  onChange={(val) => { setCondition(val); }}
                  placeholder="Select category"
                />
              </div>

              {/* Actions */}
              <div className="flex items-end gap-3">
                <button
                  type="button"
                  onClick={emit}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25"
                >
                  <Search className="w-4 h-4" />
                  {t.searchFilter.search}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="px-6 py-3.5 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground border border-border rounded-xl hover:bg-muted/50 transition-all"
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
