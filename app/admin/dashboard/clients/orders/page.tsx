"use client";

import jsPDF from "jspdf";
import { Pencil, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

type Client = { id: string; nom: string };
type Produit = { id: string; reference: string; designation: string; prix_unitaire: string };
type DevisClient = { id: string; numero: string; client_id: string };
type LigneDoc = { id?: string; produit_id: string; quantite: number; prix_unitaire: string; total: string; produit?: Produit };

type CommandeClient = {
  id: string;
  numero: string;
  date_commande: string;
  client_id: string;
  devis_id?: string | null;
  montant_total: string;
  statut: string;
  client?: Client;
  devis?: DevisClient;
  lignes?: LigneDoc[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

type LigneForm = { produit_id: string; quantite: string; prix_unitaire: number; total: number };

export default function ClientOrdersPage() {
  const [items, setItems] = useState<CommandeClient[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [devis, setDevis] = useState<DevisClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ numero: "", date_commande: "", client_id: "", devis_id: "", statut: "" });
  const [lignes, setLignes] = useState<LigneForm[]>([]);

  const resetForm = () => {
    setEditingId(null);
    setForm({ numero: "", date_commande: "", client_id: "", devis_id: "", statut: "" });
    setLignes([]);
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [r1, r2, r3, r4] = await Promise.all([
        fetch(`${API_BASE_URL}/commandes-clients`),
        fetch(`${API_BASE_URL}/clients`),
        fetch(`${API_BASE_URL}/produits`),
        fetch(`${API_BASE_URL}/devis-clients`),
      ]);
      if (!r1.ok || !r2.ok || !r3.ok || !r4.ok) throw new Error("Erreur chargement");
      const [d1, d2, d3, d4] = await Promise.all([r1.json(), r2.json(), r3.json(), r4.json()]);
      setItems(d1);
      setClients(d2);
      setProduits(d3);
      setDevis(d4);
    } catch (e: any) {
      setError(e.message || "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEdit = (d: CommandeClient) => {
    setEditingId(d.id);
    setForm({
      numero: d.numero,
      date_commande: d.date_commande?.slice(0, 10) ?? "",
      client_id: d.client_id,
      devis_id: d.devis_id ?? "",
      statut: d.statut || "",
    });
    const withLines = d as CommandeClient & { lignes?: LigneDoc[] };
    setLignes(
      (withLines.lignes || []).map((l) => ({
        produit_id: l.produit_id,
        quantite: String(l.quantite),
        prix_unitaire: Number(l.prix_unitaire),
        total: Number(l.total),
      })),
    );
  };

  const updateLigne = (index: number, field: keyof LigneForm, value: string) => {
    setLignes((prev) => {
      const copy = [...prev];
      const c = { ...copy[index] };
      if (field === "produit_id") {
        c.produit_id = value;
        const p = produits.find((x) => x.id === value);
        c.prix_unitaire = p ? Number(p.prix_unitaire) || 0 : 0;
        c.total = c.prix_unitaire * (Number(c.quantite) || 0);
      } else if (field === "quantite") {
        c.quantite = value;
        c.total = c.prix_unitaire * (Number(value) || 0);
      }
      copy[index] = c;
      return copy;
    });
  };

  const handleAddLigne = () => setLignes((p) => [...p, { produit_id: "", quantite: "1", prix_unitaire: 0, total: 0 }]);
  const handleRemoveLigne = (i: number) => setLignes((p) => p.filter((_, j) => j !== i));

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cette commande ?")) return;
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/commandes-clients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.message || "Erreur suppression");
      await loadData();
      if (editingId === id) resetForm();
    } catch (e: any) {
      setError(e.message || "Erreur inattendue");
    }
  };

  const handlePrint = (d: CommandeClient) => {
    const withLines = d as CommandeClient & { lignes?: LigneDoc[] };
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(14);
    doc.text("Commande client", 20, y);
    y += 10;
    doc.setFontSize(10);
    doc.text(`Numéro: ${d.numero}`, 20, y);
    y += 6;
    doc.text(`Date: ${d.date_commande?.slice(0, 10) || "-"}`, 20, y);
    y += 6;
    doc.text(`Client: ${d.client?.nom || "-"}`, 20, y);
    y += 6;
    doc.text(`Statut: ${d.statut || "-"}`, 20, y);
    y += 10;
    doc.text("Produit", 20, y);
    doc.text("PU", 100, y);
    doc.text("Qté", 130, y);
    doc.text("Total", 150, y);
    y += 6;
    doc.line(20, y, 190, y);
    y += 6;
    let total = 0;
    (withLines.lignes || []).forEach((l) => {
      const p = produits.find((x) => x.id === l.produit_id);
      doc.text(p ? `${p.reference} - ${p.designation}`.substring(0, 35) : l.produit_id, 20, y);
      doc.text(`${Number(l.prix_unitaire).toFixed(2)}`, 100, y, { align: "right" });
      doc.text(`${l.quantite}`, 130, y, { align: "right" });
      const t = Number(l.total) || 0;
      total += t;
      doc.text(`${t.toFixed(2)}`, 170, y, { align: "right" });
      y += 6;
    });
    y += 4;
    doc.line(20, y, 190, y);
    y += 8;
    doc.text(`Montant total: ${total.toFixed(2)} MAD`, 20, y);
    doc.save(`commande-${d.numero}.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const lignesPayload = lignes
        .filter((l) => l.produit_id && Number(l.quantite) > 0)
        .map((l) => ({ produit_id: l.produit_id, quantite: Number(l.quantite), prix_unitaire: l.prix_unitaire, total: l.total }));
      const montant = lignesPayload.length ? lignesPayload.reduce((s, l) => s + l.total, 0) : 0;
      const payload = {
        numero: form.numero,
        date_commande: form.date_commande,
        client_id: form.client_id,
        devis_id: form.devis_id || undefined,
        montant_total: montant,
        statut: form.statut || "brouillon",
        lignes: lignesPayload.length ? lignesPayload : undefined,
      };
      const url = editingId ? `${API_BASE_URL}/commandes-clients/${editingId}` : `${API_BASE_URL}/commandes-clients`;
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.message || "Erreur enregistrement");
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
            <ShoppingCart className="w-5 h-5 text-[#f2762b]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Commandes client</h1>
            <p className="text-xs text-gray-400">Créer et gérer les commandes clients.</p>
          </div>
        </div>
        <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#f2762b] hover:bg-[#d96521] text-xs font-semibold text-white">
          <Plus className="w-3.5 h-3.5" />
          Nouvelle commande
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#2c2c2c] border border-white/5 rounded-xl p-4 md:p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-white">{editingId ? "Modifier la commande" : "Nouvelle commande"}</h2>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-xs text-gray-400 hover:text-gray-200 inline-flex items-center gap-1">
              <X className="w-3 h-3" /> Annuler
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs text-gray-300">Numéro</label>
            <input name="numero" value={form.numero} onChange={handleInputChange} required className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#f2762b]" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-gray-300">Date commande</label>
            <input name="date_commande" type="date" value={form.date_commande} onChange={handleInputChange} required className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#f2762b]" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-gray-300">Client</label>
            <select name="client_id" value={form.client_id} onChange={handleInputChange} required className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#f2762b]">
              <option value="">Sélectionner</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-gray-300">Devis (optionnel)</label>
            <select name="devis_id" value={form.devis_id} onChange={handleInputChange} className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#f2762b]">
              <option value="">Aucun</option>
              {devis.filter((d) => !form.client_id || d.client_id === form.client_id).map((d) => (
                <option key={d.id} value={d.id}>{d.numero}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-gray-300">Statut</label>
            <select name="statut" value={form.statut} onChange={handleInputChange} className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#f2762b]">
              <option value="">Sélectionner</option>
              <option value="brouillon">Brouillon</option>
              <option value="envoyé">Envoyé</option>
              <option value="accepté">Accepté</option>
              <option value="refusé">Refusé</option>
              <option value="annulé">Annulé</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white">Lignes</h3>
            <button type="button" onClick={handleAddLigne} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[11px] text-white">
              <Plus className="w-3 h-3" /> Ajouter une ligne
            </button>
          </div>
          {lignes.length === 0 ? (
            <p className="text-[11px] text-gray-400">Aucune ligne. Ajoutez des produits.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-[11px]">
                <thead className="bg-[#262626] text-gray-300">
                  <tr>
                    <th className="px-2 py-1 text-left">Produit</th>
                    <th className="px-2 py-1 text-right">PU</th>
                    <th className="px-2 py-1 text-right">Qté</th>
                    <th className="px-2 py-1 text-right">Total</th>
                    <th className="px-2 py-1 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lignes.map((ligne, i) => (
                    <tr key={i} className="border-t border-white/5">
                      <td className="px-2 py-1">
                        <select value={ligne.produit_id} onChange={(e) => updateLigne(i, "produit_id", e.target.value)} className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-2 py-1 text-[11px] text-white">
                          <option value="">Sélectionner</option>
                          {produits.map((p) => (
                            <option key={p.id} value={p.id}>{p.reference} — {p.designation}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-1 text-right">{ligne.prix_unitaire.toFixed(2)} MAD</td>
                      <td className="px-2 py-1 text-right">
                        <input type="number" min={1} value={ligne.quantite} onChange={(e) => updateLigne(i, "quantite", e.target.value)} className="w-16 rounded-md bg-[#3a3a3a] border border-white/10 px-2 py-1 text-[11px] text-white text-right" />
                      </td>
                      <td className="px-2 py-1 text-right">{ligne.total.toFixed(2)} MAD</td>
                      <td className="px-2 py-1 text-right">
                        <button type="button" onClick={() => handleRemoveLigne(i)} className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-red-500/40 text-[11px] text-red-200 hover:bg-red-500/20">
                          <Trash2 className="w-3 h-3" /> Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {editingId && (
            <button type="button" onClick={resetForm} className="px-3 py-1.5 rounded-full border border-white/10 text-xs text-gray-200 hover:bg-white/5">Annuler</button>
          )}
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f2762b] hover:bg-[#d96521] text-xs font-semibold text-white disabled:opacity-60">
            <Pencil className="w-3.5 h-3.5" />
            {saving ? "Enregistrement..." : editingId ? "Mettre à jour" : "Créer"}
          </button>
        </div>
      </form>

      <div className="bg-[#2c2c2c] border border-white/5 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Liste des commandes</h2>
          {loading && <span className="text-[11px] text-gray-400">Chargement...</span>}
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
              {items.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-gray-400">Aucune commande.</td>
                </tr>
              ) : (
                items.map((d) => (
                  <tr key={d.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-3 py-2 text-gray-100">{d.numero}</td>
                    <td className="px-3 py-2 text-gray-100">{d.date_commande?.slice(0, 10)}</td>
                    <td className="px-3 py-2 text-gray-100">{d.client?.nom || "—"}</td>
                    <td className="px-3 py-2 text-gray-100">{d.statut || "—"}</td>
                    <td className="px-3 py-2 text-right text-gray-100">{d.montant_total} MAD</td>
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button type="button" onClick={() => handleEdit(d)} className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-white/10 text-[11px] text-gray-100 hover:bg-white/10">
                          <Pencil className="w-3 h-3" /> Éditer
                        </button>
                        <button type="button" onClick={() => handlePrint(d)} className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-white/10 text-[11px] text-gray-100 hover:bg-white/10">
                          Imprimer
                        </button>
                        <button type="button" onClick={() => handleDelete(d.id)} className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-red-500/40 text-[11px] text-red-200 hover:bg-red-500/20">
                          <Trash2 className="w-3 h-3" /> Supprimer
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
