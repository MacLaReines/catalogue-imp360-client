import {
  Paper,
  Flex,
  Group,
  Button,
  Text,
  Image,
  Avatar,
  Menu,
  UnstyledButton,
  Loader,
  TextInput,
  Badge,
  Transition,
  rem,
  Box,
  Card,
  Stack,
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { forwardRef, useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import {
  IconChevronRight,
  IconSearch,
  IconShoppingCart,
} from '@tabler/icons-react';
import api from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { SearchResultItem } from './SearchResultItem';

interface User {
  email: string;
  taux: string;
  role?: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  name: string;
  email: string;
  icon?: React.ReactNode;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const TRANSITION_DURATION = 200;

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ name, email, icon, ...others }, ref) => (
    <UnstyledButton
      ref={ref}
      style={{
        padding: 'var(--mantine-spacing-md)',
        color: 'var(--mantine-color-text)',
        borderRadius: 'var(--mantine-radius-md)',
        transition: 'background-color 0.2s ease',
        '&:hover': {
          backgroundColor: 'var(--mantine-color-gray-0)',
        },
      }}
      {...others}
    >
      <Group>
        <Avatar 
          name={name} 
          color="blue" 
          radius="xl"
          size="md"
          style={{
            boxShadow: 'var(--mantine-shadow-xs)',
            border: '2px solid var(--mantine-color-blue-1)'
          }}
        />
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={600} c="dark.7">
            {email.split('@')[0]}
          </Text>
          <Text size="xs" c="dimmed" truncate>
            {email}
          </Text>
        </div>
        {icon || <IconChevronRight size={16} style={{ color: 'var(--mantine-color-blue-6)' }} />}
      </Group>
    </UnstyledButton>
  )
);

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { cartCount, fetchCart } = useCart();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    api
      .get('/api/me')
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    fetchCart();
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (search.trim() === '') {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      try {
        const response = await api.get(`/products/search?q=${encodeURIComponent(search)}`);
        setSearchResults(response.data);
        setShowResults(true);
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      window.location.href = '/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleProductClick = (productId: string) => {
    setSearch('');
    setShowResults(false);
    navigate(`/product/${productId}`);
  };

  return (
    <Paper
      shadow="sm"
      p="sm"
      withBorder
      radius={0}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'white',
        borderBottom: '1px solid var(--mantine-color-gray-2)',
      }}
    >
      <Flex justify="space-between" align="center" gap="md">
        {/* Logo */}
        <Flex align="center" gap="sm">
          <UnstyledButton 
            component={Link} 
            to="/dashboard"
            style={{
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <Image 
              src={logo} 
              alt="Logo" 
              width={52} 
              height={52}
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            />
          </UnstyledButton>
        </Flex>

        {/* Barre de recherche */}
        <Box style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <Box style={{ width: '400px', position: 'relative' }}>
            <TextInput
              placeholder="Rechercher un produit..."
              leftSection={<IconSearch size={16} style={{ color: 'var(--mantine-color-blue-6)' }} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              radius="md"
              styles={{
                input: {
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  '&:focus': {
                    borderColor: 'var(--mantine-color-blue-6)',
                    boxShadow: '0 0 0 2px var(--mantine-color-blue-1)',
                  },
                },
              }}
            />
            
            <Transition mounted={showResults && searchResults.length > 0} transition="fade" duration={200}>
              {(styles) => (
                <Card
                  shadow="md"
                  p="xs"
                  radius="md"
                  withBorder
                  style={{
                    ...styles,
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    maxHeight: '400px',
                    overflowY: 'auto',
                    backgroundColor: 'white',
                    zIndex: 1000,
                    border: '1px solid var(--mantine-color-gray-2)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <Stack gap="xs">
                    {searchResults.map((product) => (
                      <SearchResultItem
                        key={product._id}
                        product={product}
                        onClick={() => handleProductClick(product._id)}
                      />
                    ))}
                  </Stack>
                </Card>
              )}
            </Transition>
          </Box>
        </Box>

        {/* Droite */}
        <Group gap="md">
          {!loading && user?.role !== 'admin' && (
            <Button
              variant="light"
              color="blue"
              leftSection={<IconShoppingCart size={20} />}
              component={Link}
              to="/cart"
              radius="md"
              style={{
                transition: 'transform 0.2s ease, background-color 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Panier
              {cartCount > 0 && (
                <Badge 
                  color="blue" 
                  size="sm" 
                  ml={6}
                  style={{
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          )}

          {(user?.role === 'moderator') && (
            <Button 
              variant="light" 
              color="dark" 
              component={Link} 
              to="/Intern"
              radius="md"
              style={{
                transition: 'transform 0.2s ease, background-color 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Interface interne
            </Button>
          )}

          {user?.role === 'admin' && (
            <Button 
              variant="light" 
              color="dark" 
              component={Link} 
              to="/admin"
              radius="md"
              style={{
                transition: 'transform 0.2s ease, background-color 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Panel admin
            </Button>
          )}

          {loading ? (
            <Loader size="sm" color="blue" />
          ) : user ? (
            <Menu 
              withArrow 
              shadow="md"
              position="bottom-end"
              transitionProps={{ duration: TRANSITION_DURATION }}
            >
              <Menu.Target>
                <UserButton
                  name={user.email.split('@')[0]}
                  email={user.email}
                />
              </Menu.Target>
              <Menu.Dropdown>
                {(user.role === 'user' || user.role === 'client') && (
                  <Menu.Item 
                    component={Link} 
                    to="/select-company"
                    style={{
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    Changer d'entreprise
                  </Menu.Item>
                )}
                <Menu.Item 
                  component={Link} 
                  to="/profile"
                  style={{
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  Profil
                </Menu.Item>
                <Menu.Item 
                  onClick={handleLogout}
                  color="red"
                  style={{
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  Déconnexion
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Button 
              component={Link} 
              to="/login"
              radius="md"
              style={{
                transition: 'transform 0.2s ease, background-color 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Se connecter
            </Button>
          )}
        </Group>
      </Flex>
    </Paper>
  );
}
