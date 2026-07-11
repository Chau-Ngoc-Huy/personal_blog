// design-sync stub for `next/link` — the claude.ai/design runtime has no Next
// router, so Link is aliased (via tsconfig paths in tsconfig.ds.json) to a
// plain anchor that drops Next-only props before they reach the DOM.
import React from "react";

type Href = string | { pathname?: string; query?: unknown; hash?: string };

type LinkProps = {
  href?: Href;
  children?: React.ReactNode;
  // Next-only props — stripped so they never land on the <a>.
  prefetch?: unknown;
  replace?: unknown;
  scroll?: unknown;
  shallow?: unknown;
  locale?: unknown;
  passHref?: unknown;
  legacyBehavior?: unknown;
  [key: string]: unknown;
};

function resolveHref(href?: Href): string {
  if (typeof href === "string") return href || "#";
  if (href && typeof href === "object") {
    return `${href.pathname ?? ""}${href.hash ?? ""}` || "#";
  }
  return "#";
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, children, prefetch, replace, scroll, shallow, locale, passHref, legacyBehavior, ...rest },
  ref
) {
  return (
    <a ref={ref} href={resolveHref(href)} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
      {children}
    </a>
  );
});

export default Link;
