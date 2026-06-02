import React, { useState } from 'react';
import StarRating from './StarRating';
import './AddTestimonialForm.css';

const AddTestimonialForm = ({ onSubmit, onCancel, darkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    rating: 0,
    comment: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    
    if (formData.rating === 0) newErrors.rating = 'Please select a rating';
    
    if (!formData.comment.trim()) newErrors.comment = 'Comment is required';
    else if (formData.comment.length < 10) newErrors.comment = 'Comment must be at least 10 characters';
    else if (formData.comment.length > 500) newErrors.comment = 'Comment must be less than 500 characters';
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        id: Date.now(),
        ...formData,
        date: new Date().toISOString()
      });
      setFormData({ name: '', rating: 0, comment: '' });
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', rating: 0, comment: '' });
    setErrors({});
    if (onCancel) onCancel();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className={`add-testimonial-form ${darkMode ? 'add-testimonial-form-dark' : 'add-testimonial-form-light'}`}>
      <h3 className={`form-title ${darkMode ? 'form-title-dark' : 'form-title-light'}`}>
        Share Your Experience
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className={darkMode ? 'label-dark' : 'label-light'}>Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter your name"
            className={`${darkMode ? 'input-dark' : 'input-light'} ${errors.name ? 'error' : ''}`}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
        
        <div className="form-group">
          <label className={darkMode ? 'label-dark' : 'label-light'}>Rating *</label>
          <StarRating 
            rating={formData.rating}
            onRatingChange={(rating) => handleChange('rating', rating)}
            darkMode={darkMode}
          />
          {errors.rating && <span className="error-message">{errors.rating}</span>}
        </div>
        
        <div className="form-group">
          <label className={darkMode ? 'label-dark' : 'label-light'}>Your Review *</label>
          <textarea
            value={formData.comment}
            onChange={(e) => handleChange('comment', e.target.value)}
            placeholder="Share your experience with SnapPass AI..."
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
          >
            Cancel
          </button>
          <button type="submit" className={`submit-btn ${darkMode ? 'submit-btn-dark' : 'submit-btn-light'}`}>
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTestimonialForm;