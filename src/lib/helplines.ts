export interface HelplineInfo {
  service: string;
  numbers: { display: string; tel: string }[];
  notes: string;
  highlight?: boolean;
}

export const HELPLINES: HelplineInfo[] = [
  {
    service: 'Emergency services (India)',
    numbers: [{ display: '112', tel: '112' }],
    notes: 'Immediate danger or medical emergency',
    highlight: true,
  },
  {
    service: 'Tele-MANAS (Government of India)',
    numbers: [
      { display: '14416', tel: '14416' },
      { display: '1-800-891-4416', tel: '18008914416' },
    ],
    notes: 'Free, 24x7, multilingual mental health support',
  },
  {
    service: 'KIRAN mental health helpline',
    numbers: [{ display: '1800-599-0019', tel: '18005990019' }],
    notes: 'Free, 24x7 psychological support & counselling',
  },
];

export const HELPLINE_FOOTER_NOTE = 'Numbers last checked October 2026. Please verify before relying on them.';

export const WHEN_TO_REACH_OUT_TEXT =
  "If low or anxious days are piling up, or things feel heavy, talking to someone can help. You don't need to wait for a crisis.";

export const TRUSTED_CONTACT_PHONE_REGEX = /^[+0-9][0-9\s-]{5,14}$/;

export function validateTrustedContact(name: string, phone: string): { valid: boolean; error?: string } {
  if (!name.trim()) {
    return { valid: false, error: 'Please enter a contact name.' };
  }
  if (!phone.trim()) {
    return { valid: false, error: 'Please enter a phone number.' };
  }
  if (!TRUSTED_CONTACT_PHONE_REGEX.test(phone.trim())) {
    return {
      valid: false,
      error: 'Phone number should be 6-15 digits and can start with +.',
    };
  }
  return { valid: true };
}
