import { lazy, Suspense, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation, Router as WouterRouter } from "wouter";
import { useLanguage, langBase } from "./contexts/LanguageContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import PageLoader from "./components/PageLoader";
import { ConfirmDialogHost } from "./components/ConfirmDialog";
import { RouteScrollToTop } from "./components/ScrollToTop";
import DeferredMount from "./components/DeferredMount";
import { useIsMobile } from "@/hooks/useMobile";

// ─── First-paint-critical chrome (eager) ─────────────────────────────────
// CustomCursor: small, mounted very early so the teal pointer appears
// instantly without a render flicker. SmoothScroll: tiny utility, attaches
// listeners on mount and is cheap.
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./components/CustomCursor";

// ─── Non-critical chrome (lazy — loaded after first paint) ───────────────
// These components either trigger later (ExitIntent ~5s, NewsletterPopup
// ~30s), only show on user action (SearchModal, WechatButton, WeChat QR,
// BackToTopButton after scroll), or are purely decorative (PolygonNetwork
// background, GrainOverlay). Lazy-loading them moves ~150-200 KB out of
// the first-paint bundle without changing user-visible behaviour.
const GrainOverlay = lazy(() => import("./components/GrainOverlay"));
const PolygonNetwork = lazy(() => import("./components/PolygonNetwork"));
const WhatsAppButton = lazy(() => import("./components/WhatsAppButton"));
const WechatButton = lazy(() => import("./components/WechatButton"));
const ExitIntentPopup = lazy(() => import("./components/ExitIntentPopup"));
const NewsletterPopup = lazy(() => import("./components/NewsletterPopup"));
const ThirdPartyScripts = lazy(() => import("./components/ThirdPartyScripts"));
const SearchModal = lazy(() => import("./components/SearchModal"));
const CalendlyBadge = lazy(() =>
  import("./components/CalendlyEmbed").then((m) => ({ default: m.CalendlyBadge })),
);
const BackToTopButton = lazy(() =>
  import("./components/ScrollToTop").then((m) => ({ default: m.BackToTopButton })),
);

