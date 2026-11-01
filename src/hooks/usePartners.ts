import { useQuery } from '@tanstack/react-query';
import { partnersApi } from '../api/partners';

/**
 * Lista pública de parceiros (GET /api/partners).
 * Usada para popular dinamicamente o filtro de parceiros nos catálogos.
 */
export function usePartners() {
  return useQuery({
    queryKey: ['partners', 'list'],
    queryFn: () => partnersApi.listPartners(),
  });
}
