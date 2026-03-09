"use client";

import jsPDF from "jspdf";
import { CreditCard, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

type Client = { id: string; nom: string };
type FactureClient = { id: string; numero: string; client_id: string };

type AvoirClient = {
  id: string;
  numero: string;
  montant: string;
  facture_id: string;
  client_id: string;
  client?: Client;
  facture?: FactureClient;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export default function ClientCreditNotesPage() {
  const [items, setItems] = useState<AvoirClient[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [factures, setFactures] = useState<FactureClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ numero: "", montant: "", facture_id: "", client_id: "" });

  const resetForm = () => {
    setEditingId(null);
    setForm({ numero: "", montant: "", facture_id: "", client_id: "" });
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [r1, r2, r3] = await Promise.all([
        fetch(`${API_BASE_URL}/avoirs-clients`),
        fetch(`${API_BASE_URL}/clients`),
        fetch(`${API_BASE_URL}/factures-clients`),
      ]);
      if (!r1.ok || !r2.ok || !r3.ok) throw new Error("Erreur chargement");
      const [d1, d2, d3] = await Promise.all([r1.json(), r2.json(), r3.json()]);
      setItems(d1);
      setClients(d2);
      setFactures(d3);
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

  const handleEdit = (d: AvoirClient) => {
    setEditingId(d.id);
    setForm({
      numero: d.numero,
      montant: d.montant?.toString?.() ?? String(d.montant),
      facture_id: d.facture_id,
      client_id: d.client_id,
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cet avoir ?")) return;
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/avoirs-clients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.message || "Erreur suppression");
      await loadData();
      if (editingId === id) resetForm();
    } catch (e: any) {
      setError(e.message || "Erreur inattendue");
    }
  };

  const handlePrint = (d: AvoirClient) => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(14);
    doc.text("Avoir client", 20, y);
    y += 10;
    doc.setFontSize(10);
    doc.text(`Numéro: ${d.numero}`, 20, y);
    y += 6;
    doc.text(`Client: ${d.client?.nom || "-"}`, 20, y);
    y += 6;
    doc.text(`Facture liée: ${d.facture?.numero || d.facture_id}`, 20, y);
    y += 6;
    doc.text(`Montant: ${d.montant} MAD`, 20, y);
    doc.save(`avoir-${d.numero}.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        numero: form.numero,
        montant: Number(form.montant),
        facture_id: form.facture_id,
        client_id: form.client_id,
      };
      const url = editingId ? `${API_BASE_URL}/avoirs-clients/${editingId}` : `${API_BASE_URL}/avoirs-clients`;
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
            <CreditCard className="w-5 h-5 text-[#f2762b]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Avoirs client</h1>
            <p className="text-xs text-gray-400">Créer et gérer les avoirs (notes de crédit) clients.</p>
          </div>
        </div>
        <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#f2762b] hover:bg-[#d96521] text-xs font-semibold text-white">
          <Plus className="w-3.5 h-3.5" />
          Nouvel avoir
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#2c2c2c] border border-white/5 rounded-xl p-4 md:p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-white">{editingId ? "Modifier l'avoir" : "Nouvel avoir"}</h2>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-xs text-gray-400 hover:text-gray-200 inline-flex items-center gap-1">
              <X className="w-3 h-3" /> Annuler
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs text-gray-300">Numéro</label>
            <input name="numero" value={form.numero} onChange={handleInputChange} required className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#f2762b]" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-gray-300">Montant (MAD)</label>
            <input name="montant" type="number" step="0.01" min="0" value={form.montant} onChange={handleInputChange} required className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#f2762b]" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-gray-300">Facture</label>
            <select name="facture_id" value={form.facture_id} onChange={handleInputChange} required className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#f2762b]">
              <option value="">Sélectionner</option>
              {factures.filter((f) => !form.client_id || f.client_id === form.client_id).map((f) => (
                <option key={f.id} value={f.id}>{f.numero}</option>
              ))}
            </select>
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
          <h2 className="text-sm font-semibold text-white">Liste des avoirs</h2>
          {loading && <span className="text-[11px] text-gray-400">Chargement...</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-[#262626] text-gray-300">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Numéro</th>
                <th className="px-3 py-2 text-left font-medium">Client</th>
                <th className="px-3 py-2 text-left font-medium">Facture</th>
                <th className="px-3 py-2 text-right font-medium">Montant</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-gray-400">Aucun avoir.</td>
                </tr>
              ) : (
                items.map((d) => (
                  <tr key={d.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-3 py-2 text-gray-100">{d.numero}</td>
                    <td className="px-3 py-2 text-gray-100">{d.client?.nom || "—"}</td>
                    <td className="px-3 py-2 text-gray-100">{d.facture?.numero || d.facture_id}</td>
                    <td className="px-3 py-2 text-right text-gray-100">{d.montant} MAD</td>
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
