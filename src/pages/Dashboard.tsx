import {
  Container,
  Title,
  Stack,
  Image,
  Text,
  Grid,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ordinateur from '../assets/ordinateur.png';
import ecrans from '../assets/Ecrans.png';
import nas from '../assets/nas.png';
import accesoires from '../assets/accesoire.png';
import onduleurs from '../assets/onduleur.png';
import imprimante from '../assets/Imprimante.jpg';
import cable from '../assets/cable.jpg';
import telephoneip from '../assets/telephone ip.jpg';
import occasion from '../assets/Occasions.png';
import robotepson from '../assets/robot epson.jpg';
import logiciel from '../assets/logiciel.jpg';

export default function Dashboard() {
  const categories = [
    { name: 'Ordinateurs', image: ordinateur },
    { name: 'Écrans', image: ecrans },
    { name: 'Réseaux - Nas', image: nas },
    { name: 'Accessoires', image: accesoires },
    { name: 'Robot Epson', image: robotepson },
    { name: 'Onduleurs', image: onduleurs },
    { name: 'Imprimantes & Scanners', image: imprimante },
    { name: 'Câbles', image: cable },
    { name: 'Téléphone IP', image: telephoneip },
    { name: 'Occasions', image: occasion },
    { name: 'Catalogues clients', image: ordinateur },
    { name: 'Logiciels', image: logiciel },
  ];

  return (
    <>
      <Navbar />
      <Container my={40} size="xl">
        <Title order={3} ta="center" mb="xl">
          Parcourir les catégories
        </Title>

        <Grid gutter="xl">
          {categories.map((cat, index) => (
            <Grid.Col key={index} span={{ base: 6, sm: 4, md: 3, lg: 2 }}>
              <Link
                to={`/categorie/${cat.name.toLowerCase()}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Stack align="center" gap="xs">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={120}
                  height={120}
                  fit="contain"
                  radius="md"
                />
                  <Text fw={700} size="md" ta="center" style={{ minHeight: '2.5em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cat.name}</Text>
                </Stack>
              </Link>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
