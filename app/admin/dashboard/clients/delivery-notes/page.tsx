"use client";

import jsPDF from "jspdf";
import { Pencil, Plus, Search, Truck, Trash2, X, ArrowLeft, Printer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type Client = { id: string; nom: string };
type Produit = { id: string; reference: string; designation: string; prix_unitaire: string };
type CommandeClient = { id: string; numero: string; client_id: string };
type LigneDoc = { id?: string; produit_id: string; quantite: number; prix_unitaire: string; total: string };
type BLClient = { id: string; numero: string; date_bl: string; client_id: string; commande_id?: string | null; statut: string; client?: Client; commande?: CommandeClient; lignes?: LigneDoc[] };

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
const inputBase = "w-full rounded-sm bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b] focus:border-[#f2762b] transition-colors";
const statusConfig: Record<string, { color: string; bg: string; border: string }> = { brouillon: { color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" }, "envoyé": { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" }, "livré": { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" }, "annulé": { color: "text-red-600", bg: "bg-red-50", border: "border-red-200" } };
type LigneForm = { produit_id: string; quantite: string; prix_unitaire: number; total: number };

export default function ClientDeliveryNotesPage() {
  const [items, setItems] = useState<BLClient[]>([]); const [clients, setClients] = useState<Client[]>([]); const [produits, setProduits] = useState<Produit[]>([]); const [commandes, setCommandes] = useState<CommandeClient[]>([]);
  const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null); const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); const [showForm, setShowForm] = useState(false); const [editingId, setEditingId] = useState<string | null>(null); const [itemToDelete, setItemToDelete] = useState<BLClient | null>(null);
  const [form, setForm] = useState({ numero: "", date_bl: "", client_id: "", commande_id: "", statut: "" }); const [lignes, setLignes] = useState<LigneForm[]>([]);

  const resetForm = () => { setEditingId(null); setForm({ numero: "", date_bl: "", client_id: "", commande_id: "", statut: "" }); setLignes([]); };
  const handleNewItem = () => { resetForm(); setShowForm(true); };
  const handleCancel = () => { resetForm(); setShowForm(false); };

  const loadData = async () => {
    setLoading(true); setError(null);
    try { const [r1, r2, r3, r4] = await Promise.all([fetch(`${API}/bl-clients`), fetch(`${API}/clients`), fetch(`${API}/produits`), fetch(`${API}/commandes-clients`)]); if (!r1.ok || !r2.ok || !r3.ok || !r4.ok) throw new Error("Erreur chargement"); setItems(await r1.json()); setClients(await r2.json()); setProduits(await r3.json()); setCommandes(await r4.json()); } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => { if (!searchQuery.trim()) return items; const q = searchQuery.toLowerCase(); return items.filter(d => d.numero.toLowerCase().includes(q) || d.client?.nom?.toLowerCase().includes(q) || d.statut?.toLowerCase().includes(q)); }, [items, searchQuery]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEdit = (d: BLClient) => { setEditingId(d.id); setForm({ numero: d.numero, date_bl: d.date_bl?.slice(0, 10) ?? "", client_id: d.client_id, commande_id: d.commande_id ?? "", statut: d.statut || "" }); setLignes((d.lignes || []).map(l => ({ produit_id: l.produit_id, quantite: String(l.quantite), prix_unitaire: Number(l.prix_unitaire), total: Number(l.total) }))); setShowForm(true); };
  const updateLigne = (index: number, field: keyof LigneForm, value: string) => { setLignes(prev => { const copy = [...prev]; const c = { ...copy[index] }; if (field === "produit_id") { c.produit_id = value; const p = produits.find(x => x.id === value); c.prix_unitaire = p ? Number(p.prix_unitaire) || 0 : 0; c.total = c.prix_unitaire * (Number(c.quantite) || 0); } else if (field === "quantite") { c.quantite = value; c.total = c.prix_unitaire * (Number(value) || 0); } copy[index] = c; return copy; }); };
  const handleAddLigne = () => setLignes(p => [...p, { produit_id: "", quantite: "1", prix_unitaire: 0, total: 0 }]);
  const handleRemoveLigne = (i: number) => setLignes(p => p.filter((_, j) => j !== i));

  const handleDelete = async (d: BLClient) => { setError(null); try { const res = await fetch(`${API}/bl-clients/${d.id}`, { method: "DELETE" }); if (!res.ok) throw new Error("Erreur suppression"); await loadData(); if (editingId === d.id) resetForm(); } catch (e: any) { setError(e.message); } setItemToDelete(null); };

  const handlePrint = (d: BLClient) => {
    const doc = new jsPDF(); let y = 20; doc.setFontSize(14); doc.text("Bon de livraison client", 20, y); y += 10; doc.setFontSize(10); doc.text(`Numéro: ${d.numero}`, 20, y); y += 6; doc.text(`Date: ${d.date_bl?.slice(0, 10) || "-"}`, 20, y); y += 6; doc.text(`Client: ${d.client?.nom || "-"}`, 20, y); y += 6; doc.text(`Statut: ${d.statut || "-"}`, 20, y); y += 10;
    doc.text("Produit", 20, y); doc.text("PU", 100, y); doc.text("Qté", 130, y); doc.text("Total", 150, y); y += 6; doc.line(20, y, 190, y); y += 6; let total = 0;
    (d.lignes || []).forEach(l => { const p = produits.find(x => x.id === l.produit_id); doc.text(p ? `${p.reference} - ${p.designation}`.substring(0, 35) : l.produit_id, 20, y); doc.text(`${Number(l.prix_unitaire).toFixed(2)}`, 100, y, { align: "right" }); doc.text(`${l.quantite}`, 130, y, { align: "right" }); const t = Number(l.total) || 0; total += t; doc.text(`${t.toFixed(2)}`, 170, y, { align: "right" }); y += 6; });
    y += 4; doc.line(20, y, 190, y); y += 8; doc.text(`Montant total: ${total.toFixed(2)} MAD`, 20, y); doc.save(`bl-${d.numero}.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError(null);
    try { const lp = lignes.filter(l => l.produit_id && Number(l.quantite) > 0).map(l => ({ produit_id: l.produit_id, quantite: Number(l.quantite), prix_unitaire: l.prix_unitaire, total: l.total })); const payload = { numero: form.numero, date_bl: form.date_bl, client_id: form.client_id, commande_id: form.commande_id || undefined, statut: form.statut || "brouillon", lignes: lp.length ? lp : undefined }; const url = editingId ? `${API}/bl-clients/${editingId}` : `${API}/bl-clients`; const res = await fetch(url, { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); if (!res.ok) throw new Error("Erreur enregistrement"); await loadData(); resetForm(); setShowForm(false); } catch (e: any) { setError(e.message); } finally { setSaving(false); }
  };

  if (showForm) {
    return (
      <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button type="button" onClick={handleCancel} className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer group"><ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Retour à la liste</button>
        {error && <div className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-200 rounded-sm p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between gap-3"><h2 className="text-sm font-semibold text-gray-800">{editingId ? "Modifier le BL" : "Nouveau BL"}</h2>{editingId && <button type="button" onClick={handleCancel} className="text-xs text-gray-400 hover:text-gray-600 inline-flex items-center gap-1 cursor-pointer"><X className="w-3 h-3" /> Annuler</button>}</div>
          <div className="space-y-4 border-b border-gray-100 pb-5">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-[#f2762b]" /> Informations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="space-y-1.5"><label className="text-xs text-gray-500">Numéro *</label><input name="numero" value={form.numero} onChange={handleInputChange} required placeholder="BL-001" className={inputBase} /></div>
              <div className="space-y-1.5"><label className="text-xs text-gray-500">Date *</label><input name="date_bl" type="date" value={form.date_bl} onChange={handleInputChange} required className={inputBase} /></div>
              <div className="space-y-1.5"><label className="text-xs text-gray-500">Client *</label><select name="client_id" value={form.client_id} onChange={handleInputChange} required className={inputBase}><option value="">Sélectionner</option>{clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}</select></div>
              <div className="space-y-1.5"><label className="text-xs text-gray-500">Commande (optionnel)</label><select name="commande_id" value={form.commande_id} onChange={handleInputChange} className={inputBase}><option value="">Aucune</option>{commandes.filter(c => !form.client_id || c.client_id === form.client_id).map(c => <option key={c.id} value={c.id}>{c.numero}</option>)}</select></div>
              <div className="space-y-1.5"><label className="text-xs text-gray-500">Statut</label><select name="statut" value={form.statut} onChange={handleInputChange} className={inputBase}><option value="">Sélectionner</option><option value="brouillon">Brouillon</option><option value="envoyé">Envoyé</option><option value="livré">Livré</option><option value="annulé">Annulé</option></select></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between"><h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Lignes</h3><button type="button" onClick={handleAddLigne} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm bg-gray-100 hover:bg-gray-200 text-[11px] text-gray-700 font-medium transition-colors cursor-pointer"><Plus className="w-3 h-3" /> Ajouter</button></div>
            {lignes.length === 0 ? <p className="text-[11px] text-gray-400 italic">Aucune ligne.</p> : (<div className="border border-gray-100 rounded-sm overflow-hidden"><table className="min-w-full text-xs"><thead className="bg-gray-50 text-gray-500"><tr><th className="px-3 py-2 text-left font-medium">Produit</th><th className="px-3 py-2 text-right font-medium">PU</th><th className="px-3 py-2 text-right font-medium">Qté</th><th className="px-3 py-2 text-right font-medium">Total</th><th className="px-3 py-2 w-10"></th></tr></thead><tbody>{lignes.map((ligne, i) => (<tr key={i} className="border-t border-gray-100 hover:bg-gray-50/30"><td className="px-3 py-2"><select value={ligne.produit_id} onChange={e => updateLigne(i, "produit_id", e.target.value)} className={inputBase}><option value="">Sélectionner</option>{produits.map(p => <option key={p.id} value={p.id}>{p.reference} — {p.designation}</option>)}</select></td><td className="px-3 py-2 text-right text-gray-600 font-medium">{ligne.prix_unitaire.toFixed(2)}</td><td className="px-3 py-2 text-right"><input type="number" min={1} value={ligne.quantite} onChange={e => updateLigne(i, "quantite", e.target.value)} className={`${inputBase} w-20 text-right`} /></td><td className="px-3 py-2 text-right font-bold text-[#f2762b]">{ligne.total.toFixed(2)} MAD</td><td className="px-3 py-2"><button type="button" onClick={() => handleRemoveLigne(i)} className="w-7 h-7 flex items-center justify-center rounded-sm border border-red-200 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"><Trash2 className="w-3 h-3" /></button></td></tr>))}</tbody></table></div>)}
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100"><button type="button" onClick={handleCancel} className="px-4 py-2 rounded-sm border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Annuler</button><button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2 rounded-sm bg-[#f2762b] hover:bg-[#d96521] text-xs font-semibold text-white disabled:opacity-60 transition-colors cursor-pointer"><Pencil className="w-3.5 h-3.5" /> {saving ? "Enregistrement..." : editingId ? "Mettre à jour" : "Créer"}</button></div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col-reverse md:flex-row items-stretch md:items-center justify-between gap-4"><div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Rechercher un BL..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={`${inputBase} pl-10 h-10`} /></div><button type="button" onClick={handleNewItem} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-sm bg-[#f2762b] hover:bg-[#d96521] text-xs font-semibold text-white transition-colors cursor-pointer"><Plus className="w-3.5 h-3.5" /> Nouveau BL</button></div>
      {error && <div className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>}
      <div className="bg-white border-2 border-gray-200 rounded-sm overflow-hidden text-[#414141]"><div className="overflow-x-auto"><table className="min-w-full text-xs"><thead className="bg-gray-50 text-gray-500"><tr><th className="px-3 md:px-5 py-3 text-left font-semibold">Numéro</th><th className="px-3 md:px-5 py-3 text-left font-semibold">Date</th><th className="px-3 md:px-5 py-3 text-left font-semibold">Client</th><th className="px-3 md:px-5 py-3 text-left font-semibold">Statut</th><th className="px-3 md:px-5 py-3 text-right font-semibold">Actions</th></tr></thead>
        <tbody>{loading ? <tr><td colSpan={5} className="px-5 py-6 text-center text-gray-400">Chargement...</td></tr> : filtered.length === 0 ? <tr><td colSpan={5} className="px-5 py-6 text-center text-gray-400">{searchQuery ? "Aucun résultat." : "Aucun BL."}</td></tr> : filtered.map(d => { const st = statusConfig[d.statut] || statusConfig.brouillon; return (
          <tr key={d.id} className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors"><td className="px-3 md:px-5 py-3.5 font-mono text-[11px] text-[#f2762b] font-bold">{d.numero}</td><td className="px-3 md:px-5 py-3.5 text-gray-500">{d.date_bl?.slice(0, 10)}</td><td className="px-3 md:px-5 py-3.5 font-semibold text-gray-800">{d.client?.nom || "—"}</td><td className="px-3 md:px-5 py-3.5"><span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${st.bg} ${st.color} ${st.border}`}>{d.statut || "—"}</span></td>
            <td className="px-3 md:px-5 py-3.5 text-right"><div className="inline-flex items-center gap-1.5"><button onClick={() => handleEdit(d)} className="w-7 h-7 flex items-center justify-center rounded-sm border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors cursor-pointer" title="Modifier"><Pencil className="w-3 h-3" /></button><button onClick={() => handlePrint(d)} className="w-7 h-7 flex items-center justify-center rounded-sm border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors cursor-pointer" title="Imprimer"><Printer className="w-3 h-3" /></button><button onClick={() => setItemToDelete(d)} className="w-7 h-7 flex items-center justify-center rounded-sm border border-red-200 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors cursor-pointer" title="Supprimer"><Trash2 className="w-3 h-3" /></button></div></td></tr>); })}</tbody></table></div></div>
      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}><AlertDialogContent className="sm:max-w-[400px] p-5 gap-3"><AlertDialogHeader><AlertDialogTitle className="text-base text-gray-900 border-b border-gray-100 pb-2">Supprimer le BL ?</AlertDialogTitle><AlertDialogDescription className="text-xs pt-1">Cette action est irréversible. Le BL <span className="font-black text-red-600">{itemToDelete?.numero}</span> sera définitivement effacé.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter className="sm:gap-2"><AlertDialogCancel className="h-8 text-[11px] px-4 font-semibold">Annuler</AlertDialogCancel><AlertDialogAction onClick={() => itemToDelete && handleDelete(itemToDelete)} className="bg-red-600 hover:bg-red-700 text-white h-8 text-[11px] px-4 font-bold">Supprimer</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}
