import { useEffect, useState } from "react";
import { X, Send, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import type { AuditPreview } from "@/lib/audit-preview.functions";

export type AuditValues = {
  name: string;
  email: string;
  phone: string;
  website: string;
  message: string;
};

const AUDIT_DRAFT_KEY = "auditFormDraft.v1";
const EMPTY_AUDIT: AuditValues = { name: "", email: "", phone: "", website: "", message: "" };

export function AuditPopup({
  open,
  onClose,
  onSubmitLead,
  onGeneratePreview,
  onViewFullResult,
}: {
  open: boolean;
  onClose: () => void;
  onSubmitLead: (values: AuditValues) => Promise<void>;
  onGeneratePreview: (values: AuditValues) => Promise<AuditPreview>;
  onViewFullResult: () => void;
}) {
  type Step = "form" | "submitting" | "analyzing" | "preview" | "preview_error";
  const [step, setStep] = useState<Step>("form");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>("");
  const [previewError, setPreviewError] = useState<string>("");
  const [preview, setPreview] = useState<AuditPreview | null>(null);
  const [values, setValues] = useState<AuditValues>(EMPTY_AUDIT);
  const [submittedValues, setSubmittedValues] = useState<AuditValues | null>(null);

  // Load draft on open
  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem(AUDIT_DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AuditValues>;
        setValues({ ...EMPTY_AUDIT, ...parsed });
      }
    } catch { /* ignore */ }
  }, [open]);

  // Persist draft on change while on the form
  useEffect(() => {
    if (!open || step !== "form") return;
    try {
      const isEmpty = !values.name && !values.email && !values.phone && !values.website && !values.message;
      if (isEmpty) localStorage.removeItem(AUDIT_DRAFT_KEY);
      else localStorage.setItem(AUDIT_DRAFT_KEY, JSON.stringify(values));
    } catch { /* ignore */ }
  }, [values, open, step]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setPreview(null);
      setStep("form");
      setErrors({});
      setServerError("");
      setPreviewError("");
      setSubmittedValues(null);
    }
  }, [open]);

  if (!open) return null;

  const schema = z.object({
    name: z.string().trim().min(2, "Enter your name").max(100),
    email: z.string().trim().email("Enter a valid email").max(255),
    phone: z.string().trim().min(6, "Enter a valid phone").max(40),
    website: z.string().trim().min(3, "Enter your website").max(255),
    message: z.string().trim().min(10, "Tell us a bit more").max(1000),
  });

  const setField = (k: keyof AuditValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((prev) => { const n = { ...prev }; delete n[k]; return n; });
  };

  const runPreview = async (v: AuditValues) => {
    setStep("analyzing");
    setPreviewError("");
    try {
      const result = await onGeneratePreview(v);
      setPreview(result);
      setStep("preview");
    } catch (err) {
      setPreviewError(err instanceof Error ? err.message : "Couldn't generate the AI preview.");
      setStep("preview_error");
    }
  };

  const handle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setServerError("");
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { const k = i.path[0] as string; if (!fe[k]) fe[k] = i.message; });
      setErrors(fe);
      return;
    }
    setStep("submitting");
    try {
      await onSubmitLead(parsed.data);
      setSubmittedValues(parsed.data);
      try { localStorage.removeItem(AUDIT_DRAFT_KEY); } catch { /* ignore */ }
      await runPreview(parsed.data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit. Please try again.";
      setServerError(msg);
      toast.error(msg);
      setStep("form");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-popup-title"
    >
      <div
        className="relative my-auto w-full max-w-lg rounded-[1.75rem] border border-border bg-card shadow-gold px-4 py-5 sm:p-6 md:p-7 max-h-[min(92vh,820px)] overflow-y-auto overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        {step === "preview" && preview ? (
          <AuditPreviewView preview={preview} name={submittedValues?.name ?? ""} onViewFullResult={onViewFullResult} />
        ) : step === "analyzing" ? (
          <AuditAnalyzingView />
        ) : step === "preview_error" ? (
          <AuditPreviewErrorView
            error={previewError}
            onRetry={() => submittedValues && runPreview(submittedValues)}
            onContinue={onViewFullResult}
          />
        ) : (
          <>
        <p className="pr-10 text-[11px] uppercase tracking-[0.18em] text-primary font-semibold">Free Website Audit</p>
        <h3 id="audit-popup-title" className="mt-1 pr-10 text-[clamp(1.75rem,5vw,2rem)] leading-tight font-display">Get a free website audit</h3>
        <p className="mt-1 pr-6 text-xs leading-relaxed text-muted-foreground">
          Tell us about your site — a senior strategist replies within one business day.
        </p>
        {serverError && (
          <div className="mt-3 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-500">
            <p className="font-semibold">Couldn't send your request.</p>
            <p className="mt-0.5 text-red-400">{serverError}</p>
            <p className="mt-1 text-[11px] text-red-400/80">Your details are saved — just press the button again to retry.</p>
          </div>
        )}
        <form onSubmit={handle} className="mt-4 space-y-3">
          <div>
            <input name="name" value={values.name} onChange={setField("name")} placeholder="Your name" className={`w-full rounded-xl bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-primary ${errors.name ? "border-red-400" : "border-border"}`} />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>
          <div>
            <input name="website" value={values.website} onChange={setField("website")} placeholder="Your website (e.g. example.com)" className={`w-full rounded-xl bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-primary ${errors.website ? "border-red-400" : "border-border"}`} />
            {errors.website && <p className="mt-1 text-xs text-red-500">{errors.website}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <input name="phone" value={values.phone} onChange={setField("phone")} placeholder="Phone number" className={`w-full rounded-xl bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-primary ${errors.phone ? "border-red-400" : "border-border"}`} />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>
            <div>
              <input name="email" type="email" value={values.email} onChange={setField("email")} placeholder="Email address" className={`w-full rounded-xl bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-primary ${errors.email ? "border-red-400" : "border-border"}`} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
          </div>
          <div>
            <textarea name="message" rows={3} value={values.message} onChange={setField("message")} placeholder="What would you like us to focus on?" className={`w-full rounded-xl bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none ${errors.message ? "border-red-400" : "border-border"}`} />
            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
          </div>
          <button
            type="submit"
            disabled={step === "submitting"}
            className="w-full inline-flex justify-center items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-60 shadow-gold"
          >
            {step === "submitting" ? "Sending..." : <>Request my free audit <Send className="h-4 w-4" /></>}
          </button>
          <p className="text-[11px] leading-relaxed text-muted-foreground text-center">🔒 Your details stay private. Your progress is auto-saved.</p>
        </form>
          </>
        )}
      </div>
    </div>
  );
}

