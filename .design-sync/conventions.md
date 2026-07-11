# Personal Blog Design System — how to build with it

A small set of pre-styled, presentational React components for a personal/blog
site (an "Ali Abdaal"–style warm, editorial look). Compose them into pages; they
carry all their own styling.

## Setup — no provider, just render
Components take plain data props and render styled markup. There is **no theme
provider, context, or wrapper to mount** — render a component directly:

```jsx
<HeroSection profile={{ displayName: "Doan Arlo", sayHi: "Welcome to my corner of the internet.", avatar: null }} />
```

Two things make them look right:
- **Load the design system's `styles.css`** (it `@import`s `_ds_bundle.css` plus
  the Inter + DM Serif Display webfonts). Without it, components render in
  browser-default fonts. It's already in the bound style closure.
- Links render as plain `<a>` (the source's `next/link` is aliased away), so
  `href` works as an ordinary anchor — there's no client-side router.
- Pass `avatar: null` / `coverImage: null` to use the built-in initials/gradient
  placeholders, or a real image URL when you have one.

## Styling idiom — tokens via CSS variables, NOT ad-hoc utility classes
The shipped `styles.css` is a **static, pre-compiled stylesheet** — there is no
Tailwind JIT at design time. So for YOUR OWN layout glue, **do not invent Tailwind
utility classes** (e.g. `bg-slate-100`, `p-8`) — they won't be in the stylesheet
and will render unstyled. Instead, reach for the design tokens, which are always
available as CSS custom properties:

| Token group | Variables (value) |
|---|---|
| Surfaces | `--bg1` #FFFFFF · `--bg2` #F9F6F3 · `--bg3` #F3EDE9 · `--bg4` #ECE5E1 |
| Text | `--fg1` #1B1624 · `--fg2` #54505B · `--fg3` #76737C · `--fg4` #8D8A91 |
| Brand | `--primary` #5DCDF1 · `--secondary` #FD976D · `--tertiary` #FDD46B · `--highlight` #38BD37 · `--accent` #C9B1FB · `--accent2` #79D287 |
| Spacing | `--page-px` (page side padding) · `--section-py` (section rhythm) · `--navbar-py` · `--box-margin` |
| Fonts | `--font-heading` (DM Serif Display, serif) · `--font-inter` (Inter, body) |

Use them via inline `style` or your own CSS, e.g.
`style={{ background: "var(--bg2)", color: "var(--fg1)", paddingInline: "var(--page-px)" }}`.
For type, the classes `font-heading` (serif headings) and `font-sans` (Inter body)
are available, and any `<h1>`–`<h6>` already defaults to the serif heading face.

**Layout rhythm** the sections follow: a centered container `max-width: 1400px;
margin-inline: auto;` with horizontal padding `var(--page-px)` and vertical
padding `var(--section-py)`. Cards are radius ~20px on `--bg2`. Long-form article
HTML goes inside a `<div className="prose-content">` (styled headings, lists,
blockquotes, inline code).

## Where the real styling lives
Read the bound `styles.css` and the `_ds_bundle.css` it imports for the exact
tokens/utilities, and each component's `<Name>.prompt.md` (usage) and
`<Name>.d.ts` (prop contract) before composing.

## One idiomatic page
```jsx
<div style={{ background: "var(--bg1)", color: "var(--fg1)", fontFamily: "var(--font-inter)" }}>
  <Navbar name="Doan Arlo" />
  <HeroSection profile={{ displayName: "Doan Arlo", sayHi: "I write about productivity, learning in public, and calmer work.", avatar: null }} />
  <BlogsSection posts={posts /* {id,title,slug,excerpt,coverImage,publishedAt,tags:[{name,slug}]}[] */} />
  <SiteFooter profile={{ displayName: "Doan Arlo", email: "hello@doanarlo.com", socialLinks: JSON.stringify({ youtube: "…", x: "…" }) }} />
</div>
```
Note: `socialLinks` is a JSON **string** for `AboutSection`/`SiteFooter`, but a
plain `Record<string,string>` for `AuthorBox`. Valid social keys: youtube,
instagram, linkedin, tiktok, x, facebook (plus `email` for `SocialIcon`/`SocialLinkIcon`).
