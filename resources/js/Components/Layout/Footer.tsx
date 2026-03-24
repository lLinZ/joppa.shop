// <ai_context>
// Propósito: React Component premium para el Footer global de la aplicación.
// Responsividad: Grid adaptable (columna única en móviles, dual en escritorio). Full bleed styling emulation.
// Dependencias: @mantine/core, @tabler/icons-react.
// </ai_context>

import React from 'react';
import { Box, Container, Flex, Stack, Text, Anchor, Group, ActionIcon, TextInput } from '@mantine/core';
import { IconBrandInstagram, IconBrandTiktok, IconBrandTwitter, IconArrowRight } from '@tabler/icons-react';

export default function Footer() {
    return (
        <Box
            bg="#0B3022"
            pt={80}
            pb={80}
            style={{
                borderRadius: '32px 32px 0 0',
                color: '#F5F5DC',
                fontFamily: '"Inter", sans-serif'
            }}
        >
            <Container size="xl">
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    justify="space-between"
                    gap={{ base: 60, md: 40 }}
                    mb={60}
                >
                    {/* Brand & Newsletter */}
                    <Stack gap="xl" style={{ maxWidth: '400px' }}>
                        <Text
                            size="2.5rem"
                            fw={900}
                            style={{
                                fontFamily: '"Montserrat", sans-serif',
                                letterSpacing: '-0.05em',
                                lineHeight: 1,
                                color: '#F5F5DC'
                            }}
                        >
                            JOPPA
                        </Text>
                        <Text size="sm" style={{ opacity: 0.8, lineHeight: 1.6 }}>
                            Elevando los estándares del streetwear con estética minimalista, DTF de calidad y telas increibles.
                        </Text>

                        <Box mt="md">
                            <Text fw={700} mb="xs" style={{ fontFamily: '"Montserrat", sans-serif', color: '#F5F5DC' }}>
                                Únete a nuestro newsletter
                            </Text>
                            <Flex
                                bg="rgba(245, 245, 220, 0.1)"
                                p="6px"
                                style={{ borderRadius: '100px' }}
                            >
                                <TextInput
                                    placeholder="Tu correo electrónico"
                                    variant="unstyled"
                                    size="md"
                                    style={{ flex: 1, paddingLeft: '16px' }}
                                    styles={{
                                        input: { color: '#F5F5DC' }
                                    }}
                                />
                                <ActionIcon
                                    size="lg"
                                    radius="xl"
                                    bg="#D4A017"
                                    c="#0B3022"
                                    style={{ minWidth: '40px', minHeight: '40px' }}
                                >
                                    <IconArrowRight size={20} stroke={2} />
                                </ActionIcon>
                            </Flex>
                        </Box>
                    </Stack>

                    {/* Links Shop */}
                    <Stack gap="sm">
                        <Text fw={700} size="lg" mb="sm" style={{ fontFamily: '"Montserrat", sans-serif', color: '#F5F5DC' }}>
                            Links
                        </Text>
                        <Anchor href="/catalog" c="#F5F5DC" style={{ opacity: 0.7 }} underline="never">Catálogo</Anchor>
                        <Anchor href="/custom-design" c="#F5F5DC" style={{ opacity: 0.7 }} underline="never">Crea tu Diseño</Anchor>
                        <Anchor href="mailto:atencion@joppa.shop" c="#F5F5DC" style={{ opacity: 0.7 }} underline="never">Contáctanos</Anchor>
                    </Stack>
                </Flex>

                {/* Bottom Bar */}
                <Flex
                    direction={{ base: 'column', sm: 'row' }}
                    justify="space-between"
                    align="center"
                    gap="md"
                    pt="xl"
                    style={{ borderTop: '1px solid rgba(245, 245, 220, 0.1)' }}
                >
                    <Text size="sm" style={{ opacity: 0.6 }}>
                        © {new Date().getFullYear()} JOPPA Studio. 2026.
                    </Text>
                    <Group gap="md">
                        <ActionIcon variant="transparent" c="#F5F5DC" size="lg" style={{ opacity: 0.8 }} component="a" href="https://instagram.com/joppa.shop" target="_blank" rel="noopener">
                            <IconBrandInstagram size={24} />
                        </ActionIcon>
                        <ActionIcon variant="transparent" c="#F5F5DC" size="lg" style={{ opacity: 0.8 }} component="a" href="https://tiktok.com/joppa.shop" target="_blank" rel="noopener">
                            <IconBrandTiktok size={24} />
                        </ActionIcon>
                    </Group>
                </Flex>
            </Container>
        </Box>
    );
}
