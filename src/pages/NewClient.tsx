import {
  Container,
  Title,
  TextInput,
  PasswordInput,
  Select,
  MultiSelect,
  Button,
  Group,
  Stack,
  Paper,
  Text,
  Loader,
} from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

interface ClientForm {
  email: string;
  password?: string;
  name: string;
  role: string;
  glpiId: string;
  companies: string[];
  selectedCompany?: string;
  specs?: {
    client?: {
      phone?: string;
      address?: string;
    }
  };
}

interface Company {
  _id: string;
  name: string;
  glpiId: string;
  taux: string;
}

export default function NewClientPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(id ? true : false);
  const [companies, setCompanies] = useState<Company[]>([]);

  const form = useForm<ClientForm>({
    initialValues: {
      email: '',
      password: '',
      name: '',
      role: 'user',
      glpiId: '',
      companies: [],
      selectedCompany: '',
      specs: {
        client: {
          phone: '',
          address: ''
        }
      }
    },
    validate: {
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Email invalide'),
      password: (value: string | undefined) => (!id && !value ? 'Mot de passe requis' : null),
      name: (value: string) => (!value ? 'Nom requis' : null),
      role: (value: string) => (!value ? 'Rôle requis' : null),
      glpiId: (value: string) => (!value ? 'ID GLPI requis' : null),
    },
  });

  useEffect(() => {
    fetchCompanies();
    if (id) {
      fetchClient();
    }
  }, [id]);

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (error) {
      showNotification({
        title: 'Erreur',
        message: 'Impossible de charger la liste des entreprises',
        color: 'red',
      });
    }
  };

  const fetchClient = async () => {
    try {
      const response = await api.get(`/users/${id}`);
      const client = response.data;
      form.setValues({
        email: client.email,
        name: client.name,
        role: client.role,
        glpiId: client.glpiId || '',
        companies: client.companies || [],
        selectedCompany: client.selectedCompany || '',
        specs: client.specs || {
          client: {
            phone: '',
            address: ''
          }
        }
      });
    } catch (error) {
      showNotification({
        title: 'Erreur',
        message: 'Impossible de charger les informations du client',
        color: 'red',
      });
      navigate('/admin');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (values: ClientForm) => {
    setLoading(true);
    try {
      console.log('Form values being sent:', values);
      const data = { ...values };
      if (!data.password) delete data.password;

      if (id) {
        console.log('Updating user with data:', data);
        await api.put(`/users/${id}`, data);
        showNotification({
          title: 'Succès',
          message: 'Client modifié avec succès',
          color: 'green',
        });
      } else {
        console.log('Creating new user with data:', data);
        const response = await api.post('/users', data);
        console.log('Server response:', response.data);
        showNotification({
          title: 'Succès',
          message: 'Client créé avec succès',
          color: 'green',
        });
      }
      navigate('/admin');
    } catch (error: any) {
      console.error('Error submitting form:', error.response?.data || error);
      showNotification({
        title: 'Erreur',
        message: id ? 'Impossible de modifier le client' : 'Impossible de créer le client',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <>
        <Navbar />
        <Container size="lg" my="xl" style={{ textAlign: 'center' }}>
          <Loader size="xl" />
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container size="md" my="xl">
        <Paper p="xl" withBorder>
          <Title order={2} mb="xl">
            {id ? 'Modifier le client' : 'Nouveau client'}
          </Title>

          <form onSubmit={form.onSubmit((values) => handleSubmit(values as ClientForm))}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="email@exemple.com"
                required
                {...form.getInputProps('email')}
              />

              {!id && (
                <PasswordInput
                  label="Mot de passe"
                  placeholder="••••••••"
                  required
                  {...form.getInputProps('password')}
                />
              )}

              <TextInput
                label="Nom"
                placeholder="Nom du client"
                required
                {...form.getInputProps('name')}
              />

              <TextInput
                label="ID GLPI"
                placeholder="Identifiant GLPI"
                required
                {...form.getInputProps('glpiId')}
              />

              <Select
                label="Rôle"
                placeholder="Sélectionner un rôle"
                data={[
                  { value: 'user', label: 'Utilisateur' },
                  { value: 'client', label: 'Client' },
                  { value: 'moderator', label: 'Modérateur' },
                  { value: 'admin', label: 'Administrateur' },
                ]}
                required
                {...form.getInputProps('role')}
              />

              {form.values.role === 'client' && (
                <>
                  <TextInput
                    label="Téléphone"
                    placeholder="Numéro de téléphone"
                    {...form.getInputProps('specs.client.phone')}
                  />
                  <TextInput
                    label="Adresse"
                    placeholder="Adresse complète"
                    {...form.getInputProps('specs.client.address')}
                  />
                </>
              )}

              <MultiSelect
                label="Entreprises"
                placeholder="Sélectionner les entreprises"
                data={companies.map(company => ({
                  value: company._id,
                  label: `${company.name} (${company.glpiId})`
                }))}
                value={form.values.companies}
                onChange={(value) => form.setFieldValue('companies', value)}
                searchable
                clearable
              />

              {form.values.companies.length > 0 && (
                <Select
                  label="Entreprise par défaut"
                  placeholder="Sélectionner l'entreprise par défaut"
                  data={companies
                    .filter(company => form.values.companies.includes(company._id))
                    .map(company => ({
                      value: company._id,
                      label: `${company.name} (${company.glpiId})`
                    }))}
                  value={form.values.selectedCompany}
                  onChange={(value) => form.setFieldValue('selectedCompany', value || '')}
                  clearable
                />
              )}

              <Group justify="flex-end" mt="xl">
                <Button variant="light" onClick={() => navigate('/admin')}>
                  Annuler
                </Button>
                <Button type="submit" loading={loading}>
                  {id ? 'Modifier' : 'Créer'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Container>
      <Footer />
    </>
  );
} 