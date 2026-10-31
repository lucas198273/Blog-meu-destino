import { Link, NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { Container } from '../ui/Container';

/** Logo textual "Meu Destino". Troque por <img> quando houver logotipo. */
const navItems = [
  { to: '/', label: 'Início' },
  { to: '/blog', label: 'Blog' },
  { to: '/destinos', label: 'Destinos' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/contato', label: 'Contato' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-[var(--color-bg)]/95 backdrop-blur">
      <Container>
        <div className="flex h-[72px] items-center justify-between gap-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2"
            aria-label="Meu Destino - Página inicial"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="var(--color-primary)" aria-hidden="true">
              <path d="M12 2C7.6 2 4 5.6 4 10c0 5.4 7.2 11.6 7.5 11.9a.8.8 0 0 0 1 0C12.8 21.6 20 15.4 20 10c0-4.4-3.6-8-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
            </svg>
            <span className="font-heading text-xl font-extrabold tracking-tight text-[var(--color-primary)]">
              Meu Destino
            </span>
          </Link>

          {/* Navegação */}
          <nav className="hidden items-center gap-7 md:flex" aria-label="Navegação principal">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'text-[14px] font-medium transition-colors',
                    isActive
                      ? 'text-[var(--color-primary)]'
                      : 'text-[var(--color-text)] hover:text-[var(--color-primary)]',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Ações à direita */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Buscar"
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-[var(--color-primary)]"
            >
              <SearchIcon />
            </button>

            {/* CTA laranja */}
            <Link
              to="/destinos"
              className="hidden h-10 items-center rounded-lg bg-[var(--color-accent)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-dark)] sm:inline-flex"
            >
              Planeje sua Viagem
            </Link>

            <button
              type="button"
              aria-label="Abrir menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 md:hidden"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}

/* Ícones */
function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 3.5 3.5" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}
