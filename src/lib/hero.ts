// Shared scroll geometry for the pinned hero effect — Header reads these too,
// to know when the hero has finished expanding to full-bleed and settled.

// Must match the wrapper's `h-[320vh]` class in Hero.tsx (Tailwind needs a
// literal class string, so that arbitrary value can't be generated from this
// constant — keep them in sync by hand).
export const HERO_WRAPPER_VH = 3.2

// Progress fraction (0-1 over the wrapper's scroll range) at which the
// clip-path finishes expanding to full-bleed.
export const HERO_EXPAND_END = 0.4

// Progress fraction at which the headline/CTA content finishes fading in —
// i.e. the hero is fully "settled" (image expanded, text at 100% opacity).
// Kept comfortably before HERO_UNPIN_FRACTION so the settled state has real
// dwell time while still pinned, instead of only reaching full clarity once
// the section has already started scrolling away.
export const HERO_SETTLED = 0.55

// The sticky child (100vh) detaches once the wrapper's remaining height drops
// below one viewport — this is that point, as a fraction of the full
// scrollYProgress range. Must stay < 1 (true whenever HERO_WRAPPER_VH > 1).
export const HERO_UNPIN_FRACTION = (HERO_WRAPPER_VH - 1) / HERO_WRAPPER_VH
