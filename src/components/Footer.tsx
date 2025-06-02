import { Box, Container, Text, Grid, Stack, Anchor, Image, Divider, Flex } from '@mantine/core';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <Box bg="gray.0" py="xl" mt="xl" style={{ borderTop: '1px solid #e0e0e0' }}>
      <Container size="lg">
        <Grid gutter="xl" justify="space-between" align="center">
          {/* Colonne gauche : logo + contact */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="xs">
              <Image src={logo} alt="Logo IMP360" width={120} />
              <Text size="sm" color="dimmed">
                Contact : contact@imp360.com
              </Text>
            </Stack>
          </Grid.Col>

          {/* Colonne droite : liens */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Flex direction="column" gap="xs" justify="center" align="flex-end">
              <Anchor component={Link} to="/mentionlegales" size="sm" underline="hover">
                Mentions légales
              </Anchor>
              <Anchor component={Link} to="/politiqueconfidentialite" size="sm" underline="hover">
                Politique de confidentialité
              </Anchor>
            </Flex>
          </Grid.Col>
        </Grid>

        <Divider my="md" />

        <Text size="xs" ta="center" color="dimmed">
          © {new Date().getFullYear()} IMP360 – Tous droits réservés
        </Text>
      </Container>
    </Box>
  );
}
