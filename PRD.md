# PRD: Haven, a Mental Wellness Hub

**Round:** AI Arena 2026, Website Building Round, Brief 14 (Mental Wellness Hub)  
**Stack:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui. Frontend only, no backend, no API keys.  
**Deploy:** Vercel (auto-detects Vite). Public GitHub repo with README.  
**Data:** localStorage only. Nothing leaves the device.

---

## 1. Product summary

Haven is a calm corner of the internet for students. In about a minute a day, a student can check in with their mood, breathe, write one line of gratitude and read a fresh affirmation. Over time Haven shows them their own patterns in gentle language. It is a wellbeing aid for habits and awareness, not a medical product.

**Primary job of the site:** make it effortless to show up for yourself on a hard or ordinary day.

### Success looks like (for the judges):
- Every must-have from the brief works, with no console errors.
- The site feels calm and unmistakably designed, not templated.
- It is excellent at 360px width as well as on desktop.
- It has a clear, defensible idea behind it: one signature element (the Calm Orb) and a few thoughtful decisions.

---

## 2. Problem analysis

### Real problems students face with wellness apps
1. **Friction and guilt.** Mood trackers get abandoned because logging feels like homework, and streaks punish missed days.
2. **Blank-page problem.** Gratitude journals stall because "write something" is hard.
3. **One-size-fits-all calm.** A single breathing animation ignores how the person actually feels.
4. **Hidden help.** Support resources are buried in a footer exactly when someone needs them.
5. **Privacy fear.** Students worry that feelings stored online can be seen or sold.
6. **Data without meaning.** A chart of dots doesn't tell a person anything kind or useful.

### What most teams will build
A pastel gradient page, a row of emojis, a line chart, a breathing circle, a quote and a resources list: the five must-haves as separate, disconnected widgets.

### How Haven solves it (our unique angle)

| Problem | Haven's answer |
|---|---|
| **Friction and guilt** | A 60-second Reset: one guided flow (check in, breathe, one line of gratitude, affirmation). No streaks. Haven counts "days you showed up" this month, with no penalty for gaps. |
| **Blank page** | Gratitude prompt chips that fill the first words for you. |
| **One-size-fits-all calm** | Mood-aware breathing: after a check-in Haven gently suggests a breathing pattern that fits the mood. The user can always change it. |
| **Hidden help** | A permanent "Need help now?" button in the header and a Support section with tap-to-call numbers. |
| **Privacy fear** | A visible "Stays on this device" promise, Export my data, Erase everything, and a privacy blur on journal entries. |
| **Data without meaning** | A weekly reflection written in kind, plain sentences, and a mood ribbon that shows weeks as colour. |

### The signature element: the Calm Orb
One living orb is the visual language of the whole site:
- It wakes up on page load (the single orchestrated entrance).
- It takes the colour of today's mood after check-in.
- It is the breathing guide: it expands and contracts with each phase.
- Its colours form the mood ribbon in Insights.

**Design principle:** spend boldness in one place (the orb). Everything else stays quiet and disciplined.

---

## 3. Users and key journeys

**Primary user:** a college student, 18 to 24, on a phone, often late in the evening, sometimes stressed about exams.

| Journey | Steps |
|---|---|
| **Quick check-in (30s)** | Open site, tap a mood, optionally tap influences or write a note, save, see the orb change colour and a gentle breathing suggestion. |
| **60-second Reset (guided)** | Tap "Start my 60-second Reset", then check in, breathe for one minute, write one gratitude line, read today's affirmation, finish with "You showed up today". |
| **Rough day** | Tap "Need help now?" or follow the gentle nudge to Support, then tap to call a helpline or the user's own saved contact. |
| **Look back** | Open Insights, view the weekly reflection, the mood chart and the ribbon. |

---

## 4. Scope tiers and build order

Build strictly in this order. Each tier must be fully working and committed before starting the next.

### P0: Brief must-haves (30 pts functionality)
1. Daily mood check-in (emoji select, optional note)
2. Mood history (list and chart)
3. Guided breathing with an animated expanding and contracting circle
4. Daily affirmation that changes each day
5. Resources section with helpline and counselling information
6. Gratitude journal with saved entries
7. Persistent disclaimer, gentle palette, slow animations, accessible contrast, large tap targets

