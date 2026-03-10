"use client";

import { ArrowLeft, ImageIcon, Pencil, Plus, Trash2, X, Upload, Globe, Search, Star } from "lucide-react";
import { useState, useMemo } from "react";
import Image from "next/image";
import type {
  Product,
  ProductCategory,
  ProductTranslations,
  SpecificationsTable,
} from "@/lib/products-data";
import { products as initialProducts } from "@/lib/products-data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/*  Category config                                                    */
/* ------------------------------------------------------------------ */

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "consumables", label: "Consommables" },
  { value: "water", label: "Eau" },
  { value: "agriculture", label: "Agriculture" },
  { value: "laboratory", label: "Laboratoire" },
  { value: "medical", label: "Médical" },
  { value: "furniture", label: "Mobilier" },
  { value: "weighing", label: "Pesage" },
  { value: "chemicals", label: "Chimie" },
  { value: "used", label: "Occasion" },
];

const categoryLabel = (cat: ProductCategory) =>
  CATEGORIES.find((c) => c.value === cat)?.label ?? cat;

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

const inputBase =
  "w-full rounded-sm bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b] focus:border-[#f2762b] transition-colors";

const langLabel = (lang: "en" | "fr") =>
  lang === "en" ? "🇬🇧 English" : "🇫🇷 Français";

/* ------------------------------------------------------------------ */
/*  Specs Table builder (reusable for each language)                    */
/* ------------------------------------------------------------------ */

function SpecsTableBuilder({
  headers,
  rows,
  onChange,
}: {
  headers: string[];
  rows: string[][];
  onChange: (spec: SpecificationsTable) => void;
}) {
  const colCount = headers.length || 2;

  const updateHeader = (idx: number, val: string) => {
    const next = [...headers];
    next[idx] = val;
    onChange({ headers: next, rows });
  };

  const updateCell = (rIdx: number, cIdx: number, val: string) => {
    const next = rows.map((r) => [...r]);
    next[rIdx][cIdx] = val;
    onChange({ headers, rows: next });
  };

  const addRow = () => {
    onChange({ headers, rows: [...rows, Array(colCount).fill("")] });
  };

  const removeRow = (idx: number) => {
    onChange({ headers, rows: rows.filter((_, i) => i !== idx) });
  };

  const addColumn = () => {
    onChange({
      headers: [...headers, ""],
      rows: rows.map((r) => [...r, ""]),
    });
  };

  const removeColumn = (idx: number) => {
    if (headers.length <= 2) return;
    onChange({
      headers: headers.filter((_, i) => i !== idx),
      rows: rows.map((r) => r.filter((_, i) => i !== idx)),
    });
  };

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs border border-gray-200 rounded-sm">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((h, i) => (
                <th key={i} className="px-2 py-1.5 text-left">
                  <div className="flex items-center gap-1">
                    <input
                      value={h}
                      onChange={(e) => updateHeader(i, e.target.value)}
                      placeholder={`En-tête ${i + 1}`}
                      className="flex-1 bg-transparent border-none text-xs font-medium text-gray-700 focus:outline-none placeholder:text-gray-400"
                    />
                    {headers.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeColumn(i)}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="border-t border-gray-100">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-2 py-1">
                    <input
                      value={cell}
                      onChange={(e) => updateCell(rIdx, cIdx, e.target.value)}
                      placeholder="—"
                      className="w-full bg-transparent text-xs text-gray-700 focus:outline-none placeholder:text-gray-400"
                    />
                  </td>
                ))}
                <td className="px-1 py-1">
                  <button
                    type="button"
                    onClick={() => removeRow(rIdx)}
                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={addRow}
          className="text-[11px] text-[#f2762b] hover:text-[#d96521] font-medium cursor-pointer"
        >
          + Ligne
        </button>
        <button
          type="button"
          onClick={addColumn}
          className="text-[11px] text-[#f2762b] hover:text-[#d96521] font-medium cursor-pointer"
        >
          + Colonne
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Translatable field component                                       */
/* ------------------------------------------------------------------ */

