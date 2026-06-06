
## Goal

Make every home page section manageable from the admin panel, add a full Case Studies admin tab, and have the home "Every channel your brand needs to grow" grid driven by the existing Services (with a "show on home" flag).

## 1. Services on the home page (reuse existing)

- Add `show_on_home BOOLEAN DEFAULT true` to `services`.
- `/admin Services`: add a "Show on home" toggle on each row.
- Home "Every channel your brand needs to grow" section reads services where `show_on_home = true`, ordered by `sort_order`.

## 2. Case Studies admin (full)

- Already has a `case_studies` table; add a "Case Studies" tab in `/admin` with:
  - List with status (draft/published), featured toggle, sort order, view count, edit, delete.
  - Editor: title, slug, client, industry, tag, summary, cover image, hero stats, channels, challenge/approach/results, testimonial, SEO (meta_title, meta_description, og_image), status, featured.
- Home "Case Studies" section reads `published = true AND featured = true`, ordered by `sort_order`.
- New server functions: `listCaseStudiesAdmin`, `upsertCaseStudy`, `deleteCaseStudy`, `listFeaturedCaseStudies` (public for home).

## 3. Home Page CMS (every section)

New table `home_sections` (single row per section key) with:
- `key` (unique, e.g. `hero`, `channels`, `ai_stack`, `platforms`, `whatsapp`, `process`, `about`, `industries`, `tech_stack`, `workflow`, `results`, `case_studies`, `insights`, `testimonials`, `final_cta`)
- `enabled BOOLEAN`
- `sort_order INT`
- `title TEXT`, `subtitle TEXT`, `eyebrow TEXT`, `cta_label TEXT`, `cta_href TEXT`
- `content JSONB` — flexible bag for section-specific structured fields (e.g. hero stats, pillars, industries list, platform logos, process steps, testimonials list, workflow steps)
- timestamps + RLS (public read, editor/admin write)

Seed it with all current section values from `src/routes/index.tsx`.

New admin tab: **Home page**
- Left rail: list of sections (drag-to-reorder, eye toggle to show/hide).
- Right: per-section editor; common fields plus a JSON editor (with helper UIs for the structured ones — hero stats array, pillars array, industries array, platforms list, process steps, testimonials list, workflow steps).

`src/routes/index.tsx` is refactored to:
- Fetch `home_sections` + featured case studies + home services via one server fn (`getHomePageData`).
- Render sections in `sort_order`, skipping `enabled = false`.
- Each section component reads its `content` shape with safe fallbacks.

## Technical Notes

- Migrations:
  1. `ALTER TABLE services ADD COLUMN show_on_home BOOLEAN NOT NULL DEFAULT true;`
  2. `CREATE TABLE home_sections (...)`, grants, RLS, policies, trigger, seed all section keys.
- Files:
  - `src/lib/home-sections.functions.ts` — list/get/upsert/reorder, plus `getHomePageData`.
  - `src/lib/home-sections.shared.ts` — TS types + Zod schemas for each `content` shape.
  - `src/lib/case-studies.functions.ts` — extend with admin list/upsert/delete + `listFeaturedCaseStudies`.
  - `src/routes/_authenticated/admin.case-studies.tsx` — full editor page.
  - `src/routes/_authenticated/admin.home.tsx` — section list + per-section editor.
  - Update `src/routes/_authenticated/admin.index.tsx` — add `homepage` and `caseStudies` tabs, add "Show on home" toggle to services.
  - Refactor `src/routes/index.tsx` to consume `home_sections` + featured case studies.
- All admin writes go through `requireSupabaseAuth` and check admin/editor role.
- Default policy: public SELECT on `home_sections` and featured `case_studies`.

## Scope check

This is a large multi-file refactor. Confirming before I start.
