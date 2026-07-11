import { revalidatePath } from "next/cache";

/**
 * Invalidate the ISR cache for every public surface that renders
 * post / profile / tag data. Call this inside a server action after any
 * mutation so static pages regenerate on the next request instead of
 * forcing `revalidate = 0` (which would disable prefetch + caching entirely).
 */
export function revalidatePublic() {
  revalidatePath("/", "page"); // home
  revalidatePath("/articles", "page"); // article index
  revalidatePath("/[slug]", "page"); // every article page
}
