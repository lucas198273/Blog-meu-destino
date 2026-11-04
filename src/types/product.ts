export type ProductStatus = 'draft' | 'active' | 'archived';
export type ProductKind =
  | 'product'
  | 'course'
  | 'vehicle'
  | 'package'
  | 'gear'
  | 'experience'
  | 'destination';
export type ProductModality = 'presencial' | 'online' | 'hibrido';
export type ProductLevel = 'iniciante' | 'intermediario' | 'avancado';
export type ProductNiche = 'veiculos' | 'equipamentos' | 'viagens';

export interface ProductImage {
  url: string;
  alt?: string;
  displayOrder?: number;
}

/** Parceiro comercial vinculado ao produto (oferta em parceria). */
export interface PartnerSummary {
  nome: string;
  logo_url: string | null;
  website_url?: string | null;
}

/** Parceiro retornado por GET /api/partners. */
export interface Partner extends PartnerSummary {
  id: string;
  slug: string;
}

/** Produto retornado pelas rotas públicas de produtos e ofertas do blog. */
export interface Product {
  id: string;
  category_id: string | null;
  sku: string | null;
  nome: string;
  slug: string;
  descricao: string | null;
  preco: number | null;
  price_unit: string | null;
  images: ProductImage[];
  status: ProductStatus;
  display_order: number;
  featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  kind: ProductKind;
  niche?: ProductNiche;
  metadata?: Record<string, unknown> | null;
  affiliate_url: string | null;
  partner_id: string | null;
  partner?: PartnerSummary;
  attributes?: Record<string, unknown>;
  // Campos legados de curso mantidos para as telas existentes; não são usados
  // pelo card de ofertas associadas ao blog.
  modality: ProductModality | null;
  workload_hours: number | null;
  duration_months: number | null;
  level: ProductLevel | null;
  certification: boolean;
  certification_name: string | null;
  start_date: string | null;
  enrollment_deadline: string | null;
  syllabus: string | null;
  requirements: string | null;
  coordinator_name: string | null;
  coordinator_bio: string | null;
  coordinator_photo_url: string | null;
  video_url: string | null;
  tags: string[];
}

export interface ProductCategory {
  id: string;
  tenant_id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  niche?: ProductNiche | null;
  cover_image_url?: string | null;
  icon?: string | null;
  product_count?: number;
  products_count?: number;
  post_count?: number;
  posts_count?: number;
  parent_id: string | null;
  display_order: number;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export type ProductSort =
  | 'newest'
  | 'oldest'
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc'
  | 'display_order';

/** Query string de GET /api/products. */
export interface ListProductsParams {
  page?: number;
  limit?: number;
  kind?: ProductKind;
  niche?: ProductNiche;
  category?: string;
  featured?: boolean;
  partner?: string;
  modality?: string;
  level?: string;
  certification?: boolean;
  tags?: string;
  min_price?: number;
  max_price?: number;
  min_workload?: number;
  max_workload?: number;
  sort?: ProductSort;
}

/** Rótulos de apresentação para `product.kind`. */
export const PRODUCT_KIND_LABELS: Record<ProductKind, string> = {
  product: 'Produto',
  course: 'Curso',
  vehicle: 'Veículo',
  package: 'Pacote',
  gear: 'Equipamento',
  experience: 'Experiência',
  destination: 'Destino',
};

/** CTA principal do card, por `kind` (ex: "Alugar Agora" para vehicle). */
export function kindCtaLabel(kind: Product['kind']): string {
  switch (kind) {
    case 'vehicle':
      return 'Alugar Agora';
    case 'package':
      return 'Ver Pacote';
    case 'gear':
      return 'Comprar Agora';
    case 'experience':
      return 'Reservar Experiência';
    default:
      return 'Ver Oferta';
  }
}
