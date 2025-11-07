import { useState, useEffect } from 'react';
import { AlertCircle, Check } from 'lucide-react';

interface SmartInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'password';
  placeholder?: string;
  required?: boolean;
  validate?: (value: string) => string | null;
  helperText?: string;
  autoValidate?: boolean;
  suggestions?: string[];
}

export function SmartInput({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  validate,
  helperText,
  autoValidate = true,
  suggestions = [],
}: SmartInputProps) {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (touched && autoValidate && validate) {
      const validationError = validate(value);
      setError(validationError);
      setIsValid(!validationError && value.length > 0);
    }
  }, [value, touched, autoValidate, validate]);

  const handleBlur = () => {
    setTouched(true);
    if (validate) {
      const validationError = validate(value);
      setError(validationError);
      setIsValid(!validationError && value.length > 0);
    }
  };

  const showError = touched && error;
  const showSuccess = touched && isValid && !error;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {required && <span className="text-amber-400 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:outline-none focus:ring-2 transition-all pr-10 ${
            showError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : showSuccess
              ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
              : 'border-white/10 focus:border-amber-500 focus:ring-amber-500/20'
          }`}
          placeholder={placeholder}
          required={required}
          aria-invalid={showError ? 'true' : 'false'}
          aria-describedby={showError ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          list={suggestions.length > 0 ? `${id}-suggestions` : undefined}
        />

        {showSuccess && (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" aria-hidden="true" />
        )}
        {showError && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" aria-hidden="true" />
        )}
      </div>

      {suggestions.length > 0 && (
        <datalist id={`${id}-suggestions`}>
          {suggestions.map((suggestion, index) => (
            <option key={index} value={suggestion} />
          ))}
        </datalist>
      )}

      {showError && (
        <p id={`${id}-error`} className="text-sm text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" aria-hidden="true" />
          {error}
        </p>
      )}

      {helperText && !showError && (
        <p id={`${id}-helper`} className="text-sm text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}
