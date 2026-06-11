"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth"; // 🌟 Импортируем наш рабочий Supabase-хук

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // 🌟 Достаем методы из нашего Supabase-хука
  const { register, loginWithOAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 🌟 Регистрируем пользователя напрямую в Supabase Auth.
      // Хук сам добавит имя в метаданные, наполнит Zustand и перенаправит на баланс
      await register(formData.name, formData.email, formData.password);
    } catch (err: any) {
      setError("Registration failed. Try a different email.");
      setIsLoading(false);
    }
  };

  // 🌟 Регистрация/вход через соцсети — Supabase OAuth
  const handleGoogleSignIn = () => loginWithOAuth("google");

  const handleAppleSignIn = () => loginWithOAuth("apple");

  return (
    <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white">T</span>
          </div>
          <h1 className="text-3xl mb-2">Create Account</h1>
          <p className="text-muted-foreground">
            Join Toss and manage your finances
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Input */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Full Name
            </label>
            <div className="relative">
              <User
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter your full name"
                className="w-full bg-white text-slate-900 placeholder-slate-400 border border-border rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Email
            </label>
            <div className="relative">
              <Mail
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email"
                className="w-full bg-white text-slate-900 placeholder-slate-400 border border-border rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Password
            </label>
            <div className="relative">
              <Lock
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Create a password"
                className="w-full bg-white text-slate-900 placeholder-slate-400 border border-border rounded-2xl pl-12 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-4 h-4 rounded accent-blue-600"
              required
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-sm text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="bg-accent hover:bg-accent/70 border border-border py-3 rounded-xl transition-colors"
          >
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={handleAppleSignIn}
            className="bg-accent hover:bg-accent/70 border border-border py-3 rounded-xl transition-colors"
          >
            <span>Apple</span>
          </button>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
