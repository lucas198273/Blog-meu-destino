import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { HomePage } from '../pages/HomePage';
import { BlogListPage } from '../pages/BlogListPage';
import { BlogPostPage } from '../pages/BlogPostPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductPage } from '../pages/ProductPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { AboutPage } from '../pages/AboutPage';
import { ContactPage } from '../pages/ContactPage';
import { ErrorPage } from '../pages/ErrorPage';
import { LegacyProductRedirect } from './LegacyProductRedirect';

/**
 * Todas as rotas sÃ£o pÃºblicas. Sem auth, sem admin, sem CRUD.
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'blog', element: <BlogListPage /> },
      { path: 'blog/categoria/:slug', element: <BlogListPage /> },
      { path: 'blog/:slug', element: <BlogPostPage /> },
      // Catálogo de destinos/ofertas (o domínio segue `Product`).
      { path: 'destinos', element: <ProductsPage /> },
      { path: 'destino/:slug', element: <ProductPage /> },
      { path: 'sobre', element: <AboutPage /> },
      { path: 'contato', element: <ContactPage /> },
      // Legado
      { path: 'cursos', element: <Navigate to="/destinos" replace /> },
      { path: 'curso/:slug', element: <LegacyProductRedirect /> },
      { path: 'produtos', element: <Navigate to="/destinos" replace /> },
      { path: 'produto/:slug', element: <LegacyProductRedirect /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
