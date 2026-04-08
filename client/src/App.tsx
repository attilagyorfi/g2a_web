import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ServicePage from "./pages/ServicePage";
import ServicesPage from "./pages/ServicesPage";
import ExpertisePage from "./pages/ExpertisePage";
import TechnologyPage from "./pages/TechnologyPage";
import PartnersPage from "./pages/PartnersPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminPostEdit from "./pages/admin/AdminPostEdit";
import AdminServices from "./pages/admin/AdminServices";
import AdminPartners from "./pages/admin/AdminPartners";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminSeoPages from "./pages/admin/AdminSeoPages";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminHeroSlides from "./pages/admin/AdminHeroSlides";
import AdminIndustries from "./pages/admin/AdminIndustries";
import AdminTechnologies from "./pages/admin/AdminTechnologies";
import AdminValues from "./pages/admin/AdminValues";
import AdminCategories from "./pages/admin/AdminCategories";
import RolunkPage from "./pages/RolunkPage";
import AuditPage from "./pages/AuditPage";
import ReferenciakPage from "./pages/ReferenciakPage";
import IparagiLandingPage from "./pages/IparagiLandingPage";

function PublicRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/rolunk" component={RolunkPage} />
      <Route path="/ingyenes-audit" component={AuditPage} />
      <Route path="/referenciak" component={ReferenciakPage} />
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
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AdminRouter() {
  return (
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
        <Route path="/admin/seo" component={AdminSeoPages} />
        <Route path="/admin/settings" component={AdminSettings} />
        <Route component={AdminDashboard} />
      </Switch>
    </AdminLayout>
  );
}

function Router() {
  const path = window.location.pathname;
  if (path.startsWith("/admin")) {
    return <AdminRouter />;
  }
  return <PublicRouter />;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
