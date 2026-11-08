import { Link } from 'react-router-dom';
import {
  AirVent,
  Briefcase,
  Cog,
  ExternalLink,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react';
import { formatPrice } from '../../lib/format';
import type { Product } from '../../types/product';
import { Card } from '../ui/Card';

// Camada de apresentação unificada de card de produto (veículos, viagens,
// equipamentos). Estrutura padrão:
//   imagem (h-48, w-full) → header (título + localização) →
//   specs (metadata JSON, só veículos) → footer (preço + CTA laranja).
// Classes-chave contra corte/overflow:
//   - container: flex flex-col h-full w-full overflow-hidden
//   - título:    line-clamp-2 (não empurra o preço para fora do card)
//   - footer:    mt-auto flex items-center justify-between gap-2
function asText(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  return '';
}

export function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0];
  const cover = image?.url;
  const partner = product.partner;
  const meta = (product.metadata ?? {}) as Record<string, unknown>;
  const isVehicle = product.niche === 'veiculos' || product.kind === 'vehicle';

  const transmissao = asText(meta.transmissao ?? meta.transmission);
  const portas = meta.portas ?? meta.doors;
  const arCondicionado = Boolean(meta.ar_condicionado ?? meta.air_conditioning);
  const lugares = meta.lugares ?? meta.seats ?? meta.assentos;

  // Especificações exibidas no grid (só quando existirem nos dados).
  const specs: { icon: typeof Cog; label: string }[] = [];
  if (transmissao) {
    specs.push({
      icon: Cog,
      label: transmissao.charAt(0).toUpperCase() + transmissao.slice(1).toLowerCase(),
    });
  }
  if (lugares !== undefined && lugares !== null && asText(lugares) !== '') {
    specs.push({ icon: Users, label: `${lugares} lugares` });
  }
  if (portas !== undefined && portas !== null && asText(portas) !== '') {
    specs.push({ icon: Briefcase, label: `${portas} portas` });
  }
  if (arCondicionado) {
    specs.push({ icon: AirVent, label: 'A/C' });
  }

  const ctaLabel = isVehicle ? 'Alugar agora' : 'Ver oferta';

  return (
    <Card className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:border-slate-200 hover:shadow-md">
      {/* Imagem — topo, w-full, altura fixa para alinhamento entre cards.
          `object-contain` + fundo neutro: o produto aparece 100% completo,
          centralizado e sem cortes/zoom. */}
      <div className="relative bg-gray-50">
        {cover ? (
          <Link to={`/produto/${product.slug}`} aria-label={`Ver detalhes de ${product.nome}`}>
            <img
              src={cover}
              alt={
                image?.alt?.trim() ||
                `Imagem de ${product.nome}${partner ? ` - oferta de ${partner.nome}` : ''}`
              }
              loading="lazy"
              decoding="async"
              className="h-48 w-full object-contain"
            />
          </Link>
        ) : (
          <div className="flex h-48 w-full items-center justify-center bg-slate-50 text-sm text-slate-400">
            Sem imagem
          </div>
        )}

        {/* Badge de destaque */}
        {product.featured ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Destaque
          </span>
        ) : null}

        {/* Logo do parceiro */}
        {partner?.logo_url ? (
          <img
            src={partner.logo_url}
            alt={`Logo ${partner.nome}`}
            loading="lazy"
            decoding="async"
            className="absolute right-3 top-3 z-10 h-8 w-auto max-w-[96px] rounded-lg bg-white/90 p-1 object-contain shadow-sm sm:h-10"
          />
        ) : null}
      </div>

      {/* Header — título + localização */}
      <div className="flex flex-col gap-1.5 px-4 pt-4 sm:px-5">
        <Link
          to={`/produto/${product.slug}`}
          className="line-clamp-2 min-h-[2lh] text-lg font-bold leading-snug text-[var(--color-text)] hover:text-[var(--color-primary)]"
        >
          {product.nome}
        </Link>
        {product.location?.nome ? (
          <span className="inline-flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            {product.location.nome}
          </span>
        ) : null}
        {partner && !partner.logo_url ? (
          <span className="text-xs font-medium text-slate-400">{partner.nome}</span>
        ) : null}
      </div>

      {/* Grid de especificações (metadata) — só para veículos com dados */}
      {isVehicle && specs.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 px-4 py-3 sm:px-5">
          {specs.slice(0, 6).map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 rounded-lg bg-slate-50 py-2 text-center"
            >
              <Icon className="h-4 w-4 text-slate-500" aria-hidden="true" />
              <span className="text-xs font-medium text-slate-600">{label}</span>
            </div>
          ))}
        </div>
      ) : null}

      {/* Footer — preço à esquerda, CTA à direita, borda sutil no topo.
          `mt-auto` empurra o rodapé para o fim do card; `shrink-0` no botão
          garante que o CTA nunca é comprimido/cortado no mobile. */}
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-200 px-4 py-3.5 sm:px-5">
        {product.preco !== null ? (
          <div className="flex min-w-0 items-baseline gap-0.5">
            <span className="text-lg font-bold text-slate-900">
              {formatPrice(product.preco)}
            </span>
            {product.price_unit ? (
              <span className="truncate text-xs font-medium text-slate-400">
                /{product.price_unit.replace(/^por\s+/i, '')}
              </span>
            ) : null}
          </div>
        ) : (
          <span className="text-sm font-medium text-slate-400">Consulte</span>
        )}
        {product.affiliate_url ? (
          <a
            href={product.affiliate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            {ctaLabel}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : (
          <Link
            to={`/produto/${product.slug}`}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-orange-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </Card>
  );
}