### P1: What makes Haven win (design and creativity)
8. Calm Orb (hero, mood colour, breathing guide)
9. 60-second Reset guided flow
10. Mood-aware breathing suggestion and influence tags
11. Weekly reflection summary (brief bonus)
12. Gentle nudge after three heavy days
13. Privacy controls (export, erase, journal blur)
14. Sample-data preview for empty states

### P2: Bonus and polish
15. Ambient sound toggle (brief bonus), generated with the Web Audio API
16. Reminder prompts (brief bonus)
17. Time-of-day greeting and palette, plus a manual light/dark toggle

**Cut line:** if time runs short, cut from the bottom of the list. Never ship a broken P1 item. Hide it instead.

---

## 5. Feature specifications

### 5.1 Daily mood check-in (P0)
- Six moods, each with emoji, label, score and colour:

| id | Emoji | Label | Score | Colour |
|---|---|---|---|---|
| `joyful` | 😄 | Joyful | 5 | `#F2C66D` |
| `calm` | 😌 | Calm | 4 | `#7FCDBB` |
| `okay` | 🙂 | Okay | 3 | `#8DB8E8` |
| `tired` | 😴 | Tired | 2 | `#B9A8E6` |
| `anxious` | 😟 | Anxious | 2 | `#F0A58F` |
| `low` | 😔 | Low | 1 | `#7C8DB5` |

- Mood buttons are a radio group. Each shows the emoji and the text label, with a minimum tap target of 56px.
- Influence tags (optional, multi-select chips): Study, Sleep, Friends, Family, Health, Money, Other.
- Note (optional): textarea, max 280 characters, with a live counter.
- Validation: a mood is required. Show "Pick how you're feeling to save" inline. The note over 280 characters shows a clear message. Never clear the form on error.
- One check-in per local date. Saving again on the same day updates it (toast: "Today's check-in updated").
- On save: toast "Check-in saved", the orb transitions to the mood colour, and a card appears: "Want to try a breathing exercise? We suggest {pattern}." with a Start button.
- If today is already checked in, show the saved mood with an "Edit" action.

### 5.2 Mood history (P0)
- Chart: area or line chart of mood score for the last 7 or 30 days (toggle). Tooltip shows date, mood label and emoji. Missing days are gaps, not zeros.
- List: newest first, showing date, emoji, label, tags and note. Notes respect the privacy blur setting. Each entry can be deleted (with confirmation).
- Mood ribbon: a row of small coloured circles, one per day for the last 30 days. Empty days are outlined circles.
- Empty state: a short invitation ("Your first check-in will appear here") plus a Preview with sample data button.
- Chart must resize cleanly at 360px width.

### 5.3 Guided breathing (P0)
- Patterns (shown as a segmented control with one-line descriptions):
  - **Steady (Box):** inhale 4, hold 4, exhale 4, hold 4. "Focus and steady nerves."
  - **Wind down (4-7-8):** inhale 4, hold 7, exhale 8. "Slow the evening down."
  - **Reset (Even):** inhale 5, exhale 5. "A gentle everyday rhythm."
- Session length: 1, 2 or 3 minutes (rounded to whole cycles).
- The orb scales up during inhale, stays during holds, and scales down during exhale. The animation duration equals the phase duration, using an ease-in-out curve. Use `transform: scale()` only.
- Phase label shows "Breathe in / Hold / Breathe out" with the count-down seconds. The label morphs between words.
- Controls: Start, Pause, Resume, Reset. Show a progress bar for the session. Completion message: "Well done. That was {n} minutes of calm." The session is saved to the breathing log.
- Safety copy: "If holding your breath feels uncomfortable, shorten the holds or choose Reset. Stop if you feel dizzy."
- Reduced motion: if `prefers-reduced-motion` is set, replace the scaling with a static ring and a text and number cue.
- Phase changes are announced to screen readers via a polite live region (visually hidden text).
- Clean up all timers on unmount and on pause. No drift: derive phase from elapsed time, not from chained timeouts.
- Suggestion mapping (gentle, never prescriptive):
  - anxious → Wind down
  - low → Reset
  - tired → Steady
  - okay → Reset
  - calm or joyful → Steady

### 5.4 Daily affirmation (P0)
- Original affirmations (Appendix A, 31 entries).
- Index = day-of-year in the user's local date modulo the list length. It changes at local midnight and is stable all day.
- Text appears word by word with a slow reveal. If reduced motion is set, show it instantly.
- Actions: "Copy" (toast "Copied").

