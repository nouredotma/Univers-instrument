"use client";

import jsPDF from "jspdf";
import { FileText, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

type Client = {
  id: string;
  nom: string;
};

type Produit = {
  id: string;
  reference: string;
  designation: string;
  prix_unitaire: string;
};

type DevisLigne = {
  id: string;
  produit_id: string;
  quantite: number;
  prix_unitaire: string;
  total: string;
  produit?: Produit;
};

type DevisClient = {
  id: string;
  numero: string;
  date_devis: string;
  client_id: string;
  montant_total: string;
  statut: string;
  client?: Client;
  lignes?: DevisLigne[];
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export default function ClientQuotesPage() {
  const [devis, setDevis] = useState<DevisClient[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    numero: "",
    date_devis: "",
    client_id: "",
    statut: "",
  });

  type LigneForm = {
    produit_id: string;
    quantite: string;
    prix_unitaire: number;
    total: number;
  };

  const [lignes, setLignes] = useState<LigneForm[]>([]);

  const resetForm = () => {
    setEditingId(null);
    setForm({
      numero: "",
      date_devis: "",
      client_id: "",
      statut: "",
    });
    setLignes([]);
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [devisRes, clientsRes, produitsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/devis-clients`),
        fetch(`${API_BASE_URL}/clients`),
        fetch(`${API_BASE_URL}/produits`),
      ]);

      if (!devisRes.ok) {
        throw new Error("Impossible de charger les devis clients");
      }
      if (!clientsRes.ok) {
        throw new Error("Impossible de charger les clients");
      }
      if (!produitsRes.ok) {
        throw new Error("Impossible de charger les produits");
      }

      const devisData: DevisClient[] = await devisRes.json();
      const clientsData: Client[] = await clientsRes.json();
      const produitsData: Produit[] = await produitsRes.json();

      setDevis(devisData);
      setClients(clientsData);
      setProduits(produitsData);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (d: DevisClient) => {
    setEditingId(d.id);
    setForm({
      numero: d.numero,
      date_devis: d.date_devis?.slice(0, 10) ?? "",
      client_id: d.client_id,
      statut: d.statut || "",
    });

    const dWithLines = d as DevisClient & { lignes?: DevisLigne[] };
    if (dWithLines.lignes && dWithLines.lignes.length) {
      setLignes(
        dWithLines.lignes.map((l) => ({
          produit_id: l.produit_id,
          quantite: String(l.quantite),
          prix_unitaire: Number(l.prix_unitaire),
          total: Number(l.total),
        })),
      );
    } else {
      setLignes([]);
    }
  };

  const updateLigne = (
    index: number,
    field: keyof LigneForm,
    value: string,
  ) => {
    setLignes((prev) => {
      const copy = [...prev];
      const current = { ...copy[index] };

      if (field === "produit_id") {
        current.produit_id = value;
        const produit = produits.find((p) => p.id === value);
        const prix = produit ? Number(produit.prix_unitaire) || 0 : 0;
        current.prix_unitaire = prix;
        const qte = Number(current.quantite) || 0;
        current.total = prix * qte;
      } else if (field === "quantite") {
        current.quantite = value;
        const qte = Number(value) || 0;
        current.total = current.prix_unitaire * qte;
      }

      copy[index] = current;
      return copy;
    });
  };

  const handleAddLigne = () => {
    setLignes((prev) => [
      ...prev,
      { produit_id: "", quantite: "1", prix_unitaire: 0, total: 0 },
    ]);
  };

  const handleRemoveLigne = (index: number) => {
    setLignes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer ce devis ?")) return;
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/devis-clients/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.message || "Impossible de supprimer le devis client",
        );
      }
      await loadData();
      if (editingId === id) {
        resetForm();
      }
    } catch (e: any) {
      setError(e.message || "Erreur inattendue");
    }
  };

  const handlePrint = (d: DevisClient) => {
    const devisWithLines = d as DevisClient & { lignes?: DevisLigne[] };

    const doc = new jsPDF();
    const marginLeft = 20;
    let currentY = 20;

    doc.setFontSize(14);
    doc.text("Devis client", marginLeft, currentY);
    currentY += 8;

    doc.setFontSize(10);
    doc.text(`Numéro: ${d.numero}`, marginLeft, currentY);
    currentY += 6;
    doc.text(`Date: ${d.date_devis?.slice(0, 10) || "-"}`, marginLeft, currentY);
    currentY += 6;
    doc.text(
      `Client: ${d.client?.nom || "Client inconnu"}`,
      marginLeft,
      currentY,
    );
    currentY += 10;

    doc.text(`Statut: ${d.statut || "-"}`, marginLeft, currentY);
    currentY += 8;

    // Table header
    doc.setFontSize(10);
    doc.text("Produit", marginLeft, currentY);
    doc.text("PU", marginLeft + 80, currentY);
    doc.text("Qté", marginLeft + 110, currentY);
    doc.text("Total", marginLeft + 130, currentY);
    currentY += 4;
    doc.line(marginLeft, currentY, marginLeft + 170, currentY);
    currentY += 6;

    let totalGlobal = 0;
    (devisWithLines.lignes || []).forEach((ligne) => {
      const produit = produits.find((p) => p.id === ligne.produit_id);
      const designation = produit
        ? `${produit.reference} - ${produit.designation}`
        : ligne.produit_id;

      doc.text(designation.substring(0, 40), marginLeft, currentY);
      doc.text(
        `${Number(ligne.prix_unitaire).toFixed(2)}`,
        marginLeft + 80,
        currentY,
        { align: "right" },
      );
      doc.text(
        `${ligne.quantite}`,
        marginLeft + 110,
        currentY,
        { align: "right" },
      );
      const totalLigne = Number(ligne.total) || 0;
      totalGlobal += totalLigne;
      doc.text(
        `${totalLigne.toFixed(2)}`,
        marginLeft + 150,
        currentY,
        { align: "right" },
      );
      currentY += 6;
    });

    currentY += 4;
    doc.line(marginLeft, currentY, marginLeft + 170, currentY);
    currentY += 8;
    doc.text(
      `Montant total: ${totalGlobal.toFixed(2)} MAD`,
      marginLeft,
      currentY,
    );

    doc.save(`devis-${d.numero}.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const lignesPayload = lignes
        .filter((l) => l.produit_id && Number(l.quantite) > 0)
        .map((l) => ({
          produit_id: l.produit_id,
          quantite: Number(l.quantite),
          prix_unitaire: l.prix_unitaire,
          total: l.total,
        }));

      const montantFromLignes =
        lignesPayload.length > 0
          ? lignesPayload.reduce((sum, l) => sum + l.total, 0)
          : 0;

      const payload = {
        numero: form.numero,
        date_devis: form.date_devis,
        client_id: form.client_id,
        montant_total: montantFromLignes,
        statut: form.statut || "brouillon",
        lignes: lignesPayload.length ? lignesPayload : undefined,
      };

      const url = editingId
        ? `${API_BASE_URL}/devis-clients/${editingId}`
        : `${API_BASE_URL}/devis-clients`;
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
          data?.message || "Impossible d’enregistrer le devis client",
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
            <FileText className="w-5 h-5 text-[#f2762b]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Devis client</h1>
            <p className="text-xs text-gray-400">
              Créer et gérer les devis pour vos clients.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#f2762b] hover:bg-[#d96521] text-xs font-semibold text-white transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Nouveau devis
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      )}

      {/* Formulaire devis */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#2c2c2c] border border-white/5 rounded-xl p-4 md:p-5 space-y-4"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-white">
            {editingId ? "Modifier le devis" : "Nouveau devis"}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs text-gray-300" htmlFor="numero">
              Numéro du devis
            </label>
            <input
              id="numero"
              name="numero"
              value={form.numero}
              onChange={handleInputChange}
              required
              className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300" htmlFor="date_devis">
              Date du devis
            </label>
            <input
              id="date_devis"
              name="date_devis"
              type="date"
              value={form.date_devis}
              onChange={handleInputChange}
              required
              className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300" htmlFor="client_id">
              Client
            </label>
            <select
              id="client_id"
              name="client_id"
              value={form.client_id}
              onChange={handleInputChange}
              required
              className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#f2762b]"
            >
              <option value="">Sélectionner un client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300" htmlFor="statut">
              Statut
            </label>
            <select
              id="statut"
              name="statut"
              value={form.statut}
              onChange={handleInputChange}
              className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#f2762b]"
            >
              <option value="">Sélectionner un statut</option>
              <option value="brouillon">Brouillon</option>
              <option value="envoyé">Envoyé</option>
              <option value="accepté">Accepté</option>
              <option value="refusé">Refusé</option>
              <option value="annulé">Annulé</option>
            </select>
          </div>
        </div>

        {/* Lignes du devis */}
        <div className="space-y-2 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white">
              Lignes du devis
            </h3>
            <button
              type="button"
              onClick={handleAddLigne}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[11px] text-white"
            >
              <Plus className="w-3 h-3" />
              Ajouter une ligne
            </button>
          </div>

          {lignes.length === 0 ? (
            <p className="text-[11px] text-gray-400">
              Aucune ligne pour le moment. Ajoutez au moins un produit et une
              quantité pour calculer automatiquement le montant.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-[11px]">
                <thead className="bg-[#262626] text-gray-300">
                  <tr>
                    <th className="px-2 py-1 text-left font-medium">
                      Produit
                    </th>
                    <th className="px-2 py-1 text-right font-medium">
                      Prix unitaire
                    </th>
                    <th className="px-2 py-1 text-right font-medium">
                      Quantité
                    </th>
                    <th className="px-2 py-1 text-right font-medium">Total</th>
                    <th className="px-2 py-1 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lignes.map((ligne, index) => {
                    const produit = produits.find(
                      (p) => p.id === ligne.produit_id,
                    );
                    return (
                      <tr
                        key={index}
                        className="border-t border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-2 py-1 text-gray-100">
                          <select
                            value={ligne.produit_id}
                            onChange={(e) =>
                              updateLigne(index, "produit_id", e.target.value)
                            }
                            className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-2 py-1 text-[11px] text-white focus:outline-none focus:ring-1 focus:ring-[#f2762b]"
                          >
                            <option value="">Sélectionner un produit</option>
                            {produits.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.reference} — {p.designation}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-1 text-right text-gray-100">
                          {ligne.prix_unitaire.toFixed(2)} MAD
                        </td>
                        <td className="px-2 py-1 text-right text-gray-100">
                          <input
                            type="number"
                            min={1}
                            value={ligne.quantite}
                            onChange={(e) =>
                              updateLigne(index, "quantite", e.target.value)
                            }
                            className="w-16 rounded-md bg-[#3a3a3a] border border-white/10 px-2 py-1 text-[11px] text-white text-right focus:outline-none focus:ring-1 focus:ring-[#f2762b]"
                          />
                        </td>
                        <td className="px-2 py-1 text-right text-gray-100">
                          {ligne.total.toFixed(2)} MAD
                        </td>
                        <td className="px-2 py-1 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveLigne(index)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-red-500/40 text-[11px] text-red-200 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-3 h-3" />
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
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

      {/* Liste des devis */}
      <div className="bg-[#2c2c2c] border border-white/5 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text_white text-white">
            Liste des devis clients
          </h2>
          {loading && (
            <span className="text-[11px] text-gray-400">Chargement...</span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-[#262626] text-gray-300">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Numéro</th>
                <th className="px-3 py-2 text-left font-medium">Date</th>
                <th className="px-3 py-2 text-left font-medium">Client</th>
                <th className="px-3 py-2 text-left font-medium">Statut</th>
                <th className="px-3 py-2 text-right font-medium">Montant</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {devis.length === 0 && !loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-6 text-center text-gray-400"
                  >
                    Aucun devis pour le moment.
                  </td>
                </tr>
              ) : (
                devis.map((d) => (
                  <tr
                    key={d.id}
                    className="border-t border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-3 py-2 text-gray-100">{d.numero}</td>
                    <td className="px-3 py-2 text-gray-100">
                      {d.date_devis?.slice(0, 10)}
                    </td>
                    <td className="px-3 py-2 text-gray-100">
                      {d.client?.nom || (
                        <span className="text-gray-500">Client inconnu</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-gray-100">
                      {d.statut || <span className="text-gray-500">—</span>}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-100">
                      {d.montant_total} MAD
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(d)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-white/10 text-[11px] text-gray-100 hover:bg-white/10"
                        >
                          <Pencil className="w-3 h-3" />
                          Éditer
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePrint(d)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-white/10 text-[11px] text-gray-100 hover:bg-white/10"
                        >
                          Imprimer
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(d.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-red-500/40 text-[11px] text-red-200 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-3 h-3" />
                          Supprimer
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

