"use client";

import { useEffect } from "react";
import { Notification } from "@fin/api-client";
import { useNotificationStore } from "./notificationStore";
import { formatKRW } from "@/lib/format";

const NAMES = ["Seo-yeon", "Min-jun", "Ji-ho", "Ha-eun", "Toss", "Coupang"];
const CITIES = ["Seoul, Korea", "Busan, Korea", "Tokyo, Japan", "Incheon, Korea"];

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)]!;
const amount = () => formatKRW(rand(10, 2000) * 100);

// Шаблоны случайных уведомлений
const TEMPLATES: Array<() => Pick<Notification, "title" | "message" | "type">> = [
  () => ({
    title: "Payment received",
    message: `You received ₩${amount()} from ${pick(NAMES)}`,
    type: "transaction",
  }),
  () => ({
    title: "Payment sent",
    message: `₩${amount()} sent to ${pick(NAMES)}`,
    type: "transaction",
  }),
  () => ({
    title: "Cashback earned",
    message: `You earned ₩${formatKRW(rand(5, 50) * 100)} cashback`,
    type: "promo",
  }),
  () => ({
    title: "Security alert",
    message: `New login from ${pick(CITIES)}`,
    type: "security",
  }),
  () => ({
    title: "Statement ready",
    message: "Your monthly statement is available",
    type: "system",
  }),
];

/**
 * Невидимый компонент: с случайным интервалом «присылает» уведомление.
 * Монтируется один раз в layout дашборда.
 */
export function NotificationSpawner() {
  const push = useNotificationStore((s) => s.push);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const schedule = (delay: number) => {
      timer = setTimeout(() => {
        const tpl = pick(TEMPLATES)();
        push({
          id: `n-${Date.now()}`,
          isRead: false,
          createdAt: new Date().toISOString(),
          ...tpl,
        });
        schedule(rand(12_000, 28_000)); // следующее через 12–28 c
      }, delay);
    };

    schedule(rand(5_000, 9_000)); // первое через 5–9 c
    return () => clearTimeout(timer);
  }, [push]);

  return null;
}
