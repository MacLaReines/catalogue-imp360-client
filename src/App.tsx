import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Categorie from "./pages/Categorie";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleProtectedRoute } from "./components/RoleProtectedRoute"; 
import NewProduct from "./pages/NewProduct";
import ModifyProduct from "./pages/ModifyProduct";
import Intern from "./pages/Intern";
import AdminPage from "./pages/Admin";
import Cart from "./pages/Cart";
import MentionsLegales from "./pages/MentionLegales";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";
import NewClient from './pages/NewClient';
import Test from "./pages/Test";
import CompanySelector from "./components/CompanySelector";
import { useAuth } from "./contexts/AuthContext";

function AppRoutes() {
  const { user } = useAuth();

  // Redirection conditionnelle après la connexion
  const getInitialRoute = () => {
    if (!user) return "/login";
    if ((user.role === "user" || user.role === "client") && !user.selectedCompany) return "/select-company";
    return "/dashboard";
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/select-company" element={<CompanySelector />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {(user?.role === "user" || user?.role === "client") && !user.selectedCompany ? (
              <Navigate to="/select-company" replace />
            ) : (
              <Dashboard />
            )}
          </ProtectedRoute>
        }
      />

      <Route
        path="/new-product"
        element={
          <RoleProtectedRoute allowedRoles={["moderator", "admin"]}>
            <NewProduct />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/modify-product/:id"
        element={
          <RoleProtectedRoute allowedRoles={["moderator", "admin"]}>
            <ModifyProduct />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/intern"
        element={
          <RoleProtectedRoute allowedRoles={["moderator", "admin"]}>
            <Intern />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <RoleProtectedRoute allowedRoles={["admin"]}>
            <AdminPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="/categorie/:role" element={<Categorie />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/mentionlegales" element={<MentionsLegales />} />
      <Route path="/politiqueconfidentialite" element={<PolitiqueConfidentialite />} />
      <Route 
        path="/test" 
        element={
          <ProtectedRoute>
            <Test />
          </ProtectedRoute>
        } 
      />
      <Route
        path="/new-client"
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <NewClient />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/modify-client/:id"
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <NewClient />
          </RoleProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={getInitialRoute()} replace />} />
    </Routes>
  );
}

export default function App() {
  return <AppRoutes />;
}
