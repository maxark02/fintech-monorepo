import { Notification } from "@fin/api-client";

export const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Payment received",
    message: "You received ₩3,200,000 from Toss",
    type: "transaction",
    isRead: false,
    createdAt: "2026-05-14T10:00:00Z",
  },
  {
    id: "2",
    title: "Security alert",
    message: "New login from Seoul, Korea",
    type: "security",
    isRead: false,
    createdAt: "2026-05-13T15:30:00Z",
  },
  {
    id: "3",
    title: "Cashback earned",
    message: "You earned ₩1,000 cashback",
    type: "promo",
    isRead: true,
    createdAt: "2026-05-12T09:00:00Z",
  },
];
