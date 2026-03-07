# Portfolio Updates: Blog, Tooltips, BlackJack Removal, Mobile — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a blog section with routing and listing, improve tooltip visuals and small-screen behavior, remove the Bayesian Blackwell BlackJack Engine, and ensure site-wide mobile responsiveness.

**Architecture:** Blog is a new route and page with static or placeholder post data; tooltips stay on react-aria-components with updated CSS/JSX; BlackJack is a single project entry in `Projects.jsx` with no other dependencies; responsive work touches Navbar, typography, and layout via Tailwind breakpoints and viewport-safe tooltip positioning.

**Tech Stack:** React 19, Vite, react-router-dom 7, Tailwind CSS 4, react-aria-components (tooltips), framer-motion, react-icons, lucide-react.

---

## 1) Blog section

### Task 1.1: Add Blog route and Blog listing page

**Files:**
- Create: `src/pages/Blog.jsx` (or `src/Blog.jsx` to match existing `Projects.jsx` / `InfiniteGrid.jsx` placement)
- Modify: `src/App.jsx` — add Route for `/blog`
- Modify: `src/Navbar.jsx` — add Blog nav item with tooltip and link to `/blog`

**Step 1: Create Blog listing component**

Create `src/Blog.jsx` with a responsive grid of post cards and placeholder data:

```jsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const BLOG_POSTS = [
  { id: '1', title: 'First post', excerpt: 'Short excerpt.', date: '2025-03-01' },
  { id: '2', title: 'Second post', excerpt: 'Another excerpt.', date: '2025-03-05' },
]

const Blog = ({ theme }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto px-4"
      style={{ paddingTop: '6rem', paddingBottom: '4rem' }}
    >
      <h1
        className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tighter text-left mb-6"
        style={{ fontFamily: "'Gowun Batang', serif" }}
      >
        Blog
      </h1>
      <div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        style={{ fontFamily: "'Karla', sans-serif" }}
      >
        {BLOG_POSTS.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * (index + 1) }}
            className={`rounded-xl border p-5 transition-colors ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10 hover:bg-white/10'
                : 'bg-black/5 border-black/10 hover:bg-black/10'
            }`}
          >
            <time className="text-xs opacity-70">{post.date}</time>
            <h2 className="text-lg font-medium mt-1 mb-2">{post.title}</h2>
            <p className="text-sm opacity-80">{post.excerpt}</p>
            <Link
              to={`/blog/${post.id}`}
              className="inline-block mt-3 text-sm font-medium underline"
            >
              Read more
            </Link>
          </motion.article>
        ))}
      </div>
    </motion.div>
  )
}

export default Blog
```

**Step 2: Register route in App.jsx**

In `src/App.jsx`, add the import and route:

```jsx
import Blog from './Blog'

// Inside <Routes>:
<Route path="/blog" element={<Blog theme={theme} />} />
```

**Step 3: Add Blog button to Navbar**

In `src/Navbar.jsx`, add an icon (e.g. `BiBookContent` from `react-icons/bi`) and a new nav item between Gallery and the theme toggle:

```jsx
import { BiBookContent } from 'react-icons/bi'

// After the Gallery (grid) Tooltip block, before the theme toggle:
<Tooltip title="blog" placement="bottom" delay={500}>
  <TooltipTrigger>
    <RouterLink
      to="/blog"
      className={`cursor-pointer w-[56px] h-[56px] flex items-center justify-center ${iconHover} transition-all duration-200`}
      draggable={false}
    >
      <BiBookContent />
    </RouterLink>
  </TooltipTrigger>
</Tooltip>
```

**Optional:** Add a minimal post detail route (e.g. `Route path="/blog/:id" element={<BlogPost theme={theme} />} />`) and a `BlogPost.jsx` that reads `useParams().id` and shows one post; otherwise "Read more" can link to `#` or an external URL until you have real posts.

**Commit:** `feat: add blog route, Blog listing page, and Navbar Blog button`

---

## 2) Tooltip improvements

### Task 2.1: Larger, more readable tooltips with no overlap/clipping on small screens

