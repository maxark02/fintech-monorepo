"use client";

import { useEffect, useState } from "react"; // 🌟 Добавили useState для отслеживания ошибок картинок
import { createBrowserClient } from "@supabase/ssr";
import { NumberPopIn } from "#/app/dashboard/_components/NumberPopIn";

export const dynamic = "force-dynamic";

import {
  Camera,
  ChevronRight,
  LogOut,
  Shield,
  Bell,
  Globe,
  CreditCard,
  Users,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "../_components/PageHeader";
import { NavIcon } from "../_components/nav-icon";
import { useBalance } from "@/features/balance/hooks/useBalance";
import { Skeleton } from "@fin/ui";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function ProfilePage() {
  const [imageError, setImageError] = useState(false); // 🌟 Состояние на случай, если ссылка на аватарку битая

  // ТЕСТ СУПАБЕЙЗА НА СТРАНИЦЕ ПРОФИЛЯ
  useEffect(() => {
    const testSupabase = async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !key) {
        console.warn("Тест пропущен: нет ENV переменных на сервере.");
        return;
      }

      const supabase = createBrowserClient(url, key, {
        auth: {
          persistSession: true,
          storage:
            typeof window !== "undefined" ? window.localStorage : undefined,
        },
      });

      console.log("=== ТЕСТ СУПАБЕЙЗА НА СТРАНИЦЕ ПРОФИЛЯ ===");
      console.log("1. URL проекта:", url);

      const { data: sessionData } = await supabase.auth.getSession();
      console.log("2. Сессия в браузере:", sessionData.session);

      const { data: userData } = await supabase.auth.getUser();
      console.log("3. Пользователь в Supabase:", userData.user);
    };

    testSupabase();
  }, []);

  const menuItems = [
    {
      icon: CreditCard,
      label: "Payment Methods",
      description: "Manage cards and accounts",
      link: "/dashboard/cards",
    },
    {
      icon: Shield,
      label: "Security",
      description: "Password, 2FA, biometrics",
      link: "#",
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Push, email, SMS",
      link: "#",
    },
    {
      icon: Globe,
      label: "Language & Region",
      description: "English, Russia",
      link: "#",
    },
    {
      icon: Users,
      label: "Referral Program",
      description: "Invite friends and earn",
      link: "#",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "FAQ, Contact us",
      link: "#",
    },
  ];

  const { user, isAuthenticated, logout } = useAuth();
  const { balance, isLoading } = useBalance();

  const transactionCount = balance?.transactions?.length ?? 0;
  const cardCount = balance?.cards?.length ?? 0;

  const username = user?.username ?? "User";
  const shortUsername = username ? username[0].toUpperCase() : "U";
  const email = user?.email ?? "user@example.com";

  // 🌟 СТРОИМ ПУБЛИЧНЫЙ URL ДЛЯ АВАТАРКИ ИЗ СУПАБЕЙЗ
  // Если в поле avatarUrl лежит только имя файла, мы склеиваем его с URL твоего бакета
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const fullAvatarUrl =
    user?.avatarUrl && supabaseUrl
      ? user.avatarUrl.startsWith("http")
        ? user.avatarUrl
        : `${supabaseUrl}/storage/v1/object/public/avatars/${user.avatarUrl}`
      : null;

  return (
    <div className="text-text-main min-h-screen transition-colors">
      {/* Main Content */}
      <main className="max-w-3xl mx-auto md:px-6 py-6 pb-24 md:pb-6">
        {/* Header в стиле страницы карточек */}
        <PageHeader
          title="Profile"
          rightElement={
            <Link
              href="/dashboard/settingsProfile"
              className="w-9 h-9 rounded-full bg-icon-bg flex items-center justify-center text-text-main hover:opacity-80 transition-opacity"
            >
              <NavIcon name="settings" className="w-5 h-5" />
            </Link>
          }
        />
        {/* Profile Card */}
        <div className="bg-bg-card rounded-3xl p-6 mb-4 transition-colors">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              {/* 🌟 ДИНАМИЧЕСКАЯ АВАТАРКА */}
              {fullAvatarUrl && !imageError ? (
                // Если аватарка есть и загружается без ошибок — рендерим её
                <div className="w-20 h-20 rounded-full overflow-hidden ">
                  <img
                    src={fullAvatarUrl}
                    alt={username}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)} // Если ссылка битая, упадем в фолбек с буквой
                  />
                </div>
              ) : (
                // Фолбек: если аватарки нет, показываем красивую заглушку с первой буквой
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white">{shortUsername}</span>
                </div>
              )}

              {/* Кнопка камеры */}
              <Link
                href="/dashboard/settingsProfile"
                className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center   hover:bg-blue-700 transition-colors"
              >
                <Camera size={14} className="text-white" />
              </Link>
            </div>

            <div className="flex-1">
              <h2 className="text-xl mb-1">
                {!isAuthenticated ? (
                  <Skeleton className="w-24 h-5" />
                ) : (
                  <NumberPopIn value={username} />
                )}
              </h2>
              <span className="text-text-muted text-sm">
                <NumberPopIn value={email} />
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-xl mb-1 flex items-center justify-center gap-0.5">
                {isLoading ? (
                  "..."
                ) : (
                  <>
                    <span>₩</span>
                    <NumberPopIn
                      value={balance?.total.toLocaleString("ko-KR") ?? "0"}
                    />
                  </>
                )}
              </div>
              <div className="text-sm text-text-muted">Total Balance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">
                <NumberPopIn value={String(cardCount)} />
              </div>
              <div className="text-sm text-text-muted">Cards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">
                <NumberPopIn value={String(transactionCount)} />
              </div>
              <div className="text-sm text-text-muted">Transactions</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2 mb-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="flex items-center gap-4 bg-bg-card rounded-2xl p-4 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-bg-app rounded-xl flex items-center justify-center">
                <item.icon size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="mb-1">{item.label}</div>
                <div className="text-sm text-text-muted">
                  {item.description}
                </div>
              </div>
              <ChevronRight size={20} className="text-text-muted" />
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-red-600/10 border border-red-600/30 text-red-600 rounded-2xl py-4 hover:bg-red-600/20 transition-colors"
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </main>
    </div>
  );
}
