import {
  Card,
  Image,
  Text,
  Button,
  Group,
  Stack,
  Flex,
  Box,
  Badge,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX, IconInfoCircle } from '@tabler/icons-react';
import api from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    pricet1: number;
    pricet2: number;
    pricet3: number;
    image: string;
    role: string;
    specs?: Record<string, any>;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      let priceToUse = product.price;

      if (user && user.selectedCompany) {
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
        productId: product._id,
        price: priceToUse
      });

      await fetchCart();

      showNotification({
        title: 'Succès',
        message: `${product.name} a été ajouté au panier`,
        color: 'green',
        icon: <IconCheck size={16} />,
      });
    } catch (error) {
      showNotification({
        title: 'Erreur',
        message: "Impossible d'ajouter le produit au panier",
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  const getDisplayPrice = () => {
    if (!user) {
      return `${product.price} €`;
    }
  
    if (user.role === 'admin' || user.role === 'moderator') {
      return (
        <Stack gap={4}>
          <Text size="sm" c="dimmed">Prix public: {product.price} €</Text>
          <Text size="sm" c="dimmed">Prix T1: {product.pricet1} €</Text>
          <Text size="sm" c="dimmed">Prix T2: {product.pricet2} €</Text>
          <Text size="sm" c="dimmed">Prix T3: {product.pricet3} €</Text>
        </Stack>
      );
    }
  
    // Cas utilisateur standard ou client avec entreprise sélectionnée
    if ((user.role === 'user' || user.role === 'client') && user.selectedCompany) {
      const style = { display: 'inline-block', marginRight: '8px' };
      
      switch (user.selectedCompany.taux) {
        case 'taux1':
          return <Text fw={700} color="blue">{product.pricet1} €</Text>;
        case 'taux2':
          return (
            <Text fw={700} color="blue">
              <Text component="span" style={{ textDecoration: 'line-through', color: 'gray', ...style }}>
                {product.pricet1} €
              </Text>
              {product.pricet2} €
            </Text>
          );
        case 'taux3':
          return (
            <Text fw={700} color="blue">
              <Text component="span" style={{ textDecoration: 'line-through', color: 'gray', ...style }}>
                {product.pricet1} €
              </Text>
              {product.pricet3} €
            </Text>
          );
        default:
          return <Text fw={700} color="blue">{product.price} €</Text>;
      }
    }

    // Cas utilisateur ou client sans entreprise sélectionnée
    return <Text fw={700} color="blue">{product.price} €</Text>;
  };
  

  const handleViewDetails = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Flex gap="md" align="center">
        <Box 
          style={{ 
            flexShrink: 0,
            width: '100px',
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            padding: '4px'
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
        <Stack justify="space-between" style={{ flex: 1 }} gap={8}>
          <div>
            <Text fw={600} size="lg" lineClamp={1}>{product.name}</Text>
            <Text size="sm" c="dimmed" lineClamp={2} mt={4}>
              {product.description}
            </Text>
            {product.role === 'écrans' && product.specs && (
              <Box mt={4}>
                {product.specs.resolution && (
                  <Text size="xs" c="dimmed">Résolution : {product.specs.resolution}</Text>
                )}
                {product.specs.contrast && (
                  <Text size="xs" c="dimmed">Contraste : {product.specs.contrast}</Text>
                )}
              </Box>
            )}
            <Box mt={8}>
              {getDisplayPrice()}
            </Box>
          </div>
          <Group justify="flex-end" gap="xs" mt={4}>
            <Button 
              onClick={handleViewDetails} 
              variant="light" 
              color="gray" 
              size="sm"
              leftSection={<IconInfoCircle size={16} />}
            >
              Détails
            </Button>
            <Button 
              onClick={handleAddToCart} 
              variant="light" 
              color="blue" 
              size="sm"
            >
              Ajouter au panier
            </Button>
          </Group>
        </Stack>
      </Flex>
    </Card>
  );
}
