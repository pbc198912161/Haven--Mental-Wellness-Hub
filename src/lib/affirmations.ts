import { getDayOfYear } from './dates';

export const AFFIRMATIONS: string[] = [
  "I can take this one small step at a time.",
  "Rest is part of the work, not a break from it.",
  "I don't have to have everything figured out today.",
  "My worth isn't measured by my marks.",
  "Asking for help is a strength.",
  "I can go slowly and still be moving forward.",
  "Today I'll be as kind to myself as I would be to a friend.",
  "One hard day doesn't define my story.",
  "I can feel this and still be okay.",
  "I'm learning, and learning takes time.",
  "A pause is a perfectly good plan.",
  "I've handled difficult days before, and I can handle this one.",
  "Small progress still counts.",
  "I'll focus on what I can influence today.",
  "My feelings are valid, even the messy ones.",
  "I deserve the same patience I give others.",
  "I can set a boundary and still be a good person.",
  "Comparison steals calm, so I'll run my own race today.",
  "I'm allowed to change my mind and start again.",
  "Breathing in, I settle. Breathing out, I let go.",
  "I don't have to earn my rest.",
  "Good enough is often exactly enough.",
  "I can be proud of simply showing up.",
  "Today I'll notice one thing that's going right.",
  "I'm more than my to-do list.",
  "Mistakes are how I learn, not proof that I'm failing.",
  "I can be a work in progress and still deserve care.",
  "This feeling will shift, even if slowly.",
  "I'm allowed to take up space.",
  "When things feel heavy, I'll talk to someone I trust.",
  "Today I'll leave a little room for joy.",
];

export function getAffirmationForDate(date: Date = new Date()): { affirmation: string; index: number } {
  const dayOfYear = getDayOfYear(date);
  const index = Math.abs(dayOfYear) % AFFIRMATIONS.length;
  return {
    affirmation: AFFIRMATIONS[index],
    index,
  };
}

export const GRATITUDE_PROMPT_CHIPS: string[] = [
  "Someone who helped me recently was…",
  "A small win from today was…",
  "Something that made me smile was…",
  "A place or thing that helps me feel calm is…",
  "Something my body let me do today was…",
  "A lesson I'm thankful for is…",
];
