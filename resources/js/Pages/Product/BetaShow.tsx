// <ai_context>
// Propósito: Template de Vista Detalle de Producto Individual (PDP). Implementa la arquitectura Bento Split Screen.
// Responsividad: Grid colapsable a stack en mobile. Sticky positioning activo en desktop.
// Dependencias: @mantine/core, ProductDetails, Header, Footer.
// </ai_context>

import React, { useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { AppShell, Box, Image, Text, Button, Accordion, ActionIcon, Group, rem, Center, Loader, Modal, ScrollArea, Stack, Flex, UnstyledButton, ColorSwatch, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconPlayerPlay, IconArrowLeft, IconX, IconRefresh, IconSearch } from '@tabler/icons-react';

import { useAppStore } from '../../store/useAppStore';
import { Header } from '../../Components/Layout/Header';
import Footer from '../../Components/Layout/Footer';
import CartDrawer from '../../Components/UI/Cart/CartDrawer';
import ProductAura from '../../Components/Product/ProductAura';
import { DesignPreview } from '../../Components/Design/DesignPreview';
import { GARMENT_COLORS } from '../../Components/Design/DesignStudio';
import ProductReviews from '../../Components/Product/ProductReviews';

const CRM_BASE = (import.meta.env.VITE_CRM_API_URL as string) || 'http://localhost:8000/api';

interface Product {
    id: number;
    name: string;
    price: string | number;
    description: string | null;
    images: string[] | null;
    product_information: string | null;
    product_features: string | null;
    product_design: string | null;
    video_url: string | null;
    detail_image_url: string | null;
    collections: { id: number; name: string; slug: string }[];
    available_colors: string[] | null;
    available_sizes: string[] | null;
    available_genders: string[] | null;
    status_reviews?: {
        count: number;
        average: number;
    };
}

const getImageUrl = (path: string | null) => {
    if (!path) return '';
    if (path.startsWith('data:')) return path;

    // Determine the absolute URL first
    let absUrl = path;
    if (!path.startsWith('http')) {
        const base = CRM_BASE.replace(/\/api$/, '').replace(/\/api\/$/, '');
        absUrl = `${base}${path.startsWith('/') ? '' : '/'}${path}`;
    }

    // Force proxy for known CRM assets even if they appear to be same-origin
    // (This happens if the CRM data returns the Shop's URL or relative paths mislabeled)
    if (absUrl.includes('storage/catalog') || absUrl.includes('storage/designs')) {
        const actualCrmBase = (import.meta.env.VITE_CRM_API_URL as string || '').replace(/\/api$/, '').replace(/\/api\/$/, '');
        const finalUrl = actualCrmBase && !absUrl.startsWith(actualCrmBase) && !absUrl.startsWith('data:')
            ? `${actualCrmBase}/${absUrl.split('storage/')[1] ? 'storage/' + absUrl.split('storage/')[1] : absUrl}`
            : absUrl;

        // Use the ecommerce proxy to bypass CORS/403 Forbidden issues from CRM
        return `/api/proxy-image?url=${encodeURIComponent(finalUrl)}`;
    }

    // Default same-origin bypass for other assets
    try {
        const url = new URL(absUrl);
        if (url.origin !== window.location.origin) {
            return `/api/proxy-image?url=${encodeURIComponent(absUrl)}`;
        }
    } catch (e) { }

    return absUrl;
};

const safeJsonParse = (str: any) => {
    if (!str) return null;
    if (typeof str !== 'string') return str;
    try {
        // Fix for potential leading/trailing whitespace or quotes
        const cleaned = str.trim();
        if (cleaned.startsWith('{') || cleaned.startsWith('[')) {
            return JSON.parse(cleaned);
        }
        return null;
    } catch (e) {
        console.error("Failed to parse JSON:", e, str);
        return null;
    }
};

export default function BetaShow({ id }: { id: string }) {
    const [opened, { toggle }] = useDisclosure(false);
    const [videoOpened, { open: openVideo, close: closeVideo }] = useDisclosure(false);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [activeView, setActiveView] = useState<'front' | 'back'>('front');
    const [selectedColor, setSelectedColor] = useState('#FFFFFF');
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [savedColor, setSavedColor] = useState<string | null>(null);
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
    const [isZooming, setIsZooming] = useState(false);
    const [isTouchZooming, setIsTouchZooming] = useState(false);
    const [touchPos, setTouchPos] = useState({ x: 50, y: 50 });
    const [selectedGender, setSelectedGender] = useState<'CABALLERO' | 'DAMA' | string>('CABALLERO');
    const [sizeError, setSizeError] = useState(false);

    const SIZES = product?.available_sizes && product.available_sizes.length > 0 
        ? product.available_sizes 
        : ['S', 'M', 'L', 'XL'];
    
    const GENDERS = product?.available_genders && product.available_genders.length > 0
        ? product.available_genders
        : ['CABALLERO', 'DAMA'];

    // Update selected gender if the default isn't in the available list
    useEffect(() => {
        if (product?.available_genders && product.available_genders.length > 0) {
            if (!product.available_genders.includes(selectedGender)) {
                setSelectedGender(product.available_genders[0]);
            }
        }
    }, [product?.available_genders]);
    const COLORS = [
        { name: 'Blanco', hex: '#FFFFFF' },
        { name: 'Negro', hex: '#1A1A1A' },
        { name: 'Beige', hex: '#D5BEA4' },
        { name: 'Azul Marino', hex: '#1B2735' },
        { name: 'Verde Bosque', hex: '#2D392F' }
    ];

    const addToCart = useAppStore((state) => state.addToCart);

    const handleZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPos({ x, y });
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;
        setTouchPos({ x, y });
    };

    useEffect(() => {
        setLoading(true);
        fetch(`${CRM_BASE}/catalog/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then(data => {
                setProduct(data.product);

                // Parse design data if present to get initial color
                const parsedDesign = safeJsonParse(data.product.product_design);
                if (parsedDesign && parsedDesign.color) {
                    setSelectedColor(parsedDesign.color);
                    // If the color isn't in our standard list, remember it as the "Saved" color
                    if (!GARMENT_COLORS.some(c => c.value.toUpperCase() === parsedDesign.color.toUpperCase())) {
                        setSavedColor(parsedDesign.color);
                    }
                }

                setLoading(false);

                // Analytics: Count view
                let visitorId = localStorage.getItem('joppa_visitor_id');
                if (!visitorId) {
                    visitorId = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : 'v-' + Date.now() + '-' + Math.random().toString(36).substring(2);
                    localStorage.setItem('joppa_visitor_id', visitorId);
                }

                fetch(`${CRM_BASE}/catalog/${id}/view`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ visitor_id: visitorId })
                }).catch(() => { });
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        if (!selectedSize) {
            setSizeError(true);
            setTimeout(() => setSizeError(false), 2000);
            return;
        }

        addToCart({
            id: String(product.id),
            name: product.name,
            price: String(product.price),
            image: product.images?.[0] || '',
            brand: 'JOPPA',
            size: selectedSize,
            color: selectedColor,
            gender: selectedGender
        });
    };

    // Inject the selected color into the design data for DesignPreview
    const dynamicDesignData = useMemo(() => {
        let baseDesign: any = { elements: { front: [], back: [] } };
        const parsed = safeJsonParse(product?.product_design);
        if (parsed) {
            baseDesign = parsed;

            // Recursively fix image URLs in elements to use proxy
            const fixElements = (els: any[]) => (els || []).map(el => {
                if (el.type === 'image') {
                    return { ...el, content: getImageUrl(el.content) };
                }
                return el;
            });

            if (baseDesign.elements) {
                baseDesign.elements.front = fixElements(baseDesign.elements.front);
                baseDesign.elements.back = fixElements(baseDesign.elements.back);
            }
        }
        return { ...baseDesign, color: selectedColor };
    }, [product?.product_design, selectedColor]);

    const productSchema = useMemo(() => {
        if (!product) return null;
        
        const schema: any = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": product.images?.map(img => getImageUrl(img)) || [],
            "description": product.description || "",
            "sku": `JOPPA-${product.id}`,
            "offers": {
                "@type": "Offer",
                "url": window.location.href,
                "priceCurrency": "USD",
                "price": product.price,
                "availability": "https://schema.org/InStock"
            }
        };

        if (product.status_reviews && product.status_reviews.count > 0) {
            schema.aggregateRating = {
                "@type": "AggregateRating",
                "ratingValue": product.status_reviews.average,
                "reviewCount": product.status_reviews.count
            };
        }

        return JSON.stringify(schema);
    }, [product]);

    if (loading) {
        return (
            <AppShell header={{ height: 100 }} className="page-transition">
                <Header opened={opened} toggle={toggle} />
                <AppShell.Main bg="#F4F4E8" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Loader color="#0B3022" size="lg" />
                </AppShell.Main>
            </AppShell>
        );
    }

    if (error || !product) {
        return (
            <AppShell header={{ height: 100 }} className="page-transition">
                <Header opened={opened} toggle={toggle} />
                <AppShell.Main bg="#F4F4E8" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Text size="xl" fw={700} c="#0B3022">Producto no encontrado</Text>
                    <Button mt="md" variant="subtle" color="#0B3022" onClick={() => window.history.back()}>Volver al catálogo</Button>
                </AppShell.Main>
            </AppShell>
        );
    }

    return (
        <AppShell header={{ height: 100, collapsed: false, offset: true }} className="page-transition">
            <Head title={`${product.name} - BETA`}>
                <title>{`${product.name} - JOPPA`}</title>
                {productSchema && (
                    <script type="application/ld+json">
                        {productSchema}
                    </script>
                )}
            </Head>

            <CartDrawer />
            <Header opened={opened} toggle={toggle} />
            <AppShell.Main bg="#F4F4E8" pt={rem(120)} style={{ overflowX: 'hidden', position: 'relative' }}>
                <ProductAura />
                <Box w="100%" px={{ base: 'md', md: 'xl' }} style={{ maxWidth: '1600px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

                    {/* 3-COLUMN LAYOUT DESKTOP */}
                    <Box display={{ base: 'none', lg: 'block' }} pb="4rem" pt="4rem">
                        <Flex gap={40} align="flex-start" justify="space-between" style={{ width: '100%' }}>
                            {/* COL 1: NARRATIVE (Left) */}
                            <Box style={{ flex: '0 0 350px', minWidth: 0 }}>
                                <Stack gap={30}>
                                    <Group gap="xs" style={{ cursor: 'pointer', width: 'fit-content' }} onClick={() => window.history.back()}>
                                        <IconArrowLeft size={20} color="#0B3022" />
                                        <Text size="sm" fw={500} c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Volver</Text>
                                    </Group>
                                    <Box>
                                        <Text
                                            size="3rem"
                                            fw={500}
                                            c="#0B3022"
                                            style={{
                                                fontFamily: '"Montserrat", sans-serif',
                                                lineHeight: 1.1,
                                                letterSpacing: '-0.02em',
                                                wordBreak: 'break-word'
                                            }}
                                        >
                                            {product.name}
                                        </Text>

                                        <Text size="1.5rem" fw={500} c="#000000" mt="xl" style={{ fontFamily: '"Montserrat", sans-serif', letterSpacing: '0.05em' }}>
                                            USD ${Number(product.price).toLocaleString('es-AR')}
                                        </Text>
                                        <Text size="0.8rem" c="dimmed" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                            Precio referencial en dolares BCV
                                        </Text>
                                    </Box>

                                    {product.description && (
                                        <Text
                                            size="0.9rem"
                                            fw={400}
                                            c="#4A4A4A"
                                            mt="sm"
                                            style={{
                                                fontFamily: '"Montserrat", sans-serif',
                                                wordBreak: 'break-word',
                                                lineHeight: 1.5,
                                                whiteSpace: 'pre-line'
                                            }}
                                        >
                                            {product.description}
                                        </Text>
                                    )}

                                    {/* PROMO VIDEO */}
                                    {product.video_url && (
                                        <Box onClick={openVideo} style={{ width: '100%', maxWidth: '280px', flexShrink: 0, borderRadius: '24px', overflow: 'hidden', position: 'relative', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                                            <video crossOrigin="anonymous" src={getImageUrl(product.video_url)} autoPlay loop muted playsInline style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />
                                            <ActionIcon variant="white" radius="xl" size={48} style={{ position: 'absolute', bottom: '16px', right: '16px', backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)' }}>
                                                <IconPlayerPlay size={20} color="#0B3022" style={{ marginLeft: '4px' }} />
                                            </ActionIcon>
                                        </Box>
                                    )}
                                </Stack>
                            </Box>


                            {/* COL 2: DYNAMIC MOCKUP (Center) */}
                            <Box style={{ flex: 1, position: 'relative', minWidth: 0 }}>
                                <Stack align="center" gap="xl">
                                    <Box w="100%" style={{ position: 'relative' }}>
                                        <DesignPreview design={dynamicDesignData} view={activeView} lightBg hideGuides={true} />

                                        {/* View Toggle */}
                                        <Group justify="center" gap={12} mt="xl">
                                            <Button
                                                variant={activeView === 'front' ? 'filled' : 'outline'}
                                                color="#0B3022"
                                                radius="xl"
                                                px={24}
                                                size="sm"
                                                onClick={() => setActiveView('front')}
                                            >
                                                FRENTE
                                            </Button>
                                            <Button
                                                variant={activeView === 'back' ? 'filled' : 'outline'}
                                                color="#0B3022"
                                                radius="xl"
                                                px={24}
                                                size="sm"
                                                onClick={() => setActiveView('back')}
                                            >
                                                ESPALDA
                                            </Button>
                                        </Group>
                                    </Box>
                                </Stack>
                            </Box>

                            {/* COL 3: CONVERSION & ZOOM (Right) */}
                            <Box style={{ flex: '0 0 350px' }}>
                                <Stack gap={30}>
                                    {/* DESIGN DETAIL BOX WITH DYNAMIC ZOOM */}
                                    <Box
                                        onMouseMove={handleZoomMove}
                                        onMouseEnter={() => setIsZooming(true)}
                                        onMouseLeave={() => setIsZooming(false)}
                                        style={{
                                            width: '100%',
                                            aspectRatio: '5/4',
                                            borderRadius: '32px',
                                            overflow: 'hidden',
                                            backgroundColor: selectedColor,
                                            position: 'relative',
                                            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                                            cursor: 'zoom-in',
                                            touchAction: 'none'
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                transform: isZooming ? 'scale(3.5)' : 'scale(1)',
                                                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                                                transition: isZooming ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0, 0.2, 1)',
                                                pointerEvents: 'none'
                                            }}
                                        >
                                            <DesignPreview
                                                design={dynamicDesignData}
                                                view={activeView}
                                                hideMockup={true}
                                                hideGuides={true}
                                            />
                                        </div>

                                        <Box style={{
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                            padding: '6px 12px',
                                            backgroundColor: 'rgba(11, 48, 34, 0.9)',
                                            borderRadius: '12px',
                                            backdropFilter: 'blur(4px)',
                                            opacity: isZooming ? 0 : 1,
                                            transition: 'opacity 0.2s',
                                            pointerEvents: 'none'
                                        }}>
                                            <Group gap={6}>
                                                <IconSearch size={14} color="white" />
                                                <Text size="10px" fw={700} c="white" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Detalle de Diseño</Text>
                                            </Group>
                                        </Box>
                                    </Box>

                                    {/* COLOR SELECTOR */}
                                    <Box>
                                        <Text size="xs" fw={700} c="#0B3022" mb="sm" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tono de Prenda</Text>
                                        <Group gap="xs">
                                            {GARMENT_COLORS.filter(c => {
                                                if (!product.available_colors || !Array.isArray(product.available_colors) || product.available_colors.length === 0) return true;
                                                return product.available_colors.some(ac => ac.toUpperCase() === c.value.toUpperCase());
                                            }).map(c => (
                                                <Tooltip label={c.label} key={c.value}>
                                                    <UnstyledButton
                                                        onClick={() => setSelectedColor(c.value)}
                                                        style={{
                                                            width: 32, height: 32, borderRadius: '50%', border: selectedColor.toUpperCase() === c.value.toUpperCase() ? '2px solid #0B3022' : '2px solid transparent',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                                                            padding: 2
                                                        }}
                                                    >
                                                        <ColorSwatch color={c.value} size={24} />
                                                    </UnstyledButton>
                                                </Tooltip>
                                            ))}

                                            {/* Show the saved color if it exists and is not in the palette */}
                                            {savedColor && !GARMENT_COLORS.some(c => c.value.toUpperCase() === savedColor.toUpperCase()) && (
                                                <Tooltip label="Color de Diseño">
                                                    <UnstyledButton
                                                        onClick={() => setSelectedColor(savedColor)}
                                                        style={{
                                                            width: 32, height: 32, borderRadius: '50%', border: selectedColor.toUpperCase() === savedColor.toUpperCase() ? '2px solid #0B3022' : '2px solid transparent',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                                                            padding: 2
                                                        }}
                                                    >
                                                        <ColorSwatch color={savedColor} size={24} />
                                                    </UnstyledButton>
                                                </Tooltip>
                                            )}
                                        </Group>
                                    </Box>

                                    {/* GENDER SELECTOR */}
                                    <Box>
                                        <Text size="xs" fw={700} c="#0B3022" mb="sm" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>Género</Text>
                                        <Group gap="xs" grow>
                                            {GENDERS.map(g => (
                                                <Button 
                                                    key={g} 
                                                    variant={selectedGender === g ? 'filled' : 'outline'} 
                                                    color="#0B3022" 
                                                    onClick={() => setSelectedGender(g)}
                                                    radius="md"
                                                    style={{ borderOpacity: selectedGender === g ? 1 : 0.2 }}
                                                >
                                                    {g}
                                                </Button>
                                            ))}
                                        </Group>
                                    </Box>

                                    {/* SIZE SELECTOR */}
                                    <Box>
                                        <Group justify="space-between" mb="xs">
                                            <Text size="xs" fw={700} c={sizeError ? 'red' : '#0B3022'} style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                {sizeError ? '¡Selecciona una talla!' : 'Elige tu talla'}
                                            </Text>
                                        </Group>
                                        <Group gap="xs" grow>
                                            {SIZES.map(s => (
                                                <Button
                                                    key={s}
                                                    variant={selectedSize === s ? 'filled' : 'outline'}
                                                    color="#0B3022"
                                                    onClick={() => { setSelectedSize(s); setSizeError(false); }}
                                                    radius="md"
                                                    style={{ borderOpacity: selectedSize === s ? 1 : 0.2 }}
                                                >
                                                    {s}
                                                </Button>
                                            ))}
                                        </Group>
                                    </Box>

                                    <Button onClick={handleAddToCart} fullWidth variant="filled" color="#0B3022" radius="xl" size="xl" h={64} style={{ fontSize: '1.1rem' }}>
                                        Añadir a la Bolsa
                                    </Button>

                                    <Accordion
                                        variant="separated"
                                        disableChevronRotation
                                        chevron={<IconPlus size={16} color="#000000" />}
                                        styles={{
                                            item: {
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                borderBottom: '1px solid rgba(0,0,0,0.1)',
                                                borderRadius: 0,
                                                padding: 0
                                            },
                                            control: {
                                                paddingLeft: 0,
                                                paddingRight: 0,
                                                paddingTop: '1rem',
                                                paddingBottom: '1rem',
                                                backgroundColor: 'transparent',
                                                '&:hover': { backgroundColor: 'transparent' }
                                            },
                                            label: {
                                                fontFamily: '"Montserrat", sans-serif',
                                                fontWeight: 500,
                                                color: '#000000',
                                                fontSize: '0.9rem'
                                            },
                                            content: {
                                                paddingLeft: 0,
                                                paddingRight: 0,
                                                paddingBottom: '1.5rem',
                                                fontFamily: '"Montserrat", sans-serif',
                                                color: '#4A4A4A',
                                                lineHeight: 1.6,
                                                backgroundColor: 'transparent',
                                                whiteSpace: 'pre-line',
                                                wordBreak: 'break-word'
                                            }
                                        }}
                                    >
                                        {product.product_information && (
                                            <Accordion.Item value="info">
                                                <Accordion.Control>Información del producto</Accordion.Control>
                                                <Accordion.Panel><Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>{product.product_information}</Text></Accordion.Panel>
                                            </Accordion.Item>
                                        )}
                                        {product.product_features && (
                                            <Accordion.Item value="features">
                                                <Accordion.Control>Características del producto</Accordion.Control>
                                                <Accordion.Panel><Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>{product.product_features}</Text></Accordion.Panel>
                                            </Accordion.Item>
                                        )}
                                        <Accordion.Item value="shipping">
                                            <Accordion.Control>Envío y Devoluciones</Accordion.Control>
                                            <Accordion.Panel><Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>Envíos nacionales vía MRW/Zoom (2-5 días hábiles). Los productos personalizados no admiten devoluciones a menos que presenten defectos de fabricación.</Text></Accordion.Panel>
                                        </Accordion.Item>
                                    </Accordion>
                                </Stack>
                            </Box>
                        </Flex>
                    </Box>

                </Box>

                {/* MOBILE FALLBACK (Simplified Stack) */}
                <Box display={{ base: 'block', lg: 'none' }} px="md" pb="xl">
                    <Stack gap="xl">
                        {/* BACK BUTTON (MOBILE) */}
                        <Group gap="xs" mb="lg" style={{ cursor: 'pointer', width: 'fit-content' }} onClick={() => window.history.back()}>
                            <IconArrowLeft size={20} color="#0B3022" />
                            <Text size="sm" fw={500} c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Volver</Text>
                        </Group>

                        <Box 
                            style={{ position: 'relative', touchAction: 'none' }}
                            onTouchStart={(e) => { setIsTouchZooming(true); handleTouchMove(e); }}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={() => setIsTouchZooming(false)}
                            onMouseDown={() => setIsTouchZooming(true)}
                            onMouseUp={() => setIsTouchZooming(false)}
                        >
                            <DesignPreview design={dynamicDesignData} view={activeView} lightBg hideGuides={true} />
                            
                            {/* FLOATING MAGNIFIER (MOBILE) */}
                            {isTouchZooming && (
                                <Box 
                                    style={{ 
                                        position: 'absolute', 
                                        top: -100, // Slightly lower to avoid header overlap
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 220, // Slightly larger lens
                                        height: 220,
                                        borderRadius: '50%', // Circular lens looks more premium
                                        border: '6px solid #0B3022',
                                        overflow: 'hidden',
                                        zIndex: 100,
                                        backgroundColor: selectedColor,
                                        boxShadow: '0 15px 50px rgba(0,0,0,0.4)',
                                        pointerEvents: 'none'
                                    }}
                                >
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        transform: 'scale(4.5)', // Increased zoom for more detail
                                        transformOrigin: `${touchPos.x}% ${touchPos.y}%`
                                    }}>
                                        <DesignPreview design={dynamicDesignData} view={activeView} hideMockup={true} hideGuides={true} />
                                    </div>
                                    {/* Crosshair / Center point */}
                                    <Box style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Box style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid white', backgroundColor: 'rgba(11, 48, 34, 0.4)' }} />
                                    </Box>
                                </Box>
                            )}
                            
                            {!isTouchZooming && (
                                <Text size="xs" c="dimmed" ta="center" mt="-md" style={{ fontFamily: 'Montserrat, sans-serif' }}>Manten presionado para ampliar</Text>
                            )}
                        </Box>
                        <Group justify="center" gap="xs">
                            {GARMENT_COLORS.filter(c => {
                                if (!product.available_colors || !Array.isArray(product.available_colors) || product.available_colors.length === 0) return true;
                                return product.available_colors.some(ac => ac.toUpperCase() === c.value.toUpperCase());
                            }).map(c => (
                                <ColorSwatch
                                    key={c.value}
                                    color={c.value}
                                    size={32}
                                    onClick={() => setSelectedColor(c.value)}
                                    style={{
                                        cursor: 'pointer',
                                        border: selectedColor.toUpperCase() === c.value.toUpperCase() ? '2px solid #0B3022' : 'none',
                                        transition: 'all 0.2s'
                                    }}
                                />
                            ))}
                            {savedColor && !GARMENT_COLORS.some(c => c.value.toUpperCase() === savedColor.toUpperCase()) && (
                                <ColorSwatch
                                    color={savedColor}
                                    size={32}
                                    onClick={() => setSelectedColor(savedColor)}
                                    style={{
                                        cursor: 'pointer',
                                        border: selectedColor.toUpperCase() === savedColor.toUpperCase() ? '2px solid #0B3022' : 'none',
                                        transition: 'all 0.2s'
                                    }}
                                />
                            )}
                        </Group>
                        <Stack gap="xs" align="center" style={{ width: '100%', overflow: 'hidden' }}>
                            <Text size="3rem" fw={400} c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif', lineHeight: 1.1, letterSpacing: '-0.04em', textAlign: 'center', wordBreak: 'break-word' }}>
                                {product.name}
                            </Text>
                            {product.description && (
                                <Box style={{ width: '100%', px: 'md' }}>
                                    <Text size="1rem" fw={400} c="#4A4A4A" mt="xs" style={{ 
                                        fontFamily: '"Montserrat", sans-serif', 
                                        textAlign: 'center',
                                        wordBreak: 'break-word',
                                        overflowWrap: 'anywhere'
                                    }}>
                                        {product.description}
                                    </Text>
                                </Box>
                            )}
                            <Text size="1.5rem" fw={500} c="#000000" mt="lg" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                USD ${Number(product.price).toLocaleString('es-AR')}
                            </Text>

                            {/* MOBILE SELECTION: GENDER & SIZE */}
                            <Box w="100%" mt="xl">
                                <Stack gap={20}>
                                    <Box>
                                        <Text size="xs" fw={700} c="#0B3022" mb="xs" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Género</Text>
                                        <Group gap="xs" grow>
                                            {GENDERS.map(g => (
                                                <Button 
                                                    key={g} 
                                                    variant={selectedGender === g ? 'filled' : 'outline'} 
                                                    color="#0B3022" 
                                                    onClick={() => setSelectedGender(g)}
                                                    radius="xl"
                                                    size="md"
                                                >
                                                    {g}
                                                </Button>
                                            ))}
                                        </Group>
                                    </Box>

                                    <Box>
                                        <Group justify="center" gap="xs" mb="xs">
                                            <Text size="xs" fw={700} c={sizeError ? 'red' : '#0B3022'} style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                {sizeError ? '¡Selecciona una talla!' : 'Escoge Talla'}
                                            </Text>
                                        </Group>
                                        <Group gap="xs" grow>
                                            {SIZES.map(s => (
                                                <Button 
                                                    key={s} 
                                                    variant={selectedSize === s ? 'filled' : 'outline'} 
                                                    color="#0B3022" 
                                                    onClick={() => { setSelectedSize(s); setSizeError(false); }}
                                                    radius="xl"
                                                    size="md"
                                                >
                                                    {s}
                                                </Button>
                                            ))}
                                        </Group>
                                    </Box>
                                </Stack>
                            </Box>
                        </Stack>

                        <Button fullWidth size="xl" color="#0B3022" radius="xl" h={64} onClick={handleAddToCart} mt="xl">Añadir a la Bolsa</Button>

                        <Accordion
                            variant="separated"
                            disableChevronRotation
                            chevron={<IconPlus size={16} color="#000000" />}
                            styles={{
                                item: { backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.1)', borderRadius: 0, padding: 0 },
                                control: { paddingLeft: 0, paddingRight: 0, paddingTop: '1rem', paddingBottom: '1rem', backgroundColor: 'transparent', '&:hover': { backgroundColor: 'transparent' } },
                                label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 500, color: '#000000', fontSize: '0.9rem' },
                                content: { paddingLeft: 0, paddingRight: 0, paddingBottom: '1.5rem', fontFamily: '"Montserrat", sans-serif', color: '#4A4A4A', lineHeight: 1.6, backgroundColor: 'transparent', whiteSpace: 'pre-line' }
                            }}
                        >
                            {product.product_information && (
                                <Accordion.Item value="info">
                                    <Accordion.Control>Información del producto</Accordion.Control>
                                    <Accordion.Panel>{product.product_information}</Accordion.Panel>
                                </Accordion.Item>
                            )}
                            {product.product_features && (
                                <Accordion.Item value="features">
                                    <Accordion.Control>Características del producto</Accordion.Control>
                                    <Accordion.Panel>{product.product_features}</Accordion.Panel>
                                </Accordion.Item>
                            )}
                            <Accordion.Item value="shipping">
                                <Accordion.Control>Envío y Devoluciones</Accordion.Control>
                                <Accordion.Panel>Envíos nacionales vía MRW/Zoom (2-5 días hábiles). Los productos personalizados no admiten devoluciones a menos que presenten defectos de fabricación.</Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>
                    </Stack>
                </Box>

                {/* LIFESTYLE GALLERY (Shared) */}
                {product.images && product.images.length > 0 && (
                    <Box w="100%" px={0} style={{ maxWidth: '1600px', margin: '0 auto' }}>
                        <Box py={{ base: '3rem', md: '5rem' }} style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                            <Box px={{ base: 'md', md: 'xl' }}>
                                <Text size="1.2rem" fw={700} mb="xs" style={{ fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>VISTO EN MODELO</Text>
                                <Text size="xs" c="dimmed" mb="xl" display={{ base: 'block', md: 'none' }} style={{ fontFamily: 'Montserrat, sans-serif' }}>Desliza para ver más →</Text>
                            </Box>

                            <ScrollArea w="100%" type="never" offsetScrollbars={false}>
                                <Group gap="md" wrap="nowrap" px={{ base: 'md', md: 'xl' }} pb="xl">
                                    {product.images.map((img: string, i: number) => (
                                        <Box
                                            key={i}
                                            style={{
                                                width: window.innerWidth < 768 ? '260px' : '300px',
                                                height: window.innerWidth < 768 ? '350px' : '400px',
                                                flexShrink: 0,
                                                borderRadius: '24px',
                                                overflow: 'hidden',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            <Image crossOrigin="anonymous" src={getImageUrl(img)} alt="Lifestyle" fit="cover" h="100%" w="100%" />
                                        </Box>
                                    ))}
                                    {/* Spacer for end of scroll */}
                                    <Box w={1} style={{ flexShrink: 0 }} />
                                </Group>
                            </ScrollArea>
                        </Box>
                    </Box>
                )}

                <Box w="100%" px={{ base: 'md', md: 'xl' }} style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '5rem' }}>
                    <ProductReviews productId={id} crmBase={CRM_BASE} />
                </Box>

                <Footer />
            </AppShell.Main>

            {/* VIDEO MODAL */}
            {product.video_url && (
                <Modal opened={videoOpened} onClose={closeVideo} size="xl" centered padding={0} withCloseButton={false}>
                    <video crossOrigin="anonymous" src={getImageUrl(product.video_url)} controls autoPlay style={{ width: '100%', borderRadius: '16px' }} />
                </Modal>
            )}
        </AppShell>
    );
}

