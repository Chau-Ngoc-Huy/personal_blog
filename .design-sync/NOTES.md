# design-sync notes — Personal Blog Design System

## What this sync is
This repo is a **Next.js blog application**, not a packaged design-system library
(no `dist/`, no Storybook, `package.json` is `private` with no exports). The sync
is therefore **off-script**: it scopes to the 12 presentational components under
`components/public/` plus the Tailwind "ali" token theme, and adapts them off
Next.js so the claude.ai/design agent can build on-brand pages with them.

Project: **Personal Blog Design System** — `23bc2e10-17ce-4911-a348-7fe1e206b147`.

## How the bundle is produced (off-script `--entry`)
The converter cannot bundle the raw `.tsx` directly (repo `tsconfig.json` is
`jsx: "preserve"`, and components are `export default` which `export *` drops).
So `cfg.buildCmd` (`node .design-sync/ds-src/build-ds.mjs`) pre-compiles a clean
entry that the converter consumes via `cfg.entry`:

- `.design-sync/ds-src/index.tsx` — barrel with **named** re-exports of the 12
  components (so they land on `window.PersonalBlog.*`).
- esbuild bundles it: `format=esm`, `jsx=automatic`, **React external**,
  `next/link` + `next/image` aliased to `./stubs/*` via `tsconfig.ds.json` paths.
  Output `dist/index.mjs` imports only `react` / `react/jsx-runtime` (the
  converter's reactShim maps those to `window.React`).
- `build-ds.mjs` also compiles the stylesheet (`ds-styles.css`) via the repo's
  Tailwind (`tailwind.ds.ts` reuses the `ali` theme, content-scoped to
  `components/public` + `.design-sync/previews` + `.design-sync/ds-src`), then
  prepends a Google Fonts `@import` for Inter + DM Serif Display.

**`dist/index.mjs` and `ds-styles.css` are gitignored** (regenerated). On every
sync, run `cfg.buildCmd` BEFORE the converter / driver — the driver does NOT run
`buildCmd` itself.

## Components scoped in (12, all group `public`)
AboutSection, AuthorBox, BlogsSection, HelpCardsSection, HeroSection, Navbar,
PostContent, PostHeader, SiteFooter, SocialIcon, SocialLinkIcon, TableOfContents.
Admin components (`components/admin/*`) and data-coupled screens are intentionally
excluded — not design-system material.

## Adaptations / gotchas
- `next/link` → plain `<a>` stub (`.design-sync/ds-src/stubs/next-link.tsx`),
  strips Next-only props. The runtime has no Next router; this is the only Next
  coupling in the public components.
- `@/lib/utils` (formatDate, Heading type) and `@/lib/social-links` are pure and
  bundle cleanly; resolved via the `@/*` tsconfig path.
- `.d.ts` props are hand-written in `cfg.dtsPropsFor` (no shipped types). If a
  component's real prop shape changes, update `dtsPropsFor` to match.
- Fonts load via a **remote** Google Fonts `@import` → expect `[FONT_REMOTE]`
  from validate (informational, not a failure). The host app self-hosts the same
  families via `next/font`.
- `TableOfContents` is `hidden xl:block` and returns null with no headings — its
  preview needs a wide viewport and real headings to render visibly.
- `PostContent` renders article HTML into `.prose-content` (styled in the
  bundle CSS) via `dangerouslySetInnerHTML` — previews pass real HTML strings.

## Known render warns
- `[FONT_REMOTE]` for "Inter", "DM Serif Display", "Cascadia Code" — expected
  (remote Google Fonts `@import`); not a failure.
- `tokens: … (1 missing, below threshold)` — one `var(--*)` referenced by a
  component CSS isn't defined; below the validate threshold, non-blocking.
- All 12 components authored; 24 preview cells graded `good` on the first pass.

## Component composition notes (for future authoring / re-sync)
- `socialLinks` shape differs by component: **AboutSection** and **SiteFooter**
  take a JSON **string** (`JSON.stringify({youtube:…})`); **AuthorBox** takes a
  plain **`Record<string,string>`** object. Easy to mix up.
- Valid social keys come from `lib/social-links.ts`: youtube, instagram,
  linkedin, tiktok, x, facebook. `email` is NOT a valid AuthorBox/About/Footer
  social key, but `name="email"` IS valid for **SocialIcon/SocialLinkIcon**.
- **HelpCardsSection** only renders tags with `_count.posts > 0` and slices to the
  first 6; heading copy ("Browse by topic / How Can I Help You?") is fixed.
- **SocialLinkIcon** is an invisible leaf without a chip `className` — previews
  pass `inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#ECE5E1] text-[#060C39]`.
- **PostContent**: `.prose-content` styling covers h1-3/p/ul/ol/li/blockquote/
  code/pre/a/strong; heading `id`s in the HTML must match `headings[]` for the
  TOC. `avatar: null` / `coverImage: null` render deterministic fallbacks
  (initials / gradient) — previews avoid external image URLs.

## Re-sync risks (watch-list)
- **buildCmd must run first** — `dist/index.mjs` and `ds-styles.css` are
  gitignored; a re-sync that skips `node .design-sync/ds-src/build-ds.mjs` runs
  the converter against a stale/missing entry.
- **Source drift**: the components live in the app (`components/public/`), so app
  refactors can change their props/markup. `cfg.dtsPropsFor` is hand-maintained
  and will silently go stale — re-check it against the sources on re-sync.
- **Remote fonts**: the Google Fonts `@import` is a network dependency; if it's
  unavailable the bundle falls back to Inter/Georgia system fonts.
- **Tailwind content scan**: preview-only utility classes are picked up only if
  they appear under the `tailwind.ds.ts` content globs — author previews using
  the components' own classes or inline styles to stay safe.

## Re-running the sync (cheat sheet)
From the repo root, on a fresh clone:
1. `npm ci` (installs React + Tailwind the converter/CSS build need).
2. Re-copy staged scripts: `mkdir -p .ds-sync && cp -r <skill>/package-*.mjs
   <skill>/resync.mjs <skill>/lib <skill>/storybook .ds-sync/` then
   `echo '{"name":"ds-sync-deps","private":true}' > .ds-sync/package.json` and
   `(cd .ds-sync && npm i esbuild ts-morph @types/react)`.
3. **Render check**: install Playwright JS into `.ds-sync` WITHOUT the browser —
   `(cd .ds-sync && PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm i playwright)` — and
   drive the system Chrome by prefixing validate/capture/driver with
   `DS_CHROMIUM_PATH=/usr/bin/google-chrome-stable`. (Do NOT `npm i playwright`
   at the repo root — it pollutes the app's package.json.)
4. **Run `cfg.buildCmd` FIRST**: `node .design-sync/ds-src/build-ds.mjs` (rebuilds
   the gitignored `dist/index.mjs` + `ds-styles.css`).
5. Fetch the project's `_ds_sync.json` → `.design-sync/.cache/remote-sync.json`,
   then run the driver:
   `DS_CHROMIUM_PATH=… node .ds-sync/resync.mjs --config .design-sync/config.json
   --node-modules ./node_modules --entry ./.design-sync/ds-src/dist/index.mjs
   --out ./ds-bundle --remote .design-sync/.cache/remote-sync.json`.
