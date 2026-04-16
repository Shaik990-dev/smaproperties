'use client';

import { useLang } from './LanguageContext';

export function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'te' : 'en')}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold hover:bg-white/20 transition-colors"
      title={lang === 'en' ? 'తెలుగులో చూడండి' : 'Switch to English'}
    >
      <span className="text-sm">{lang === 'en' ? 'తె' : 'En'}</span>
      <span className="hidden sm:inline">{lang === 'en' ? 'తెలుగు' : 'English'}</span>
    </button>
  );
}
