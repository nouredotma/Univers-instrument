"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Eye,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  stats,
  revenueData,
  ordersPerMonth,
  latestOrders,
} from "@/lib/admin-mock-data";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function statusBadge(status: string) {
  const map: Record<string, string> = {
    Livrée: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    "En cours": "bg-blue-500/15 text-blue-400 border-blue-500/20",
    "En attente": "bg-amber-500/15 text-amber-400 border-amber-500/20",
  };
  return map[status] ?? "bg-gray-500/15 text-gray-400 border-gray-500/20";
}

/* ------------------------------------------------------------------ */
/*  Custom tooltip components                                          */
/* ------------------------------------------------------------------ */

function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg border border-gray-200 px-3 py-2 text-xs">
      <p className="font-semibold text-gray-800 mb-0.5">{label}</p>
      <p className="text-[#f2762b] font-medium">
        {payload[0].value.toLocaleString("fr-MA")} MAD
      </p>
    </div>
  );
}

function OrdersTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#515151] rounded-lg border border-white/10 px-3 py-2 text-xs">
      <p className="font-semibold text-white mb-0.5">{label}</p>
      <p className="text-[#f2762b] font-medium">
        {payload[0].value} commandes
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function OverviewPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* ====== ROW 1 — Stat Cards ====== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white border-2 border-gray-200 rounded-sm p-2.5 md:p-4 flex items-center gap-2.5 md:gap-3 transition-colors hover:border-[#f2762b]/30"
            >
              {/* Icon */}
              <div
                className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${s.accent}15` }}
              >
                <Icon
                  className="w-3.5 h-3.5 md:w-4 md:h-4"
                  style={{ color: s.accent }}
                />
              </div>

              {/* Value + Label */}
              <div className="min-w-0">
                <p className="text-lg md:text-xl font-bold text-gray-900 tracking-tight leading-tight">
                  {s.value.toLocaleString("fr-FR")}
                </p>
                <p className="text-[10px] md:text-[11px] text-gray-400 font-medium">
                  {s.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ====== ROW 2 — Charts ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        {/* Area Chart — Revenue */}
        <div className="bg-white border-2 border-gray-200 rounded-sm p-3 md:p-5">
          <div className="flex items-center justify-between mb-3 md:mb-5">
            <div>
              <h3 className="text-sm md:text-base font-semibold text-gray-800">
                Revenus
              </h3>
              <p className="text-[11px] md:text-xs text-gray-400 mt-0.5">
                Évolution mensuelle du chiffre d&apos;affaires
              </p>
            </div>
            <div className="flex items-center gap-1 text-emerald-500">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-xs font-semibold">+18.2%</span>
            </div>
          </div>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#f2762b"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="#f2762b"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<RevenueTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f2762b"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#f2762b",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart — Orders (dark bg matching sidebar #414141) */}
        <div className="bg-[#414141] rounded-sm p-3 md:p-5">
          <div className="flex items-center justify-between mb-3 md:mb-5">
            <div>
              <h3 className="text-sm md:text-base font-semibold text-white">
                Commandes
              </h3>
              <p className="text-[11px] md:text-xs text-white/50 mt-0.5">
                Nombre de commandes par mois
              </p>
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-xs font-semibold">+24.6%</span>
            </div>
          </div>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ordersPerMonth}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<OrdersTooltip />} />
                <Bar
                  dataKey="orders"
                  fill="#f2762b"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ====== ROW 3 — Latest Orders ====== */}
      <div className="bg-white border-2 border-gray-200 rounded-sm overflow-hidden">
        <div className="px-3 md:px-5 py-3 md:py-4 border-b border-[#f2762b]/10 flex items-center justify-between">
          <div>
            <h3 className="text-sm md:text-base font-semibold text-gray-800">
              Dernières commandes
            </h3>
            <p className="text-[11px] md:text-xs text-gray-400 mt-0.5">
              Les 5 commandes les plus récentes
            </p>
          </div>
          <Link
            href="/admin/dashboard/base/orders"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#f2762b] hover:text-[#d96521] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voir tout</span>
          </Link>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-3 md:px-5 py-2.5 text-left font-medium">
                  N° Commande
                </th>
                <th className="px-3 md:px-5 py-2.5 text-left font-medium">
                  Client
                </th>
                <th className="px-3 md:px-5 py-2.5 text-left font-medium">
                  Date
                </th>
                <th className="px-3 md:px-5 py-2.5 text-left font-medium">
                  Total
                </th>
                <th className="px-3 md:px-5 py-2.5 text-left font-medium">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-3 md:px-5 py-2.5 font-semibold text-gray-800">
                    {order.id}
                  </td>
                  <td className="px-3 md:px-5 py-2.5 text-gray-600">
                    {order.client}
                  </td>
                  <td className="px-3 md:px-5 py-2.5 text-gray-400">
                    {order.date}
                  </td>
                  <td className="px-3 md:px-5 py-2.5 font-medium text-gray-800">
                    {order.total}
                  </td>
                  <td className="px-3 md:px-5 py-2.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] md:text-[11px] font-semibold border ${statusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden divide-y divide-gray-50">
          {latestOrders.map((order) => (
            <div
              key={order.id}
              className="px-3 py-3 flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-gray-800">
                    {order.id}
                  </span>
                  <span
                    className={`inline-block px-1.5 py-px rounded-full text-[9px] font-semibold border ${statusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 truncate">
                  {order.client}
                </p>
                <p className="text-[10px] text-gray-400">{order.date}</p>
              </div>
              <p className="text-xs font-semibold text-gray-800 whitespace-nowrap">
                {order.total}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
