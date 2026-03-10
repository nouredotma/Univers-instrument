"use client";

import { Banknote, Pencil, Plus, Search, Trash2, X, ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type Client = { id: string; nom: string };
type FactureClient = { id: string; numero: string; client_id: string };
type ReglementClient = { id: string; numero: string; date_reglement: string; montant: string; mode_paiement: string; facture_id: string; client_id: string; client?: Client; facture?: FactureClient };

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
const inputBase = "w-full rounded-sm bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b] focus:border-[#f2762b] transition-colors";

export default function ClientPaymentsPage() {
  const [items, setItems] = useState<ReglementClient[]>([]); const [clients, setClients] = useState<Client[]>([]); const [factures, setFactures] = useState<FactureClient[]>([]);
  const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null); const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); const [showForm, setShowForm] = useState(false); const [editingId, setEditingId] = useState<string | null>(null); const [itemToDelete, setItemToDelete] = useState<ReglementClient | null>(null);
  const [form, setForm] = useState({ numero: "", date_reglement: "", montant: "", mode_paiement: "", facture_id: "", client_id: "" });

  const resetForm = () => { setEditingId(null); setForm({ numero: "", date_reglement: "", montant: "", mode_paiement: "", facture_id: "", client_id: "" }); };
  const handleNewItem = () => { resetForm(); setShowForm(true); }; const handleCancel = () => { resetForm(); setShowForm(false); };

  const loadData = async () => { setLoading(true); setError(null); try { const [r1, r2, r3] = await Promise.all([fetch(`${API}/reglements-clients`), fetch(`${API}/clients`), fetch(`${API}/factures-clients`)]); if (!r1.ok || !r2.ok || !r3.ok) throw new Error("Erreur chargement"); setItems(await r1.json()); setClients(await r2.json()); setFactures(await r3.json()); } catch (e: any) { setError(e.message); } finally { setLoading(false); } };
  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => { if (!searchQuery.trim()) return items; const q = searchQuery.toLowerCase(); return items.filter(d => d.numero?.toLowerCase().includes(q) || d.client?.nom?.toLowerCase().includes(q) || d.mode_paiement?.toLowerCase().includes(q)); }, [items, searchQuery]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleEdit = (d: ReglementClient) => { setEditingId(d.id); setForm({ numero: d.numero, date_reglement: d.date_reglement?.slice(0, 10) ?? "", montant: d.montant?.toString?.() ?? String(d.montant), mode_paiement: d.mode_paiement || "", facture_id: d.facture_id, client_id: d.client_id }); setShowForm(true); };
  const handleDelete = async (d: ReglementClient) => { setError(null); try { const res = await fetch(`${API}/reglements-clients/${d.id}`, { method: "DELETE" }); if (!res.ok) throw new Error("Erreur suppression"); await loadData(); if (editingId === d.id) resetForm(); } catch (e: any) { setError(e.message); } setItemToDelete(null); };

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); setError(null); try { const payload = { numero: form.numero, date_reglement: form.date_reglement, montant: Number(form.montant), mode_paiement: form.mode_paiement, facture_id: form.facture_id, client_id: form.client_id }; const url = editingId ? `${API}/reglements-clients/${editingId}` : `${API}/reglements-clients`; const res = await fetch(url, { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); if (!res.ok) throw new Error("Erreur enregistrement"); await loadData(); resetForm(); setShowForm(false); } catch (e: any) { setError(e.message); } finally { setSaving(false); } };

  if (showForm) {
    return (
      <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button type="button" onClick={handleCancel} className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer group"><ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Retour à la liste</button>
        {error && <div className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-200 rounded-sm p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between gap-3"><h2 className="text-sm font-semibold text-gray-800">{editingId ? "Modifier le règlement" : "Nouveau règlement"}</h2>{editingId && <button type="button" onClick={handleCancel} className="text-xs text-gray-400 hover:text-gray-600 inline-flex items-center gap-1 cursor-pointer"><X className="w-3 h-3" /> Annuler</button>}</div>
          <div className="space-y-4 border-b border-gray-100 pb-5"><h3 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5"><Banknote className="w-3.5 h-3.5 text-[#f2762b]" /> Informations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="space-y-1.5"><label className="text-xs text-gray-500">Numéro *</label><input name="numero" value={form.numero} onChange={handleInputChange} required placeholder="REG-001" className={inputBase} /></div>
              <div className="space-y-1.5"><label className="text-xs text-gray-500">Date *</label><input name="date_reglement" type="date" value={form.date_reglement} onChange={handleInputChange} required className={inputBase} /></div>
              <div className="space-y-1.5"><label className="text-xs text-gray-500">Montant (MAD) *</label><input name="montant" type="number" step="0.01" min="0" value={form.montant} onChange={handleInputChange} required placeholder="0.00" className={inputBase} /></div>
              <div className="space-y-1.5"><label className="text-xs text-gray-500">Mode de paiement</label><select name="mode_paiement" value={form.mode_paiement} onChange={handleInputChange} className={inputBase}><option value="">Sélectionner</option><option value="espèces">Espèces</option><option value="chèque">Chèque</option><option value="virement">Virement</option><option value="carte">Carte bancaire</option><option value="effet">Effet de commerce</option></select></div>
              <div className="space-y-1.5"><label className="text-xs text-gray-500">Client *</label><select name="client_id" value={form.client_id} onChange={handleInputChange} required className={inputBase}><option value="">Sélectionner</option>{clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}</select></div>
              <div className="space-y-1.5"><label className="text-xs text-gray-500">Facture *</label><select name="facture_id" value={form.facture_id} onChange={handleInputChange} required className={inputBase}><option value="">Sélectionner</option>{factures.filter(f => !form.client_id || f.client_id === form.client_id).map(f => <option key={f.id} value={f.id}>{f.numero}</option>)}</select></div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100"><button type="button" onClick={handleCancel} className="px-4 py-2 rounded-sm border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Annuler</button><button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2 rounded-sm bg-[#f2762b] hover:bg-[#d96521] text-xs font-semibold text-white disabled:opacity-60 transition-colors cursor-pointer"><Pencil className="w-3.5 h-3.5" />{saving ? "Enregistrement..." : editingId ? "Mettre à jour" : "Créer"}</button></div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col-reverse md:flex-row items-stretch md:items-center justify-between gap-4"><div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Rechercher un règlement..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={`${inputBase} pl-10 h-10`} /></div><button type="button" onClick={handleNewItem} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-sm bg-[#f2762b] hover:bg-[#d96521] text-xs font-semibold text-white transition-colors cursor-pointer"><Plus className="w-3.5 h-3.5" /> Nouveau règlement</button></div>
      {error && <div className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>}
      <div className="bg-white border-2 border-gray-200 rounded-sm overflow-hidden text-[#414141]"><div className="overflow-x-auto"><table className="min-w-full text-xs"><thead className="bg-gray-50 text-gray-500"><tr><th className="px-3 md:px-5 py-3 text-left font-semibold">Numéro</th><th className="px-3 md:px-5 py-3 text-left font-semibold">Date</th><th className="px-3 md:px-5 py-3 text-left font-semibold">Client</th><th className="px-3 md:px-5 py-3 text-left font-semibold">Mode</th><th className="px-3 md:px-5 py-3 text-left font-semibold">Facture</th><th className="px-3 md:px-5 py-3 text-right font-semibold">Montant</th><th className="px-3 md:px-5 py-3 text-right font-semibold">Actions</th></tr></thead>
        <tbody>{loading ? <tr><td colSpan={7} className="px-5 py-6 text-center text-gray-400">Chargement...</td></tr> : filtered.length === 0 ? <tr><td colSpan={7} className="px-5 py-6 text-center text-gray-400">{searchQuery ? "Aucun résultat." : "Aucun règlement."}</td></tr> : filtered.map(d => (
          <tr key={d.id} className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors"><td className="px-3 md:px-5 py-3.5 font-mono text-[11px] text-[#f2762b] font-bold">{d.numero}</td><td className="px-3 md:px-5 py-3.5 text-gray-500">{d.date_reglement?.slice(0, 10)}</td><td className="px-3 md:px-5 py-3.5 font-semibold text-gray-800">{d.client?.nom || "—"}</td><td className="px-3 md:px-5 py-3.5"><span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border bg-blue-50 text-blue-600 border-blue-200 capitalize">{d.mode_paiement || "—"}</span></td><td className="px-3 md:px-5 py-3.5 text-gray-500">{d.facture?.numero || d.facture_id}</td><td className="px-3 md:px-5 py-3.5 text-right font-bold text-gray-900">{Number(d.montant).toLocaleString("fr-FR")} MAD</td>
            <td className="px-3 md:px-5 py-3.5 text-right"><div className="inline-flex items-center gap-1.5"><button onClick={() => handleEdit(d)} className="w-7 h-7 flex items-center justify-center rounded-sm border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors cursor-pointer" title="Modifier"><Pencil className="w-3 h-3" /></button><button onClick={() => setItemToDelete(d)} className="w-7 h-7 flex items-center justify-center rounded-sm border border-red-200 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors cursor-pointer" title="Supprimer"><Trash2 className="w-3 h-3" /></button></div></td></tr>
        ))}</tbody></table></div></div>
      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}><AlertDialogContent className="sm:max-w-[400px] p-5 gap-3"><AlertDialogHeader><AlertDialogTitle className="text-base text-gray-900 border-b border-gray-100 pb-2">Supprimer le règlement ?</AlertDialogTitle><AlertDialogDescription className="text-xs pt-1">Cette action est irréversible. Le règlement <span className="font-black text-red-600">{itemToDelete?.numero}</span> sera définitivement effacé.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter className="sm:gap-2"><AlertDialogCancel className="h-8 text-[11px] px-4 font-semibold">Annuler</AlertDialogCancel><AlertDialogAction onClick={() => itemToDelete && handleDelete(itemToDelete)} className="bg-red-600 hover:bg-red-700 text-white h-8 text-[11px] px-4 font-bold">Supprimer</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}
