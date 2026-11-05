import { useRef, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';

export function HorizontalCarousel({
  children,
  ariaLabel,
  className,
}: {
  children: ReactNode;
  ariaLabel: string;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: -1 | 1) {
    scrollRef.current?.scrollBy({
      left: direction * 350,
      behavior: 'smooth',
    });
  }

  return (
    <div className="group/carousel relative w-full min-w-0">
      <button
        type="button"
        aria-label={`Voltar em ${ariaLabel}`}
        onClick={() => scrollBy(-1)}
        className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg ring-1 ring-slate-200 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 md:flex"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      <div
        ref={scrollRef}
        role="region"
        aria-label={ariaLabel}
        aria-roledescription="carrossel"
        className={cn(
          'flex w-full min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
          className,
        )}
      >
        {children}
      </div>
      <button
        type="button"
        aria-label={`Avançar em ${ariaLabel}`}
        onClick={() => scrollBy(1)}
        className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg ring-1 ring-slate-200 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 md:flex"
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
