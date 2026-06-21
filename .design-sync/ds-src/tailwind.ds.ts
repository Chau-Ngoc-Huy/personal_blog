// design-sync Tailwind config: reuses the repo's "ali" theme (colors, fonts,
// shadows, radii) but scopes the content scan to the synced public components
// and the authored preview compositions, so the generated stylesheet carries
// exactly the utilities the design system needs (not the admin UI).
import type { Config } from "tailwindcss";
import base from "../../tailwind.config";

const config: Config = {
  ...base,
  content: [
    "./components/public/**/*.{ts,tsx}",
    "./.design-sync/previews/**/*.{ts,tsx}",
    "./.design-sync/ds-src/**/*.{ts,tsx}",
  ],
};

export default config;
