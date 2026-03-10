import { ShoppingCart, Package, Users, Warehouse } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Stat Cards                                                         */
/* ------------------------------------------------------------------ */

export const stats = [
  {
    label: "Commandes",
    value: 156,
    icon: ShoppingCart,
    accent: "#f2762b",
  },
  {
    label: "Produits",
    value: 84,
    icon: Package,
    accent: "#3b82f6",
  },
  {
    label: "Clients",
    value: 1243,
    icon: Users,
    accent: "#10b981",
  },
  {
    label: "Fournisseurs",
    value: 32,
    icon: Warehouse,
    accent: "#8b5cf6",
  },
];

/* ------------------------------------------------------------------ */
/*  Revenue Chart Data                                                 */
/* ------------------------------------------------------------------ */

export const revenueData = [
  { month: "Avr 25", revenue: 18500 },
  { month: "Mai 25", revenue: 22300 },
  { month: "Jun 25", revenue: 19800 },
  { month: "Jul 25", revenue: 27600 },
  { month: "Aoû 25", revenue: 24100 },
  { month: "Sep 25", revenue: 31200 },
  { month: "Oct 25", revenue: 28900 },
  { month: "Nov 25", revenue: 34500 },
  { month: "Déc 25", revenue: 30200 },
  { month: "Jan 26", revenue: 38100 },
  { month: "Fév 26", revenue: 35400 },
  { month: "Mar 26", revenue: 42000 },
];

/* ------------------------------------------------------------------ */
/*  Orders Per Month Chart Data                                        */
/* ------------------------------------------------------------------ */

export const ordersPerMonth = [
  { month: "Avr 25", orders: 12 },
  { month: "Mai 25", orders: 19 },
  { month: "Jun 25", orders: 15 },
  { month: "Jul 25", orders: 22 },
  { month: "Aoû 25", orders: 18 },
  { month: "Sep 25", orders: 25 },
  { month: "Oct 25", orders: 21 },
  { month: "Nov 25", orders: 28 },
  { month: "Déc 25", orders: 24 },
  { month: "Jan 26", orders: 31 },
  { month: "Fév 26", orders: 27 },
  { month: "Mar 26", orders: 35 },
];

/* ------------------------------------------------------------------ */
/*  Latest Orders                                                      */
/* ------------------------------------------------------------------ */

export type OrderStatus = "En attente" | "En cours" | "Livrée" | "Annulée";

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientCity: string;
  clientMessage?: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
}

export const latestOrders: Order[] = [
  {
    id: "CMD-001",
    clientName: "Ahmed Benali",
    clientEmail: "ahmed.benali@email.com",
    clientPhone: "+212 661-123456",
    clientAddress: "123 Rue Allal Ben Abdellah",
    clientCity: "Casablanca",
    clientMessage: "Besoin d'une livraison urgente avant midi.",
    date: "09 Mar 2026",
    total: 12500,
    status: "Livrée",
    items: [
      {
        productId: "prod-1",
        name: "pH-mètre numérique Pro",
        quantity: 1,
        price: 8500,
        image: "/unnamed.jpg",
      },
      {
        productId: "prod-5",
        name: "Set de pipettes de laboratoire",
        quantity: 2,
        price: 2000,
        image: "/unnamed.jpg",
      },
    ],
  },
  {
    id: "CMD-002",
    clientName: "Fatima El-Amrani",
    clientEmail: "fatima.amrani@gmail.com",
    clientPhone: "+212 662-987654",
    clientAddress: "45 Avenue Hassan II",
    clientCity: "Rabat",
    date: "08 Mar 2026",
    total: 8750,
    status: "En cours",
    items: [
      {
        productId: "prod-2",
        name: "Turbidimètre portable",
        quantity: 1,
        price: 8750,
        image: "/unnamed.jpg",
      },
    ],
  },
  {
    id: "CMD-003",
    clientName: "Mohamed Tazi",
    clientEmail: "m.tazi@entreprise.ma",
    clientPhone: "+212 522-445566",
    clientAddress: "Quartier Industriel Ain Sebaa",
    clientCity: "Casablanca",
    clientMessage: "Veuillez inclure la facture originale dans le colis.",
    date: "07 Mar 2026",
    total: 23100,
    status: "En attente",
    items: [
      {
        productId: "prod-4",
        name: "Balance analytique de précision",
        quantity: 2,
        price: 11550,
        image: "/unnamed.jpg",
      },
    ],
  },
  {
    id: "CMD-004",
    clientName: "Karim Najib",
    clientEmail: "k.najib@outlook.fr",
    clientPhone: "+212 670-112233",
    clientAddress: "Résidence Al Mansour, Appt 12",
    clientCity: "Marrakech",
    date: "06 Mar 2026",
    total: 5200,
    status: "Livrée",
    items: [
      {
        productId: "prod-3",
        name: "Kit d'analyse de sol Pro",
        quantity: 1,
        price: 5200,
        image: "/unnamed.jpg",
      },
    ],
  },
  {
    id: "CMD-005",
    clientName: "Sara Mouline",
    clientEmail: "sara.mouline@ecole.edu",
    clientPhone: "+212 611-334455",
    clientAddress: "Cité Universitaire, Bloc B",
    clientCity: "Fès",
    clientMessage: "Livraison à l'accueil de la faculté.",
    date: "05 Mar 2026",
    total: 15800,
    status: "En cours",
    items: [
      {
        productId: "prod-6",
        name: "Moniteur de signes vitaux patient",
        quantity: 1,
        price: 15800,
        image: "/unnamed.jpg",
      },
    ],
  },
];

