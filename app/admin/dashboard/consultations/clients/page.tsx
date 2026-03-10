"use client";

import {
  Search, Users, Receipt, Banknote, FileBarChart,
  ChevronRight, AlertCircle, CheckCircle2, Clock,
  TrendingUp, TrendingDown, Minus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Client = { id: string; nom: string; email?: string | null; telephone?: string | null; adresse?: string | null; ville?: string | null };
type FactureClient = { id: string; numero: string; date_facture: string; client_id: string; montant_total: string; statut: string; client?: Client };
type ReglementClient = { id: string; numero: string; date_reglement: string; montant: string; mode_paiement: string; facture_id: string; client_id: string; client?: Client; facture?: { id: string; numero: string } };

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
const inputBase = "w-full rounded-sm bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b] focus:border-[#f2762b] transition-colors";

const statusConfig: Record<string, { color: string; bg: string; border: string; icon: typeof CheckCircle2 }> = {
  brouillon: { color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200", icon: Clock },
  "envoyée": { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", icon: Clock },
  "payée": { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle2 },
  "annulée": { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: AlertCircle },
  "partiellement payée": { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", icon: Clock },
};

type TabKey = "factures" | "situation" | "reglements";

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function ConsultationsClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [factures, setFactures] = useState<FactureClient[]>([]);
  const [reglements, setReglements] = useState<ReglementClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabKey>("factures");

  /* ---- Load data ---- */
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [r1, r2, r3] = await Promise.all([
        fetch(`${API}/clients`),
        fetch(`${API}/factures-clients`),
        fetch(`${API}/reglements-clients`),
      ]);
      if (!r1.ok || !r2.ok || !r3.ok) throw new Error("Erreur chargement des données");
      setClients(await r1.json());
      setFactures(await r2.json());
      setReglements(await r3.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  /* ---- Filtered data by selected client ---- */
  const clientFactures = useMemo(() => {
    if (!selectedClientId) return factures;
    return factures.filter((f) => f.client_id === selectedClientId);
  }, [factures, selectedClientId]);

  const clientReglements = useMemo(() => {
    if (!selectedClientId) return reglements;
    return reglements.filter((r) => r.client_id === selectedClientId);
  }, [reglements, selectedClientId]);

  /* ---- Search within the active tab ---- */
  const filteredFactures = useMemo(() => {
    if (!searchQuery.trim()) return clientFactures;
    const q = searchQuery.toLowerCase();
    return clientFactures.filter((f) =>
      f.numero.toLowerCase().includes(q) ||
      f.client?.nom?.toLowerCase().includes(q) ||
      f.statut?.toLowerCase().includes(q)
    );
  }, [clientFactures, searchQuery]);

  const filteredReglements = useMemo(() => {
    if (!searchQuery.trim()) return clientReglements;
    const q = searchQuery.toLowerCase();
    return clientReglements.filter((r) =>
      r.numero?.toLowerCase().includes(q) ||
      r.client?.nom?.toLowerCase().includes(q) ||
      r.mode_paiement?.toLowerCase().includes(q)
    );
  }, [clientReglements, searchQuery]);

  /* ---- Situation calculations ---- */
  const totalFacture = useMemo(() => clientFactures.reduce((s, f) => s + Number(f.montant_total || 0), 0), [clientFactures]);
  const totalRegle = useMemo(() => clientReglements.reduce((s, r) => s + Number(r.montant || 0), 0), [clientReglements]);
  const solde = totalFacture - totalRegle;

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  /* ---- Tabs config ---- */
  const tabs: { key: TabKey; label: string; icon: typeof Receipt; count: number }[] = [
    { key: "factures", label: "Liste des factures", icon: Receipt, count: clientFactures.length },
    { key: "situation", label: "Situation client", icon: FileBarChart, count: 0 },
    { key: "reglements", label: "État des règlements", icon: Banknote, count: clientReglements.length },
  ];

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-300">
      {/* ---- Client selector + search ---- */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Client dropdown */}
        <div className="flex-1 max-w-xs">
          <label className="text-xs font-bold text-gray-400 mb-1 block">Client</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <select
              value={selectedClientId}
              onChange={(e) => { setSelectedClientId(e.target.value); setSearchQuery(""); }}
              className={`${inputBase} pl-9 h-10`}
            >
              <option value="">— Tous les clients —</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <label className="text-xs font-bold text-gray-400 mb-1 block">Recherche</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === "factures" ? "Rechercher une facture..." : "Rechercher un règlement..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${inputBase} pl-10 h-10`}
            />
          </div>
        </div>
      </div>

      {/* ---- Selected client info bar ---- */}
      {selectedClient && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-sm px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs">
          <span className="font-bold text-emerald-700">{selectedClient.nom}</span>
          {selectedClient.email && <span className="text-emerald-600">{selectedClient.email}</span>}
          {selectedClient.telephone && <span className="text-emerald-600">{selectedClient.telephone}</span>}
          {selectedClient.ville && <span className="text-emerald-500">{selectedClient.ville}</span>}
        </div>
      )}

      {error && <div className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>}

      {/* ---- Tabs ---- */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-sm p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearchQuery(""); }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-sm text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(" ").pop()}</span>
              {tab.count > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? "bg-[#f2762b] text-white" : "bg-gray-200 text-gray-500"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ================================================================ */}
      {/*  TAB: FACTURES                                                    */}
      {/* ================================================================ */}
      {activeTab === "factures" && (
        <div className="bg-white border-2 border-gray-200 rounded-sm overflow-hidden text-[#414141] animate-in fade-in duration-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-3 md:px-5 py-3 text-left font-semibold">Numéro</th>
                  <th className="px-3 md:px-5 py-3 text-left font-semibold">Date</th>
                  {!selectedClientId && <th className="px-3 md:px-5 py-3 text-left font-semibold">Client</th>}
                  <th className="px-3 md:px-5 py-3 text-left font-semibold">Statut</th>
                  <th className="px-3 md:px-5 py-3 text-right font-semibold">Montant</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">Chargement...</td></tr>
                ) : filteredFactures.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">{searchQuery ? "Aucun résultat." : "Aucune facture."}</td></tr>
                ) : (
                  filteredFactures.map((f) => {
                    const st = statusConfig[f.statut] || statusConfig.brouillon;
                    return (
                      <tr key={f.id} className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors">
                        <td className="px-3 md:px-5 py-3.5 font-mono text-[11px] text-[#f2762b] font-bold">{f.numero}</td>
                        <td className="px-3 md:px-5 py-3.5 text-gray-500">{f.date_facture?.slice(0, 10)}</td>
                        {!selectedClientId && <td className="px-3 md:px-5 py-3.5 font-semibold text-gray-800">{f.client?.nom || "—"}</td>}
                        <td className="px-3 md:px-5 py-3.5">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${st.bg} ${st.color} ${st.border}`}>
                            {f.statut || "—"}
                          </span>
                        </td>
                        <td className="px-3 md:px-5 py-3.5 text-right font-bold text-gray-900">{Number(f.montant_total).toLocaleString("fr-FR")} MAD</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {/* Total row */}
          {filteredFactures.length > 0 && (
            <div className="border-t-2 border-gray-200 px-3 md:px-5 py-3 flex items-center justify-between bg-gray-50">
              <span className="text-xs font-semibold text-gray-500">{filteredFactures.length} facture(s)</span>
              <span className="text-sm font-bold text-gray-800">
                Total: {filteredFactures.reduce((s, f) => s + Number(f.montant_total || 0), 0).toLocaleString("fr-FR")} MAD
              </span>
            </div>
          )}
        </div>
      )}

      {/* ================================================================ */}
      {/*  TAB: SITUATION                                                   */}
      {/* ================================================================ */}
      {activeTab === "situation" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Total facturé */}
            <div className="bg-white border-2 border-gray-200 rounded-sm p-4 md:p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Receipt className="w-4.5 h-4.5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400">Total facturé</p>
                  <p className="text-xl font-bold text-gray-900">{totalFacture.toLocaleString("fr-FR")} <span className="text-xs font-medium text-gray-400">MAD</span></p>
                </div>
              </div>
              <p className="text-[11px] text-gray-400">{clientFactures.length} facture(s)</p>
            </div>

            {/* Total réglé */}
            <div className="bg-white border-2 border-gray-200 rounded-sm p-4 md:p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Banknote className="w-4.5 h-4.5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400">Total réglé</p>
                  <p className="text-xl font-bold text-emerald-600">{totalRegle.toLocaleString("fr-FR")} <span className="text-xs font-medium text-gray-400">MAD</span></p>
                </div>
              </div>
              <p className="text-[11px] text-gray-400">{clientReglements.length} règlement(s)</p>
            </div>

            {/* Solde */}
            <div className={`border-2 rounded-sm p-4 md:p-5 ${
              solde > 0 ? "bg-red-50/50 border-red-200" : solde < 0 ? "bg-emerald-50/50 border-emerald-200" : "bg-white border-gray-200"
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  solde > 0 ? "bg-red-100" : solde < 0 ? "bg-emerald-100" : "bg-gray-100"
                }`}>
                  {solde > 0 ? <TrendingUp className="w-4.5 h-4.5 text-red-500" /> : solde < 0 ? <TrendingDown className="w-4.5 h-4.5 text-emerald-500" /> : <Minus className="w-4.5 h-4.5 text-gray-500" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400">Solde restant</p>
                  <p className={`text-xl font-bold ${solde > 0 ? "text-red-600" : solde < 0 ? "text-emerald-600" : "text-gray-900"}`}>
                    {solde.toLocaleString("fr-FR")} <span className="text-xs font-medium text-gray-400">MAD</span>
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-gray-400">
                {solde > 0 ? "Montant dû par le client" : solde < 0 ? "Trop-perçu" : "Aucun solde"}
              </p>
            </div>
          </div>

          {/* Situation detail per invoice */}
          <div className="bg-white border-2 border-gray-200 rounded-sm overflow-hidden">
            <div className="px-3 md:px-5 py-3 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <FileBarChart className="w-3.5 h-3.5 text-[#f2762b]" />
                Détail par facture
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50/50 text-gray-500">
                  <tr>
                    <th className="px-3 md:px-5 py-2.5 text-left font-semibold">Facture</th>
                    <th className="px-3 md:px-5 py-2.5 text-left font-semibold">Date</th>
                    <th className="px-3 md:px-5 py-2.5 text-left font-semibold">Statut</th>
                    <th className="px-3 md:px-5 py-2.5 text-right font-semibold">Montant</th>
                    <th className="px-3 md:px-5 py-2.5 text-right font-semibold">Réglé</th>
                    <th className="px-3 md:px-5 py-2.5 text-right font-semibold">Restant</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">Chargement...</td></tr>
                  ) : clientFactures.length === 0 ? (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">Aucune facture.</td></tr>
                  ) : (
                    clientFactures.map((f) => {
                      const montant = Number(f.montant_total || 0);
                      const regle = clientReglements
                        .filter((r) => r.facture_id === f.id)
                        .reduce((s, r) => s + Number(r.montant || 0), 0);
                      const restant = montant - regle;
                      const st = statusConfig[f.statut] || statusConfig.brouillon;
                      return (
                        <tr key={f.id} className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors">
                          <td className="px-3 md:px-5 py-3 font-mono text-[11px] text-[#f2762b] font-bold">{f.numero}</td>
                          <td className="px-3 md:px-5 py-3 text-gray-500">{f.date_facture?.slice(0, 10)}</td>
                          <td className="px-3 md:px-5 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${st.bg} ${st.color} ${st.border}`}>
                              {f.statut || "—"}
                            </span>
                          </td>
                          <td className="px-3 md:px-5 py-3 text-right font-semibold text-gray-800">{montant.toLocaleString("fr-FR")}</td>
                          <td className="px-3 md:px-5 py-3 text-right font-semibold text-emerald-600">{regle.toLocaleString("fr-FR")}</td>
                          <td className={`px-3 md:px-5 py-3 text-right font-bold ${restant > 0 ? "text-red-600" : "text-emerald-600"}`}>
                            {restant.toLocaleString("fr-FR")}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/*  TAB: REGLEMENTS                                                  */}
      {/* ================================================================ */}
      {activeTab === "reglements" && (
        <div className="bg-white border-2 border-gray-200 rounded-sm overflow-hidden text-[#414141] animate-in fade-in duration-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-3 md:px-5 py-3 text-left font-semibold">Numéro</th>
                  <th className="px-3 md:px-5 py-3 text-left font-semibold">Date</th>
                  {!selectedClientId && <th className="px-3 md:px-5 py-3 text-left font-semibold">Client</th>}
                  <th className="px-3 md:px-5 py-3 text-left font-semibold">Mode</th>
                  <th className="px-3 md:px-5 py-3 text-left font-semibold">Facture</th>
                  <th className="px-3 md:px-5 py-3 text-right font-semibold">Montant</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">Chargement...</td></tr>
                ) : filteredReglements.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">{searchQuery ? "Aucun résultat." : "Aucun règlement."}</td></tr>
                ) : (
                  filteredReglements.map((r) => (
                    <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors">
                      <td className="px-3 md:px-5 py-3.5 font-mono text-[11px] text-[#f2762b] font-bold">{r.numero}</td>
                      <td className="px-3 md:px-5 py-3.5 text-gray-500">{r.date_reglement?.slice(0, 10)}</td>
                      {!selectedClientId && <td className="px-3 md:px-5 py-3.5 font-semibold text-gray-800">{r.client?.nom || "—"}</td>}
                      <td className="px-3 md:px-5 py-3.5">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border bg-blue-50 text-blue-600 border-blue-200 capitalize">
                          {r.mode_paiement || "—"}
                        </span>
                      </td>
                      <td className="px-3 md:px-5 py-3.5 text-gray-500">{r.facture?.numero || r.facture_id}</td>
                      <td className="px-3 md:px-5 py-3.5 text-right font-bold text-gray-900">{Number(r.montant).toLocaleString("fr-FR")} MAD</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Total row */}
          {filteredReglements.length > 0 && (
            <div className="border-t-2 border-gray-200 px-3 md:px-5 py-3 flex items-center justify-between bg-gray-50">
              <span className="text-xs font-semibold text-gray-500">{filteredReglements.length} règlement(s)</span>
              <span className="text-sm font-bold text-emerald-600">
                Total: {filteredReglements.reduce((s, r) => s + Number(r.montant || 0), 0).toLocaleString("fr-FR")} MAD
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
