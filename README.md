# Haven — Calm Mental Wellness Hub for Students

> **A quiet corner of the internet for students.** In about a minute a day, students can check in with their mood, breathe with a living orb, write one line of gratitude, and find daily calm. Haven shows students their own emotional rhythms in gentle, supportive language without streaks, guilt, or clinical diagnosis.

---

## Live Demo & Repository
- **Live URL:** [haven-wellness.vercel.app](https://haven-wellness.vercel.app) *(Deployable on Vercel with standard Vite preset)*
- **Repository:** Frontend-only React + TypeScript + Vite project

---

## Key Features

### 1. Daily Mood Check-In & The Calm Orb
- **Six Expressive Moods:** Joyful (`#F2C66D`), Calm (`#7FCDBB`), Okay (`#8DB8E8`), Tired (`#B9A8E6`), Anxious (`#F0A58F`), and Low (`#7C8DB5`) with paired emojis and text labels.
- **Large Tap Targets:** Minimum 56px touch areas with full radio-group keyboard accessibility (arrow key navigation).
- **Influence Tags:** Optional multi-select tags for *Study, Sleep, Friends, Family, Health, Money, Other*.
- **Note with Live Counter:** Optional note up to 280 characters with inline counter and validation.
- **One Check-In Per Local Date:** Automatically detects local calendar date (YYYY-MM-DD); updating on the same day updates the existing record without duplicating.
- **Living Calm Orb:** Layered radial gradients with subtle idle drift. The orb orchestrates softly on page load and shifts smoothly to today's mood color over 1.2s.

### 2. 60-Second Reset (Guided Flow)
- A smooth 4-step sheet with transition panels:
  1. Quick check-in
  2. 1-minute guided breathwork
  3. One good thing (gratitude)
  4. Today's affirmation
- Concludes with an uplifting completion screen ("You showed up today") with celebratory concentric ripples.

### 3. Guided Breathing with the Orb
- **Three Proven Rhythms:**
  - **Steady (Box 4-4-4-4):** Inhale 4s, Hold 4s, Exhale 4s, Hold 4s — *Focus and steady nerves.*
  - **Wind down (4-7-8):** Inhale 4s, Hold 7s, Exhale 8s — *Slow the evening down.*
  - **Reset (Even 5-5):** Inhale 5s, Exhale 5s — *A gentle everyday rhythm.*
- **Precision Timing:** Drift-free phase progression derived from `performance.now()`, avoiding chained setTimeout drift.
- **Visual & Audio Guidance:** Smooth transform scaling on the orb, phase labels with `TextMorph`, countdown seconds, and screen-reader polite announcements (`aria-live="polite"`).
- **Accessibility:** Automatically presents a static ring with text and number cues when `prefers-reduced-motion` is enabled.
- **Safety Copy:** Gentle reminders to pause if feeling dizzy or uncomfortable.

### 4. Daily Affirmation
- **31 Original Affirmations:** Authored specifically for student life, academic pressure, self-compassion, and patience (Appendix A).
- **Stable Daily Rotation:** Indexed by local day-of-year modulo 31, stable throughout the calendar day and advancing at local midnight.
- **Word-by-word Reveal:** Animated word reveal effect, with instant presentation when reduced motion is requested.
- **One-tap Copy:** Quick clipboard copy button with feedback toast.

### 5. Gratitude Journal ("One Small Good Thing")
- **Thought Starters:** Six prompt chips to overcome the blank-page problem (e.g., *"Someone who helped me recently was…"*, *"A small win from today was…"*).
- **Validation:** 3 to 500 characters with live character counter.
- **List & Management:** Newest-first entry timeline with edit capabilities and confirmed deletion dialogs.
- **Privacy Blur:** Toggle that blurs journal text until explicitly hovered or tapped.

### 6. Insights & Gentle Reflection
- **Weekly Reflection Bento Panel:** Kind, templated sentences summarizing the last 7 days without clinical terms or judgment.
- **Number Tickers:** Animated statistical figures for check-in frequency, gratitude count, and mindful breathing minutes.
- **Interactive Mood Chart:** Responsive area chart built with Recharts (toggleable between 7 and 30 days). Gaps are left for days without check-ins rather than zero scores.
- **30-Day Mood Ribbon:** Compact row of colored day dots with interactive tooltips.
- **"Days You Showed Up":** Positive calendar month tally celebrating every day the student engaged. **Strictly no streaks, no penalties, and no guilt.**
- **Gentle Nudge:** Context-aware soft card if 3 consecutive days are anxious or low, offering easy access to breathing and support helplines.

### 7. Support & Helplines
- **Immediate Danger Banner:** Clear banner for Emergency Services (**112** in India).
- **Verified Helplines:** Tap-to-call cards for Tele-MANAS (**14416** / **1-800-891-4416**) and KIRAN Mental Health Helpline (**1800-599-0019**).
- **"My Trusted Contact":** Local storage card where students save a personal counsellor, friend, or family member with a 1-tap call button.
- **"When to Reach Out":** Reassuring non-diagnostic guidance that no crisis threshold is required to ask for help.
- **Verification Notice:** *"Numbers last checked October 2026. Please verify before relying on them."*

### 8. Ambient Sound Generator (Web Audio API)
- Purely algorithmic soundscapes generated in real-time in the browser without any external audio files:
  - **Gentle Rain:** White noise synthesized through a band-pass filter with gentle gain flutter.
  - **Ocean Waves:** Brown noise filtered through low-pass resonant filtering with a ~0.1 Hz sine LFO.
  - **Warm Drone:** Two subtly detuned low sine oscillators for deep grounding.
- Features smooth 1.5-second volume fades and full AudioContext resource cleanup.

### 9. Privacy, Data & Sample Preview
- **"Stays on this Device":** All data is stored in `localStorage` under `haven:v1:*`. Nothing is transmitted over the network.
- **Sample Data Preview:** 1-click preview loading 14 days of realistic demo records (`demo: true`) with an active dismiss banner and clean sample removal.
- **Data Export & Erase:** Full JSON export and confirmed complete local storage deletion.

---

## Tech Stack & Libraries

- **Framework:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite` plugin)
- **Component Primitives:** [shadcn/ui](https://ui.shadcn.com) (`button`, `card`, `badge`, `input`, `label`, `textarea`, `switch`, `slider`, `tabs`, `dialog`, `alert-dialog`, `sheet`, `alert`, `sonner`, `tooltip`, `separator`, `progress`, `chart`)
- **Effects & Motion:**
  - [Magic UI](https://magicui.design): `@magicui/blur-fade`, `@magicui/particles`, `@magicui/ripple`, `@magicui/number-ticker`
  - [Motion Primitives](https://motion-primitives.com): `text-morph`, `glow-effect`, `transition-panel`
  - [Aceternity UI](https://ui.aceternity.com): `@aceternity/text-generate-effect`, `@aceternity/aurora-background`
  - [Motion](https://motion.dev): physics-based fluid animation
  - [Lucide React](https://lucide.dev): accessible iconography
  - [Recharts](https://recharts.org): responsive data visualization

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v20/v26)
- npm or pnpm

### Installation & Run

```bash
# Clone the repository
git clone <repo-url>
cd haven

# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## Accessibility Notes

- **WCAG AA Contrast:** Meets high contrast ratios (>12:1 for Tide Ink on Mist).
- **Accessible Focus Rings:** High-visibility 3px Dusk Lilac (`#B9A8E6`) focus ring on all interactive elements.
- **Keyboard Navigation:** Native radio group arrow-key navigation for mood selection, Escape key closing on dialogs, and a functional skip-to-content link.
- **Reduced Motion Support:** Honors `prefers-reduced-motion: reduce` by replacing orb breathing drift with static rings and instant text transitions.
- **Live Regions:** Breathing phase transitions announce politely to screen readers via hidden `aria-live="polite"` regions.

---

## Known Limitations

- **Browser Reminders:** Since Haven operates 100% locally on the device without background servers or push infrastructure, notifications and reminder prompts trigger only while the tab is open or active in the browser.
- **Audio Autoplay:** Modern browsers enforce user activation policies; ambient soundscapes start only after explicit user interaction.

---

## Medical Disclaimer

> **Important:** Haven supports everyday wellbeing. It is not a medical service, does not provide clinical diagnosis or treatment, and cannot replace professional mental health care. If you or someone around you is in immediate danger or distress, please dial **112** or contact qualified medical professionals.
