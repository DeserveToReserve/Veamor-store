const H = 'M100 215C50 175 20 140 20 104C20 78 40 62 62 62C80 62 94 72 100 86C106 72 120 62 138 62C160 62 180 78 180 104C180 140 150 175 100 215Z';
const h = 'M0 8C-8 2-9-5-4-7C-1-8 0-5 0-4C0-5 1-8 4-7C9-5 8 2 0 8Z';

export default function ProductArt({ kind, className = '' }: { kind: 'locket' | 'bracelets' | 'infinity' | 'pair'; className?: string }) {
  return (
    <svg viewBox="0 0 200 230" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {kind === 'locket' && (<>
        <path d="M30 20L100 62L170 20" /><circle cx="100" cy="66" r="5" />
        <path d={H} transform="translate(100 150) scale(.9) translate(-100 -150)" />
        <path d={H} transform="translate(100 150) scale(.72) translate(-100 -150)" />
      </>)}
      {kind === 'bracelets' && (<>
        <circle cx="72" cy="120" r="52" /><circle cx="128" cy="120" r="52" />
        <circle cx="72" cy="68" r="8" /><circle cx="128" cy="68" r="8" />
        <path d={h} transform="translate(72 68) scale(.7)" /><path d={h} transform="translate(128 68) scale(.7)" />
      </>)}
      {kind === 'infinity' && (<>
        <path d="M100 115C72 72 28 72 28 115C28 158 72 158 100 115C128 72 172 72 172 115C172 158 128 158 100 115Z" />
        <path d="M0 115H28M172 115H200" />
      </>)}
      {kind === 'pair' && (<>
        <path d={H} transform="translate(6 30) scale(.66)" />
        <path d={H} transform="translate(8 40) scale(.66)" opacity=".35" />
        <path d={H} transform="translate(122 100) scale(.36)" />
      </>)}
    </svg>
  );
}
