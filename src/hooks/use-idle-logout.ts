import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Signs the user out and redirects to /auth after `timeoutMs` of inactivity.
 * Activity = mouse, keyboard, touch, scroll, or tab becoming visible.
 */
export function useIdleLogout(timeoutMs: number = 10 * 60 * 1000) {
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    if (typeof window === "undefined") return;
    let timer: ReturnType<typeof setTimeout>;

    const logout = async () => {
      try {
        await qc.cancelQueries();
        qc.clear();
        await supabase.auth.signOut();
      } finally {
        toast.message("Signed out due to inactivity");
        navigate({ to: "/auth", replace: true });
      }
    };

    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(logout, timeoutMs);
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "wheel"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    const onVisibility = () => { if (document.visibilityState === "visible") reset(); };
    document.addEventListener("visibilitychange", onVisibility);
    reset();

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [navigate, qc, timeoutMs]);
}