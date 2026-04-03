// <ai_context>
// Propósito: Template principal de Landing Page bajo arquitectura estricta 'Bento Box'.
// Responsividad: Navbar transúcido, AppShell con márgenes (App-like feel), Hero 2-column nativo, Secciones inferiores como tarjetas elevadas.
// Dependencias: @mantine/core, Componentes JOPPA locales.
// </ai_context>

import React from 'react';
import { Head } from '@inertiajs/react';
import { AppShell, Container, SimpleGrid, Card, Text, Center, Title, ThemeIcon, Box, rem, Stack, Group, Badge, Button, Image, Grid } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconStar, IconTruck, IconPalette, IconBrandWhatsapp, IconMail, IconBrandInstagram, IconPhone, IconMessageCircle2, IconHeart, IconUsers } from '@tabler/icons-react';

import { Header } from '../Components/Layout/Header';
import HeroProduct from '../Components/Product/HeroProduct';
import ProductGrid from '../Components/Sections/ProductGrid';
import CartDrawer from '../Components/UI/Cart/CartDrawer';
import { FloatingWhatsApp } from '../Components/UI/FloatingWhatsApp';
import JoppaCrew from '../Components/Sections/JoppaCrew';
import Footer from '../Components/Layout/Footer';
export default function Welcome() {
    const [opened, { toggle }] = useDisclosure(false);

    const features = [
        {
            title: 'Impresión DTF Premium',
            description: 'Servicio de estampados DTF en Valencia, Carabobo con colores vivos y de alta durabilidad para tus prendas.',
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
        <>
        <AppShell
            header={{ height: 100, collapsed: false, offset: true }}
            className="page-transition"
        >
            <Head>
                <title>Joppa | Estampados DTF en Valencia</title>
                <meta name="description" content="Somos expertos en estampados DTF en Valencia, Carabobo. Crea y personaliza tus prendas con Joppa, tu tienda virtual de impresión DTF, sublimación y diseño." />
            </Head>

            <CartDrawer />
            <Header opened={opened} toggle={toggle} />

            <AppShell.Main bg="#F4F4E8" pt={rem(120)}>

                <Box w="100%" pb={rem(80)} px={{ base: 'md', md: 'xl' }}>
                    <Stack gap="xl">
                        {/* 1. Hero Nativo (Mantiene su grid interno y expande fluido) */}
                        <HeroProduct />

                        {/* PRODUCT GRID */}
                        <Box>
                            <ProductGrid />
                        </Box>

                        {/* CUSTOM DESIGN CTA */}
                        <Box mt="2rem">
                            <Card
                                radius="32px"
                                p={{ base: 24, md: 60 }}
                                shadow="xl"
                                bg="#0B3022"
                                c="white"
                                style={{ overflow: 'hidden', position: 'relative' }}
                            >
                                <Box style={{ position: 'absolute', top: -50, right: -50, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)' }} />

                                <Grid gutter={{ base: 40, md: 80 }} align="center" style={{ position: 'relative', zIndex: 1 }}>
                                    <Grid.Col span={{ base: 12, md: 5 }}>
                                        <Badge color="rgba(255,255,255,0.2)" c="white" variant="filled" size="lg" radius="xl" mb="xl">
                                            Edición Ilimitada
                                        </Badge>
                                        <Title
                                            order={2}
                                            mb="xl"
                                            style={{
                                                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                                                lineHeight: 1.1,
                                                fontFamily: '"Montserrat", sans-serif',
                                                fontWeight: 900,
                                                letterSpacing: '-0.03em'
                                            }}
                                        >
                                            Tu Visión.<br />
                                            Nuestro DTF.
                                        </Title>
                                        <Text size="lg" mb={40} style={{ fontFamily: '"Inter", sans-serif', opacity: 0.9, lineHeight: 1.6, maxWidth: 450, fontWeight: 500 }}>
                                            No te conformes con lo que ya existe. Únete a nuestro programa de diseño personalizado y da vida a la prenda exacta que siempre has imaginado, con el mejor servicio de impresión DTF en Valencia y calidad premium habitual de JOPPA.
                                        </Text>
                                        <Button
                                            component="a"
                                            href="/custom-design"
                                            size="xl"
                                            radius="xl"
                                            bg="#D4AF37"
                                            c="#FFFFFF"
                                            rightSection={<IconPalette size={20} />}
                                            style={{ 
                                                boxShadow: '0 8px 30px rgba(0,0,0,0.3)', 
                                                transition: 'transform 0.2s ease', 
                                                fontFamily: '"Montserrat", sans-serif', 
                                                fontWeight: 800,
                                                width: 'max-content',
                                                maxWidth: '100%'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            Inicia Tu Solicitud
                                        </Button>
                                    </Grid.Col>

                                    <Grid.Col span={{ base: 12, md: 7 }}>
                                        <Box h={{ base: 380, md: 500 }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                                            <style>{`
                                                @keyframes floating {
                                                    0% { transform: translateY(0px); }
                                                    50% { transform: translateY(-15px); }
                                                    100% { transform: translateY(0px); }
                                                }
                                                .float-box {
                                                    animation: floating 4s ease-in-out infinite;
                                                }
                                            `}</style>

                                            {/* Mosaic of Images */}
                                            <Box ml={{ base: 0, md: -60 }} h="100%" w="100%" style={{ position: 'relative' }}>
                                                {/* Image 1 - Large / Main */}
                                                <Box 
                                                    className="float-box"
                                                    w={{ base: '85%', md: '75%' }}
                                                    h="85%"
                                                    style={{ 
                                                        position: 'absolute', 
                                                        top: '5%', 
                                                        left: '0%', 
                                                        zIndex: 2,
                                                        transform: 'rotate(-2deg)',
                                                        animationDelay: '0s'
                                                    }}
                                                >
                                                    <Image 
                                                        src="/images/custom_design_section/Lista 2.png" 
                                                        alt="JOPPA Custom Design 1" 
                                                        fit="contain" 
                                                        h="100%" 
                                                    />
                                                </Box>

                                                {/* Image 2 - Top Secondary */}
                                                <Box 
                                                    className="float-box"
                                                    w={{ base: '60%', md: '55%' }}
                                                    h="60%"
                                                    style={{ 
                                                        position: 'absolute', 
                                                        top: '0%', 
                                                        right: '5%', 
                                                        zIndex: 1,
                                                        transform: 'rotate(5deg)',
                                                        animationDelay: '0.8s'
                                                    }}
                                                >
                                                    <Image 
                                                        src="/images/custom_design_section/Lista 4.png" 
                                                        alt="JOPPA Custom Design 2" 
                                                        fit="contain" 
                                                        h="100%" 
                                                    />
                                                </Box>

                                                {/* Image 3 - Bottom Secondary */}
                                                <Box 
                                                    className="float-box"
                                                    w={{ base: '55%', md: '50%' }}
                                                    h="55%"
                                                    style={{ 
                                                        position: 'absolute', 
                                                        bottom: '0%', 
                                                        right: '0%', 
                                                        zIndex: 3,
                                                        transform: 'rotate(-8deg)',
                                                        animationDelay: '1.5s'
                                                    }}
                                                >
                                                    <Image 
                                                        src="/images/custom_design_section/Lista 6.png" 
                                                        alt="JOPPA Custom Design 3" 
                                                        fit="contain" 
                                                        h="100%" 
                                                    />
                                                </Box>

                                                {/* Floating Sticker */}
                                                <div style={{ 
                                                    position: 'absolute', 
                                                    bottom: '10%', 
                                                    left: '-5%', 
                                                    background: '#F4F4E8', 
                                                    color: '#0B3022', 
                                                    padding: '8px 16px', 
                                                    borderRadius: '100px', 
                                                    fontWeight: 800, 
                                                    fontFamily: '"Montserrat", sans-serif', 
                                                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)', 
                                                    zIndex: 10,
                                                    transform: 'rotate(-12deg)',
                                                    fontSize: 'clamp(10px, 3vw, 14px)',
                                                    letterSpacing: '0.05em',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    HECHO A MEDIDA
                                                </div>
                                            </Box>
                                        </Box>
                                    </Grid.Col>
                                </Grid>
                            </Card>
                        </Box>

                        {/* WHOLESALE B2B BLOCK */}
                        <Box mt="2rem">
                            <Card
                                radius="32px"
                                p={{ base: 40, md: 60 }}
                                bg="#F9F9F4"
                                style={{ border: '2px solid #0B3022' }}
                            >
                                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                                    <Stack justify="center">
                                        <Badge color="#0B3022" variant="filled" size="lg" radius="xl">
                                            Venta al Mayor
                                        </Badge>
                                        <Title
                                            order={2}
                                            c="#0B3022"
                                            style={{
                                                fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
                                                fontFamily: '"Montserrat", sans-serif',
                                                fontWeight: 900,
                                                lineHeight: 1.2
                                            }}
                                        >
                                            ¿Tienes una tienda?<br />
                                            Lleva JOPPA a tus clientes.
                                        </Title>
                                        <Text size="lg" c="#0B3022" style={{ opacity: 0.8, fontWeight: 500 }}>
                                            Ofrecemos precios competitivos en estampados DTF al mayor y diseños exclusivos para que tu negocio destaque en Carabobo y toda Venezuela. Contáctanos por WhatsApp para recibir nuestro catálogo de mayoristas y comenzar a trabajar juntos.
                                        </Text>
                                        <Group>
                                            <Button
                                                component="a"
                                                href="https://wa.me/584222030200"
                                                target="_blank"
                                                size="xl"
                                                radius="xl"
                                                bg="#0B3022"
                                                leftSection={<IconBrandWhatsapp size={24} />}
                                                style={{ fontWeight: 800 }}
                                            >
                                                Contactar Ventas
                                            </Button>
                                        </Group>
                                    </Stack>
                                    <Center>
                                        <Box bg="#0B3022" p={40} style={{ borderRadius: '32px', width: '100%', maxWidth: 350 }}>
                                            <Stack align="center" gap="md">
                                                <IconTruck size={80} color="#D4AF37" stroke={1.5} />
                                                <Text ta="center" c="white" fw={800} style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', lineHeight: 1.2 }}>
                                                    Envío Nacional Garantizado
                                                </Text>
                                                <Text ta="center" c="white" style={{ opacity: 0.7 }}>
                                                    Llegamos a todo el país con logística premium.
                                                </Text>
                                            </Stack>
                                        </Box>
                                    </Center>
                                </SimpleGrid>
                            </Card>
                        </Box>

                        {/* JOPPA CREW COMMUNITY */}
                        <Box mt="2rem">
                            <JoppaCrew />
                        </Box>

                        {/* QUIENES SOMOS (FOUNDERS) SECTION */}
                        <Box mt="2rem">
                            <Card
                                radius="32px"
                                p={{ base: 40, md: 60 }}
                                bg="#F9F9F4"
                                shadow="sm"
                            >
                                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" style={{ alignItems: 'center' }}>
                                    <Box>
                                        <Badge color="#0B3022" variant="light" size="lg" radius="xl" mb="xl" bg="rgba(11, 48, 34, 0.05)">
                                            Nuestra Historia
                                        </Badge>
                                        <Title
                                            order={2}
                                            c="#0B3022"
                                            mb="xl"
                                            style={{
                                                fontSize: '2.5rem',
                                                fontFamily: '"Montserrat", sans-serif',
                                                fontWeight: 900,
                                                lineHeight: 1.1
                                            }}
                                        >
                                            Quiénes Somos
                                        </Title>
                                        <Text size="lg" c="#0B3022" style={{ opacity: 0.8, lineHeight: 1.7, maxWidth: 500 }}>
                                            Somos una pareja de emprendedores en Valencia apasionados por el diseño, la cultura urbana y la estampación digital. Lo que comenzó como un sueño compartido se convirtió en JOPPA, un espacio donde la impresión en DTF de alta precisión se encuentra con la creatividad sin límites.
                                            <br /><br />
                                            Cada prenda que diseñamos lleva una parte de nosotros, enfocándonos en la calidad premium y en piezas que cuentan una historia. ¡Gracias por ser parte de este viaje con nosotros!
                                        </Text>
                                        <Group mt="2rem">
                                            <IconHeart size={30} color="#D4AF37" fill="#D4AF37" />
                                            <Text fw={700} c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                                Hecho con pasión por JOPPA Team
                                            </Text>
                                        </Group>
                                    </Box>

                                    <Box>
                                        <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md">
                                            {/* Founder 1 */}
                                            <Card
                                                radius="24px"
                                                p={0}
                                                shadow="md"
                                                style={{
                                                    overflow: 'hidden',
                                                    aspectRatio: '4/5',
                                                    border: '1px solid rgba(11,48,34,0.1)',
                                                    transition: 'transform 0.3s ease'
                                                }}
                                                className="hover:scale-105"
                                            >
                                                <Image
                                                    src="/images/founders/founder_male.jpeg"
                                                    alt="Founder JOPPA"
                                                    fit="cover"
                                                    h="100%"
                                                />
                                                <Box style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem', background: 'linear-gradient(to top, rgba(11,48,34,0.8) 0%, transparent 100%)' }}>
                                                    <Text c="white" fw={800} size="sm" style={{ letterSpacing: '0.05em' }}>Jose Miguel</Text>
                                                </Box>
                                            </Card>

                                            {/* Founder 2 */}
                                            <Card
                                                radius="24px"
                                                p={0}
                                                shadow="md"
                                                style={{
                                                    overflow: 'hidden',
                                                    aspectRatio: '4/5',
                                                    border: '1px solid rgba(11,48,34,0.1)',
                                                    transition: 'transform 0.3s ease',
                                                    marginTop: rem(20) // Staggered look
                                                }}
                                                className="hover:scale-105"
                                            >
                                                <Image
                                                    src="/images/founders/founder_female.jpeg"
                                                    alt="Founder JOPPA"
                                                    fit="cover"
                                                    h="100%"
                                                />
                                                <Box style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem', background: 'linear-gradient(to top, rgba(11,48,34,0.8) 0%, transparent 100%)' }}>
                                                    <Text c="white" fw={800} size="sm" style={{ letterSpacing: '0.05em' }}>Patricia</Text>
                                                </Box>
                                            </Card>
                                        </SimpleGrid>
                                    </Box>
                                </SimpleGrid>
                            </Card>
                        </Box>

                        {/* CONTACT BENTO SECTION */}
                        <Box mt="2rem">
                            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
                                {/* WhatsApp Card */}
                                <Card
                                    radius="32px"
                                    p="xl"
                                    bg="#25D366"
                                    c="white"
                                    component="a"
                                    href="https://wa.me/584222030200"
                                    target="_blank"
                                    style={{ transition: 'transform 0.2s ease', cursor: 'pointer' }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <Stack h="100%" justify="space-between">
                                        <Group justify="space-between">
                                            <IconBrandWhatsapp size={40} />
                                            <IconMessageCircle2 size={24} style={{ opacity: 0.6 }} />
                                        </Group>
                                        <Box>
                                            <Title order={3} style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 800 }}>WhatsApp</Title>
                                            <Text fw={600} size="lg">+58 422 203 0200</Text>
                                        </Box>
                                    </Stack>
                                </Card>

                                {/* Instagram Card */}
                                <Card
                                    radius="32px"
                                    p="xl"
                                    bg="#000000"
                                    c="white"
                                    component="a"
                                    href="https://instagram.com/joppa.shop"
                                    target="_blank"
                                    style={{ transition: 'transform 0.2s ease', cursor: 'pointer' }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <Stack h="100%" justify="space-between">
                                        <Group justify="space-between">
                                            <IconBrandInstagram size={40} />
                                            <Box style={{ opacity: 0.6 }}>@joppa.shop</Box>
                                        </Group>
                                        <Box>
                                            <Title order={3} style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 800 }}>Instagram</Title>
                                            <Text fw={500}>Síguenos para novedades</Text>
                                        </Box>
                                    </Stack>
                                </Card>

                                {/* Email/Phone Card */}
                                <Card
                                    radius="32px"
                                    p="xl"
                                    bg="#D4AF37"
                                    c="white"
                                    component="a"
                                    href="mailto:atencion@joppa.shop"
                                    style={{ transition: 'transform 0.2s ease', cursor: 'pointer' }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <Stack h="100%" justify="space-between">
                                        <Group justify="space-between">
                                            <IconMail size={40} />
                                            <IconPhone size={24} style={{ opacity: 0.6 }} />
                                        </Group>
                                        <Box>
                                            <Title order={3} style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 800 }}>Email</Title>
                                            <Text fw={600}>atencion@joppa.shop</Text>
                                        </Box>
                                    </Stack>
                                </Card>
                            </SimpleGrid>
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
                                Nuestros servicios
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
        <FloatingWhatsApp />
        </>
    );
}
