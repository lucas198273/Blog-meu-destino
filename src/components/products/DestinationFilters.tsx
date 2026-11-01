import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/cn';
import type { ProductCategory } from '../../types/product';
import { CategoryPills } from '../blog/CategoryPills';
import { FilterPillGroup } from './FilterPillGroup';

export type ProductPageType = 'vehicle' | 'gear' | 'destination';

interface FilterOption {
  value: string;
  label: string;
}

interface DestinationFiltersProps {
  pageType?: ProductPageType;
  provider?: string;
  vehicleType?: string;
  minPrice?: string;
  maxPrice?: string;
  category?: string | null;
  categories?: ProductCategory[];
  categoriesLoading?: boolean;
  activeCount: number;
  onProviderChange?: (provider: string) => void;
  onVehicleTypeChange?: (vehicleType: string) => void;
  onMinPriceChange?: (price: string) => void;
  onMaxPriceChange?: (price: string) => void;
  onCategoryChange?: (category: string | null) => void;
  onClear?: () => void;
  className?: string;
}

const VEHICLE_PARTNERS: FilterOption[] = [
  { value: 'rentcars', label: 'Rentcars' },
  { value: 'localiza', label: 'Localiza' },
  { value: 'movida', label: 'Movida' },
];

const GEAR_PARTNERS: FilterOption[] = [
  { value: 'amazon', label: 'Amazon' },
  { value: 'magalu', label: 'Magalu' },
  { value: 'mercado-livre', label: 'Mercado Livre' },
  { value: 'decathlon', label: 'Decathlon' },
];

const VEHICLE_TYPES: FilterOption[] = [
  { value: 'suv', label: 'SUV' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'economico', label: 'Econômico' },
  { value: 'luxo', label: 'Luxo' },
];

function getPageType(pathname: string): ProductPageType {
  if (pathname.startsWith('/aluguel-de-veiculos')) return 'vehicle';
  if (pathname.startsWith('/equipamentos')) return 'gear';
  return 'destination';
}

function SelectFilter({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-800"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
      >
        <option value="">Todos os parceiros</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function DestinationFilters({
  pageType,
  provider = '',
  vehicleType = '',
  minPrice = '',
  maxPrice = '',
  category = null,
  categories = [],
  categoriesLoading = false,
  activeCount,
  onProviderChange,
  onVehicleTypeChange,
  onMinPriceChange,
  onMaxPriceChange,
  onCategoryChange,
  onClear,
  className,
}: DestinationFiltersProps) {
  const { pathname } = useLocation();
  const type = pageType ?? getPageType(pathname);

  return (
    <aside
      aria-label="Filtros de produtos"
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5',
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-900">Refinar busca</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Encontre a opção ideal para você
          </p>
        </div>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={() => onClear?.()}
            className="shrink-0 text-xs font-semibold text-teal-800 underline-offset-4 hover:underline"
          >
            Limpar
          </button>
        ) : null}
      </div>

      {type === 'vehicle' ? (
        <div className="grid gap-5 md:grid-cols-2">
          <SelectFilter
            id="vehicle-partner"
            label="Parceiro"
            value={provider}
            options={VEHICLE_PARTNERS}
            onChange={(value) => onProviderChange?.(value)}
          />
          <FilterPillGroup
            label="Tipo de veículo"
            options={VEHICLE_TYPES}
            selected={vehicleType ? [vehicleType] : []}
            onToggle={(value) =>
              onVehicleTypeChange?.(value === vehicleType ? '' : value)
            }
          />
        </div>
      ) : null}

      {type === 'gear' ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectFilter
            id="gear-partner"
            label="Parceiro"
            value={provider}
            options={GEAR_PARTNERS}
            onChange={(value) => onProviderChange?.(value)}
          />
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-slate-800">
              Faixa de preço
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <label className="sr-only" htmlFor="gear-min-price">
                Preço mínimo
              </label>
              <input
                id="gear-min-price"
                type="number"
                min="0"
                step="1"
                inputMode="decimal"
                placeholder="Mínimo"
                value={minPrice}
                onChange={(event) =>
                  onMinPriceChange?.(event.target.value)
                }
                className="min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
              />
              <label className="sr-only" htmlFor="gear-max-price">
                Preço máximo
              </label>
              <input
                id="gear-max-price"
                type="number"
                min="0"
                step="1"
                inputMode="decimal"
                placeholder="Máximo"
                value={maxPrice}
                onChange={(event) =>
                  onMaxPriceChange?.(event.target.value)
                }
                className="min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
              />
            </div>
          </fieldset>
        </div>
      ) : null}

      {type === 'destination' ? (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            Explore por região
          </h3>
          <CategoryPills
            categories={categories}
            activeSlug={category}
            onSelect={(value) => onCategoryChange?.(value)}
            loading={categoriesLoading}
            ariaLabel="Filtrar pacotes por categoria"
            allLabel="Todas as regiões"
          />
        </div>
      ) : null}
    </aside>
  );
}
