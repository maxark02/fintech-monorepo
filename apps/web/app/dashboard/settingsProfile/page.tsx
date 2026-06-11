"use client";

export const dynamic = "force-dynamic";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Lock, Camera, Check } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function SettingsProfilePage() {
  const router = useRouter();

  // Достаем user, метод обновления И сам клиент supabase из твоего хука авторизации
  const { user, updateProfile, supabase } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Локальный стейт для полей формы
  const [username, setUsername] = useState(user?.username ?? "");
  const [password, setPassword] = useState("");

  // Стейты для загрузки файла изображения
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    user?.avatarUrl ?? "",
  );

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Синхронизируем стейт, если данные пользователя подгрузились позже
  useEffect(() => {
    if (user) {
      if (!username) setUsername(user.username ?? "");
      if (!avatarPreview) setAvatarPreview(user.avatarUrl ?? "");
    }
  }, [user]);

  // Обработка выбора файла с устройства
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Создаем временную локальную ссылку для отображения картинки в браузере
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Функция загрузки картинки в Supabase Storage
  const uploadAvatar = async (
    file: File,
    userId: string,
  ): Promise<string | null> => {
    try {
      // Используем именно тот клиент, который знает про нашу сессию
      const clientToUse = supabase;

      if (!clientToUse) {
        console.error("Supabase client is missing from useAuth()");
        return null;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await clientToUse.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Supabase Storage Error:", uploadError.message);
        return null;
      }

      // Получаем публичный URL загруженного файла
      const { data } = clientToUse.storage
        .from("avatars")
        .getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err) {
      console.error("Exception in uploadAvatar:", err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const updates: any = {};
    if (username !== user?.username) updates.username = username;
    if (password.trim() !== "") updates.password = password;

    // Если пользователь выбрал файл на устройстве
    if (avatarFile && user?.id) {
      setStatus({ type: "success", message: "Uploading fresh image..." });
      const uploadedUrl = await uploadAvatar(avatarFile, user.id);

      if (uploadedUrl) {
        updates.avatarUrl = uploadedUrl;
      } else {
        setStatus({
          type: "error",
          message: "Failed to upload image to storage.",
        });
        setLoading(false);
        return;
      }
    }

    // Если изменений вообще нет
    if (Object.keys(updates).length === 0) {
      setStatus({ type: "error", message: "No changes detected." });
      setLoading(false);
      return;
    }

    // Отправляем собранные изменения в твой метод обновления профиля
    const result = await updateProfile(updates);

    setLoading(false);
    if (result && result.success) {
      setStatus({ type: "success", message: "Profile updated successfully!" });
      setPassword("");
      setAvatarFile(null);
      setTimeout(() => router.push("/dashboard/profile"), 1500);
    } else {
      setStatus({
        type: "error",
        message: result?.error || "Failed to update profile. Try again.",
      });
    }
  };

  return (
    <div className="text-text-main min-h-screen bg-bg-app p-4 flex flex-col items-center justify-center transition-colors">
      <div className="w-full max-w-md bg-bg-card rounded-3xl p-6 relative transition-colors">
        <Link
          href="/dashboard/profile"
          className="absolute top-6 left-6 w-10 h-10 rounded-full bg-accent text-white hover:bg-accent/80 flex items-center justify-center transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>

        <h1 className="text-2xl font-bold text-center mb-6">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {status && (
            <div
              className={`p-4 rounded-xl text-sm ${status.type === "success" ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"}`}
            >
              {status.message}
            </div>
          )}

          {/* Инпут Загрузки Фото с интерактивным кликабельным превью */}
          <div className="flex flex-col items-center space-y-3 mb-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-full bg-bg-app border border-border flex items-center justify-center overflow-hidden cursor-pointer group"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} className="text-text-muted" />
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-blue-500 hover:underline font-medium"
            >
              Select image from device
            </button>
          </div>

          {/* Инпут Никнейма */}
          <div className="space-y-2">
            <label className="text-sm text-text-muted">Username</label>
            <div className="relative">
              <User
                className="absolute left-4 top-3.5 text-text-muted"
                size={20}
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-bg-app border border-border rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-600 transition-colors"
                placeholder="Enter new username"
              />
            </div>
          </div>

          {/* Инпут Нового Пароля */}
          <div className="space-y-2">
            <label className="text-sm text-text-muted">
              New Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-3.5 text-text-muted"
                size={20}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-app border border-border rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-600 transition-colors"
                placeholder="Leave blank to keep current"
              />
            </div>
          </div>

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
