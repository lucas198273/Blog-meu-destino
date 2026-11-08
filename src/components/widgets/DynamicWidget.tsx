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
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      if (cancelled) return;
      const container = containerRef.current;
      if (!container) return;

      const parsed = new DOMParser().parseFromString(widget.codigo_script, 'text/html');

      // 1) Extrai e insere a div (e demais nós não-script) no container via ref.
      const frag = document.createDocumentFragment();
      const scripts: HTMLScriptElement[] = [];
      parsed.body.childNodes.forEach((node) => {
        if (node.nodeName === 'SCRIPT') {
          scripts.push(node as HTMLScriptElement);
          return;
        }
        frag.appendChild(document.importNode(node, true));
      });
      container.appendChild(frag);

      // 2) Recria cada <script> como elemento novo para que o browser o execute,
      //    copiando TODOS os atributos (data-*, src, id, async etc.).
      const inserted: HTMLScriptElement[] = scripts.map((original) => {
        const script = document.createElement('script');
        for (const attr of Array.from(original.attributes)) {
          script.setAttribute(attr.name, attr.value);
        }
        if (original.src) {
          script.src = original.src;
        } else {
          script.textContent = original.textContent ?? '';
        }
        document.body.appendChild(script); // insere no final do body
        return script;
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
      if (containerRef.current) containerRef.current.textContent = '';
    };
  }, [status, widget]);

  // data: null, erro ou sem codigo_script → não renderiza nada.
  if (status === 'error' || !widget || !widget.codigo_script) return null;
  if (status !== 'ready') {
    // Skeleton discreto enquanto carrega; alguns widgets não têm altura fixa.
    return (
      <div
        aria-hidden="true"
        className="mb-6 h-[90px] w-full animate-pulse rounded-xl bg-slate-200/60"
      />
    );
  }
  return <div ref={containerRef} data-widget-provider={widget.provider} />;
}