### 5.5 Resources section (P0)
- Safety banner at the top: "If you or someone near you is in immediate danger, call 112."
- Helpline cards with tap-to-call buttons (`tel:` links):

| Service | Number | Notes |
|---|---|---|
| Emergency services (India) | 112 | Immediate danger |
| Tele-MANAS (Government of India) | 14416 or 1-800-891-4416 | Free, 24x7, many languages |
| KIRAN mental health helpline | 1800-599-0019 | Free, 24x7 |

Footer line: "Numbers last checked October 2026. Please verify before relying on them."
- "My trusted contact" card: the user can save a name and phone number (their campus counselling cell, a friend or a family member) to localStorage. When saved, it shows a big Call button. When empty it shows an invitation: "Add a counsellor, friend or family member you'd call."
- "When to reach out" card: short, non-diagnostic text ("If low or anxious days are piling up, or things feel heavy, talking to someone can help. You don't need to wait for a crisis.").
- Validation for the trusted contact: name required, phone must match `^[+0-9][0-9\s-]{5,14}$`.

### 5.6 Gratitude journal (P0)
- Prompt chips (tap to insert the starter text): see Appendix B.
- Textarea: required, 3 to 500 characters, live counter, inline errors.
- Save shows toast "Saved to your journal". The list shows entries newest first, with date and time.
- Edit and delete, with a confirmation dialog for delete.
- Privacy blur toggle: blurs entry text until tapped or hovered.
- Empty state: "One small good thing is enough. What's yours today?"

### 5.7 Calm Orb (P1)
- Built with layered radial gradients and a soft glow. Idle: slow breathing drift (very subtle). On page load: it "wakes" (one orchestrated sequence).
- Mood colour transitions over about 1.2 seconds. Size and position adapt to the hero on mobile.
- Respects reduced motion (no idle drift).

### 5.8 60-second Reset flow (P1)
- Opens in a full-screen sheet or dialog with four steps and a progress indicator: Check in, Breathe (1 minute), One line of gratitude, Today's affirmation.
- Steps slide with a smooth panel transition. Each step reuses the same components and validation as the main sections and writes to the same storage.
- Completion screen: "You showed up today." with a gentle ripple around the orb. Counts toward "days you showed up".
- Users can exit at any step; partial progress is kept.

### 5.9 Weekly reflection (P1, brief bonus)
Computed locally from the last 7 days, shown as a bento-style panel with number tickers:
- Check-ins this week, most frequent mood, best day, most common influence, gratitude entries, minutes breathed.
- A written summary from templates. Average score maps to wording: 4.2 and above "a mostly bright week", 3.4 and above "a mostly steady week", 2.5 and above "a mixed week", below that "a heavier week".
- Tone rules: kind, plain, no clinical terms, no diagnosis, no judgement.
- Needs at least 2 check-ins; otherwise show an encouraging empty state.

### 5.10 Gentle nudge (P1)
If the three most recent check-ins are on consecutive dates and all are anxious or low, show a soft card: "Rough few days? You don't have to carry it alone." with two buttons: "Try a breathing exercise" and "See support options". It is dismissible (reappears only after a new pattern). Never a blocking modal.

### 5.11 Privacy controls (P1)
- Badge near the footer and the check-in card: "Stays on this device".
- Export my data (downloads JSON).
- Erase everything (confirmation dialog, then clears all Haven keys and resets the UI).

### 5.12 Sample-data preview (P1)
- A button that loads 14 days of demo entries, flagged `demo: true`, so judges see charts instantly.
- While active, show a banner: "You're viewing sample data. Clear it to start fresh." Clearing removes only demo entries.

### 5.13 Ambient sound (P2, brief bonus)
- No audio files. Generate sound with the Web Audio API so there are no copyright or loading issues:
  - **Rain:** white noise through a band-pass filter, with slight gain flutter.
  - **Waves:** brown noise through a low-pass filter, with a slow (~0.1 Hz) gain LFO.
  - **Soft drone:** two detuned low sine oscillators at very low gain.
- Toggle plus volume slider. Fade in and out over 1.5 seconds. Starts only after a user click. Default off. Stops when switched off. Cleans up the AudioContext.

### 5.14 Reminder prompts (P2, brief bonus)
- Settings: switch plus a time input (default 20:00).
- When the site is open, after the chosen time, if there is no check-in today and the banner wasn't dismissed today, show a gentle banner: "A quiet moment for you? Check in whenever you're ready."
- If the user also grants browser notification permission, send one notification while the tab is open. Explain in the UI that web pages can't notify when fully closed.

### 5.15 Time of day and theme (P2)
- Greeting by time ("Good morning", "Good afternoon", "Good evening", "Still up?" after 11pm).
- Palette shifts subtly by time of day. Manual light/dark toggle that persists.

---

## 6. Feature to library map

| Feature | Library and components | Notes |
|---|---|---|
| App foundation | shadcn/ui: button, card, badge, input, label, textarea, switch, slider, tabs, toggle-group, dialog, alert-dialog, sheet, alert, sonner, tooltip, separator, progress, chart | Chart uses Recharts via shadcn's chart component |
| Hero entrance | Magic UI blur-fade (hero only), particles (very low density) | One orchestrated entrance, not on every section |
| Hero background (optional) | Aceternity UI aurora-background | Slow, low contrast. Use a CSS gradient fallback if the install fails |
| Calm Orb halo | Motion Primitives glow-effect; Magic UI ripple on check-in save | Orb itself is custom CSS plus motion |
| Mood check-in | shadcn toggle-group, badge, textarea, button, sonner | Large tap targets |
| Breathing | Motion Primitives text-morph (phase label), glow-effect; shadcn tabs, toggle-group, progress | Scale animation via motion |
| Daily affirmation | Aceternity UI text-generate-effect | Slow word-by-word reveal |
| Journal | shadcn textarea, alert-dialog, button, badge; motion AnimatePresence for list items | |
| Insights | shadcn chart (Recharts), card; Magic UI number-ticker | Bento layout with Tailwind grid |
| 60-second Reset | Motion Primitives transition-panel; shadcn sheet, progress | Fallback: motion AnimatePresence |
| Support section | shadcn card, alert, input, button, alert-dialog | |
| Ambient sound and reminders | shadcn switch, slider, toggle-group, alert, input | |
| Navigation | shadcn button, tooltip; custom bottom nav on mobile | |

Fallback rule: if any install fails or breaks the build, stop troubleshooting after one attempt and replace that single component with plain Tailwind plus the motion package. Never let a library block the build.

---

## 7. UX and UI design system

### Direction
Calm and spacious, not generic pastel. The mood is a quiet tide pool at dusk: deep teal-ink text, misty backgrounds, and one glowing orb. Avoid the usual template look: no cream-and-terracotta scheme, no all-caps eyebrow labels, no numbered markers, no arrow glyphs on every button, no identical card on every block, and no fade-and-slide on every section.

### Colour tokens (light theme, named)

| Name | Hex | Use |
|---|---|---|
| Mist | `#EEF3F6` | Page background (with a soft gradient to `#E6EEF5`) |
| Tide Ink | `#14323F` | Primary text (contrast above 12:1 on Mist) |
| Seafoam | `#7FCDBB` | Primary accent, success, "calm" |
| Dusk Lilac | `#B9A8E6` | Secondary accent, focus rings |
| Sand Glow | `#F2C66D` | Warm highlight, "joyful", orb core |
| Deep Tide | `#0E2530` | Dark theme background |

Muted text must still meet WCAG AA (4.5:1). Mood colours are for fills only: never use them alone for text, and always pair colour with a text label.

### Type
- Fraunces (soft serif, variable) for headlines, greetings and the affirmation.
- DM Sans for UI and body.
- Body 16 to 18px, line height 1.6, line length below 70 characters. Serif body text gets slightly more line height.
- Load via Google Fonts with `display=swap` and system fallbacks.

### Shape and depth
Vary the shapes on purpose: the orb is a circle, buttons are pills, main panels use 28px radius, small chips use 999px. Soft, layered shadows tinted with Tide Ink at low opacity. Frosted glass (`backdrop-blur`) only on the hero check-in panel and the bottom nav.

### Motion rules
- Durations 600 to 1200ms, ease-in-out, no bounce or spring overshoot.
- One orchestrated entrance (the orb waking plus the hero text). Elsewhere, motion only responds to the user's actions (saving, opening, switching steps).
- Everything respects `prefers-reduced-motion`.

### Copy voice
Warm, plain, sentence case. Buttons say exactly what they do ("Save check-in", "Start breathing", "Save to journal"). Errors say what is wrong and how to fix it. No exclamation overload, no clinical words.

---

## 8. Accessibility and responsiveness
- WCAG AA contrast for all text. Visible `:focus-visible` rings (Dusk Lilac, 3px).
- Tap targets at least 48px (mood buttons 56px). Semantic landmarks (`header`, `nav`, `main`, `section` with headings, `footer`), a skip link, and `lang="en"`.
- Mood radio group with proper roles and arrow-key support. Emoji always paired with a text label. Decorative elements are `aria-hidden`.
- Breathing phase changes announced through a polite live region. Dialogs trap focus and return it on close.
- Works from 360px to 1440px with no horizontal scroll. Chart is responsive. Bottom nav respects safe-area insets.
- Disclaimer visible in the footer and on the Support section, and in the hero as a small line: "Haven supports everyday wellbeing. It isn't a medical service and can't replace professional help."

---

## 9. Data model and storage

All keys are prefixed `haven:v1:`. Wrap every read and write in `try/catch` and fall back to defaults if storage is unavailable or corrupted.

```typescript
type MoodId = 'joyful' | 'calm' | 'okay' | 'tired' | 'anxious' | 'low';

type Tag = 'Study' | 'Sleep' | 'Friends' | 'Family' | 'Health' | 'Money' | 'Other';

interface CheckIn {
  date: string; // YYYY-MM-DD
  mood: MoodId;
  score: number;
  tags: Tag[];
  note: string;
  updatedAt: number;
  demo?: boolean;
}

interface GratitudeEntry {
  id: string;
  text: string;
  createdAt: number;
  demo?: boolean;
}

interface BreathingSession {
  id: string;
  pattern: 'box' | 'relax478' | 'even';
  seconds: number;
  createdAt: number;
  demo?: boolean;
}

interface Prefs {
  theme: 'system' | 'light' | 'dark';
  reminderOn: boolean;
  reminderTime: string;
  blurJournal: boolean;
  soundVolume: number;
}

interface TrustedContact {
  name: string;
  phone: string;
}
```

Keys: `checkins`, `gratitude`, `breathing`, `prefs`, `contact`, `nudgeDismissedFor`, `reminderDismissedDate`.

Dates use the local date string (`YYYY-MM-DD`) so everything behaves correctly across midnight.

"Days you showed up" = distinct local dates in the current month with any check-in, gratitude entry or breathing session. There is no streak and no penalty.

---

## 10. Architecture

```
src/
  components/
    ui/          shadcn, Magic UI, Aceternity, Motion Primitives components
    layout/      Header, BottomNav, Footer, Disclaimer
    hero/        Hero, CalmOrb
    checkin/     MoodCheckIn, MoodPicker, InfluenceTags
    breathe/     BreathingExercise, PatternPicker
    affirmation/ DailyAffirmation
    journal/     GratitudeJournal, EntryList
    insights/    Insights, MoodChart, MoodRibbon, WeeklyReflection, GentleNudge
    support/     SupportSection, HelplineCard, TrustedContact
    reset/       ResetFlow
    settings/    SoundControl, ReminderControl, PrivacyControls, ReminderBanner
  hooks/         useLocalStorage, useToday, useBreathing, useAmbientSound, useReducedMotion
  lib/           dates.ts, moods.ts, affirmations.ts, insights.ts, storage.ts, helplines.ts, sampleData.ts, utils.ts
  types.ts
  App.tsx, main.tsx, index.css
```

---

## 11. Edge cases and error states
- localStorage unavailable (private mode) or corrupted JSON: app still runs in memory, shows a small notice, never crashes.
- Check-in saved twice in a day: updates, never duplicates.
- Midnight rollover while the page is open: affirmation, "today" state and reminder refresh on the next minute tick or on tab focus.
- Breathing: switching tabs or pausing must not break timing. Leaving the section mid-session pauses cleanly.
- Sound: autoplay is blocked until a click. If `AudioContext` is unsupported, hide the control.
- Notification permission denied: fall back silently to the in-app banner.
- Very long notes wrap correctly and never break the layout.
- Empty states exist for history, journal, insights and the trusted contact.
- Delete actions always confirm.

---

## 12. Acceptance criteria (mapped to judging)

