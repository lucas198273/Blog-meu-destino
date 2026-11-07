import { apiGet } from '../lib/http';
import type { ResolvedWidget } from '../types/widget';

/**
 * GET /api/widgets/resolve — rota pública (X-Tenant-Slug).
 * Resolve a hierarquia de localização (cidade → estado → país → global)
 * e devolve o widget ativo correspondente, ou `null`.
 * O backend usa o tenant resolvido do header; `tenant_id` é validado
 * contra o JWT quando a chamada é autenticada.
 */
export const widgetsApi = {
  resolve: (params: { tenant_id?: string; niche: string; location_id?: string | null }) => {
    const search = new URLSearchParams({ niche: params.niche });
    if (params.tenant_id) search.set('tenant_id', params.tenant_id);
    if (params.location_id) search.set('location_id', params.location_id);
    return apiGet<ResolvedWidget | null>(`/api/widgets/resolve?${search.toString()}`);
  },
};