**Files:**
- Modify: `src/components/Tooltip.jsx` — increase container size, font sizes, and viewport-safe behavior
- Modify: `src/index.css` — update `.tooltip-box`, `.tooltip-title`, `.tooltip-description` for size and readability

**Step 1: Update Tooltip.jsx**

- Replace `max-w-xs` with a larger max width (e.g. `max-w-sm` or `min-w-[180px] max-w-[280px]`).
- Use larger padding: e.g. `px-4 py-3` when no description, `px-5 py-4` when description.
- Replace `text-xs` with `text-sm` for title and description for readability.
- Add viewport-aware behavior so tooltips don’t clip: use `react-aria-components`’ built-in positioning (it uses floating UI). Ensure the tooltip container doesn’t force overflow; e.g. add `max-w-[min(280px,85vw)]` so it stays within viewport on small screens.

Example snippet for the tooltip container in `Tooltip.jsx`:

```jsx
className={cx(
  "z-50 flex min-w-[160px] max-w-[min(280px,85vw)] origin-(--trigger-anchor-point) flex-col items-center gap-1.5 rounded-lg shadow-xl will-change-transform tooltip-box",
  description ? "px-5 py-4" : "px-4 py-3",
  // ... keep existing animation classes
)}
```

And for the title/description spans:

```jsx
<span className="text-sm font-bold tooltip-title whitespace-nowrap">
  {title}
</span>
{description && (
  <span className="text-sm font-medium tooltip-description">
    {description}
  </span>
)}
```

Remove inline `style={{ color: ... }}` if you rely on `.tooltip-title` / `.tooltip-description` in CSS for theme and readability.

**Step 2: Update index.css for tooltip box and text**

Increase base font size and ensure contrast; keep dark mode variants:

```css
.tooltip-box {
  background-color: white;
  font-size: 0.875rem; /* 14px base for readability */
}

.dark .tooltip-box {
  background-color: rgb(30, 30, 30) !important;
}

.tooltip-title {
  color: rgb(17, 24, 39);
  font-size: 0.875rem;
  font-weight: 700;
}

.dark .tooltip-title {
  color: white !important;
}

.tooltip-description {
  color: rgb(55, 65, 81);
  font-size: 0.8125rem;
}

.dark .tooltip-description {
  color: rgba(255, 255, 255, 0.75) !important;
}
```

**Step 3: Avoid overlap on small screens**

- Ensure the tooltip’s floating layer is rendered in a container that doesn’t clip (e.g. no `overflow: hidden` on an ancestor that contains the trigger). If the navbar has `overflow: hidden`, consider allowing overflow for the tooltip layer or moving the portal target.
- The `max-w-[min(280px,85vw)]` in the component keeps the tooltip within the viewport width; `85vw` prevents edge clipping on narrow devices.

**Commit:** `style: improve tooltip size, typography, and small-screen visibility`

---

## 3) Remove Bayesian Blackwell BlackJack Engine

### Task 3.1: Remove project entry and note dependents

**Files:**
- Modify: `src/Projects.jsx` — remove the single project object for "Bayesian Blackwell BlackJack Engine"

**Step 1: Remove the entry**

In `src/Projects.jsx`, delete the entire object in the `projects` array:

```js
{
  name: "Bayesian Blackwell BlackJack Engine",
  techStack: ["NumPy", "SciPy", "Typing", "Functools", "Pathlib", "Dataclasses"],
  description: "A quantitative blackjack advisor that uses statistical modeling to provide real-time optimal play recommendations by analyzing shifting shoe probabilities and expected value.",
  github: "https://github.com/donghaxkim/Bayesian-BlackJack-Engine"
},
```

**Dependent components:** None. The Projects page only maps over the `projects` array and renders cards; there are no other references to "Bayesian", "Blackwell", or "BlackJack" in the repo. No other files need changes for this removal.

**Commit:** `chore: remove Bayesian Blackwell BlackJack Engine from projects list`

---

## 4) Mobile responsiveness

### Task 4.1: Responsive Navbar

**Files:**
- Modify: `src/Navbar.jsx` — responsive width and padding; optional hamburger for very small screens if desired (plan below uses a single row that scales).

