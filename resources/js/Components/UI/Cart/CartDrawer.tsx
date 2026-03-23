// <ai_context>
// Propósito: React Component premium para el Shopping Cart Drawer bajo estética 'Soft Minimalism' Bento Box.
// Responsividad: Drawer lateral derecho fluidizado (size="md"). Radios orgánicos de 32px, inner-cards de 24px.
// Dependencias: @mantine/core, @tabler/icons-react, Zustand store.
// </ai_context>

import React from 'react';
import { Drawer, Text, Group, Button, Stack, ActionIcon, Image, Box, Flex, ScrollArea } from '@mantine/core';
import { IconX, IconPlus, IconMinus, IconTrash } from '@tabler/icons-react';
import { useAppStore } from '../../../store/useAppStore';
import { router } from '@inertiajs/react';

export default function CartDrawer() {
    const { isCartDrawerOpen, toggleCartDrawer, cartItems, removeFromCart, updateQuantity } = useAppStore();

    const parsePrice = (priceStr: string) => {
        const num = parseFloat(priceStr.replace(/[^0-9.-]+/g, ""));
        return isNaN(num) ? 0 : num;
    };

    const subtotal = cartItems.reduce((sum: number, item: any) => sum + (parsePrice(item.price) * item.quantity), 0);

    return (
        <Drawer
            opened={isCartDrawerOpen}
            onClose={toggleCartDrawer}
            position="right"
            size="md"
            withCloseButton={false}
            overlayProps={{ backgroundOpacity: 0.2, blur: 4 }}
            styles={{
                content: { backgroundColor: '#F9F9F4', borderRadius: '32px 0 0 32px' },
                header: { display: 'none' },
                body: { padding: 0, height: '100%' } // Eliminamos padding nativo para control de overflow flex en Footer
            }}
            zIndex={2000000}
        >
            <Flex direction="column" h="100%">
                {/* Custom Header Soft Minimalist */}
                <Group justify="space-between" align="center" px="24px" pt="32px" pb="24px">
                    <Text fw={800} size="2.5rem" c="#0B3022" style={{ fontFamily: '\"Montserrat\", sans-serif', letterSpacing: '-0.05em', lineHeight: 1 }}>
                        Tu Bolsa
                    </Text>
                    <ActionIcon
                        onClick={toggleCartDrawer}
                        variant="subtle"
                        color="gray"
                        size="xl"
                        radius="xl"
                        style={{ backgroundColor: 'transparent' }}
                        className="joppa-drawer-close"
                    >
                        <IconX stroke={1.5} color="#000000" size={24} />
                    </ActionIcon>
                </Group>

                <style>
                    {`
                        .joppa-drawer-close:hover {
                            background-color: #E8E8E0 !important;
                        }
                    `}
                </style>

                {/* Main Content Area */}
                <ScrollArea style={{ flex: 1 }} type="scroll" px="24px">
                    {cartItems.length === 0 ? (
                        <Flex direction="column" align="center" justify="center" h="100%" mt="4rem">
                            <Text c="dimmed" size="lg" style={{ fontFamily: '\"Montserrat\", sans-serif', textAlign: 'center' }}>
                                Tu bolsa está vacía.
                            </Text>
                            <Button
                                mt="xl"
                                radius="xl"
                                variant="outline"
                                color="#0B3022"
                                onClick={toggleCartDrawer}
                                style={{ fontWeight: 600, fontFamily: '\"Montserrat\", sans-serif', borderWidth: '2px' }}
                            >
                                Seguir Comprando
                            </Button>
                        </Flex>
                    ) : (
                        <Stack gap="md" pb="2rem">
                            {cartItems.map((item: any) => (
                                <Box
                                    key={item.id}
                                    bg="#FFFFFF"
                                    style={{
                                        borderRadius: '24px',
                                        padding: '16px'
                                    }}
                                >
                                    <Group wrap="nowrap" align="flex-start">
                                        {/* Miniatura suave */}
                                        <Box w={84} h={104} style={{ borderRadius: '16px', overflow: 'hidden', backgroundColor: '#F4F4E8', flexShrink: 0 }}>
                                            <Image src={item.image} alt={item.name} height={104} fit="cover" style={{ mixBlendMode: 'darken' }} />
                                        </Box>

                                        <Flex direction="column" justify="space-between" style={{ flexGrow: 1 }} h={104}>
                                            <Box>
                                                <Group justify="space-between" wrap="nowrap" align="flex-start">
                                                    <Box>
                                                        <Text size="10px" fw={800} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }} mb={2}>
                                                            {item.brand || 'JOPPA'}
                                                        </Text>
                                                        <Text fw={700} size="md" c="#000000" style={{ fontFamily: '\"Montserrat\", sans-serif', lineHeight: 1.1 }}>
                                                            {item.name}
                                                        </Text>
                                                        {(item.color || item.size) && (
                                                            <Text size="11px" fw={600} c="dimmed" mt={6} style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: '"Montserrat", sans-serif' }}>
                                                                {item.color && `Color: ${item.color}`} {item.color && item.size && '•'} {item.size && `Size: ${item.size}`}
                                                            </Text>
                                                        )}
                                                    </Box>
                                                    <ActionIcon onClick={() => removeFromCart(item.id)} variant="transparent" size="sm">
                                                        <IconTrash size={18} stroke={1.5} color="#A0A0A0" />
                                                    </ActionIcon>
                                                </Group>
                                                <Text size="sm" fw={800} c="#000000" mt={4}>{item.price}</Text>
                                            </Box>

                                            {/* Incrementor Soft (Pill) */}
                                            <Group justify="space-between" align="center" mt="auto">
                                                <Group
                                                    gap={0}
                                                    bg="#FFFFFF"
                                                    style={{
                                                        borderRadius: '32px',
                                                        padding: '4px 8px',
                                                        minHeight: '36px'
                                                    }}
                                                >
                                                    <ActionIcon size="sm" variant="transparent" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                        <IconMinus size={14} color="#000000" stroke={2} />
                                                    </ActionIcon>
                                                    <Text size="sm" fw={700} w={24} ta="center" c="#000000" style={{ fontFamily: '\"Montserrat\", sans-serif' }}>
                                                        {item.quantity}
                                                    </Text>
                                                    <ActionIcon size="sm" variant="transparent" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                        <IconPlus size={14} color="#000000" stroke={2} />
                                                    </ActionIcon>
                                                </Group>
                                                <Text fw={800} size="md" c="#000000" style={{ fontFamily: '\"Montserrat\", sans-serif' }}>
                                                    ${(parsePrice(item.price) * item.quantity).toFixed(2)}
                                                </Text>
                                            </Group>
                                        </Flex>
                                    </Group>
                                </Box>
                            ))}
                        </Stack>
                    )}
                </ScrollArea>

                {/* Footer fixed con Subtotal */}
                {cartItems.length > 0 && (
                    <Box
                        px="24px"
                        py="32px"
                        bg="#F9F9F4"
                        style={{
                            boxShadow: '0 -10px 40px rgba(0,0,0,0.06)',
                            zIndex: 10
                        }}
                    >
                        <Group justify="space-between" mb="lg">
                            <Text fw={600} size="lg" c="dimmed" style={{ fontFamily: '\"Montserrat\", sans-serif' }}>Subtotal</Text>
                            <Text fw={800} size="24px" c="#000000" style={{ fontFamily: '\"Montserrat\", sans-serif', letterSpacing: '-0.02em' }}>
                                ${subtotal.toFixed(2)}
                            </Text>
                        </Group>
                        <Button
                            fullWidth
                            size="xl"
                            radius="xl"
                            color="#0B3022"
                            c="#FFFFFF"
                            h={60}
                            style={{
                                fontWeight: 800,
                                fontSize: '1.1rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                fontFamily: '\"Montserrat\", sans-serif'
                            }}
                        onClick={() => {
                            toggleCartDrawer();
                            router.visit('/checkout');
                        }}
                        >
                            Checkout
                        </Button>
                    </Box>
                )}
            </Flex>
        </Drawer>
    );
}
