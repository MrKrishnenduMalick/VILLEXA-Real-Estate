import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
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

export const App: React.FC = () => {
  const [location] = useLocation();

  // Scroll to top automatically when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Scroll-responsive glass reveals for public floating panels (handles async page loads)
  useEffect(() => {
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
  }, [location]);

  return (
    <ClientConfigProvider>
      <CinematicHeroProvider>
        <Header />
        <CinematicShowroomBackground />
        <main className="showroom-public-main">
          <Switch>
            {/* Public Real Estate Routes */}
            <Route path="/" component={HomePage} />
            
            {/* Residences / Portfolio (Dual routes for seamless transition) */}
            <Route path="/residences" component={CataloguePage} />
            <Route path="/catalogue" component={CataloguePage} />
            
            {/* Individual Property Detail */}
            <Route path="/residence/:slug" component={ProductDetailPage} />
            <Route path="/residences/:slug" component={ProductDetailPage} />
            <Route path="/product/:slug" component={ProductDetailPage} />
            
            {/* Curated Portfolios */}
            <Route path="/collections" component={CollectionsPage} />
            
            {/* Architectural Vision (Dual routes) */}
            <Route path="/vision" component={CraftsmanshipPage} />
            <Route path="/craftsmanship" component={CraftsmanshipPage} />
            
            {/* Lifestyle & Living (Dual routes) */}
            <Route path="/experience" component={InspirationPage} />
            <Route path="/lifestyle" component={InspirationPage} />
            <Route path="/inspiration" component={InspirationPage} />
            
            {/* The VILLEXA Philosophy / About */}
            <Route path="/philosophy" component={CraftsmanshipPage} />
            <Route path="/about" component={CraftsmanshipPage} />
            
            {/* Contact & Private Enquiries */}
            <Route path="/contact" component={ContactPage} />

            {/* 404 Fallback Route */}
            <Route>
              <div style={{ padding: 'var(--space-24) 0' }}>
                <div className="container">
                  <EmptyState
                    type="generic"
                    title="Page Outside Residence Registry"
                    description="The architectural page or reference you requested does not exist."
                    actionLabel="Return to Overview"
                    actionHref="/"
                  />
                </div>
              </div>
            </Route>
          </Switch>
        </main>
        {location !== '/' && <Footer />}
      </CinematicHeroProvider>
    </ClientConfigProvider>
  );
};