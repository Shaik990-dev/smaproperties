'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Lang = 'en' | 'te' | 'ta';

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (en: string, te?: string, ta?: string) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (en) => en,
});

// UI translations
const UI_STRINGS: Record<string, { en: string; te: string; ta: string }> = {
  home:            { en: 'Home',                              te: 'హోమ్',                          ta: 'முகப்பு' },
  properties:      { en: 'Properties',                        te: 'ఆస్తులు',                       ta: 'சொத்துக்கள்' },
  about:           { en: 'About',                             te: 'మా గురించి',                    ta: 'எங்களைப் பற்றி' },
  contact:         { en: 'Contact',                           te: 'సంప్రదించండి',                  ta: 'தொடர்பு' },
  admin:           { en: 'Admin',                             te: 'అడ్మిన్',                       ta: 'நிர்வாகி' },
  signIn:          { en: 'Sign In',                           te: 'సైన్ ఇన్',                      ta: 'உள்நுழைய' },
  signOut:         { en: 'Sign out',                          te: 'సైన్ అవుట్',                    ta: 'வெளியேறு' },
  callUs:          { en: 'Call Us',                           te: 'కాల్ చేయండి',                   ta: 'அழைக்கவும்' },
  viewProperties:  { en: 'View Properties',                   te: 'ఆస్తులు చూడండి',                ta: 'சொத்துக்களை காண்க' },
  whatsAppUs:      { en: 'WhatsApp Us',                       te: 'వాట్సాప్ చేయండి',               ta: 'வாட்ஸ்அப் செய்யுங்கள்' },
  search:          { en: 'Search by name, location, or tag...', te: 'పేరు, ప్రాంతం లేదా ట్యాగ్ ద్వారా వెతకండి...', ta: 'பெயர், இடம் அல்லது குறிச்சொல் மூலம் தேடவும்...' },
  allProperties:   { en: 'All Properties',                    te: 'అన్ని ఆస్తులు',                  ta: 'அனைத்து சொத்துக்கள்' },
  emiCalculator:   { en: 'EMI Calculator',                    te: 'EMI కాలిక్యులేటర్',              ta: 'EMI கணிப்பான்' },
  favorites:       { en: 'My Favorite Properties',            te: 'నా ఇష్టమైన ఆస్తులు',             ta: 'என் விருப்பமான சொத்துக்கள்' },
  showing:         { en: 'Showing',                           te: 'చూపిస్తోంది',                   ta: 'காட்டுகிறது' },
  propertyText:    { en: 'property',                          te: 'ఆస్తి',                         ta: 'சொத்து' },
  propertiesText:  { en: 'properties',                        te: 'ఆస్తులు',                       ta: 'சொத்துக்கள்' },
  clearFilters:    { en: 'Clear filters',                     te: 'ఫిల్టర్లు తొలగించు',              ta: 'வடிகட்டிகளை அழி' },
  noProperties:    { en: 'No properties found.',              te: 'ఆస్తులు కనుగొనబడలేదు.',          ta: 'சொத்துக்கள் எதுவும் கிடைக்கவில்லை.' },
  view:            { en: 'View',                              te: 'చూడండి',                        ta: 'காண்க' },
  similar:         { en: 'Similar Properties',                te: 'సారూప్య ఆస్తులు',                ta: 'ஒத்த சொத்துக்கள்' },
  location:        { en: 'Location',                          te: 'ప్రాంతం',                       ta: 'இடம்' },
  propertyDetails: { en: 'Property Details',                  te: 'ఆస్తి వివరాలు',                  ta: 'சொத்து விவரங்கள்' },
  contactAgents:   { en: 'Contact Our Agents',                te: 'మా ఏజెంట్లను సంప్రదించండి',      ta: 'எங்கள் முகவர்களை தொடர்பு கொள்ளுங்கள்' },
  quickLinks:      { en: 'Quick Links',                       te: 'త్వరిత లింక్‌లు',                ta: 'விரைவு இணைப்புகள்' },
  getInTouch:      { en: 'Get in touch',                      te: 'సంప్రదించండి',                  ta: 'தொடர்பு கொள்ளுங்கள்' },
  trustedBuilder:  { en: "Nellore's Trusted Builders",        te: 'నెల్లూరు నమ్మకమైన బిల్డర్లు',    ta: 'நெல்லூரின் நம்பகமான கட்டிடக்காரர்கள்' },
  happyClients:    { en: 'Happy Clients',                     te: 'సంతోషకరమైన క్లయింట్లు',          ta: 'மகிழ்ச்சியான வாடிக்கையாளர்கள்' },
  projectsDone:    { en: 'Projects Done',                     te: 'పూర్తయిన ప్రాజెక్ట్లు',          ta: 'முடிந்த திட்டங்கள்' },
  yearsExp:        { en: 'Years Exp.',                        te: 'సంవత్సరాల అనుభవం',               ta: 'ஆண்டுகள் அனுபவம்' },
  activeListings:  { en: 'Active Listings',                   te: 'యాక్టివ్ లిస్టింగ్‌లు',           ta: 'செயலில் உள்ள பட்டியல்கள்' },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('sma-lang') as Lang;
    if (saved === 'te' || saved === 'ta') setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('sma-lang', l);
  };

  const t = (en: string, te?: string, ta?: string) => {
    if (lang === 'en') return en;
    const entry = Object.values(UI_STRINGS).find((v) => v.en === en);
    if (lang === 'te') return te || entry?.te || en;
    if (lang === 'ta') return ta || entry?.ta || en;
    return en;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

export { UI_STRINGS };
