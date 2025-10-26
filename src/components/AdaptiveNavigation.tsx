interface NavigationItem {
  key: string;
  label: string;
  value: 'list' | 'calendar' | 'photos' | 'contacts' ;
}

interface AdaptiveNavigationProps {
  items: NavigationItem[];
  currentView: string;
  onViewChange: (view: 'list' | 'calendar' | 'photos' | 'contacts' ) => void;
  className?: string;
}

export default function AdaptiveNavigation({ 
  items, 
  currentView, 
  onViewChange, 
  className = "" 
}: AdaptiveNavigationProps) {
  return (
    <nav className={`adaptive-nav flex flex-wrap items-center justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 ${className}`}>
      {items.map((item) => (
        <button 
          key={item.key}
          onClick={() => onViewChange(item.value)}
          className={`
            nav-item whitespace-nowrap px-2 py-1.5 sm:px-3 sm:py-2 
            text-xs sm:text-sm md:text-base rounded-lg 
            hover:text-primary hover:bg-accent/50 transition-all duration-200
            ${currentView === item.value 
              ? 'text-primary font-medium bg-accent shadow-sm border border-primary/20' 
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
