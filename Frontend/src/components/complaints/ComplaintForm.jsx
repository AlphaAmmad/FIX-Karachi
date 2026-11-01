import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Textarea from '../common/Textarea';
import { CATEGORIES, PRIORITIES } from '../../config/constants';

const ComplaintForm = ({ initialValues, onSubmit, offlineDraftKey = 'fixkarachi-complaint-draft' }) => {
  const { register, control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({ defaultValues: initialValues });
  const location = watch('location');

  React.useEffect(() => {
    if (!location?.lat || !location?.lng) {
      navigator.geolocation?.getCurrentPosition((position) => {
        setValue('location', { lat: position.coords.latitude, lng: position.coords.longitude });
        setValue('latitude', position.coords.latitude);
        setValue('longitude', position.coords.longitude);
      });
    }
  }, [location, setValue]);

  const persistDraft = async (values) => {
    localStorage.setItem(offlineDraftKey, JSON.stringify(values));
  };

  const submit = async (values) => {
    if (!navigator.onLine) {
      await persistDraft(values);
      return { offline: true };
    }
    return onSubmit(values);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(submit)}>
      <div>
        <label className="label-text">Title</label>
        <input className="input-field" placeholder="Broken road near school" {...register('title', { required: 'Title is required' })} />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label className="label-text">Description</label>
        <textarea className="input-field" rows={6} placeholder="Describe the issue in detail" {...register('description', { required: 'Description is required' })} />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label-text">Category</label>
          <select className="input-field" {...register('category', { required: 'Category is required' })}>
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
        </div>
        <div>
          <label className="label-text">Priority</label>
          <select className="input-field" {...register('priority', { required: 'Priority is required' })}>
            <option value="">Select priority</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
          {errors.priority && <p className="mt-1 text-xs text-red-500">{errors.priority.message}</p>}
        </div>
      </div>

      <div>
        <label className="label-text">Image Upload</label>
        <input type="file" accept="image/*" className="input-field" {...register('image', { required: 'Image is required' })} />
        {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image.message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label-text">Latitude</label>
          <input className="input-field" type="number" step="any" {...register('latitude', { required: 'Latitude required' })} />
        </div>
        <div>
          <label className="label-text">Longitude</label>
          <input className="input-field" type="number" step="any" {...register('longitude', { required: 'Longitude required' })} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {navigator.onLine ? 'Submit Complaint' : 'Save Draft'}
        </button>
        <button type="button" className="btn-secondary" onClick={() => persistDraft(watch())}>
          Save Draft
        </button>
      </div>
    </form>
  );
};

export default ComplaintForm;