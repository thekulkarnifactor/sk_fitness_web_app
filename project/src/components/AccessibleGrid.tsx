import { useRef, useEffect, KeyboardEvent } from 'react';

interface GridItem {
  id: string;
  content: React.ReactNode;
  ariaLabel: string;
}

interface AccessibleGridProps {
  items: GridItem[];
  columns?: number;
  selectedId?: string;
  onSelect: (id: string) => void;
  className?: string;
  gridLabel: string;
}

export function AccessibleGrid({
  items,
  columns = 3,
  selectedId,
  onSelect,
  className = '',
  gridLabel
}: AccessibleGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const currentFocusRef = useRef<number>(0);

  useEffect(() => {
    if (selectedId) {
      const index = items.findIndex(item => item.id === selectedId);
      if (index !== -1) {
        currentFocusRef.current = index;
      }
    }
  }, [selectedId, items]);

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    const rows = Math.ceil(items.length / columns);
    let newIndex = index;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newIndex = Math.min(index + 1, items.length - 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = Math.max(index - 1, 0);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newIndex = Math.min(index + columns, items.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = Math.max(index - columns, 0);
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect(items[index].id);
        return;
      default:
        return;
    }

    if (newIndex !== index) {
      currentFocusRef.current = newIndex;
      const buttons = gridRef.current?.querySelectorAll('button');
      if (buttons && buttons[newIndex]) {
        (buttons[newIndex] as HTMLButtonElement).focus();
      }
    }
  };

  return (
    <div
      ref={gridRef}
      role="grid"
      aria-label={gridLabel}
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: '1rem'
      }}
    >
      {items.map((item, index) => {
        const isSelected = item.id === selectedId;
        const isFocused = index === currentFocusRef.current;
        const row = Math.floor(index / columns) + 1;
        const col = (index % columns) + 1;

        return (
          <div key={item.id} role="gridcell">
            <button
              onClick={() => onSelect(item.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={index === 0 ? 0 : -1}
              aria-label={item.ariaLabel}
              aria-selected={isSelected}
              aria-rowindex={row}
              aria-colindex={col}
              className={`
                w-full p-6 rounded-xl border-2 transition-all
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-amber-500
                ${isSelected
                  ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
                }
              `}
            >
              {item.content}
            </button>
          </div>
        );
      })}
    </div>
  );
}
