import type { ProductKind, ProductSort } from '../../types/product';

/**
 * Opções de filtro do catálogo de destinos, alinhadas aos parâmetros
 * aceitos por GET /api/products: kind, provider, category, sort.
 */
export const KIND_OPTIONS: readonly { value: ProductKind; label: string }[] = [
  { value: 'vehicle', label: 'Veículo' },
  { value: 'package', label: 'Pacote' },
  { value: 'gear', label: 'Equipamento' },
  { value: 'experience', label: 'Experiência' },
  { value: 'destination', label: 'Destino' },
];

/** Fornecedores conhecidos (parâmetro `provider` do backend). */
export const PROVIDER_OPTIONS: readonly { value: string; label: string }[] = [
  { value: 'Rentcars', label: 'Rentcars' },
  { value: 'CVC', label: 'CVC' },
  { value: 'Booking', label: 'Booking' },
];

export const SORT_OPTIONS: readonly { value: ProductSort; label: string }[] = [
  { value: 'newest', label: 'Mais recentes' },
  { value: 'oldest', label: 'Mais antigos' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'name_asc', label: 'Nome (A-Z)' },
  { value: 'name_desc', label: 'Nome (Z-A)' },
  { value: 'display_order', label: 'Ordem de exibição' },
];

export const KIND_VALUES: readonly ProductKind[] = KIND_OPTIONS.map(
  (option) => option.value,
);

export const PROVIDER_VALUES: readonly string[] = PROVIDER_OPTIONS.map(
  (option) => option.value,
);

export const SORT_VALUES: readonly ProductSort[] = SORT_OPTIONS.map(
  (option) => option.value,
);

/** Ordenação padrão (mesma do backend quando `sort` não é enviado). */
export const DEFAULT_SORT: ProductSort = 'display_order';

/** "vehicle,package" -> ["vehicle", "package"], descartando valores fora do enum. */
export function parseEnumList<T extends string>(
  value: string | null,
  allowed: readonly T[],
): T[] {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item): item is T => allowed.includes(item as T));
}

/** Valores de `provider` da query string, validados contra a lista conhecida. */
export function parseProviderList(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => PROVIDER_VALUES.includes(item));
}
