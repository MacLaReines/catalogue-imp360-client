import { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Paper,
  Stack,
  Text,
  Group,
  Button,
  TextInput,
  PasswordInput,
  Divider,
  Alert,
  Loader,
  Grid,
  Select,
} from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface UserProfile {
  email: string;
  name: string;
  glpiId: string;
  role: 'user' | 'client' | 'admin' | 'moderator';
  specs?: {
    client?: {
      phone?: string;
      address?: string;
    }
  };
  companies: Array<{
    _id: string;
    name: string;
  }>;
  selectedCompany: {
    _id: string;
    name: string;
  } | null;
  createdAt: string;
}

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/me');
        setProfile(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile?.selectedCompany) {
      setSelectedCompanyId(profile.selectedCompany._id);
    }
  }, [profile]);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      await api.post('/change-password', {
        currentPassword,
        newPassword,
      });

      showNotification({
        title: 'Succès',
        message: 'Mot de passe modifié avec succès',
        color: 'green',
        icon: <IconCheck size={16} />,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError(null);
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      window.location.href = '/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleCompanyChange = async () => {
    try {
      await api.post('/change-company', {
        companyId: selectedCompanyId,
      });

      const response = await api.get('/api/me');
      setProfile(response.data);

      showNotification({
        title: 'Succès',
        message: 'Entreprise modifiée avec succès',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
    } catch (error: any) {
      showNotification({
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors du changement d\'entreprise',
        color: 'red',
      });
    }
  };

  if (authLoading) {
    return (
      <>
        <Navbar />
        <Container size="md" my="xl" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader size="xl" />
        </Container>
        <Footer />
      </>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <>
      <Navbar />
      <Container size="xl" my="xl">
        <Title order={2} mb="xl">Mon Profil</Title>

        <Grid gutter="xl">
          {/* Informations du profil */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper shadow="sm" p="xl" radius="md" withBorder h="100%">
              <Stack gap="md">
                <Title order={3}>Informations personnelles</Title>
                <TextInput
                  label="Email"
                  value={profile.email}
                  disabled
                />
                <TextInput
                  label="Nom"
                  value={profile.name}
                  disabled
                />
                <TextInput
                  label="ID GLPI"
                  value={profile.glpiId}
                  disabled
                />
                <TextInput
                  label="Rôle"
                  value={profile.role}
                  disabled
                />
                {profile.role === 'client' && profile.specs?.client && (
                  <>
                    <TextInput
                      label="Téléphone"
                      value={profile.specs.client.phone || ''}
                      disabled
                    />
                    <TextInput
                      label="Adresse"
                      value={profile.specs.client.address || ''}
                      disabled
                    />
                  </>
                )}
                <TextInput
                  label="Date de création du compte"
                  value={new Date(profile.createdAt).toLocaleDateString('fr-FR')}
                  disabled
                />
              </Stack>
            </Paper>
          </Grid.Col>

          {/* Changement de mot de passe */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper shadow="sm" p="xl" radius="md" withBorder h="100%">
              <Stack gap="md">
                <Title order={3}>Changer le mot de passe</Title>
                
                {passwordError && (
                  <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                    {passwordError}
                  </Alert>
                )}

                <PasswordInput
                  label="Mot de passe actuel"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.currentTarget.value)}
                  required
                />
                <PasswordInput
                  label="Nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.currentTarget.value)}
                  required
                />
                <PasswordInput
                  label="Confirmer le nouveau mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                  required
                />

                <Button
                  onClick={handlePasswordChange}
                  loading={loading}
                  disabled={!currentPassword || !newPassword || !confirmPassword}
                >
                  Changer le mot de passe
                </Button>
              </Stack>
            </Paper>
          </Grid.Col>

          {/* Actions */}
          <Grid.Col span={{ base: 12, md: 12 }}>
            <Paper shadow="sm" p="xl" radius="md" withBorder>
              <Stack gap="md">
                <Title order={3}>Actions</Title>
                <Divider />
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="md">
                      <Text fw={500}>Changer d'entreprise</Text>
                      <Select
                        label="Sélectionner une entreprise"
                        placeholder="Choisir une entreprise"
                        value={selectedCompanyId}
                        onChange={setSelectedCompanyId}
                        data={profile.companies.map(company => ({
                          value: company._id,
                          label: company.name
                        }))}
                        disabled={companyLoading}
                      />
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="md" align="flex-end">
                      <Button
                        color="red"
                        variant="light"
                        onClick={handleLogout}
                      >
                        Se déconnecter
                      </Button>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
      <Footer />
    </>
  );
} 