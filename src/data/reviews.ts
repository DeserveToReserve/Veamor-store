import type { Lang } from '../i18n/ui';

/**
 * ПРИМЕРНИ ревюта и снимки – само за дизайн и тестване на секцията „За всеки повод“.
 * Преди пускане на сайта ги замени с РЕАЛНИ мнения на клиенти (със съгласието им) и с техни снимки:
 * публикуването на измислени ревюта като истински е заблуждаваща търговска практика.
 * Снимките са в public/reviews/ – подмени файловете с еднакви имена или промени `photo`.
 */
export type Review = {
  photo: string;                       // път от /public
  name: string;                        // подпис върху листчето
  product: string;                     // slug на продукта, към който води бутонът
  quote: Record<Lang, string>;
};

// Редът съвпада с 'occ.1' … 'occ.5' в i18n/home.ts
export const occasionStories: readonly (readonly [Review, Review])[] = [
  // 1 · Годишнина
  [
    { photo: '/reviews/an-1.webp', name: 'Стефан Д.', product: 'heart-locket',
      quote: {
        bg: '„Подарих медальона на приятелката ми за годишнината ни. Беше най-хубавият подарък! Препоръчвам горещо.“',
        en: '“I gave the locket to my girlfriend for our anniversary. It was the best gift ever! Highly recommend.”',
      } },
    { photo: '/reviews/an-2.webp', name: 'Десислава Н.', product: 'heart-locket',
      quote: {
        bg: '„Страхотно качество и невероятен спомен! Медальонът надмина очакванията ми. Благодарим ви за емоцията!“',
        en: '“Great quality and an unforgettable keepsake! The locket exceeded my expectations. Thank you for the emotion!”',
      } },
  ],
  // 2 · Рожден ден
  [
    { photo: '/reviews/bd-1.webp', name: 'Калина М.', product: 'heart-locket',
      quote: {
        bg: '„Поръчах го за 30-ия рожден ден на сестра ми и тя се разплака още щом го отвори. Снимката е толкова ясна!“',
        en: '“I ordered it for my sister’s 30th birthday and she cried the moment she opened it. The photo is so clear!”',
      } },
    { photo: '/reviews/bd-2.webp', name: 'Георги П.', product: 'heart-locket',
      quote: {
        bg: '„Стигна за два дни и беше опакован красиво. Сложих стара снимка с мама и баба – нямам думи.“',
        en: '“It arrived in two days, beautifully wrapped. I put in an old photo of mum and grandma – I have no words.”',
      } },
  ],
  // 3 · Свети Валентин
  [
    { photo: '/reviews/vd-1.webp', name: 'Виктория Т.', product: 'projection-bracelets',
      quote: {
        bg: '„Взехме гривните за 14-ти февруари. Гледаш през малкото стъкълце и виждаш нас двамата. Носим ги всеки ден.“',
        en: '“We got the bracelets for Valentine’s Day. You look through the tiny lens and see the two of us. We wear them every day.”',
      } },
    { photo: '/reviews/vd-2.webp', name: 'Александра С.', product: 'heart-locket',
      quote: {
        bg: '„Страх ме беше да не закъснее за Свети Валентин, но пристигна два дни по-рано. Той остана безмълвен!“',
        en: '“I was afraid it would miss Valentine’s Day, but it came two days early. He was speechless!”',
      } },
  ],
  // 4 · За мама
  [
    { photo: '/reviews/mm-1.webp', name: 'Радост К.', product: 'mother-daughter-necklaces',
      quote: {
        bg: '„Колиетата за мама и мен са перфектни. Гравирахме ги и сега и двете не ги сваляме. Мама плака от радост.“',
        en: '“The necklaces for mum and me are perfect. We had them engraved and now neither of us takes them off. Mum cried happy tears.”',
      } },
    { photo: '/reviews/mm-2.webp', name: 'Борислав Л.', product: 'mother-daughter-necklaces',
      quote: {
        bg: '„Подарък за Деня на майката, който наистина докосна сърцето ѝ. Опакован е толкова нежно, че се чувства специален.“',
        en: '“A Mother’s Day gift that truly touched her heart. It is wrapped so gently that it feels special.”',
      } },
  ],
  // 5 · Просто така
  [
    { photo: '/reviews/jb-1.webp', name: 'Мартин Ц.', product: 'infinity-bracelets',
      quote: {
        bg: '„Купих го без повод – просто защото си мислех за нея. Реакцията ѝ си заслужаваше всяка стотинка.“',
        en: '“I bought it for no reason – just because I was thinking of her. Her reaction was worth every penny.”',
      } },
    { photo: '/reviews/jb-2.webp', name: 'Нели В.', product: 'heart-locket',
      quote: {
        bg: '„Поръчах си го сама, със стара снимка на дядо ми. Нося го всеки ден близо до сърцето. Благодаря!“',
        en: '“I ordered it for myself, with an old photo of my grandfather. I wear it every day close to my heart. Thank you!”',
      } },
  ],
];