**Step 1: Make nav bar width and padding responsive**

Current: `w-[520px] px-8`. Use responsive width and padding so it doesn’t overflow on small screens:

```jsx
className={`h-14 sm:h-[72px] rounded-full w-[calc(100vw-2rem)] max-w-[520px] px-4 sm:px-8 flex items-center justify-between text-xl sm:text-2xl ${glassClass} ${iconColor} backdrop-blur-3xl select-none`}
```

Ensure icon buttons scale: e.g. `w-10 h-10 sm:w-14 sm:h-14` for the clickable areas so they remain touch-friendly.

**Step 2: Optional — hamburger menu**

If you prefer a drawer or dropdown on very small screens (e.g. &lt; 640px), add a state (e.g. `menuOpen`) and render the same links in a full-width or bottom sheet menu; otherwise the single row with reduced width is sufficient.

**Commit:** `style: make Navbar responsive for mobile`

### Task 4.2: Responsive typography and layout site-wide

**Files:**
- Modify: `src/App.jsx` — ensure main content padding and min-height work on small screens
- Modify: `src/Projects.jsx` — already uses `text-sm md:text-base` and similar; verify headings use `text-4xl sm:text-5xl md:text-6xl` or similar
- Modify: `src/Blog.jsx` (from Task 1.1) — use responsive grid and font sizes as in the snippet above
- Modify: `src/index.css` — no mandatory changes; Tailwind handles typography in components

**Step 1: Main content area**

In `App.jsx`, main already has `px-6 md:px-8 py-6 pb-24 md:pb-32`. Ensure `pb-24` gives enough space for fixed bottom elements (e.g. Spotify) on mobile. Adjust if needed (e.g. `pb-28` on small screens).

**Step 2: Headings**

Use a consistent pattern: `text-4xl sm:text-5xl md:text-6xl` for page titles so they scale down on mobile. Projects and Home already use similar patterns; Blog snippet above follows this.

**Commit:** `style: responsive typography and layout for mobile`

### Task 4.3: Mobile QA checklist

Use this as a simple QA checklist for mobile friendliness:

- [ ] **Navbar:** Fits on screen (no horizontal scroll); all nav items tappable (min ~44px).
- [ ] **Tooltips:** Visible and not clipped on 320px and 375px widths; text readable without zoom.
- [ ] **Blog:** Grid collapses to 1 column on narrow screens; cards readable.
- [ ] **Projects:** Titles and links don’t overflow; tech tags wrap.
- [ ] **Home:** Intro text and social icons wrap and remain readable.
- [ ] **Spotify / fixed elements:** Don’t cover main content; enough bottom padding.
- [ ] **Dark/Light:** Both themes checked on a small viewport.

---

## 5) Deliverables summary

| Deliverable | Location | Notes |
|------------|----------|--------|
| Navbar with Blog route | `src/Navbar.jsx`, `src/App.jsx` | New Blog icon + `<Route path="/blog" element={<Blog theme={theme} />} />` |
| Blog listing + post card | `src/Blog.jsx` | Responsive grid, minimal card with title, excerpt, date, "Read more" |
| Tooltip styling | `src/components/Tooltip.jsx`, `src/index.css` | Larger container, `text-sm`, `max-w-[min(280px,85vw)]`, updated CSS classes |
| BlackJack removal | `src/Projects.jsx` | Remove one project object; no other dependents |
| Responsive design | `src/Navbar.jsx`, `src/App.jsx`, `src/Projects.jsx`, `src/Blog.jsx` | Responsive widths, typography, grid; QA checklist in §4.3 |

---

## Execution handoff

Plan complete and saved to `docs/plans/2025-03-07-portfolio-updates-blog-tooltips-mobile.md`. Two execution options:

1. **Subagent-Driven (this session)** — Dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Parallel Session (separate)** — Open a new session with executing-plans and run through the plan with checkpoints.

Which approach do you prefer?

If Subagent-Driven is chosen, use **superpowers:subagent-driven-development**. If Parallel Session is chosen, open the worktree/session and use **superpowers:executing-plans**.
