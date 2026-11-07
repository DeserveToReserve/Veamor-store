import type { Lang } from '../i18n/ui';

interface Details { pick: boolean; photo?: boolean; desc: Record<Lang, string>; list: Record<Lang, string[]> }

// Copy is a first draft based on the product photos - review before launch.
export const details: Record<string, Details> = {
  'heart-locket': {
    pick: true,
    photo: true,
    desc: {
      bg: 'Класическо сърце, което се отваря и пази любима снимка близо до сърцето. Подарък за годишнина, рожден ден или просто за да кажеш „мисля за теб“.',
      en: 'A classic heart that opens to keep a favorite photo close to your heart. A gift for an anniversary, a birthday, or simply to say “I’m thinking of you”.',
    },
    list: {
      bg: ['Отваря се на две и побира снимка', 'Верижка с топчета', 'Стоманен или златист цвят'],
      en: ['Opens in two and holds a photo', 'Ball chain', 'Steel or gold color'],
    },
  },
  'projection-bracelets': {
    pick: false,
    desc: {
      bg: 'Две гривни от плетена връв – черна и бяла. Малкото сърце проектира „Обичам те“ на 100 езика.',
      en: 'Two braided-cord bracelets, one black and one white. The little heart projects “I love you” in 100 languages.',
    },
    list: {
      bg: ['Комплект от две гривни: черна и бяла', 'Сърце с проекционен камък', 'Плетена връв'],
      en: ['Set of two bracelets: black and white', 'Heart with a projection stone', 'Braided cord'],
    },
  },
  'infinity-bracelets': {
    pick: false,
    desc: {
      bg: 'Две семпли гривни със знака за безкрайност – за двама, които искат да са свързани навсякъде.',
      en: 'Two simple bracelets with the infinity sign, for two people who want to stay connected anywhere.',
    },
    list: {
      bg: ['Комплект от две гривни', 'Верижка със знак за безкрайност', 'Регулируема закопчалка'],
      en: ['Set of two bracelets', 'Chain with an infinity charm', 'Adjustable clasp'],
    },
  },
  'mother-daughter-necklaces': {
    pick: false,
    desc: {
      bg: 'Две сърца, които се допълват: голямото „Mother“ с изрязано сърце и малкото „Daughter“.',
      en: 'Two hearts that fit together: the larger “Mother” with a heart cut-out and the smaller “Daughter”.',
    },
    list: {
      bg: ['Комплект от две колиета', 'Гравирани надписи „Mother“ и „Daughter“', 'Стоманена верижка'],
      en: ['Set of two necklaces', 'Engraved “Mother” and “Daughter” text', 'Steel chain'],
    },
  },
};
