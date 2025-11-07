import { ReactNode } from 'react';

interface AccessibleCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  badge?: {
    text: string;
    color: string;
    icon?: ReactNode;
  };
  footer?: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function AccessibleCard({
  title,
  description,
  children,
  onClick,
  selected = false,
  disabled = false,
  badge,
  footer,
  className = '',
  ariaLabel
}: AccessibleCardProps) {
  const CardWrapper = onClick ? 'button' : 'div';

  return (
    <CardWrapper
      onClick={onClick && !disabled ? onClick : undefined}
      disabled={disabled}
      aria-label={ariaLabel || `${title}${selected ? ', selected' : ''}`}
      aria-pressed={onClick ? selected : undefined}
      aria-describedby={description ? `${title.toLowerCase().replace(/\s+/g, '-')}-desc` : undefined}
      className={`
        relative bg-gradient-to-b from-white/5 to-transparent rounded-xl overflow-hidden
        transition-all duration-200 text-left w-full
        ${onClick && !disabled ? 'cursor-pointer hover:from-white/10' : ''}
        ${selected
          ? 'border-2 border-amber-500 ring-2 ring-amber-500/30'
          : 'border border-white/10'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${onClick && !disabled
          ? 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500'
          : ''
        }
        ${className}
      `}
    >
      {badge && (
        <div
          className={`absolute top-4 right-4 px-3 py-1 backdrop-blur-sm rounded-full
            text-xs font-medium border ${badge.color}`}
          aria-label={badge.text}
        >
          <span className="flex items-center space-x-1">
            {badge.icon}
            <span>{badge.text}</span>
          </span>
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
          {title}
        </h3>

        {description && (
          <p
            id={`${title.toLowerCase().replace(/\s+/g, '-')}-desc`}
            className="text-gray-400 text-sm mb-4"
          >
            {description}
          </p>
        )}

        {children}

        {footer && (
          <div className="mt-4 pt-4 border-t border-white/10">
            {footer}
          </div>
        )}
      </div>
    </CardWrapper>
  );
}
