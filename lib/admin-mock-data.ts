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

export const latestOrders = [
  {
    id: "CMD-001",
    client: "Ahmed Benali",
    date: "09 Mar 2026",
    total: "12 500,00 MAD",
    status: "Livrée",
  },
  {
    id: "CMD-002",
    client: "Fatima El-Amrani",
    date: "08 Mar 2026",
    total: "8 750,00 MAD",
    status: "En cours",
  },
  {
    id: "CMD-003",
    client: "Mohamed Tazi",
    date: "07 Mar 2026",
    total: "23 100,00 MAD",
    status: "En attente",
  },
  {
    id: "CMD-004",
    client: "Karim Najib",
    date: "06 Mar 2026",
    total: "5 200,00 MAD",
    status: "Livrée",
  },
  {
    id: "CMD-005",
    client: "Sara Mouline",
    date: "05 Mar 2026",
    total: "15 800,00 MAD",
    status: "En cours",
  },
];

/* ------------------------------------------------------------------ */
/*  Mock Products                                                      */
/* ------------------------------------------------------------------ */

export type MockProduit = {
  id: string;
  reference: string;
  designation: string;
  description_courte: string;
  description: string;
  etat: "neuf" | "occasion";
  prix_unitaire: number;
  stock: number;
  type: string;
};

export const mockProduits: MockProduit[] = [
  {
    id: "p1",
    reference: "PH-PRO-001",
    designation: "pH-mètre numérique Pro",
    description_courte: "pH-mètre de paillasse haute précision",
    description: "pH-mètre de paillasse haute précision pour analyses en laboratoire.",
    etat: "neuf",
    prix_unitaire: 4500,
    stock: 12,
    type: "Mesure pH",
  },
  {
    id: "p2",
    reference: "TURB-200",
    designation: "Turbidimètre portable",
    description_courte: "Turbidimètre compact pour test qualité eau",
    description: "Turbidimètre portable compact pour l'analyse de la qualité de l'eau.",
    etat: "neuf",
    prix_unitaire: 6200,
    stock: 8,
    type: "Turbidité",
  },
  {
    id: "p3",
    reference: "SOL-KIT-PRO",
    designation: "Kit d'analyse de sol Pro",
    description_courte: "Kit complet pour analyse de sol",
    description: "Kit portable complet pour analyses de sol en agriculture et agronomie.",
    etat: "neuf",
    prix_unitaire: 8900,
    stock: 5,
    type: "Analyse sol",
  },
  {
    id: "p4",
    reference: "COND-350",
    designation: "Conductimètre de laboratoire",
    description_courte: "Conductimètre haute gamme",
    description: "Conductimètre de laboratoire avec compensation automatique de température.",
    etat: "occasion",
    prix_unitaire: 3200,
    stock: 3,
    type: "Conductivité",
  },
  {
    id: "p5",
    reference: "SPEC-UV-100",
    designation: "Spectrophotomètre UV-Vis",
    description_courte: "Spectrophotomètre double faisceau",
    description: "Spectrophotomètre UV-Vis double faisceau pour analyses optiques avancées.",
    etat: "neuf",
    prix_unitaire: 15600,
    stock: 2,
    type: "Spectrophotométrie",
  },
];
