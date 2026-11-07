export interface ResolvedWidget {
  id: string;
  nome: string;
  niche: string;
  provider: string;
  location_id: string | null;
  codigo_script: string;
  ativo: boolean;
}
