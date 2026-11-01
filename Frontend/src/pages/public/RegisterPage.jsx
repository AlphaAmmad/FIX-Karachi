import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const RegisterPage = () => {
  const { register: field, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (values) => {
    setError('');
    try {
      await register(values);
      navigate('/citizen/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to register');
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      {/* Left */}
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">{t('register_badge')}</p>
        <h1 className="font-display text-4xl font-bold leading-tight text-ink md:text-5xl">
          {t('register_title')}
        </h1>
        <p className="max-w-xl text-base leading-8 text-slate-600">
          {t('register_subtitle')}
        </p>
      </div>

      {/* Right — form card */}
      <div className="soft-card p-6">
        <h2 className="section-title">{t('register_heading')}</h2>
        <p className="mt-1 text-sm text-slate-500">{t('register_join')}</p>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="label-text">{t('register_full_name')}</label>
            <input className="input-field" placeholder={t('register_full_name')} {...field('fullName', { required: 'Full name required' })} />
            {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="label-text">{t('register_email')}</label>
            <input className="input-field" type="email" placeholder="you@example.com" {...field('email', { required: 'Email required' })} />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label-text">{t('register_phone')}</label>
            <input className="input-field" placeholder="03xx xxxxxxx" {...field('phone')} />
          </div>

          <div>
            <label className="label-text">{t('register_password')}</label>
            <input className="input-field" type="password" placeholder="••••••••" {...field('password', { required: 'Password required', minLength: { value: 8, message: 'Min 8 characters' } })} />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? t('register_creating') : t('register_submit')}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          {t('register_have_account')}{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">{t('register_login_here')}</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;