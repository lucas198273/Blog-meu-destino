import { useEffect, useState, type ReactNode } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

export function MobileFilterDrawer({
  children,
  title = 'Filtros',
  closeOnSelect = false,
}: {
  children: ReactNode;
  title?: string;
  /** Fecha o drawer automaticamente quando o usuário seleciona um filtro. */
  closeOnSelect?: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  /**
   * Fecha o drawer quando o usuário escolhe qualquer opção de filtro.
   * Delegação de evento: captura cliques em botões dentro do conteúdo
   * (exceto o próprio botão "limpar filtros", que também faz sentido fechar).
   */
  function handleContentClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!closeOnSelect || !open) return;
    const target = event.target as HTMLElement;
    if (target.closest('button, a, select, label')) {
      setOpen(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="mb-5 inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        Mostrar Filtros
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Fechar filtros"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-950/50"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
              <h2 className="text-lg font-bold text-slate-900">{title}</h2>
              <button
                type="button"
                aria-label="Fechar filtros"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>
            <div
              className="flex-1 overflow-y-auto p-4"
              onClick={handleContentClick}
            >
              {children}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
