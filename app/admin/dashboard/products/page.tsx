"use client";

import { Package, Pencil, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

type EtatProduit = "neuf" | "occasion";

type TypeProduit = {
  id: string;
  nom: string;
};

type Produit = {
  id: string;
  reference: string;
  designation: string;
  description_courte: string;
  description: string;
  etat: EtatProduit;
  prix_unitaire: string;
  stock: number;
  type_id: string;
  type?: TypeProduit;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export default function ProductsPage() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [types, setTypes] = useState<TypeProduit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    reference: "",
    designation: "",
    description_courte: "",
    description: "",
    etat: "neuf" as EtatProduit,
    prix_unitaire: "",
    stock: "",
    type_id: "",
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
      type_id: "",
    });
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, typeRes] = await Promise.all([
        fetch(`${API_BASE_URL}/produits`),
        fetch(`${API_BASE_URL}/type-produits`),
      ]);

      if (!prodRes.ok) {
        throw new Error("Impossible de charger les produits");
      }
      if (!typeRes.ok) {
        throw new Error("Impossible de charger les types de produits");
      }

      const produitsData: Produit[] = await prodRes.json();
      const typesData: TypeProduit[] = await typeRes.json();

      setProduits(produitsData);
      setTypes(typesData);
    } catch (e: any) {
      setError(e.message || "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (produit: Produit) => {
    setEditingId(produit.id);
    setForm({
      reference: produit.reference,
      designation: produit.designation,
      description_courte: produit.description_courte,
      description: produit.description,
      etat: produit.etat,
      prix_unitaire: produit.prix_unitaire?.toString?.() ?? String(produit.prix_unitaire),
      stock: produit.stock.toString(),
      type_id: produit.type_id,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        reference: form.reference,
        designation: form.designation,
        description_courte: form.description_courte,
        description: form.description,
        etat: form.etat,
        prix_unitaire: Number(form.prix_unitaire),
        stock: Number(form.stock),
        type_id: form.type_id,
      };

      const url = editingId
        ? `${API_BASE_URL}/produits/${editingId}`
        : `${API_BASE_URL}/produits`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.message || "Impossible d’enregistrer le produit",
        );
      }

      await loadData();
      resetForm();
    } catch (e: any) {
      setError(e.message || "Erreur inattendue");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gray-800 flex items-center justify-center">
            <Package className="w-5 h-5 text-[#f2762b]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Produits</h1>
            <p className="text-xs text-gray-400">
              Consulter, créer et modifier les produits du catalogue.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#f2762b] hover:bg-[#d96521] text-xs font-semibold text-white transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Nouveau produit
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      )}

      {/* Formulaire produit */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#2c2c2c] border border-white/5 rounded-xl p-4 md:p-5 space-y-4"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-white">
            {editingId ? "Modifier le produit" : "Nouveau produit"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-gray-400 hover:text-gray-200 inline-flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Annuler la modification
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs text-gray-300" htmlFor="reference">
              Référence
            </label>
            <input
              id="reference"
              name="reference"
              value={form.reference}
              onChange={handleInputChange}
              required
              className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300" htmlFor="designation">
              Désignation
            </label>
            <input
              id="designation"
              name="designation"
              value={form.designation}
              onChange={handleInputChange}
              required
              className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b]"
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="text-xs text-gray-300"
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
              className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300" htmlFor="etat">
              État
            </label>
            <select
              id="etat"
              name="etat"
              value={form.etat}
              onChange={handleInputChange}
              className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#f2762b]"
            >
              <option value="neuf">Neuf</option>
              <option value="occasion">Occasion</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300" htmlFor="prix_unitaire">
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
              className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300" htmlFor="stock">
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
              className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b]"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs text-gray-300" htmlFor="type_id">
              Type de produit
            </label>
            <select
              id="type_id"
              name="type_id"
              value={form.type_id}
              onChange={handleInputChange}
              required
              className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#f2762b]"
            >
              <option value="">Sélectionner un type</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs text-gray-300" htmlFor="description">
              Description détaillée
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-3 py-1.5 rounded-full border border-white/10 text-xs text-gray-200 hover:bg-white/5"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f2762b] hover:bg-[#d96521] text-xs font-semibold text-white disabled:opacity-60"
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

      {/* Liste des produits */}
      <div className="bg-[#2c2c2c] border border-white/5 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Liste des produits</h2>
          {loading && (
            <span className="text-[11px] text-gray-400">Chargement...</span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-[#262626] text-gray-300">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Réf.</th>
                <th className="px-3 py-2 text-left font-medium">Désignation</th>
                <th className="px-3 py-2 text-left font-medium">Type</th>
                <th className="px-3 py-2 text-left font-medium">État</th>
                <th className="px-3 py-2 text-right font-medium">Prix</th>
                <th className="px-3 py-2 text-right font-medium">Stock</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {produits.length === 0 && !loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-6 text-center text-gray-400"
                  >
                    Aucun produit pour le moment.
                  </td>
                </tr>
              ) : (
                produits.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-3 py-2 text-gray-100">{p.reference}</td>
                    <td className="px-3 py-2 text-gray-100">
                      <div className="flex flex-col">
                        <span>{p.designation}</span>
                        <span className="text-[11px] text-gray-400">
                          {p.description_courte}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-200">
                      {p.type?.nom || "-"}
                    </td>
                    <td className="px-3 py-2 text-gray-200 capitalize">
                      {p.etat}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-100">
                      {p.prix_unitaire} MAD
                    </td>
                    <td className="px-3 py-2 text-right text-gray-100">
                      {p.stock}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleEdit(p)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-white/10 text-[11px] text-gray-100 hover:bg-white/10"
                      >
                        <Pencil className="w-3 h-3" />
                        Éditer
                      </button>
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

