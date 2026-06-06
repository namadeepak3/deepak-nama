import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listServices } from "@/lib/services.functions";
import { iconFor } from "@/lib/services.shared";
import { Menu, X, ChevronDown, ArrowRight, Mail, Github, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";
import { WhatsAppFab } from "@/components/WhatsAppFab";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "vrseoguru — AI-Powered Digital Marketing" },
      { name: "description", content: "Freelance AI-driven SEO, PPC, performance marketing and SMO services that compound results." },
      { name: "author", content: "vrseoguru" },
      { property: "og:title", content: "vrseoguru — AI-Powered Digital Marketing" },
      { property: "og:description", content: "Freelance AI-driven SEO, PPC, performance marketing and SMO services that compound results." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "vrseoguru — AI-Powered Digital Marketing" },
      { name: "twitter:description", content: "Freelance AI-driven SEO, PPC, performance marketing and SMO services that compound results." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c43fc0c3-5275-4f4c-9dbc-2707fd8d78ff/id-preview-c02c2699--afc8d152-a67e-4bce-810b-0e4adf0e6c1a.lovable.app-1780582325022.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c43fc0c3-5275-4f4c-9dbc-2707fd8d78ff/id-preview-c02c2699--afc8d152-a67e-4bce-810b-0e4adf0e6c1a.lovable.app-1780582325022.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteShell />
    </QueryClientProvider>
  );
}

function SiteShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {!isAdmin && <SiteHeader />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAdmin && <SiteFooter />}
      {!isAdmin && <WhatsAppFab />}
    </div>
  );
}

