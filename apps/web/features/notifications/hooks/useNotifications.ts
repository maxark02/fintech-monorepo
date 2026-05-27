"use client";

import { useEffect, useState } from "react";
import { Notification } from "@fin/api-client";
import { getNotifications } from "../api/notificationsApi";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getNotifications()
      .then((data) => {
        setNotifications(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return { notifications, isLoading };
};
