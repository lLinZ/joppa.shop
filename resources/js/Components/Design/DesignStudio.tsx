import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Box, Paper, Text, Stack, ActionIcon, Button, Tabs, ColorInput, Select, Slider, FileInput, Transition, Group, Card, SimpleGrid, rem, Tooltip, Title, FileButton, Divider } from '@mantine/core';
import {
    IconShirt, IconTextSize, IconUpload, IconTrash, IconRotate,
    IconMaximize, IconDeviceFloppy, IconChevronRight, IconChevronLeft,
    IconPlus, IconRefresh, IconArrowBackUp, IconArrowForwardUp,
    IconLayoutGrid, IconTypography, IconPhoto, IconSparkles,
    IconBolt, IconArrowsSort, IconArrowBarToUp, IconArrowBarToDown,
    IconArrowBigUp, IconArrowBigDown, IconMinus, IconZoomIn, IconZoomOut
} from '@tabler/icons-react';
import { Rnd } from 'react-rnd';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@mantine/hooks';

// --- TYPES ---
type DesignElementType = 'text' | 'image';
type TabType = 'product' | 'text' | 'image' | 'designs';

interface DesignElement {
    id: string;
    type: DesignElementType;
    content: string; // Text string or Image URL
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    letterSpacing?: number;
    zIndex: number;
}

interface ProductAssets {
    front: string;
    back: string;
}

interface ProductType {
    id: string;
    name: string;
    basePrice: number;
    assets: {
        [gender: string]: ProductAssets;
    };
    variants?: {
        [gender: string]: {
            enabled: boolean;
            assets: ProductAssets;
            colors: { label: string; value: string; enabled?: boolean }[];
            sizes: string[];
        };
    };
}

// Default fallbacks (used until API loads or if API fails)
const DEFAULT_PRODUCTS: ProductType[] = [
    {
        id: 'oversize',
        name: 'T-Shirt Oversize',
        basePrice: 20,
        assets: {
            Caballero: {
                front: '/images/custom_design_builder/franela_blanca_sin_fondo.png',
                back: '/images/custom_design_builder/franela_blanca_sin_fondo_back.png'
            },
            Dama: {
                front: '/images/custom_design_builder/franela_blanca_sin_fondo.png',
                back: '/images/custom_design_builder/franela_blanca_sin_fondo_back.png'
            }
        }
    },
];

const DEFAULT_GARMENT_COLORS = [
    { label: 'Negro', value: '#1A1A1A' },
    { label: 'Blanco', value: '#FFFFFF' },
    { label: 'Verde Bosque', value: '#0B3022' },
];

// Exported for backward compatibility with BetaShow — updated after API fetch
export let GARMENT_COLORS: { label: string; value: string }[] = DEFAULT_GARMENT_COLORS;

// Helper: convert new nested API products to the legacy ProductType format
function apiProductToLocal(p: any): ProductType {
    // Build assets map from variants
    const assets: Record<string, { front: string; back: string }> = {};
    for (const [gender, variant] of Object.entries(p.variants ?? {})) {
        assets[gender] = (variant as any).assets ?? { front: '', back: '' };
    }
    return {
        id: p.id,
        name: p.name,
        basePrice: p.basePrice,
        assets,
        // store full variants for color/size lookup
        variants: p.variants,
    };
}

const FONTS = [
    { label: 'Montserrat', value: 'Montserrat, sans-serif' },
    { label: 'Bebas Neue', value: "'Bebas Neue', sans-serif" },
    { label: 'Caveat', value: 'Caveat, cursive' },
    { label: 'Playfair Display', value: 'Playfair Display, serif' },
];

export interface DesignStudioProps {
    gender: 'Caballero' | 'Dama';
    design_data?: any;
    onSave: (data: any) => void;
    crmApiUrl?: string;
}

const VCS_WIDTH = 1000;
const VCS_HEIGHT = 1100;

