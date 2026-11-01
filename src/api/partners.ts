import { apiGet } from '../lib/http';
import type { Partner } from '../types/product';

/**
 * Rota pública de parceiros (somente GET, anônima):
 * - GET /api/partners → devolve um array direto em `data` (sem paginação).
 */
export const partnersApi = {
  listPartners: () => apiGet<Partner[]>('/api/partners'),
};
