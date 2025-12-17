import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import DashboardPage from "./pages/dashboard/page";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Layout from "./components/ui/Layout";

// Auth Routes
const SignInPage = lazy(() => import("./pages/auth/sign-in/page"));
const SignUpPage = lazy(() => import("./pages/auth/sign-up/page"));
// const LogoutPage = lazy(() => import("./pages/auth/logout/page"));

// Member Routes
const MembersPage = lazy(() => import("./pages/members/page"));
const NewMemberPage = lazy(() => import("./pages/members/nuevo/page"));
const MemberDetailPage = lazy(() => import("./pages/members/[id]/page"));
const EditMemberPage = lazy(() => import("./pages/members/[id]/editar/page"));

// Plan Routes
const PlansPage = lazy(() => import("./pages/plans/page"));
// const NewPlanPage = lazy(() => import("./pages/plans/nuevo/page"));
// const PlanDetailPage = lazy(() => import("./pages/plans/[id]/page"));
// const EditPlanPage = lazy(() => import("./pages/plans/[id]/editar/page"));

// Membership Routes
const MembershipsPage = lazy(() => import("./pages/memberships/page"));
// const NewMembershipPage = lazy(() => import("./pages/memberships/nuevo/page"));
// const MembershipDetailPage = lazy(() => import("./pages/memberships/[id]/page"));
// const EditMembershipPage = lazy(() => import("./pages/memberships/[id]/editar/page"));

// User Routes
const UsersPage = lazy(() => import("./pages/users/page"));
// const NewUserPage = lazy(() => import("./pages/users/nuevo/page"));
// const UserDetailPage = lazy(() => import("./pages/users/[id]/page"));
// const EditUserPage = lazy(() => import("./pages/users/[id]/editar/page"));

// Other routes
const UnauthorizedPage = lazy(() => import("./pages/auth/unauthorized/page"));
const NotFoundPage = lazy(() => import("./pages/not-found/page"));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/auth/sign-in" element={<SignInPage />} />
          {/* <Route path="/logout" element={<LogoutPage />}/></Route> */}

          {/* PROTECTED ROUTES */}
          <Route element={<Layout />}>
            <Route element={<ProtectedRoutes />}>
              {/* REGISTER USER ROUTE, ONLY OWNER ROLE IS ABLE TO REGISTER A NEW USER */}
              <Route path="/auth/sign-up" element={<SignUpPage />} />
              {/* DASHBOARD ROUTE */}
              <Route
                path="/admin/dashboard/inicio"
                element={<DashboardPage />}
              />
              {/* MEMBERS ROUTES */}
              <Route
                path="/admin/dashboard/miembros"
                element={<MembersPage />}
              />
              <Route
                path="/admin/dashboard/miembros/nuevo"
                element={<NewMemberPage />}
              />
              <Route
                path="/admin/dashboard/miembros/:id"
                element={<MemberDetailPage />}
              />
              <Route
                path="/admin/dashboard/miembros/:id/editar"
                element={<EditMemberPage />}
              />
              {/* PLANS ROUTES */}
              <Route path="/admin/dashboard/planes" element={<PlansPage />} />
              {/* MEMBERSHIPS ROUTES */}
              <Route
                path="/admin/dashboard/membresias"
                element={<MembershipsPage />}
              />
              {/* USERS ROUTES */}
              <Route path="/admin/dashboard/usuarios" element={<UsersPage />} />
            </Route>
          </Route>
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
