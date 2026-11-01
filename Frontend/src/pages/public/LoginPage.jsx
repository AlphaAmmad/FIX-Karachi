import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const LoginPage = () => {
  const { register: field, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({ defaultValues: { role: 'citizen' } });
  const role = watch('role');
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (values) => {
    setError('');
    try {
      await login(values);
      if (values.role === 'admin') navigate('/admin/dashboard');
      else if (values.role === 'authority') navigate('/authority/dashboard');
      else navigate('/citizen/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login');
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      {/* Left */}
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">{t('login_badge')}</p>
        <h1 className="font-display text-4xl font-bold leading-tight text-ink md:text-5xl">
          {t('login_title')}
        </h1>
        <p className="max-w-xl text-base leading-8 text-slate-600">
          {t('login_subtitle')}
        </p>
      </div>

      {/* Right — form card */}
      <div className="soft-card p-6">
        <h2 className="section-title">{t('login_welcome')}</h2>
        <p className="mt-1 text-sm text-slate-500">{t('login_choose_role')}</p>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Role */}
          <div>
            <label className="label-text">{t('login_role')}</label>
            <select className="input-field" {...field('role')}>
              <option value="citizen">{t('login_role_citizen')}</option>
              <option value="authority">{t('login_role_authority')}</option>
              <option value="admin">{t('login_role_admin')}</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="label-text">{t('login_email')}</label>
            <input className="input-field" type="email" placeholder="you@example.com" {...field('email', { required: 'Email required' })} />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="label-text">{t('login_password')}</label>
            <input className="input-field" type="password" placeholder="••••••••" {...field('password', { required: 'Password required' })} />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? t('login_logging_in') : t('login_submit')}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          {t('login_need_account')}{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:underline">{t('login_register_here')}</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;