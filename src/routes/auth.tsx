import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Lock, Mail } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — vrseoguru admin" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/auth" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const otpInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) navigate({ to: "/admin" });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  // Resend cooldown countdown
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  // Auto-focus the code input when the OTP step opens
  useEffect(() => {
    if (otpSent && otpInputRef.current) {
      const t = setTimeout(() => otpInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [otpSent]);

  function friendlyError(err: unknown, fallback: string): string {
    const msg = err instanceof Error ? err.message : String(err ?? "");
    const lower = msg.toLowerCase();
    if (lower.includes("rate limit") || lower.includes("too many"))
      return "Too many attempts. Please wait a minute and try again.";
    if (lower.includes("expired"))
      return "That code has expired. Tap “Resend code” to get a new one.";
    if (lower.includes("invalid") && lower.includes("otp"))
      return "That code doesn't match. Double-check the 6 digits and try again.";
    if (lower.includes("invalid login"))
      return "Email or password is incorrect.";
    if (lower.includes("not confirmed"))
      return "Your email isn't verified yet. Use the Email OTP tab to sign in.";
    if (lower.includes("network"))
      return "Network error. Check your connection and retry.";
    return msg || fallback;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err) {
      toast.error(friendlyError(err, "Authentication failed"));
    } finally {
      setBusy(false);
    }
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true, emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      setOtpSent(true);
      setResendIn(45);
      toast.success("We sent a 6-digit code to your email.");
    } catch (err) {
      toast.error(friendlyError(err, "Failed to send code"));
    } finally {
      setBusy(false);
    }
  }

  async function handleResendOtp() {
    if (resendIn > 0 || !email) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true, emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      setResendIn(45);
      setOtp("");
      toast.success("A new code is on its way.");
    } catch (err) {
      toast.error(friendlyError(err, "Couldn't resend code"));
    } finally {
      setBusy(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Enter all 6 digits of the code.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp.trim(),
        type: "email",
      });
      if (error) throw error;
      toast.success("Verified — signing you in…");
    } catch (err) {
      toast.error(friendlyError(err, "Invalid or expired code"));
      setOtp("");
      otpInputRef.current?.focus();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="min-h-[80vh] grid place-items-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>
        <div className="mt-6 rounded-2xl border border-border bg-card p-8">
          <h1 className="text-2xl font-display font-semibold">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage your site.</p>

          <div className="mt-6 inline-flex rounded-lg border border-border bg-secondary p-1 gap-1 w-full">
            <button
              type="button"
              onClick={() => { setMode("password"); setOtpSent(false); }}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors ${
                mode === "password" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Lock className="h-3.5 w-3.5" /> Password
            </button>
            <button
              type="button"
              onClick={() => { setMode("otp"); setOtpSent(false); }}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors ${
                mode === "otp" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="h-3.5 w-3.5" /> Email OTP
            </button>
          </div>

          {mode === "password" && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-accent transition-colors disabled:opacity-50"
            >
              {busy ? "Please wait…" : "Sign in"}
            </button>
          </form>
          )}

          {mode === "otp" && !otpSent && (
            <form onSubmit={handleSendOtp} className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                <p className="mt-1.5 text-[11px] text-muted-foreground">We'll email you a 6-digit verification code.</p>
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-accent transition-colors disabled:opacity-50"
              >
                {busy ? "Sending…" : "Send verification code"}
              </button>
            </form>
          )}

          {mode === "otp" && otpSent && (
            <form onSubmit={handleVerifyOtp} className="mt-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                Code sent to <span className="text-foreground font-medium">{email}</span>. Enter it below.
              </p>
              <div>
                <label className="text-xs text-muted-foreground">6-digit code</label>
                <input
                  ref={otpInputRef}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtp(v);
                  }}
                  onPaste={(e) => {
                    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                    if (text) {
                      e.preventDefault();
                      setOtp(text);
                    }
                  }}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-3 text-xl tracking-[0.5em] text-center font-mono"
                  placeholder="••••••"
                />
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Tip: paste the 6-digit code from your email.
                </p>
              </div>
              <button
                type="submit"
                disabled={busy || otp.length !== 6}
                className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-accent transition-colors disabled:opacity-50"
              >
                {busy ? "Verifying…" : "Verify & sign in"}
              </button>
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setOtp(""); setResendIn(0); }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Use a different email
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={busy || resendIn > 0}
                  className="text-primary hover:underline disabled:text-muted-foreground disabled:no-underline disabled:cursor-not-allowed"
                >
                  {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}