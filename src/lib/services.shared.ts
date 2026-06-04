import {
  Search,
  BarChart3,
  Share2,
  Megaphone,
  Bot,
  TrendingUp,
  Mail,
  Code2,
  Sparkles,
  Zap,
  Globe,
  Rocket,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

export type Tier = {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  highlighted?: boolean;
};

export type ProcessStep = { step: string; detail: string };
export type FAQ = { q: string; a: string };

export type Service = {
  id: string;
  slug: string;
  title: string;
  tag: string;
  icon: string;
  shortDesc: string;
  intro: string;
  aiAngle: string;
  deliverables: string[];
  process: ProcessStep[];
  faqs: FAQ[];
  tiers: Tier[];
  sortOrder: number;
};

export const ICON_MAP: Record<string, LucideIcon> = {
  Search,
  ChartColumn: BarChart3,
  BarChart3,
  Share2,
  Megaphone,
  Bot,
  TrendingUp,
  Mail,
  Code2,
  Sparkles,
  Zap,
  Globe,
  Rocket,
  Target,
  Users,
};

export const ICON_OPTIONS = Object.keys(ICON_MAP);

export function iconFor(name: string): LucideIcon {
  return ICON_MAP[name] ?? Sparkles;
}

export type ServiceRow = {
  id: string;
  slug: string;
  title: string;
  tag: string;
  icon: string;
  short_desc: string;
  intro: string;
  ai_angle: string;
  deliverables: unknown;
  process: unknown;
  faqs: unknown;
  tiers: unknown;
  sort_order: number;
};

export function mapRow(row: ServiceRow): Service {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tag: row.tag,
    icon: row.icon,
    shortDesc: row.short_desc,
    intro: row.intro,
    aiAngle: row.ai_angle,
    deliverables: (row.deliverables as string[]) ?? [],
    process: (row.process as ProcessStep[]) ?? [],
    faqs: (row.faqs as FAQ[]) ?? [],
    tiers: (row.tiers as Tier[]) ?? [],
    sortOrder: row.sort_order,
  };
}