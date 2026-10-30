import React, { useEffect, Suspense, lazy } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { AuthProvider } from './context/AuthContext';
import { ClientConfigProvider } from './context/ClientConfigContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { CataloguePage } from './pages/CataloguePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { CraftsmanshipPage } from './pages/CraftsmanshipPage';
import { InspirationPage } from './pages/InspirationPage';
import { ContactPage } from './pages/ContactPage';
import { EmptyState } from './components/common/EmptyState';
import { CinematicHeroProvider } from './context/CinematicHeroContext';
import { CinematicShowroomBackground } from './components/layout/CinematicShowroomBackground';

// Lazy-loaded Admin Control Center (isolated from public visitor bundle)
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview').then(m => ({ default: m.AdminOverview })));
const AdminProductList = lazy(() => import('./pages/admin/AdminProductList').then(m => ({ default: m.AdminProductList })));
const AdminProductEditor = lazy(() => import('./pages/admin/AdminProductEditor').then(m => ({ default: m.AdminProductEditor })));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories').then(m => ({ default: m.AdminCategories })));
const AdminCollections = lazy(() => import('./pages/admin/AdminCollections').then(m => ({ default: m.AdminCollections })));
const AdminShowroomMedia = lazy(() => import('./pages/admin/AdminShowroomMedia').then(m => ({ default: m.AdminShowroomMedia })));
const AdminHeroFrames = lazy(() => import('./pages/admin/AdminHeroFrames').then(m => ({ default: m.AdminHeroFrames })));
const AdminSiteSettings = lazy(() => import('./pages/admin/AdminSiteSettings').then(m => ({ default: m.AdminSiteSettings })));
const AdminStorageAudit = lazy(() => import('./pages/admin/AdminStorageAudit').then(m => ({ default: m.AdminStorageAudit })));
const AdminEnquiries = lazy(() => import('./pages/admin/AdminEnquiries').then(m => ({ default: m.AdminEnquiries })));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));

const AdminLoadingFallback: React.FC = () => (
  <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <span className="kicker" style={{ letterSpacing: '0.2em' }}>AUTHENTICATING ATELIER CONSOLE...</span>
  </div>
);

export const App: React.FC = () => {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');

  // Scroll to top automatically when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Scroll-responsive glass reveals for public floating panels (handles async page loads)
  useEffect(() => {
    if (isAdminRoute) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll('.scroll-reveal').forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    const observeNewElements = () => {
      const elements = document.querySelectorAll('.scroll-reveal:not([data-reveal-observed="true"])');
      elements.forEach((el) => {
        el.setAttribute('data-reveal-observed', 'true');
        observer.observe(el);
      });
    };

    observeNewElements();

    const mutationObserver = new MutationObserver(() => {
      observeNewElements();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location, isAdminRoute]);

  return (
    <ClientConfigProvider>
      <AuthProvider>
        <CinematicHeroProvider>
          {!isAdminRoute && <Header />}
          {!isAdminRoute && <CinematicShowroomBackground />}
          <main className={!isAdminRoute ? 'showroom-public-main' : ''}>
            <Suspense fallback={<AdminLoadingFallback />}>
              <Switch>
                {/* Public Website Routes */}
                <Route path="/" component={HomePage} />
                <Route path="/catalogue" component={CataloguePage} />
                <Route path="/product/:slug" component={ProductDetailPage} />
                <Route path="/collections" component={CollectionsPage} />
                <Route path="/craftsmanship" component={CraftsmanshipPage} />
                <Route path="/inspiration" component={InspirationPage} />
                <Route path="/contact" component={ContactPage} />

                {/* Admin Routes */}
                <Route path="/admin/login" component={AdminLogin} />
                <Route path="/admin">
                  <AdminLayout>
                    <AdminOverview />
                  </AdminLayout>
                </Route>
                <Route path="/admin/products">
                  <AdminLayout>
                    <AdminProductList />
                  </AdminLayout>
                </Route>
                <Route path="/admin/products/new">
                  <AdminLayout>
                    <AdminProductEditor />
                  </AdminLayout>
                </Route>
                <Route path="/admin/products/:id">
                  <AdminLayout>
                    <AdminProductEditor />
                  </AdminLayout>
                </Route>
                <Route path="/admin/categories">
                  <AdminLayout>
                    <AdminCategories />
                  </AdminLayout>
                </Route>
                <Route path="/admin/collections">
                  <AdminLayout>
                    <AdminCollections />
                  </AdminLayout>
                </Route>
                <Route path="/admin/media">
                  <AdminLayout>
                    <AdminShowroomMedia />
                  </AdminLayout>
                </Route>
                <Route path="/admin/hero-frames">
                  <AdminLayout>
                    <AdminHeroFrames />
                  </AdminLayout>
                </Route>
                <Route path="/admin/settings">
                  <AdminLayout>
                    <AdminSiteSettings />
                  </AdminLayout>
                </Route>
                <Route path="/admin/storage-audit">
                  <AdminLayout>
                    <AdminStorageAudit />
                  </AdminLayout>
                </Route>
                <Route path="/admin/enquiries">
                  <AdminLayout>
                    <AdminEnquiries />
                  </AdminLayout>
                </Route>

                {/* 404 Fallback Route */}
                <Route>
                  <div style={{ padding: 'var(--space-24) 0' }}>
                    <div className="container">
                      <EmptyState
                        type="generic"
                        title="Page Outside Atelier Registry"
                        description="The architectural page or reference you requested does not exist."
                        actionLabel="Return to Showroom Overview"
                        actionHref="/"
                      />
                    </div>
                  </div>
                </Route>
              </Switch>
            </Suspense>
          </main>
      {!isAdminRoute && <Footer />}
        </CinematicHeroProvider>
      </AuthProvider>
    </ClientConfigProvider>
  );
};
