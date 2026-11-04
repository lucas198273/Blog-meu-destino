import { Helmet } from 'react-helmet-async';
import { ArrowRight, Tag } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { ErrorState } from '../components/common/ErrorState';
import { Container } from '../components/ui/Container';
import { PageLoader } from '../components/ui/Spinner';
import { useNicheProductCategories, useProducts } from '../hooks/useProducts';
import type { ProductCategory, ProductNiche } from '../types/product';

function ProductCategoryCard({
  category,
  selectedNiche,
}: {
  category: ProductCategory;
  selectedNiche: ProductNiche | undefined;
}) {
  const niche = category.niche ?? selectedNiche;
  const products = useProducts({
    niche,
    category: category.id,
    page: 1,
    limit: 1,
  });
  const count =
    category.product_count ??
    category.products_count ??
    products.data?.meta.total;
  const to =
    niche === 'veiculos'
      ? '/veiculos'
      : niche === 'equipamentos'
        ? '/equipamentos'
        : '/pacotes-de-viagem';

  return (
    <Link
      to={`${to}?category=${encodeURIComponent(category.id)}`}
      className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-teal-50">
        {category.cover_image_url ? (
          <img
            src={category.cover_image_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-50 to-slate-100">
            <Tag className="h-10 w-10 text-teal-800/60" aria-hidden="true" />
          </div>
        )}
        {category.icon ? (
          <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-xl shadow-sm">
            {category.icon}
          </span>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-4 p-5">
        <div>
          <h2 className="font-bold text-slate-900 group-hover:text-[var(--color-primary)]">
            {category.nome}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {count === undefined
              ? 'Explore os produtos'
              : `${count} ${count === 1 ? 'produto' : 'produtos'}`}
          </p>
        </div>
        <ArrowRight
          className="h-5 w-5 shrink-0 text-[var(--color-primary)] transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

export function ProductCategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawNiche = searchParams.get('niche');
  const niche: ProductNiche | undefined =
    rawNiche === 'veiculos' || rawNiche === 'equipamentos' || rawNiche === 'viagens'
      ? rawNiche
      : undefined;
  const categories = useNicheProductCategories(niche);

  return (
    <>
      <Helmet>
        <title>Categorias de produtos | Meu Destino</title>
        <meta
          name="description"
          content="Encontre produtos, equipamentos e ofertas por categoria."
        />
      </Helmet>
      <Container className="py-10 sm:py-14">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-800">
          Encontre sua próxima oferta
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Categorias de produtos
        </h1>

        <label className="mt-7 flex max-w-sm flex-col gap-2 text-sm font-medium text-slate-700">
          Filtrar por nicho
          <select
            value={niche ?? ''}
            onChange={(event) => {
              const next = new URLSearchParams(searchParams);
              if (event.currentTarget.value) {
                next.set('niche', event.currentTarget.value);
              } else {
                next.delete('niche');
              }
              setSearchParams(next);
            }}
            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
          >
            <option value="">Todos os nichos</option>
            <option value="veiculos">Veículos</option>
            <option value="equipamentos">Equipamentos</option>
            <option value="viagens">Viagens</option>
          </select>
        </label>
        {categories.isLoading ? (
          <PageLoader />
        ) : categories.isError ? (
          <ErrorState
            message="Não foi possível carregar as categorias de produtos."
            onRetry={() => categories.refetch()}
          />
        ) : categories.data?.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.data.map((category) => (
              <ProductCategoryCard
                key={category.id}
                category={category}
                selectedNiche={niche}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Nenhuma categoria disponível.</p>
        )}
      </Container>
    </>
  );
}
