// <ai_context>
// Propósito: React Component premium para la sección de Comunidad/Lifestyle (Joppa Crew).
// Responsividad: Grid adaptable (columna única en móviles, dual en escritorio).
// Dependencias: @mantine/core, @tabler/icons-react.
// </ai_context>

import React from 'react';
import { Box, Group, Text, Button, Image, Flex, Stack, SimpleGrid } from '@mantine/core';
import { IconBrandInstagram, IconArrowRight } from '@tabler/icons-react';

export default function JoppaCrew() {
    return (
        <Box
            bg="#F9F9F4"
            w="100%"
            style={{
                borderRadius: '32px',
                padding: '40px',
                boxShadow: '0 4px 40px rgba(0,0,0,0.02)'
            }}
        >
            <Flex
                direction={{ base: 'column', md: 'row' }}
                gap="40px"
                align="center"
                justify="space-between"
            >
                {/* Left Side: Content */}
                <Stack gap="xl" style={{ flex: 1, maxWidth: '500px' }}>
                    <Box>
                        <Text
                            size="sm"
                            fw={800}
                            c="#0B3022"
                            style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: '"Inter", sans-serif' }}
                        >
                            Comunidad
                        </Text>
                        <Text
                            mt="xs"
                            size="3.5rem"
                            fw={800}
                            c="#0B3022"
                            style={{
                                fontFamily: '"Montserrat", sans-serif',
                                lineHeight: 1.1,
                                letterSpacing: '-0.03em'
                            }}
                        >
                            Únete al equipo JOPPA
                        </Text>
                    </Box>

                    <Text size="lg" c="#4A4A4A" style={{ fontFamily: '"Inter", sans-serif', lineHeight: 1.6 }}>
                        Etiquétanos en tus fotos usando <strong>@joppa.shop</strong> para aparecer en nuestro feed principal y unirte a nuestra comunidad!
                    </Text>

                    <Button
                        size="xl"
                        radius="xl"
                        color="#0B3022"
                        c="#FFFFFF"
                        leftSection={<IconBrandInstagram size={20} />}
                        rightSection={<IconArrowRight size={20} />}
                        style={{
                            fontFamily: '"Montserrat", sans-serif',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            alignSelf: 'flex-start'
                        }}
                    >
                        joppa.shop
                    </Button>
                </Stack>

                {/* Right Side: Mosaic */}
                <Box style={{ flex: 1, width: '100%' }}>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                        <Box h={440} style={{ borderRadius: '24px', overflow: 'hidden' }}>
                            <Image
                                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"
                                alt="Joppa Crew Lifestyle 1"
                                h="100%"
                                fit="cover"
                            />
                        </Box>
                        <Stack gap="md">
                            <Box h={(440 - 16) / 2} style={{ borderRadius: '24px', overflow: 'hidden' }}>
                                <Image
                                    src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80"
                                    alt="Joppa Crew Lifestyle 2"
                                    h="100%"
                                    fit="cover"
                                />
                            </Box>
                            <Box h={(440 - 16) / 2} style={{ borderRadius: '24px', overflow: 'hidden' }}>
                                <Image
                                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80"
                                    alt="Joppa Crew Lifestyle 3"
                                    h="100%"
                                    fit="cover"
                                />
                            </Box>
                        </Stack>
                    </SimpleGrid>
                </Box>
            </Flex>
        </Box>
    );
}
