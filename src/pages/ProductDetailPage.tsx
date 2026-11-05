import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, ImageOff, MapPin, Tag } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ErrorState } from '../components/common/ErrorState';
import { ProductGrid } from '../components/products/ProductGrid';
import { Container } from '../components/ui/Container';
import { PageLoader } from '../components/ui/Spinner';
import { useProduct, useRelatedProducts } from '../hooks/useProducts';
import { trackEvent } from '../lib/analytics';
import { formatPrice } from '../lib/format';
import type { ProductNiche } from '../types/product';
import { canonicalUrl } from '../lib/seo';

const metadataLabels: Record<ProductNiche, Record<string, string>> = {
  veiculos: {
    transmission: 'Transmissão',
    transmissao: 'Transmissão',
    doors: 'Portas',
    portas: 'Portas',
    year: 'Ano',
    ano: 'Ano',
    seats: 'Assentos',
    assentos: 'Assentos',
    fuel_type: 'Combustível',
    combustivel: 'Combustível',
  },
  equipamentos: {
    material: 'Material',
    weight: 'Peso',
    peso: 'Peso',
    capacity: 'Capacidade',
    capacidade: 'Capacidade',
    brand: 'Marca',
    marca: 'Marca',
  },
  viagens: {
    nights: 'Noites',
    noites: 'Noites',
    destination: 'Destino',
    destino: 'Destino',
    departure_date: 'Data de saída',
    board: 'Regime',
    regime: 'Regime',
  },
};

function metadataValue(value: unknown): string | null {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
  return null;
}

function getMetadataBadges(
  niche: ProductNiche | undefined,
  metadata: Record<string, unknown> | null | undefined,
) {
  if (!niche || !metadata) return [];
  const labels = metadataLabels[niche];

  return Object.entries(metadata).flatMap(([key, value]) => {
    const label = labels[key.toLowerCase()];
    const text = metadataValue(value);
    return label && text ? [{ label, value: text }] : [];
  });
}

function partnerInitial(name: string) {
  return name.trim().slice(0, 1).toUpperCase() || 'P';
}

function safeExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export function ProductDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const product = useProduct(slug);
  const data = product.data;
  const [selectedImage, setSelectedImage] = useState(0);
  const related = useRelatedProducts(data?.niche);

  if (product.isLoading) return <PageLoader />;
  if (product.isError || !data) {
    return (
      <Container className="py-12">
        <ErrorState title="Produto não encontrado" />
        <Link
          to="/categorias"
          className="mt-4 inline-block text-sm text-[var(--color-primary)] hover:underline"
        >
          Ver categorias
        </Link>
      </Container>
    );
  }

  const images = [...(data.images ?? [])].sort(
    (first, second) => (first.displayOrder ?? 0) - (second.displayOrder ?? 0),
  );
  const activeImage = images[selectedImage];
  const badges = getMetadataBadges(data.niche, data.metadata);
  const partner = data.partner;
  const affiliateUrl = safeExternalUrl(data.affiliate_url);
  const partnerUrl = safeExternalUrl(partner?.website_url);

  function openOffer() {
    if (!affiliateUrl) return;
    trackEvent('click_affiliate', {
      product_id: data.id,
      partner_name: partner?.nome ?? '',
    });
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
  }

  const relatedProducts = (related.data?.items ?? []).filter(
    (item) => item.id !== data.id,
  );

  return (
    <>
      <Helmet>
        <title>{data.meta_title ?? `${data.nome} | Meu Destino`}</title>
        <meta
          name="description"
          content={data.meta_description ?? data.descricao ?? `Conheça ${data.nome} e compare esta oferta com nossos parceiros.`}
        />
        <link rel="canonical" href={canonicalUrl(`/produto/${data.slug}`)} />
      </Helmet>

      <Container className="py-8 sm:py-12">
        <Link
          to={data.niche === 'veiculos' ? '/veiculos' : data.niche === 'equipamentos' ? '/equipamentos' : '/pacotes-de-viagem'}
          className="text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          ← Voltar para ofertas
        </Link>

        <div className="mt-6 grid min-w-0 gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)] md:gap-8 lg:gap-12">
          <section aria-label="Galeria de imagens" className="min-w-0">
            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
              {activeImage?.url ? (
                <img
                  src={activeImage.url}
                  alt={activeImage.alt?.trim() || `Imagem de ${data.nome}`}
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <ImageOff className="h-8 w-8" aria-hidden="true" />
                  <span className="text-sm">Imagem indisponível</span>
                </div>
              )}
            </div>

            {images.length > 1 ? (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={`${image.url}-${index}`}
                    type="button"
                    aria-label={`Ver imagem ${index + 1}`}
                    aria-pressed={selectedImage === index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${
                      selectedImage === index
                        ? 'border-[var(--color-primary)]'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt ?? `${data.nome} - imagem ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </section>

          <section className="flex flex-col">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {data.nome}
            </h1>

            {partner ? (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={`Logotipo de ${partner.nome}`}
                    loading="lazy"
                    decoding="async"
                    className="h-11 w-16 rounded-md object-contain"
                  />
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 font-bold text-teal-800">
                    {partnerInitial(partner.nome)}
                  </span>
                )}
                <div>
                  <p className="text-xs text-slate-500">Oferta em parceria com</p>
                  {partnerUrl ? (
                    <a
                      href={partnerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
                    >
                      {partner.nome} <ExternalLink className="inline h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-slate-900">{partner.nome}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                Oferta sem parceiro vinculado.
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Preço
              </p>
              <p className="mt-1 text-3xl font-bold text-[var(--color-primary)]">
                {data.preco !== null ? formatPrice(data.preco) : 'Consulte a oferta'}
                {data.preco !== null && data.price_unit ? (
                  <span className="ml-1 text-base font-medium text-slate-500">
                    / {data.price_unit}
                  </span>
                ) : null}
              </p>
              <span
                className={`mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                  data.location?.nome
                    ? 'bg-teal-50 text-teal-800 ring-1 ring-teal-100'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {data.location?.nome ? (
                  <>
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {data.location.nome}
                  </>
                ) : (
                  'Produto Digital / Acesso Imediato'
                )}
              </span>
              <button
                type="button"
                onClick={openOffer}
                disabled={!affiliateUrl}
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-accent-dark)] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {affiliateUrl ? 'Ver Oferta no Parceiro' : 'Oferta indisponível'}
                {affiliateUrl ? <ExternalLink className="h-4 w-4" aria-hidden="true" /> : null}
              </button>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Você será redirecionado para o site do nosso parceiro para concluir sua reserva ou compra com segurança.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section>
            {badges.length ? (
              <div>
                <h2 className="mb-4 text-xl font-bold text-slate-900">
                  Detalhes da oferta
                </h2>
                <div className="flex flex-wrap gap-2">
                  {badges.map(({ label, value }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3.5 py-2 text-sm font-medium text-teal-900"
                    >
                      <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                      {label}: {value}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                Detalhes adicionais não disponíveis para esta oferta.
              </div>
            )}

            <section className="mt-8">
              <h2 className="mb-3 text-xl font-bold text-slate-900">Descrição</h2>
              {data.descricao ? (
                <p className="whitespace-pre-line text-[15px] leading-relaxed text-slate-600">
                  {data.descricao}
                </p>
              ) : (
                <p className="text-sm text-slate-500">
                  Mais informações sobre este produto estarão disponíveis em breve.
                </p>
              )}
            </section>
          </section>
        </div>

        {relatedProducts.length ? (
          <section className="mt-14" aria-labelledby="related-products-heading">
            <h2
              id="related-products-heading"
              className="mb-6 text-2xl font-bold tracking-tight text-slate-900"
            >
              Você também pode gostar
            </h2>
            <ProductGrid products={relatedProducts} />
          </section>
        ) : null}
      </Container>
    </>
  );
}
