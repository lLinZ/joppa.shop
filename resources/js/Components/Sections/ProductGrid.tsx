import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { SimpleGrid, Image, Text, Button, Group, Box, AspectRatio, Title, Stack, Card, Skeleton } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

const CRM_BASE = (import.meta.env.VITE_CRM_API_URL as string) || 'http://localhost:8000/api';

function ProductCardItem({ product }: { product: any }) {
    return (
        <Card p="md" radius="32px" shadow="none" withBorder={false} bg="#F9F9F4">
            <Box bg="#F4F4E8" pos="relative" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                <Link href={`/catalog/${product.slug || product.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                    <AspectRatio ratio={3 / 4}>
                        {product.images && product.images.length > 0 ? (
                            <Image src={product.images[0]} alt={product.name} style={{ mixBlendMode: 'darken' }} />
                        ) : (
                            <Box w="100%" h="100%" bg="#E5E5E5" />
                        )}
                    </AspectRatio>
                </Link>

                <Box pos="absolute" bottom="16px" left="16px" right="16px" className="joppa-quick-add">
                    <Button
                        component={Link}
                        href={`/catalog/${product.slug || product.id}`}
                        fullWidth
                        color="#0B3022"
                        c="#FFFFFF"
                        radius="xl"
                        style={{ fontWeight: 700, textTransform: 'capitalize', fontFamily: '"Inter", sans-serif' }}
                        leftSection={<IconSearch size={18} />}
                    >
                        Ver Detalle
                    </Button>
                </Box>
            </Box>

            <Stack gap="sm" mt="lg" px={0}>
                {/* Brand & Price Group */}
                <Group justify="space-between" mb="4px">
                    <Text size="13px" fw={600} c="dimmed" style={{ letterSpacing: '0.05em', fontFamily: '"Inter", sans-serif' }}>
                        JOPPA
                    </Text>
                    <Title order={3} c="#000000" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 800 }}>
                        ${Number(product.price).toLocaleString('es-AR')}
                    </Title>
                </Group>

                {/* Product Name */}
                <Link href={`/catalog/${product.slug || product.id}`} style={{ textDecoration: 'none' }}>
                    <Text size="lg" fw={700} c="#000000" style={{ fontFamily: '"Inter", sans-serif', lineHeight: 1.2 }}>
                        {product.name}
                    </Text>
                </Link>
            </Stack>
        </Card>
    );
}

export default function ProductGrid() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${CRM_BASE}/catalog`)
            .then(res => res.json())
            .then(data => {
                const list = data.products || [];
                setProducts(list.slice(0, 4));
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    return (
        <Box bg="transparent" w="100%">
            <Title
                c="#0B3022"
                order={2}
                ta="left"
                mb={50}
                style={{
                    fontWeight: 800,
                    fontFamily: '"Montserrat", sans-serif',
                    fontSize: 'clamp(2rem, 4vw, 3rem)'
                }}
            >
                Novedades de la Temporada
            </Title>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl" verticalSpacing="3rem">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Box key={i}>
                            <Skeleton height={350} radius="24px" mb="sm" />
                            <Skeleton height={14} radius="xl" mb="xs" width="70%" />
                            <Skeleton height={14} radius="xl" width="40%" />
                        </Box>
                    ))
                ) : products.length > 0 ? (
                    products.map((product) => (
                        <ProductCardItem key={product.id} product={product} />
                    ))
                ) : (
                    <Text c="dimmed" mt="xl">Pronto añadiremos más productos.</Text>
                )}
            </SimpleGrid>
        </Box>
    );
}
