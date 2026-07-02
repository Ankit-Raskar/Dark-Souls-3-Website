# Dark Souls III — Companion Compendium

An immersive, AAA-quality, fully responsive fan-made companion experience for **Dark Souls III**, built with Next.js 16, TypeScript, Tailwind CSS v4, Framer Motion, and Lucide.

> *"Prepare to Die Once More."*

---

## ✦ Features

- **Cinematic hero** with parallax, fog, ash/ember particles, lightning, and a FromSoftware-style intro animation
- **Multi-page architecture** — each of the 21 sections is its own dedicated page with animated transitions, breadcrumbs, and page headers (navigated via a grouped mega-menu, not one long scroll)
- **Real game imagery** — bosses, characters, areas, and the gallery display real Dark Souls III images sourced from the web (with procedural SVG fallbacks)
- **Seamless looping theme music** — supply your own licensed track at `public/audio/ds3-ambient.mp3` (a placeholder main theme is included)
- **Custom ember cursor** (spring-lagged glow + trailing sparks)
- **Ambient music player** (fade in/out, volume, mute — supply your own licensed track at `public/audio/ds3-ambient.mp3`)
- **WebAudio-synthesized sound effects** (hover, click, sword unsheathe, bonfire, crackle, menu, boss roar) — toggleable
- **21 sections** of real, verified Dark Souls III data:
  - Story (6 chapters + 4 endings) · Lore (12 tomes) · Characters (22) · Bosses (27) · Areas (24) · Weapons (60) · Armor (25) · Rings (45) · Magic (53 spells) · NPCs (21, with questline tracker) · Covenants (8) · Enemies (32) · DLC (Ashes of Ariandel + The Ringed City) · Gallery (masonry + lightbox) · Videos (YouTube embeds) · Interactive SVG world map (zoom/pan/markers) · Timeline · Build Calculator · Dispatches · Community
- **Grouped mega-menu navbar** (8 groups: Tale / Bestiary / Arsenal / Inhabitants / Expansions / Media / Tools / Community) with animated underline, mobile overlay, transparent→solid on scroll
- **Sticky footer**, global ⌘K search across ~290 entries
- Ember-themed scrollbar, gold shimmer headings, parchment surfaces
- Accessibility: ARIA labels, keyboard navigation, `prefers-reduced-motion` support
- Dark mode by default (Dark Souls aesthetic)

---

## ✦ Tech Stack

| Layer        | Tech                                                        |
| ------------ | ---------------------------------------------------------- |
| Framework    | Next.js 16 (App Router, Turbopack)                         |
| Language     | TypeScript 5 (strict)                                      |
| Styling      | Tailwind CSS 4 + shadcn/ui (New York) + tw-animate-css     |
| Animation    | Framer Motion 12                                           |
| Icons        | lucide-react                                               |
| State        | Zustand (+ persist middleware)                             |
| Fonts        | Cinzel, Cinzel Decorative, EB Garamond (Google Fonts)      |
| Package Mgr  | Bun (recommended)                                          |

---

## ✦ Getting Started

### 1. Install dependencies

```bash
bun install
# or
npm install
```

### 2. Run the dev server

```bash
bun run dev
```

Open <http://localhost:3000> in your browser.

### 3. (Optional) Database

The project includes Prisma (SQLite). If you extend the data model:

```bash
bun run db:push      # push schema to SQLite
bun run db:generate  # regenerate Prisma client
```

### 4. Lint

```bash
bun run lint
```

---

## ✦ Deployment

### Deploy to Vercel (recommended — free tier)

This is a standard **Next.js 16 App Router** app — Vercel is the natural host
(Vercel makes Next.js). Deploy from GitHub in ~3 minutes:

**1. Push to GitHub**
```bash
git init
git add .
git commit -m "Dark Souls III companion"
git branch -M main
git remote add origin https://github.com/<your-username>/dark-souls-3.git
git push -u origin main
```

**2. Import on Vercel**
1. Go to <https://vercel.com/new> → sign in with GitHub.
2. Click **Import Git Repository** → select your `dark-souls-3` repo.
3. Vercel auto-detects Next.js + Bun. Settings to confirm:
   - **Framework Preset:** Next.js
   - **Install Command:** `bun install` (auto-detected from `bun.lock`)
   - **Build Command:** `next build` (from `vercel.json`)
