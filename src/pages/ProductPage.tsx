import { useMemo, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import {
  Award,
  Calendar,
  Clock,
  GraduationCap,
  Hourglass,
  MapPin,
  Tag,
  User,
} from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { formatDate, formatPrice } from '../lib/format';
import {
  durationLabel,
  levelLabel,
  modalityLabel,
  toEmbedUrl,
  workloadLabel,
} from '../lib/courseLabels';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';
import { PageLoader } from '../components/ui/Spinner';
import { ErrorState } from '../components/common/ErrorState';
import { canonicalUrl } from '../lib/seo';

/** Linha de "ícone + label + valor". Não renderiza se `value` for nulo. */
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <span className="mt-0.5 text-[var(--color-primary)]" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export function ProductPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const product = useProduct(slug);

  const data = product.data;

  // Todos os hooks ANTES de qualquer early return.
  const derived = useMemo(() => {
    if (!data) return null;

    const modality = modalityLabel(data.modality);
    const workload = workloadLabel(data.workload_hours);
    const duration = durationLabel(data.duration_months);
    const level = levelLabel(data.level);
    const certification = data.certification
      ? (data.certification_name ?? 'Certificado incluso')
      : null;
    const startDate = formatDate(data.start_date) || null;
    const enrollmentDeadline = formatDate(data.enrollment_deadline) || null;
    const embedUrl = toEmbedUrl(data.video_url);

    const hasInfo = Boolean(
      modality ||
        workload ||
        duration ||
        level ||
        certification ||
        startDate ||
        enrollmentDeadline,
    );

    return {
      modality,
      workload,
      duration,
      level,
      certification,
      startDate,
      enrollmentDeadline,
      embedUrl,
      hasInfo,
    };
  }, [data]);

  if (product.isLoading) return <PageLoader />;
  if (product.isError) {
    return (
      <Container className="py-12">
        <ErrorState title="Destino não encontrado" />
        <Link
          to="/pacotes-de-viagem"
          className="mt-4 inline-block text-sm text-[var(--color-primary)] hover:underline"
        >
          ← Voltar aos cursos
        </Link>
      </Container>
    );
  }

  if (!data || !derived) return null;

  const cover = data.images[0];
  const partner = data.partner;

  return (
    <>
      <Helmet>
        <title>{data.meta_title ?? `${data.nome} | Meu Destino`}</title>
        <meta
          name="description"
          content={data.meta_description ?? data.descricao ?? `Conheça ${data.nome} e encontre opções para sua viagem.`}
        />
        <link rel="canonical" href={canonicalUrl(`/destino/${data.slug}`)} />
      </Helmet>

      <Container className="py-12">
        <Link to="/pacotes-de-viagem" className="text-sm text-[var(--color-primary)] hover:underline">
          ← Destinos
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Coluna principal */}
          <div className="min-w-0">
            {cover ? (
              <img
                src={cover.url}
                alt={cover.alt?.trim() || `Imagem de ${data.nome}`}
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-400">
                Sem imagem
              </div>
            )}

            <div className="mt-8">
              <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--color-primary)]">
                {data.nome}
              </h1>
              {data.preco !== null ? (
                <p className="mt-4 text-2xl font-semibold text-[var(--color-primary)]">
                  {formatPrice(data.preco)}
                </p>
              ) : null}
              {partner ? (
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-4 py-2.5 shadow-sm">
                  <span className="text-sm text-slate-600">
                    Oferta em parceria com
                  </span>
                  {partner.logo_url ? (
                    <img
                      src={partner.logo_url}
                      alt={`Logotipo de ${partner.nome}`}
                      loading="lazy"
                      className="h-7 max-w-[110px] object-contain"
                    />
                  ) : null}
                  <span className="text-sm font-semibold text-slate-900">
                    {partner.nome}
                  </span>
                </div>
              ) : null}
              {data.descricao ? (
                <div className="mt-6 whitespace-pre-line font-body text-[15px] leading-relaxed text-[var(--color-text)]">
                  {data.descricao}
                </div>
              ) : null}
            </div>
          </div>

          {/* Sidebar de conversão (sticky) — CTAs de afiliados */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <p className="font-heading text-lg font-bold text-[var(--color-primary)]">
                Planeje sua visita
              </p>
              {data.preco !== null ? (
                <p className="mt-2 text-sm text-slate-600">
                  A partir de{' '}
                  <span className="font-semibold text-[var(--color-text)]">
                    {formatPrice(data.preco)}
                  </span>
                </p>
              ) : null}

              <div className="mt-5 flex flex-col gap-3">
                {/* CTA primário — laranja, uso estrito de conversão */}
                <Link
                  to="/veiculos"
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--color-accent)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-dark)]"
                >
                  Comparar veículos para este destino
                </Link>
                {/* CTA secundário — azul */}
                <Link
                  to="/pacotes-de-viagem"
                  className="inline-flex h-11 items-center justify-center rounded-lg border-2 border-[var(--color-primary)] bg-white px-5 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
                >
                  Encontrar pacotes de viagem
                </Link>
              </div>

              <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
                As ofertas e reservas são realizadas diretamente com nossos
                parceiros. Alguns links podem gerar comissão sem custo adicional.
              </p>
            </div>
          </aside>
        </div>

        {derived.hasInfo ? (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold text-[var(--color-primary)]">
              Sobre este destino
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                icon={<MapPin className="h-5 w-5" />}
                label="Modalidade"
                value={derived.modality}
              />
              <InfoItem
                icon={<Clock className="h-5 w-5" />}
                label="Carga horária"
                value={derived.workload}
              />
              <InfoItem
                icon={<Hourglass className="h-5 w-5" />}
                label="Duração"
                value={derived.duration}
              />
              <InfoItem
                icon={<GraduationCap className="h-5 w-5" />}
                label="Nível"
                value={derived.level}
              />
              <InfoItem
                icon={<Award className="h-5 w-5" />}
                label="Certificação"
                value={derived.certification}
              />
              <InfoItem
                icon={<Calendar className="h-5 w-5" />}
                label="Início das aulas"
                value={derived.startDate}
              />
              <InfoItem
                icon={<Calendar className="h-5 w-5" />}
                label="Prazo de matrícula"
                value={derived.enrollmentDeadline}
              />
            </div>

            {data.tags.length > 0 ? (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-slate-500" aria-hidden="true" />
                {data.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        {data.coordinator_name ? (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold text-[var(--color-primary)]">
              Guia local
            </h2>
            <div className="flex flex-col gap-5 rounded-xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row sm:items-start">
              {data.coordinator_photo_url ? (
                <img
                  src={data.coordinator_photo_url}
                  alt={`Foto de ${data.coordinator_name}`}
                  loading="lazy"
                  className="h-20 w-20 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <User className="h-8 w-8" aria-hidden="true" />
                </span>
              )}
              <div>
                <p className="text-base font-semibold text-slate-900">
                  {data.coordinator_name}
                </p>
                {data.coordinator_bio ? (
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                    {data.coordinator_bio}
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {derived.embedUrl ? (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold text-[var(--color-primary)]">
              Vídeo do destino
            </h2>
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
              <iframe
                src={derived.embedUrl}
                title={`Vídeo do destino ${data.nome}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </section>
        ) : null}

        {data.syllabus ? (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold text-[var(--color-primary)]">Roteiro</h2>
            <article
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: data.syllabus }}
            />
          </section>
        ) : null}

        {data.requirements ? (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold text-[var(--color-primary)]">Dicas práticas</h2>
            <p className="whitespace-pre-line text-slate-700">
              {data.requirements}
            </p>
          </section>
        ) : null}
      </Container>
    </>
  );
}