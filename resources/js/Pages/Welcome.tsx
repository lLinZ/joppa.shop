// <ai_context>
// Propósito: Template principal de Landing Page bajo arquitectura estricta 'Bento Box'.
// Responsividad: Navbar transúcido, AppShell con márgenes (App-like feel), Hero 2-column nativo, Secciones inferiores como tarjetas elevadas.
// Dependencias: @mantine/core, Componentes JOPPA locales.
// </ai_context>

import React from 'react';
import { Head } from '@inertiajs/react';
import { AppShell, Container, SimpleGrid, Card, Text, Center, Title, ThemeIcon, Box, rem, Stack, Group, Badge, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconStar, IconTruck, IconPalette } from '@tabler/icons-react';

import { Header } from '../Components/Layout/Header';
import HeroProduct from '../Components/Product/HeroProduct';
import ProductGrid from '../Components/Sections/ProductGrid';
import CartDrawer from '../Components/UI/Cart/CartDrawer';
import JoppaCrew from '../Components/Sections/JoppaCrew';
import Footer from '../Components/Layout/Footer';

export default function Welcome() {
    const [opened, { toggle }] = useDisclosure(false);

    const features = [
        {
            title: 'Calidad Premium',
            description: 'Materiales 100% orgánicos seleccionados para máxima durabilidad y confort.',
            icon: IconStar,
        },
        {
            title: 'Envío Rápido',
            description: 'Entregamos tu estilo JOPPA directamente a tu puerta en tiempo récord.',
            icon: IconTruck,
        },
        {
            title: 'Diseños Únicos',
            description: 'Patrones exclusivos y drops de edición limitada en streetwear.',
            icon: IconPalette,
        },
    ];

    return (
        <AppShell
            header={{ height: 100, collapsed: false, offset: true }}
            className="page-transition"
        >
            <Head title="Welcome to JOPPA Boutique" />

            <CartDrawer />
            <Header opened={opened} toggle={toggle} />

            <AppShell.Main bg="#F4F4E8" pt={rem(120)}>

                <Box w="100%" pb={rem(80)} px={{ base: 'md', md: 'xl' }}>
                    <Stack gap="xl">
                        {/* 1. Hero Nativo (Mantiene su grid interno y expande fluido) */}
                        <HeroProduct />

                        {/* PRODUCT GRID */}
                        <Box>
                            <Group justify="space-between" mb="lg" mt="xl">
                                <Text size="2rem" fw={800} c="#0B3022" style={{ fontFamily: '\"Montserrat\", sans-serif', letterSpacing: '-0.03em' }}>
                                    Novedades de la Temporada
                                </Text>
                            </Group>
                            <ProductGrid />
                        </Box>

                        {/* CUSTOM DESIGN CTA */}
                        <Box mt="2rem">
                            <Card
                                radius="32px"
                                p={{ base: 48, md: 80 }}
                                shadow="xl"
                                bg="#0B3022"
                                c="white"
                                style={{ overflow: 'hidden', position: 'relative' }}
                            >
                                <Box style={{ position: 'absolute', top: -50, right: -50, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)' }} />
                                
                                <SimpleGrid cols={{ base: 1, md: 2 }} spacing={60} style={{ position: 'relative', zIndex: 1, alignItems: 'center' }}>
                                    <Box>
                                        <Badge color="rgba(255,255,255,0.2)" c="white" variant="filled" size="lg" radius="xl" mb="xl">
                                            Edición Ilimitada
                                        </Badge>
                                        <Title 
                                            order={2} 
                                            mb="xl"
                                            style={{ 
                                                fontSize: '3rem', 
                                                lineHeight: 1.1, 
                                                fontFamily: '"Montserrat", sans-serif', 
                                                fontWeight: 900, 
                                                letterSpacing: '-0.03em' 
                                            }}
                                        >
                                            Tu Visión.<br/>
                                            Nuestra Creación.
                                        </Title>
                                        <Text size="lg" mb={40} style={{ fontFamily: '"Inter", sans-serif', opacity: 0.9, lineHeight: 1.6, maxWidth: 500 }}>
                                            No te conformes con lo que ya existe. Únete a nuestro programa de diseño personalizado y da vida a la prenda exacta que siempre has imaginado, con la calidad premium habitual de JOPPA.
                                        </Text>
                                        <Button
                                            component="a"
                                            href="/custom-design"
                                            size="xl"
                                            radius="xl"
                                            bg="#D4AF37"
                                            c="#FFFFFF"
                                            rightSection={<IconPalette size={20} />}
                                            style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.3)', transition: 'transform 0.2s ease', fontFamily: '"Montserrat", sans-serif', fontWeight: 800 }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            Inicia Tu Solicitud
                                        </Button>
                                    </Box>

                                    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <div style={{ position: 'relative', width: '100%', maxWidth: 350, aspectRatio: '1/1', background: 'rgba(255,255,255,0.03)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                             <IconPalette size={140} stroke={1} color="rgba(255,255,255,0.6)" />
                                             <div style={{ position: 'absolute', bottom: -20, right: -20, background: '#F4F4E8', color: '#0B3022', padding: '16px 28px', borderRadius: '100px', fontWeight: 800, fontFamily: '"Montserrat", sans-serif', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', transform: 'rotate(-5deg)' }}>
                                                Hecho a Medida
                                             </div>
                                        </div>
                                    </Box>
                                </SimpleGrid>
                            </Card>
                        </Box>

                        {/* JOPPA CREW COMMUNITY */}
                        <Box mt="2rem">
                            <JoppaCrew />
                        </Box>

                        {/* 3. Bento Card: Propuesta de Valor */}
                        <Card
                            radius="32px"
                            p={{ base: 48, md: 80 }}
                            shadow="none"
                            bg="#F9F9F4"
                            withBorder={false}
                        >
                            <Title
                                c="#0B3022"
                                order={2}
                                ta="center"
                                mb="4rem"
                                style={{ letterSpacing: '-0.02em', fontWeight: 800, fontFamily: '\"Montserrat\", sans-serif' }}
                            >
                                La Diferencia Orgánica
                            </Title>

                            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                                {features.map((feature, index) => {
                                    const Icon = feature.icon;
                                    return (
                                        <Box key={index}>
                                            <Center mb="lg">
                                                <ThemeIcon size={80} radius="100%" color="gray" variant="light" bg="#F9F9F4">
                                                    <Icon size={40} stroke={1.5} color="#000000" />
                                                </ThemeIcon>
                                            </Center>
                                            <Text fw={800} ta="center" size="xl" mb="xs" c="#0B3022" style={{ fontFamily: '\"Montserrat\", sans-serif' }}>
                                                {feature.title}
                                            </Text>
                                            <Text c="dimmed" ta="center" size="md" style={{ fontFamily: '\"Montserrat\", sans-serif', lineHeight: 1.6 }}>
                                                {feature.description}
                                            </Text>
                                        </Box>
                                    );
                                })}
                            </SimpleGrid>
                        </Card>
                    </Stack>
                </Box>

                {/* GLOBAL FOOTER */}
                <Footer />
            </AppShell.Main>
        </AppShell>
    );
}