4. **Environment Variables** → add:
   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | `file:./dev.db` |
   *(The site doesn't use the DB at runtime, but Prisma needs a value at build time.)*
5. Click **Deploy**. Your site goes live at `your-project.vercel.app` in ~2–4 min.

**3. Custom domain (optional)**
Vercel dashboard → **Settings → Domains** → add your domain. HTTPS is auto-provisioned.

> **Note:** `next.config.ts` conditionally enables `output: "standalone"` only
> outside Vercel (detected via the `VERCEL` env var), so the same codebase runs
> identically in this sandbox, on a VPS, and on Vercel.

### Other hosts

| Host | Notes |
|------|-------|
| **Netlify** | Next.js supported via `@netlify/plugin-nextjs` |
| **Cloudflare Pages** | Use `@cloudflare/next-on-pages` adapter |
| **Railway / Render** | Good if you later want the Prisma DB to persist (add a persistent disk) |
| **Self-host (VPS)** | `bun run build && bun run start` behind nginx/Caddy — `output: "standalone"` is pre-configured |

---

## ✦ Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (medieval fonts, metadata, dark theme)
│   │   ├── page.tsx            # Single-page experience (assembles all 21 sections)
│   │   └── globals.css         # Dark Souls III theme, animations, scrollbar
│   ├── components/
│   │   ├── ds3/                # All custom DS3 components
│   │   │   ├── Hero.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── EmberCursor.tsx
│   │   │   ├── AshField.tsx
│   │   │   ├── FogLayer.tsx
│   │   │   ├── CinematicIntro.tsx
│   │   │   ├── MusicPlayer.tsx
│   │   │   ├── SoundManager.tsx
│   │   │   ├── SearchModal.tsx
│   │   │   ├── DetailDialog.tsx
│   │   │   ├── OrnamentHeading.tsx
│   │   │   ├── SectionReveal.tsx
│   │   │   ├── BonfireLoader.tsx
│   │   │   ├── useDS3Store.ts          # Zustand store
│   │   │   ├── primitives.tsx          # SectionShell, ParchmentCard, Tag, StatLine
│   │   │   └── sections/               # 20 section components
│   │   └── ui/                 # shadcn/ui components (pre-installed)
│   ├── data/
│   │   └── ds3/                # Strongly-typed DS3 data layer (19 files)
│   │       ├── index.ts        # Barrel export
│   │       ├── types.ts        # Shared interfaces
│   │       ├── bosses.ts       # 27 bosses
│   │       ├── characters.ts   # 22 characters
│   │       ├── weapons.ts      # 60 weapons
│   │       ├── armor.ts        # 25 armor sets
│   │       ├── rings.ts        # 45 rings
│   │       ├── magic.ts        # 53 spells
│   │       ├── npcs.ts         # 21 NPCs
│   │       ├── covenants.ts    # 8 covenants
│   │       ├── enemies.ts      # 32 enemies
│   │       ├── areas.ts        # 24 areas
│   │       ├── dlc.ts          # 2 DLCs
│   │       ├── lore.ts         # 12 lore articles
│   │       ├── story.ts        # 6 story chapters
│   │       ├── timeline.ts     # 14 timeline events
│   │       ├── gallery.ts      # 16 gallery items
│   │       ├── videos.ts       # 8 videos
│   │       └── buildClasses.ts # 9 starting classes
│   ├── hooks/
│   └── lib/
│       ├── db.ts               # Prisma client
│       └── utils.ts            # cn() helper
├── public/
│   ├── hero-bg.png             # AI-generated cinematic background
│   ├── logo.svg
│   └── robots.txt
├── prisma/
│   └── schema.prisma
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## ✦ Customizing the Atmosphere

### Supply your own licensed music

Place a seamless-looping track at:

```
public/audio/ds3-ambient.mp3
```

The `MusicPlayer` component will pick it up automatically.

### Replace the procedural art with licensed assets

The boss portraits, character avatars, weapon icons, armor crests, ring glyphs, enemy glyphs, gallery tiles, and map are all **procedurally generated via SVG** so no copyrighted images are bundled. To use real artwork, replace the corresponding `<BossArt>`, `<ArmorCrest>`, `<RingGlyph>`, `<EnemyGlyph>`, `<GalleryTile>` components in `src/components/ds3/sections/`.

### Tweak the theme

All colors, animations, and surfaces live in `src/app/globals.css` under the `:root` block and the keyframe section. Key tokens:

- `--color-ember` `#ff7a18`
- `--color-ember-deep` `#c2410c`
- `--color-blood` `#8b0000`
- `--color-gold` `#c5a059`
- `--color-gold-bright` `#e8c878`
- `--color-charcoal` `#161311`
- `--color-soot` `#0a0807`

---

## ✦ Keyboard Shortcuts

| Shortcut | Action                          |
| -------- | ------------------------------ |
| `⌘K` / `Ctrl+K` | Open global search      |
| `Esc`    | Close modal / search / menu    |
| `Tab`    | Navigate interactive elements  |

---

## ✦ Legal Disclaimer

**Dark Souls III** and all related names, characters, imagery, and audio are trademarks and copyrights of **FromSoftware, Inc.** and **Bandai Namco Entertainment Inc.**

This is an **unofficial, non-commercial fan project** created for educational and informational purposes only.

- ❌ No copyrighted images are bundled — all artwork is procedurally generated (SVG) or AI-generated generic dark-fantasy.
- ❌ No copyrighted audio is bundled — the music path is a placeholder for the owner's licensed track.
- ✅ Official trailers are embedded from authorized video platforms (YouTube nocookie).
- ✅ All lore, stats, and data are publicly known game information.

All trademarks are the property of their respective owners.

---

## ✦ Credits

Forged with ash and ember. Built with Next.js · Tailwind CSS · Framer Motion · Lucide.

*"Don't you dare go hollow."*
