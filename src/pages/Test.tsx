import { useState } from 'react';
import { Button, Container, Paper, Stack, Text, Title, Loader } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

export default function Test() {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);

    const testRoute = async () => {
        setLoading(true);
        try {
            const response = await api.post('/test');
            setResponse(response.data);
            showNotification({
                title: 'Succès',
                message: 'Le ticket GLPI a été modifié avec succès',
                color: 'green'
            });
        } catch (error: any) {
            console.error('Erreur détaillée:', error.response?.data);
            showNotification({
                title: 'Erreur',
                message: error.response?.data?.error || error.response?.data?.details || 'Une erreur est survenue lors de la modification du ticket GLPI',
                color: 'red'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <Container size="md" my={40}>
                <Paper shadow="sm" p="xl" radius="md" withBorder>
                    <Stack gap="lg">
                        <Title order={2} ta="center">Test de l'API GLPI</Title>
                        <Text c="dimmed" ta="center">
                            Cette page permet de tester la modification d'un ticket GLPI via l'API
                        </Text>
                        
                        <Button 
                            onClick={testRoute} 
                            loading={loading}
                            fullWidth
                            size="lg"
                            color="blue"
                        >
                            Tester la modification du ticket GLPI
                        </Button>

                        {loading && (
                            <Stack align="center">
                                <Loader size="md" />
                                <Text size="sm" c="dimmed">Modification du ticket en cours...</Text>
                            </Stack>
                        )}

                        {response && (
                            <Paper p="md" withBorder>
                                <Title order={3} mb="md">Réponse du serveur :</Title>
                                <pre style={{ 
                                    backgroundColor: '#f8f9fa', 
                                    padding: '1rem', 
                                    borderRadius: '4px',
                                    overflow: 'auto',
                                    maxHeight: '300px'
                                }}>
                                    {JSON.stringify(response, null, 2)}
                                </pre>
                            </Paper>
                        )}
                    </Stack>
                </Paper>
            </Container>
            <Footer />
        </>
    );
}