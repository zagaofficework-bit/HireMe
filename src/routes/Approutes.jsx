// src/routes/AppRoutes.jsx
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';

// ── Lazy-loaded pages ─────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const SignupPage = lazy(() => import('../features/auth/pages/SignupPage'));
const OtpPage = lazy(() => import('../features/auth/pages/OtpPage'));
const ProfilePage = lazy(() => import('../features/profile/pages/MyProfilePage'));
const PublicProfilePage = lazy(() => import('../features/profile/pages/PublicProfilePage'));
const EditProfilePage = lazy(() => import('../features/profile/pages/EditProfilePage'));
const HomePage = lazy(() => import('../home/pages/home'));
const AdminDashboard = lazy(() => import('../features/admin/pages/AdminDashboard'));
const AdminUsersPage = lazy(() => import('../features/admin/pages/AdminUsersPage'));
const AdminUserDetail = lazy(() => import('../features/admin/pages/AdminUserDetail'));
const AdminCompaniesPage = lazy(() => import('../features/admin/pages/AdminCompaniesPage'));
const MyCompanyPage = lazy(() => import('../features/company/pages/MyCompanyPage'));
const EditCompanyPage = lazy(() => import('../features/company/pages/EditCompanyPage'));
const PublicCompanyPage = lazy(() => import('../features/company/pages/PublicCompanyPage'));
const UnauthorizedPage = lazy(() => import("../UnauthorizedPage"));
const NotFoundPage = lazy(() => import("../NotfoundPage"));
const BookmarksPage = lazy(() => import("../features/bookmark/pages/BookmarksPage"));
const ClientDashboardPage = lazy(() => import('../features/company/pages/CompanyDashboardPage'));
const SearchPage = lazy(() => import("../features/search/pages/SearchPage"));
const NotificationPage = lazy(() => import("../features/notification/pages/NotificationsPage"));
const ReviewPage = lazy(() => import("../features/review/pages/MyReviewsPage"));
const FreelancerReviewsPage = lazy(() => import("../features/review/pages/FreelancerReviewsPage"));
const CategoryPage = lazy(() => import('../features/categories/pages/CategoryPage'));
const VerificationPage = lazy(() => import('../features/verification/pages/VerificationPage'));
const HireRequestsPage = lazy(() => import("../features/hire/pages/HireRequestsPage"));
const HireRequestPage = lazy(() => import('../features/hire/pages/HireRequestPage'));
const AllCategoriesPage = lazy(() => import("../features/categories/pages/AllCategoriesPage"));
const ContactUsPage = lazy(() => import("../features/services_pages/ContactUsPage"));
const AboutUsPage = lazy(() => import("../features/services_pages/AboutUsPage"));
const HowItWorksPage = lazy(() => import("../features/services_pages/HowItWorksPage"));
const HelpCenterPage = lazy(() => import("../features/services_pages/HelpCenterPage"));
const CareersPage = lazy(() => import("../features/services_pages/CareersPage"));


// ── Page-level loading fallback ───────────────────────────────────────────────
const PageLoader = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1f1e' }}>
    <svg style={{ width: 36, height: 36, animation: 'spin 0.8s linear infinite', color: '#29c8d6' }} fill="none" viewBox="0 0 24 24">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  </div>
);