### Functionality (30)
- [ ] Mood check-in with emoji select, optional note, validation, persistence.
- [ ] History as a list and a chart. Sample-data preview works.
- [ ] Breathing circle visibly expands and contracts in sync with phase text and timing.
- [ ] Affirmation is different on different dates (test by changing the system date) and stable within a day.
- [ ] Support section with tap-to-call numbers, trusted contact, and visible disclaimer.
- [ ] Gratitude journal: add, edit, delete, persistence after refresh.
- [ ] Bonuses: ambient sound toggle, weekly summary, reminder prompts.

### Design and UI (25)
- [ ] Calm Orb is the memorable element. The rest is quiet and consistent.
- [ ] Palette, type and spacing follow the tokens above. No lorem ipsum anywhere.

### Responsiveness (15)
- [ ] Verified at 360px, 768px and 1280px. No horizontal scroll. Bottom nav on mobile.

### Code quality (10)
- [ ] Folder structure as above, typed, readable names, no dead code.

### Deployment (10)
- [ ] Live Vercel URL opens without errors on a phone. README is complete.

### Creativity and extras (10)
- [ ] 60-second Reset, mood-aware breathing, no-streak philosophy, privacy controls, generated soundscapes.

### Global requirements from the organisers
- [ ] No console errors or warnings. No broken links. Forms validate with clear success and error messages. Free-to-use media only (this build uses no external images or audio files). No API keys needed.

---

## 13. Deployment and README
- Vite preset on Vercel: build command `npm run build`, output directory `dist`. No environment variables needed.
- Push to a public GitHub repo early and connect it to Vercel so every push deploys.
- README must include: one-paragraph overview, live link, feature list, tech stack, libraries used (shadcn/ui, Magic UI, Aceternity UI, Motion Primitives) with credit, setup and run instructions, privacy and data note, accessibility notes, known limitations (browser reminders only work while the tab is open), and a disclaimer that Haven is not a medical service.

---

## 14. Risks and fallbacks

| Risk | Fallback |
|---|---|
| A library install or style conflict breaks the build | Replace only that component with Tailwind and motion. |
| Tailwind v4 keyframes missing for Aurora or other effects | Add the keyframes under `@theme` in `index.css`, or use a plain CSS gradient. |
| Time runs short | Cut from the bottom of the tier list. Hide unfinished features. |
| Type errors fail the Vercel build | Run `npm run build` locally before every push. |
| Helpline numbers change | Footer note asks users to verify. Re-check before the demo. |

---

## Appendix A: Affirmations (31, original)
1. I can take this one small step at a time.
2. Rest is part of the work, not a break from it.
3. I don't have to have everything figured out today.
4. My worth isn't measured by my marks.
5. Asking for help is a strength.
6. I can go slowly and still be moving forward.
7. Today I'll be as kind to myself as I would be to a friend.
8. One hard day doesn't define my story.
9. I can feel this and still be okay.
10. I'm learning, and learning takes time.
11. A pause is a perfectly good plan.
12. I've handled difficult days before, and I can handle this one.
13. Small progress still counts.
14. I'll focus on what I can influence today.
15. My feelings are valid, even the messy ones.
16. I deserve the same patience I give others.
17. I can set a boundary and still be a good person.
18. Comparison steals calm, so I'll run my own race today.
19. I'm allowed to change my mind and start again.
20. Breathing in, I settle. Breathing out, I let go.
21. I don't have to earn my rest.
22. Good enough is often exactly enough.
23. I can be proud of simply showing up.
24. Today I'll notice one thing that's going right.
25. I'm more than my to-do list.
26. Mistakes are how I learn, not proof that I'm failing.
27. I can be a work in progress and still deserve care.
28. This feeling will shift, even if slowly.
29. I'm allowed to take up space.
30. When things feel heavy, I'll talk to someone I trust.
31. Today I'll leave a little room for joy.

---

## Appendix B: Gratitude prompt chips
- Someone who helped me recently was…
- A small win from today was…
- Something that made me smile was…
- A place or thing that helps me feel calm is…
- Something my body let me do today was…
- A lesson I'm thankful for is…

---

## Appendix C: Sample data (for the preview button)
14 days ending today, moods varied across all six types with a gentle upward trend, 5 gratitude entries and 4 breathing sessions. All flagged `demo: true`. Entries must read as real, kind and specific (for example, "My roommate shared her notes before the test"), not as filler text.
