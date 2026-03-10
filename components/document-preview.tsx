"use client";

import { useState } from "react";
import { Printer, X, ZoomIn, ZoomOut } from "lucide-react";

// ── Company info ──────────────────────────────────────────────────────────────
const COMPANY = {
  nom: "Univers Instrument Service",
  adresse: "C/O Bloc B, N°255 Hay Assaka Tikiouine, Agadir",
  tp: "48701752",
  rc: "42667",
  iif: "45615062",
  ice: "002372001000029",
  tel: "+212 661 494 662",
  fixe: "+212 528 210 909",
  email: "uis.instruments@gmail.com",
  logo: "/logo.png",
};

// ── Status palette ────────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  brouillon:  { label: "Brouillon", color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" },
  "envoyée":  { label: "Envoyée",   color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  "envoyé":   { label: "Envoyé",    color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  "payée":    { label: "Payée",     color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
  "payé":     { label: "Payé",      color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
  "livré":    { label: "Livré",     color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
  "livrée":   { label: "Livrée",    color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
  "annulée":  { label: "Annulée",   color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
  "annulé":   { label: "Annulé",    color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
  "en cours": { label: "En cours",  color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
  "confirmée":{ label: "Confirmée", color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
  "confirmé": { label: "Confirmé",  color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
};

// ── Types ─────────────────────────────────────────────────────────────────────
export type DocumentLine = {
  reference?: string;
  designation?: string;
  prix_unitaire: number;
  quantite: number;
  total: number;
};

export type DocumentData = {
  /** Document type label shown as big title, e.g. "FACTURE", "BON DE LIVRAISON", "AVOIR" */
  type: string;
  /** Document number, e.g. "FAC-2024-001" */
  numero: string;
  /** ISO date string */
  date: string;
  /** Status key matching statusConfig */
  statut?: string;
  /** Client / supplier info */
  tiers: {
    nom: string;
    adresse?: string;
    ice?: string;
  };
  /** Extra metadata rows under "Détails" */
  details?: { label: string; value: string }[];
  /** Line items */
  lignes: DocumentLine[];
  /** Montant total HT override — if omitted, sum of lignes is used */
  montant_ht?: number;
  /** Whether to show TVA row (defaults to true) */
  showTva?: boolean;
  /** TVA rate as decimal (defaults to 0.20 = 20%) */
  tvaRate?: number;
  /** Watermark text when statut is payée/payé */
  watermarkPaid?: string;
  /** Watermark text when statut is annulée/annulé */
  watermarkCancelled?: string;
  /** Label for the "Facturé à" / "Client" / "Fournisseur" box */
  tiersLabel?: string;
};

type Props = {
  document: DocumentData;
  onClose: () => void;
};

export default function DocumentPreview({ document: doc, onClose }: Props) {
  const [zoom, setZoom] = useState(1);

  const st = statusConfig[doc.statut || ""] || statusConfig.brouillon;

  // ── Totals ────────────────────────────────────────────────────────────────
  const ht = doc.montant_ht ?? doc.lignes.reduce((sum, l) => sum + l.total, 0);
  const tvaRate = doc.tvaRate ?? 0.20;
  const showTva = doc.showTva !== false;
  const tva = showTva ? ht * tvaRate : 0;
  const ttc = ht + tva;

  // ── Watermark ─────────────────────────────────────────────────────────────
  const isPaid = ["payée", "payé"].includes(doc.statut || "");
  const isCancelled = ["annulée", "annulé"].includes(doc.statut || "");

  const tiersLabel = doc.tiersLabel || "Facturé à";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.6)", display: "flex", flexDirection: "column", alignItems: "center", overflow: "auto", padding: "32px 16px" }}>
      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", gap: 12, background: "#111827", color: "white", borderRadius: 999, padding: "10px 20px", boxShadow: "0 25px 50px -12px rgba(0,0,0,.25)", marginBottom: 24, fontSize: 12, fontWeight: 500 }}>
        <span style={{ fontFamily: "monospace", color: "#f2762b", fontWeight: 700 }}>{doc.numero}</span>
        <span style={{ color: "#6b7280" }}>|</span>
        <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0, display: "flex" }} onMouseEnter={e => (e.currentTarget.style.color = "#f2762b")} onMouseLeave={e => (e.currentTarget.style.color = "inherit")}><ZoomOut style={{ width: 16, height: 16 }} /></button>
        <span style={{ width: 40, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0, display: "flex" }} onMouseEnter={e => (e.currentTarget.style.color = "#f2762b")} onMouseLeave={e => (e.currentTarget.style.color = "inherit")}><ZoomIn style={{ width: 16, height: 16 }} /></button>
        <span style={{ color: "#6b7280" }}>|</span>
        <button onClick={() => window.print()} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", gap: 6 }} onMouseEnter={e => (e.currentTarget.style.color = "#f2762b")} onMouseLeave={e => (e.currentTarget.style.color = "inherit")}><Printer style={{ width: 16, height: 16 }} /> Imprimer</button>
        <span style={{ color: "#6b7280" }}>|</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0, display: "flex" }} onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")} onMouseLeave={e => (e.currentTarget.style.color = "inherit")}><X style={{ width: 16, height: 16 }} /></button>
      </div>

      {/* ── A4 Page ────────────────────────────────────────────────────────── */}
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
          width: 794,
          minHeight: 1123,
          marginBottom: zoom < 1 ? `${-(1123 * (1 - zoom))}px` : 0,
          background: "white",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,.25)",
          borderRadius: 2,
          position: "relative",
        }}
      >
        {/* ── Status watermarks ──────────────────────────────────────────── */}
        {isPaid && (
          <div style={{ position: "absolute", top: 220, right: 60, transform: "rotate(-30deg)", opacity: 0.08, fontSize: 96, fontWeight: 900, color: "#059669", pointerEvents: "none", userSelect: "none", letterSpacing: 4 }}>
            {doc.watermarkPaid || "PAYÉE"}
          </div>
        )}
        {isCancelled && (
          <div style={{ position: "absolute", top: 220, right: 40, transform: "rotate(-30deg)", opacity: 0.08, fontSize: 96, fontWeight: 900, color: "#dc2626", pointerEvents: "none", userSelect: "none", letterSpacing: 4 }}>
            {doc.watermarkCancelled || "ANNULÉE"}
          </div>
        )}

        <div style={{ padding: "48px 56px" }}>
          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
            {/* Logo + company */}
            <div>
              <img
                src={COMPANY.logo}
                alt="Logo"
                style={{ height: 50, marginBottom: 12, display: "block" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{COMPANY.nom}</div>
              <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.7 }}>
                {COMPANY.adresse}<br />
                Tél: {COMPANY.tel} / Fixe: {COMPANY.fixe}<br />
                E-mail: {COMPANY.email}<br />
                TP: {COMPANY.tp} - RC: {COMPANY.rc} - IF: {COMPANY.iif}<br />
                ICE: {COMPANY.ice}
              </div>
            </div>

            {/* Document title */}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#f2762b", letterSpacing: -1, marginBottom: 8 }}>{doc.type}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", fontFamily: "monospace", marginBottom: 6 }}>{doc.numero}</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>
                Date: <strong style={{ color: "#111827" }}>{doc.date?.slice(0, 10)}</strong>
              </div>
              {doc.statut && (
                <div style={{ marginTop: 10 }}>
                  <span style={{ display: "inline-block", padding: "3px 12px", borderRadius: 999, fontSize: 10, fontWeight: 700, border: `1px solid ${st.border}`, background: st.bg, color: st.color }}>
                    {st.label}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Divider ────────────────────────────────────────────────────── */}
          <div style={{ height: 3, background: "linear-gradient(90deg, #f2762b, #fbbf24)", borderRadius: 2, marginBottom: 32 }} />

          {/* ── Tiers + Details ─────────────────────────────────────────────── */}
          <div style={{ display: "flex", gap: 40, marginBottom: 36 }}>
            <div style={{ flex: 1, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 4, padding: "16px 20px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#f2762b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{tiersLabel}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{doc.tiers.nom}</div>
              <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.7 }}>
                {doc.tiers.adresse || "—"}<br />
                ICE: {doc.tiers.ice || "—"}
              </div>
            </div>
            <div style={{ flex: 1, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 4, padding: "16px 20px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#f2762b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Détails</div>
              <table style={{ fontSize: 11, width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ color: "#6b7280", paddingBottom: 4, width: "50%" }}>N° {doc.type}</td>
                    <td style={{ fontWeight: 700, color: "#111827", fontFamily: "monospace" }}>{doc.numero}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "#6b7280", paddingBottom: 4 }}>Date</td>
                    <td style={{ fontWeight: 600, color: "#111827" }}>{doc.date?.slice(0, 10)}</td>
                  </tr>
                  {(doc.details || []).map((d, i) => (
                    <tr key={i}>
                      <td style={{ color: "#6b7280", paddingBottom: 4 }}>{d.label}</td>
                      <td style={{ fontWeight: 600, color: "#111827" }}>{d.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Lines table ─────────────────────────────────────────────────── */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24, fontSize: 11 }}>
            <thead>
              <tr style={{ background: "#111827" }}>
                <th style={{ padding: "10px 14px", textAlign: "left", color: "white", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>#</th>
                <th style={{ padding: "10px 14px", textAlign: "left", color: "white", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Référence</th>
                <th style={{ padding: "10px 14px", textAlign: "left", color: "white", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Désignation</th>
                <th style={{ padding: "10px 14px", textAlign: "right", color: "white", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>P.U.</th>
                <th style={{ padding: "10px 14px", textAlign: "right", color: "white", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Qté</th>
                <th style={{ padding: "10px 14px", textAlign: "right", color: "white", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Total HT</th>
              </tr>
            </thead>
            <tbody>
              {doc.lignes.map((l, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "10px 14px", color: "#9ca3af", fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</td>
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "#f2762b", fontWeight: 700 }}>{l.reference || "—"}</td>
                  <td style={{ padding: "10px 14px", color: "#374151" }}>{l.designation || "—"}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", color: "#374151" }}>{Number(l.prix_unitaire).toLocaleString("fr-FR")} MAD</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", color: "#374151" }}>{l.quantite}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: "#111827" }}>{Number(l.total).toLocaleString("fr-FR")} MAD</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── Totals ──────────────────────────────────────────────────────── */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 48 }}>
            <div style={{ width: 280 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #e5e7eb", fontSize: 12 }}>
                <span style={{ color: "#6b7280" }}>Sous-total HT</span>
                <span style={{ fontWeight: 600, color: "#111827" }}>{Number(ht).toLocaleString("fr-FR")} MAD</span>
              </div>
              {showTva && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #e5e7eb", fontSize: 12 }}>
                  <span style={{ color: "#6b7280" }}>TVA ({Math.round(tvaRate * 100)}%)</span>
                  <span style={{ fontWeight: 600, color: "#111827" }}>{Number(tva.toFixed(2)).toLocaleString("fr-FR")} MAD</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "#111827", borderRadius: 4, marginTop: 8 }}>
                <span style={{ color: "white", fontWeight: 700, fontSize: 13 }}>{showTva ? "Total TTC" : "Total"}</span>
                <span style={{ color: "#f2762b", fontWeight: 900, fontSize: 15 }}>{Number(ttc.toFixed(2)).toLocaleString("fr-FR")} MAD</span>
              </div>
            </div>
          </div>

          {/* ── Footer ──────────────────────────────────────────────────────── */}
          <div style={{ borderTop: "2px solid #f3f4f6", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 10, color: "#9ca3af" }}>
              <div style={{ fontWeight: 700, color: "#6b7280", marginBottom: 3 }}>{COMPANY.nom}</div>
              ICE: {COMPANY.ice} | RC: {COMPANY.rc}
            </div>
            <div style={{ fontSize: 10, color: "#9ca3af", textAlign: "center" }}>
              Merci de votre confiance<br />
              <span style={{ color: "#f2762b", fontWeight: 600 }}>{COMPANY.email}</span>
            </div>
            <div style={{ fontSize: 10, color: "#9ca3af", textAlign: "right" }}>
              {doc.numero}<br />
              Page 1 / 1
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