export const DesignStudio: React.FC<DesignStudioProps> = ({ gender, design_data, onSave, crmApiUrl }) => {
    const [elementsMap, setElementsMap] = useState<Record<'front' | 'back', DesignElement[]>>({
        front: [],
        back: []
    });
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [availableProducts, setAvailableProducts] = useState<ProductType[]>(DEFAULT_PRODUCTS);
    const [availableColors, setAvailableColors] = useState<{ label: string; value: string }[]>(DEFAULT_GARMENT_COLORS);
    const [availableSizes, setAvailableSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
    const [configLoaded, setConfigLoaded] = useState(false);
    const [product, setProduct] = useState<ProductType>(DEFAULT_PRODUCTS[0]);
    const [color, setColor] = useState(DEFAULT_GARMENT_COLORS[0].value);
    const [view, setView] = useState<'front' | 'back'>('front');
    const [activeTab, setActiveTab] = useState<TabType | null>('product');
    const [zoom, setZoom] = useState(100);
    const zoomInitialized = useRef(false);
    const [studioScale, setStudioScale] = useState(1);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [savedDesigns, setSavedDesigns] = useState<any[]>([]);
    const isHydrated = useRef(false);
    const [isReady, setIsReady] = useState(false);

    const isMobile = useMediaQuery('(max-width: 992px)');

    const containerRef = useRef<HTMLDivElement>(null);
    const onSaveRef = useRef(onSave);
    useEffect(() => { onSaveRef.current = onSave; }, [onSave]);

    // --- FETCH CONFIG FROM CRM ---
    useEffect(() => {
        const configUrl = crmApiUrl
            ? `${crmApiUrl}/builder-config`
            : 'http://localhost:8000/api/builder-config';
        fetch(configUrl)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) {
                    if (data.products && data.products.length > 0) {
                        const mapped = data.products.map(apiProductToLocal);
                        setAvailableProducts(mapped);
                        setProduct(mapped[0]);
                        // Build flat color list from ALL variants for backward compat
                        const allColors: { label: string; value: string }[] = [];
                        for (const p of data.products) {
                            for (const v of Object.values(p.variants ?? {})) {
                                for (const c of (v as any).colors ?? []) {
                                    if (!allColors.some(x => x.value.toUpperCase() === c.value.toUpperCase())) {
                                        allColors.push({ label: c.label, value: c.value });
                                    }
                                }
                            }
                        }
                        if (allColors.length > 0) {
                            setAvailableColors(allColors);
                            GARMENT_COLORS = allColors;
                        }
                    }
                }
                setConfigLoaded(true);
            })
            .catch(() => setConfigLoaded(true));
    }, [crmApiUrl]);

    useEffect(() => {
        if (isMobile && !zoomInitialized.current) {
            setZoom(180);
            zoomInitialized.current = true;
        }
    }, [isMobile]);

    // Load saved designs and image history from localStorage on mount
    useEffect(() => {
        const localDesigns = localStorage.getItem('joppa_local_gallery');
        if (localDesigns) {
            try { setSavedDesigns(JSON.parse(localDesigns)); } catch (e) { console.error(e); }
        }

        const localImages = localStorage.getItem('joppa_uploaded_images_history');
        if (localImages) {
            try { setUploadedImages(JSON.parse(localImages)); } catch (e) { console.error(e); }
        }
    }, []);

    useEffect(() => {
        if (design_data && !isHydrated.current) {
            const dataElements = design_data.elements || design_data.elementsMap;
            if (dataElements) {
                setElementsMap(dataElements);
                
                // Scan for existing images to populate the gallery
                const existingImages: string[] = [];
                [...dataElements.front, ...dataElements.back].forEach(el => {
                    if (el.type === 'image' && !existingImages.includes(el.content)) {
                        existingImages.push(el.content);
                    }
                });
                
                if (existingImages.length > 0) {
                    setUploadedImages(prev => {
                        const combined = [...new Set([...prev, ...existingImages])];
                        return combined;
                    });
                }
            }
            if (design_data.product) {
                const foundProduct = availableProducts.find(p => p.id === design_data.product.id) || availableProducts[0];
                setProduct(foundProduct || DEFAULT_PRODUCTS[0]);
            }
            if (design_data.color) setColor(design_data.color);
            if (design_data.view) setView(design_data.view);
            isHydrated.current = true;
        } else if (!design_data) {
            isHydrated.current = true;
        }
    }, [design_data]);

    useEffect(() => {
        if (isHydrated.current && isReady) {
            const timeoutId = setTimeout(() => {
                onSaveRef.current({
                    elements: elementsMap,
                    product,
                    color,
                    view,
                    basePrice: product.basePrice,
                    assets: product.assets[gender]
                });
            }, 800);
            return () => clearTimeout(timeoutId);
        }
    }, [elementsMap, product, color, view, gender, isReady]);

    // --- GHOST DESIGN TRACKING (ABANDONED DESIGNS) ---
    const [sessionId] = useState(() => {
        let id = localStorage.getItem('joppa_design_session_v1');
        if (!id) {
            id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('joppa_design_session_v1', id);
        }
        return id;
    });

    useEffect(() => {
        if (!isHydrated.current || !isReady) return;
        
        // Solo guardamos el diseño abandonado si al menos metieron un elemento o cambiaron el color por defecto
        const totalElements = elementsMap.front.length + elementsMap.back.length;
        if (totalElements === 0) return;

        const pingTimeoutId = setTimeout(() => {
            const payload = {
                session_id: sessionId,
                duration_increment: 5, // Aprox 5 segundos de iteración activa
                design_data: {
                    elementsMap: elementsMap,
                    product: product,
                    color: color,
                    view: view,
                }
            };
            const pingUrl = crmApiUrl ? `${crmApiUrl}/abandoned-designs/ping` : 'http://localhost:8000/api/abandoned-designs/ping';
            axios.post(pingUrl, payload).catch(() => {});
        }, 5000); // Debounce de 5 segundos

        return () => clearTimeout(pingTimeoutId);
    }, [elementsMap, product, color, view, gender, isReady, sessionId, crmApiUrl]);

    const elements = elementsMap[view];

    // Colors and sizes for this specific product + gender combination
    const variantColors: { label: string; value: string }[] = (() => {
        const v = (product as any).variants?.[gender];
        if (v?.colors && v.colors.length > 0) return v.colors;
        return availableColors;
    })();

    const variantSizes: string[] = (() => {
        const v = (product as any).variants?.[gender];
        if (v?.sizes && v.sizes.length > 0) return v.sizes;
        return availableSizes;
    })();

    const parentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const updateScale = () => {
            if (!parentRef.current) return;
            const PADDING = isMobile ? 0 : 40;
            const availableW = parentRef.current.clientWidth - PADDING;
            const availableH = parentRef.current.clientHeight - PADDING;
            if (availableW <= 0) return;
            let scale = availableW / VCS_WIDTH;
            if (!isMobile) {
                scale = Math.min(availableW / VCS_WIDTH, availableH / VCS_HEIGHT);
            }
            setStudioScale(scale || 1);
            setIsReady(true);
        };
        const observer = new ResizeObserver(updateScale);
        if (parentRef.current) observer.observe(parentRef.current);
        updateScale();
        return () => observer.disconnect();
    }, [isMobile, product]);

    const getNextZIndex = () => {
        const allElements = [...elementsMap.front, ...elementsMap.back];
        if (allElements.length === 0) return 10;
        return Math.max(...allElements.map(el => el.zIndex)) + 1;
    };

    const addText = () => {
        const newEl: DesignElement = {
            id: Math.random().toString(),
            type: 'text',
            content: 'NUEVA AVENTURA',
            x: 250,
            y: 350,
            width: 500,
            height: 100,
            rotation: 0,
            fontSize: 40,
            fontFamily: FONTS[0].value,
            color: '#0B3022',
            letterSpacing: 2,
            zIndex: getNextZIndex()
        };
        setElementsMap(prev => ({ ...prev, [view]: [...prev[view], newEl] }));
        setSelectedId(newEl.id);
        setActiveTab('text');
    };

    const handleImageUpload = async (file: File | null) => {
        if (!file) return;
        const tempUrl = URL.createObjectURL(file);
        addImage(tempUrl);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const uploadUrl = crmApiUrl ? `${crmApiUrl}/design-assets` : 'http://localhost:8001/api/design-assets';
            const response = await axios.post(uploadUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.url) {
                setElementsMap(prev => ({
                    front: prev.front.map(el => el.content === tempUrl ? { ...el, content: response.data.url } : el),
                    back: prev.back.map(el => el.content === tempUrl ? { ...el, content: response.data.url } : el)
                }));
                setUploadedImages(prev => {
                    const updated = prev.map(u => u === tempUrl ? response.data.url : u);
                    localStorage.setItem('joppa_uploaded_images_history', JSON.stringify(updated));
                    return updated;
                });
            }
        } catch (err) { console.error(err); }
    };

    const addImage = (url: string) => {
        const newEl: DesignElement = {
            id: Math.random().toString(),
            type: 'image',
            content: url,
            x: 400,
            y: 450,
            width: 200,
            height: 200,
            rotation: 0,
            zIndex: getNextZIndex()
        };
        setElementsMap(prev => ({ ...prev, [view]: [...prev[view], newEl] }));
        setSelectedId(newEl.id);
        setActiveTab('image');
        
        setUploadedImages(prev => {
            if (prev.includes(url)) return prev;
            const updated = [...prev, url];
            localStorage.setItem('joppa_uploaded_images_history', JSON.stringify(updated));
            return updated;
        });
    };

    const updateElement = (id: string, updates: Partial<DesignElement>) => {
        setElementsMap(prev => ({
            ...prev,
            [view]: prev[view].map(el => el.id === id ? { ...el, ...updates } : el)
        }));
    };

    const removeElement = (id: string) => {
        setElementsMap(prev => ({
            ...prev,
            [view]: prev[view].filter(el => el.id !== id)
        }));
        setSelectedId(null);
    };

    const saveToGallery = () => {
        const newDesign = {
            id: Math.random().toString(36).substr(2, 9),
            name: `Diseño ${savedDesigns.length + 1}`,
            elementsMap,
            timestamp: new Date().toISOString()
        };
        const updated = [newDesign, ...savedDesigns];
        setSavedDesigns(updated);
        localStorage.setItem('joppa_local_gallery', JSON.stringify(updated));
        setActiveTab('designs');
    };

    const applyLibraryDesign = (libDesign: any) => {
        if (window.confirm('¿Aplicar este diseño? Reemplazará los logos y textos actuales.')) {
            setElementsMap(libDesign.elementsMap);
            setSelectedId(null);
        }
    };

    const deleteFromGallery = (id: string) => {
        const updated = savedDesigns.filter(d => d.id !== id);
        setSavedDesigns(updated);
        localStorage.setItem('joppa_local_gallery', JSON.stringify(updated));
    };

    const selectedElement = elements.find(el => el.id === selectedId);
    const currentAssetUrl = (product.assets[gender] as any)[view] || product.assets[gender].front;

    const totalScale = studioScale * (zoom / 100);

    return (
        <Box
            style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'stretch',
                gap: 0,
                height: isMobile ? 'auto' : '840px',
                minHeight: isMobile ? '100vh' : 'unset',
                backgroundColor: '#F7F8F9',
                borderRadius: isMobile ? 0 : 32,
                overflow: isMobile ? 'auto' : 'hidden',
                border: isMobile ? 'none' : '1px solid rgba(0,0,0,0.05)',
                boxShadow: isMobile ? 'none' : '0 20px 60px rgba(0,0,0,0.04)'
            }}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;700;900&family=Caveat:wght@400;700&family=Playfair+Display:wght@400;700&display=swap');
            `}} />

            {/* CANVAS AREA (LEFT) */}
            <Box
                style={{
                    flex: isMobile ? 'none' : 1,
                    height: isMobile ? '60vh' : 'auto',
                    position: 'relative',
                    backgroundColor: '#FFFFFF',
                    borderRight: isMobile ? 'none' : '1px solid rgba(0,0,0,0.05)',
                    borderBottom: isMobile ? '1px solid rgba(0,0,0,0.05)' : 'none',
                    minWidth: isMobile ? '100%' : 400,
                    overflow: 'hidden', // Stop entire area from scrolling
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Scrollable Container */}
                <Box
                    ref={parentRef}
                    style={{
                        flex: 1,
                        overflow: 'auto',
                        position: 'relative',
                        padding: 0
                    }}
                >
                    {isReady && (
                        <Box
                            style={{
                                width: '100%',
                                height: Math.max(isMobile ? 0 : 700, VCS_HEIGHT * totalScale + 120),
                                position: 'relative',
                                minHeight: '100%',
                                padding: '60px 0'
                            }}
                        >
                            <Box
                                style={{
                                    width: VCS_WIDTH,
                                    height: VCS_HEIGHT,
                                    position: 'absolute',
                                    top: 60,
                                    left: '50%',
                                    marginLeft: -(500 * totalScale),
                                    transform: `scale(${totalScale})`,
                                    transformOrigin: '0 0',
                                    pointerEvents: 'auto',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                                    backgroundColor: '#fff',
                                }}
                            >
                                <img src={currentAssetUrl} alt="Base" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'top center' }} />
                                <Box style={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                    backgroundColor: color, maskImage: `url(${currentAssetUrl})`, maskSize: 'contain',
                                    maskRepeat: 'no-repeat', maskPosition: 'top center', WebkitMaskImage: `url(${currentAssetUrl})`,
                                    WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'top center',
                                    mixBlendMode: 'multiply', transition: 'background-color 0.5s ease', opacity: 0.9
                                }} />
                                <img src={currentAssetUrl} alt="Texture" style={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                    objectFit: 'contain', objectPosition: 'top center', mixBlendMode: 'multiply',
                                    filter: 'brightness(1.1) contrast(1.1)', opacity: 0.9, pointerEvents: 'none'
                                }} />

                                <Box ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }} onMouseDown={(e) => e.target === e.currentTarget && setSelectedId(null)}>
                                    {elements.map((el) => (
                                        <Rnd
                                            key={el.id}
                                            scale={totalScale}
                                            size={{ width: el.width, height: el.height }}
                                            position={{ x: el.x, y: el.y }}
                                            onDragStart={() => setSelectedId(el.id)}
                                            onDragStop={(e, d) => updateElement(el.id, { x: Math.round(d.x), y: Math.round(d.y) })}
                                            onResizeStop={(e, dir, ref, delta, pos) => {
                                                const updates: Partial<DesignElement> = { width: Math.round(ref.offsetWidth), height: Math.round(ref.offsetHeight), x: Math.round(pos.x), y: Math.round(pos.y) };
                                                if (el.type === 'text' && el.fontSize && ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].includes(dir)) {
                                                    updates.fontSize = Math.max(10, Math.min(150, Math.round(el.fontSize * (ref.offsetHeight / el.height))));
                                                }
                                                updateElement(el.id, updates);
                                            }}
                                            style={{ zIndex: el.zIndex }}
                                            resizeHandleStyles={{
                                                bottomRight: { width: 16, height: 16, background: '#228be6', border: '2px solid white', borderRadius: '50%', right: -8, bottom: -8, display: selectedId === el.id ? 'block' : 'none' },
                                                bottomLeft: { width: 16, height: 16, background: '#228be6', border: '2px solid white', borderRadius: '50%', left: -8, bottom: -8, display: selectedId === el.id ? 'block' : 'none' },
                                                topRight: { width: 16, height: 16, background: '#228be6', border: '2px solid white', borderRadius: '50%', right: -8, top: -8, display: selectedId === el.id ? 'block' : 'none' },
                                                topLeft: { width: 16, height: 16, background: '#228be6', border: '2px solid white', borderRadius: '50%', left: -8, top: -8, display: selectedId === el.id ? 'block' : 'none' },
                                            }}
                                            onMouseDownCapture={() => setSelectedId(el.id)}
                                            onTouchStartCapture={() => setSelectedId(el.id)}
                                        >
                                            <div style={{
                                                width: '100%', height: '100%', position: 'relative', rotate: `${el.rotation}deg`,
                                                transformOrigin: 'center center', border: selectedId === el.id ? '2px solid #228be6' : '1px solid transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                backgroundColor: selectedId === el.id ? 'rgba(34, 139, 230, 0.05)' : 'transparent',
                                                borderRadius: '2px'
                                            }}>
                                                {selectedId === el.id && (
                                                    <ActionIcon color="red" variant="filled" size="sm" radius="xl" onClick={(e) => { e.stopPropagation(); removeElement(el.id); }} style={{ position: 'absolute', top: -45, right: -15, zIndex: 2000, rotate: `-${el.rotation}deg` }}><IconTrash size={14} /></ActionIcon>
                                                )}
                                                {el.type === 'image' ? (
                                                    <img src={el.content} alt="Design" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                                                ) : (
                                                    <div style={{ color: el.color, fontSize: `${el.fontSize}px`, fontFamily: el.fontFamily, fontWeight: 'bold', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'pre-wrap', textAlign: 'center', lineHeight: 1.1, letterSpacing: `${el.letterSpacing}px`, pointerEvents: 'none' }}>{el.content}</div>
                                                )}
                                            </div>
                                        </Rnd>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>

                {/* Fixed Overlapping Controls */}
                <Box style={{ position: 'absolute', bottom: isMobile ? 12 : 24, zIndex: 200, width: '100%', pointerEvents: 'none' }}>
                    <Group justify="center" gap="xs">
                        <Paper shadow="sm" radius="xl" withBorder p={4} style={{ pointerEvents: 'auto', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}>
                            <Group gap={4}>
                                <Button variant={view === 'front' ? 'filled' : 'subtle'} color="#0B3022" size="compact-sm" onClick={() => setView('front')} radius="xl" fw={700}>FRONT</Button>
                                <Button variant={view === 'back' ? 'filled' : 'subtle'} color="#0B3022" size="compact-sm" onClick={() => setView('back')} radius="xl" fw={700}>BACK</Button>
                            </Group>
                        </Paper>
                        <Paper shadow="sm" radius="xl" withBorder p={4} style={{ pointerEvents: 'auto', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}>
                            <Group gap={8} p="0 12px">
                                <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => setZoom(Math.max(50, zoom - 10))}><IconMinus size={14} /></ActionIcon>
                                <Text size="xs" fw={700} w={30} ta="center">{zoom}%</Text>
                                <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => setZoom(Math.min(200, zoom + 10))}><IconPlus size={14} /></ActionIcon>
                            </Group>
                        </Paper>
                    </Group>
                </Box>
            </Box>

            {/* SIDEBAR */}
            <Box style={{ width: isMobile ? '100%' : 420, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
                <Box p="xl" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <Title order={3} fw={900} style={{ fontFamily: 'Montserrat, sans-serif', color: '#0B3022' }}>Personaliza tu Prenda</Title>
                </Box>

                <Tabs value={activeTab} onChange={(v) => setActiveTab(v as TabType)} variant="unstyled">
                    <Tabs.List grow>
                        <Tabs.Tab value="product" style={{ flex: 1, padding: '16px', backgroundColor: activeTab === 'product' ? '#0B3022' : 'transparent', borderBottom: activeTab === 'product' ? '4px solid #D4AF37' : '1px solid #eee' }}>
                            <Stack gap={4} align="center"><IconShirt size={26} color={activeTab === 'product' ? 'white' : 'gray'} /><Text size="10px" fw={800} c={activeTab === 'product' ? 'white' : 'dimmed'}>PRENDA</Text></Stack>
                        </Tabs.Tab>
                        <Tabs.Tab value="text" style={{ flex: 1, padding: '16px', backgroundColor: activeTab === 'text' ? '#0B3022' : 'transparent', borderBottom: activeTab === 'text' ? '4px solid #D4AF37' : '1px solid #eee' }}>
                            <Stack gap={4} align="center"><IconTypography size={26} color={activeTab === 'text' ? 'white' : 'gray'} /><Text size="10px" fw={800} c={activeTab === 'text' ? 'white' : 'dimmed'}>TEXTO</Text></Stack>
                        </Tabs.Tab>
                        <Tabs.Tab value="image" style={{ flex: 1, padding: '16px', backgroundColor: activeTab === 'image' ? '#0B3022' : 'transparent', borderBottom: activeTab === 'image' ? '4px solid #D4AF37' : '1px solid #eee' }}>
                            <Stack gap={4} align="center"><IconPhoto size={26} color={activeTab === 'image' ? 'white' : 'gray'} /><Text size="10px" fw={800} c={activeTab === 'image' ? 'white' : 'dimmed'}>SUBIR</Text></Stack>
                        </Tabs.Tab>
                        <Tabs.Tab value="designs" style={{ flex: 1, padding: '16px', backgroundColor: activeTab === 'designs' ? '#0B3022' : 'transparent', borderBottom: activeTab === 'designs' ? '4px solid #D4AF37' : '1px solid #eee' }}>
                            <Stack gap={4} align="center"><IconBolt size={26} color={activeTab === 'designs' ? 'white' : 'gray'} /><Text size="10px" fw={800} c={activeTab === 'designs' ? 'white' : 'dimmed'}>DISEÑOS</Text></Stack>
                        </Tabs.Tab>
                    </Tabs.List>

                    <Box p="xl" style={{ flex: 1, overflowY: 'auto', minHeight: isMobile ? 'unset' : 600 }}>
                        <Tabs.Panel value="product">
                            <Stack gap="lg">
                                <Select label="PRENDA" data={availableProducts.map(p => ({ label: p.name, value: p.id }))} value={product.id} onChange={(v) => { const found = availableProducts.find(p => p.id === v); if (found) setProduct(found); }} />
                                <Box>
                                    <Text size="xs" fw={700} mb={8}>COLOR DE PRENDA ({gender})</Text>
                                    <Group gap="xs" mb="md">
                                        {variantColors.map(c => (
                                            <Tooltip label={c.label} key={c.value}>
                                                <ActionIcon 
                                                    radius="xl" 
                                                    size={32} 
                                                    onClick={() => setColor(c.value)} 
                                                    style={{ 
                                                        backgroundColor: c.value, 
                                                        border: color.toUpperCase() === c.value.toUpperCase() ? '2px solid #0B3022' : '1px solid #eee',
                                                        boxShadow: color.toUpperCase() === c.value.toUpperCase() ? '0 0 0 2px #fff, 0 0 0 4px #0B3022' : 'none'
                                                    }} 
                                                />
                                            </Tooltip>
                                        ))}
                                    </Group>
                                    <Divider label="O Color Personalizado" labelPosition="center" mb="sm" />
                                    <ColorInput 
                                        value={color} 
                                        onChange={setColor} 
                                        placeholder="#000000" 
                                        radius="md"
                                        size="sm"
                                        styles={{ input: { fontFamily: 'Montserrat, sans-serif', fontWeight: 600 } }}
                                    />
                                </Box>
                                <Button variant="light" color="red" leftSection={<IconRefresh size={16} />} onClick={() => window.confirm('¿Borrar todo?') && setElementsMap({ front: [], back: [] })}>Limpiar Todo el Diseño</Button>
                            </Stack>
                        </Tabs.Panel>
                        <Tabs.Panel value="text">
                            <Stack gap="lg">
                                <Button onClick={addText} leftSection={<IconPlus size={18} />} color="#0B3022" fullWidth>Añadir Texto</Button>
                                {elements.filter(el => el.type === 'text').map((el, idx) => (
                                    <Paper key={el.id} withBorder p="sm" radius="md" style={{ cursor: 'pointer', borderColor: selectedId === el.id ? '#0B3022' : '#eee' }} onClick={() => setSelectedId(el.id)}><Group justify="space-between"><Box><Text size="xs" fw={800} c="dimmed">TEXTO {idx + 1}</Text><Text size="sm" fw={600} truncate w={200}>{el.content}</Text></Box><IconTypography size={16} color="gray" /></Group></Paper>
                                ))}
                                {selectedId && selectedElement?.type === 'text' && (
                                    <Stack gap="md" mt="xl" p="md" style={{ backgroundColor: '#F8F9FA', borderRadius: '12px' }}>
                                        <textarea value={selectedElement.content} onChange={(e) => updateElement(selectedId, { content: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                        <Select label="FUENTE" data={FONTS} value={selectedElement.fontFamily} onChange={(v) => updateElement(selectedId, { fontFamily: v || '' })} />
                                        <ColorInput label="COLOR" value={selectedElement.color} onChange={(v) => updateElement(selectedId, { color: v })} />
                                        <Box><Text size="xs" fw={700}>TAMAÑO ({selectedElement.fontSize})</Text><Slider value={selectedElement.fontSize} onChange={(v) => updateElement(selectedId, { fontSize: v })} min={10} max={120} label={null} /></Box>
                                    </Stack>
                                )}
                            </Stack>
                        </Tabs.Panel>
                        <Tabs.Panel value="image">
                            <Stack gap="lg">
                                <FileButton onChange={handleImageUpload} accept="image/*">{(p) => <Button {...p} variant="outline" color="#0B3022" leftSection={<IconUpload size={18} />}>Subir Imagen</Button>}</FileButton>
                                <SimpleGrid cols={3} spacing="xs">{uploadedImages.map((u, i) => (<Paper key={i} withBorder p={4} radius="md" onClick={() => addImage(u)} style={{ cursor: 'pointer', height: 80 }}><img src={u} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></Paper>))}</SimpleGrid>
                                <Divider label="Opciones" labelPosition="center" />
                                <Button variant="light" color="#0B3022" onClick={saveToGallery} leftSection={<IconBolt size={16} />}>Guardar Todo como Plantilla</Button>
                            </Stack>
                        </Tabs.Panel>
                        <Tabs.Panel value="designs">
                            <Stack gap="md">
                                <Text size="xs" fw={700} c="dimmed">MIS PLANTILLAS GUARDADAS</Text>
                                {savedDesigns.length === 0 ? (
                                    <Paper p="xl" withBorder radius="md" bg="gray.0" style={{ borderStyle: 'dashed' }}>
                                        <Stack gap={8} align="center">
                                            <IconSparkles size={24} color="gray" />
                                            <Text size="sm" c="dimmed" ta="center">No tienes diseños guardados aún. Usa "Guardar Todo como Plantilla" en la pestaña de SUBIR.</Text>
                                        </Stack>
                                    </Paper>
                                ) : (
                                    <SimpleGrid cols={1} spacing="xs">
                                        {savedDesigns.map((d) => (
                                            <Paper key={d.id} withBorder p="md" radius="md" style={{ cursor: 'pointer' }} className="hover:bg-gray-50">
                                                <Group justify="space-between">
                                                    <Box onClick={() => applyLibraryDesign(d)} style={{ flex: 1 }}>
                                                        <Text fw={800} size="sm">{d.name}</Text>
                                                        <Text size="10px" c="dimmed">{new Date(d.timestamp).toLocaleDateString()}</Text>
                                                    </Box>
                                                    <ActionIcon variant="subtle" color="red" size="sm" onClick={() => deleteFromGallery(d.id)}>
                                                        <IconTrash size={14} />
                                                    </ActionIcon>
                                                </Group>
                                            </Paper>
                                        ))}
                                    </SimpleGrid>
                                )}
                            </Stack>
                        </Tabs.Panel>
                    </Box>
                </Tabs>
                <Box p="xl" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}><Text size="xs" fw={700} c="dimmed" ta="center">DISEÑO AUTOGUARDADO LISTO PARA ENVIAR</Text></Box>
            </Box>
        </Box>
    );
};
