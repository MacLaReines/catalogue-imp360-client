import { Container, Title, Text, Stack } from '@mantine/core';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MentionsLegales() {
  return (
    <>
      <Navbar />
      <Container size="md" my="xl">
        <Title order={2} mb="md">Mentions légales</Title>
        <Stack gap="md">
          <Text><strong>Éditeur du site :</strong></Text>
          <Text>Nom ou Raison sociale : [Ton nom ou société]</Text>
          <Text>Adresse : [Ton adresse]</Text>
          <Text>Email : [ton.email@example.com]</Text>
          <Text>Responsable de la publication : [Nom du responsable]</Text>

          <Text><strong>Hébergement :</strong></Text>
          <Text>Nom de l’hébergeur : [Nom de l’hébergeur]</Text>
          <Text>Adresse : [Adresse de l’hébergeur]</Text>
          <Text>Contact : [Email de l’hébergeur ou page de support]</Text>

          <Text><strong>Propriété intellectuelle :</strong></Text>
          <Text>Tout le contenu présent sur ce site est la propriété exclusive de [Nom ou société], sauf mention contraire.</Text>
        </Stack>
      </Container>
      <Footer />
    </>
  );
}
