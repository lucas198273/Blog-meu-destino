import { useState, type FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '../components/ui/Container';

const CONTACT_EMAIL = 'contato@meudestino.com.br';

export function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: integrar com serviço de e-mail/backend
    setSent(true);
  }

  return (
    <>
      <Helmet>
        <title>Contato | Meu Destino</title>
        <meta
          name="description"
          content="Fale com a equipe do Meu Destino: dúvidas, sugestões de destinos e parcerias."
        />
      </Helmet>

      <Container className="py-16">
        <div className="mx-auto max-w-2xl">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Contato
          </p>
          <h1 className="font-heading mt-3 text-3xl font-bold tracking-tight text-[var(--color-primary)] sm:text-4xl">
            Vamos conversar?
          </h1>
          <p className="font-body mt-4 text-[15px] leading-relaxed text-[var(--color-text)]">
            Dúvidas, sugestões de destino ou propostas de parceria — escreva
            para nós. Respondemos em até 2 dias úteis.
          </p>

          {sent ? (
            <div
              role="status"
              className="mt-8 rounded-xl border border-[var(--color-primary)]/30 bg-[#E7F5F6] p-6 text-sm text-[var(--color-text)]"
            >
              <strong className="font-heading text-[var(--color-primary)]">
                Mensagem enviada!
              </strong>{' '}
              Obrigado pelo contato — responderemos em breve.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="font-heading mb-2 block text-sm font-semibold text-[var(--color-text)]"
                  >
                    Nome
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)] focus:outline focus:outline-2 focus:outline-offset-0 focus:outline-[var(--color-primary)]/30"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="font-heading mb-2 block text-sm font-semibold text-[var(--color-text)]"
                  >
                    E-mail
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)] focus:outline focus:outline-2 focus:outline-offset-0 focus:outline-[var(--color-primary)]/30"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="font-heading mb-2 block text-sm font-semibold text-[var(--color-text)]"
                >
                  Mensagem
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)] focus:outline focus:outline-2 focus:outline-offset-0 focus:outline-[var(--color-primary)]/30"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--color-accent)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-dark)]"
              >
                Enviar Mensagem
              </button>
            </form>
          )}

          <div className="mt-12 border-t border-slate-200 pt-8">
            <h2 className="font-heading text-base font-bold text-[var(--color-text)]">
              Outros canais
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                E-mail:{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium text-[var(--color-primary)] hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                Instagram e YouTube:{' '}
                <span className="font-medium text-[var(--color-text)]">@meudestino</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </>
  );
}
