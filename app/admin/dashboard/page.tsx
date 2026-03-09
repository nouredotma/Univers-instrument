import { LayoutDashboard } from "lucide-react";

export default function OverviewPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mb-4">
        <LayoutDashboard className="w-7 h-7 text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-400">Vue d'ensemble</h3>
      <p className="text-sm text-gray-300 mt-1 max-w-xs">
        Le contenu du tableau de bord apparaîtra ici.
      </p>
    </div>
  );
}
