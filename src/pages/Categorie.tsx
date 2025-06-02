import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import {
  Box,
  Flex,
  Paper,
  Stack,
  Text,
  Title,
  Loader,
  Checkbox,
  Select,
  SimpleGrid,
  Group,
} from '@mantine/core';
import { IconLayoutGrid, IconList } from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Product } from '../types/product';
import { commonFilters, categoryFilters, FilterConfig } from '../config/filtersConfig';

export default function Categorie() {
  const { role } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Record<string, string | string[]>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filters: FilterConfig[] = [
    ...commonFilters,
    ...(role && categoryFilters[role] ? categoryFilters[role] : [])
  ];

  const updateFilter = (label: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[label] || [];
      if (Array.isArray(current)) {
        return {
          ...prev,
          [label]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        };
      }
      return { ...prev, [label]: value };
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products/role/${role}`);
        setProducts(res.data);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [role]);

  return (
    <>
      <Navbar />
      <Box style={{ height: 'calc(100vh - 60px)' }}>
        <Flex h="100%">
          <Box w="30%" h="100%">
            <Paper p="lg" shadow="xs" withBorder h="100%" style={{ overflowY: 'auto' }}>
              <Flex align="center" justify="space-between" mb="md">
                <Title order={4}>Filtres</Title>
                <Group>
                  <Box
                    style={{
                      cursor: 'pointer',
                      color: viewMode === 'grid' ? '#1c7ed6' : '#adb5bd',
                      border: viewMode === 'grid' ? '2px solid #1c7ed6' : '2px solid transparent',
                      borderRadius: 4,
                      padding: 2,
                    }}
                    onClick={() => setViewMode('grid')}
                  >
                    <IconLayoutGrid size={24} />
                  </Box>
                  <Box
                    style={{
                      cursor: 'pointer',
                      color: viewMode === 'list' ? '#1c7ed6' : '#adb5bd',
                      border: viewMode === 'list' ? '2px solid #1c7ed6' : '2px solid transparent',
                      borderRadius: 4,
                      padding: 2,
                    }}
                    onClick={() => setViewMode('list')}
                  >
                    <IconList size={24} />
                  </Box>
                </Group>
              </Flex>
              <Stack gap="md">
                {filters.map((filter, idx) => (
                  <Paper key={idx} p="sm" radius="md" shadow="xs" withBorder>
                    <Text fw={600} size="sm" mb="xs">
                      {filter.label}
                    </Text>

                    {filter.type === 'checkbox' && (
                      <Stack gap="xs">
                        {filter.options?.map((opt) => (
                          <Checkbox
                            key={opt}
                            label={opt}
                            size="sm"
                            radius="sm"
                            checked={(activeFilters[filter.label] as string[] | undefined)?.includes(opt)}
                            onChange={() => updateFilter(filter.label, opt)}
                          />
                        ))}
                      </Stack>
                    )}

                    {filter.type === 'select' && (
                      <Select
                        label={filter.label}
                        data={filter.options || []}
                        placeholder={`Choisir ${filter.label.toLowerCase()}`}
                        value={(activeFilters[filter.label] as string) ?? ''}
                        onChange={(val) => {
                          if (val !== null) updateFilter(filter.label, val);
                        }}
                        searchable
                        clearable
                      />
                    )}
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Box>

          <Box w="70%" h="100%">
            <Box style={{ overflowY: 'auto', height: '100%', padding: '1rem' }}>
              {loading ? (
                <Loader />
              ) : products.length === 0 ? (
                <Text>Aucun produit trouvé dans cette catégorie.</Text>
              ) : (
                <SimpleGrid cols={viewMode === 'grid' ? 2 : 1} spacing="lg">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </SimpleGrid>
              )}
            </Box>
          </Box>
        </Flex>
      </Box>
      <Footer />
    </>
  );
}