function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLink = "text-sm text-foreground/70 hover:text-foreground transition-colors";
  const fetchServices = useServerFn(listServices);
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: () => fetchServices() });

  return (
    <header className="sticky top-0 z-50">
      {/* Top announcement bar */}
      <div className="bg-ink text-white text-xs">
        <div className="mx-auto max-w-7xl px-6 h-10 flex items-center justify-center gap-2 text-center">
          <span className="h-2 w-2 rounded-full bg-primary inline-block animate-pulse" />
          <span className="font-medium">vrseoguru AI Ops is live. Build automations with ChatGPT, Claude, n8n, Zapier &amp; more.</span>
          <Link to="/services" className="hidden sm:inline-flex items-center gap-1 text-primary font-semibold hover:underline">
            Explore plan <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Floating pill nav */}
      <div className="bg-background/80 backdrop-blur-xl py-3 px-3 sm:px-6 border-b border-border/40">
        <div className="mx-auto max-w-7xl rounded-full bg-card border border-border shadow-[0_8px_30px_rgb(0,0,0,0.06)] pl-5 pr-2 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-bold tracking-tight">
            <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs shadow-gold">V</span>
            <span className="text-foreground text-base">vrseoguru</span>
          </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <Link to="/" className={`${navLink} px-3 py-2`} activeOptions={{ exact: true }} activeProps={{ className: "text-foreground font-semibold" }}>Home</Link>

          {/* Mega menu trigger */}
          <div className="relative group">
            <button className={`${navLink} px-3 py-2 inline-flex items-center gap-1`}>
              Services <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
            </button>
            {/* Invisible bridge to prevent hover gap */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full h-3 w-[900px] hidden group-hover:block" aria-hidden />
            <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+0.5rem)] w-[900px] max-w-[90vw] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 translate-y-1 group-hover:translate-y-0">
              <div className="rounded-2xl border border-border bg-white text-foreground backdrop-blur-xl shadow-2xl p-6 grid grid-cols-3 gap-2">
                {services.map((s) => {
                  const Icon = iconFor(s.icon);
                  return (
                    <Link
                      key={s.slug}
                      to="/services/$slug"
                      params={{ slug: s.slug }}
                      className="group/item flex gap-3 rounded-xl p-3 hover:bg-secondary transition-colors"
                    >
                      <div className="h-9 w-9 shrink-0 rounded-lg bg-ink/10 border border-ink/20 grid place-items-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{s.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{s.shortDesc}</p>
                      </div>
                    </Link>
                  );
                })}
                <div className="col-span-3 mt-2 pt-4 border-t border-border flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">All AI-powered. All measurable.</p>
                  <Link to="/services" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                    View all services <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link to="/about" className={`${navLink} px-3 py-2`} activeProps={{ className: "text-foreground font-semibold" }}>About</Link>
          <Link to="/case-studies" className={`${navLink} px-3 py-2`} activeProps={{ className: "text-foreground font-semibold" }}>Case Studies</Link>
          <Link to="/blog" className={`${navLink} px-3 py-2`} activeProps={{ className: "text-foreground font-semibold" }}>Blog</Link>
          <Link to="/contact" className={`${navLink} px-3 py-2`} activeProps={{ className: "text-foreground font-semibold" }}>Contact</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/contact" className="hidden md:inline-flex items-center text-sm text-foreground/70 hover:text-foreground px-3">
            Book a demo
          </Link>
          <span className="hidden md:inline-block h-5 w-px bg-border" aria-hidden />
          <Link to="/auth" className="hidden md:inline-flex items-center text-sm text-foreground/70 hover:text-foreground px-2">
            Sign in
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 sm:px-5 h-10 text-sm font-semibold hover:opacity-90 shadow-gold transition-opacity"
          >
            Start free trial <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden h-10 w-10 rounded-full border border-border grid place-items-center text-foreground ml-1"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card text-foreground backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-6 py-4 space-y-1">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2">Home</Link>
            <details className="group">
              <summary className="flex items-center justify-between py-2 cursor-pointer list-none">
                <span>Services</span>
                <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="pl-3 mt-1 space-y-1 border-l border-border ml-1">
                <Link to="/services" onClick={() => setMobileOpen(false)} className="block py-2 text-sm">All services</Link>
                {services.map((s) => (
                  <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-foreground/70 hover:text-foreground">
                    {s.title}
                  </Link>
                ))}
              </div>
            </details>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="block py-2">About</Link>
            <Link to="/case-studies" onClick={() => setMobileOpen(false)} className="block py-2">Case Studies</Link>
            <Link to="/blog" onClick={() => setMobileOpen(false)} className="block py-2">Blog</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="block py-2">Contact</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">
              Start free trial <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function SiteFooter() {
  const fetchServices = useServerFn(listServices);
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: () => fetchServices() });
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <Link to="/" className="flex items-center gap-2 font-display font-bold tracking-tight">
              <span className="h-8 w-8 rounded-md bg-white text-ink grid place-items-center text-xs">V</span>
              <span className="text-white text-lg">vrseoguru</span>
            </Link>
            <p className="mt-4 text-sm text-white/70 max-w-xs leading-relaxed">
              Freelance AI-powered digital marketing — SEO, PPC, performance marketing and beyond.
            </p>
            <div className="mt-6 flex gap-2">
              <a href="mailto:hello@vrseoguru.com" className="h-9 w-9 rounded-md border border-white/20 grid place-items-center text-white/70 hover:text-white hover:border-white transition-colors"><Mail className="h-4 w-4" /></a>
              <a href="#" aria-label="LinkedIn" className="h-9 w-9 rounded-md border border-white/20 grid place-items-center text-white/70 hover:text-white hover:border-white transition-colors"><Linkedin className="h-4 w-4" /></a>
              <a href="#" aria-label="Twitter" className="h-9 w-9 rounded-md border border-white/20 grid place-items-center text-white/70 hover:text-white hover:border-white transition-colors"><Twitter className="h-4 w-4" /></a>
              <a href="#" aria-label="GitHub" className="h-9 w-9 rounded-md border border-white/20 grid place-items-center text-white/70 hover:text-white hover:border-white transition-colors"><Github className="h-4 w-4" /></a>
            </div>
          </div>
          <div className="md:col-span-5 grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/60 mb-4">Services</p>
              <ul className="space-y-2 text-sm">
                {services.slice(0, Math.ceil(services.length / 2)).map((s) => (
                  <li key={s.slug}>
                    <Link to="/services/$slug" params={{ slug: s.slug }} className="text-white/70 hover:text-white transition-colors">{s.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/60 mb-4">More</p>
              <ul className="space-y-2 text-sm">
                {services.slice(Math.ceil(services.length / 2)).map((s) => (
                  <li key={s.slug}>
                    <Link to="/services/$slug" params={{ slug: s.slug }} className="text-white/70 hover:text-white transition-colors">{s.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-widest text-white/60 mb-4">Company</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-white/70 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/services" className="text-white/70 hover:text-white transition-colors">All services</Link></li>
              <li><Link to="/blog" className="text-white/70 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/case-studies" className="text-white/70 hover:text-white transition-colors">Case Studies</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p>© {new Date().getFullYear()} vrseoguru. Crafted with AI &amp; obsession.</p>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link to="/faqs" className="hover:text-white transition-colors">FAQs</Link>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
