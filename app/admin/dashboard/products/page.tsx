"use client";

import { ArrowLeft, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { mockProduits, type MockProduit } from "@/lib/admin-mock-data";

type EtatProduit = "neuf" | "occasion";

export default function ProductsPage() {
  const [produits, setProduits] = useState<MockProduit[]>(mockProduits);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    reference: "",
    designation: "",
    description_courte: "",
    description: "",
    etat: "neuf" as EtatProduit,
    prix_unitaire: "",
    stock: "",
    type: "",
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({
      reference: "",
      designation: "",
      description_courte: "",
      description: "",
      etat: "neuf",
      prix_unitaire: "",
      stock: "",
      type: "",
    });
  };

  const handleNewProduct = () => {
    resetForm();
    setShowForm(true);
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (produit: MockProduit) => {
    setEditingId(produit.id);
    setForm({
      reference: produit.reference,
      designation: produit.designation,
      description_courte: produit.description_courte,
      description: produit.description,
      etat: produit.etat,
      prix_unitaire: produit.prix_unitaire.toString(),
      stock: produit.stock.toString(),
      type: produit.type,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const newProduit: MockProduit = {
      id: editingId || `p${Date.now()}`,
      reference: form.reference,
      designation: form.designation,
      description_courte: form.description_courte,
      description: form.description,
      etat: form.etat,
      prix_unitaire: Number(form.prix_unitaire),
      stock: Number(form.stock),
      type: form.type,
    };

    if (editingId) {
      setProduits((prev) =>
        prev.map((p) => (p.id === editingId ? newProduit : p))
      );
    } else {
      setProduits((prev) => [newProduit, ...prev]);
    }

    resetForm();
    setShowForm(false);
    setSaving(false);
  };

  /* ---- Form View (full page, no table) ---- */
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
          className="bg-white border-2 border-gray-200 rounded-sm p-3 md:p-5 space-y-4"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500" htmlFor="reference">
                Référence
              </label>
              <input
                id="reference"
                name="reference"
                value={form.reference}
                onChange={handleInputChange}
                required
                className="w-full rounded-sm bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b] focus:border-[#f2762b]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-500" htmlFor="designation">
                Désignation
              </label>
              <input
                id="designation"
                name="designation"
                value={form.designation}
                onChange={handleInputChange}
                required
                className="w-full rounded-sm md:rounded-md bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b] focus:border-[#f2762b]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                className="text-xs text-gray-500"
                htmlFor="description_courte"
              >
                Description courte
              </label>
              <input
                id="description_courte"
                name="description_courte"
                value={form.description_courte}
                onChange={handleInputChange}
                required
                className="w-full rounded-sm md:rounded-md bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b] focus:border-[#f2762b]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-500" htmlFor="etat">
                État
              </label>
              <select
                id="etat"
                name="etat"
                value={form.etat}
                onChange={handleInputChange}
                className="w-full rounded-sm bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#f2762b] focus:border-[#f2762b]"
              >
                <option value="neuf">Neuf</option>
                <option value="occasion">Occasion</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-500" htmlFor="prix_unitaire">
                Prix unitaire (HT)
              </label>
              <input
                id="prix_unitaire"
                name="prix_unitaire"
                type="number"
                step="0.01"
                min="0"
                value={form.prix_unitaire}
                onChange={handleInputChange}
                required
                className="w-full rounded-sm bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b] focus:border-[#f2762b]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-500" htmlFor="stock">
                Stock
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleInputChange}
                required
                className="w-full rounded-sm md:rounded-md bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b] focus:border-[#f2762b]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs text-gray-500" htmlFor="type">
                Type de produit
              </label>
              <input
                id="type"
                name="type"
                value={form.type}
                onChange={handleInputChange}
                required
                className="w-full rounded-sm md:rounded-md bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b] focus:border-[#f2762b]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs text-gray-500" htmlFor="description">
                Description détaillée
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-sm md:rounded-md bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b] focus:border-[#f2762b]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1.5 rounded-sm border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[#f2762b] hover:bg-[#d96521] text-xs font-semibold text-white disabled:opacity-60 transition-colors cursor-pointer"
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

  /* ---- List View (CTA + Table) ---- */
  return (
    <div className="space-y-4 md:space-y-6">
      {/* CTA Row */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleNewProduct}
          className="inline-flex items-center gap-2 px-3 py-2.5 rounded-sm bg-[#f2762b] hover:bg-[#d96521] text-xs font-semibold text-white transition-colors cursor-pointer"
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
                <th className="px-3 md:px-5 py-2.5 text-left font-medium">
                  Réf.
                </th>
                <th className="px-3 md:px-5 py-2.5 text-left font-medium">
                  Désignation
                </th>
                <th className="px-3 md:px-5 py-2.5 text-left font-medium">
                  Type
                </th>
                <th className="px-3 md:px-5 py-2.5 text-left font-medium">
                  État
                </th>
                <th className="px-3 md:px-5 py-2.5 text-right font-medium">
                  Prix
                </th>
                <th className="px-3 md:px-5 py-2.5 text-right font-medium">
                  Stock
                </th>
                <th className="px-3 md:px-5 py-2.5 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {produits.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 md:px-5 py-6 text-center text-gray-400"
                  >
                    Aucun produit pour le moment.
                  </td>
                </tr>
              ) : (
                produits.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-3 md:px-5 py-2.5 font-semibold text-gray-800">
                      {p.reference}
                    </td>
                    <td className="px-3 md:px-5 py-2.5 text-gray-600">
                      <div className="flex flex-col">
                        <span>{p.designation}</span>
                        <span className="text-[11px] text-gray-400">
                          {p.description_courte}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 md:px-5 py-2.5 text-gray-600">
                      {p.type}
                    </td>
                    <td className="px-3 md:px-5 py-2.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] md:text-[11px] font-semibold border capitalize ${
                          p.etat === "neuf"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }`}
                      >
                        {p.etat}
                      </span>
                    </td>
                    <td className="px-3 md:px-5 py-2.5 text-right font-medium text-gray-800">
                      {p.prix_unitaire.toLocaleString("fr-FR")} MAD
                    </td>
                    <td className="px-3 md:px-5 py-2.5 text-right text-gray-600">
                      {p.stock}
                    </td>
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
                          onClick={() => setProduits((prev) => prev.filter((x) => x.id !== p.id))}
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
    </div>
  );
}
