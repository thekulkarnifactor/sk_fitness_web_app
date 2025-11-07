import { useEffect, useRef } from 'react';

interface ProgressIndicatorProps {
  label: string;
  current: number;
  target: number;
  icon?: React.ComponentType<{ className?: string }>;
  color: string;
  unit?: string;
  showPercentage?: boolean;
  announceChanges?: boolean;
}

export function ProgressIndicator({
  label,
  current,
  target,
  icon: Icon,
  color,
  unit = '',
  showPercentage = true,
  announceChanges = false
}: ProgressIndicatorProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const announceRef = useRef<HTMLDivElement>(null);
  const previousPercentageRef = useRef(percentage);

  useEffect(() => {
    if (announceChanges && announceRef.current) {
      const roundedPercentage = Math.round(percentage);
      const previousRounded = Math.round(previousPercentageRef.current);

      if (roundedPercentage !== previousRounded && roundedPercentage % 10 === 0) {
        announceRef.current.textContent =
          `${label}: ${current.toFixed(1)} ${unit}, ${roundedPercentage}% of target`;
      }

      previousPercentageRef.current = percentage;
    }
  }, [current, percentage, label, unit, announceChanges]);

  const status = percentage >= 100 ? 'complete' : percentage >= 80 ? 'near-complete' : 'in-progress';

  return (
    <>
      {announceChanges && (
        <div
          ref={announceRef}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />
      )}

      <div role="group" aria-label={`${label} progress`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {Icon && <Icon className={`w-5 h-5 ${color}`} aria-hidden="true" />}
            <span className="font-medium" id={`${label.toLowerCase()}-label`}>
              {label}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold" aria-label={`Current ${label}`}>
              {current.toFixed(1)}
              <span className="text-sm text-gray-400 ml-1">{unit}</span>
            </span>
          </div>
        </div>

        <div className="relative">
          <div
            role="progressbar"
            aria-valuenow={Math.round(percentage)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-labelledby={`${label.toLowerCase()}-label`}
            aria-valuetext={`${current.toFixed(1)} of ${target} ${unit}, ${Math.round(percentage)}%${
              status === 'complete' ? ' complete' : ''
            }`}
            className="w-full bg-white/10 rounded-full h-2 overflow-hidden"
          >
            <div
              className={`h-full ${color.replace('text-', 'bg-gradient-to-r from-').replace('-400', '-500 to-')}${color.replace('text-', '').replace('-400', '-500')} rounded-full transition-all duration-300`}
              style={{ width: `${percentage}%` }}
              aria-hidden="true"
            >
              {percentage >= 100 && (
                <span className="sr-only">Complete</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400">
            Target: {target} {unit}
          </span>
          {showPercentage && (
            <span
              className={`text-xs font-medium ${
                percentage >= 100 ? 'text-green-400' : percentage >= 80 ? 'text-amber-400' : 'text-gray-400'
              }`}
              aria-hidden="true"
            >
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      </div>
    </>
  );
}
