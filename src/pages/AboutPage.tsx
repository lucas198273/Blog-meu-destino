import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { ButtonLink } from '../components/ui/Button';

export function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Sobre | Meu Destino</title>
        <meta
          name="description"
          content="Conheça o Meu Destino: nosso propósito é ajudar você a explorar o mundo com roteiros, dicas e ofertas confiáveis."
        />
      </Helmet>

      <Container className="py-16">
        <div className="mx-auto max-w-3xl">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Sobre nós
          </p>
          <h1 className="font-heading mt-3 text-3xl font-bold tracking-tight text-[var(--color-primary)] sm:text-4xl">
            Viajar bem começa com um bom destino
          </h1>

          <div className="font-body mt-8 space-y-6 text-[15px] leading-relaxed text-[var(--color-text)]">
            <p>
              O <strong>Meu Destino</strong> nasceu de uma paixão simples:
              ajudar pessoas a explorarem o mundo — do balneário vizinho à
              cidade histórica do outro lado do país — com informação de
              qualidade e sem burocracia.
            </p>
            <p>
              Aqui você encontra roteiros detalhados, pontos turísticos
              imperdíveis, dicas práticas de quem já foi e seleções honestas de
              ofertas. Testamos, comparamos e contamos como é na prática, para
              que você decida com confiança.
            </p>
            <p>
              Para sustentar o blog, trabalhamos com parcerias de afiliados —
              como <strong>pacotes CVC</strong> e <strong>aluguel de carros</strong>.
              Isso significa que, quando você reserva através dos nossos links,
              podemos receber uma comissão, sem nenhum custo adicional para
              você. Essa é a razão de o conteúdo continuar gratuito e
              independente.
            </p>
            <p>
              Bom caminho — e que o próximo destino seja o seu favorito.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink to="/blog">Explorar Destinos</ButtonLink>
            <ButtonLink
              to="/destinos"
              variant="secondary"
            >
              Ver Destinos & Ofertas
            </ButtonLink>
          </div>

          <p className="mt-12 text-sm text-slate-500">
            Ficou com alguma dúvida?{' '}
            <Link to="/contato" className="font-medium text-[var(--color-primary)] hover:underline">
              Fale com a gente
            </Link>
            .
          </p>
        </div>
      </Container>
    </>
  );
}
