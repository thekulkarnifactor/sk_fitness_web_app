import { ReactNode, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  optional?: boolean;
}

export function FormSection({
  title,
  description,
  children,
  collapsible = false,
  defaultExpanded = true,
  optional = false,
}: FormSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const headerContent = (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">
          {title}
          {optional && <span className="text-sm text-gray-400 ml-2 font-normal">(Optional)</span>}
        </h2>
        {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
      </div>
      {collapsible && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? `Collapse ${title}` : `Expand ${title}`}
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-amber-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
      {collapsible ? (
        <>
          {headerContent}
          {isExpanded && <div className="mt-6">{children}</div>}
        </>
      ) : (
        <>
          <div className="mb-6">{headerContent}</div>
          {children}
        </>
      )}
    </div>
  );
}
