import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { AppShell, Box, Container, Title, Text, Button, Group, TextInput, Textarea, Card, SimpleGrid, rem, Badge, ThemeIcon, Notification, Stack, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconCheck, IconX, IconBrandWhatsapp, IconBrandInstagram, IconMail, IconPhone, IconMessageCircle, IconSend } from '@tabler/icons-react';
import axios from 'axios';

import { Header } from '../Components/Layout/Header';
import Footer from '../Components/Layout/Footer';
import CartDrawer from '../Components/UI/Cart/CartDrawer';

const CRM_API_URL = (import.meta.env.VITE_CRM_API_URL as string) || 'http://localhost:8000/api';

export default function Contact() {
    const [opened, { toggle }] = useDisclosure(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
        },
        validate: {
            name: (value) => (value.length < 2 ? 'Nombre muy corto' : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Correo inválido'),
            message: (value) => (value.length < 10 ? 'El mensaje debe ser más detallado' : null),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            await axios.post(`${CRM_API_URL}/contact-messages`, values);
            setSuccess(true);
            form.reset();
        } catch (err: any) {
            console.error(err);
            // Even if CRM fails, we can show a mailto fallback or just success if it's a demo
            setError('Ocurrió un error al enviar el mensaje. Intenta de nuevo o contáctanos por WhatsApp.');
        } finally {
            setSubmitting(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <AppShell header={{ height: 100, collapsed: false, offset: true }}>
            <Head title="Contacto - JOPPA" />

            <CartDrawer />
            <Header opened={opened} toggle={toggle} />

            <AppShell.Main bg="#F4F4E8" pt={rem(140)} pb={rem(120)} style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Decorative backgrounds */}
                <Box style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0) 70%)', zIndex: 0 }} />
                
                <Container size="lg" style={{ position: 'relative', zIndex: 1 }}>
                    <Box style={{ textAlign: 'center', marginBottom: rem(80) }}>
                        <Badge color="#0B3022" variant="filled" size="lg" radius="xl" mb="md" style={{ letterSpacing: '0.1em', fontWeight: 800 }}>
                            ESTAMOS PARA TI
                        </Badge>
                        <Title order={1} c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-0.04em' }}>
                            Hablemos de tu <span style={{ color: '#D4AF37' }}>visión.</span>
                        </Title>
                        <Text c="#4A4A4A" mt="xl" size="xl" style={{ fontFamily: '"Montserrat", sans-serif', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>
                            ¿Tienes una duda, quieres una cotización especial o solo quieres saludar? Nuestro equipo está listo para escucharte.
                        </Text>
                    </Box>

                    {success && (
                        <Notification icon={<IconCheck size={20} />} color="teal" title="¡Mensaje Enviado!" onClose={() => setSuccess(false)} mb={rem(48)} radius="xl">
                            Hemos recibido tu mensaje. Te contactaremos lo antes posible.
                        </Notification>
                    )}

                    {error && (
                        <Notification icon={<IconX size={20} />} color="red" title="Error" onClose={() => setError(null)} mb={rem(48)} radius="xl">
                            {error}
                        </Notification>
                    )}

                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing={rem(40)}>
                        {/* FORM CARD */}
                        <Card shadow="xl" radius="32px" p={{ base: 32, md: 48 }} bg="white" style={{ border: '1px solid rgba(11,48,34,0.03)' }}>
                            <form onSubmit={form.onSubmit(handleSubmit)}>
                                <Stack gap="xl">
                                    <TextInput
                                        withAsterisk
                                        label="Tu Nombre"
                                        placeholder="Escribe tu nombre completo"
                                        radius="xl"
                                        size="md"
                                        {...form.getInputProps('name')}
                                        styles={{ label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: 8 } }}
                                    />
                                    <TextInput
                                        withAsterisk
                                        label="Correo Electrónico"
                                        placeholder="tu@email.com"
                                        radius="xl"
                                        size="md"
                                        {...form.getInputProps('email')}
                                        styles={{ label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: 8 } }}
                                    />
                                    <TextInput
                                        label="Teléfono (Opcional)"
                                        placeholder="+58 4XX XXX XXXX"
                                        radius="xl"
                                        size="md"
                                        {...form.getInputProps('phone')}
                                        styles={{ label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: 8 } }}
                                    />
                                    <Textarea
                                        withAsterisk
                                        label="Tu Mensaje"
                                        placeholder="¿En qué podemos ayudarte?"
                                        minRows={5}
                                        radius="xl"
                                        size="md"
                                        {...form.getInputProps('message')}
                                        styles={{ label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: 8 } }}
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        radius="xl"
                                        size="xl"
                                        bg="#0B3022"
                                        leftSection={<IconSend size={20} />}
                                        loading={submitting}
                                        style={{ height: 64, fontSize: '1.2rem', fontWeight: 800, transition: 'all 0.3s ease' }}
                                    >
                                        Enviar Mensaje
                                    </Button>
                                </Stack>
                            </form>
                        </Card>

                        {/* INFO BENTO GRID */}
                        <Stack gap="xl">
                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
                                <Card radius="32px" p="xl" bg="#0B3022" c="white" shadow="md">
                                    <ThemeIcon variant="light" color="white" size="xl" radius="md" mb="md">
                                        <IconBrandWhatsapp size={24} />
                                    </ThemeIcon>
                                    <Text fw={800} size="lg" mb="sm">WhatsApp</Text>
                                    <Text size="sm" mb="xl" opacity={0.8}>Respuesta rápida para ventas directas.</Text>
                                    <Anchor href="https://wa.me/584222030200" c="white" fw={700} target="_blank" underline="always">
                                        +58 422 203 0200
                                    </Anchor>
                                </Card>

                                <Card radius="32px" p="xl" bg="white" shadow="sm" style={{ border: '1px solid rgba(11,48,34,0.05)' }}>
                                    <ThemeIcon variant="light" color="#0B3022" size="xl" radius="md" mb="md">
                                        <IconBrandInstagram size={24} />
                                    </ThemeIcon>
                                    <Text fw={800} size="lg" mb="sm" c="#0B3022">Instagram</Text>
                                    <Text size="sm" mb="xl" c="dimmed">Mira nuestras últimas piezas.</Text>
                                    <Anchor href="https://instagram.com/joppa.shop" c="#0B3022" fw={700} target="_blank" underline="always">
                                        @joppa.shop
                                    </Anchor>
                                </Card>
                            </SimpleGrid>

                            <Card radius="32px" p="xl" bg="#D4AF37" c="white" shadow="lg">
                                <Group justify="space-between" align="center">
                                    <Box>
                                        <ThemeIcon variant="white" color="#D4AF37" size="xl" radius="md" mb="md">
                                            <IconMail size={24} />
                                        </ThemeIcon>
                                        <Text fw={800} size="xl" mb="xs">Email de Atención</Text>
                                        <Text opacity={0.9} fw={600} size="lg">atencion@joppa.shop</Text>
                                    </Box>
                                    <IconMessageCircle size={80} stroke={0.5} opacity={0.3} />
                                </Group>
                            </Card>

                            <Card radius="32px" p="xl" bg="white" shadow="sm" style={{ border: '1px solid rgba(11,48,34,0.05)' }}>
                                <Group>
                                    <ThemeIcon variant="light" color="#0B3022" size={48} radius="xl">
                                        <IconPhone size={24} />
                                    </ThemeIcon>
                                    <Box>
                                        <Text fw={800} c="#0B3022">Atención al Cliente</Text>
                                        <Text size="sm" c="dimmed">Lunes a Sábado: 9am - 6pm</Text>
                                    </Box>
                                </Group>
                            </Card>
                        </Stack>
                    </SimpleGrid>
                </Container>
            </AppShell.Main>

            <Footer />
        </AppShell>
    );
}
