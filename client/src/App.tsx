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
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./components/CustomCursor";
import GrainOverlay from "./components/GrainOverlay";
import { ConfirmDialogHost } from "./components/ConfirmDialog";
import PolygonNetwork from "./components/PolygonNetwork";
import StickyCTA from "./components/StickyCTA";
import WhatsAppButton from "./components/WhatsAppButton";
import WechatButton from "./components/WechatButton";
import ExitIntentPopup from "./components/ExitIntentPopup";
import ThirdPartyScripts from "./components/ThirdPartyScripts";
import SearchModal from "./components/SearchModal";
import { CalendlyBadge } from "./components/CalendlyEmbed";
import { RouteScrollToTop, BackToTopButton } from "./components/ScrollToTop";

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
const AdminHeroSlides = lazy(() => import("./pages/admin/AdminHeroSlides"));
const AdminIndustries = lazy(() => import("./pages/admin/AdminIndustries"));
const AdminTechnologies = lazy(() => import("./pages/admin/AdminTechnologies"));
const AdminValues = lazy(() => import("./pages/admin/AdminValues"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminCaseStudies = lazy(() => import("./pages/admin/AdminCaseStudies"));
const AdminAuditLeads = lazy(() => import("./pages/admin/AdminAuditLeads"));

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
      <Route path="/ingyenes-seo-audit" component={SeoAuditPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
    </Suspense>
  );
}

function AdminRouter() {
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
        <Route path="/admin/seo" component={AdminSeoPages} />
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
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <PolygonNetwork density={0.42} lineAlpha={0.16} pointAlpha={0.5} />
      </div>
      <CustomCursor />
      <StickyCTA />
      <WhatsAppButton />
      <WechatButton />
      <ExitIntentPopup />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      {/* Calendly floating badge — bottom-right pill that opens booking popup.
          Hidden on /kapcsolat (already has inline embed) and /admin. */}
      <CalendlyBadge />
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
            <GrainOverlay opacity={0.05} />
            <Toaster />
            <RouteScrollToTop />
            <ThirdPartyScripts />
            <div style={{ position: "relative", zIndex: 1 }}>
              <Router />
            </div>
            <BackToTopButton />
          </ConfirmDialogHost>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
