export const languages = { bg: 'Български', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'bg';

const ui = {
  bg: {
    'nav.jewelry': 'Персонализирани бижута',
    'nav.couples': 'За двойки',
    'nav.family': 'За семейството',
    'nav.menu': 'Меню',
    'nav.cart': 'Количка',
    'hero.title': 'Малки бижута за големи спомени',
    'hero.text': 'Медальони със скрита снимка, гривни за двойки и комплекти за майка и дъщеря – подбрани за хората, които обичаш.',
    'hero.cta': 'Разгледай колекциите',
    'hero.cta2': 'Подаръци за двойки',
    'footer.about': 'Персонализирани подаръци и бижута за моментите, които искаш да запазиш.',
    'footer.shop': 'Колекции',
    'footer.help': 'Помощ',
    'footer.delivery': 'Доставка',
    'footer.returns': 'Връщане и замяна',
    'footer.contact': 'Контакти',
    'footer.privacy': 'Поверителност',
    'footer.terms': 'Общи условия',
    'footer.secure': 'Плащането се обработва сигурно от Stripe.',
  },
  en: {
    'nav.jewelry': 'Personalized jewelry',
    'nav.couples': 'For couples',
    'nav.family': 'For family',
    'nav.menu': 'Menu',
    'nav.cart': 'Cart',
    'hero.title': 'Small jewels for big memories',
    'hero.text': 'Lockets with a hidden photo, bracelets for couples and mother-daughter sets – chosen for the people you love.',
    'hero.cta': 'Explore the collections',
    'hero.cta2': 'Gifts for couples',
    'footer.about': 'Personalized gifts and jewelry for the moments you want to keep.',
    'footer.shop': 'Collections',
    'footer.help': 'Help',
    'footer.delivery': 'Delivery',
    'footer.returns': 'Returns and exchanges',
    'footer.contact': 'Contact',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms of sale',
    'footer.secure': 'Payments are processed securely by Stripe.',
  },
} as const;

export type Key = keyof (typeof ui)['bg'];
export const t = (lang: Lang) => (key: Key): string => ui[lang][key];
export const basePath = (lang: Lang) => (lang === defaultLang ? '' : `/${lang}`);
