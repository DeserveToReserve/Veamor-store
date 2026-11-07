import type { Lang } from '../i18n/ui';

export type Category = 'jewelry' | 'couples' | 'family';
export type Metal = 'steel' | 'gold' | 'black' | 'white';

export interface Product {
  slug: string;
  category: Category;
  art: 'locket' | 'bracelets' | 'infinity' | 'pair';
  tone: 'warm' | 'pale' | 'sand' | 'rose';
  price: number; // euro cents - PLACEHOLDER prices, replace with real ones
  metals: Metal[];
  name: Record<Lang, string>;
  note: Record<Lang, string>;
}

export const products: Product[] = [
  {
    slug: 'heart-locket', category: 'jewelry', art: 'locket', tone: 'warm', price: 3490, metals: ['steel', 'gold'],
    name: { bg: 'Медальон „Сърце“ със скрита снимка', en: 'Heart locket with hidden photo' },
    note: { bg: 'Стомана или златист цвят', en: 'Steel or gold color' },
  },
  {
    slug: 'projection-bracelets', category: 'couples', art: 'bracelets', tone: 'pale', price: 2990, metals: ['black', 'white'],
    name: { bg: 'Гривни с проекция „Обичам те“', en: '“I love you” projection bracelets' },
    note: { bg: 'Комплект за двама, на 100 езика', en: 'Set for two, in 100 languages' },
  },
  {
    slug: 'infinity-bracelets', category: 'couples', art: 'infinity', tone: 'sand', price: 2490, metals: ['steel'],
    name: { bg: 'Гривни „Безкрайност“ за двойки', en: 'Infinity bracelets for couples' },
    note: { bg: 'Комплект от две стоманени гривни', en: 'Set of two steel bracelets' },
  },
  {
    slug: 'mother-daughter-necklaces', category: 'family', art: 'pair', tone: 'rose', price: 3290, metals: ['steel'],
    name: { bg: 'Колиета „Майка и дъщеря“', en: 'Mother and daughter necklaces' },
    note: { bg: 'Две колиета с гравирани сърца', en: 'Two necklaces with engraved hearts' },
  },
];
