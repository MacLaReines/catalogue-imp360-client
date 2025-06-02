import {
  Container,
  Title,
  Table,
  Select,
  Group,
  ActionIcon,
  Text,
  Stack,
  Paper,
  Badge,
  Image,
  Modal,
  Button,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { showNotification } from '@mantine/notifications';

interface Product {
  _id: string;
  name: string;
  sku: string;
  brand: string;
  type: string;
  model: string;
  price: number;
  role: string;
  image: string;
  gn: boolean;
}

export default function InternPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const roles = [
    { value: "ordinateurs", label: "Ordinateurs" },
    { value: "écrans", label: "Écrans" },
    { value: "réseaux - nas", label: "Réseaux - nas" },
    { value: "accessoires", label: "Accessoires" },
    { value: "robot epson", label: "Robot epson" },
    { value: "onduleurs", label: "Onduleurs" },
    { value: "imprimantes & scanners", label: "Imprimantes & Scanners" },
    { value: "câbles", label: "Câbles" },
    { value: "téléphone ip", label: "Téléphone ip" },
    { value: "occasions", label: "Occasions" },
    { value: "logiciels", label: "Logiciels" }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      setFilteredProducts(products.filter(p => p.role === selectedRole));
    } else {
      setFilteredProducts(products);
    }
  }, [selectedRole, products]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      // Assurons-nous que les données sont correctement formatées
      const formattedProducts = response.data.map((product: any) => ({
        _id: product._id || '',
        name: product.name || '',
        sku: product.sku || '',
        brand: product.brand || '',
        type: product.type || '',
        model: product.model || '',
        price: typeof product.price === 'number' ? product.price : 0,
        role: product.role || '',
        image: product.image || '',
        gn: Boolean(product.gn)
      }));
      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
    } catch (error) {
      showNotification({
        title: 'Erreur',
        message: 'Impossible de charger les produits',
        color: 'red',
      });
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      await api.delete(`/products/${productToDelete}`);
      showNotification({
        title: 'Succès',
        message: 'Produit supprimé avec succès',
        color: 'green',
      });
      fetchProducts();
    } catch (error) {
      showNotification({
        title: 'Erreur',
        message: 'Impossible de supprimer le produit',
        color: 'red',
      });
    } finally {
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const renderProductRow = (product: Product) => (
    <Table.Tr key={product._id}>
      <Table.Td>
        <Group gap="sm">
          <Image
            src={product.image}
            alt={product.name}
            width={50}
            height={50}
            fit="contain"
          />
          <div>
            <Text fw={500}>{product.name}</Text>
            <Text size="xs" c="dimmed">SKU: {product.sku}</Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>{product.brand}</Table.Td>
      <Table.Td>{product.type}</Table.Td>
      <Table.Td>{product.model}</Table.Td>
      <Table.Td>{product.price.toFixed(2)} €</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Badge color={product.role === 'ordinateurs' ? 'blue' : 'gray'}>
            {product.role}
          </Badge>
          {product.gn && (
            <Badge color="green">GN</Badge>
          )}
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            variant="light"
            color="blue"
            onClick={() => navigate(`/modify-product/${product._id}`)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="red"
            onClick={() => {
              setProductToDelete(product._id);
              setDeleteModalOpen(true);
            }}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  );

  return (
    <>
      <Navbar />
      <Container size="xl" my="xl">
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Title order={2}>Gestion des produits</Title>
            <Button onClick={() => navigate('/new-product')}>
              Nouveau produit
            </Button>
          </Group>

          <Paper p="md" withBorder>
            <Group mb="md">
              <Select
                label="Filtrer par catégorie"
                placeholder="Toutes les catégories"
                data={roles}
                value={selectedRole}
                onChange={setSelectedRole}
                clearable
                style={{ width: 300 }}
              />
            </Group>

            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Produit</Table.Th>
                  <Table.Th>Marque</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Modèle</Table.Th>
                  <Table.Th>Prix</Table.Th>
                  <Table.Th>Catégorie</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredProducts.map(renderProductRow)}
              </Table.Tbody>
            </Table>
          </Paper>
        </Stack>
      </Container>

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmer la suppression"
        centered
      >
        <Text>Êtes-vous sûr de vouloir supprimer ce produit ?</Text>
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