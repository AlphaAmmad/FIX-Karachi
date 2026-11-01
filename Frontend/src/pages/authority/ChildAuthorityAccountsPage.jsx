import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';

const ChildAuthorityAccountsPage = () => {
  const { register: field, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [message, setMessage] = useState('');

  const onSubmit = async (values) => {
    setMessage('');
    try {
      await api.post(endpoints.authority.childAccounts, values);
      setMessage('Child authority account created successfully!');
      reset();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create account');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">Child Accounts</p>
        <h1 className="mt-2 section-title">Create a sub-authority account</h1>
        <p className="mt-1 text-sm text-slate-500">Child accounts inherit your organization and can manage complaints within the same scope.</p>
      </div>

      {message && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">{message}</div>
      )}

      <div className="soft-card p-6">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="label-text">Full Name</label>
            <input className="input-field" placeholder="Officer name" {...field('name', { required: 'Name required' })} />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-text">Email</label>
              <input className="input-field" type="email" placeholder="officer@org.pk" {...field('email', { required: 'Email required' })} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label-text">Phone</label>
              <input className="input-field" placeholder="03xx xxxxxxx" {...field('phone', { required: 'Phone required' })} />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
            </div>
          </div>
          <div>
            <label className="label-text">Department / Org Name</label>
            <input className="input-field" placeholder="Sub-department" {...field('organizationName', { required: 'Organization required' })} />
          </div>
          <div>
            <label className="label-text">Password</label>
            <input className="input-field" type="password" placeholder="••••••••" {...field('password', { required: 'Password required', minLength: { value: 8, message: 'Min 8 characters' } })} />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating…' : 'Create Child Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChildAuthorityAccountsPage;