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
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconEdit, IconTrash, IconBuildingPlus } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import api from '../services/api';

interface Company {
  _id: string;
  glpiId: string;
  name: string;
  taux: string;
  createdAt: string;
}

export default function CompanyManager() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    glpiId: '',
    name: '',
    taux: '',
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (error) {
      showNotification({
        title: 'Erreur',
        message: 'Impossible de charger les entreprises',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!companyToDelete) return;

    try {
      await api.delete(`/companies/${companyToDelete}`);
      showNotification({
        title: 'Succès',
        message: 'Entreprise supprimée avec succès',
        color: 'green',
      });
      fetchCompanies();
    } catch (error) {
      showNotification({
        title: 'Erreur',
        message: 'Impossible de supprimer l\'entreprise',
        color: 'red',
      });
    } finally {
      setDeleteModalOpen(false);
      setCompanyToDelete(null);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      glpiId: company.glpiId,
      name: company.name,
      taux: company.taux,
    });
    setEditModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingCompany) {
        await api.put(`/companies/${editingCompany._id}`, formData);
        showNotification({
          title: 'Succès',
          message: 'Entreprise modifiée avec succès',
          color: 'green',
        });
      } else {
        await api.post('/companies', formData);
        showNotification({
          title: 'Succès',
          message: 'Entreprise créée avec succès',
          color: 'green',
        });
      }
      fetchCompanies();
      setEditModalOpen(false);
      setEditingCompany(null);
      setFormData({ glpiId: '', name: '', taux: '' });
    } catch (error) {
      showNotification({
        title: 'Erreur',
        message: editingCompany ? 'Impossible de modifier l\'entreprise' : 'Impossible de créer l\'entreprise',
        color: 'red',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container size="lg" my="xl" style={{ textAlign: 'center' }}>
        <Loader size="xl" />
      </Container>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Title order={2}>Gestion des entreprises</Title>
        <Button 
          leftSection={<IconBuildingPlus size={16} />}
          onClick={() => {
            setEditingCompany(null);
            setFormData({ glpiId: '', name: '', taux: '' });
            setEditModalOpen(true);
          }}
        >
          Nouvelle entreprise
        </Button>
      </Group>

      <Paper p="md" withBorder style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID GLPI</Table.Th>
              <Table.Th>Nom</Table.Th>
              <Table.Th>Taux</Table.Th>
              <Table.Th>Date de création</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {companies.map((company) => (
              <Table.Tr key={company._id}>
                <Table.Td>{company.glpiId}</Table.Td>
                <Table.Td>{company.name}</Table.Td>
                <Table.Td>{company.taux}</Table.Td>
                <Table.Td>{formatDate(company.createdAt)}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      variant="light"
                      color="blue"
                      onClick={() => handleEdit(company)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="red"
                      onClick={() => {
                        setCompanyToDelete(company._id);
                        setDeleteModalOpen(true);
                      }}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmer la suppression"
        centered
      >
        <Text>Êtes-vous sûr de vouloir supprimer cette entreprise ?</Text>
        <Group justify="flex-end" mt="xl">
          <Button variant="light" onClick={() => setDeleteModalOpen(false)}>
            Annuler
          </Button>
          <Button color="red" onClick={handleDelete}>
            Supprimer
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingCompany(null);
          setFormData({ glpiId: '', name: '', taux: '' });
        }}
        title={editingCompany ? 'Modifier l\'entreprise' : 'Nouvelle entreprise'}
        centered
      >
        <Stack gap="md">
          <TextInput
            label="ID GLPI"
            placeholder="Entrez l'ID GLPI"
            value={formData.glpiId}
            onChange={(e) => setFormData({ ...formData, glpiId: e.target.value })}
            required
          />
          <TextInput
            label="Nom"
            placeholder="Entrez le nom de l'entreprise"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Select
            label="Taux"
            placeholder="Sélectionnez un taux"
            data={[
              { value: 'taux1', label: 'Taux 1' },
              { value: 'taux2', label: 'Taux 2' },
              { value: 'taux3', label: 'Taux 3' },
            ]}
            value={formData.taux}
            onChange={(value) => setFormData({ ...formData, taux: value || '' })}
            required
          />
          <Group justify="flex-end" mt="xl">
            <Button
              variant="light"
              onClick={() => {
                setEditModalOpen(false);
                setEditingCompany(null);
                setFormData({ glpiId: '', name: '', taux: '' });
              }}
            >
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {editingCompany ? 'Modifier' : 'Créer'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
} 