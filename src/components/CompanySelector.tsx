import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Card,
  Title,
  Text,
  Select,
  Button,
  Stack,
  Container,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

interface Company {
  _id: string;
  name?: string;
}

export default function CompanySelector() {
  const { user, selectCompany } = useAuth();
  const navigate = useNavigate();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCompanySelect = async () => {
    if (!selectedCompanyId) {
      showNotification({
        title: 'Erreur',
        message: 'Veuillez sélectionner une entreprise',
        color: 'red',
        icon: <IconX size={18} />,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await selectCompany(selectedCompanyId);
      showNotification({
        title: 'Succès',
        message: 'Entreprise sélectionnée avec succès',
        color: 'green',
        icon: <IconCheck size={18} />,
      });
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    } catch (error) {
      showNotification({
        title: 'Erreur',
        message: 'Erreur lors de la sélection de l\'entreprise',
        color: 'red',
        icon: <IconX size={18} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || (user.role !== 'user' && user.role !== 'client')) {
    return null;
  }

  return (
    <Container size="sm" py="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Title order={2} ta="center">Sélection de l'entreprise</Title>
          <Text c="dimmed" ta="center">
            Veuillez sélectionner l'entreprise pour laquelle vous souhaitez effectuer un devis
          </Text>
          
          <Select
            label="Entreprise"
            placeholder="Choisissez une entreprise"
            data={user.companies.map((company: Company) => ({
              value: company._id,
              label: company.name || company._id
            }))}
            value={selectedCompanyId}
            onChange={setSelectedCompanyId}
            required
          />

          <Button
            onClick={handleCompanySelect}
            fullWidth
            mt="md"
            loading={isSubmitting}
          >
            Continuer
          </Button>
        </Stack>
      </Card>
    </Container>
  );
} 