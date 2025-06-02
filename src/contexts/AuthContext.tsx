import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "../services/api";

interface Company {
  _id: string;
  glpiId: string;
  name: string;
  taux: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  glpiId: string;
  companies: Company[];
  selectedCompany: Company | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  selectCompany: (companyId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  logout: async () => {},
  checkAuth: async () => {},
  selectCompany: async () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await api.get('/me');
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const selectCompany = async (companyId: string) => {
    try {
      const res = await api.post("/select-company", { companyId });
      setUser(res.data.user);
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'entreprise:', error);
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout, checkAuth, selectCompany }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
