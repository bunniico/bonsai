# 盆栽 Bonsai — The Artist's Tech Tree

> AI-Generation Notice: This repository is almost entirely AI-generated! The code is not fully human-verified or tested (yet). This is a PROOF OF CONCEPT.

A gamified web app for learning digital art from near-zero to competent
generalist, built on the research plan in *The Artist's Tech Tree*. The full
curriculum — 44 nodes across 8 branches with prerequisites, verifiable
completion criteria, XP values, and cited resources — is rendered as a
living skill tree you climb from the soil up.

## Why bonsai?

1. **Cultivation, patience, perfection.** A bonsai is not grown, it is
   *kept* — shaped deliberately over years. So is an art practice.
2. **Branches.** The curriculum is a branching DAG of micro-lessons; the
   app draws it as a tree that grows upward from roots (fundamentals) to
   canopy (capstone illustrations).
3. **Bonsai keeping is itself an artform** — the theme is the thesis.

## Features

- **Skill tree** — the complete curriculum DAG, roots at the bottom,
  capstones at the top. Nodes unlock when their prerequisites are complete
  (including "any N of" groups, drawn as dashed edges). Click any node for
  its description, completion criteria, prerequisites, XP, and resources.
- **XP & levels** — XP is awarded only for meeting a node's concrete
  completion criteria (≈100 XP per 10 focused hours). Levels follow the
  traditional bonsai size classes: Seed → Sprout → Seedling → Shito → Mame
  → Shohin → Komono → Chumono → Omono → Imperial → Yamadori.
- **A bonsai that grows with you** — the sidebar tree gains trunk, branches,
  foliage pads, and finally blossoms as you level.
- **Achievements** — badges for branch completions, XP milestones, and
  building your gallery, with toast notifications.
- **Attach your art to nodes** — upload images alongside completed nodes.
  With Google Drive connected they're uploaded to a
  "Bonsai — Art Journey" folder in your Drive; without it they're stored
  locally in your browser (IndexedDB). Both display as thumbnails on the
  node.
- **Content settings** — the adult-education track (complete anatomy,
  figure interaction, gore studies, and the mature capstone) is hidden by
  default and can be enabled in Settings. The rest of the tree re-routes
  around hidden nodes so nothing dead-ends.
- **Your data is yours** — progress lives in `localStorage`; export/import
  it as JSON from Settings.

## Running it

```bash
npm install
npm run dev      # local dev server
npm run build    # static production build in dist/
```

The build is a fully static site — host it on GitHub Pages, Netlify, or
anywhere that serves files.

## Google Drive setup (optional, ~5 minutes)

The app is static and has no backend, so you bring your own OAuth client ID
(client IDs are public by design; the app uses the `drive.file` scope, which
only lets it see files it created itself).

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and
   create (or pick) a project.
2. **APIs & Services → Library** → enable the **Google Drive API**.
3. **APIs & Services → OAuth consent screen** → configure an External app,
   add yourself as a test user.
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   → type **Web application** → add your app's origin (e.g.
   `http://localhost:5173` for dev) to **Authorized JavaScript origins**.
5. Copy the client ID into **Settings** in the app, then click
   **Connect Drive** in the header.

## The curriculum

The tree implements the research document's 39-node specification, plus a
post-capstone mastery branch for advanced rendering and camera work:

| Branch | Theme | Nodes |
|---|---|---|
| A | Core Fundamentals — line, perspective, form, value, color, composition | 6 |
| B | Digital Craft — software, brushes, tablet control, rendering workflow | 4 |
| C | Figure & Anatomy — gesture through complete anatomy and interaction | 9 |
| D | Character Design — shape language, costume, style, model sheets | 4 |
| E | Creatures & Non-Humans — animals, anthro, monsters, mechs | 4 |
| F | Environments — perspective, nature studies, hard surface, scenes | 7 |
| G | Advanced / Capstone — finished portfolio illustrations | 5 |
| H | Mastery: Light & Lens — specular materials, colored light, curved mirrors, curvilinear perspective | 5 |

Curriculum data lives in [`src/data/curriculum.ts`](src/data/curriculum.ts)
— nodes are plain objects, so adjusting XP, splitting nodes, or adding
resources is an edit away.

**The 50% rule** (from Drawabox, baked into the sidebar): at least half of
all drawing time is self-directed play, not study. XP tracks the studying
half; the playing half is where skills take root.