function TranslatableInput({
  label,
  enValue,
  frValue,
  onEnChange,
  onFrChange,
  multiline = false,
  required = false,
}: {
  label: string;
  enValue: string;
  frValue: string;
  onEnChange: (val: string) => void;
  onFrChange: (val: string) => void;
  multiline?: boolean;
  required?: boolean;
}) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div className="space-y-2">
      <label className="text-xs text-gray-500 font-medium">{label}</label>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {(["en", "fr"] as const).map((lang) => (
          <div key={lang} className="space-y-1">
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {langLabel(lang)}
            </span>
            <Tag
              value={lang === "en" ? enValue : frValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                lang === "en" ? onEnChange(e.target.value) : onFrChange(e.target.value)
              }
              required={required && lang === "en"}
              rows={multiline ? 3 : undefined}
              placeholder={`${label} (${lang.toUpperCase()})`}
              className={inputBase + (multiline ? " resize-y min-h-[72px]" : "")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function ProductsPage() {
  const [produits, setProduits] = useState<Product[]>(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  /* ---- Form state ---- */
  const [mainImage, setMainImage] = useState("");
  const [thumbnailImages, setThumbnailImages] = useState<string[]>([""]);
  const [category, setCategory] = useState<ProductCategory>("laboratory");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [stock, setStock] = useState("");
  const [isBest, setIsBest] = useState(false);

  /* Translation state for EN */
  const [nameEn, setNameEn] = useState("");
  const [shortDescEn, setShortDescEn] = useState("");
  const [longDescEn, setLongDescEn] = useState("");
  const [specsEn, setSpecsEn] = useState<SpecificationsTable>({
    headers: ["Parameter", "Specification"],
    rows: [["", ""]],
  });

  /* Translation state for FR */
  const [nameFr, setNameFr] = useState("");
  const [shortDescFr, setShortDescFr] = useState("");
  const [longDescFr, setLongDescFr] = useState("");
  const [specsFr, setSpecsFr] = useState<SpecificationsTable>({
    headers: ["Paramètre", "Spécification"],
    rows: [["", ""]],
  });

  /* ---- Filtering ---- */
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return produits;
    const query = searchQuery.toLowerCase();
    return produits.filter((p) => {
      return (
        p.name.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.shortDescription.toLowerCase().includes(query) ||
        p.translations?.fr?.name.toLowerCase().includes(query)
      );
    });
  }, [produits, searchQuery]);

  const bestProductsCount = useMemo(() => {
    return produits.filter(p => p.isBest).length;
  }, [produits]);

  /* ---- Helpers ---- */
  const resetForm = () => {
    setEditingId(null);
    setMainImage("");
    setThumbnailImages([""]);
    setCategory("laboratory");
    setPrice("");
    setOldPrice("");
    setStock("");
    setIsBest(false);
    setNameEn("");
    setShortDescEn("");
    setLongDescEn("");
    setSpecsEn({ headers: ["Parameter", "Specification"], rows: [["", ""]] });
    setNameFr("");
    setShortDescFr("");
    setLongDescFr("");
    setSpecsFr({ headers: ["Paramètre", "Spécification"], rows: [["", ""]] });
  };

  const handleNewProduct = () => {
    resetForm();
    setShowForm(true);
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setMainImage(p.mainImage);
    setThumbnailImages(p.thumbnailImages.length > 0 ? p.thumbnailImages : [""]);
    setCategory(p.category);
    setPrice(p.price.toString());
    setOldPrice(p.oldPrice?.toString() ?? "");
    setStock(p.stock.toString());
    setIsBest(!!p.isBest);

    const en = p.translations?.en;
    const fr = p.translations?.fr;

    setNameEn(en?.name ?? p.name);
    setShortDescEn(en?.shortDescription ?? p.shortDescription);
    setLongDescEn(en?.longDescription ?? p.longDescription);
    setSpecsEn(
      en?.specificationsTable ??
        p.specificationsTable ?? { headers: ["Parameter", "Specification"], rows: [["", ""]] }
    );

    setNameFr(fr?.name ?? "");
    setShortDescFr(fr?.shortDescription ?? "");
    setLongDescFr(fr?.longDescription ?? "");
    setSpecsFr(
      fr?.specificationsTable ?? { headers: ["Paramètre", "Spécification"], rows: [["", ""]] }
    );

    setShowForm(true);
  };

  /* ---- Thumbnail management ---- */
  const updateThumbnail = (idx: number, val: string) => {
    setThumbnailImages((prev) => prev.map((t, i) => (i === idx ? val : t)));
  };
  const addThumbnail = () => setThumbnailImages((prev) => [...prev, ""]);
  const removeThumbnail = (idx: number) =>
    setThumbnailImages((prev) => prev.filter((_, i) => i !== idx));

  /* ---- Image Upload ---- */
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProduct = (p: Product) => {
    setProduits((prev) => prev.filter((x) => x.id !== p.id));
    setProductToDelete(null);
  };

  /* ---- Submit ---- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const buildTranslation = (
      name: string,
      shortDesc: string,
      longDesc: string,
      specs: SpecificationsTable
    ): ProductTranslations => ({
      name,
      shortDescription: shortDesc,
      longDescription: longDesc,
      specificationsTable:
        specs.rows.length > 0 && specs.rows.some((r) => r.some((c) => c.trim()))
          ? specs
          : undefined,
    });

    const hasSpecs =
      specsEn.rows.length > 0 && specsEn.rows.some((r) => r.some((c) => c.trim()));

    const newProduct: Product = {
      id: editingId || `prod-${Date.now()}`,
      name: nameEn,
      shortDescription: shortDescEn,
      longDescription: longDescEn,
      specificationsTable: hasSpecs ? specsEn : undefined,
      mainImage: mainImage || "/unnamed.jpg",
      thumbnailImages: thumbnailImages.filter((t) => t.trim()),
      category,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      stock: Number(stock),
      isBest,
      translations: {
        en: buildTranslation(nameEn, shortDescEn, longDescEn, specsEn),
        fr: buildTranslation(nameFr, shortDescFr, longDescFr, specsFr),
      },
    };

    if (editingId) {
      setProduits((prev) => prev.map((p) => (p.id === editingId ? newProduct : p)));
    } else {
      setProduits((prev) => [newProduct, ...prev]);
    }

    resetForm();
    setShowForm(false);
    setSaving(false);
  };

  /* ================================================================ */
  /*  FORM VIEW                                                        */
  /* ================================================================ */
  if (showForm) {
    return (
      <div className="space-y-4 md:space-y-6">
        {/* Back button */}
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer rounded-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour à la liste
        </button>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border-2 border-gray-200 rounded-sm p-4 md:p-6 space-y-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-gray-800">
              {editingId ? "Modifier le produit" : "Nouveau produit"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="text-xs text-gray-400 hover:text-gray-600 inline-flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                Annuler
              </button>
            )}
          </div>

          {/* ---- Images Section ---- */}
          <div className="space-y-4 border-b border-gray-100 pb-5">
            <h3 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#f2762b]" />
              Images
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Main image */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500" htmlFor="mainImage">
                  Image principale
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      id="mainImage"
                      value={mainImage}
                      onChange={(e) => setMainImage(e.target.value)}
                      placeholder="URL de l'image"
                      className={inputBase + " pr-10"}
                    />
                    <label className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer hover:text-[#f2762b] transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, setMainImage)}
                      />
                    </label>
                  </div>
                  {mainImage && (
                    <div className="relative w-10 h-10 rounded-sm overflow-hidden border border-gray-200 flex-shrink-0">
                      <Image
                        src={mainImage}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500">Images miniatures (URLs)</label>
                  <div className="space-y-1.5 pt-2">
                    {thumbnailImages.map((thumb, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <div className="flex-1 relative">
                          <input
                            value={thumb}
                            onChange={(e) => updateThumbnail(idx, e.target.value)}
                            placeholder="URL de l'image"
                            className={inputBase + " pr-10"}
                          />
                          <label className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer hover:text-[#f2762b] transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, (val) => updateThumbnail(idx, val))}
                            />
                          </label>
                        </div>
                        {thumb && (
                          <div className="relative w-8 h-8 rounded-sm overflow-hidden border border-gray-200 flex-shrink-0">
                            <Image
                              src={thumb}
                              alt="Thumb"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        )}
                        {thumbnailImages.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeThumbnail(idx)}
                            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addThumbnail}
                      className="text-[11px] text-[#f2762b] hover:text-[#d96521] font-medium cursor-pointer inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Ajouter miniature
                    </button>
                  </div>
              </div>
            </div>
          </div>

          {/* ---- Translatable Fields Section ---- */}
          <div className="space-y-5 border-b border-gray-100 pb-5">
            <h3 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#f2762b]" />
              Informations du produit (Traductions EN / FR)
            </h3>

            <TranslatableInput
              label="Nom du produit"
              enValue={nameEn}
              frValue={nameFr}
              onEnChange={setNameEn}
              onFrChange={setNameFr}
              required
            />

            <TranslatableInput
              label="Description courte"
              enValue={shortDescEn}
              frValue={shortDescFr}
              onEnChange={setShortDescEn}
              onFrChange={setShortDescFr}
              required
            />

            <TranslatableInput
              label="Description longue"
              enValue={longDescEn}
              frValue={longDescFr}
              onEnChange={setLongDescEn}
              onFrChange={setLongDescFr}
              multiline
              required
            />

            {/* Specifications tables per language */}
            <div className="space-y-3">
              <label className="text-xs text-gray-500 font-medium">
                Tableau des spécifications
              </label>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {langLabel("en")}
                  </span>
                  <SpecsTableBuilder
                    headers={specsEn.headers}
                    rows={specsEn.rows}
                    onChange={setSpecsEn}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {langLabel("fr")}
                  </span>
                  <SpecsTableBuilder
                    headers={specsFr.headers}
                    rows={specsFr.rows}
                    onChange={setSpecsFr}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ---- Category, Price, Stock ---- */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-[#f2762b]" />
              Catégorie, prix & stock
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500" htmlFor="category">
                  Catégorie
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className={inputBase}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500" htmlFor="price">
                  Prix (MAD)
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  placeholder="0.00"
                  className={inputBase}
                />
              </div>

              {/* Old Price */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500" htmlFor="oldPrice">
                  Ancien prix (MAD)
                </label>
                <input
                  id="oldPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                  placeholder="Optionnel"
                  className={inputBase}
                />
              </div>

              {/* Stock */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500" htmlFor="stock">
                  Stock
                </label>
                <input
                  id="stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  placeholder="0"
                  className={inputBase}
                />
              </div>
            </div>

            {/* Best Product Checkbox */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isBest" 
                  checked={isBest}
                  onCheckedChange={(checked) => {
                    if (checked && bestProductsCount >= 4 && !produits.find(p => p.id === editingId)?.isBest) {
                      toast.error("Limite atteinte", {
                        description: "Vous ne pouvez avoir que 4 produits 'coup de cœur' au maximum."
                      });
                      return;
                    }
                    setIsBest(checked === true);
                  }}
                />
                <Label htmlFor="isBest" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 cursor-pointer">
                  <Star className={`w-3.5 h-3.5 ${isBest ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
                  Produit "Coup de Coeur" (Best Product)
                </Label>
              </div>
              <p className="text-[10px] text-gray-400 italic">
                Actuellement: {bestProductsCount}/4 produits sélectionnés sur le site.
              </p>
            </div>
          </div>

          {/* ---- Actions ---- */}
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-sm border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-sm bg-[#f2762b] hover:bg-[#d96521] text-xs font-semibold text-white disabled:opacity-60 transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              {saving
                ? "Enregistrement..."
                : editingId
                  ? "Mettre à jour"
                  : "Créer"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  /* ================================================================ */
  /*  LIST VIEW                                                        */
  /* ================================================================ */
  return (
    <div className="space-y-4 md:space-y-6">
      {/* CTA Row */}
      <div className="flex flex-col-reverse md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un produit (Nom, ID, catégorie...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-sm text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b] focus:border-[#f2762b] transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={handleNewProduct}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-[#f2762b] hover:bg-[#d96521] border border-[#f2762b] hover:border-[#d96521] text-xs font-semibold text-white transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Nouveau produit
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white border-2 border-gray-200 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-3 md:px-5 py-2.5 text-left font-medium">ID</th>
                <th className="px-3 md:px-5 py-2.5 text-left font-medium">Image</th>
                <th className="px-3 md:px-5 py-2.5 text-left font-medium">Nom</th>
                <th className="px-3 md:px-5 py-2.5 text-left font-medium">Catégorie</th>
                <th className="px-3 md:px-5 py-2.5 text-right font-medium">Prix</th>
                <th className="px-3 md:px-5 py-2.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 md:px-5 py-6 text-center text-gray-400"
                  >
                    {searchQuery ? "Aucun produit ne correspond à votre recherche." : "Aucun produit pour le moment."}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors"
                  >
                    {/* ID */}
                    <td className="px-3 md:px-5 py-2.5 font-mono text-[11px] text-gray-500">
                      {p.id}
                    </td>

                    {/* Main Image */}
                    <td className="px-3 md:px-5 py-2.5">
                      <div className="relative w-10 h-10 rounded-sm overflow-hidden border border-gray-200 bg-gray-100">
                        <Image
                          src={p.mainImage}
                          alt={p.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-3 md:px-5 py-2.5 text-gray-800">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium">{p.name}</span>
                          {p.isBest && (
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400 line-clamp-1">
                          {p.shortDescription}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-3 md:px-5 py-2.5">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] md:text-[11px] font-semibold border bg-blue-50 text-blue-600 border-blue-200 capitalize">
                        {categoryLabel(p.category)}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-3 md:px-5 py-2.5 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-medium text-gray-800">
                          {p.price.toLocaleString("fr-FR")} MAD
                        </span>
                        {p.oldPrice && (
                          <span className="text-[10px] text-gray-400 line-through">
                            {p.oldPrice.toLocaleString("fr-FR")} MAD
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-3 md:px-5 py-2.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEdit(p)}
                          className="w-7 h-7 flex items-center justify-center rounded-sm border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductToDelete(p)}
                          className="w-7 h-7 flex items-center justify-center rounded-sm border border-red-200 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent className="sm:max-w-[400px] p-5 gap-3">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Cette action est irréversible. Cela supprimera définitivement le produit
              <span className="font-semibold text-gray-900 block mt-1 underline"> {productToDelete?.name} </span>
              de notre base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:gap-2">
            <AlertDialogCancel className="h-8 text-[11px] px-4">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => productToDelete && handleDeleteProduct(productToDelete)}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 h-8 text-[11px] px-4"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
