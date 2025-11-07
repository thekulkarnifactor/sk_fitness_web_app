import { useState } from 'react';

interface AccessibleRangeProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  id: string;
  helpText?: string;
  showInput?: boolean;
}

export function AccessibleRange({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = '',
  id,
  helpText,
  showInput = true
}: AccessibleRangeProps) {
  const [localValue, setLocalValue] = useState(value.toString());

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    onChange(newValue);
    setLocalValue(newValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleInputBlur = () => {
    let newValue = Number(localValue);
    if (isNaN(newValue)) newValue = value;
    newValue = Math.max(min, Math.min(max, newValue));
    onChange(newValue);
    setLocalValue(newValue.toString());
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-white">
          {label}
        </label>
        {showInput && (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={localValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              min={min}
              max={max}
              step={step}
              aria-label={`${label} value`}
              className="w-24 px-3 py-1 bg-white/5 border border-white/10 rounded-lg
                text-amber-400 font-bold text-right
                focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
            />
            <span className="text-amber-400 font-bold text-sm">{unit}</span>
          </div>
        )}
      </div>

      <div className="relative">
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-600 transition-all duration-200"
            style={{ width: `${percentage}%` }}
            aria-hidden="true"
          />
        </div>

        <input
          type="range"
          id={id}
          value={value}
          onChange={handleSliderChange}
          min={min}
          max={max}
          step={step}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value} ${unit}`}
          aria-describedby={helpText ? `${id}-help` : undefined}
          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer
            focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:rounded-full"
        />
      </div>

      {!showInput && (
        <div className="text-right">
          <span className="text-2xl font-bold text-amber-400">
            {value} {unit}
          </span>
        </div>
      )}

      {helpText && (
        <p id={`${id}-help`} className="text-xs text-gray-400">
          {helpText}
        </p>
      )}

      <div className="flex justify-between text-xs text-gray-500" aria-hidden="true">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}
