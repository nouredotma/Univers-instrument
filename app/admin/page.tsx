"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, LogIn } from "lucide-react";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate a brief delay for UX
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (username === "admin" && password === "admin123") {
      // Store auth in sessionStorage
      sessionStorage.setItem("admin-auth", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid username or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-svh w-full flex items-center justify-center bg-white px-4">
      {/* Login Card */}
      <div className="w-full max-w-sm bg-[#414141] rounded-xl p-6">
        {/* Logo / Branding */}
        <div className="text-center mb-6">
          <Image
            src="/whitelogo.png"
            alt="Univers Instrument Service"
            width={180}
            height={60}
            className="mx-auto mb-3 object-contain"
          />
          <p className="text-xs text-white/50 mt-1">
            Connectez-vous pour gérer le tableau de bord
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Username */}
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <User className="w-3.5 h-3.5" />
            </div>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nom d'utilisateur"
              required
              autoComplete="username"
              className="w-full pl-10 pr-4 py-2 bg-white border border-white rounded-full text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-[#f2762b] transition-all duration-200"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
              autoComplete="current-password"
              className="w-full pl-10 pr-12 py-2 bg-white border border-white rounded-full text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-[#f2762b] transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-300 text-[11px] text-center bg-red-400/10 py-1.5 px-3 border border-red-400/20 rounded uppercase tracking-wide font-medium">
              Nom d'utilisateur ou mot de passe incorrect
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#f2762b] hover:bg-[#d96521] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                Se connecter
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[11px] text-white/25 mt-6">
          Univers Instrument Service — Admin
        </p>
      </div>
    </div>
  );
}
