"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Database,
  Users,
  Truck,
  Search,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const navItems = [
  {
    label: "Vue d'ensemble",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Base",
    icon: Database,
    children: [
      { label: "Produits", href: "/admin/dashboard/base/products" },
      { label: "Commandes", href: "/admin/dashboard/base/orders" },
      { label: "Clients", href: "/admin/dashboard/base/clients" },
      { label: "Fournisseurs", href: "/admin/dashboard/base/suppliers" },
    ],
  },
  {
    label: "Clients",
    icon: Users,
    children: [
      { label: "Devis client", href: "/admin/dashboard/clients/quotes" },
      { label: "Commandes client", href: "/admin/dashboard/clients/orders" },
      { label: "BL client", href: "/admin/dashboard/clients/delivery-notes" },
      { label: "Factures client", href: "/admin/dashboard/clients/invoices" },
      { label: "Avoirs client", href: "/admin/dashboard/clients/credit-notes" },
      { label: "Règlements client", href: "/admin/dashboard/clients/payments" },
    ],
  },
  {
    label: "Fournisseurs",
    icon: Truck,
    children: [
      { label: "Devis fournisseur", href: "/admin/dashboard/suppliers/quotes" },
      {
        label: "Commandes fournisseur",
        href: "/admin/dashboard/suppliers/orders",
      },
      {
        label: "BL fournisseur",
        href: "/admin/dashboard/suppliers/delivery-notes",
      },
      {
        label: "Factures fournisseur",
        href: "/admin/dashboard/suppliers/invoices",
      },
      {
        label: "Avoirs fournisseur",
        href: "/admin/dashboard/suppliers/credit-notes",
      },
      {
        label: "Règlements fournisseur",
        href: "/admin/dashboard/suppliers/payments",
      },
    ],
  },
  {
    label: "Consultations",
    icon: Search,
    children: [
      { label: "Clients", href: "/admin/dashboard/consultations/clients" },
      {
        label: "Fournisseurs",
        href: "/admin/dashboard/consultations/suppliers",
      },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  useEffect(() => {
    const auth = sessionStorage.getItem("admin-auth");
    if (auth !== "true") {
      router.replace("/admin");
    } else {
      setIsAuthed(true);
    }
  }, [router]);

  useEffect(() => {
    // Automatically open dropdown if a child link is active
    navItems.forEach((item) => {
      if (item.children?.some((child) => pathname === child.href)) {
        setOpenDropdowns((prev) => ({ ...prev, [item.label]: true }));
      }
    });
  }, [pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin-auth");
    router.replace("/admin");
  };

  if (!isAuthed) {
    return (
      <div className="min-h-svh w-full bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-white flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 lg:left-0 right-0 z-50 h-svh w-64 bg-[#414141] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-start lg:items-center justify-center px-2 h-[60px] border-b border-white/10 relative">
          <Link href="/admin/dashboard" className="flex items-center justify-start lg:justify-center w-full">
            <Image
              src="/whitelogo.png"
              alt="Logo"
              width={140}
              height={60}
              className="object-contain"
            />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute right-5 top-5 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openDropdowns[item.label];
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" &&
                item.href &&
                pathname.startsWith(item.href)) ||
              (item.children &&
                item.children.some((child) => pathname === child.href));

            const Icon = item.icon;

            if (hasChildren) {
              return (
                <div key={item.label} className="space-y-1">
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group cursor-pointer ${
                      isActive
                        ? "text-white bg-white/5"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="mt-1 space-y-0.5">
                      {item.children?.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`block ml-9 px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                              isChildActive
                                ? "text-white bg-[#f2762b]"
                                : "text-white/50 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? "bg-[#f2762b] text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-2 py-2 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-500 bg-red-500/10 hover:text-white hover:bg-red-600 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-svh">
        {/* Top Bar */}
        <header className="sticky lg:static top-0 z-30 bg-white border-b border-gray-100 px-3 lg:px-8 h-[60px] flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-800" style={{ fontFamily: "'Fauna One', serif" }}>
            {(() => {
              if (pathname === "/admin/dashboard") return "Vue d'ensemble";
              
              for (const item of navItems) {
                if (item.children) {
                  const child = item.children.find(c => c.href === pathname);
                  if (child) {
                    return (
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-gray-400 font-medium">{item.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-300" />
                        <span className="text-gray-800">{child.label}</span>
                      </div>
                    );
                  }
                }
              }
              
              const pageName = pathname.split("/").pop()?.replace(/-/g, " ");
              return <span className="capitalize">{pageName}</span>;
            })()}
          </h2>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -mr-2 hover:bg-gray-100 transition-colors text-gray-500"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-3 py-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
