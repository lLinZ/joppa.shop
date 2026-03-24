// <ai_context>
// Propósito: Template de Vista Detalle de Producto Individual (PDP). Implementa la arquitectura Bento Split Screen.
// Responsividad: Grid colapsable a stack en mobile. Sticky positioning activo en desktop.
// Dependencias: @mantine/core, ProductDetails, Header, Footer.
// </ai_context>

import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { AppShell, Box, Image, Text, Button, Accordion, ActionIcon, Group, rem, Center, Loader, Modal, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconPlayerPlay, IconArrowLeft, IconX } from '@tabler/icons-react';

import { useAppStore } from '../../store/useAppStore';
import { Header } from '../../Components/Layout/Header';
import Footer from '../../Components/Layout/Footer';
import CartDrawer from '../../Components/UI/Cart/CartDrawer';
import ProductAura from '../../Components/Product/ProductAura';

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
}

function ZoomImage({ src }: { src: string }) {
    const [zoomParams, setZoomParams] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);
    const [mobileZoom, setMobileZoom] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (window.innerWidth < 992) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomParams({ x, y });
    };

    const handleMouseEnter = () => {
        if (window.innerWidth >= 992) setIsZooming(true);
    };

    const handleMouseLeave = () => {
        setIsZooming(false);
    };

    const handleClick = () => {
        if (window.innerWidth < 992) open();
    };

    return (
        <>
            <Box
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '450px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: window.innerWidth < 992 ? 'pointer' : 'crosshair',
                    backgroundColor: '#F0EFE6',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}
            >
                {/* Transición Suave */}
                <Image
                    src={src}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: isZooming ? 0 : 1,
                        transition: 'opacity 0.2s ease-in-out'
                    }}
                />

                {/* Capa de Zoom */}
                <Box
                    style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundImage: `url(${src})`,
                        backgroundPosition: `${zoomParams.x}% ${zoomParams.y}%`,
                        backgroundSize: '300%',
                        backgroundRepeat: 'no-repeat',
                        opacity: isZooming ? 1 : 0,
                        transition: 'opacity 0.1s ease-in-out',
                        pointerEvents: 'none'
                    }}
                />
            </Box>

            {/* Modal para Mobile */}
            <Modal opened={opened} onClose={() => { close(); setMobileZoom(false); }} fullScreen padding={0} withCloseButton={false} bg="black" transitionProps={{ transition: 'fade', duration: 200 }}>
                <Box h="100vh" w="100vw" style={{ backgroundColor: '#111', position: 'relative' }}>
                    <ActionIcon
                        onClick={() => { close(); setMobileZoom(false); }}
                        variant="subtle"
                        color="white"
                        style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.5)' }}
                    >
                        <IconX size={32} />
                    </ActionIcon>

                    <ScrollArea h="100vh" w="100vw" type="never">
                        <Center style={{ minHeight: '100vh' }}>
                            <Image
                                src={src}
                                onClick={() => setMobileZoom(!mobileZoom)}
                                style={{
                                    width: mobileZoom ? '250vw' : '100vw',
                                    objectFit: mobileZoom ? 'cover' : 'contain',
                                    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                    cursor: mobileZoom ? 'zoom-out' : 'zoom-in'
                                }}
                            />
                        </Center>
                    </ScrollArea>
                </Box>
            </Modal>
        </>
    );
}

