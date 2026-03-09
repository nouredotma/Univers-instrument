import { ShoppingCart } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mb-4">
        <ShoppingCart className="w-7 h-7 text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-400">Commandes</h3>
      <p className="text-sm text-gray-300 mt-1 max-w-xs">
        La gestion des commandes apparaîtra ici.
      </p>
    </div>
  );
}
