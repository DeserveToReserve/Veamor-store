import type { Lang } from '../i18n/ui';

export const swatch = {
  steel: 'bg-[#c9ccd1]', gold: 'bg-champagne', black: 'bg-ink', white: 'bg-white',
} as const;

export const euro = (cents: number, lang: Lang) => {
  const n = (cents / 100).toFixed(2);
  return `${lang === 'bg' ? n.replace('.', ',') : n} €`;
};
