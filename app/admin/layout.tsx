import type React from "react";

export const metadata = {
  title: "Admin | Univers Instrument Service",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
