const SITE_ORIGIN = 'https://guiameudestino.com.br';

export function canonicalUrl(pathname: string): string {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return new URL(normalizedPath, SITE_ORIGIN).toString();
}
