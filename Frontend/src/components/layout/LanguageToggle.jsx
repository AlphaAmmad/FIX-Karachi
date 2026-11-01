import React from 'react';
import Button from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';

const LanguageToggle = ({ variant = 'ghost', className = '' }) => {
  const { language, toggleLanguage } = useLanguage();
  return (
    <Button variant={variant} className={className} onClick={toggleLanguage}>
      {language === 'en' ? 'اردو' : 'English'}
    </Button>
  );
};

export default LanguageToggle;