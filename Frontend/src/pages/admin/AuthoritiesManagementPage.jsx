import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';

const AuthoritiesManagementPage = () => {
  const [authorities, setAuthorities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const { register: field, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const fetchAuthorities = () => {
    api.get(endpoints.admin.authorities).then(({ data }) => {
      setAuthorities(data?.data || data || []);
    }).catch(() => {});
  };

  useEffect(fetchAuthorities, []);

  const onSubmit = async (values) => {
    setMessage('');
    try {
      await api.post(endpoints.admin.addAuthority, values);
      setMessage('Authority created!');
      reset();
      setShowForm(false);
      fetchAuthorities();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed');
    }
  };

  const toggleBlockAuthority = async (authority) => {
    try {
      const url = authority.isBlocked
        ? endpoints.admin.unblockAuthority(authority.id)
        : endpoints.admin.blockAuthority(authority.id);
      await api.patch(url);
      fetchAuthorities();
    } catch (_) {}
  };

  const deleteAuthority = async (id) => {
    try {
      await api.delete(endpoints.admin.deleteAuthority(id));
      fetchAuthorities();
    } catch (_) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">Authorities</p>
          <h1 className="mt-2 section-title">Manage authority accounts</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Authority'}
        </button>
      </div>

      {message && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">{message}</div>
      )}

      {showForm && (
        <div className="soft-card p-6">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-text">Name</label>
                <input className="input-field" {...field('name', { required: 'Required' })} />
              </div>
              <div>
                <label className="label-text">Email</label>
                <input className="input-field" type="email" {...field('email', { required: 'Required' })} />
              </div>
              <div>
                <label className="label-text">Phone</label>
                <input className="input-field" {...field('phone', { required: 'Required' })} />
              </div>
              <div>
                <label className="label-text">Organization</label>
                <select className="input-field" {...field('organizationName', { required: 'Required' })}>
                  <option value="">Select</option>
                  <option value="KMC">KMC</option>
                  <option value="KE">KE</option>
                  <option value="Fire Brigade">Fire Brigade</option>
                  <option value="Water Board">Water Board</option>
                  <option value="Traffic Police">Traffic Police</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label-text">Password</label>
              <input className="input-field" type="password" {...field('password', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })} />
            </div>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating…' : 'Create Authority'}
            </button>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase text-slate-400">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Organization</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {authorities.map((a) => (
              <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-ink">{a.fullName}</td>
                <td className="px-4 py-3 text-slate-600">{a.email}</td>
                <td className="px-4 py-3 text-slate-600">{a.organization}</td>
                <td className="px-4 py-3 text-slate-600">{a.department || '—'}</td>
                <td className="px-4 py-3 space-x-3">
                  <button
                    type="button"
                    onClick={() => toggleBlockAuthority(a)}
                    className={`text-xs font-semibold hover:underline ${a.isBlocked ? 'text-emerald-600' : 'text-amber-600'}`}
                  >
                    {a.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                  <button type="button" onClick={() => deleteAuthority(a.id)} className="text-xs font-semibold text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuthoritiesManagementPage;