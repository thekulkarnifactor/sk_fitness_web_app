import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';

interface AccessibleQuantityControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  id: string;
}

export function AccessibleQuantityControl({
  label,
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  unit = '',
  id
}: AccessibleQuantityControlProps) {
  const [announcement, setAnnouncement] = useState('');

  const handleDecrease = () => {
    if (value > min) {
      const newValue = Math.max(min, value - step);
      onChange(newValue);
      setAnnouncement(`${label} decreased to ${newValue} ${unit}`);
    } else {
      setAnnouncement(`${label} is at minimum value of ${min} ${unit}`);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      const newValue = Math.min(max, value + step);
      onChange(newValue);
      setAnnouncement(`${label} increased to ${newValue} ${unit}`);
    } else {
      setAnnouncement(`${label} is at maximum value of ${max} ${unit}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="font-medium">
        {label}
      </label>

      <div className="flex items-center space-x-3">
        <button
          onClick={handleDecrease}
          disabled={value <= min}
          aria-label={`Decrease ${label} by ${step} ${unit}`}
          className="p-1 hover:bg-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 transition-colors"
        >
          <Minus className="w-4 h-4" aria-hidden="true" />
        </button>

        <input
          type="number"
          id={id}
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          aria-label={`${label} in ${unit}`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          className="w-20 text-sm font-medium text-center py-1 bg-white/5 border border-white/10
            rounded focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
        />

        <span className="text-sm text-gray-400 w-8" aria-hidden="true">
          {unit}
        </span>

        <button
          onClick={handleIncrease}
          disabled={value >= max}
          aria-label={`Increase ${label} by ${step} ${unit}`}
          className="p-1 hover:bg-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 transition-colors"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}
