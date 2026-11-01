import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from '../translations/en.json';
import ur from '../translations/ur.json';

const LanguageContext = createContext(null);

const dictionaries = { en, ur };

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('fixkarachi_language');
    if (saved === 'en' || saved === 'ur') setLanguage(saved);
  }, []);

  const toggleLanguage = () => {
    setLanguage((current) => {
      const next = current === 'en' ? 'ur' : 'en';
      localStorage.setItem('fixkarachi_language', next);
      document.documentElement.lang = next;
      document.documentElement.dir = next === 'ur' ? 'rtl' : 'ltr';
      return next;
    });
  };

  const t = (key) => dictionaries[language][key] || key;

  const value = useMemo(() => ({ language, setLanguage, toggleLanguage, t }), [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};