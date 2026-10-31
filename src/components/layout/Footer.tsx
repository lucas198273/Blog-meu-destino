import { useMemo, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';

export function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);

  function handleNewsletterSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: integrar com API de newsletter
  }

  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 text-[var(--color-text)]">
      <Container className="py-10 sm:py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          {/* Identidade */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2"
              aria-label="Meu Destino - Página inicial"
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="var(--color-primary)" aria-hidden="true">
                <path d="M12 2C7.6 2 4 5.6 4 10c0 5.4 7.2 11.6 7.5 11.9a.8.8 0 0 0 1 0C12.8 21.6 20 15.4 20 10c0-4.4-3.6-8-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
              </svg>
              <span className="font-heading text-xl font-extrabold tracking-tight text-[var(--color-primary)]">
                Meu Destino
              </span>
            </Link>

            <p className="font-heading mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Viagens • Destinos • Experiências
            </p>

            {/* Selos textuais de parceria */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600">
                Parceiro CVC
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600">
                Aluguel de Carros
              </span>
            </div>

            <p className="mt-6 text-xs text-slate-500">
              © {year} Meu Destino. Todos os direitos reservados.
            </p>
          </div>

          {/* Links úteis */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-[var(--color-text)]">Links úteis</h3>
            <nav className="mt-4 flex flex-col gap-3">
              <Link to="/blog" className="w-fit text-sm text-slate-500 transition-colors hover:text-[var(--color-primary)]">
                Blog
              </Link>
              <Link to="/destinos" className="w-fit text-sm text-slate-500 transition-colors hover:text-[var(--color-primary)]">
                Destinos
              </Link>
              <Link to="/sobre" className="w-fit text-sm text-slate-500 transition-colors hover:text-[var(--color-primary)]">
                Sobre
              </Link>
              <Link to="/contato" className="w-fit text-sm text-slate-500 transition-colors hover:text-[var(--color-primary)]">
                Contato
              </Link>
            </nav>
          </div>

          {/* Redes sociais */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-[var(--color-text)]">
              Siga o Meu Destino
            </h3>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                <FacebookIcon />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                <YoutubeIcon />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-[var(--color-text)]">
              Receba roteiros no seu e-mail
            </h3>
            <p className="mt-2 text-sm leading-5 text-slate-500">
              Destinos, dicas e ofertas — uma vez por semana, sem spam.
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="mt-4 flex overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-[var(--color-primary)]"
            >
              <input
                type="email"
                required
                placeholder="Seu e-mail"
                aria-label="Seu e-mail"
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-[var(--color-text)] outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="shrink-0 bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
              >
                Assinar
              </button>
            </form>
          </div>
        </div>

        {/* Disclaimer de afiliados */}
        <p className="mt-10 text-[11px] leading-relaxed text-slate-400">
          Este site contém links de afiliados. Ao comprar através deles, podemos
          receber uma comissão sem custo adicional para você. Os preços e
          disponibilidade podem variar nos sites dos parceiros.
        </p>

        {/* Linha inferior */}
        <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Conteúdo desenvolvido pela equipe Meu Destino.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="transition-colors hover:text-[var(--color-primary)]">
              Política de Privacidade
            </a>
            <a href="#" className="transition-colors hover:text-[var(--color-primary)]">
              Termos de Uso
            </a>
          </div>
        </div>
      </Container>

      {/* Barra de identidade */}
      <div className="h-1 bg-[var(--color-primary)]" />
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/* Ícones                                                                     */
/* -------------------------------------------------------------------------- */

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.7" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4a21 21 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.6v8h3.4Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="m10 9.5 5 2.5-5 2.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
