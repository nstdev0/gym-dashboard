import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "sonner";
import { useTheme } from "./components/ThemeProvider";
import DashboardPage from "./pages/dashboard/page";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Layout from "./components/ui/Layout";

// Auth Routes
const SignInPage = lazy(() => import("./pages/auth/sign-in/page"));
// const LogoutPage = lazy(() => import("./pages/auth/logout/page"));

// Member Routes
const MembersPage = lazy(() => import("./pages/members/page"));
const NewMemberPage = lazy(() => import("./pages/members/nuevo/page"));
const MemberDetailPage = lazy(() => import("./pages/members/[id]/page"));
const EditMemberPage = lazy(() => import("./pages/members/[id]/editar/page"));

// Plan Routes
const PlansPage = lazy(() => import("./pages/plans/page"));
const NewPlanPage = lazy(() => import("./pages/plans/nuevo/page"));
const PlanDetailPage = lazy(() => import("./pages/plans/[id]/page"));
const EditPlanPage = lazy(() => import("./pages/plans/[id]/editar/page"));

// Membership Routes
const MembershipsPage = lazy(() => import("./pages/memberships/page"));
const NewMembershipPage = lazy(() => import("./pages/memberships/nuevo/page"));
const MembershipDetailPage = lazy(
  () => import("./pages/memberships/[id]/page")
);
const EditMembershipPage = lazy(
  () => import("./pages/memberships/[id]/editar/page")
);

// User Routes
const UsersPage = lazy(() => import("./pages/users/page"));
const NewUserPage = lazy(() => import("./pages/users/nuevo/page"));
const UserDetailPage = lazy(() => import("./pages/users/[id]/page"));
const EditUserPage = lazy(() => import("./pages/users/[id]/editar/page"));

// Other routes
const UnauthorizedPage = lazy(() => import("./pages/auth/unauthorized/page"));
const NotFoundPage = lazy(() => import("./pages/not-found/page"));

function App() {
  const { theme } = useTheme();

  return (
    <div>
      <Toaster richColors theme={theme as "light" | "dark" | "system"} />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/auth/sign-in" element={<SignInPage />} />
          {/* <Route path="/logout" element={<LogoutPage />}/></Route> */}

          {/* PROTECTED ROUTES */}
          <Route element={<Layout />}>
            {/* <Route element={<ProtectedRoutes />}> */}

            {/* DASHBOARD ROUTE */}
            <Route path="/admin/dashboard/inicio" element={<DashboardPage />} />
            {/* MEMBERS ROUTES */}
            <Route path="/admin/dashboard/miembros" element={<MembersPage />} />
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
            <Route
              path="/admin/dashboard/planes/nuevo"
              element={<NewPlanPage />}
            />
            <Route
              path="/admin/dashboard/planes/:id"
              element={<PlanDetailPage />}
            />
            <Route
              path="/admin/dashboard/planes/:id/editar"
              element={<EditPlanPage />}
            />

            {/* MEMBERSHIPS ROUTES */}
            <Route
              path="/admin/dashboard/membresias"
              element={<MembershipsPage />}
            />
            <Route
              path="/admin/dashboard/membresias/nuevo"
              element={<NewMembershipPage />}
            />
            <Route
              path="/admin/dashboard/membresias/:id"
              element={<MembershipDetailPage />}
            />
            <Route
              path="/admin/dashboard/membresias/:id/editar"
              element={<EditMembershipPage />}
            />

            {/* USERS ROUTES */}
            {/* REGISTER USER ROUTE, ONLY OWNER ROLE IS ABLE TO REGISTER A NEW USER */}
            <Route
              path="/admin/dashboard/usuarios/nuevo"
              element={<NewUserPage />}
            />
            <Route path="/admin/dashboard/usuarios" element={<UsersPage />} />
            <Route
              path="/admin/dashboard/usuarios/nuevo"
              element={<NewUserPage />}
            />
            <Route
              path="/admin/dashboard/usuarios/:id"
              element={<UserDetailPage />}
            />
            <Route
              path="/admin/dashboard/usuarios/:id/editar"
              element={<EditUserPage />}
            />
            {/* </Route> */}
          </Route>
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
