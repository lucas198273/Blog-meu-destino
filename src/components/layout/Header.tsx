import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { Container } from '../ui/Container';

const navItems = [
  { to: '/', label: 'Início' },
  { to: '/pacotes-de-viagem', label: 'Pacotes de viagem' },
  { to: '/veiculos', label: 'Veículos' },
  { to: '/equipamentos', label: 'Equipamentos' },
  { to: '/categorias', label: 'Categorias' },
  { to: '/blog', label: 'Blog' },
  { to: '/sobre', label: 'Sobre' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false);
    }

    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-[var(--color-bg)]/95 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-3 md:h-[72px] md:gap-4">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2"
            aria-label="Meu Destino - Página inicial"
            onClick={closeMenu}
          >
            <img
              src="/assets/logo.webp"
              alt="Meu Destino"
              loading="lazy"
              decoding="async"
              className="h-12 w-auto rounded-lg bg-white p-1 md:h-[62.4px]"
            />
          </Link>

          <nav
            className="hidden items-center gap-4 md:flex lg:gap-5 xl:gap-7"
            aria-label="Navegação principal"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap text-[13px] font-medium transition-colors xl:text-sm',
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

          <div className="flex items-center gap-3">
            <Link
              to="/pacotes-de-viagem"
              className="hidden h-10 items-center rounded-lg bg-[var(--color-accent)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-dark)] lg:inline-flex"
            >
              Planeje sua viagem
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 md:hidden"
            >
              {menuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {menuOpen ? (
        <div className="md:hidden">
          <nav
            id="mobile-navigation"
            aria-label="Navegação principal"
            className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto border-t border-slate-100 bg-white px-4 pb-6 pt-4 shadow-xl sm:px-6 md:top-[72px]"
          >
            <div className="mx-auto flex min-h-full max-w-7xl flex-col">
              <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-bold text-slate-900">Menu</span>
                <button
                  type="button"
                  aria-label="Fechar navegação"
                  onClick={closeMenu}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    cn(
                      'rounded-xl px-4 py-3.5 text-base font-semibold transition-colors',
                      isActive
                        ? 'bg-teal-50 text-teal-900'
                        : 'text-slate-700 hover:bg-slate-50',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/pacotes-de-viagem"
                onClick={closeMenu}
                className="mt-3 inline-flex h-12 items-center justify-center rounded-xl bg-[var(--color-accent)] px-4 text-sm font-bold text-white transition-colors hover:bg-[var(--color-accent-dark)]"
              >
                Planeje sua viagem
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
