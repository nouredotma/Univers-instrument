"use client";

import {
  Search,
  Eye,
  Pencil,
  Trash2,
  X,
  Plus,
  Mail,
  Phone,
  MapPin,
  Users,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
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

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Client = {
  id: string;
  nom: string;
  email?: string | null;
  telephone?: string | null;
  adresse?: string | null;
  ville?: string | null;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

const inputBase =
  "w-full rounded-sm bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b] focus:border-[#f2762b] transition-colors";

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
  });

  /* ---- Data loading ---- */
  const loadClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/clients`);
      if (!res.ok) throw new Error("Impossible de charger les clients");
      const data: Client[] = await res.json();
      setClients(data);
    } catch (e: any) {
      setError(e.message || "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  /* ---- Filtering ---- */
  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const query = searchQuery.toLowerCase();
    return clients.filter((c) => {
      return (
        c.nom.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query) ||
        (c.email && c.email.toLowerCase().includes(query)) ||
        (c.ville && c.ville.toLowerCase().includes(query)) ||
        (c.telephone && c.telephone.toLowerCase().includes(query))
      );
    });
  }, [clients, searchQuery]);

  /* ---- Form helpers ---- */
  const resetForm = () => {
    setEditingId(null);
    setForm({ nom: "", email: "", telephone: "", adresse: "", ville: "" });
  };

  const handleNewClient = () => {
    resetForm();
    setShowForm(true);
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (client: Client) => {
    setEditingId(client.id);
    setForm({
      nom: client.nom,
      email: client.email || "",
      telephone: client.telephone || "",
      adresse: client.adresse || "",
      ville: client.ville || "",
    });
    setSelectedClient(null);
    setShowForm(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ---- Delete ---- */
  const handleDeleteClient = async (client: Client) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/clients/${client.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Impossible de supprimer le client");
      }
      await loadClients();
      if (editingId === client.id) resetForm();
      if (selectedClient?.id === client.id) setSelectedClient(null);
    } catch (e: any) {
      setError(e.message || "Erreur inattendue");
    }
    setClientToDelete(null);
  };

  /* ---- Submit ---- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        nom: form.nom,
        email: form.email || undefined,
        telephone: form.telephone || undefined,
        adresse: form.adresse || undefined,
        ville: form.ville || undefined,
      };

      const url = editingId
        ? `${API_BASE_URL}/clients/${editingId}`
        : `${API_BASE_URL}/clients`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.message || "Impossible d'enregistrer le client"
        );
      }

      await loadClients();
      resetForm();
      setShowForm(false);
    } catch (e: any) {
      setError(e.message || "Erreur inattendue");
    } finally {
      setSaving(false);
    }
  };

  /* ================================================================ */
  /*  DETAIL VIEW                                                      */
  /* ================================================================ */
  if (selectedClient) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Detail Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedClient(null)}
            className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour à la liste
          </button>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-[#10b981]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#10b981]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 leading-tight">{selectedClient.nom}</h2>
                <p className="text-[11px] text-gray-400">ID: {selectedClient.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleEdit(selectedClient)}
                className="w-8 h-8 flex items-center justify-center rounded-sm border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-colors cursor-pointer"
                title="Modifier"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setClientToDelete(selectedClient)}
                className="w-8 h-8 flex items-center justify-center rounded-sm border border-red-200 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors cursor-pointer"
                title="Supprimer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-5 md:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Client Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  Informations Client
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold">Nom / Raison sociale</p>
                      <p className="text-sm font-bold text-gray-800">{selectedClient.nom}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center shrink-0">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold">Email</p>
                      <p className="text-sm font-bold text-gray-800">{selectedClient.email || <span className="text-gray-400 font-normal italic">Non renseigné</span>}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center shrink-0">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold">Téléphone</p>
                      <p className="text-sm font-bold text-gray-800">{selectedClient.telephone || <span className="text-gray-400 font-normal italic">Non renseigné</span>}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  Localisation
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold">Ville</p>
                      <p className="text-sm font-bold text-gray-800">{selectedClient.ville || <span className="text-gray-400 font-normal italic">Non renseignée</span>}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold">Adresse</p>
                      <p className="text-sm font-bold text-gray-800">{selectedClient.adresse || <span className="text-gray-400 font-normal italic">Non renseignée</span>}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <AlertDialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
          <AlertDialogContent className="sm:max-w-[400px] p-5 gap-3">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base text-gray-900 border-b border-gray-100 pb-2">Supprimer le client ?</AlertDialogTitle>
              <AlertDialogDescription className="text-xs pt-1">
                Cette action est irréversible. Le client <span className="font-black text-red-600">{clientToDelete?.nom}</span> sera définitivement effacé du système.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:gap-2">
              <AlertDialogCancel className="h-8 text-[11px] px-4 font-semibold">Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => clientToDelete && handleDeleteClient(clientToDelete)}
                className="bg-red-600 hover:bg-red-700 text-white h-8 text-[11px] px-4 font-bold"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  /* ================================================================ */
  /*  FORM VIEW                                                        */
  /* ================================================================ */
  if (showForm) {
    return (
      <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Back button */}
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer rounded-sm group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Retour à la liste
        </button>

        {error && (
          <div className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border-2 border-gray-200 rounded-sm p-4 md:p-6 space-y-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-gray-800">
              {editingId ? "Modifier le client" : "Nouveau client"}
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

          {/* Fields */}
          <div className="space-y-4 border-b border-gray-100 pb-5">
            <h3 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#10b981]" />
              Informations du client
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500" htmlFor="nom">
                  Nom / Raison sociale *
                </label>
                <input
                  id="nom"
                  name="nom"
                  value={form.nom}
                  onChange={handleInputChange}
                  required
                  placeholder="Nom complet ou raison sociale"
                  className={inputBase}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-500" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  className={inputBase}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-500" htmlFor="telephone">
                  Téléphone
                </label>
                <input
                  id="telephone"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleInputChange}
                  placeholder="+212 6XX-XXXXXX"
                  className={inputBase}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-500" htmlFor="ville">
                  Ville
                </label>
                <input
                  id="ville"
                  name="ville"
                  value={form.ville}
                  onChange={handleInputChange}
                  placeholder="Casablanca, Rabat..."
                  className={inputBase}
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs text-gray-500" htmlFor="adresse">
                  Adresse
                </label>
                <textarea
                  id="adresse"
                  name="adresse"
                  value={form.adresse}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Adresse complète"
                  className={inputBase + " resize-y min-h-[52px]"}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
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
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-300">
      {/* Search Header + CTA */}
      <div className="flex flex-col-reverse md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un client (Nom, email, ville...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${inputBase} pl-10 h-10`}
          />
        </div>
        <button
          type="button"
          onClick={handleNewClient}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-sm bg-[#f2762b] hover:bg-[#d96521] text-xs font-semibold text-white transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Nouveau client
        </button>
      </div>

      {error && (
        <div className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Clients Table */}
      <div className="bg-white border-2 border-gray-200 rounded-sm overflow-hidden text-[#414141]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-3 md:px-5 py-3 text-left font-semibold">Nom</th>
                <th className="px-3 md:px-5 py-3 text-left font-semibold">Email</th>
                <th className="px-3 md:px-5 py-3 text-left font-semibold">Téléphone</th>
                <th className="px-3 md:px-5 py-3 text-left font-semibold">Ville</th>
                <th className="px-3 md:px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-3 md:px-5 py-6 text-center text-gray-400">
                    Chargement...
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 md:px-5 py-6 text-center text-gray-400">
                    {searchQuery ? "Aucun client ne correspond à votre recherche." : "Aucun client pour le moment."}
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors">
                    <td className="px-3 md:px-5 py-3.5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">{client.nom}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{client.id}</span>
                      </div>
                    </td>
                    <td className="px-3 md:px-5 py-3.5 text-gray-500">
                      {client.email || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-3 md:px-5 py-3.5 text-gray-500">
                      {client.telephone || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-3 md:px-5 py-3.5">
                      {client.ville ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-50 text-emerald-600 border-emerald-200">
                          {client.ville}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-3 md:px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="w-7 h-7 flex items-center justify-center rounded-sm border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors cursor-pointer"
                          title="Voir les détails"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEdit(client)}
                          className="w-7 h-7 flex items-center justify-center rounded-sm border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors cursor-pointer"
                          title="Modifier"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setClientToDelete(client)}
                          className="w-7 h-7 flex items-center justify-center rounded-sm border border-red-200 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
      <AlertDialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
        <AlertDialogContent className="sm:max-w-[400px] p-5 gap-3">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base text-gray-900 border-b border-gray-100 pb-2">Supprimer le client ?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs pt-1">
              Cette action est irréversible. Le client <span className="font-black text-red-600">{clientToDelete?.nom}</span> sera définitivement effacé du système.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:gap-2">
            <AlertDialogCancel className="h-8 text-[11px] px-4 font-semibold">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => clientToDelete && handleDeleteClient(clientToDelete)}
              className="bg-red-600 hover:bg-red-700 text-white h-8 text-[11px] px-4 font-bold"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
