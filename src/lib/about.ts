// Shared scroll geometry for the pinned About effect — Header reads this too,
// to know how long the About section's own scroll-jacked sequence runs.

// Must match the wrapper's `h-[580vh]` class in About.tsx (Tailwind needs a
// literal class string, so that arbitrary value can't be generated from this
// constant — keep them in sync by hand).
export const ABOUT_WRAPPER_VH = 5.8

// Fraction of About's own scroll range (matches About.tsx's CARDS_IN_END /
// CAROUSEL_START) at which its headline-reveal and image-morph phases are
// done and it settles into the steadier card-carousel phase — the point
// after which it's safe for the header to reappear without popping back in
// over still-transitioning About content.
export const ABOUT_HEADER_REAPPEAR = 0.46
