import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';

const HomePage = () => {
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState({ total: 0, resolved: 0, pending: 0 });

  useEffect(() => {
    api.get('/public/dashboard').then(({ data }) => {
      const d = data?.data || data || {};
      setMetrics({ total: d.total || 0, resolved: d.resolved || 0, pending: d.pending || 0 });
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">
            {t('home_hero_badge')}
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-ink md:text-6xl">
            {t('home_hero_title')}
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            {t('home_hero_subtitle')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary">{t('home_start_reporting')}</Link>
            <Link to="/dashboard" className="btn-secondary">{t('home_open_dashboard')}</Link>
          </div>
        </div>

        {/* Stats card */}
        <div className="soft-card p-6">
          <p className="text-xl font-bold text-ink">{t('home_impact_snapshot')}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4 text-center">
              <p className="text-3xl font-bold text-ink">{metrics.total}</p>
              <p className="mt-1 text-sm text-slate-500">{t('home_total')}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4 text-center">
              <p className="text-3xl font-bold text-emerald-700">{metrics.resolved}</p>
              <p className="mt-1 text-sm text-slate-500">{t('home_resolved')}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4 text-center">
              <p className="text-3xl font-bold text-amber-700">{metrics.pending}</p>
              <p className="mt-1 text-sm text-slate-500">{t('home_pending')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-ink">{t('home_features_title')}</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            [t('home_feature_1_title'), t('home_feature_1_desc')],
            [t('home_feature_2_title'), t('home_feature_2_desc')],
            [t('home_feature_3_title'), t('home_feature_3_desc')],
            [t('home_feature_4_title'), t('home_feature_4_desc')],
          ].map(([title, text]) => (
            <div key={title} className="soft-card p-5">
              <p className="text-lg font-bold text-ink">{title}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;