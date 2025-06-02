import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Title,
  Stack,
  Paper,
  Image,
  Text,
  Group,
  Loader,
  Button,
  Divider,
  Box,
  Transition,
  Badge,
  rem,
  Checkbox,
  TextInput,
  Radio,
} from '@mantine/core';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { showNotification } from '@mantine/notifications';
import { IconTrash, IconTicket, IconPlus, IconMinus } from '@tabler/icons-react';
import api from '../services/api';
import { useCart } from '../contexts/CartContext';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  pricet1: number;
  pricet2: number;
  pricet3: number;
  image: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

interface User {
  role: 'user' | 'client' | 'moderator' | 'admin';
  company?: string;
  selectedCompany?: {
    taux: 'taux1' | 'taux2' | 'taux3';
  };
  specs?: {
    client?: {
      phone?: string;
      address?: string;
    }
  };
  name: string;
  email: string;
}

interface TicketData {
  title: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  isOnSite: boolean;
  company?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
}

const CART_IMAGE_SIZE = 120;
const TRANSITION_DURATION = 200;

type DeliveryType = 'client' | 'technician' | 'imp360';

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingTicket, setCreatingTicket] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState('');
  const { fetchCart } = useCart();
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('client');

  useEffect(() => {
    // Charger les informations de l'utilisateur
    api.get('/me')
      .then((res) => {
        console.log('Données utilisateur reçues:', res.data);
        const userData = res.data.user;
        setUser(userData);
        if (userData.company) {
          setCompany(userData.company);
        }
        // Pré-remplir les informations client si l'utilisateur est un client
        if (userData.role === 'client') {
          setClientName(userData.name);
          setClientEmail(userData.email);
          setClientPhone(userData.specs?.client?.phone || '');
          setDeliveryType('client'); // Forcer le mode de livraison à 'client'
        }
      })
      .catch((err) => {
        console.error('Erreur détaillée chargement utilisateur:', err.response?.data || err);
      });

    // Charger le panier
    api.get('/cart')
      .then((res) => {
        console.log("Panier reçu:", res.data);
        // S'assurer que items est un tableau et que chaque item a product et quantity
        const validItems = Array.isArray(res.data.items) 
          ? res.data.items.filter((item: any) => item && item.product && typeof item.quantity === 'number')
          : [];
        
        setItems(validItems);
      })
      .catch((err) => console.error('Erreur chargement panier:', err))
      .finally(() => setLoading(false));
  }, []);

  const removeItem = async (productId: string) => {
    try {
      await api.delete(`/cart/${productId}`);
      setItems((prev) => prev.filter((item) => item.product._id !== productId));
      await fetchCart();
    } catch (err) {
      console.error('Erreur suppression article:', err);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setItems([]);
      await fetchCart();
      showNotification({
        title: 'Panier vidé',
        message: 'Tous les articles ont été supprimés.',
        color: 'green',
        icon: <IconTrash size={16} />,
      });
    } catch (err) {
      console.error('Erreur vidage panier :', err);
      showNotification({
        title: 'Erreur',
        message: 'Impossible de vider le panier.',
        color: 'red',
      });
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      await api.patch('/cart', { productId, quantity: newQuantity });
      setItems((prev) =>
        prev.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      await fetchCart();
    } catch (err) {
      console.error('Erreur mise à jour quantité:', err);
      showNotification({
        title: 'Erreur',
        message: 'Impossible de mettre à jour la quantité.',
        color: 'red',
      });
    }
  };

  // Calcul du total
  const total = items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    // Ne pas valider les champs si l'utilisateur est un client
    if (user?.role !== 'client') {
      if (!clientName.trim()) errors.clientName = 'Le nom est requis';
      if (!clientPhone.trim()) errors.clientPhone = 'Le numéro de téléphone est requis';
      if (!clientEmail.trim()) errors.clientEmail = 'L\'email est requis';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
        errors.clientEmail = 'Format d\'email invalide';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createGLPITicket = async () => {
    if (!validateForm()) {
      showNotification({
        title: 'Erreur de validation',
        message: 'Veuillez remplir tous les champs obligatoires correctement.',
        color: 'red',
      });
      return;
    }

    setCreatingTicket(true);
    try {
      const ticketData = {
        title: "Commande de produits",
        items: items.map((item) => ({
          name: item.product.name || 'Produit sans nom',
          quantity: item.quantity || 0,
          price: item.price,
        })),
        total: total,
        deliveryType: user?.role === 'client' ? 'client' : deliveryType,
        company: user?.role === 'moderator' ? company : user?.company,
        clientName: user?.role === 'client' ? user.name : clientName,
        clientPhone: user?.role === 'client' ? user.specs?.client?.phone || '' : clientPhone,
        clientEmail: user?.role === 'client' ? user.email : clientEmail,
      };

      await api.post('/ticket', ticketData);

      setItems([]); // vider le panier après succès
      showNotification({
        title: 'Ticket créé',
        message: 'Le ticket GLPI a été créé avec succès.',
        color: 'green',
        icon: <IconTicket size={16} />,
      });
    } catch (err) {
      console.error('Erreur création ticket GLPI:', err);
      showNotification({
        title: 'Erreur',
        message: 'Impossible de créer le ticket GLPI.',
        color: 'red',
      });
    } finally {
      setCreatingTicket(false);
    }

    clearCart();
  };

  return (
    <>
      <Navbar />
      <Container size="lg" my="xl">
        <Transition mounted={!loading} transition="fade" duration={TRANSITION_DURATION}>
          {(styles) => (
            <Box style={styles}>
              <Title order={2} mb="xl" ta="center" style={{ 
                fontSize: rem(32),
                fontWeight: 700,
                color: 'var(--mantine-color-dark-7)'
              }}>
                Votre panier
              </Title>

              {items.length === 0 ? (
                <Paper p="xl" ta="center" withBorder radius="md" shadow="sm" style={{
                  backgroundColor: 'var(--mantine-color-gray-0)'
                }}>
                  <Text size="lg" c="dimmed" fw={500}>Votre panier est vide.</Text>
                </Paper>
              ) : (
                <Stack gap="md">
                  {items.map(({ product, quantity, price }) => (
                    <Paper 
                      key={product._id} 
                      shadow="sm" 
                      p="md" 
                      withBorder 
                      radius="md"
                      style={{
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 'var(--mantine-shadow-md)',
                        }
                      }}
                    >
                      <Group align="center" justify="space-between" wrap="nowrap">
                        <Group align="center" wrap="nowrap" gap="md">
                          <Box style={{ flexShrink: 0 }}>
                            <Image
                              src={product.image}
                              alt={product.name || 'Produit'}
                              width={CART_IMAGE_SIZE}
                              height={CART_IMAGE_SIZE}
                              radius="md"
                              fit="cover"
                              style={{ 
                                objectFit: 'cover',
                                boxShadow: 'var(--mantine-shadow-xs)'
                              }}
                            />
                          </Box>
                          <Stack gap={8} style={{ flex: 1 }}>
                            <Group gap="xs" align="center">
                              <Text fw={600} size="lg">{product.name || 'Produit sans nom'}</Text>
                            </Group>
                            <Text size="sm" c="dimmed" lineClamp={2}>
                              {product.description || 'Aucune description'}
                            </Text>
                            <Group gap="xs" align="center">
                              <Button
                                variant="light"
                                color="blue"
                                size="xs"
                                onClick={() => updateQuantity(product._id, quantity - 1)}
                                disabled={quantity <= 1}
                              >
                                <IconMinus size={16} />
                              </Button>
                              <Badge size="lg" variant="light" color="blue" style={{ minWidth: '40px', textAlign: 'center' }}>
                                {quantity}
                              </Badge>
                              <Button
                                variant="light"
                                color="blue"
                                size="xs"
                                onClick={() => updateQuantity(product._id, quantity + 1)}
                              >
                                <IconPlus size={16} />
                              </Button>
                              <Text fw={500} size="sm">
                                {price.toFixed(2)} € × {quantity} = {(price * quantity).toFixed(2)} €
                              </Text>
                            </Group>
                          </Stack>
                        </Group>
                        <Button
                          color="red"
                          variant="light"
                          size="sm"
                          onClick={() => removeItem(product._id)}
                          leftSection={<IconTrash size={16} />}
                          style={{
                            transition: 'background-color 0.2s ease'
                          }}
                        >
                          Supprimer
                        </Button>
                      </Group>
                    </Paper>
                  ))}

                  <Divider my="md" />
                  <Paper 
                    p="md" 
                    withBorder 
                    radius="md"
                    style={{
                      backgroundColor: 'var(--mantine-color-blue-0)',
                      borderColor: 'var(--mantine-color-blue-3)'
                    }}
                  >
                    <Stack gap="md">
                      <Group justify="space-between" align="center">
                        <Stack gap={4}>
                          <Text fw={700} size="xl" c="blue.7">
                            Total : {total.toFixed(2)} €
                          </Text>
                          <Text size="sm" c="dimmed">
                            {items.length} article{items.length > 1 ? 's' : ''} dans votre panier
                          </Text>
                        </Stack>
                      </Group>
                      
                      <Stack gap="md">
                        <Text fw={600} size="lg" c="blue.7">Informations du client</Text>
                        
                        {user?.role !== 'client' && (
                          <>
                            <TextInput
                              label="Nom et Prénom"
                              placeholder="Entrez le nom et prénom du client"
                              value={clientName}
                              onChange={(event) => setClientName(event.currentTarget.value)}
                              error={formErrors.clientName}
                              required
                              size="md"
                            />

                            <TextInput
                              label="Numéro de Téléphone"
                              placeholder="Entrez le numéro de téléphone"
                              value={clientPhone}
                              onChange={(event) => setClientPhone(event.currentTarget.value)}
                              error={formErrors.clientPhone}
                              required
                              size="md"
                            />

                            <TextInput
                              label="Adresse email"
                              placeholder="Entrez l'adresse email"
                              value={clientEmail}
                              onChange={(event) => setClientEmail(event.currentTarget.value)}
                              error={formErrors.clientEmail}
                              required
                              size="md"
                            />
                          </>
                        )}

                        {user?.role === 'client' && (
                          <Stack gap="xs">
                            <Text size="sm" c="dimmed">Les informations de livraison seront utilisées depuis votre profil.</Text>
                            <Text size="sm" fw={500}>Nom : {user.name}</Text>
                            <Text size="sm" fw={500}>Email : {user.email}</Text>
                            <Text size="sm" fw={500}>Téléphone : {user.specs?.client?.phone || 'Non renseigné'}</Text>
                          </Stack>
                        )}
                      </Stack>

                      <Stack gap="md">
                        <Text fw={600} size="lg" c="blue.7">Mode de livraison</Text>
                        {user?.role === 'client' ? (
                          <Text size="sm" c="dimmed">La livraison sera effectuée à votre adresse.</Text>
                        ) : (
                          <Radio.Group
                            value={deliveryType}
                            onChange={(value) => setDeliveryType(value as DeliveryType)}
                            name="deliveryType"
                            label="Choisissez le mode de livraison"
                            description="Sélectionnez où les produits doivent être livrés"
                            required
                          >
                            <Stack mt="xs">
                              <Radio 
                                value="client" 
                                label="Envoi chez le client"
                                color="blue"
                              />
                              <Radio 
                                value="technician" 
                                label="Envoi chez le technicien"
                                color="blue"
                              />
                              <Radio 
                                value="imp360" 
                                label="Envoi chez IMP360"
                                color="blue"
                              />
                            </Stack>
                          </Radio.Group>
                        )}
                      </Stack>

                      <Group justify="flex-end">
                        <Button
                          color="blue"
                          size="md"
                          onClick={createGLPITicket}
                          loading={creatingTicket}
                          leftSection={<IconTicket size={18} />}
                          style={{
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-1px)'
                            }
                          }}
                        >
                          Créer un ticket GLPI
                        </Button>
                        
                        <Button
                          color="red"
                          variant="light"
                          size="md"
                          onClick={clearCart}
                          leftSection={<IconTrash size={18} />}
                          style={{
                            transition: 'background-color 0.2s ease'
                          }}
                        >
                          Vider le panier
                        </Button>
                      </Group>
                    </Stack>
                  </Paper>
                </Stack>
              )}
            </Box>
          )}
        </Transition>

        {loading && (
          <Box ta="center" py="xl">
            <Loader size="lg" color="blue" />
          </Box>
        )}
      </Container>
      <Footer />
    </>
  );
}
