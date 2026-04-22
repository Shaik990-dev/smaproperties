'use client';

import { useLang } from './LanguageContext';

export function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center rounded-full bg-white/10 border border-white/20 text-xs font-bold overflow-hidden">
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1.5 transition-colors ${
          lang === 'en' ? 'bg-white text-gray-900' : 'text-white/70 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('te')}
        className={`px-3 py-1.5 transition-colors ${
          lang === 'te' ? 'bg-white text-gray-900' : 'text-white/70 hover:text-white'
        }`}
      >
        తె
      </button>
    </div>
  );
}
