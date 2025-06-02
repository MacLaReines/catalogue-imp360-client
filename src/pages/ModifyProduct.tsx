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
  Loader,
  Text,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import Footer from '../components/Footer';

interface Product {
  _id: string;
  name: string;
  sku: string;
  brand: string;
  type: string;
  model: string;
  description: string;
  description2: string;
  price: number;
  pricet1: number;
  pricet2: number;
  pricet3: number;
  guarantee: string;
  role: string;
  gn: boolean;
  image: string;
  specs: { [key: string]: string };
}

export default function ModifyProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
  const [currentImage, setCurrentImage] = useState('');
  const [specs, setSpecs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      const product: Product = response.data;
      
      setName(product.name || '');
      setSku(product.sku || '');
      setBrand(product.brand || '');
      setType(product.type || '');
      setModel(product.model || '');
      setDescription(product.description || '');
      setDescription2(product.description2 || '');
      setPrice(product.price?.toString() || '0');
      setPricet1(product.pricet1?.toString() || '0');
      setPricet2(product.pricet2?.toString() || '0');
      setPricet3(product.pricet3?.toString() || '0');
      setGuarantee(product.guarantee || '');
      setRole(product.role || '');
      setGn(product.gn || false);
      setCurrentImage(product.image || '');
      setSpecs(product.specs || {});
      
      setLoading(false);
    } catch (error) {
      showNotification({
        title: 'Erreur',
        message: 'Impossible de charger le produit',
        color: 'red',
      });
      navigate('/intern');
    }
  };

  const handleSpecsChange = (key: string, value: string) => {
    setSpecs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      console.log('Envoi des données au serveur:', {
        price: parseFloat(price),
        pricet1: parseFloat(pricet1 || '0'),
        pricet2: parseFloat(pricet2 || '0'),
        pricet3: parseFloat(pricet3 || '0')
      });

      let imageUrl = currentImage;

      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('name', name);

        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        imageUrl = uploadRes.data.imageUrl;
      }

      await api.put(`/products/${id}`, {
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
        message: 'Produit modifié avec succès',
        color: 'green',
        icon: <IconCheck size={16} />,
      });

      navigate('/intern');
    } catch (error) {
      console.error('Erreur détaillée:', error);
      showNotification({
        title: 'Erreur',
        message: 'Impossible de modifier le produit',
        color: 'red',
      });
    }
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

  if (loading) {
    return (
      <>
        <Navbar />
        <Container size="lg" my="xl" style={{ textAlign: 'center' }}>
          <Loader size="xl" />
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container size="lg" my="xl">
        <Title order={2} mb="md">Modifier le produit</Title>
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

          <Input.Wrapper label="Image du produit">
            {currentImage && (
              <Group mb="md">
                <img
                  src={currentImage}
                  alt="Image actuelle"
                  style={{ width: 100, height: 100, objectFit: 'contain' }}
                />
                <Text size="sm" c="dimmed">Image actuelle</Text>
              </Group>
            )}
            <Input.Wrapper description="Laissez vide pour conserver l'image actuelle">
              <Input
                type="file"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              />
            </Input.Wrapper>
          </Input.Wrapper>

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => navigate('/intern')}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              Enregistrer les modifications
            </Button>
          </Group>
        </Stack>
      </Container>
      <Footer />
    </>
  );
} 