function AuditAnalyzingView() {
  return (
    <div className="py-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-semibold">Analyzing</p>
          <h3 className="text-lg font-display">Running your AI audit preview…</h3>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Scanning common SEO, performance, conversion and AI-search signals.</p>
      {/* Skeleton */}
      <div className="mt-5 flex items-center gap-4 rounded-2xl border border-border bg-secondary/50 p-4">
        <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 rounded bg-muted animate-pulse" />
          <div className="h-3 w-full rounded bg-muted animate-pulse" />
          <div className="h-3 w-4/5 rounded bg-muted animate-pulse" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="h-3 w-24 rounded bg-muted animate-pulse" />
              <div className="h-3 w-12 rounded-full bg-muted animate-pulse" />
            </div>
            <div className="mt-2 h-3 w-full rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditPreviewErrorView({ error, onRetry, onContinue }: { error: string; onRetry: () => void; onContinue: () => void }) {
  return (
    <div className="py-4">
      <p className="text-xs uppercase tracking-[0.22em] text-amber-500 font-semibold">Preview unavailable</p>
      <h3 className="mt-1 text-xl font-display">We couldn't generate the AI preview.</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Your audit request was received — a senior strategist will still deliver your full audit within one business day.
      </p>
      <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-500">
        {error || "Temporary issue contacting the AI service."}
      </div>
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onRetry}
          className="flex-1 inline-flex justify-center items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition shadow-gold"
        >
          Retry preview
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="flex-1 inline-flex justify-center items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:border-primary transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function AuditPreviewView({ preview, name, onViewFullResult }: { preview: AuditPreview; name: string; onViewFullResult: () => void }) {
  const sevColor = (s: "high" | "medium" | "low") =>
    s === "high" ? "text-red-500 border-red-500/30 bg-red-500/10"
    : s === "medium" ? "text-amber-500 border-amber-500/30 bg-amber-500/10"
    : "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-primary font-semibold">AI audit preview</p>
      <h3 className="mt-1 text-2xl font-display">Thanks{name ? `, ${name.split(" ")[0]}` : ""} — here's an early look.</h3>
      <div className="mt-4 flex items-center gap-4 rounded-2xl border border-border bg-secondary/50 p-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-primary text-2xl font-display text-primary">
          {Math.round(preview.score)}
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Preliminary score</p>
          <p className="mt-0.5 text-sm text-foreground">{preview.summary}</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Key findings</p>
        <ul className="mt-2 space-y-2">
          {preview.findings.map((f, i) => (
            <li key={i} className="rounded-xl border border-border bg-card p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-foreground">{f.area}</span>
                <span className={`text-[10px] uppercase tracking-wider rounded-full border px-2 py-0.5 ${sevColor(f.severity)}`}>{f.severity}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{f.finding}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Recommended next actions</p>
        <ul className="mt-2 space-y-1.5">
          {preview.nextActions.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-foreground">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={onViewFullResult}
        className="mt-6 w-full inline-flex justify-center items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition shadow-gold"
      >
        View full audit details <ArrowRight className="h-4 w-4" />
      </button>
      <p className="mt-2 text-[11px] text-muted-foreground text-center">A senior strategist will email your complete audit within one business day.</p>
    </div>
  );
}
