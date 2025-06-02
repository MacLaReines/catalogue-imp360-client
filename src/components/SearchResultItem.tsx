import { UnstyledButton, Group, Image, Text, Box, Badge } from '@mantine/core';
import { IconTag } from '@tabler/icons-react';

interface SearchResultItemProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  };
  onClick: () => void;
}

export function SearchResultItem({ product, onClick }: SearchResultItemProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      style={{
        padding: '12px',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        border: '1px solid var(--mantine-color-gray-2)',
        '&:hover': {
          backgroundColor: 'var(--mantine-color-blue-0)',
          borderColor: 'var(--mantine-color-blue-3)',
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        },
      }}
    >
      <Group align="flex-start" wrap="nowrap">
        <Box
          style={{
            position: 'relative',
            width: 60,
            height: 60,
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: 'var(--mantine-color-gray-0)',
          }}
        >
          <Image
            src={product.image}
            alt={product.name}
            width={60}
            height={60}
            fit="contain"
            style={{
              objectFit: 'contain',
              padding: '4px',
            }}
          />
        </Box>
        
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Text size="sm" fw={600} lineClamp={1}>
            {product.name}
          </Text>
          <Text size="xs" c="dimmed" lineClamp={2} mb={4}>
            {product.description}
          </Text>
          <Group gap="xs" align="center">
            <Badge
              leftSection={<IconTag size={12} />}
              color="blue"
              variant="light"
              size="sm"
            >
              {product.price.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              })}
            </Badge>
          </Group>
        </Box>
      </Group>
    </UnstyledButton>
  );
} 