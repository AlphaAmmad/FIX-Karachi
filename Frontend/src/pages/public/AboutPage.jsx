import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">{t('about_badge')}</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">{t('about_title')}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          {t('about_desc')}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[
          [t('about_card_1_title'), t('about_card_1_desc')],
          [t('about_card_2_title'), t('about_card_2_desc')],
          [t('about_card_3_title'), t('about_card_3_desc')],
        ].map(([title, text]) => (
          <div key={title} className="soft-card p-6">
            <h3 className="text-xl font-bold text-ink">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;