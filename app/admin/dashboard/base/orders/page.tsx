"use client";

import { 
  Search, 
  Eye, 
  Trash2, 
  X, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
  Users,
  Settings,
  ShoppingCart,
  ArrowLeft
} from "lucide-react";
import { useState, useMemo } from "react";
import Image from "next/image";
import { 
  latestOrders as initialOrders, 
  Order, 
  OrderStatus 
} from "@/lib/admin-mock-data";
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
import { Button } from "@/components/ui/button";

const inputBase =
  "w-full rounded-sm bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f2762b] focus:border-[#f2762b] transition-colors";

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; border: string }> = {
  "En attente": { 
    label: "En attente", 
    color: "text-amber-600", 
    bg: "bg-amber-50", 
    border: "border-amber-200" 
  },
  "En cours": { 
    label: "En cours", 
    color: "text-blue-600", 
    bg: "bg-blue-50", 
    border: "border-blue-200" 
  },
  "Livrée": { 
    label: "Livrée", 
    color: "text-emerald-600", 
    bg: "bg-emerald-50", 
    border: "border-emerald-200" 
  },
  "Annulée": { 
    label: "Annulée", 
    color: "text-red-600", 
    bg: "bg-red-50", 
    border: "border-red-200" 
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  /* ---- Filtering ---- */
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    const query = searchQuery.toLowerCase();
    return orders.filter((o) => {
      return (
        o.id.toLowerCase().includes(query) ||
        o.clientName.toLowerCase().includes(query) ||
        o.clientCity.toLowerCase().includes(query) ||
        o.status.toLowerCase().includes(query)
      );
    });
  }, [orders, searchQuery]);

  /* ---- Helpers ---- */
  const handleDeleteOrder = (order: Order) => {
    setOrders((prev) => prev.filter((o) => o.id !== order.id));
    setOrderToDelete(null);
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  if (selectedOrder) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Detail Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour à la liste
          </button>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-[#f2762b]/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-[#f2762b]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 leading-tight">Commande {selectedOrder.id}</h2>
                <p className="text-[11px] text-gray-400">{selectedOrder.date}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusConfig[selectedOrder.status].bg} ${statusConfig[selectedOrder.status].color} ${statusConfig[selectedOrder.status].border}`}>
              {selectedOrder.status}
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
                      <p className="text-[10px] text-gray-400 font-semibold">Nom Complet</p>
                      <p className="text-sm font-bold text-gray-800">{selectedOrder.clientName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center shrink-0">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold">Email</p>
                      <p className="text-sm font-bold text-gray-800">{selectedOrder.clientEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center shrink-0">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold">Téléphone</p>
                      <p className="text-sm font-bold text-gray-800">{selectedOrder.clientPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold">Adresse de livraison</p>
                      <p className="text-sm font-bold text-gray-800">{selectedOrder.clientAddress}, {selectedOrder.clientCity}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order State */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Settings className="w-3.5 h-3.5 text-gray-400" />
                  État & Gestion
                </h3>
                <div className="space-y-5">
                   <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold">Date de commande</p>
                      <p className="text-sm font-bold text-gray-800">{selectedOrder.date}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 font-bold block">Changer le statut</label>
                    <select 
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                      className={`${inputBase} h-10 font-bold bg-white border-2 border-gray-100 text-sm`}
                    >
                      {Object.keys(statusConfig).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  {selectedOrder.clientMessage && (
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-sm">
                      <p className="text-[10px] text-amber-700 uppercase font-bold mb-1.5 flex items-center gap-2">
                        Message du Client
                      </p>
                      <p className="text-xs text-amber-800 italic leading-relaxed font-medium">"{selectedOrder.clientMessage}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2 uppercase tracking-wide">
                <ShoppingCart className="w-3.5 h-3.5 text-gray-400" />
                Articles commandés
              </h3>
              <div className="border border-gray-100 rounded-sm overflow-hidden">
                <table className="min-w-full text-xs md:text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-5 py-3 text-left font-medium">Produit</th>
                      <th className="px-5 py-3 text-center font-medium">Quantité</th>
                      <th className="px-5 py-3 text-right font-medium">Prix unitaire</th>
                      <th className="px-5 py-3 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-sm border border-gray-200 shrink-0 bg-white overflow-hidden">
                              <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                            </div>
                            <span className="font-bold text-gray-800">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center font-bold text-gray-700">x{item.quantity}</td>
                        <td className="px-5 py-4 text-right text-gray-500 font-medium">{item.price.toLocaleString("fr-FR")} MAD</td>
                        <td className="px-5 py-4 text-right font-bold text-[#f2762b]">
                          {(item.price * item.quantity).toLocaleString("fr-FR")} MAD
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50/80 border-t-2 border-gray-100">
                    <tr>
                      <td colSpan={3} className="px-5 py-5 text-right font-bold text-gray-500 text-[11px]">Montant Final :</td>
                      <td className="px-5 py-5 text-right font-black text-base text-gray-900">{selectedOrder.total.toLocaleString("fr-FR")} MAD</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-300">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une commande (ID, client, ville...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${inputBase} pl-10 h-10`}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border-2 border-gray-200 rounded-sm overflow-hidden text-[#414141]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-3 md:px-5 py-3 text-left font-semibold">N° commande</th>
                <th className="px-3 md:px-5 py-3 text-left font-semibold">Client</th>
                <th className="px-3 md:px-5 py-3 text-left font-semibold">Date</th>
                <th className="px-3 md:px-5 py-3 text-right font-semibold">Total</th>
                <th className="px-3 md:px-5 py-3 text-left font-semibold">Statut</th>
                <th className="px-3 md:px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 md:px-5 py-6 text-center text-gray-400">
                    Aucune commande trouvée.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const status = statusConfig[order.status];
                  return (
                    <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors">
                      <td className="px-3 md:px-5 py-3.5 font-mono text-[11px] text-[#f2762b] font-bold">
                        {order.id}
                      </td>
                      <td className="px-3 md:px-5 py-3.5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800">{order.clientName}</span>
                          <span className="text-[10px] text-gray-400">{order.clientCity}</span>
                        </div>
                      </td>
                      <td className="px-3 md:px-5 py-3.5 text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-3 md:px-5 py-3.5 text-right font-bold text-gray-900">
                        {order.total.toLocaleString("fr-FR")} MAD
                      </td>
                      <td className="px-3 md:px-5 py-3.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.bg} ${status.color} ${status.border}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-3 md:px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="w-7 h-7 flex items-center justify-center rounded-sm border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors cursor-pointer"
                            title="Voir les détails"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setOrderToDelete(order)}
                            className="w-7 h-7 flex items-center justify-center rounded-sm border border-red-200 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={!!orderToDelete} onOpenChange={() => setOrderToDelete(null)}>
        <AlertDialogContent className="sm:max-w-[400px] p-5 gap-3">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base text-gray-900 border-b border-gray-100 pb-2">Supprimer la commande ?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs pt-1">
              Cette action est irréversible. La commande <span className="font-black text-red-600">{orderToDelete?.id}</span> sera définitivement effacée du système.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:gap-2">
            <AlertDialogCancel className="h-8 text-[11px] px-4 font-semibold">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => orderToDelete && handleDeleteOrder(orderToDelete)}
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
