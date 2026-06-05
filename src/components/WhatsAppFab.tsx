import { MessageCircle } from "lucide-react";
import { track } from "@/lib/analytics";

const BUSINESS_WHATSAPP = "919999999999"; // E.164 without +
const DEFAULT_MSG = "Hi vrseoguru! I'd like to discuss a project.";

export function WhatsAppFab() {
  const href = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(DEFAULT_MSG)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      onClick={() => track("chatbot_interaction", { event_action: "wa_fab_click" })}
      className="fixed bottom-5 right-5 z-[60] h-14 w-14 rounded-full bg-[#25D366] text-white shadow-2xl grid place-items-center hover:scale-110 transition-transform print:hidden"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      <MessageCircle className="relative h-7 w-7" />
    </a>
  );
}