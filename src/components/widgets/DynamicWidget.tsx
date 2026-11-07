import { useEffect, useRef, useState } from 'react';
import { widgetsApi } from '../../api/widgets';
import type { ResolvedWidget } from '../../types/widget';

interface DynamicWidgetProps {
  /** Nicho cadastrado no dashboard (ex: "aluguel-veiculos"). */
  niche: string;
  /** ID da localização selecionada no filtro (null = global). */
  locationId?: string | null;
  /** ID do tenant, quando disponível em contexto autenticado. */
  tenantId?: string;
}

/**
 * Renderiza o widget de afiliado resolvido pelo backend para o par
 * (nicho, localização). O `codigo_script` chega como HTML string
 * (`<div><script .../></div>`), então usamos DOMParser + refs:
 * o React não executa tags <script> via innerHTML/dangerouslySetInnerHTML,
 * mas elementos criados via document.createElement('script') e inseridos
 * no DOM executam normalmente.
 *
 * Fallback: quando nenhum `locationId` está selecionado, a chamada vai
 * SEM `location_id` — o backend resolve a hierarquia (cidade → estado →
 * país → global/Brasil) e devolve o widget da raiz.
 *
 * Em qualquer falha da API o componente não renderiza nada — o widget é
 * um complemento e jamais deve quebrar a página pública.
 */
export function DynamicWidget({ niche, locationId, tenantId }: DynamicWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [widget, setWidget] = useState<ResolvedWidget | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    widgetsApi
      .resolve({ tenant_id: tenantId ?? '', niche, location_id: locationId ?? null })
      .then((resolved) => {
        if (controller.signal.aborted) return;
        // DEBUG: confere o payload do envelope { success, data }.
        console.log('Widget recebido:', resolved);
        setWidget(resolved ?? null);
        setStatus('ready');
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setWidget(null);
        setStatus('error');
      });
    return () => controller.abort();
  }, [niche, locationId, tenantId]);

  // Injeta o HTML + executa o script do widget.
  useEffect(() => {
    if (status !== 'ready' || !widget || !containerRef.current) return;
    if (!widget.codigo_script) return; // sem script não há o que injetar

    const container = containerRef.current;
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

    // 3) Cleanup: remove nós e scripts ao trocar de localização / desmontar,
    //    evitando duplicações e execuções acumuladas.
    return () => {
      for (const script of inserted) script.remove();
      container.textContent = '';
    };
  }, [status, widget, locationId]);

  if (status === 'error') return null;
  if (status !== 'ready' || !widget) {
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
