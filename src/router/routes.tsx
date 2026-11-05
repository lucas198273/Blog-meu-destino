import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { HomePage } from '../pages/HomePage';
import { BlogListPage } from '../pages/BlogListPage';
import { BlogPostPage } from '../pages/BlogPostPage';
import { TravelPackagesPage } from '../pages/TravelPackagesPage';
import { VehiclesPage } from '../pages/VehiclesPage';
import { ProductPage } from '../pages/ProductPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { AboutPage } from '../pages/AboutPage';
import { ContactPage } from '../pages/ContactPage';
import { ErrorPage } from '../pages/ErrorPage';
import { LegacyProductRedirect } from './LegacyProductRedirect';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { BlogCategoriesPage } from '../pages/BlogCategoriesPage';
import { ProductCategoriesPage } from '../pages/ProductCategoriesPage';
import { NicheProductsPage } from '../pages/NicheProductsPage';
import { TermsPage } from '../pages/TermsPage';
import { PrivacyPage } from '../pages/PrivacyPage';

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
      { path: 'blog/categorias', element: <BlogCategoriesPage /> },
      { path: 'blog/categoria/:slug', element: <BlogListPage /> },
      { path: 'blog/:slug', element: <BlogPostPage /> },
      { path: 'pacotes-de-viagem', element: <TravelPackagesPage /> },
      { path: 'destinos', element: <Navigate to="/pacotes-de-viagem" replace /> },
      { path: 'viagens', element: <Navigate to="/pacotes-de-viagem" replace /> },
      { path: 'aluguel-de-veiculos', element: <VehiclesPage /> },
      { path: 'equipamentos', element: <NicheProductsPage niche="equipamentos" /> },
      { path: 'veiculos', element: <NicheProductsPage niche="veiculos" /> },
      { path: 'categorias', element: <ProductCategoriesPage /> },
      { path: 'destino/:slug', element: <ProductPage /> },
      { path: 'produto/:slug', element: <ProductDetailPage /> },
      { path: 'sobre', element: <AboutPage /> },
      { path: 'contato', element: <ContactPage /> },
      { path: 'termos-de-uso', element: <TermsPage /> },
      { path: 'politica-de-privacidade', element: <PrivacyPage /> },
      // Legado
      { path: 'cursos', element: <Navigate to="/pacotes-de-viagem" replace /> },
      { path: 'curso/:slug', element: <LegacyProductRedirect /> },
      { path: 'produtos', element: <Navigate to="/pacotes-de-viagem" replace /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
