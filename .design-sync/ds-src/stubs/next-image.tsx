// design-sync stub for `next/image` — aliased (via tsconfig.ds.json paths) to a
// plain <img>. None of the synced public components import next/image today,
// but the alias keeps the bundle safe if one ever does.
import React from "react";

type ImgSrc = string | { src?: string; default?: string };

type ImageProps = {
  src?: ImgSrc;
  alt?: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  style?: React.CSSProperties;
  // Next-only props — stripped.
  priority?: unknown;
  loader?: unknown;
  quality?: unknown;
  placeholder?: unknown;
  blurDataURL?: unknown;
  sizes?: unknown;
  [key: string]: unknown;
};

export default function Image({
  src,
  alt = "",
  width,
  height,
  fill,
  style,
  priority,
  loader,
  quality,
  placeholder,
  blurDataURL,
  sizes,
  ...rest
}: ImageProps) {
  const resolved = typeof src === "string" ? src : (src && (src.src || src.default)) || "";
  const finalStyle: React.CSSProperties = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style }
    : style ?? {};
  return (
    <img
      src={resolved}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      style={finalStyle}
      {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
    />
  );
}
