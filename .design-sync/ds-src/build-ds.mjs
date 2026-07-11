// design-sync pre-build (cfg.buildCmd). Run from the repo root BEFORE the
// converter. Two outputs the converter then consumes:
//   1. dist/index.mjs   — the barrel compiled by esbuild (React external, JSX
//                         automatic, next/* aliased to ./stubs via tsconfig.ds.json).
//                         Pointed at by --entry / cfg.entry.
//   2. ds-styles.css    — the Tailwind-compiled stylesheet (cfg.cssEntry), with
//                         a Google Fonts @import prepended for Inter + DM Serif.
// Both are gitignored (regenerated); re-run this on every sync.
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const DS = resolve(ROOT, ".design-sync/ds-src");
const require = createRequire(import.meta.url);

// ── 1. resolve esbuild (from the staged converter deps, or the repo) ──────
let esbuild = null;
for (const base of [".ds-sync/node_modules", "node_modules"]) {
  try {
    esbuild = require(resolve(ROOT, base, "esbuild"));
    break;
  } catch {
    /* keep probing */
  }
}
if (!esbuild) {
  console.error("[BUILD_DS] esbuild not found — run `(cd .ds-sync && npm i esbuild)` first.");
  process.exit(1);
}

// ── 2. bundle the barrel → dist/index.mjs ─────────────────────────────────
mkdirSync(resolve(DS, "dist"), { recursive: true });
await esbuild.build({
  entryPoints: [resolve(DS, "index.tsx")],
  bundle: true,
  format: "esm",
  platform: "browser",
  jsx: "automatic",
  // React (and the jsx runtime) stay external — the converter's reactShim
  // maps them onto window.React when it re-bundles to the IIFE.
  external: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  // tsconfig.ds.json carries jsx:react-jsx + paths (@/*, next/link, next/image).
  tsconfig: resolve(DS, "tsconfig.ds.json"),
  outfile: resolve(DS, "dist/index.mjs"),
  logLevel: "info",
});
console.error("[BUILD_DS] bundled .design-sync/ds-src/dist/index.mjs");

// ── 3. compile the stylesheet with the repo's Tailwind ────────────────────
const twBin = resolve(ROOT, "node_modules/.bin/tailwindcss");
if (!existsSync(twBin)) {
  console.error("[BUILD_DS] tailwindcss not found — run `npm ci` first.");
  process.exit(1);
}
const cssOut = resolve(DS, "ds-styles.css");
execFileSync(
  twBin,
  [
    "-i", resolve(DS, "styles-input.css"),
    "-o", cssOut,
    "--config", resolve(DS, "tailwind.ds.ts"),
    "--minify",
  ],
  { stdio: "inherit", cwd: ROOT },
);

// ── 4. prepend the remote font @import (must be the first rule) ───────────
const FONT_IMPORT =
  '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap");\n';
const css = readFileSync(cssOut, "utf8");
if (!css.includes("fonts.googleapis.com")) {
  writeFileSync(cssOut, FONT_IMPORT + css);
}
console.error("[BUILD_DS] wrote .design-sync/ds-src/ds-styles.css");
