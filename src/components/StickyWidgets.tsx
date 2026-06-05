import { useState, useRef, useEffect } from "react";
import { MessageCircle, Bot, X, Send } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { createLead } from "@/lib/leads.functions";
import { track } from "@/lib/analytics";
import { toast } from "sonner";

const BUSINESS_WHATSAPP = "919999999999"; // E.164 without +

type ChatMsg = { role: "user" | "agent"; text: string; ts: number };

export function StickyWidgets() {
  const submitLead = useServerFn(createLead);
  const [open, setOpen] = useState<null | "wa" | "ai">(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [log, setLog] = useState<ChatMsg[]>([
    { role: "agent", text: "Hi 👋 I'm your AI growth agent. Ask anything — SEO, ads, content, automation…", ts: Date.now() },
  ]);
  const [askContact, setAskContact] = useState(false);
  const [aiEmail, setAiEmail] = useState("");
  const [aiName, setAiName] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [log, askContact]);

  const routeLead = async (source: "wa_widget" | "sms_widget" | "ai_chat_widget", payload: {
    name: string; email?: string; phone?: string; message: string;
  }) => {
    try {
      await submitLead({
        data: {
          name: payload.name || "Anonymous visitor",
          email: payload.email || `noreply+${source}@vrseoguru.lead`,
          phone: payload.phone ?? "",
          service: source,
          budget: "",
          message: `[${source} • ${new Date().toISOString()}]\n${payload.message}`,
          kind: "inquiry",
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
          referrer: typeof document !== "undefined" ? document.referrer : "",
          utmSource: source,
          utmMedium: source.startsWith("wa") ? "whatsapp" : source.startsWith("sms") ? "sms" : "chat",
          utmCampaign: "sticky_widget",
        },
      });
    } catch (err) {
      console.warn("lead routing failed", err);
    }
  };

  const submitWA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !msg.trim()) {
      toast.error("Please fill name, phone and message");
      return;
    }
    setSending(true);
    track("lead_submit", { source: "wa_widget" });
    await routeLead("wa_widget", { name, phone, message: msg });
    const body = `Hi vrseoguru — I'm ${name} (${phone}). ${msg}`;
    window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(body)}`, "_blank");
    toast.success("Opening WhatsApp & routed to our CRM ✓");
    setSending(false);
    setOpen(null);
    setName(""); setPhone(""); setMsg("");
  };

  const sendChat = () => {
    const q = chatInput.trim();
    if (!q) return;
    track("chatbot_interaction", { event_action: "message_sent" });
    const userMsg: ChatMsg = { role: "user", text: q, ts: Date.now() };
    setLog((l) => [...l, userMsg]);
    setChatInput("");
    setTimeout(() => {
      const k = q.toLowerCase();
      const replies: Record<string, string> = {
        seo: "I'll run a 50-point SEO audit and ship a 90-day roadmap. Share your email to receive it.",
        ads: "I'll model your funnel and propose a Google + Meta test plan. Share your email to receive it.",
        content: "I'll build a topical map and a 30/60/90-day content calendar. Share your email to receive it.",
        whatsapp: "We can set up WhatsApp lifecycle journeys + lead routing. Share your email and a human will follow up.",
        sms: "Happy to design an SMS journey with opt-in compliance. Share your email and we'll send specs.",
      };
      const match = Object.keys(replies).find((kw) => k.includes(kw));
      const answer = match ? replies[match] : "Got it — I'll route this to a senior strategist. Share your email so we can reply within 24h.";
      setLog((l) => [...l, { role: "agent", text: answer, ts: Date.now() }]);
      setAskContact(true);
    }, 500);
  };

  const submitAiContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiEmail.trim()) { toast.error("Please share your email"); return; }
    setSending(true);
    track("lead_submit", { source: "ai_chat_widget" });
    const transcript = log.map((m) => `${m.role.toUpperCase()}: ${m.text}`).join("\n");
    await routeLead("ai_chat_widget", {
      name: aiName || "AI Chat visitor",
      email: aiEmail,
      message: `AI chat transcript:\n${transcript}`,
    });
    toast.success("Sent! A strategist will email you within 24h ✓");
    setLog((l) => [...l, { role: "agent", text: "Thanks! A strategist will email you within 24h. Anything else?", ts: Date.now() }]);
    setAskContact(false);
    setAiEmail(""); setAiName("");
    setSending(false);
  };

  return (
    <>
      {/* Floating action buttons */}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 print:hidden">
        {open === "wa" && (
          <div className="w-[88vw] max-w-sm rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in">
            <div className="flex items-center justify-between bg-[#25D366] px-4 py-3 text-white">
              <div className="flex items-center gap-2 font-semibold"><MessageCircle className="h-5 w-5" /> WhatsApp us</div>
              <button onClick={() => setOpen(null)} className="rounded p-1 hover:bg-white/20"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={submitWA} className="p-4 space-y-2">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (with country code)" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="How can we help?" rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <button type="submit" disabled={sending} className="w-full rounded-lg bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold py-2 text-sm transition-colors disabled:opacity-60">
                {sending ? "Sending…" : "Start WhatsApp chat"}
              </button>
              <p className="text-[10px] text-muted-foreground text-center">Routed to our CRM with timestamp & page source.</p>
            </form>
          </div>
        )}

        {open === "ai" && (
          <div className="w-[92vw] max-w-md rounded-2xl border border-primary/30 bg-card shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in">
            <div className="flex items-center justify-between bg-gradient-to-r from-primary to-primary/70 px-4 py-3 text-primary-foreground">
              <div className="flex items-center gap-2 font-semibold"><Bot className="h-5 w-5" /> AI Growth Agent</div>
              <button onClick={() => setOpen(null)} className="rounded p-1 hover:bg-white/20"><X className="h-4 w-4" /></button>
            </div>
            <div ref={scrollerRef} className="max-h-[55vh] min-h-[260px] overflow-y-auto p-3 space-y-2 bg-background/50">
              {log.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {askContact && (
                <form onSubmit={submitAiContact} className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2">
                  <p className="text-xs font-semibold text-foreground">📧 Share your email — we'll send a tailored plan</p>
                  <input value={aiName} onChange={(e) => setAiName(e.target.value)} placeholder="Name (optional)" className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs" />
                  <input value={aiEmail} onChange={(e) => setAiEmail(e.target.value)} type="email" required placeholder="you@company.com" className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs" />
                  <button type="submit" disabled={sending} className="w-full rounded-md bg-primary text-primary-foreground text-xs font-semibold py-1.5 hover:bg-primary/90 disabled:opacity-60">
                    {sending ? "Sending…" : "Send to strategist"}
                  </button>
                </form>
              )}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); sendChat(); }} className="flex items-center gap-2 border-t border-border bg-card p-2">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask about SEO, ads, content…" className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <button type="submit" className="rounded-lg bg-primary text-primary-foreground p-2 hover:bg-primary/90"><Send className="h-4 w-4" /></button>
            </form>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            type="button"
            aria-label="Chat on WhatsApp"
            onClick={() => { track("chatbot_interaction", { event_action: "wa_open" }); setOpen(open === "wa" ? null : "wa"); }}
            className="group relative h-14 w-14 rounded-full bg-[#25D366] text-white shadow-xl grid place-items-center hover:scale-110 transition-transform"
          >
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
            <MessageCircle className="relative h-7 w-7" />
          </button>
          <button
            type="button"
            aria-label="Open AI agent chat"
            onClick={() => { track("chatbot_interaction", { event_action: "ai_open" }); setOpen(open === "ai" ? null : "ai"); }}
            className="group relative h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-xl grid place-items-center hover:scale-110 transition-transform"
          >
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-background" />
            <Bot className="h-7 w-7" />
          </button>
        </div>
      </div>
    </>
  );
}