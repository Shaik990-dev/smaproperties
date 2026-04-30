'use client';

import { useLang, type Lang } from './LanguageContext';
import { ChevronDown } from 'lucide-react';

const LANGS: { value: Lang; label: string; flag: string }[] = [
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'te', label: 'తెలుగు', flag: '🇮🇳' },
];

export function LanguageToggle() {
  const { lang, setLang } = useLang();
  const current = LANGS.find((l) => l.value === lang) ?? LANGS[0];

  return (
    <div className="relative">
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        className="appearance-none pl-7 pr-6 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold cursor-pointer focus:outline-none hover:bg-white/20 transition-colors"
        aria-label="Select language"
      >
        {LANGS.map((l) => (
          <option key={l.value} value={l.value} className="text-gray-900 bg-white font-medium">
            {l.flag} {l.label}
          </option>
        ))}
      </select>
      {/* Flag overlay */}
      <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-sm leading-none">
        {current.flag}
      </span>
      <ChevronDown size={11} className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-white/70" />
    </div>
  );
}
