// <ai_context>
// Propósito: Hero Organism rediseñado bajo estética 'Bento Box Soft Minimalism'.
// Responsividad: Grid base=1, md=2. Elementos redondeados masivos tipo App, padding holgado, fondo gris suave continuo.
// Dependencias: @mantine/core. Uso estricto de Mantine Props. Radio global de tarjetas a 32px. Sin Tailwind.
// </ai_context>

import React from 'react';
import { Link } from '@inertiajs/react';
import { SimpleGrid, Box, Title, Text, Button, Flex, rem, Group, ActionIcon, Avatar } from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons-react';

export default function HeroProduct() {
    return (
        <Box
            w="100%"
            bg="transparent"
            pt={0}
            pb={rem(40)}
        >
            <SimpleGrid
                cols={{ base: 1, md: 2 }}
                spacing="lg"
                p="lg"
                style={{
                    minHeight: 'calc(100vh - 120px)',  // Restamos header y offset padding
                    margin: 0
                }}
            >
                {/* --- Left Bento Card (Texto, CTA) --- */}
                <Flex
                    direction="column"
                    justify={{ base: 'center', md: 'space-between' }}
                    bg="#F9F9F4"
                    p={{ base: '32px', md: '60px' }}
                    gap={{ base: 'lg', md: 'xl' }}
                    style={{
                        borderRadius: '32px',
                        minHeight: '100%'
                    }}
                >
                    <Box>
                        <Title
                            c="#0B3022"
                            style={{
                                fontSize: 'clamp(3rem, 10vw, 5rem)',
                                fontWeight: 700,
                                lineHeight: 1, // Reduced line height
                                fontFamily: '\"Montserrat\", sans-serif',
                                letterSpacing: '-0.02em'
                            }}
                        >
                            Tu idea, nuestra tinta
                        </Title>
                        <Text
                            c="#4A4A4A"
                            mt="xl"
                            style={{
                                fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                                fontWeight: 400,
                                fontFamily: '\"Montserrat\", sans-serif',
                                lineHeight: 1.6,
                                maxWidth: '90%'
                            }}
                        >
                            Diseños con alma vintage y la resistencia del estampado premium. Creamos piezas que no solo visten, sino que cuentan tu historia. Frescura urbana en cada fibra.
                        </Text>
                    </Box>

                    <Box mt={{ base: 0, md: 'auto' }} mb={{ base: 0, md: 'auto' }}>
                        <Group gap="sm">
                            <Button
                                component={Link}
                                href="/catalog"
                                h={64}
                                radius="xl"
                                color="#0B3022"
                                c="#FFFFFF"
                                style={{
                                    padding: '0 40px',
                                    width: 'fit-content',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    fontFamily: '\"Montserrat\", sans-serif',
                                    letterSpacing: '0.02em'
                                }}
                            >
                                Comprar ahora
                            </Button>
                        </Group>
                    </Box>

                    {/* Trust Block */}
                    <Box mt={{ base: 'xl', md: 0 }}>
                        <Group gap="xl">
                            <Box>
                                <Text size="md" c="#000000" style={{ fontWeight: 700, fontFamily: '\"Montserrat\", sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                    Hecho en Valencia
                                </Text>
                            </Box>
                        </Group>
                    </Box>
                </Flex>

                {/* --- Right Bento Card (Imagen Fotográfica) --- */}
                <Box
                    component={Link}
                    href="/catalog"
                    style={{
                        display: 'block',
                        borderRadius: '32px',
                        overflow: 'hidden',
                        height: '100%',
                        minHeight: '500px',
                        width: '100%',
                        position: 'relative',
                        backgroundColor: 'transparent'
                    }}
                >
                    <Box
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: 'url("/portada_dario_gemini.png")', // Portada de la tienda
                            backgroundPosition: 'center center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />
                </Box>
            </SimpleGrid>
        </Box>
    );
}