// ── Route map ─────────────────────────────────────────────────────────────────
// NOTE on ordering: React Router v6 ranks routes by path specificity
// (static segments always beat a ":param" segment), not by the order
// they're declared in. So grouping routes by *function* below instead of
// by "static must come before dynamic" is safe — /profile/me will always
// out-rank /profile/:id regardless of which block it lives in. The old
// "MUST be before" comments are kept anyway as documentation, since a
// future contributor may not know that rule.
const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>

      {/* ════════════════════════════════════════════════════════════════
          PUBLIC — no auth required, visible to anyone
      ════════════════════════════════════════════════════════════════ */}
      <Route path="/" element={<HomePage />} />

      {/* Static / marketing pages */}
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/contact-us" element={<ContactUsPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/help-center" element={<HelpCenterPage />} />
      <Route path="/careers" element={<CareersPage />} />

      {/* Public profile / company views — dynamic :id / :slug segments,
          kept out of ProtectedRoute so logged-out visitors can view them.
          MUST stay after /profile/me, /profile/edit, /profile/me/reviews,
          /company/me, /company/edit, /company/dashboard, /company/bookmarks
          in terms of ROUTE LOGIC (not file order — see note above). */}
      <Route path="/profile/:id" element={<PublicProfilePage />} />
      <Route path="/profile/:id/reviews" element={<FreelancerReviewsPage />} />
      <Route path="/company/:slug" element={<PublicCompanyPage />} />

      {/* TODO: this looks like it should require a client login (it's a
          hire-requests inbox) but isn't wrapped in ProtectedRoute — check
          whether HireRequestsPage does its own auth check internally. */}
      <Route path="/hire/requests" element={<HireRequestsPage />} />


      {/* ════════════════════════════════════════════════════════════════
          GUEST-ONLY — redirected away if already logged in
      ════════════════════════════════════════════════════════════════ */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/otp" element={<OtpPage />} />
      </Route>


      {/* ════════════════════════════════════════════════════════════════
          AUTHENTICATED — any logged-in role (user, client, or admin)
      ════════════════════════════════════════════════════════════════ */}
      <Route element={<ProtectedRoute />}>
        {/* Search is public on the backend (optionalAuth) but kept behind
            login here on the frontend — revisit if you want anonymous
            browsing of search results. */}
        <Route path="/search" element={<SearchPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/reviews" element={<ReviewPage />} />
        <Route path="/verify-email" element={<VerificationPage />} />
        <Route path="/verification" element={<VerificationPage />} />

        <Route path="/categories" element={<AllCategoriesPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />

        {/* /profile/me and /profile/me/reviews MUST resolve before the
            dynamic /profile/:id and /profile/:id/reviews above — this is
            guaranteed by React Router v6's specificity ranking, not by
            file position (see note at the top of this component). */}
        <Route path="/profile/me" element={<ProfilePage />} />
        <Route path="/profile/me/reviews" element={<FreelancerReviewsPage />} />
      </Route>


      {/* ════════════════════════════════════════════════════════════════
          TALENT-ONLY — role: 'user'
      ════════════════════════════════════════════════════════════════ */}
      <Route element={<ProtectedRoute allowedRoles={['user']} />}>
        <Route path="/profile/edit" element={<EditProfilePage />} />
      </Route>


      {/* ════════════════════════════════════════════════════════════════
          CLIENT-ONLY — role: 'client'
      ════════════════════════════════════════════════════════════════ */}
      <Route element={<ProtectedRoute allowedRoles={['client']} />}>
        <Route path="/profile/:id/hire" element={<HireRequestPage />} />

        {/* /company/me, /company/edit, /company/dashboard, and
            /company/bookmarks MUST resolve before the dynamic
            /company/:slug in the PUBLIC section above — again guaranteed
            by v6's ranking, not by file order. */}
        <Route path="/company/dashboard" element={<ClientDashboardPage />} />
        <Route path="/company/me" element={<MyCompanyPage />} />
        <Route path="/company/edit" element={<EditCompanyPage />} />
        <Route path="/company/bookmarks" element={<BookmarksPage />} />
      </Route>


      {/* ════════════════════════════════════════════════════════════════
          ADMIN-ONLY — role: 'admin'
      ════════════════════════════════════════════════════════════════ */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/users/:id" element={<AdminUserDetail />} />
        <Route path="/admin/companies" element={<AdminCompaniesPage />} />
      </Route>


      {/* ════════════════════════════════════════════════════════════════
          UTILITY — DO NOT COMMENT THESE OUT
      ════════════════════════════════════════════════════════════════ */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />

    </Routes>
  </Suspense>
);

export default AppRoutes;