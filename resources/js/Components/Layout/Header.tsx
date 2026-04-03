// <ai_context>
// Propósito: Organismo de navegación (Header) bajo estética 'Bento Box Soft Minimalism'.
// Responsividad: Header flotante sutil con blur, Drawer orgánico, fondos coordinados (#F4F4F6).
// Dependencias: @mantine/core, @tabler/icons-react. Sin Tailwind.
// </ai_context>

import React from 'react';
import { AppShell, Group, Burger, UnstyledButton, Drawer, Stack, Indicator, Image, Anchor, Box, ActionIcon } from '@mantine/core';
import { IconSearch, IconUser, IconShoppingCart } from '@tabler/icons-react';
import { useAppStore } from '../../store/useAppStore';

export interface HeaderProps {
    opened: boolean;
    toggle: () => void;
}

const NAVIGATION_LINKS = [
    { label: 'Shop', href: '/catalog' },
    { label: 'Crea tu diseño', href: '/custom-design' },
    { label: 'Novedades', href: '/catalog' },
    { label: 'Contacto', href: '/contact' },
];

export const Header: React.FC<HeaderProps> = ({ opened, toggle }) => {
    const { cartItems, toggleCartDrawer } = useAppStore();
    const totalItems = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);

    return (
        <>
            <AppShell.Header
                h={100}
                bg="rgba(244, 244, 232, 0.8)"
                withBorder={false}
                zIndex={1000}
                style={{
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)'
                }}
            >
                {/* --- MOBILE LAYOUT --- */}
                <Group h="100%" px="xl" justify="space-between" align="center" wrap="nowrap" hiddenFrom="md" w="100%">
                    <Group justify="space-between" w="100%" align="center">
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            size="sm"
                            color="#000000"
                            aria-label="Toggle navigation mobile"
                        />

                        <Box style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                            <Anchor href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                                <Image src="/logo.png" alt="JOPPA Logo" h={40} w="auto" />
                            </Anchor>
                        </Box>

                        <Group gap="sm">
                            <ActionIcon radius="xl" variant="subtle" color="dark" size="lg" aria-label="Search">
                                <IconSearch color="#000000" size={20} stroke={1.5} />
                            </ActionIcon>

                            <ActionIcon radius="xl" variant="subtle" color="dark" size="lg" aria-label="Cart" style={{ position: 'relative' }} onClick={toggleCartDrawer}>
                                <Indicator
                                    color="#0B3022"
                                    size={totalItems > 0 ? 18 : 12}
                                    offset={4}
                                    withBorder
                                    label={totalItems > 0 ? totalItems : undefined}
                                    styles={{ indicator: { fontWeight: 800, fontSize: '10px' } }}
                                >
                                    <IconShoppingCart color="#000000" size={20} stroke={1.5} />
                                </Indicator>
                            </ActionIcon>
                        </Group>
                    </Group>
                </Group>

                {/* --- DESKTOP LAYOUT --- */}
                <Group h="100%" px="xl" justify="space-between" align="center" wrap="nowrap" visibleFrom="md" w="100%">
                    <Anchor href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <Image src="/logo.png" alt="JOPPA Logo" h={40} w="auto" />
                    </Anchor>

                    <Group gap="2.5rem" align="center">
                        <style>
                            {`
                                .soft-nav-link {
                                    color: #4A4A4A;
                                    transition: color 0.2s ease;
                                    text-decoration: none;
                                }
                                .soft-nav-link:hover {
                                    color: #0B3022;
                                }
                            `}
                        </style>
                        {NAVIGATION_LINKS.map((link) => (
                            <Anchor
                                key={link.label}
                                href={link.href}
                                className="soft-nav-link"
                                underline="never"
                                style={{
                                    fontWeight: 600,
                                    fontSize: '16px',
                                    textTransform: 'capitalize',
                                    fontFamily: '"Montserrat", sans-serif',
                                    color: '#4A4A4A',
                                }}
                            >
                                {link.label}
                            </Anchor>
                        ))}
                    </Group>

                    <Group gap="lg" wrap="nowrap" align="center">
                        <UnstyledButton aria-label="Search">
                            <IconSearch color="#000000" size={20} stroke={1.5} />
                        </UnstyledButton>

                        <UnstyledButton aria-label="Cart" style={{ position: 'relative' }} onClick={toggleCartDrawer}>
                            <Indicator
                                color="#0B3022"
                                size={totalItems > 0 ? 18 : 12}
                                offset={4}
                                withBorder
                                label={totalItems > 0 ? totalItems : undefined}
                                styles={{ indicator: { fontWeight: 800, fontSize: '10px' } }}
                            >
                                <IconShoppingCart color="#000000" size={20} stroke={1.5} />
                            </Indicator>
                        </UnstyledButton>
                    </Group>
                </Group>
            </AppShell.Header>

            {/* Menú de Navegación Lateral Soft (Mobile) */}
            <Drawer
                opened={opened}
                onClose={toggle}
                size="100%"
                padding="xl"
                hiddenFrom="md"
                title={
                    <Anchor href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <Image src="/logo.png" alt="JOPPA Logo" h={40} w="auto" />
                    </Anchor>
                }
                zIndex={1000000}
                styles={{
                    content: { backgroundColor: '#F4F4E8' },
                    header: { backgroundColor: '#F4F4E8', borderBottom: 'none', paddingBottom: '24px', paddingTop: '24px' },
                    close: { color: '#000000' }
                }}
            >
                <Stack mt="4rem" gap="2rem">
                    {NAVIGATION_LINKS.map((link) => (
                        <Anchor
                            key={`mobile-${link.label}`}
                            href={link.href}
                            underline="never"
                            onClick={toggle}
                            display="block"
                            c="#000000"
                            style={{ fontWeight: 500, fontSize: '2rem', textTransform: 'capitalize', fontFamily: '"Montserrat", sans-serif' }}
                        >
                            {link.label}
                        </Anchor>
                    ))}
                </Stack>
            </Drawer>
        </>
    );
};
