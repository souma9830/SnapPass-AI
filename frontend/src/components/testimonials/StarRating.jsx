import React from 'react';
import './StarRating.css';

const StarRating = ({ rating, onRatingChange, readonly = false, darkMode = false }) => {
  const handleClick = (index) => {
    if (!readonly && onRatingChange) {
      onRatingChange(index);
    }
  };

  return (
    <div
      className={`star-rating ${readonly ? 'star-rating-readonly' : ''}`}
      role={readonly ? undefined : 'radiogroup'}
      aria-label={readonly ? undefined : 'Rating'}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${star <= rating ? `filled-${darkMode ? 'dark' : 'light'}` : darkMode ? 'star-dark' : 'star-light'}`}
          onClick={() => handleClick(star)}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          aria-checked={!readonly && star === rating ? 'true' : 'false'}
          role={readonly ? undefined : 'radio'}
          tabIndex={readonly ? -1 : 0}
          disabled={readonly}
          style={{ cursor: readonly ? 'default' : 'pointer' }}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;