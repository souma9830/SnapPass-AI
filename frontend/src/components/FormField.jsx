import React from 'react';
import './FormField.css';

function FormField({
  label,
  name,
  type = 'text',
  value,
  error,
  touched,
  placeholder,
  onChange,
  onBlur,
  disabled,
  required,
  options,
  helpText,
  children,
  className,
}) {
  const showError = touched && error;
  const fieldId = `field-${name}`;

  const renderInput = () => {
    if (children) return children;

    if (type === 'select') {
      return (
        <select
          id={fieldId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={`form-field__select ${showError ? 'form-field__input--error' : ''}`}
          aria-invalid={!!showError}
          aria-describedby={showError ? `${fieldId}-error` : undefined}
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (type === 'checkbox') {
      return (
        <label className="form-field__checkbox-label">
          <input
            id={fieldId}
            name={name}
            type="checkbox"
            checked={!!value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={`form-field__checkbox ${showError ? 'form-field__input--error' : ''}`}
            aria-invalid={!!showError}
            aria-describedby={showError ? `${fieldId}-error` : undefined}
          />
          <span className="form-field__checkbox-text">{label}</span>
        </label>
      );
    }

    return (
      <input
        id={fieldId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`form-field__input ${showError ? 'form-field__input--error' : ''}`}
        aria-invalid={!!showError}
        aria-describedby={showError ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
      />
    );
  };

  return (
    <div className={`form-field ${className || ''} ${type === 'checkbox' ? 'form-field--checkbox' : ''}`}>
      {label && type !== 'checkbox' && (
        <label htmlFor={fieldId} className="form-field__label">
          {label}
          {required && <span className="form-field__required" aria-hidden="true"> *</span>}
        </label>
      )}
      {renderInput()}
      {helpText && !showError && (
        <p id={`${fieldId}-help`} className="form-field__help">
          {helpText}
        </p>
      )}
      {showError && (
        <p id={`${fieldId}-error`} className="form-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
