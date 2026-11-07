import type { Lang } from './ui';

export const copy = {
  bg: {
    title: 'Поръчка', back: 'Към магазина', empty: 'Количката е празна.',
    'sec.contact': 'Контакти', 'sec.delivery': 'Адрес за доставка', 'sec.photo': 'Снимка за медальона', 'sec.payment': 'Плащане',
    name: 'Име и фамилия', email: 'Имейл', phone: 'Телефон', city: 'Град', address: 'Адрес', postal: 'Пощенски код', note: 'Бележка (по желание)',
    'photo.hint': 'Качи ясна снимка с добро осветление. Намаляваме я и махаме скритите данни (като местоположение) още на твоето устройство.',
    'photo.choose': 'Избери снимка', 'photo.replace': 'Смени снимката',
    'pay.card': 'С карта', 'pay.card.d': 'Сигурно плащане през Stripe. Картовите данни не минават през нашия сайт.',
    'pay.cod': 'Наложен платеж', 'pay.cod.d': 'Плащаш при получаване на пратката.',
    consent: 'Съгласен съм с общите условия и политиката за поверителност.',
    'submit.card': 'Към плащане', 'submit.cod': 'Потвърди поръчката', sending: 'Изпращане…',
    'sum.title': 'Твоята поръчка', 'sum.total': 'Общо', 'sum.ship': 'Доставката се уточнява след потвърждение.',
    secure: 'Връзката е криптирана. Картови данни не се съхраняват при нас.',
    'err.required': 'Моля, попълни полето.', 'err.email': 'Невалиден имейл.', 'err.phone': 'Невалиден телефон.', 'err.postal': 'Невалиден пощенски код.',
    'err.consent': 'Необходимо е съгласие.', 'err.payment': 'Избери начин на плащане.', 'err.photo': 'Добави снимка за медальона.',
    'err.photo_type': 'Допускат се JPG, PNG или WebP снимки.', 'err.photo_size': 'Снимката е твърде голяма.', 'err.cart': 'Количката е празна или невалидна.',
    'err.server': 'Нещо се обърка. Опитай отново.', 'err.csrf': 'Сесията изтече. Презареди страницата и опитай пак.',
    'err.payment_unavailable': 'Плащането с карта не е налично. Опитай с наложен платеж или по-късно.',
    'ok.title': 'Благодарим за поръчката', 'ok.text': 'Получихме я и ще се свържем с теб за потвърждение.', 'ok.ref': 'Номер на поръчка', 'ok.home': 'Към началото',
  },
  en: {
    title: 'Checkout', back: 'Back to the shop', empty: 'Your cart is empty.',
    'sec.contact': 'Contact', 'sec.delivery': 'Delivery address', 'sec.photo': 'Photo for the locket', 'sec.payment': 'Payment',
    name: 'Full name', email: 'Email', phone: 'Phone', city: 'City', address: 'Address', postal: 'Postal code', note: 'Note (optional)',
    'photo.hint': 'Upload a clear, well-lit photo. We shrink it and remove hidden data (such as location) on your device.',
    'photo.choose': 'Choose a photo', 'photo.replace': 'Change photo',
    'pay.card': 'By card', 'pay.card.d': 'Secure payment through Stripe. Card details never pass through our site.',
    'pay.cod': 'Cash on delivery', 'pay.cod.d': 'You pay when the parcel arrives.',
    consent: 'I agree to the terms of sale and the privacy policy.',
    'submit.card': 'Continue to payment', 'submit.cod': 'Confirm order', sending: 'Sending…',
    'sum.title': 'Your order', 'sum.total': 'Total', 'sum.ship': 'Delivery is confirmed after the order.',
    secure: 'The connection is encrypted. Card data is never stored by us.',
    'err.required': 'Please fill in this field.', 'err.email': 'Invalid email.', 'err.phone': 'Invalid phone number.', 'err.postal': 'Invalid postal code.',
    'err.consent': 'Your consent is required.', 'err.payment': 'Choose a payment method.', 'err.photo': 'Add a photo for the locket.',
    'err.photo_type': 'Only JPG, PNG or WebP photos are accepted.', 'err.photo_size': 'The photo is too large.', 'err.cart': 'Your cart is empty or invalid.',
    'err.server': 'Something went wrong. Please try again.', 'err.csrf': 'Your session expired. Reload the page and try again.',
    'err.payment_unavailable': 'Card payment is unavailable. Try cash on delivery or come back later.',
    'ok.title': 'Thank you for your order', 'ok.text': 'We have received it and will contact you to confirm.', 'ok.ref': 'Order number', 'ok.home': 'Back to home',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type CKey = keyof (typeof copy)['bg'];
export const c = (lang: Lang) => (k: CKey): string => copy[lang][k];
