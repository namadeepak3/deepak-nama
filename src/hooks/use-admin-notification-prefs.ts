import { useEffect, useState } from "react";

export type AdminNotificationPrefs = {
  enabled: boolean;
  autoFocusMode: "off" | "first" | "always";
  soundEnabled: boolean;
};

const KEY = "admin.notificationPrefs.v1";
const DEFAULTS: AdminNotificationPrefs = {
  enabled: true,
  autoFocusMode: "off",
  soundEnabled: false,
};

function read(): AdminNotificationPrefs {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export function useAdminNotificationPrefs() {
  const [prefs, setPrefs] = useState<AdminNotificationPrefs>(DEFAULTS);

  useEffect(() => {
    setPrefs(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setPrefs(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = (patch: Partial<AdminNotificationPrefs>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  return { prefs, update };
}