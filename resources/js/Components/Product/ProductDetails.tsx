// <ai_context>
// Propósito: React Component Organism para la lógica de compra (Add to Cart, Tallas, Colores) en PDP.
// Responsividad: Grid interno fluido, modal centrada para móviles y desktop.
// Dependencias: @mantine/core, @tabler/icons-react.
// </ai_context>

import React, { useState } from 'react';
import { Box, Text, Group, Stack, Button, ActionIcon, Modal, Accordion } from '@mantine/core';
import { IconLeaf, IconRulerMeasure, IconCheck, IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

export default function ProductDetails() {
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>('Bone');

    const sizes = ['S', 'M', 'L', 'XL'];
    const colors = [
        { name: 'Bone', hex: '#FDFDD0' },
        { name: 'Deep Sea', hex: '#002B49' },
        { name: 'Forest', hex: '#0B3022' }
    ];

    return (
        <Box>
            <Stack gap="xl">
                <Box>
                    <Stack gap="xs" align="flex-start">
                        <Text size="sm" fw={800} c="dimmed" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            JOPPA MAINLINE
                        </Text>
                        <Text size="3rem" fw={400} c="#000000" style={{ fontFamily: '\"Montserrat\", sans-serif', lineHeight: 1.1, letterSpacing: '0.05em' }}>
                            Heavyweight Hoodie
                        </Text>
                        <Text size="1.5rem" fw={400} c="#000000" style={{ fontFamily: '\"Montserrat\", sans-serif', letterSpacing: '0.05em', marginTop: '0.5rem' }}>
                            USD $125.00
                        </Text>
                    </Stack>
                </Box>

                <Accordion 
                    variant="separated" 
                    disableChevronRotation 
                    chevron={<IconPlus size={16} />}
                    styles={{
                        item: {
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid rgba(0,0,0,0.1)',
                            borderRadius: 0,
                            padding: 0,
                        },
                        control: {
                            paddingLeft: 0,
                            paddingRight: 0,
                            paddingTop: '1rem',
                            paddingBottom: '1rem',
                            backgroundColor: 'transparent',
                        },
                        label: {
                            fontFamily: '"Montserrat", sans-serif',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                        },
                        content: {
                            paddingLeft: 0,
                            paddingRight: 0,
                            paddingBottom: '1.5rem',
                            fontFamily: '"Inter", sans-serif',
                            color: '#4A4A4A',
                            lineHeight: 1.6,
                            backgroundColor: 'transparent',
                        }
                    }}
                >
                    <Accordion.Item value="info">
                        <Accordion.Control>Product Information</Accordion.Control>
                        <Accordion.Panel>
                            Diseñado en Europa. Este hoodie de peso pesado superior (500 GSM) ofrece una caída estructurada y una sensación premium indescriptible. Tintes naturales y pre-lavado para evitar encogimiento.
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value="sustainability">
                        <Accordion.Control>Ingredients</Accordion.Control>
                        <Accordion.Panel>
                            100% Algodón Orgánico GOTS.
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value="how-to">
                        <Accordion.Control>How to Use</Accordion.Control>
                        <Accordion.Panel>
                            Lavar a máquina en frío con colores similares. No usar blanqueador. Secar en secadora a baja temperatura o secar al aire para preservar el tejido.
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>

                <Box mt="md">
                    <Text fw={700} size="sm" mb="sm" style={{ fontFamily: '\"Montserrat\", sans-serif' }}>
                        COLOR: <Text span c="dimmed" fw={600} style={{ textTransform: 'uppercase' }}>{selectedColor}</Text>
                    </Text>
                    <Group gap="sm">
                        {colors.map(color => (
                            <ActionIcon
                                key={color.name}
                                size="xl"
                                radius="xl"
                                onClick={() => setSelectedColor(color.name)}
                                style={{
                                    backgroundColor: color.hex,
                                    border: selectedColor === color.name ? '3px solid #0B3022' : '1px solid #E8E8E0',
                                    boxShadow: selectedColor === color.name ? '0 0 0 2px #F9F9F4 inset' : 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {selectedColor === color.name && color.name !== 'Bone' && <IconCheck size={16} color="#FFFFFF" />}
                                {selectedColor === color.name && color.name === 'Bone' && <IconCheck size={16} color="#0B3022" />}
                            </ActionIcon>
                        ))}
                    </Group>
                </Box>

                <Box>
                    <Group justify="space-between" mb="sm">
                        <Text fw={700} size="sm" style={{ fontFamily: '\"Montserrat\", sans-serif' }}>
                            TALLA
                        </Text>
                        <Button variant="transparent" p={0} size="sm" c="dimmed" onClick={open} leftSection={<IconRulerMeasure size={16}/>} style={{ fontFamily: '\"Inter\", sans-serif' }}>
                            Guía de Tallas
                        </Button>
                    </Group>
                    <Group gap="sm">
                        {sizes.map(size => (
                            <Button
                                key={size}
                                variant={selectedSize === size ? "filled" : "outline"}
                                color="#0B3022"
                                radius="xl"
                                size="md"
                                onClick={() => setSelectedSize(size)}
                                style={{
                                    flex: 1,
                                    fontFamily: '\"Inter\", sans-serif',
                                    fontWeight: 700,
                                    borderWidth: '2px',
                                    backgroundColor: selectedSize === size ? '#0B3022' : 'transparent',
                                    color: selectedSize === size ? '#FFFFFF' : '#0B3022',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {size}
                            </Button>
                        ))}
                    </Group>
                </Box>

                <Button
                    fullWidth
                    size="xl"
                    radius="xl"
                    color="#0B3022"
                    mt="xl"
                    h={64}
                    style={{
                        fontFamily: '\"Montserrat\", sans-serif',
                        fontWeight: 800,
                        fontSize: '1.2rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        transition: 'transform 0.1s ease',
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Añadir a la Bolsa
                </Button>
            </Stack>

            <Modal opened={opened} onClose={close} title={<Text fw={800} size="xl" style={{ fontFamily: '\"Montserrat\", sans-serif' }}>Guía de Tallas</Text>} centered radius="24px" styles={{ content: { backgroundColor: '#F4F4E8' }, header: { backgroundColor: '#F4F4E8' } }}>
                <Text size="sm" c="dimmed" mb="xl" style={{ fontFamily: '\"Inter\", sans-serif' }}>Medidas en centímetros. Corte Boxy oversize intencional de la marca.</Text>
                <Stack gap="sm">
                    {['S', 'M', 'L', 'XL'].map((s, idx) => (
                        <Box key={s} p="md" bg="rgba(0,0,0,0.03)" style={{ borderRadius: '16px' }}>
                            <Group justify="space-between">
                                <Text fw={800} size="lg" style={{ fontFamily: '\"Montserrat\", sans-serif' }}>{s}</Text>
                                <Text fw={500} style={{ fontFamily: '\"Inter\", sans-serif' }}>
                                    Pecho {58 + (idx * 3)}cm &bull; Largo {68 + (idx * 2)}cm
                                </Text>
                            </Group>
                        </Box>
                    ))}
                </Stack>
            </Modal>
        </Box>
    );
}
