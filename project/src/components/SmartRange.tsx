import { useState, useEffect } from 'react';

interface SmartRangeProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  showInput?: boolean;
  suggestions?: Array<{ label: string; value: number }>;
  helperText?: string;
}

export function SmartRange({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  showInput = true,
  suggestions = [],
  helperText,
}: SmartRangeProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    const numValue = Number(newValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = Number(inputValue);
    if (isNaN(numValue) || numValue < min || numValue > max) {
      setInputValue(value.toString());
    }
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-medium">
          {label}
        </label>
        {showInput && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onBlur={handleInputBlur}
              min={min}
              max={max}
              step={step}
              className="w-20 px-3 py-1 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-amber-500 text-right"
              aria-label={`${label} value`}
            />
            <span className="text-amber-400 font-bold">{unit}</span>
          </div>
        )}
        {!showInput && (
          <span className="text-2xl font-bold text-amber-400">
            {value} {unit}
          </span>
        )}
      </div>

      <div className="relative">
        <input
          id={id}
          type="range"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer range-slider"
          style={{
            background: `linear-gradient(to right, rgb(245, 158, 11) 0%, rgb(251, 191, 36) ${percentage}%, rgb(255 255 255 / 0.1) ${percentage}%, rgb(255 255 255 / 0.1) 100%)`,
          }}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onChange(suggestion.value)}
              className={`px-3 py-1 text-xs rounded-full transition-all ${
                value === suggestion.value
                  ? 'bg-amber-500 text-black font-semibold'
                  : 'bg-white/5 border border-white/10 hover:border-amber-500/50'
              }`}
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      )}

      {helperText && <p className="text-sm text-gray-400">{helperText}</p>}

      <style>
        {`
          .range-slider::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgb(245, 158, 11), rgb(251, 191, 36));
            cursor: pointer;
            border: 2px solid black;
            box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
          }
          .range-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgb(245, 158, 11), rgb(251, 191, 36));
            cursor: pointer;
            border: 2px solid black;
            box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
          }
        `}
      </style>
    </div>
  );
}
