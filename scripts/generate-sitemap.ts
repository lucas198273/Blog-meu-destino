import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

interface SitemapEntry {
  loc: string;
  lastmod: string;
  priority: number;
}

interface ApiItem {
  id?: unknown;
  slug?: unknown;
  niche?: unknown;
  updated_at?: unknown;
  published_at?: unknown;
  created_at?: unknown;
}

interface ApiCollection<T> {
  items: T[];
  totalPages?: number;
}

function parseEnv(contents: string): Record<string, string> {
  const values: Record<string, string> = {};
  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || match[1] === undefined || match[2] === undefined) continue;
    values[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2').trim();
  }
  return values;
}

async function loadEnvFile(name: string): Promise<Record<string, string>> {
  try {
    return parseEnv(await readFile(resolve(process.cwd(), name), 'utf8'));
  } catch (error) {
    if (isMissingFile(error)) return {};
    throw error;
  }
}

function isMissingFile(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'ENOENT'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function fetchCollection<T>(apiUrl: string, route: string): Promise<ApiCollection<T>> {
  const items: T[] = [];
  const limit = 100;

  for (let page = 1; page <= 1000; page += 1) {
    const response = await fetch(
      `${apiUrl}${route}${route.includes('?') ? '&' : '?'}page=${page}&limit=${limit}`,
      {
        headers: {
          Accept: 'application/json',
          ...(process.env.VITE_DEFAULT_TENANT_SLUG
            ? { 'X-Tenant-Slug': process.env.VITE_DEFAULT_TENANT_SLUG }
            : {}),
        },
      },
    );
    if (!response.ok) throw new Error(`${route} respondeu HTTP ${response.status}`);

    const payload: unknown = await response.json();
    const outer = isRecord(payload) ? payload : {};
    const body = isRecord(outer.data) ? outer.data : outer;
    const pageItems = Array.isArray(body.items)
      ? (body.items as T[])
      : Array.isArray(outer.data)
        ? (outer.data as T[])
        : Array.isArray(body)
          ? (body as T[])
          : [];
    items.push(...pageItems);

    const meta = isRecord(body.meta) ? body.meta : undefined;
    const totalPages =
      typeof meta?.totalPages === 'number'
        ? meta.totalPages
        : typeof meta?.total_pages === 'number'
          ? meta.total_pages
          : undefined;
    if (totalPages !== undefined ? page >= totalPages : pageItems.length < limit) {
      return { items, totalPages };
    }
  }

  throw new Error(`${route} excedeu o limite de 1000 páginas`);
}

function xmlEscape(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function lastModified(item?: ApiItem): string {
  const date = item?.updated_at ?? item?.published_at ?? item?.created_at;
  if (typeof date === 'string' && !Number.isNaN(Date.parse(date))) {
    return new Date(date).toISOString().slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  const [baseEnv, localEnv] = await Promise.all([
    loadEnvFile('.env'),
    loadEnvFile('.env.local'),
  ]);
  const apiUrl = (
    process.env.VITE_API_URL ??
    localEnv.VITE_API_URL ??
    baseEnv.VITE_API_URL ??
    ''
  ).replace(/\/+$/, '');
  const siteUrl = (
    process.env.VITE_SITE_URL ??
    localEnv.VITE_SITE_URL ??
    baseEnv.VITE_SITE_URL ??
    'https://guiameudestino.com.br'
  ).replace(/\/+$/, '');
  process.env.VITE_DEFAULT_TENANT_SLUG ??=
    localEnv.VITE_DEFAULT_TENANT_SLUG ?? baseEnv.VITE_DEFAULT_TENANT_SLUG ?? '';

  const entries: SitemapEntry[] = [
    { loc: '/', lastmod: lastModified(), priority: 1 },
    { loc: '/blog', lastmod: lastModified(), priority: 0.9 },
    { loc: '/blog/categorias', lastmod: lastModified(), priority: 0.7 },
    { loc: '/categorias', lastmod: lastModified(), priority: 0.8 },
    { loc: '/veiculos', lastmod: lastModified(), priority: 0.8 },
    { loc: '/equipamentos', lastmod: lastModified(), priority: 0.8 },
    { loc: '/pacotes-de-viagem', lastmod: lastModified(), priority: 0.8 },
    { loc: '/aluguel-de-veiculos', lastmod: lastModified(), priority: 0.8 },
    { loc: '/sobre', lastmod: lastModified(), priority: 0.5 },
    { loc: '/contato', lastmod: lastModified(), priority: 0.5 },
    { loc: '/termos-de-uso', lastmod: lastModified(), priority: 0.5 },
    { loc: '/politica-de-privacidade', lastmod: lastModified(), priority: 0.5 },
  ];

  if (!apiUrl) {
    console.warn('Sitemap: VITE_API_URL ausente; gerando sitemap apenas com páginas estáticas.');
  } else {
    const collections = await Promise.allSettled([
      fetchCollection<ApiItem>(apiUrl, '/api/products'),
      fetchCollection<ApiItem>(apiUrl, '/api/blog/posts'),
      fetchCollection<ApiItem>(apiUrl, '/api/blog/categories'),
      fetchCollection<ApiItem>(apiUrl, '/api/products/categories'),
    ]);

    const [products, posts, blogCategories, productCategories] = collections;
    if (products.status === 'fulfilled') {
      for (const product of products.value.items) {
        if (typeof product.slug === 'string' && product.slug) {
          entries.push({
            loc: `/produto/${encodeURIComponent(product.slug)}`,
            lastmod: lastModified(product),
            priority: 0.8,
          });
        }
      }
    } else {
      console.warn('Sitemap: falha ao consultar produtos:', products.reason);
    }
    if (posts.status === 'fulfilled') {
      for (const post of posts.value.items) {
        if (typeof post.slug === 'string' && post.slug) {
          entries.push({
            loc: `/blog/${encodeURIComponent(post.slug)}`,
            lastmod: lastModified(post),
            priority: 0.7,
          });
        }
      }
    } else {
      console.warn('Sitemap: falha ao consultar posts:', posts.reason);
    }
    if (blogCategories.status === 'fulfilled') {
      for (const category of blogCategories.value.items) {
        if (typeof category.slug === 'string' && category.slug) {
          entries.push({
            loc: `/blog/categoria/${encodeURIComponent(category.slug)}`,
            lastmod: lastModified(category),
            priority: 0.6,
          });
        }
      }
    } else {
      console.warn('Sitemap: falha ao consultar categorias do blog:', blogCategories.reason);
    }
    if (productCategories.status === 'fulfilled') {
      for (const category of productCategories.value.items) {
        const nichePath =
          category.niche === 'veiculos'
            ? '/veiculos'
            : category.niche === 'equipamentos'
              ? '/equipamentos'
              : category.niche === 'viagens'
                ? '/pacotes-de-viagem'
                : null;
        if (typeof category.id === 'string' && nichePath) {
          entries.push({
            loc: `${nichePath}?category=${encodeURIComponent(category.id)}`,
            lastmod: lastModified(category),
            priority: 0.6,
          });
        }
      }
    } else {
      console.warn('Sitemap: falha ao consultar categorias de produtos:', productCategories.reason);
    }
  }

  const uniqueEntries = new Map(
    entries.map((entry) => [
      entry.loc,
      `<url><loc>${xmlEscape(new URL(entry.loc, `${siteUrl}/`).toString())}</loc><lastmod>${entry.lastmod}</lastmod><priority>${entry.priority.toFixed(1)}</priority></url>`,
    ]),
  );
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...uniqueEntries.values(),
    '</urlset>',
    '',
  ].join('\n');

  const outputDirectory = resolve(process.cwd(), 'public');
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(resolve(outputDirectory, 'sitemap.xml'), sitemap, 'utf8');
  console.info(`Sitemap gerado: public/sitemap.xml (${uniqueEntries.size} URLs)`);
}

main().catch((error: unknown) => {
  console.error('Sitemap: não foi possível gerar o arquivo:', error);
  process.exitCode = 1;
});
