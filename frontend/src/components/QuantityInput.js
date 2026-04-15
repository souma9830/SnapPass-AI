import React from 'react';
import './QuantityInput.css';

/**
 * QuantityInput — stepper component to choose number of photos on a sheet.
 *
 * Props:
 *   value    (number)       — current quantity
 *   onChange (fn(number))  — called with new quantity
 *   min      (number)      — minimum value (default 1)
 *   max      (number)      — maximum value (default 24)
 */
function QuantityInput({ value = 6, onChange, min = 1, max = 24 }) {
  const decrement = () => {
    if (value > min) onChange && onChange(value - 1);
  };

  const increment = () => {
    if (value < max) onChange && onChange(value + 1);
  };

  const handleChange = (e) => {
    const num = parseInt(e.target.value, 10);
    if (!isNaN(num) && num >= min && num <= max) {
      onChange && onChange(num);
    }
  };

  return (
    <div className="qty-input">
      <span className="qty-input__label">Quantity per Sheet</span>
      <div className="qty-input__controls">
        <button
          className="qty-input__btn"
          onClick={decrement}
          disabled={value <= min}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <input
          className="qty-input__field"
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={handleChange}
          aria-label="Number of photos"
        />
        <button
          className="qty-input__btn"
          onClick={increment}
          disabled={value >= max}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <p className="qty-input__hint">Photos placed on one A4 sheet (max {max})</p>
    </div>
  );
}

export default QuantityInput;