// ─── Lazy-loaded route chunks ──────────────────────────────────────────────
// Home + NotFound stay eager (landing + fallback). Everything else is split
// into separate chunks so first paint only ships ~50-60% of the previous JS.
const ServicePage = lazy(() => import("./pages/ServicePage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const ExpertisePage = lazy(() => import("./pages/ExpertisePage"));
const TechnologyPage = lazy(() => import("./pages/TechnologyPage"));
const PartnersPage = lazy(() => import("./pages/PartnersPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const AszfPage = lazy(() => import("./pages/AszfPage"));
const HirlevelPage = lazy(() => import("./pages/HirlevelPage"));
// MarketingAuditPage import removed — /marketing-audit is now a Vercel 301
// to /ingyenes-audit (audit §3.3 consolidation). The component file is kept
// so the previous content is recoverable, just no longer route-mounted.
const KarrierPage = lazy(() => import("./pages/KarrierPage"));
const RolunkPage = lazy(() => import("./pages/RolunkPage"));
const NewServicePage = lazy(() => import("./pages/NewServicePage"));
const AuditPage = lazy(() => import("./pages/AuditPage"));
const ReferenciakPage = lazy(() => import("./pages/ReferenciakPage"));
const IparagiLandingPage = lazy(() => import("./pages/IparagiLandingPage"));
const SeoAuditPage = lazy(() => import("./pages/SeoAuditPage"));
const CaseStudyDetailPage = lazy(() => import("./pages/CaseStudyDetailPage"));

// Admin chunks — none of these load on public pages
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminPosts = lazy(() => import("./pages/admin/AdminPosts"));
const AdminPostEdit = lazy(() => import("./pages/admin/AdminPostEdit"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices"));
const AdminPartners = lazy(() => import("./pages/admin/AdminPartners"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminContacts = lazy(() => import("./pages/admin/AdminContacts"));
const AdminNewsletter = lazy(() => import("./pages/admin/AdminNewsletter"));
const AdminNewsletterCampaigns = lazy(() => import("./pages/admin/AdminNewsletterCampaigns"));
const AdminSeoPages = lazy(() => import("./pages/admin/AdminSeoPages"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminResetPassword = lazy(() => import("./pages/admin/AdminResetPassword"));
const AdminHeroSlides = lazy(() => import("./pages/admin/AdminHeroSlides"));
const AdminIndustries = lazy(() => import("./pages/admin/AdminIndustries"));
const AdminTechnologies = lazy(() => import("./pages/admin/AdminTechnologies"));
const AdminValues = lazy(() => import("./pages/admin/AdminValues"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminCaseStudies = lazy(() => import("./pages/admin/AdminCaseStudies"));
const AdminAuditLeads = lazy(() => import("./pages/admin/AdminAuditLeads"));
const AdminCareers = lazy(() => import("./pages/admin/AdminCareers"));
const AdminBrandVoice = lazy(() => import("./pages/admin/AdminBrandVoice"));

function PublicRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/rolunk" component={RolunkPage} />
      <Route path="/szolgaltatasok/ai-marketing" component={() => <NewServicePage params={{ slug: "ai-marketing" }} />} />
      <Route path="/szolgaltatasok/ppc-google-ads" component={() => <NewServicePage params={{ slug: "ppc-google-ads" }} />} />
      <Route path="/szolgaltatasok/meta-hirdetes" component={() => <NewServicePage params={{ slug: "meta-hirdetes" }} />} />
      <Route path="/szolgaltatasok/tartalommarketing" component={() => <NewServicePage params={{ slug: "tartalommarketing" }} />} />
      <Route path="/szolgaltatasok/marketing-automatizacio" component={() => <NewServicePage params={{ slug: "marketing-automatizacio" }} />} />
      <Route path="/szolgaltatasok/esg-kommunikacio" component={() => <NewServicePage params={{ slug: "esg-kommunikacio" }} />} />
      <Route path="/szolgaltatasok/employer-branding" component={() => <NewServicePage params={{ slug: "employer-branding" }} />} />
      <Route path="/szolgaltatasok/nemzetkozi-marketing" component={() => <NewServicePage params={{ slug: "nemzetkozi-marketing" }} />} />
      {/* Migrated to the NewServicePage layout (serviceConfigs-driven) — these
          6 previously rendered via the legacy DB-backed ServicePage. */}
      <Route path="/szolgaltatasok/arculattervezes" component={() => <NewServicePage params={{ slug: "arculattervezes" }} />} />
      <Route path="/szolgaltatasok/hirdeteskezeles" component={() => <NewServicePage params={{ slug: "hirdeteskezeles" }} />} />
      <Route path="/szolgaltatasok/kozossegi-media" component={() => <NewServicePage params={{ slug: "kozossegi-media" }} />} />
      <Route path="/szolgaltatasok/strategiai-marketing" component={() => <NewServicePage params={{ slug: "strategiai-marketing" }} />} />
      <Route path="/szolgaltatasok/keresooptimalizalas" component={() => <NewServicePage params={{ slug: "keresooptimalizalas" }} />} />
      <Route path="/szolgaltatasok/webfejlesztes" component={() => <NewServicePage params={{ slug: "webfejlesztes" }} />} />
      <Route path="/ingyenes-audit" component={AuditPage} />
      <Route path="/referenciak" component={ReferenciakPage} />
      <Route path="/referenciak/:slug" component={CaseStudyDetailPage} />
      <Route path="/iparagi/:slug" component={IparagiLandingPage} />
      <Route path="/szolgaltatasok" component={ServicesPage} />
      <Route path="/szolgaltatasok/:slug" component={ServicePage} />
      <Route path="/szakertelem" component={ExpertisePage} />
      <Route path="/technologia" component={TechnologyPage} />
      <Route path="/partnereink" component={PartnersPage} />
      <Route path="/hirek" component={BlogPage} />
      <Route path="/hirek/:slug" component={BlogPostPage} />
      <Route path="/kapcsolat" component={ContactPage} />
      <Route path="/adatvedelmi-iranyelvek" component={PrivacyPage} />
      <Route path="/aszf" component={AszfPage} />
      <Route path="/hirlevel" component={HirlevelPage} />
      {/* /marketing-audit → /ingyenes-audit, handled by vercel.json 301 (audit §3.3) */}
      <Route path="/karrier" component={KarrierPage} />
      <Route path="/ingyenes-seo-audit" component={SeoAuditPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
    </Suspense>
  );
}

function AdminRouter() {
  // Password reset must render OUTSIDE AdminLayout — the visitor following an
  // invite / forgot-password link isn't signed in yet, and AdminLayout would
  // just show them the login screen instead.
  if (window.location.pathname === "/admin/reset-password") {
    return (
      <Suspense fallback={<PageLoader />}>
        <AdminResetPassword />
      </Suspense>
    );
  }
  return (
    <Suspense fallback={<PageLoader />}>
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/posts" component={AdminPosts} />
        <Route path="/admin/posts/new" component={AdminPostEdit} />
        <Route path="/admin/posts/:id" component={AdminPostEdit} />
        <Route path="/admin/categories" component={AdminCategories} />
        <Route path="/admin/services" component={AdminServices} />
        <Route path="/admin/hero-slides" component={AdminHeroSlides} />
        <Route path="/admin/partners" component={AdminPartners} />
        <Route path="/admin/testimonials" component={AdminTestimonials} />
        <Route path="/admin/industries" component={AdminIndustries} />
        <Route path="/admin/technologies" component={AdminTechnologies} />
        <Route path="/admin/values" component={AdminValues} />
        <Route path="/admin/contacts" component={AdminContacts} />
        <Route path="/admin/newsletter" component={AdminNewsletter} />
        <Route path="/admin/newsletter/campaigns" component={AdminNewsletterCampaigns} />
        <Route path="/admin/case-studies" component={AdminCaseStudies} />
        <Route path="/admin/audit-leads" component={AdminAuditLeads} />
        <Route path="/admin/careers" component={AdminCareers} />
        <Route path="/admin/brand-voice" component={AdminBrandVoice} />
        <Route path="/admin/seo" component={AdminSeoPages} />
        <Route path="/admin/users" component={AdminUsers} />
        <Route path="/admin/settings" component={AdminSettings} />
        <Route component={AdminDashboard} />
      </Switch>
    </AdminLayout>
    </Suspense>
  );
}

function Router() {
  const { lang } = useLanguage();
  const path = window.location.pathname;
  if (path.startsWith("/admin")) {
    return <AdminRouter />;
  }
  // Public routes live under a language-prefixed base (/en, /zh, or "" for HU default).
  // wouter's base prop handles both Link href rewriting and useLocation matching.
  return (
    <WouterRouter base={langBase(lang)}>
      <PublicRouter />
    </WouterRouter>
  );
}

/**
 * Chrome components that only belong on public (marketing) pages — hidden from /admin.
 * Keeps admin free of cursor effects, polygons, popups, sticky CTAs.
 */
function PublicOnlyChrome() {
  const [location] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  // Cmd/Ctrl+K to open search anywhere on the public site (admin has its own UI)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        // Don't intercept if user is typing in an input — let browser default
        const target = e.target as HTMLElement | null;
        if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable) return;
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Listen for the custom event the Navigation search button dispatches
  useEffect(() => {
    const onOpen = () => setSearchOpen(true);
    window.addEventListener("g2a:open-search", onOpen);
    return () => window.removeEventListener("g2a:open-search", onOpen);
  }, []);

  if (location.startsWith("/admin")) return null;
  return (
    <>
      <SmoothScroll />
      {/* Decorative + late-trigger chrome — all lazy-loaded so they don't
           bloat the first-paint bundle. Fallback=null because none of them
           are visible immediately (PolygonNetwork is a faint background,
           the popups trigger after several seconds, modals open on user
           action). PolygonNetwork additionally goes through DeferredMount
           because it runs a constant requestAnimationFrame canvas loop —
           Lighthouse mistakes the continuous repaints for "no stable LCP". */}
      <Suspense fallback={null}>
        <DeferredMount delay={250}>
          <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
            <PolygonNetwork density={0.42} lineAlpha={0.16} pointAlpha={0.5} />
          </div>
        </DeferredMount>
      </Suspense>
      <CustomCursor />
      <Suspense fallback={null}>
        {/* Floating contact icons — WhatsApp, WeChat and the Calendly booking
            badge. Desktop only: on phones they stack over the content and the
            user asked to drop them (the hamburger + footer carry the same CTAs). */}
        {!isMobile && <WhatsAppButton />}
        {!isMobile && <WechatButton />}
        <ExitIntentPopup />
        <NewsletterPopup />
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
        {/* Calendly floating badge — bottom-right pill that opens booking popup.
            Hidden on /kapcsolat (already has inline embed), /admin, and mobile. */}
        {!isMobile && <CalendlyBadge />}
      </Suspense>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <ConfirmDialogHost>
            <PublicOnlyChrome />
            <Suspense fallback={null}>
              <GrainOverlay opacity={0.05} />
            </Suspense>
            <Toaster />
            <RouteScrollToTop />
            <Suspense fallback={null}>
              <ThirdPartyScripts />
            </Suspense>
            <div style={{ position: "relative", zIndex: 1 }}>
              <Router />
            </div>
            <Suspense fallback={null}>
              <BackToTopButton />
            </Suspense>
          </ConfirmDialogHost>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
