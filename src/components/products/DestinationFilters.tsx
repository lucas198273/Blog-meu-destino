import { useId } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { usePartners } from '../../hooks/usePartners';
import { MobileFilterDrawer } from '../common/MobileFilterDrawer';
import type { ProductCategory } from '../../types/product';
import { FilterPillGroup } from './FilterPillGroup';
import { useLocations } from '../../hooks/useLocations';

export type ProductPageType = 'vehicle' | 'gear' | 'destination';

interface FilterOption {
  value: string;
  label: string;
}

interface DestinationFiltersProps {
  pageType?: ProductPageType;
  partner?: string;
  vehicleType?: string;
  minPrice?: string;
  maxPrice?: string;
  category?: string | null;
  location?: string;
  categories?: ProductCategory[];
  categoriesLoading?: boolean;
  activeCount: number;
  onPartnerChange?: (partner: string) => void;
  onVehicleTypeChange?: (vehicleType: string) => void;
  onMinPriceChange?: (price: string) => void;
  onMaxPriceChange?: (price: string) => void;
  onCategoryChange?: (category: string | null) => void;
  onLocationChange?: (location: string) => void;
  onClear?: () => void;
  className?: string;
}

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
  loading = false,
  emptyOptionLabel = 'Todos os parceiros',
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  loading?: boolean;
  emptyOptionLabel?: string;
  onChange: (value: string) => void;
}) {
  const generatedId = useId();
  const controlId = `${id}-${generatedId}`;

  return (
    <div>
      <label
        htmlFor={controlId}
        className="mb-2 block text-sm font-semibold text-slate-800"
      >
        {label}
      </label>
      <select
        id={controlId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
      >
        <option value="">
          {loading
            ? 'Carregando…'
            : options.length > 0
              ? emptyOptionLabel
              : 'Nenhuma opção cadastrada'}
        </option>
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
  partner = '',
  vehicleType = '',
  minPrice = '',
  maxPrice = '',
  category = null,
  location = '',
  categories = [],
  categoriesLoading = false,
  activeCount,
  onPartnerChange,
  onVehicleTypeChange,
  onMinPriceChange,
  onMaxPriceChange,
  onCategoryChange,
  onLocationChange,
  onClear,
  className,
}: DestinationFiltersProps) {
  const generatedId = useId();
  const { pathname } = useLocation();
  const type = pageType ?? getPageType(pathname);

  // Opções do filtro de parceiros — exclusivamente do retorno da API
  // pública (GET /api/partners). Sem listas fixas/fallback.
  const partnersQuery = usePartners();
  const locationsQuery = useLocations(type !== 'gear');
  const locationOptions = (locationsQuery.data ?? []).map((locationItem) => ({
    value: locationItem.slug,
    label: locationItem.nome,
  }));
  const partnersData = Array.isArray(partnersQuery.data)
    ? partnersQuery.data
    : [];
  const partnerOptions: FilterOption[] = partnersData.map(
    (partnerItem) => ({
      value:
        'slug' in partnerItem && typeof partnerItem.slug === 'string'
          ? partnerItem.slug
          : partnerItem.nome.toLowerCase().replace(/\s+/g, '-'),
      label: partnerItem.nome,
    }),
  );

  const filters = (
    <div
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
        <div className="grid gap-5">
          <SelectFilter
            id="vehicle-partner"
            label="Parceiro"
            value={partner}
            options={partnerOptions}
            loading={partnersQuery.isLoading}
            onChange={(value) => onPartnerChange?.(value)}
          />
          <SelectFilter
            id="vehicle-category"
            label="Categoria"
            value={category ?? ''}
            options={categories.map((item) => ({
              value: item.id,
              label: item.nome,
            }))}
            loading={categoriesLoading}
            onChange={(value) => onCategoryChange?.(value || null)}
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
        <div className="grid gap-5">
          <SelectFilter
            id="gear-partner"
            label="Parceiro"
            value={partner}
            options={partnerOptions}
            loading={partnersQuery.isLoading}
            onChange={(value) => onPartnerChange?.(value)}
          />
          <SelectFilter
            id="gear-category"
            label="Categoria"
            value={category ?? ''}
            options={categories.map((item) => ({
              value: item.id,
              label: item.nome,
            }))}
            loading={categoriesLoading}
            onChange={(value) => onCategoryChange?.(value || null)}
          />
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-slate-800">
              Faixa de preço
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <label className="sr-only" htmlFor={`gear-min-price-${generatedId}`}>
                Preço mínimo
              </label>
              <input
                id={`gear-min-price-${generatedId}`}
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
              <label className="sr-only" htmlFor={`gear-max-price-${generatedId}`}>
                Preço máximo
              </label>
              <input
                id={`gear-max-price-${generatedId}`}
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
        <div className="grid gap-5">
          <SelectFilter
            id="destination-partner"
            label="Parceiro"
            value={partner}
            options={partnerOptions}
            loading={partnersQuery.isLoading}
            onChange={(value) => onPartnerChange?.(value)}
          />
          <SelectFilter
            id="destination-category"
            label="Categoria"
            value={category ?? ''}
            options={categories.map((item) => ({
              value: item.slug,
              label: item.nome,
            }))}
            loading={categoriesLoading}
            emptyOptionLabel="Todas as categorias"
            onChange={(value) => onCategoryChange?.(value || null)}
          />
        </div>
      ) : null}

      {type !== 'gear' ? (
        <div className="mt-5 max-w-sm">
          <SelectFilter
            id="product-location"
            label="Localização (destino)"
            value={location}
            options={locationOptions}
            loading={locationsQuery.isLoading}
            emptyOptionLabel="Todos os destinos"
            onChange={(value) => onLocationChange?.(value)}
          />
          {locationsQuery.isError ? (
            <button
              type="button"
              onClick={() => locationsQuery.refetch()}
              className="mt-2 text-left text-xs text-red-700 underline"
            >
              Não foi possível carregar os destinos. Tentar novamente
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      <MobileFilterDrawer title="Filtros de produtos">{filters}</MobileFilterDrawer>
      <aside className="hidden lg:sticky lg:top-24 lg:block">
        {filters}
      </aside>
    </>
  );
}
