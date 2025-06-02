import {
  Container,
  Title,
  Table,
  Group,
  Button,
  Paper,
  Stack,
  Text,
  ActionIcon,
  Modal,
  TextInput,
  Select,
  Loader,
  Badge,
  Tabs,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconEdit, IconTrash, IconUserPlus } from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CompanyManager from '../components/CompanyManager';
import api from '../services/api';
import { showNotification } from '@mantine/notifications';

interface Client {
  _id: string;
  email: string;
  name: string;
  role: string;
  glpiId: string;
  companies: string[];
  selectedCompany?: string;
  createdAt: string;
}

export default function AdminPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get('/users');
      const formattedClients = response.data.map((client: any) => ({
        _id: client._id || '',
        email: client.email || '',
        name: client.name || '',
        role: client.role || 'user',
        glpiId: client.glpiId || '',
        companies: client.companies || [],
        selectedCompany: client.selectedCompany || '',
        createdAt: client.createdAt || new Date().toISOString(),
      }));
      setClients(formattedClients);
    } catch (error) {
      showNotification({
        title: 'Erreur',
        message: 'Impossible de charger les clients',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!clientToDelete) return;

    try {
      await api.delete(`/users/${clientToDelete}`);
      showNotification({
        title: 'Succès',
        message: 'Client supprimé avec succès',
        color: 'green',
      });
      fetchClients();
    } catch (error) {
      showNotification({
        title: 'Erreur',
        message: 'Impossible de supprimer le client',
        color: 'red',
      });
    } finally {
      setDeleteModalOpen(false);
      setClientToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderClientRow = (client: Client) => (
    <Table.Tr key={client._id}>
      <Table.Td>
        <Text fw={500}>{client.name}</Text>
        <Text size="xs" c="dimmed">{client.email}</Text>
      </Table.Td>
      <Table.Td>{client.glpiId}</Table.Td>
      <Table.Td>
        <Badge color={client.role === 'admin' ? 'red' : client.role === 'moderator' ? 'blue' : 'gray'}>
          {client.role === 'user' ? 'Utilisateur' : client.role}
        </Badge>
      </Table.Td>
      <Table.Td>{formatDate(client.createdAt)}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            variant="light"
            color="blue"
            onClick={() => navigate(`/modify-client/${client._id}`)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="red"
            onClick={() => {
              setClientToDelete(client._id);
              setDeleteModalOpen(true);
            }}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  );

  if (loading) {
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
      <Container size="xl" my="xl">
        <Tabs defaultValue="clients">
          <Tabs.List>
            <Tabs.Tab value="clients">Clients</Tabs.Tab>
            <Tabs.Tab value="companies">Entreprises</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="clients">
            <Stack gap="lg">
              <Group justify="space-between" align="center">
                <Title order={2}>Gestion des clients</Title>
                <Button 
                  leftSection={<IconUserPlus size={16} />}
                  onClick={() => navigate('/new-client')}
                >
                  Nouveau client
                </Button>
              </Group>

              <Paper p="md" withBorder style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Client</Table.Th>
                      <Table.Th>ID GLPI</Table.Th>
                      <Table.Th>Rôle</Table.Th>
                      <Table.Th>Date de création</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {clients.map(renderClientRow)}
                  </Table.Tbody>
                </Table>
              </Paper>

              <Paper p="md" withBorder>
                <Title order={3} mb="md">Statistiques</Title>
                <Group>
                  <Paper p="md" withBorder>
                    <Text size="lg" fw={500}>{clients.length}</Text>
                    <Text size="sm" c="dimmed">Clients total</Text>
                  </Paper>
                  <Paper p="md" withBorder>
                    <Text size="lg" fw={500}>
                      {clients.filter(c => c.role === 'admin').length}
                    </Text>
                    <Text size="sm" c="dimmed">Administrateurs</Text>
                  </Paper>
                  <Paper p="md" withBorder>
                    <Text size="lg" fw={500}>
                      {clients.filter(c => c.role === 'moderator').length}
                    </Text>
                    <Text size="sm" c="dimmed">Modérateurs</Text>
                  </Paper>
                </Group>
              </Paper>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="companies">
            <CompanyManager />
          </Tabs.Panel>
        </Tabs>
      </Container>

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmer la suppression"
        centered
      >
        <Text>Êtes-vous sûr de vouloir supprimer ce client ?</Text>
        <Group justify="flex-end" mt="xl">
          <Button variant="light" onClick={() => setDeleteModalOpen(false)}>
            Annuler
          </Button>
          <Button color="red" onClick={handleDelete}>
            Supprimer
          </Button>
        </Group>
      </Modal>

      <Footer />
    </>
  );
}
