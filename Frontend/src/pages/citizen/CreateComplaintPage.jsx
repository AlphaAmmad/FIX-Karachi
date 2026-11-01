import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { CATEGORIES, PRIORITIES, PRIORITY_LABELS } from '../../config/constants';
import MapPicker from '../../components/maps/MapPicker';
import { useLanguage } from '../../context/LanguageContext';
import { compressImage } from '../../utils/compressImage';
import { suggestPriorityLabel } from '../../utils/suggestPriority';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

const QUEUE_KEY = 'fixkarachi-complaint-queue';

const CreateComplaintPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { register: field, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { title: '', description: '', category: '', priority: 'normal', area: 'Karachi', latitude: '', longitude: '' },
  });
  const online = useOnlineStatus();
  const [message, setMessage] = useState('');
  const [mapLocation, setMapLocation] = useState(null);
  const [queuedCount, setQueuedCount] = useState(0);
  const [showQueueBanner, setShowQueueBanner] = useState(false);
  const [draftData, setDraftData] = useState(null);
  const title = watch('title');
  const description = watch('description');
  const suggestedPriority = suggestPriorityLabel(`${title || ''} ${description || ''}`);

  // When map location changes, sync lat/lng into form
  const handleMapChange = (loc) => {
    setMapLocation(loc);
    setValue('latitude', loc.lat);
    setValue('longitude', loc.lng);

    // Reverse geocode to get area name (using free Nominatim API)
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.lng}&zoom=16`)
      .then((r) => r.json())
      .then((data) => {
        const area = data?.address?.suburb || data?.address?.neighbourhood || data?.address?.city_district || data?.address?.city || 'Karachi';
        setValue('area', area);
      })
      .catch(() => {});
  };

  useEffect(() => {
    try {
      const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
      setQueuedCount(queue.length);
      if (queue.length > 0 && navigator.onLine) setShowQueueBanner(true);
    } catch {
      setQueuedCount(0);
    }
  }, [online]);

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('fixkarachi-complaint-draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && (parsed.title || parsed.description || parsed.category || parsed.latitude)) {
          setDraftData(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const submitComplaint = async (values) => {
    const formData = new FormData();
    ['title', 'description', 'category', 'priority', 'area'].forEach((k) => {
      formData.append(k, values[k] || '');
    });
    formData.append('latitude', String(values.latitude));
    formData.append('longitude', String(values.longitude));

    const imageFile = values.image?.[0];
    if (!imageFile) {
      throw new Error('Photo is required');
    }
    const compressed = await compressImage(imageFile);
    formData.append('image', compressed, compressed.name || imageFile.name);

    await api.post(endpoints.complaints.create, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  };

  const submitQueuedComplaint = async () => {
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    if (!queue.length) return;

    const values = watch();
    const imageFile = values.image?.[0];
    if (!imageFile) {
      setMessage('Please re-attach a photo to submit your queued complaint.');
      return;
    }

    try {
      await submitComplaint({ ...queue[0], image: values.image });
      localStorage.setItem(QUEUE_KEY, JSON.stringify([]));
      localStorage.removeItem('fixkarachi-complaint-draft');
      setQueuedCount(0);
      setShowQueueBanner(false);
      setMessage('Queued complaint submitted successfully!');
      navigate('/citizen/complaints');
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || 'Failed to submit queued complaint');
    }
  };

  // Auto-detect location on mount
  React.useEffect(() => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setMapLocation(loc);
      setValue('latitude', loc.lat);
      setValue('longitude', loc.lng);
    });
  }, [setValue]);

  const onSubmit = async (values) => {
    setMessage('');

    if (!values.latitude || !values.longitude) {
      setMessage(t('create_pin_location'));
      return;
    }

    if (!online) {
      const queueItem = {
        title: values.title,
        description: values.description,
        category: values.category,
        priority: values.priority,
        area: values.area,
        latitude: values.latitude,
        longitude: values.longitude,
        savedAt: new Date().toISOString(),
        needsPhoto: true,
      };
      localStorage.setItem(QUEUE_KEY, JSON.stringify([queueItem]));
      setQueuedCount(1);
      setMessage('Saved Offline — Will Submit When Connected. Re-attach your photo when back online.');
      return;
    }

    try {
      await submitComplaint(values);
      localStorage.removeItem('fixkarachi-complaint-draft');
      navigate('/citizen/complaints');
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || 'Failed to submit complaint');
    }
  };

  // Offline draft support
  const saveDraft = () => {
    const values = watch();
    localStorage.setItem('fixkarachi-complaint-draft', JSON.stringify(values));
    setDraftData(values);
    setMessage(t('create_draft_saved'));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">{t('create_complaint_badge')}</p>
        <h1 className="mt-2 section-title">{t('create_complaint_title')}</h1>
        <p className="mt-1 text-sm text-slate-500">{t('create_complaint_subtitle')}</p>
      </div>

      {showQueueBanner && queuedCount > 0 && online && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span>You have {queuedCount} queued complaint{queuedCount > 1 ? 's' : ''}. Submit now?</span>
          <div className="flex gap-2">
            <button type="button" className="btn-primary text-xs" onClick={submitQueuedComplaint}>Submit now</button>
            <button type="button" className="btn-secondary text-xs" onClick={() => setShowQueueBanner(false)}>Dismiss</button>
          </div>
        </div>
      )}

      {draftData && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900">
          <span>
            📝 Found saved draft: <strong>{draftData.title || '(Untitled)'}</strong>
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-primary text-xs"
              onClick={() => {
                Object.keys(draftData).forEach((key) => {
                  if (key !== 'image') {
                    setValue(key, draftData[key]);
                  }
                });
                if (draftData.latitude && draftData.longitude) {
                  setMapLocation({ lat: parseFloat(draftData.latitude), lng: parseFloat(draftData.longitude) });
                }
                setDraftData(null);
                setMessage('Draft loaded successfully!');
              }}
            >
              Load Draft
            </button>
            <button
              type="button"
              className="btn-secondary text-xs"
              onClick={() => {
                localStorage.removeItem('fixkarachi-complaint-draft');
                setDraftData(null);
                setMessage('Draft discarded.');
              }}
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${message.includes('Failed') || message.includes('Please') || message.includes('پن') ? 'border-red-200 bg-red-50 text-red-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>
          {message}
        </div>
      )}

      <div className="soft-card p-6">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

          {/* Title */}
          <div>
            <label className="label-text">{t('create_title_label')}</label>
            <input className="input-field" placeholder={t('create_title_placeholder')} {...field('title', { required: t('create_title_label') + ' is required' })} />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="label-text">{t('create_desc_label')}</label>
            <textarea className="input-field" rows={4} placeholder={t('create_desc_placeholder')} {...field('description', { required: t('create_desc_label') + ' is required' })} />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
            {(title || description) && (
              <p className="mt-2 text-xs text-brand-600">
                Suggested priority: <span className="font-semibold">{suggestedPriority}</span>
              </p>
            )}
          </div>

          {/* Category + Priority */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-text">{t('create_category_label')}</label>
              <select className="input-field" {...field('category', { required: t('create_category_label') + ' is required' })}>
                <option value="">{t('create_category_placeholder')}</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{t('cat_' + cat.toLowerCase().replace(' ', '_'))}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
            </div>
            <div>
              <label className="label-text">{t('create_priority_label')}</label>
              <select className="input-field" {...field('priority', { required: t('create_priority_label') + ' is required' })}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{t('priority_' + p)}</option>
                ))}
              </select>
              {errors.priority && <p className="mt-1 text-xs text-red-500">{errors.priority.message}</p>}
            </div>
          </div>

          {/* Photo */}
          <div>
            <label className="label-text">{t('create_photo_label')}</label>
            <input type="file" accept="image/*" className="input-field" {...field('image', { required: 'Photo is required' })} />
            {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image.message}</p>}
          </div>

          {/* ===== MAP PICKER ===== */}
          <MapPicker value={mapLocation} onChange={handleMapChange} />

          {/* Hidden lat/lng fields for form validation */}
          <input type="hidden" {...field('latitude', { required: 'Please pin location on map' })} />
          <input type="hidden" {...field('longitude', { required: 'Please pin location on map' })} />

          {/* Area (auto-filled from reverse geocoding) */}
          <div>
            <label className="label-text">{t('create_area_label')}</label>
            <input className="input-field" placeholder="Auto-detected from map" {...field('area')} />
            <p className="mt-1 text-xs text-slate-400">{t('create_area_hint')}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? t('create_submitting') : online ? t('create_submit') : 'Saved Offline — Will Submit When Connected'}
            </button>
            <button type="button" className="btn-secondary" onClick={saveDraft}>
              {t('create_save_draft')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComplaintPage;