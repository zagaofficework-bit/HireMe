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
const UnauthorizedPage = lazy(() => import('../UnauthorizedPage'));
const NotFoundPage = lazy(() => import('../NotFoundPage'));
const BookmarksPage = lazy(() => import("../features/bookmark/pages/BookmarksPage"));
const ClientDashboardPage = lazy(() => import('../features/company/pages/CompanyDashboardPage'));
const SearchPage = lazy(() => import("../features/search/pages/SearchPage"));
const NotificationPage = lazy(() => import("../features/notification/pages/NotificationsPage"));
const ReviewPage = lazy(() => import("../features/review/pages/MyReviewsPage"));
const CategoryPage = lazy(() => import('../features/categories/pages/CategoryPage'));
const VerificationPage = lazy(() => import('../features/verification/pages/VerificationPage'));
const HireRequestsPage = lazy(() => import("../features/hire/pages/HireRequestsPage"));
const HireRequestPage = lazy(() => import('../features/hire/pages/HireRequestPage'));
const AllCategoriesPage = lazy(() => import("../features/categories/pages/AllCategoriesPage"));



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
const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>

      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route element={<ProtectedRoute />}>
        {/* Search — public, same as the search backend routes (optionalAuth) */}
        <Route path="/search" element={<SearchPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/reviews" element={<ReviewPage />} />

        <Route path="/verify-email" element={<VerificationPage />} />
        <Route path="/verification" element={<VerificationPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        {/* ...existing routes... */}
        <Route path="/categories" element={<AllCategoriesPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />

      </Route>
      {/* Guest-only */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/otp" element={<OtpPage />} />
      </Route>


      {/* <Route element={<ProtectedRoute allowedRoles={['client']} />}>
        
      </Route> */}


      {/* Protected — /profile/me and /profile/edit MUST be before /profile/:id */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile/me" element={<ProfilePage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['user']} />}>
        <Route path="/profile/edit" element={<EditProfilePage />} />
      </Route>


      {/* Hire route (client only) */}
      <Route element={<ProtectedRoute allowedRoles={['client']} />}>
        <Route path="/profile/:id/hire" element={<HireRequestPage />} />
      </Route>
      {/* Public profile — dynamic :id AFTER all static /profile/* segments */}
      {/* Public profile */}
      <Route path="/profile/:id" element={<PublicProfilePage />} />

      {/* Company — /company/me and /company/edit MUST be before /company/:slug */}
      <Route element={<ProtectedRoute allowedRoles={['client']} />}>
        <Route path="/company/dashboard" element={<ClientDashboardPage />} />
        <Route path="/company/me" element={<MyCompanyPage />} />
        <Route path="/company/edit" element={<EditCompanyPage />} />
        <Route path="/company/bookmarks" element={<BookmarksPage />} />

      </Route>



      <Route path="/hire/requests" element={<HireRequestsPage />} />

      {/* Public company page — dynamic :slug AFTER all static /company/* segments */}
      <Route path="/company/:slug" element={<PublicCompanyPage />} />

      {/* Admin */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/users/:id" element={<AdminUserDetail />} />
        <Route path="/admin/companies" element={<AdminCompaniesPage />} />
      </Route>

      {/* Utility — DO NOT comment these out */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />

    </Routes>
  </Suspense>
);

export default AppRoutes;