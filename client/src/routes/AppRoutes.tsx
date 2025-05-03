import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import LandingPage from "../pages/landing/LandingPage";
import AuthPage from "../pages/auth/AuthPage";

import { ROLES, hasRole } from "../utils/rbac";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import UserDashboard from "../pages/dashboard/UserDashboard";
import OwnerDashboard from "../pages/dashboard/OwnerDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import DashboardLayout from "../components/Layout";
import UserProfile from "../pages/dashboard/user/UserProfile";
import UserStores from "../pages/dashboard/user/UserStores";
import UserRatings from "../pages/dashboard/user/UserRatings";
import ChangePassword from "../pages/dashboard/user/ChangePassword";

// Wrapper for role-based access
const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const role = useSelector((state) => state.auth.role);
  return hasRole(role, allowedRoles) ? (
    children
  ) : (
    <Navigate to="/unauthorized" />
  );
};

const AppRoutes = () => {
  const role = useSelector((state) => state.auth.role);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Redirect to appropriate dashboard based on role */}
      <Route
        path="/dashboard"
        element={
          role === ROLES.ADMIN ? (
            <Navigate to="/dashboard/admin" />
          ) : role === ROLES.OWNER ? (
            <Navigate to="/dashboard/owner" />
          ) : role === ROLES.USER ? (
            <Navigate to="/dashboard/user" />
          ) : (
            <Navigate to="/unauthorized" />
          )
        }
      />

      <Route
        path="/dashboard/admin"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminDashboard />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/dashboard/owner"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.OWNER]}>
            <DashboardLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<OwnerDashboard />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      <Route
        path="/dashboard/user"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.USER]}>
            <DashboardLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="stores" element={<UserStores />} />
        <Route path="ratings" element={<UserRatings />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
