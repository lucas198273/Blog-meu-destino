import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';
import type { ProductNiche } from '../../types/product';

const niches: Array<{ value: ProductNiche; label: string; to: string }> = [
  { value: 'veiculos', label: 'Veículos', to: '/veiculos' },
  { value: 'equipamentos', label: 'Equipamentos', to: '/equipamentos' },
  { value: 'viagens', label: 'Viagens', to: '/pacotes-de-viagem' },
];

export function NicheTabs({
  onChange,
}: {
  onChange?: (niche: ProductNiche) => void;
}) {
  return (
    <nav
      aria-label="Categorias de produtos"
      className="mb-7 flex gap-2 overflow-x-auto border-b border-slate-200 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {niches.map((niche) => (
        <NavLink
          key={niche.value}
          to={niche.to}
          onClick={() => onChange?.(niche.value)}
          className={({ isActive }) =>
            cn(
              'whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors',
              isActive
                ? 'border-[var(--color-accent)] text-[var(--color-primary)]'
                : 'border-transparent text-slate-500 hover:text-slate-900',
            )
          }
        >
          {niche.label}
        </NavLink>
      ))}
    </nav>
  );
}
