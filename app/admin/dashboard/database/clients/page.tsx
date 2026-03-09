"use client";

import { Pencil, Plus, Trash2, Users, X } from "lucide-react";
import { useEffect, useState } from "react";

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

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({
      nom: "",
      email: "",
      telephone: "",
      adresse: "",
      ville: "",
    });
  };

  const loadClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/clients`);
      if (!res.ok) {
        throw new Error("Impossible de charger les clients");
      }
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer ce client ?")) return;
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Impossible de supprimer le client");
      }
      await loadClients();
      if (editingId === id) {
        resetForm();
      }
    } catch (e: any) {
      setError(e.message || "Erreur inattendue");
    }
  };

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.message || "Impossible d’enregistrer le client",
        );
      }

      await loadClients();
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
            <Users className="w-5 h-5 text-[#f2762b]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Clients</h1>
            <p className="text-xs text-gray-400">
              Consulter, créer et modifier les fiches clients.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#f2762b] hover:bg-[#d96521] text-xs font-semibold text-white transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Nouveau client
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      )}

      {/* Formulaire client */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#2c2c2c] border border-white/5 rounded-xl p-4 md:p-5 space-y-4"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-white">
            {editingId ? "Modifier le client" : "Nouveau client"}
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
            <label className="text-xs text-gray-300" htmlFor="nom">
              Nom / Raison sociale
            </label>
            <input
              id="nom"
              name="nom"
              value={form.nom}
              onChange={handleInputChange}
              required
              className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleInputChange}
              className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300" htmlFor="telephone">
              Téléphone
            </label>
            <input
              id="telephone"
              name="telephone"
              value={form.telephone}
              onChange={handleInputChange}
              className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300" htmlFor="ville">
              Ville
            </label>
            <input
              id="ville"
              name="ville"
              value={form.ville}
              onChange={handleInputChange}
              className="w-full rounded-md bg-[#3a3a3a] border border-white/10 px-3 py-1.5 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b]"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs text-gray-300" htmlFor="adresse">
              Adresse
            </label>
            <textarea
              id="adresse"
              name="adresse"
              value={form.adresse}
              onChange={handleInputChange}
              rows={2}
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

      {/* Liste des clients */}
      <div className="bg-[#2c2c2c] border border-white/5 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Liste des clients</h2>
          {loading && (
            <span className="text-[11px] text-gray-400">Chargement...</span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-[#262626] text-gray-300">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Nom</th>
                <th className="px-3 py-2 text-left font-medium">Email</th>
                <th className="px-3 py-2 text-left font-medium">Téléphone</th>
                <th className="px-3 py-2 text-left font-medium">Ville</th>
                <th className="px-3 py-2 text-left font-medium">Adresse</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 && !loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-6 text-center text-gray-400"
                  >
                    Aucun client pour le moment.
                  </td>
                </tr>
              ) : (
                clients.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-white/5 hover:bg_white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-3 py-2 text-gray-100">{c.nom}</td>
                    <td className="px-3 py-2 text-gray-100">
                      {c.email || <span className="text-gray-500">—</span>}
                    </td>
                    <td className="px-3 py-2 text-gray-100">
                      {c.telephone || <span className="text-gray-500">—</span>}
                    </td>
                    <td className="px-3 py-2 text-gray-100">
                      {c.ville || <span className="text-gray-500">—</span>}
                    </td>
                    <td className="px-3 py-2 text-gray-100">
                      {c.adresse || <span className="text-gray-500">—</span>}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(c)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-white/10 text-[11px] text-gray-100 hover:bg-white/10"
                        >
                          <Pencil className="w-3 h-3" />
                          Éditer
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id)}
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

