import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { MapPin, Plane, Backpack, CarFront, Compass } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { ButtonLink } from '../components/ui/Button';

const highlights = [
  {
    icon: MapPin,
    title: 'Destinos e roteiros',
    description:
      'Guias detalhados, pontos turísticos imperdíveis e dicas de quem já foi — para você planejar sem imprevistos.',
  },
  {
    icon: Plane,
    title: 'Pacotes e passagens',
    description:
      'Ofertas selecionadas com parceiros confiáveis, com preços transparentes e reserva direta.',
  },
  {
    icon: CarFront,
    title: 'Aluguel de veículos',
    description:
      'Compare opções de locação em todo o Brasil e escolha o carro ideal para sua viagem.',
  },
  {
    icon: Backpack,
    title: 'Equipamentos de viagem',
    description:
      'Mochilas, acessórios e o que você precisa levar — recomendações práticas para escolher melhor.',
  },
];

export function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Sobre Nós | Meu Destino</title>
        <meta
          name="description"
          content="Conheça o Meu Destino: guia de viagens completo que conecta você às melhores ofertas de pacotes, passagens, aluguel de carros e equipamentos através de parceiros confiáveis."
        />
      </Helmet>

      {/* Hero institucional */}
      <section className="bg-gradient-to-br from-[#073b3e] via-[#0d5556] to-[#18736c] text-white">
        <Container className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <Compass className="h-7 w-7 text-teal-100" aria-hidden="true" />
            </span>
            <h1 className="font-heading mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Sua jornada começa aqui
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
              Somos o guia que transforma inspiração em roteiro — e roteiro em
              viagem inesquecível.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        {/* História e propósito */}
        <div className="mx-auto max-w-3xl">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Quem somos nós
          </p>
          <div className="font-body mt-6 space-y-6 text-[15px] leading-relaxed text-[var(--color-text)]">
            <p>
              O <strong>Meu Destino</strong> é um guia de viagens completo que
              conecta você às melhores ofertas de passagens, aluguel de carros,
              equipamentos e pacotes, através de parceiros confiáveis.
            </p>
            <p>
              Nasceu de uma paixão simples: ajudar pessoas a explorarem o mundo —
              do balneário vizinho à cidade histórica do outro lado do país — com
              informação de qualidade e sem burocracia. Aqui você encontra
              roteiros detalhados, pontos turísticos imperdíveis, dicas práticas
              de quem já foi e seleções honestas de ofertas.
            </p>
            <p>
              Para sustentar o blog, trabalhamos com parcerias de afiliados. Isso
              significa que, quando você reserva através dos nossos links, podemos
              receber uma comissão, sem nenhum custo adicional para você. É assim
              que o conteúdo continua gratuito, independente e sempre atualizado.
            </p>
          </div>
        </div>

        {/* Diferenciais com ícones */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-[var(--color-primary)]">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="font-heading mt-4 text-base font-bold text-slate-900">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA final */}
        <div className="mt-14 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/">Explorar Ofertas</ButtonLink>
          <ButtonLink to="/pacotes-de-viagem" variant="secondary">
            Encontrar Pacotes
          </ButtonLink>
        </div>

        <p className="mt-12 text-center text-sm text-slate-500">
          Ficou com alguma dúvida?{' '}
          <Link
            to="/contato"
            className="font-medium text-[var(--color-primary)] hover:underline"
          >
            Fale com a gente
          </Link>
          .
        </p>
      </Container>
    </>
  );
}
