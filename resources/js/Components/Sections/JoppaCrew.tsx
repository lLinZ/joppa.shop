// <ai_context>
// Propósito: React Component premium para la sección de Comunidad/Lifestyle (Joppa Crew).
// Responsividad: Grid adaptable (columna única en móviles, dual en escritorio).
// Dependencias: @mantine/core, @tabler/icons-react.
// </ai_context>

import React from 'react';
import { Box, Group, Text, Button, Image, Stack, SimpleGrid, Card, Badge, Title } from '@mantine/core';
import { IconBrandInstagram, IconArrowRight } from '@tabler/icons-react';

export default function JoppaCrew() {
    return (
        <Box w="100%">
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
                {/* CARD 1: CONTENT */}
                <Card 
                    bg="#0B3022" 
                    radius="32px" 
                    p={{ base: 40, lg: 60 }} 
                    shadow="xl"
                    style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'center',
                        border: '1px solid rgba(212, 175, 55, 0.2)'
                    }}
                >
                    <Box>
                        <Badge color="#D4AF37" variant="outline" size="lg" radius="xl" mb="md" style={{ letterSpacing: '0.1em', fontWeight: 800 }}>
                            COMUNIDAD
                        </Badge>
                        <Title
                            order={2}
                            c="white"
                            style={{
                                fontSize: 'clamp(1.5rem, 5vw, 3rem)',
                                fontFamily: '"Montserrat", sans-serif',
                                fontWeight: 900,
                                lineHeight: 1.1,
                                letterSpacing: '-0.03em'
                            }}
                        >
                            Únete al equipo <span style={{ color: '#D4AF37' }}>JOPPA</span>
                        </Title>
                    </Box>

                    <Text size="lg" mt="xl" c="rgba(255,255,255,0.7)" style={{ fontFamily: '"Inter", sans-serif', lineHeight: 1.6, fontWeight: 500 }}>
                        Etiquétanos en tus fotos usando <strong style={{ color: 'white' }}>@joppa.shop</strong> para aparecer en nuestro feed y unirte a nuestra comunidad exclusiva.
                    </Text>

                    <Button
                        mt="2.5rem"
                        size="xl"
                        radius="xl"
                        bg="#D4AF37"
                        c="#0B3022"
                        component="a"
                        href="https://instagram.com/joppa.shop"
                        target="_blank"
                        leftSection={<IconBrandInstagram size={24} />}
                        rightSection={<IconArrowRight size={20} />}
                        style={{
                            fontFamily: '"Montserrat", sans-serif',
                            fontWeight: 800,
                            letterSpacing: '0.05em',
                            alignSelf: 'flex-start',
                            height: 64,
                            boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
                        }}
                    >
                        JOPPA.SHOP
                    </Button>
                </Card>

                {/* CARD 2: MAIN IMAGE */}
                <Card 
                    radius="32px" 
                    p={0} 
                    shadow="lg" 
                    style={{ overflow: 'hidden' }}
                >
                    <Image
                        src="/images/crew/joppa.crew1.jpeg"
                        alt="Joppa Crew Lifestyle 1"
                        h="100%"
                        fit="cover"
                        style={{ transition: 'transform 0.5s ease' }}
                        className="hover:scale-110"
                    />
                </Card>

                {/* CARD 3: STACKED IMAGES */}
                <Stack gap="lg">
                    <Card 
                        radius="32px" 
                        p={0} 
                        shadow="md" 
                        style={{ overflow: 'hidden', flex: 1 }}
                    >
                        <Image
                            src="/images/crew/joppa.crew2.jpeg"
                            alt="Joppa Crew Lifestyle 2"
                            h="100%"
                            fit="cover"
                            style={{ transition: 'transform 0.5s ease' }}
                            className="hover:scale-110"
                        />
                    </Card>
                    <Card 
                        radius="32px" 
                        p={0} 
                        shadow="md" 
                        style={{ overflow: 'hidden', flex: 1 }}
                    >
                        <Image
                            src="/images/crew/joppa.crew3.jpeg"
                            alt="Joppa Crew Lifestyle 3"
                            h="100%"
                            fit="cover"
                            style={{ transition: 'transform 0.5s ease' }}
                            className="hover:scale-110"
                        />
                    </Card>
                </Stack>
            </SimpleGrid>
        </Box>
    );
}
