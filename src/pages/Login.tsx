import {
  Button,
  Container,
  PasswordInput,
  TextInput,
  Title,
  Notification,
} from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/login', { email, password });
      if (response.status === 200) {
        await checkAuth();
        if (response.data.user.role === 'user' || response.data.user.role === 'client') {
          navigate('/select-company', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    }
    setLoading(false);
  };

  return (
    <Container size="xs" my={40}>
      <Title ta="center" mb="lg">
        Connexion
      </Title>

      {error && (
        <Notification color="red" title="Erreur" mb="md">
          {error}
        </Notification>
      )}

      <TextInput
        label="Email"
        placeholder="client@imp360.com"
        mb="sm"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />

      <PasswordInput
        label="Mot de passe"
        placeholder="••••••••"
        mb="lg"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />

      <Button fullWidth loading={loading} onClick={handleLogin}>
        Se connecter
      </Button>
    </Container>
  );
}
