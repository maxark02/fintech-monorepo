"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Lock, Camera, Check } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function SettingsProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  // Локальный стейт для полей формы
  const [username, setUsername] = useState(user?.username ?? "");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(""); // Ссылка на фото

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // Собираем только то, что пользователь заполнил
    const updates: any = {};
    if (username !== user?.username) updates.username = username;
    if (password.trim() !== "") updates.password = password;
    if (avatarUrl.trim() !== "") updates.avatarUrl = avatarUrl;

    if (Object.keys(updates).length === 0) {
      setStatus({ type: "error", message: "No changes detected." });
      setLoading(false);
      return;
    }

    const result = await updateProfile(updates);

    setLoading(false);
    if (result.success) {
      setStatus({ type: "success", message: "Profile updated successfully!" });
      setPassword(""); // Сбрасываем поле пароля после успешной смены
      setTimeout(() => router.push("/dashboard/profile"), 1500); // Возвращаем в профиль
    } else {
      setStatus({
        type: "error",
        message: "Failed to update profile. Try again.",
      });
    }
  };

  return (
    <div className="dark text-foreground min-h-screen bg-background p-4 flex flex-col items-center justify-center ">
      <div className="w-full max-w-md bg-[#1c1c22] rounded-3xl p-6 relative">
        {/* Кнопка назад */}
        <Link
          href="/dashboard/profile"
          className="absolute top-6 left-6 w-10 h-10 rounded-full bg-accent hover:bg-accent/70 flex items-center justify-center transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>

        <h1 className="text-2xl font-bold text-center mb-8">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Статус-сообщение */}
          {status && (
            <div
              className={`p-4 rounded-xl text-sm ${status.type === "success" ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"}`}
            >
              {status.message}
            </div>
          )}

          {/* Инпут Никнейма */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Username</label>
            <div className="relative">
              <User
                className="absolute left-4 top-3.5 text-muted-foreground"
                size={20}
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-background border border-border rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-600 transition-colors"
                placeholder="Enter new username"
              />
            </div>
          </div>

          {/* Инпут Нового Пароля */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              New Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-3.5 text-muted-foreground"
                size={20}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-600 transition-colors"
                placeholder="Leave blank to keep current"
              />
            </div>
          </div>

          {/* Инпут Ссылки на Фото */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Profile Picture URL
            </label>
            <div className="relative">
              <Camera
                className="absolute left-4 top-3.5 text-muted-foreground"
                size={20}
              />
              <input
                type="file"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full bg-background border border-border rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-600 transition-colors"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>

          {/* Кнопка Сохранения */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Check size={20} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
