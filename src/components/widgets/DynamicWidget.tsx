import { useEffect, useRef, useState } from 'react';
import { widgetsApi } from '../../api/widgets';
import type { ResolvedWidget } from '../../types/widget';

interface DynamicWidgetProps {
  /** Nicho cadastrado no dashboard (ex: "aluguel-veiculos"). */
  niche: string;
  /** ID da localização selecionada no filtro (null = global). */
  locationId?: string | null;
}

/**
 * Renderiza o widget de afiliado resolvido pelo backend para o par
 * (nicho, localização). O `codigo_script` chega como HTML string
 * (`<div><script .../></div>`), então usamos DOMParser + refs:
 * o React não executa tags <script> via innerHTML/dangerouslySetInnerHTML,
 * mas elementos criados via document.createElement('script') e inseridos
 * no DOM executam normalmente.
 *
 * Integração com o backend:
 * - Rota: GET `/api/widgets/resolve?niche=<niche>[&location_id=<uuid>]`
 * - O tenant é resolvido via header `X-Tenant-Slug` (enviado pelo
 *   `apiGet` a partir de `VITE_DEFAULT_TENANT_SLUG`) — site público
 *   não usa JWT, logo NÃO enviamos `tenant_id`.
 * - Envelope: `{ success: true, data: { codigo_script, provider, ... } }`
 *   ou `{ success: true, data: null }` (nenhum widget cadastrado) —
 *   nesse caso o componente NÃO renderiza nada.
 *
 * Em qualquer falha da API o componente também não renderiza nada —
 * o widget é um complemento e jamais deve quebrar a página pública.
 */
export function DynamicWidget({ niche, locationId }: DynamicWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [widget, setWidget] = useState<ResolvedWidget | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    widgetsApi
      .resolve({ niche, location_id: locationId ?? null })
      .then((resolved) => {
        if (controller.signal.aborted) return;
        // `resolved` é o `data` do envelope: pode ser o widget OU null.
        setWidget(resolved && resolved.codigo_script ? resolved : null);
        setStatus('ready');
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error('[DynamicWidget] falha na requisição:', error);
        setWidget(null);
        setStatus('error');
      });
    return () => controller.abort();
  }, [niche, locationId]);

  // Injeta o HTML + executa o script do widget.
  useEffect(() => {
    if (status !== 'ready' || !widget) return;
    if (!widget.codigo_script) return;

    // O container é renderizado no mesmo commit em que status === 'ready',
    // mas o ref só fica disponível depois do paint; garante com rAF.
    const targetContainer = containerRef.current;
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      if (cancelled) return;
      const container = targetContainer;
      if (!container) return;

      const parsed = new DOMParser().parseFromString(widget.codigo_script, 'text/html');
      const frag = document.createDocumentFragment();
      const compactDiscoverCars = widget.provider.toLowerCase() === 'discovercars';
      parsed.body.childNodes.forEach((node) => {
        frag.appendChild(document.importNode(node, true));
      });
      container.appendChild(frag);

      // Scripts importados via DOMParser/importNode são inertes. Recriá-los
      // no próprio lugar ativa também scripts aninhados dentro de divs.
      const inserted: HTMLScriptElement[] = [];
      container.querySelectorAll('script').forEach((original) => {
        const script = document.createElement('script');
        for (const attr of Array.from(original.attributes)) {
          script.setAttribute(attr.name, attr.value);
        }
        if (compactDiscoverCars) {
          // Mantém o formulário e a configuração de destino do widget, mas
          // remove os blocos promocionais que o deixam alto demais na página.
          for (const attribute of [
            'data-layout_benefits',
            'data-layout_description',
            'data-layout_powered_by',
            'data-layout_supplier_logos',
            'data-layout_title',
            'data-layout_top_logo',
          ]) {
            script.setAttribute(attribute, 'off');
          }
          script.setAttribute('data-layout_description_text', '');
          script.setAttribute('data-title-text', '');
          script.setAttribute('data-iframe-height', '320');
          script.setAttribute('data-iframe-scrolling', 'auto');
        }
        if (!original.hasAttribute('src')) {
          script.textContent = original.textContent ?? '';
        }
        original.replaceWith(script);
        inserted.push(script);
      });

      injected.push(...inserted);
    });
    const injected: HTMLScriptElement[] = [];

    // 3) Cleanup: remove nós e scripts ao trocar de localização / desmontar,
    //    evitando duplicações e execuções acumuladas.
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      for (const script of injected) script.remove();
      if (targetContainer) targetContainer.textContent = '';
    };
  }, [status, widget]);

  // data: null, erro ou sem codigo_script → não renderiza nada.
  if (status === 'loading' || status === 'idle') {
    return (
      <section aria-hidden="true" className="mx-auto mt-10 w-full max-w-5xl">
        <div className="h-24 w-full animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
      </section>
    );
  }
  if (status === 'error' || !widget || !widget.codigo_script) return null;
  return (
    <section
      aria-label="Mais opções de aluguel de veículos"
      className="mx-auto mt-10 w-full max-w-5xl"
      data-widget-provider={widget.provider}
    >
      <h2 className="mb-3 text-lg font-semibold text-slate-900">
        Compare opções de aluguel
      </h2>
      <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:p-3">
        <div ref={containerRef} className="w-full [&_iframe]:block [&_iframe]:w-full [&_iframe]:max-w-full" />
      </div>
    </section>
  );
}
