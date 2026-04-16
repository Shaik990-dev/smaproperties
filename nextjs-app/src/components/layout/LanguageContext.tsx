'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Lang = 'en' | 'te';

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (en: string, te?: string) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (en) => en,
});

// UI translations
const UI_STRINGS: Record<string, { en: string; te: string }> = {
  home: { en: 'Home', te: 'హోమ్' },
  properties: { en: 'Properties', te: 'ఆస్తులు' },
  about: { en: 'About', te: 'మా గురించి' },
  contact: { en: 'Contact', te: 'సంప్రదించండి' },
  admin: { en: 'Admin', te: 'అడ్మిన్' },
  signIn: { en: 'Sign In', te: 'సైన్ ఇన్' },
  signOut: { en: 'Sign out', te: 'సైన్ అవుట్' },
  callUs: { en: 'Call Us', te: 'కాల్ చేయండి' },
  viewProperties: { en: 'View Properties', te: 'ఆస్తులు చూడండి' },
  whatsAppUs: { en: 'WhatsApp Us', te: 'వాట్సాప్ చేయండ���' },
  search: { en: 'Search by name, location, or tag...', te: 'పేరు, ప్రాంతం లేదా ట్యాగ్ ద్వారా వెతకండి...' },
  allProperties: { en: 'All Properties', te: 'అన్ని ఆస్తులు' },
  emiCalculator: { en: 'EMI Calculator', te: 'EMI కాలిక్యులేటర్' },
  favorites: { en: 'My Favorite Properties', te: 'నా ఇష్టమైన ఆస్తులు' },
  showing: { en: 'Showing', te: 'చూపిస్తోంది' },
  propertyText: { en: 'property', te: 'ఆస్తి' },
  propertiesText: { en: 'properties', te: 'ఆస్తులు' },
  clearFilters: { en: 'Clear filters', te: 'ఫిల్టర్లు తొలగించు' },
  noProperties: { en: 'No properties found.', te: '��స్తులు కనుగొనబడలేదు.' },
  view: { en: 'View', te: 'చూడండి' },
  similar: { en: 'Similar Properties', te: 'సారూప్య ఆస్తులు' },
  location: { en: 'Location', te: 'ప్రాంతం' },
  propertyDetails: { en: 'Property Details', te: 'ఆస్తి వివరాలు' },
  contactAgents: { en: 'Contact Our Agents', te: 'మా ఏజెంట్లను సంప్రదించండి' },
  quickLinks: { en: 'Quick Links', te: 'త్వరిత లింక్‌లు' },
  getInTouch: { en: 'Get in touch', te: 'సంప్రదించండి' },
  trustedBuilder: { en: "Nellore's Trusted Builders", te: 'నెల్లూరు నమ్మకమైన బిల్డర్లు' },
  happyClients: { en: 'Happy Clients', te: 'సంతోషకరమైన క్లయింట్లు' },
  projectsDone: { en: 'Projects Done', te: 'పూర్తయిన ప్రాజెక్ట్లు' },
  yearsExp: { en: 'Years Exp.', te: 'సంవత్సరాల అనుభవం' },
  activeListings: { en: 'Active Listings', te: 'యాక్టివ్ లిస్టింగ్‌లు' },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('sma-lang') as Lang;
    if (saved === 'te') setLangState('te');
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('sma-lang', l);
  };

  const t = (en: string, te?: string) => {
    if (lang === 'en') return en;
    // Check UI_STRINGS first by matching en value
    if (te) return te;
    const entry = Object.values(UI_STRINGS).find((v) => v.en === en);
    return entry?.te || en;
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
