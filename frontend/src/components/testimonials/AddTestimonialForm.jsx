import React, { useState } from 'react';
import StarRating from './StarRating';
import './AddTestimonialForm.css';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';

const getInitialFormData = (initialData) => ({
  name: initialData?.name || '',
  rating: initialData?.rating || 0,
  comment: initialData?.comment || initialData?.commentEn || '',
  commentHi: initialData?.commentHi || '',
  website: '',
});

const AddTestimonialForm = ({
  onSubmit,
  onCancel,
  darkMode,
  initialData = null,
  isEditing = false,
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [formData, setFormData] = useState(getInitialFormData(initialData));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t.reviewNameRequired;
    else if (formData.name.length < 2) newErrors.name = t.reviewNameMin;

    if (formData.rating === 0) newErrors.rating = t.reviewRatingRequired;

    if (!formData.comment.trim()) newErrors.comment = t.reviewCommentRequired;
    else if (formData.comment.length < 10) newErrors.comment = t.reviewCommentMin;
    else if (formData.comment.length > 500) newErrors.comment = t.reviewCommentMax;

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
      if (!isEditing) {
        setFormData(getInitialFormData());
      }
      setErrors({});
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData(getInitialFormData(initialData));
    setErrors({});
    if (onCancel) onCancel();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className={`add-testimonial-form ${darkMode ? 'add-testimonial-form-dark' : 'add-testimonial-form-light'}`}>
      <h3 className={`form-title ${darkMode ? 'form-title-dark' : 'form-title-light'}`}>
        {isEditing ? t.editReviewTitle : t.shareExperience}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group honeypot-field" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="review-name" className={darkMode ? 'label-dark' : 'label-light'}>{t.reviewNameLabel}</label>
          <input
            id="review-name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder={t.reviewNamePlaceholder}
            className={`${darkMode ? 'input-dark' : 'input-light'} ${errors.name ? 'error' : ''}`}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className={darkMode ? 'label-dark' : 'label-light'}>{t.reviewRatingLabel}</label>
          <StarRating
            rating={formData.rating}
            onRatingChange={(rating) => handleChange('rating', rating)}
            darkMode={darkMode}
          />
          {errors.rating && <span className="error-message">{errors.rating}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="review-comment" className={darkMode ? 'label-dark' : 'label-light'}>{t.reviewCommentLabel}</label>
          <textarea
            id="review-comment"
            value={formData.comment}
            onChange={(e) => handleChange('comment', e.target.value)}
            placeholder={t.reviewCommentPlaceholder}
            rows="4"
            className={`${darkMode ? 'textarea-dark' : 'textarea-light'} ${errors.comment ? 'error' : ''}`}
          />
          {errors.comment && <span className="error-message">{errors.comment}</span>}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className={`cancel-btn ${darkMode ? 'cancel-btn-dark' : 'cancel-btn-light'}`}
            disabled={submitting}
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            className={`submit-btn ${darkMode ? 'submit-btn-dark' : 'submit-btn-light'}`}
            disabled={submitting}
          >
            {submitting
              ? t.submittingReview
              : isEditing
                ? t.updateReview
                : t.submitReview}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTestimonialForm;
