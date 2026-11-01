import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageToggle = () => {
  const { language, toggleLanguage, t } = useLanguage();
  return (
    <button onClick={toggleLanguage} className="btn-secondary px-3 py-2 text-xs font-bold uppercase tracking-wide">
      {language === 'en' ? 'اردو' : 'EN'} · {t('language')}
    </button>
  );
};