import React, { useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import {
    AppShell, Box, Group, TextInput, Text, Title, SimpleGrid, Card, Image, Badge,
    Skeleton, Stack, Center, Button, rem, ScrollArea
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconShoppingBag, IconFilterOff } from '@tabler/icons-react';
import { Header } from '../../Components/Layout/Header';
import CartDrawer from '../../Components/UI/Cart/CartDrawer';
import Footer from '../../Components/Layout/Footer';

const CRM_BASE = (import.meta.env.VITE_CRM_API_URL as string) || 'http://localhost:8000/api';

interface Collection {
    id: number;
    name: string;
    slug: string;
    products_count: number;
}

interface Product {
    id: number;
    name: string;
    slug?: string;
    price: string | number;
    images: string[] | null;
    description: string | null;
    style: string | null;
    collections: { id: number; name: string; slug: string }[];
}

function ProductCard({ product }: { product: Product }) {
    const thumb = product.images?.[0] ?? null;
    return (
        <Card
            radius="xl"
            p={0}
            style={{ overflow: 'hidden', cursor: 'pointer', backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            onClick={() => window.location.href = `/catalog/${product.slug || product.id}`}
        >
            <Box style={{ aspectRatio: '3/4', backgroundColor: '#F0EFE6', position: 'relative', overflow: 'hidden' }}>
                {thumb ? (
                    <Image src={thumb} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <Center style={{ width: '100%', height: '100%' }}>
                        <IconShoppingBag size={48} color="#C8C7BC" stroke={1} />
                    </Center>
                )}
                {product.collections?.length > 0 && (
                    <Box style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {product.collections.slice(0, 2).map(c => (
                            <Badge key={c.id} size="xs" radius="xl" style={{ backgroundColor: 'rgba(11,48,34,0.75)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', backdropFilter: 'blur(4px)' }}>
                                {c.name}
                            </Badge>
                        ))}
                    </Box>
                )}
            </Box>
            <Box p="md">
                <Text fw={700} size="sm" c="#0B1B0E" lineClamp={1} style={{ fontFamily: '"Montserrat", sans-serif' }}>{product.name}</Text>
                {product.style && <Text size="xs" c="dimmed" mt={2}>{product.style}</Text>}
                <Text fw={800} size="md" c="#0B3022" mt="xs" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                    ${Number(product.price).toLocaleString('es-AR')}
                </Text>
            </Box>
        </Card>
    );
}

export default function CatalogIndex() {
    const [opened, { toggle }] = useDisclosure(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(`${CRM_BASE}/catalog`).then(r => r.json()).catch(() => ({ products: [] })),
            fetch(`${CRM_BASE}/catalog/collections`).then(r => r.json()).catch(() => ({ collections: [] })),
        ]).then(([prodData, colData]) => {
            setProducts(prodData.products ?? []);
            setCollections(colData.collections ?? []);
            setLoading(false);
        });
    }, []);

    const filtered = useMemo(() => {
        let list = products;
        if (selectedCollection) list = list.filter(p => p.collections?.some(c => c.slug === selectedCollection));
        if (search.trim()) { const q = search.toLowerCase(); list = list.filter(p => p.name.toLowerCase().includes(q)); }
        return list;
    }, [products, selectedCollection, search]);

    const hasFilters = !!search || !!selectedCollection;

    const chipStyle = (active: boolean) => ({
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 18px',
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        fontFamily: '"Montserrat", sans-serif',
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap' as const,
        border: active ? '1.5px solid #0B3022' : '1.5px solid rgba(0,0,0,0.12)',
        backgroundColor: active ? '#0B3022' : '#FFFFFF',
        color: active ? '#FFFFFF' : '#4A4A4A',
        userSelect: 'none' as const,
    });

    return (
        <AppShell header={{ height: 100, collapsed: false, offset: true }} className="page-transition">
            <Head title="Catálogo — JOPPA" />
            <CartDrawer />
            <Header opened={opened} toggle={toggle} />

            <AppShell.Main bg="#F4F4E8" pt={rem(120)}>
                <Box px={{ base: 'md', md: 'xl' }} pb={rem(80)}>

                    {/* Header */}
                    <Group justify="space-between" align="flex-end" mb="xl" wrap="wrap" gap="md">
                        <Stack gap={4}>
                            <Title order={1} c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif', letterSpacing: '-0.03em', fontWeight: 800 }}>
                                Catálogo
                            </Title>
                            <Text c="dimmed" size="sm">
                                {loading ? 'Cargando...' : `${filtered.length} producto${filtered.length !== 1 ? 's' : ''} disponible${filtered.length !== 1 ? 's' : ''}`}
                            </Text>
                        </Stack>
                        <TextInput
                            placeholder="Buscar productos..."
                            leftSection={<IconSearch size={16} />}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            radius="xl"
                            size="md"
                            w={{ base: '100%', sm: 280 }}
                            styles={{ input: { backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', fontFamily: '"Montserrat", sans-serif' } }}
                        />
                    </Group>

                    {/* Collection Chips */}
                    {collections.length > 0 && (
                        <ScrollArea type="never" mb="xl">
                            <Group wrap="nowrap" gap="sm" pb={4}>
                                <button style={chipStyle(selectedCollection === null)} onClick={() => setSelectedCollection(null)}>
                                    Todos
                                </button>
                                {collections.map(col => (
                                    <button
                                        key={col.id}
                                        style={chipStyle(selectedCollection === col.slug)}
                                        onClick={() => setSelectedCollection(selectedCollection === col.slug ? null : col.slug)}
                                    >
                                        {col.name}
                                        {col.products_count > 0 && <span style={{ opacity: 0.6, fontSize: 11 }}>({col.products_count})</span>}
                                    </button>
                                ))}
                            </Group>
                        </ScrollArea>
                    )}

                    {/* Grid */}
                    {loading ? (
                        <SimpleGrid cols={{ base: 2, sm: 3, lg: 4 }} spacing="lg">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Box key={i}>
                                    <Skeleton height={300} radius="xl" mb="sm" />
                                    <Skeleton height={14} radius="xl" mb="xs" width="70%" />
                                    <Skeleton height={14} radius="xl" width="40%" />
                                </Box>
                            ))}
                        </SimpleGrid>
                    ) : filtered.length === 0 ? (
                        <Center py={rem(120)}>
                            <Stack align="center" gap="md">
                                <IconShoppingBag size={64} color="#C8C7BC" stroke={1} />
                                <Title order={3} c="#4A4A4A" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                    {hasFilters ? 'Sin resultados' : 'Catálogo vacío'}
                                </Title>
                                <Text c="dimmed" ta="center" maw={300}>
                                    {hasFilters
                                        ? 'Prueba con otra búsqueda o selecciona otra colección.'
                                        : 'Pronto habrá productos disponibles.'}
                                </Text>
                                {hasFilters && (
                                    <Button leftSection={<IconFilterOff size={16} />} variant="outline" radius="xl" color="dark" onClick={() => { setSearch(''); setSelectedCollection(null); }} style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                        Limpiar filtros
                                    </Button>
                                )}
                            </Stack>
                        </Center>
                    ) : (
                        <SimpleGrid cols={{ base: 2, sm: 3, lg: 4 }} spacing="lg">
                            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
                        </SimpleGrid>
                    )}
                </Box>
                <Footer />
            </AppShell.Main>
        </AppShell>
    );
}
