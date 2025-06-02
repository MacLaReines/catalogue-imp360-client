import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Image,
  Grid,
  Paper,
  Group,
  Button,
  Stack,
  Divider,
  Badge,
  Box,
  Table,
  Loader,
} from '@mantine/core';
import { IconArrowLeft, IconShoppingCart } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const specTranslations: Record<string, string> = {
  // Ordinateurs
  'cpu': 'Processeur',
  'cputype': 'Type de processeur',
  'ram': 'Mémoire RAM',
  'stockage': 'Stockage',
  'gpu': 'Carte graphique',
  'screen': 'Écran',
  'network': 'Réseau',
  'burner': 'Lecteur optique',
  'connections': 'Connectiques',
  'alim_ordi': 'Alimentation',
  'os': 'Système d\'exploitation',

  // Écrans
  'displaysize': 'Taille d\'écran',
  'medicalCE': 'Certification médicale CE',
  'support': 'Support',
  'captor': 'Capteur',
  'cord': 'Câble d\'alimentation',
  'resolution': 'Résolution',
  'contrast': 'Contraste',

  // Réseaux - NAS
  'racks': 'Nombre de baies',
  'poe': 'Alimentation PoE',
  'poePower': 'Puissance PoE',
  'alim': 'Alimentation',

  // Accessoires
  'cable': 'Câble',

  // Onduleurs
  'description3': 'Description détaillée',

  // Imprimantes & Scanners
  'rectoverso': 'Recto-verso',
  'charger': 'Chargeur',
  'norm': 'Norme',
  'optionbac': 'Option bac papier',
  'alim_imprimante': 'Alimentation',

  // Téléphone IP
  'alim_telephone': 'Alimentation'
};

interface Product {
  _id: string;
  name: string;
  sku: string;
  brand: string;
  type: string;
  model: string;
  description: string;
  description2?: string;
  price: number;
  pricet1: number;
  pricet2: number;
  pricet3: number;
  guarantee?: string;
  image: string;
  role: string;
  specs?: Record<string, any>;
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        showNotification({
          title: 'Erreur',
          message: "Impossible de charger les détails du produit",
          color: 'red',
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    try {
      let priceToUse = product?.price;

      if (user && user.selectedCompany && product) {
        switch (user.selectedCompany.taux) {
          case 'taux1':
            priceToUse = product.pricet1;
            break;
          case 'taux2':
            priceToUse = product.pricet2;
            break;
          case 'taux3':
            priceToUse = product.pricet3;
            break;
        }
      }

      await api.post('/cart', { 
        productId: product?._id,
        price: priceToUse
      });

      await fetchCart();

      showNotification({
        title: 'Succès',
        message: `${product?.name} a été ajouté au panier`,
        color: 'green',
      });
    } catch (error) {
      showNotification({
        title: 'Erreur',
        message: "Impossible d'ajouter le produit au panier",
        color: 'red',
      });
    }
  };

  const getDisplayPrice = () => {
    if (!user) return product?.price;
    
    if (user.role === 'admin' || user.role === 'moderator') {
      return (
        <Stack gap={4}>
          <Text size="lg" fw={500}>Prix public: {product?.price} €</Text>
          <Text size="lg" fw={500}>Prix T1: {product?.pricet1} €</Text>
          <Text size="lg" fw={500}>Prix T2: {product?.pricet2} €</Text>
          <Text size="lg" fw={500}>Prix T3: {product?.pricet3} €</Text>
        </Stack>
      );
    }

    // Cas utilisateur standard avec entreprise sélectionnée
    if (user.role === 'user' && user.selectedCompany) {
      switch (user.selectedCompany.taux) {
        case 'taux1':
          return <Text size="xl" fw={700} color="blue">{product?.pricet1} €</Text>;
        case 'taux2':
          return <Text size="xl" fw={700} color="blue">{product?.pricet2} €</Text>;
        case 'taux3':
          return <Text size="xl" fw={700} color="blue">{product?.pricet3} €</Text>;
        default:
          return <Text size="xl" fw={700} color="blue">{product?.price} €</Text>;
      }
    }

    // Cas utilisateur sans entreprise sélectionnée
    return <Text size="xl" fw={700} color="blue">{product?.price} €</Text>;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container size="lg" my="xl" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader size="xl" />
        </Container>
        <Footer />
      </>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <>
      <Navbar />
      <Container size="lg" my="xl">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate(-1)}
          mb="md"
        >
          Retour
        </Button>

        <Grid gutter="xl">
          {/* Image du produit */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Paper shadow="sm" p="md" radius="md" withBorder>
              <Box
                style={{
                  width: '100%',
                  height: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  padding: '16px'
                }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            </Paper>
          </Grid.Col>

          {/* Informations du produit */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack gap="lg">
              <div>
                <Title order={1} mb="xs">{product.name}</Title>
                <Group gap="xs" mb="md">
                  <Badge size="lg" variant="light">{product.brand}</Badge>
                  <Badge size="lg" variant="light">{product.type}</Badge>
                  <Badge size="lg" variant="light">{product.model}</Badge>
                </Group>
                <Text size="lg" mb="xl">{product.description}</Text>
                {product.description2 && (
                  <Text size="md" c="dimmed" mb="xl">{product.description2}</Text>
                )}
                <Box mb="xl">
                  {getDisplayPrice()}
                </Box>
                {product.guarantee && (
                  <Text size="sm" c="dimmed" mb="xl">
                    Garantie : {product.guarantee}
                  </Text>
                )}
                <Button
                  size="lg"
                  leftSection={<IconShoppingCart size={20} />}
                  onClick={handleAddToCart}
                >
                  Ajouter au panier
                </Button>
              </div>

              {/* Spécifications techniques */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <>
                  <Divider my="md" />
                  <div>
                    <Title order={2} mb="md">Spécifications techniques</Title>
                    <Table>
                      <Table.Tbody>
                        {Object.entries(product.specs).map(([key, value]) => {
                          // Gestion des clés avec suffixes
                          const baseKey = key.split('_')[0];
                          const translation = specTranslations[key] || specTranslations[baseKey] || key;
                          
                          return value && (
                            <Table.Tr key={key}>
                              <Table.Td style={{ width: '40%' }}>
                                <Text fw={500}>{translation}</Text>
                              </Table.Td>
                              <Table.Td>
                                <Text>{value}</Text>
                              </Table.Td>
                            </Table.Tr>
                          );
                        })}
                      </Table.Tbody>
                    </Table>
                  </div>
                </>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
      <Footer />
    </>
  );
} 