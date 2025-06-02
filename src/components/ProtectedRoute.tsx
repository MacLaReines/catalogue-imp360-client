import { ReactNode, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader } from "@mantine/core";
import api from "../services/api";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user && !loading) {
        try {
          const response = await api.get("/me");
          if (!response.data.user) {
            navigate("/login", { replace: true });
          }
        } catch (error) {
          // Ne rediriger que si on n'est pas déjà sur la page de login
          if (!window.location.pathname.includes('/login')) {
            navigate("/login", { replace: true });
          }
        } finally {
          setIsChecking(false);
        }
      } else {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [user, loading, navigate]);

  if (loading || isChecking) {
    return <Loader size="lg" style={{ margin: "auto", marginTop: "20%" }} />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}