export default function Show({ id }: { id: string }) {
    const [opened, { toggle }] = useDisclosure(false);
    const [videoOpened, { open: openVideo, close: closeVideo }] = useDisclosure(false);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [mainImage, setMainImage] = useState<string>('');
    const [animating, setAnimating] = useState(false);

    const SIZES = ['S', 'M', 'L', 'XL'];
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [sizeError, setSizeError] = useState(false);

    const addToCart = useAppStore((state) => state.addToCart);

    useEffect(() => {
        setLoading(true);
        fetch(`${CRM_BASE}/catalog/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then(data => {
                setProduct(data.product);
                if (data.product.images && data.product.images.length > 0) {
                    setMainImage(data.product.images[0]);
                }
                setLoading(false);

                // Analytics: Count view
                fetch(`${CRM_BASE}/catalog/${id}/view`, { method: 'POST' }).catch(() => { });
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, [id]);

    const handleImageChange = (newImg: string) => {
        if (newImg === mainImage || animating) return;
        setAnimating(true);
        setTimeout(() => {
            setMainImage(newImg);
            setAnimating(false);
        }, 200); // 200ms fade out, then swap
    };

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
            size: selectedSize
        });
    };

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
                    <Text size="xl" fw={700} c="#0B3022" style={{ fontFamily: '\"Montserrat\", sans-serif' }}>Producto no encontrado</Text>
                    <Button mt="md" variant="subtle" color="#0B3022" onClick={() => window.history.back()}>Volver al catálogo</Button>
                </AppShell.Main>
            </AppShell>
        );
    }

    const productImages = product.images || [];

    return (
        <AppShell
            header={{ height: 100, collapsed: false, offset: true }}
            className="page-transition"
        >
            <Head title={`${product.name} - JOPPA`} />

            <CartDrawer />
            <Header opened={opened} toggle={toggle} />
            <ProductAura />

            <AppShell.Main bg="#F4F4E8" pt={rem(40)} style={{ position: 'relative', zIndex: 1 }}>

                <Box w="100%" px={{ base: 'md', md: 'xl' }} style={{ maxWidth: '1600px', margin: '0 auto', position: 'relative', minHeight: '100vh', paddingBottom: '120px' }}>

                    {/* DESKTOP LAYOUT (Flexbox Split-Screen to prevent overlap) */}
                    <Box display={{ base: 'none', lg: 'block' }} w="100%" pb="6rem" pt="4vh">
                        <Group align="flex-start" justify="space-between" wrap="nowrap" w="100%">

                            {/* LEFT COLUMN (Sticky Title + Video) */}
                            <Box w="300px" style={{ position: 'sticky', top: '120px', height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <Box>
                                    <Group gap="xs" mb="2rem" style={{ cursor: 'pointer', width: 'fit-content' }} onClick={() => window.history.back()}>
                                        <IconArrowLeft size={20} color="#0B3022" />
                                        <Text size="sm" fw={500} c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Volver</Text>
                                    </Group>

                                    <Text size="3.5rem" fw={400} c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif', lineHeight: 1.1, letterSpacing: '-0.04em' }}>
                                        {product.name}
                                    </Text>

                                    {product.description && (
                                        <Text size="1rem" fw={400} c="#4A4A4A" mt="sm" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                            {product.description}
                                        </Text>
                                    )}

                                    <Text size="1.5rem" fw={500} c="#000000" mt="xl" style={{ fontFamily: '"Montserrat", sans-serif', letterSpacing: '0.05em' }}>
                                        USD ${Number(product.price).toLocaleString('es-AR')}
                                    </Text>
                                    <Text size="0.8rem" c="dimmed" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                        Precio referencial en dolares BCV
                                    </Text>

                                    {/* SIZE SELECTOR (DESKTOP) */}
                                    <Box mt="2rem">
                                        <Group justify="space-between" mb="xs">
                                            <Text size="0.9rem" fw={600} c={sizeError ? "red" : "#000000"} style={{ fontFamily: '"Montserrat", sans-serif', transition: 'color 0.2s' }}>
                                                {sizeError ? '¡Por favor selecciona una talla!' : `Talla: ${selectedSize || 'Selecciona...'}`}
                                            </Text>
                                        </Group>
                                        <Group gap="xs">
                                            {SIZES.map(size => (
                                                <Button
                                                    key={size}
                                                    variant={selectedSize === size ? 'filled' : 'outline'}
                                                    color={sizeError && !selectedSize ? 'red' : '#0B3022'}
                                                    radius="xl"
                                                    size="md"
                                                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                                                    style={{
                                                        flex: 1,
                                                        fontFamily: '"Montserrat", sans-serif',
                                                        backgroundColor: selectedSize === size ? '#0B3022' : 'transparent',
                                                        color: selectedSize === size ? '#FFFFFF' : (sizeError && !selectedSize ? 'red' : '#000000'),
                                                        borderColor: sizeError && !selectedSize ? 'red' : (selectedSize === size ? '#0B3022' : 'rgba(0,0,0,0.2)'),
                                                        borderWidth: '1.5px',
                                                        transition: 'all 0.2s',
                                                    }}
                                                >
                                                    {size}
                                                </Button>
                                            ))}
                                        </Group>
                                    </Box>

                                    <Group mt="1.5rem" gap="md">
                                        <Button onClick={handleAddToCart} variant="filled" color="#0B3022" radius="xl" size="lg" h={56} px={40} fullWidth style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 500, fontSize: '1rem', backgroundColor: '#0B3022', color: '#FFFFFF' }}>
                                            Añadir a la Bolsa
                                        </Button>
                                    </Group>
                                </Box>

                                {/* BOTTOM LEFT VIDEO THUMBNAIL */}
                                {product.video_url && (
                                    <Box onClick={openVideo} style={{ width: '220px', borderRadius: '24px', overflow: 'hidden', position: 'relative', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                                        <video src={product.video_url} autoPlay loop muted playsInline style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />
                                        <ActionIcon variant="white" radius="xl" size={48} style={{ position: 'absolute', bottom: '16px', right: '16px', backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)' }}>
                                            <IconPlayerPlay size={20} color="#0B3022" style={{ marginLeft: '4px' }} />
                                        </ActionIcon>
                                    </Box>
                                )}
                            </Box>

                            {/* CENTER COLUMN (Hero Image) */}
                            <Box style={{ flex: 1, maxWidth: '550px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box w="100%" h="60vh" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {mainImage ? (
                                        <Image src={mainImage} alt={product.name} fit="contain" style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out', opacity: animating ? 0 : 1, transform: animating ? 'scale(0.97)' : 'scale(1)' }} />
                                    ) : (
                                        <Box w="100%" h="100%" style={{ backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Text c="dimmed">Sin imagen</Text></Box>
                                    )}
                                </Box>

                                {productImages.length > 1 && (
                                    <ScrollArea w="100%" mt="3rem" type="never">
                                        <Group gap="lg" justify="flex-start" wrap="nowrap" pb="md" px="md">
                                            {productImages.map((img, idx) => (
                                                <Box key={idx} onClick={() => handleImageChange(img)} style={{ flexShrink: 0, width: '96px', height: '96px', cursor: 'pointer', borderRadius: '16px', overflow: 'hidden', border: mainImage === img ? '2px solid #0B3022' : '2px solid transparent', opacity: mainImage === img ? 1 : 0.6, transition: 'all 0.2s ease', boxShadow: mainImage === img ? '0 8px 16px rgba(0,0,0,0.08)' : 'none' }}>
                                                    <Image src={img} h={96} w={96} fit="cover" />
                                                </Box>
                                            ))}
                                        </Group>
                                    </ScrollArea>
                                )}
                            </Box>

                            {/* RIGHT COLUMN (Accordion + Details) */}
                            <Box w="320px" style={{ display: 'flex', flexDirection: 'column', gap: '4rem', alignItems: 'flex-end' }}>
                                <Box w="100%">
                                    <Accordion variant="separated" disableChevronRotation chevron={<IconPlus size={16} color="#000000" />} styles={{ item: { backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.1)', borderRadius: 0, padding: 0 }, control: { paddingLeft: 0, paddingRight: 0, paddingTop: '1rem', paddingBottom: '1rem', backgroundColor: 'transparent' }, label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 500, color: '#000000', fontSize: '0.9rem' }, content: { paddingLeft: 0, paddingRight: 0, paddingBottom: '1.5rem', fontFamily: '"Montserrat", sans-serif', color: '#4A4A4A', lineHeight: 1.6, backgroundColor: 'transparent', whiteSpace: 'pre-line' } }}>
                                        {product.product_information && (
                                            <Accordion.Item value="info"><Accordion.Control>Información del producto</Accordion.Control><Accordion.Panel>{product.product_information}</Accordion.Panel></Accordion.Item>
                                        )}
                                        {product.product_features && (
                                            <Accordion.Item value="features"><Accordion.Control>Características del producto</Accordion.Control><Accordion.Panel>{product.product_features}</Accordion.Panel></Accordion.Item>
                                        )}
                                        {product.product_design && (
                                            <Accordion.Item value="design"><Accordion.Control>Diseño</Accordion.Control><Accordion.Panel>{product.product_design}</Accordion.Panel></Accordion.Item>
                                        )}
                                    </Accordion>
                                </Box>

                                {product.detail_image_url && (
                                    <Box w="100%">
                                        <ZoomImage src={product.detail_image_url} />
                                    </Box>
                                )}
                            </Box>
                        </Group>
                    </Box>

                    {/* VÍDEO MODAL */}
                    {product.video_url && (
                        <Modal opened={videoOpened} onClose={closeVideo} size="xl" centered padding={0} radius="24px" withCloseButton={false} styles={{ content: { backgroundColor: 'transparent', boxShadow: 'none' }, header: { display: 'none' } }}>
                            <video src={product.video_url} controls autoPlay style={{ width: '100%', maxHeight: '85vh', borderRadius: '24px', outline: 'none' }} />
                        </Modal>
                    )}

                    {/* MOBILE STACK (Fallback for small screens) */}
                    <Box display={{ base: 'block', lg: 'none' }} mt="4rem">

                        {/* BACK BUTTON (MOBILE) */}
                        <Group gap="xs" mb="2rem" style={{ cursor: 'pointer', width: 'fit-content' }} onClick={() => window.history.back()}>
                            <IconArrowLeft size={20} color="#0B3022" />
                            <Text size="sm" fw={500} c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Volver</Text>
                        </Group>

                        {/* MOBILE MAIN IMAGE & CAROUSEL */}
                        <Box w="100%" mb="2rem">
                            <Box w="100%" h={{ base: '350px', sm: '500px' }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {mainImage ? (
                                    <Image src={mainImage} alt={product.name} fit="contain" style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out', opacity: animating ? 0 : 1, transform: animating ? 'scale(0.97)' : 'scale(1)' }} />
                                ) : (
                                    <Box w="100%" h="100%" style={{ backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Text c="dimmed">Sin imagen</Text></Box>
                                )}
                            </Box>

                            {productImages.length > 1 && (
                                <ScrollArea w="100%" mt="xl" type="never">
                                    <Group gap="md" justify="flex-start" wrap="nowrap" pb="xs">
                                        {productImages.map((img, idx) => (
                                            <Box key={idx} onClick={() => handleImageChange(img)} style={{ flexShrink: 0, width: '72px', height: '72px', cursor: 'pointer', borderRadius: '12px', overflow: 'hidden', border: mainImage === img ? '2px solid #0B3022' : '2px solid transparent', opacity: mainImage === img ? 1 : 0.6, transition: 'all 0.2s ease' }}>
                                                <Image src={img} h={72} w={72} fit="cover" />
                                            </Box>
                                        ))}
                                    </Group>
                                </ScrollArea>
                            )}
                        </Box>

                        <Text size="3rem" fw={400} c="#0B3022" style={{ fontFamily: '\"Montserrat\", sans-serif', lineHeight: 1.1, letterSpacing: '-0.04em' }}>
                            {product.name}
                        </Text>
                        {product.description && (
                            <Text size="1rem" fw={400} c="#4A4A4A" mt="xs" style={{ fontFamily: '\"Montserrat\", sans-serif' }}>
                                {product.description}
                            </Text>
                        )}
                        <Text size="1.5rem" fw={500} c="#000000" mt="lg" style={{ fontFamily: '\"Montserrat\", sans-serif' }}>
                            USD ${Number(product.price).toLocaleString('es-AR')}
                        </Text>

                        {/* SIZE SELECTOR (MOBILE) */}
                        <Box mt="1.5rem">
                            <Group justify="space-between" mb="xs">
                                <Text size="0.9rem" fw={600} c={sizeError ? "red" : "#000000"} style={{ fontFamily: '"Montserrat", sans-serif', transition: 'color 0.2s' }}>
                                    {sizeError ? '¡Selecciona tu talla!' : `Talla: ${selectedSize || 'Selecciona...'}`}
                                </Text>
                            </Group>
                            <Group gap="xs">
                                {SIZES.map(size => (
                                    <Button
                                        key={size}
                                        variant={selectedSize === size ? 'filled' : 'outline'}
                                        color={sizeError && !selectedSize ? 'red' : '#0B3022'}
                                        radius="xl"
                                        size="md"
                                        onClick={() => { setSelectedSize(size); setSizeError(false); }}
                                        style={{
                                            flex: 1,
                                            fontFamily: '"Montserrat", sans-serif',
                                            backgroundColor: selectedSize === size ? '#0B3022' : 'transparent',
                                            color: selectedSize === size ? '#FFFFFF' : (sizeError && !selectedSize ? 'red' : '#000000'),
                                            borderColor: sizeError && !selectedSize ? 'red' : (selectedSize === size ? '#0B3022' : 'rgba(0,0,0,0.2)'),
                                            borderWidth: '1.5px',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {size}
                                    </Button>
                                ))}
                            </Group>
                        </Box>

                        <Button
                            onClick={handleAddToCart}
                            fullWidth
                            variant="filled"
                            color="#0B3022"
                            radius="xl"
                            size="lg"
                            mt="1.5rem"
                            h={56}
                            style={{ fontFamily: '\"Montserrat\", sans-serif', fontWeight: 500 }}
                        >
                            Añadir a la Bolsa
                        </Button>

                        {/* Mobile Accordions */}
                        <Box mt="3rem">
                            <Accordion
                                variant="separated"
                                disableChevronRotation
                                chevron={<IconPlus size={16} color="#000000" />}
                                styles={{
                                    item: { backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.1)', borderRadius: 0, padding: 0 },
                                    control: { paddingLeft: 0, paddingRight: 0, paddingTop: '1rem', paddingBottom: '1rem', backgroundColor: 'transparent' },
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
                                {product.product_design && (
                                    <Accordion.Item value="design">
                                        <Accordion.Control>Diseño</Accordion.Control>
                                        <Accordion.Panel>{product.product_design}</Accordion.Panel>
                                    </Accordion.Item>
                                )}
                            </Accordion>
                        </Box>

                        {/* Mobile Video */}
                        {product.video_url && (
                            <Box mt="2rem" w="100%">
                                <Text size="sm" fw={600} mb="sm" style={{ fontFamily: '"Montserrat", sans-serif' }}>Video Promocional</Text>
                                <Box onClick={openVideo} style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', position: 'relative', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                                    <video src={product.video_url} autoPlay loop muted playsInline style={{ width: '100%', minHeight: '350px', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />
                                    <ActionIcon variant="white" radius="xl" size={64} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)' }}>
                                        <IconPlayerPlay size={32} color="#0B3022" style={{ marginLeft: '4px' }} />
                                    </ActionIcon>
                                </Box>
                            </Box>
                        )}

                        {/* Mobile Detail Image */}
                        {product.detail_image_url && (
                            <Box w="100%" mt="2rem" mb="2rem">
                                <Text size="sm" fw={600} mb="xs" style={{ fontFamily: '"Montserrat", sans-serif' }}>Detalle / Textura</Text>
                                <ZoomImage src={product.detail_image_url} />
                            </Box>
                        )}
                    </Box>

                </Box>

                <Footer />
            </AppShell.Main>
        </AppShell>
    );
}
