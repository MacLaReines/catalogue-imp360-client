import { Container, Title, Text, Stack } from '@mantine/core';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PolitiqueConfidentialite() {
  return (
    <>
      <Navbar />
      <Container size="md" my="xl">
        <Title order={2} mb="md">Politique de confidentialité</Title>
        <Stack gap="md">
          <Text><strong>Données collectées :</strong></Text>
          <Text>Nous collectons uniquement les données nécessaires au bon fonctionnement du site (email, nom, etc.).</Text>

          <Text><strong>Utilisation des données :</strong></Text>
          <Text>Les données sont utilisées uniquement dans le cadre du service proposé, notamment pour la gestion des comptes, des commandes, ou des messages envoyés via le formulaire de contact.</Text>

          <Text><strong>Durée de conservation :</strong></Text>
          <Text>Les données sont conservées pour une durée maximale de 3 ans après la fin de la relation contractuelle ou le dernier contact.</Text>

          <Text><strong>Droits des utilisateurs :</strong></Text>
          <Text>Vous disposez d’un droit d’accès, de modification et de suppression de vos données. Pour exercer ce droit, vous pouvez nous contacter à l’adresse suivante : [ton.email@example.com]</Text>

          <Text><strong>Cookies :</strong></Text>
          <Text>Nous utilisons des cookies pour améliorer votre expérience de navigation. Vous pouvez les accepter ou les refuser via les paramètres de votre navigateur.</Text>
        </Stack>
      </Container>
      <Footer />
    </>
  );
}
