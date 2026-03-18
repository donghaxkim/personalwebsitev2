# RNN vs Transformer Interactive Block

## Overview

An animated, interactive card component embedded in the "the problem attention solves" section of the attention blog post. The card lets readers toggle between RNN and Transformer modes and press play to watch how each architecture processes a sentence differently.

## Goal

Make the abstract difference between RNNs and Transformers viscerally obvious — the reader *sees* information disappearing in RNN mode and everything connecting at once in Transformer mode.

## Component

**File:** `src/components/blog/RnnVsTransformer.jsx`

**Props:**
- `theme` — `'dark' | 'light'` — inherited from blog, controls all styling

**MDX usage:**
```mdx
## the problem attention solves

before transformers, language models used recurrent neural networks...

<RnnVsTransformer theme={theme} />

transformers throw out sequential processing entirely...
```

The component is passed to MDX via the `components` prop in `BlogPost.jsx`.

## Layout

A contained card within the `32rem` blog content column:
- Subtle border (`1px solid`, low opacity)
- Slight background tint (white/black at ~2% opacity depending on theme)
- `12px` border radius
- `28px 24px` padding
- Karla font, matching blog body

### Card structure (top to bottom):

1. **Header row** — toggle switch (left) + play button (right)
2. **Sentence visualization** — the six word tokens displayed as rounded pill elements
3. **Hidden state bar** (RNN mode only) — label + progress bar showing memory capacity
4. **Caption** — single line describing what's happening

## Toggle Switch

Segmented control with two options: "RNN" and "Transformer."
- Active side: slightly brighter background (`rgba` white/black at ~8%), bolder text
- Inactive side: dimmed text (~30% opacity)
- No color — differentiation purely through opacity and weight
- Clicking toggles the mode, resets animation state, and auto-plays

## Play Button

- Circular, `36px` diameter
- Thin border (`1.5px`, low opacity)
- Triangle play icon centered inside
- Pressing play runs the animation for the currently selected mode
- If animation is already playing, pressing resets and replays

## Sentence

The sentence "the cat sat on the mat" displayed as six word tokens in a horizontal flex row.

Each token is a rounded pill:
- `8px 14px` padding
- `8px` border radius
- `16px` font size, Karla font
- Border and opacity vary by animation state

### Initial state (before play)
All words at uniform medium opacity (~60%), uniform border.

### RNN mode — after play animation
Words processed left to right, ~400ms per word:
1. Current word highlights to full opacity + `font-weight: 600` + slightly brighter border
2. All previous words decrease in opacity progressively
3. Hidden state bar shrinks with each step
4. Final state: "mat" at full opacity, "the" (first) nearly invisible (~8%)

Opacity gradient after animation completes (left to right): `0.08, 0.14, 0.25, 0.4, 0.6, 1.0`

### Transformer mode — after play animation
All at once (single ~300ms transition):
1. All words animate to full opacity simultaneously
2. Key words ("cat", "sat", "mat") get `font-weight: 600` + slightly brighter border
3. SVG connection lines appear between all word pairs instantly
4. Function words ("the", "on") stay at slightly lower opacity (~60%)

## Connection Lines (Transformer mode only)

SVG overlay positioned absolutely over the sentence area.

Line types by relationship strength:
- **Strong** (cat↔sat, sat↔mat): `1.5px` stroke, ~20% opacity
- **Medium** (cat↔mat): curved arc above the words, `1px` stroke, ~10% opacity
- **Weak** (the↔cat, on↔the, etc.): `1px` stroke, ~5% opacity

Lines are white in dark mode, black in light mode.

## Hidden State Bar (RNN mode only)

Shown below the sentence area:
- Label: "hidden state" in `11px` uppercase, ~30% opacity
- Bar: `120px` wide, `4px` tall, rounded
- Background track at ~6% opacity
- Fill at ~30% opacity
- Fill starts at 100% and shrinks to ~20% as words are processed
- Animates in sync with the word highlighting

Hidden when in Transformer mode.

## Caption

- `13px`, ~35% opacity, centered
- RNN: "processing word by word — earlier words fade from memory"
- Transformer: "every word sees every other word — connections computed all at once"
- Crossfades when toggling modes

## Theme Support

All colors use the blog's existing pattern:
- Dark mode: `rgba(255,255,255, <opacity>)` for text/borders/fills
- Light mode: `rgba(0,0,0, <opacity>)` for text/borders/fills
- Controlled by `theme` prop, same as all other blog components

## Animation Library

Framer Motion (already installed). Specifically:
- `motion.div` with `animate` prop for word opacity/weight transitions
- `motion.line` / `motion.path` for SVG connection line fade-in
- `stagger` for RNN sequential highlighting
- `useAnimate` or state-driven variants for play/reset control

## Responsive Behavior

- On narrow screens (<480px), word pills reduce padding and font size slightly
- The card remains full content-column width
- Connection line SVG viewBox scales with container

## File Changes Required

1. **Create** `src/components/blog/RnnVsTransformer.jsx` — the component
2. **Edit** `src/BlogPost.jsx` — import component and pass it to MDX via `mdxComponents`
3. **Edit** `src/posts/attention.mdx` — insert `<RnnVsTransformer />` after the RNN paragraph in "the problem attention solves" section
