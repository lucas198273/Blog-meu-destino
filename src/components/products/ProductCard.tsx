import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { formatPrice } from '../../lib/format';
import type { Product } from '../../types/product';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { LocationBadge } from '../common/LocationBadge';

// Camada de apresentação: card de oferta (veículo, pacote, equipamento etc.)
// consumindo `Product` do backend, com CTA de afiliado externo.
export function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0];
  const cover = image?.url;
  const partner = product.partner;
  const metadataValue =
    product.niche === 'veiculos'
      ? product.metadata?.transmissao ?? product.metadata?.transmission
      : product.niche === 'equipamentos'
        ? product.metadata?.marca ?? product.metadata?.brand
        : undefined;
  const metadataLabel =
    product.niche === 'veiculos'
      ? 'Transmissão'
      : product.niche === 'equipamentos'
        ? 'Marca'
        : null;
  const metadataText =
    typeof metadataValue === 'string' || typeof metadataValue === 'number'
      ? String(metadataValue).trim()
      : '';

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:border-slate-200 hover:shadow-md">
      {partner?.logo_url ? (
        <img
          src={partner.logo_url}
          alt={`Logo ${partner.nome}`}
          loading="lazy"
          className="absolute top-3 right-3 z-10 h-17 w-auto max-w-[176px] rounded-lg bg-white/90 p-2 object-contain shadow-sm"
        />
      ) : null}

      {/* Imagem */}
      {cover ? (
        <Link
          to={`/produto/${product.slug}`}
          aria-label={`Ver detalhes de ${product.nome}`}
          className="block overflow-hidden"
        >
          <img
            src={cover}
            alt={
              image?.alt?.trim() ||
              `Imagem de ${product.nome}${partner ? ` - oferta de ${partner.nome}` : ''}`
            }
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
      ) : (
        <div className="flex aspect-square w-full items-center justify-center bg-slate-50 text-sm text-slate-400">
          Sem imagem
        </div>
      )}

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <Link
          to={`/produto/${product.slug}`}
          className="text-[16px] font-semibold leading-snug text-[var(--color-text)] hover:text-[var(--color-primary)]"
        >
          {product.nome}
        </Link>

        {partner ? (
          <div className="flex items-center gap-1.5">
            <Badge
              className={
                product.kind === 'vehicle'
                  ? 'bg-orange-50 font-semibold text-orange-800 ring-1 ring-orange-200'
                  : 'bg-slate-100 text-slate-700'
              }
            >
              {partner.nome}
            </Badge>
          </div>
        ) : null}

        {metadataLabel && metadataText ? (
          <div className="flex flex-wrap gap-1.5">
            <Badge className="bg-slate-100 text-slate-700">
              {metadataLabel}: {metadataText}
            </Badge>
          </div>
        ) : null}

        {product.location_id ? (
          <div>
            <LocationBadge locationId={product.location_id} />
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          {product.preco !== null ? (
            <span className="text-base font-semibold text-[var(--color-primary)]">
              {formatPrice(product.preco)}
              {product.price_unit ? ` / ${product.price_unit}` : ''}
            </span>
          ) : (
            <span className="text-sm font-medium text-slate-400">
              Consulte
            </span>
          )}
          {/* CTA de afiliado — link externo, não rota interna. */}
          {product.affiliate_url ? (
            <a
              href={product.affiliate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-dark)]"
            >
              Ver Oferta no Parceiro
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : (
            <Link
              to={`/produto/${product.slug}`}
              className="inline-flex h-9 items-center rounded-lg bg-[var(--color-accent)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-dark)]"
            >
              Ver detalhes
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}