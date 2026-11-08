import { apiGet } from '../lib/http';
import type { ResolvedWidget } from '../types/widget';

/**
 * GET /api/widgets/resolve — rota pÚBLICA (X-Tenant-Slug).
 * Resolve a hierarquia de localização (cidade → estado → país → global)
 * e devolve o widget ativo correspondente, ou `null`.
 *
 * O tenant é resolvido no backend a partir do header `X-Tenant-Slug`
 * (enviado automaticamente pelo `apiGet` via `VITE_DEFAULT_TENANT_SLUG`).
 * O site público não usa JWT, então NÃO enviamos `tenant_id`.
 *
 * Envelope esperado: `{ success: true, data: widget | null }`.
 */
export const widgetsApi = {
  resolve: (params: { niche: string; location_id?: string | null }) => {
    const search = new URLSearchParams({ niche: params.niche });
    if (params.location_id) search.set('location_id', params.location_id);
    return apiGet<ResolvedWidget | null>(`/api/widgets/resolve?${search.toString()}`);
  },
};
