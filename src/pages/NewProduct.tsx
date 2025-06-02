import {
  Button,
  Checkbox,
  Container,
  Divider,
  Grid,
  Group,
  Input,
  Select,
  Stack,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import Footer from '../components/Footer';

export default function NewProductPage() {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('');
  const [type, setType] = useState('');
  const [model, setModel] = useState('');
  const [description, setDescription] = useState('');
  const [description2, setDescription2] = useState('');
  const [price, setPrice] = useState('');
  const [pricet1, setPricet1] = useState('');
  const [pricet2, setPricet2] = useState('');
  const [pricet3, setPricet3] = useState('');
  const [guarantee, setGuarantee] = useState('');
  const [role, setRole] = useState('');
  const [gn, setGn] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [specs, setSpecs] = useState<{ [key: string]: string }>({});

  const handleSpecsChange = (key: string, value: string) => {
    setSpecs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!image || !name || !price || !role || !sku || !brand || !type || !model) {
      return alert('Champs manquants');
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', name);

    const uploadRes = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const imageUrl = uploadRes.data.imageUrl;

    await api.post('/products', {
      gn,
      sku,
      name,
      brand,
      type,
      model,
      description,
      description2,
      price: parseFloat(price),
      pricet1: parseFloat(pricet1 || '0'),
      pricet2: parseFloat(pricet2 || '0'),
      pricet3: parseFloat(pricet3 || '0'),
      guarantee,
      role,
      image: imageUrl,
      specs,
    });

    showNotification({
      title: 'Succès',
      message: 'Produit créé avec succès',
      color: 'green',
      icon: <IconCheck size={16} />,
    });
  };

const renderSpecsInputs = () => {
  const renderGrid = (fields: { key: string, label: string }[]) => (
    <>
      <Divider label="Spécifications" my="md" />
      <Grid gutter="md">
        {fields.map(({ key, label }) => (
          <Grid.Col span={6} key={key}>
            <TextInput
              label={label}
              value={specs[key] || ''}
              onChange={(e) => handleSpecsChange(key, e.target.value)}
            />
          </Grid.Col>
        ))}
      </Grid>
    </>
  );

  switch (role) {
    case 'ordinateurs':
      return renderGrid([
        { key: 'cpu', label: 'Processeur' },
        { key: 'cputype', label: 'Type de processeur' },
        { key: 'ram', label: 'Mémoire RAM' },
        { key: 'stockage', label: 'Stockage' },
        { key: 'gpu', label: 'Carte graphique' },
        { key: 'screen', label: 'Taille écran' },
        { key: 'network', label: 'Réseau' },
        { key: 'burner', label: 'Graveur' },
        { key: 'connections', label: 'Connectique' },
        { key: 'alim', label: 'Alimentation' },
        { key: 'os', label: "Système d'exploitation" },
      ]);
    case 'écrans':
      return renderGrid([
        { key: 'displaysize', label: 'Taille écran' },
        { key: 'connections', label: 'Connectique' },
        { key: 'medicalCE', label: 'CE Médical' },
        { key: 'support', label: 'Support' },
        { key: 'captor', label: 'Capteur' },
        { key: 'cord', label: 'Cordon Inclus' },
        { key: 'resolution', label: 'Résolution' },
        { key: 'contrast', label: 'Contraste' },
      ]);
    case 'réseaux - nas':
      return renderGrid([
        { key: 'racks', label: 'Nombre de baies' },
        { key: 'poe', label: 'PoE' },
        { key: 'poePower', label: 'Puissance PoE' },
        { key: 'alim', label: 'Alimentation' },
      ]);
    case 'accessoires':
    case 'robot epson':
      return renderGrid([{ key: 'cable', label: 'Câble' }]);
    case 'onduleurs':
    case 'occasions':
      return renderGrid([{ key: 'description3', label: 'Description complémentaire' }]);
    case 'imprimantes & scanners':
      return renderGrid([
        { key: 'rectoverso', label: 'Impression recto-verso' },
        { key: 'charger', label: 'Chargeur' },
        { key: 'norm', label: 'Norme' },
        { key: 'cable', label: 'Câble' },
        { key: 'optionbac', label: 'Option bac' },
        { key: 'alim', label: 'Alimentation' },
      ]);
    case 'téléphone ip':
      return renderGrid([{ key: 'alim', label: 'Alimentation' }]);
    default:
      return null;
  }
};


  const renderGrid = (fields: string[]) => (
    <>
      <Divider label="Spécifications" my="md" />
      <Grid gutter="md">
        {fields.map((key) => (
          <Grid.Col span={6} key={key}>
            <TextInput
              label={key}
              value={specs[key] || ''}
              onChange={(e) => handleSpecsChange(key, e.target.value)}
            />
          </Grid.Col>
        ))}
      </Grid>
    </>
  );

  return (
    <>
      <Navbar />
      <Container size="lg" my="xl">
        <Title order={2} mb="md">Créer un produit</Title>
        <Stack gap="md">
          <Divider label="Informations générales" />
          <Checkbox label="GN (Game nationale)" checked={gn} onChange={(e) => setGn(e.currentTarget.checked)} />
          <Grid gutter="md">
            <Grid.Col span={6}><TextInput label="SKU" required value={sku} onChange={(e) => setSku(e.target.value)} /></Grid.Col>
            <Grid.Col span={6}><TextInput label="Nom" required value={name} onChange={(e) => setName(e.target.value)} /></Grid.Col>
            <Grid.Col span={6}><TextInput label="Marque" required value={brand} onChange={(e) => setBrand(e.target.value)} /></Grid.Col>
            <Grid.Col span={6}><TextInput label="Modèle" required value={model} onChange={(e) => setModel(e.target.value)} /></Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Catégorie"
                required
                data={[
                  { value: "ordinateurs", label: "Ordinateurs" },
                  { value: "écrans", label: "Écrans" },
                  { value: "réseaux - nas", label: "Réseaux - nas" },
                  { value: "accessoires", label: "Accessoires" },
                  { value: "robot epson", label: "Robot epson" },
                  { value: "onduleurs", label: "Onduleurs" },
                  { value: "imprimantes & scanners", label: "Imprimantes & Scanners" },
                  { value: "câbles", label: "Câbles" },
                  { value: "téléphone ip", label: "Téléphone ip" },
                  { value: "occasions", label: "Occasions" },
                  { value: "logiciels", label: "Logiciels" }
                ]}
                value={role}
                onChange={(val) => setRole(val || '')}
              />
            </Grid.Col>
            <Grid.Col span={6}><TextInput label="Type" required value={type} onChange={(e) => setType(e.target.value)} /></Grid.Col>
          </Grid>

          <Divider label="Descriptions" />
          <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Textarea label="Description secondaire" value={description2} onChange={(e) => setDescription2(e.target.value)} />

          <Divider label="Tarifs" />
          <Grid gutter="md">
            <Grid.Col span={6}><TextInput label="Prix" required type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></Grid.Col>
            <Grid.Col span={6}><TextInput label="Garantie" value={guarantee} onChange={(e) => setGuarantee(e.target.value)} /></Grid.Col>
            <Grid.Col span={4}><TextInput label="Prix T1" type="number" value={pricet1} onChange={(e) => setPricet1(e.target.value)} /></Grid.Col>
            <Grid.Col span={4}><TextInput label="Prix T2" type="number" value={pricet2} onChange={(e) => setPricet2(e.target.value)} /></Grid.Col>
            <Grid.Col span={4}><TextInput label="Prix T3" type="number" value={pricet3} onChange={(e) => setPricet3(e.target.value)} /></Grid.Col>
          </Grid>

          {renderSpecsInputs()}

          <Input.Wrapper label="Image du produit" required>
            <Input type="file" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
          </Input.Wrapper>

          <Group justify="flex-end" mt="md">
            <Button onClick={handleSubmit}>Créer</Button>
          </Group>
        </Stack>
      </Container>
      <Footer />
    </>
  );
}
