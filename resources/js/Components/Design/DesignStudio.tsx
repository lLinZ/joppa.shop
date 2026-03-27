import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Box, Paper, Text, Stack, ActionIcon, Button, Tabs, ColorInput, Select, Slider, FileInput, Transition, Group, Card, SimpleGrid, rem, Tooltip, Title, FileButton } from '@mantine/core';
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
        Caballero: ProductAssets;
        Dama: ProductAssets;
    };
}

const PRODUCTS: ProductType[] = [
    { 
        id: 'hoodie', 
        name: 'Hoodie Premium', 
        basePrice: 35,
        assets: {
            Caballero: {
                front: '/images/custom_design_builder/hoodie_sin_fondo_front.png',
                back: '/images/custom_design_builder/hoodie_sin_fondo_back.png'
            },
            Dama: {
                front: '/images/custom_design_builder/hoodie_sin_fondo_front.png',
                back: '/images/custom_design_builder/hoodie_sin_fondo_back.png'
            }
        }
    },
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
    }
];

const COLORS = [
    { label: 'Negro', value: '#1A1A1A' },
    { label: 'Blanco', value: '#FFFFFF' },
    { label: 'Beige', value: '#D5BEA4' },
    { label: 'Azul', value: '#1F2640' },
    // { label: 'Verde Bosque', value: '#0B3022' },
];

const FONTS = [
    { label: 'Montserrat', value: 'Montserrat, sans-serif' },
    { label: 'Bebas Neue', value: 'Bebas Neue, display' },
    { label: 'Caveat', value: 'Caveat, cursive' },
    { label: 'Playfair Display', value: 'Playfair Display, serif' },
];

export interface DesignStudioProps {
    gender: 'Caballero' | 'Dama';
    onSave: (data: any) => void;
    crmApiUrl?: string;
}

const VCS_WIDTH = 1000;
const VCS_HEIGHT = 1100;

export const DesignStudio: React.FC<DesignStudioProps> = ({ gender, onSave, crmApiUrl }) => {
    const [elementsMap, setElementsMap] = useState<Record<'front' | 'back', DesignElement[]>>({
        front: [],
        back: []
    });
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [product, setProduct] = useState(PRODUCTS[0]);
    const [color, setColor] = useState(COLORS[0].value);
    const [view, setView] = useState<'front' | 'back'>('front');
    const [activeTab, setActiveTab] = useState<TabType | null>('text');
    const [zoom, setZoom] = useState(100);
    const [studioScale, setStudioScale] = useState(1);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);
    const onSaveRef = useRef(onSave);
    useEffect(() => { onSaveRef.current = onSave; }, [onSave]);

    const elements = elementsMap[view];

    // Responsive scaling logic for VCS container
    const parentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const updateScale = () => {
            if (!parentRef.current) return;
            const PADDING = 40;
            const availableW = parentRef.current.clientWidth - PADDING;
            const availableH = parentRef.current.clientHeight - PADDING;
            
            const scale = Math.min(availableW / VCS_WIDTH, availableH / VCS_HEIGHT);
            setStudioScale(scale);
        };

        const observer = new ResizeObserver(updateScale);
        if (parentRef.current) observer.observe(parentRef.current);
        updateScale(); // Initial call
        
        return () => observer.disconnect();
    }, []);

    // Helper to get next zIndex
    const getNextZIndex = () => {
        const allElements = [...elementsMap.front, ...elementsMap.back];
        if (allElements.length === 0) return 10;
        return Math.max(...allElements.map(el => el.zIndex)) + 1;
    };

    // Auto-save whenever elements or configuration change
    useEffect(() => {
        onSaveRef.current({ 
            elements: elementsMap, 
            product, 
            color,
            view
        });
    }, [elementsMap, product, color, view]);

    const addText = () => {
        const newEl: DesignElement = {
            id: Math.random().toString(),
            type: 'text',
            content: 'NUEVA AVENTURA',
            x: 250, // Center in 1000 VCS
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

        // 1. Show temporary blob for instant feedback
        const tempUrl = URL.createObjectURL(file);
        addImage(tempUrl);

        try {
            // 2. Upload to CRM for permanent storage
            const formData = new FormData();
            formData.append('file', file);

            const uploadUrl = crmApiUrl ? `${crmApiUrl}/design-assets` : 'http://localhost:8001/api/design-assets';
            const response = await axios.post(uploadUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.url) {
                // 3. Update all elements that use this temporary blob with the permanent CRM URL
                setElementsMap(prev => {
                    const updateList = (list: DesignElement[]) => 
                        list.map(el => el.content === tempUrl ? { ...el, content: response.data.url } : el);
                    
                    return {
                        front: updateList(prev.front),
                        back: updateList(prev.back)
                    };
                });
                setUploadedImages(prev => {
                    const filtered = prev.filter(u => u !== tempUrl);
                    return Array.from(new Set([...filtered, response.data.url]));
                });
            }
        } catch (err) {
            console.error('Error uploading design asset:', err);
            // Optional: Show notification error
        }
    };

    const addImage = (url: string) => {
        setUploadedImages(prev => Array.from(new Set([...prev, url])));
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

    // Layering controls
    const moveZ = (direction: 'front' | 'back' | 'top' | 'bottom') => {
        if (!selectedId) return;
        const currentElements = [...elements];
        const index = currentElements.findIndex(el => el.id === selectedId);
        if (index === -1) return;

        const newElements = [...currentElements];
        const el = newElements.splice(index, 1)[0];

        if (direction === 'top') {
            newElements.push(el);
        } else if (direction === 'bottom') {
            newElements.unshift(el);
        } else if (direction === 'front' && index < currentElements.length - 1) {
            newElements.splice(index + 1, 0, el);
        } else if (direction === 'back' && index > 0) {
            newElements.splice(index - 1, 0, el);
        } else {
            newElements.splice(index, 0, el);
        }

        // Re-assign z-indices based on order
        const reindexed = newElements.map((item, idx) => ({ ...item, zIndex: 10 + idx }));
        setElementsMap(prev => ({ ...prev, [view]: reindexed }));
    };

    const selectedElement = elements.find(el => el.id === selectedId);
    
    // Get current asset based on gender and view
    const currentAssetUrl = (product.assets[gender] as any)[view] || product.assets[gender].front;

    return (
        <Box 
            style={{ 
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch',
                gap: 0, 
                height: '840px', 
                backgroundColor: '#F7F8F9', 
                borderRadius: 32,
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.04)'
            }}
        >
            
            {/* CANVAS AREA (LEFT) */}
            <Box 
                ref={parentRef}
                style={{ 
                    flex: 1, 
                    position: 'relative', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    backgroundColor: '#FFFFFF', 
                    borderRight: '1px solid rgba(0,0,0,0.05)', 
                    minWidth: 400, 
                    overflow: 'hidden' 
                }}
            >
                <Box 
                    style={{ 
                        width: VCS_WIDTH, 
                        height: VCS_HEIGHT, 
                        position: 'relative', 
                        transform: `scale(${studioScale * (zoom / 100)})`,
                        transformOrigin: 'center center',
                        transition: 'transform 0.1s ease',
                        flexShrink: 0,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        backgroundColor: '#fff'
                    }}
                >
                    {/* Visual Printable Area Guide */}
                    <Box style={{ 
                        position: 'absolute', 
                        top: '25%', 
                        left: '26%', 
                        width: '48%', 
                        height: '54%', 
                        border: '1px dashed rgba(0,0,0,0.1)', 
                        pointerEvents: 'none',
                        zIndex: 1
                    }} />

                    {/* LAYER 1: BASE IMAGE (BOTTOM) */}
                    <img 
                        src={currentAssetUrl} 
                        alt="T-shirt Base" 
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                    
                    {/* LAYER 2: COLOR OVERLAY (Clamped to alpha) */}
                    <Box 
                        style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '100%', 
                            backgroundColor: color, 
                            maskImage: `url(${currentAssetUrl})`,
                            maskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskImage: `url(${currentAssetUrl})`,
                            WebkitMaskSize: 'contain',
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            mixBlendMode: 'multiply',
                            transition: 'background-color 0.5s ease',
                            opacity: 0.9
                        }} 
                    />

                    {/* LAYER 3: SHADOWS & HIGHLIGHTS (TOP MULTIPLY) */}
                    <img 
                        src={currentAssetUrl} 
                        alt="T-shirt Texture" 
                        style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'contain', 
                            mixBlendMode: 'multiply',
                            filter: 'brightness(1.1) contrast(1.1)',
                            opacity: 0.9,
                            pointerEvents: 'none'
                        }}
                    />

                    <Box style={{ 
                        position: 'absolute', 
                        top: '25%', 
                        left: '26%', 
                        width: '48%', 
                        height: '54%', 
                        border: '1px dashed rgba(212,175,55,0.3)', 
                        pointerEvents: 'none',
                        borderRadius: '4px',
                        zIndex: 1
                    }}>
                    </Box>

                    <Box 
                        ref={containerRef}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}
                        onMouseDown={(e: React.MouseEvent) => {
                            if (e.target === e.currentTarget) {
                                setSelectedId(null);
                            }
                        }}
                    >
                        {elements.map((el) => (
                            <Rnd
                                key={el.id}
                                scale={studioScale * (zoom / 100)}
                                size={{ width: el.width, height: el.height }}
                                position={{ x: el.x, y: el.y }}
                                onDragStart={() => setSelectedId(el.id)}
                                onDragStop={(e: any, d: any) => updateElement(el.id, { x: d.x, y: d.y })}
                                onResizeStop={(e: any, direction: any, ref: any, delta: any, position: any) => {
                                    const newWidth = ref.offsetWidth;
                                    const newHeight = ref.offsetHeight;
                                    
                                    let updates: Partial<DesignElement> = {
                                        width: newWidth,
                                        height: newHeight,
                                        ...position,
                                    };

                                    if (el.type === 'text' && el.fontSize && ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].includes(direction)) {
                                        // Auto-scale font size ONLY based on height change during CORNER resize
                                        const scale = newHeight / el.height;
                                        updates.fontSize = Math.max(10, Math.min(150, Math.round(el.fontSize * scale)));
                                    }

                                    updateElement(el.id, updates);
                                }}
                                style={{
                                    zIndex: el.zIndex,
                                    cursor: 'move',
                                }}
                                resizeHandleStyles={{
                                    bottomRight: { width: 12, height: 12, background: '#228be6', border: '2px solid white', borderRadius: '50%', right: -6, bottom: -6, display: selectedId === el.id ? 'block' : 'none', boxShadow: '0 0 5px rgba(0,0,0,0.3)', zIndex: 1001 },
                                    bottomLeft: { width: 12, height: 12, background: '#228be6', border: '2px solid white', borderRadius: '50%', left: -6, bottom: -6, display: selectedId === el.id ? 'block' : 'none', boxShadow: '0 0 5px rgba(0,0,0,0.3)', zIndex: 1001 },
                                    topRight: { width: 12, height: 12, background: '#228be6', border: '2px solid white', borderRadius: '50%', right: -6, top: -6, display: selectedId === el.id ? 'block' : 'none', boxShadow: '0 0 5px rgba(0,0,0,0.3)', zIndex: 1001 },
                                    topLeft: { width: 12, height: 12, background: '#228be6', border: '2px solid white', borderRadius: '50%', left: -6, top: -6, display: selectedId === el.id ? 'block' : 'none', boxShadow: '0 0 5px rgba(0,0,0,0.3)', zIndex: 1001 },
                                }}
                                onMouseDownCapture={() => setSelectedId(el.id)}
                            >
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'relative',
                                    rotate: `${el.rotation}deg`,
                                    transformOrigin: 'center center',
                                    border: selectedId === el.id ? '2px solid #228be6' : '1px solid transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: selectedId === el.id ? 'rgba(34, 139, 230, 0.05)' : 'transparent',
                                    transition: 'all 0.2s ease',
                                    borderRadius: '2px'
                                }}>
                                    {/* FLOATING QUICK ACTIONS */}
                                    {selectedId === el.id && (
                                        <Group 
                                            gap={4} 
                                            style={{ 
                                                position: 'absolute', 
                                                top: -45, 
                                                right: -15, 
                                                zIndex: 2000,
                                                rotate: `-${el.rotation}deg` // Keep icon upright
                                            }}
                                        >
                                            <ActionIcon 
                                                color="red" 
                                                variant="filled" 
                                                size="sm" 
                                                radius="xl"
                                                onClick={(e) => { e.stopPropagation(); removeElement(el.id); }}
                                                style={{ boxShadow: '0 4px 12px rgba(250, 82, 82, 0.3)' }}
                                            >
                                                <IconTrash size={14} />
                                            </ActionIcon>
                                        </Group>
                                    )}

                                    {el.type === 'image' ? (
                                        <img 
                                            src={el.content} 
                                            alt="Design"
                                            style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none', userSelect: 'none' }} 
                                        />
                                    ) : (
                                        <div style={{ 
                                            color: el.color, 
                                            fontSize: `${el.fontSize}px`, 
                                            fontFamily: el.fontFamily,
                                            fontWeight: 'bold',
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                            textAlign: 'center',
                                            lineHeight: 1.1,
                                            letterSpacing: `${el.letterSpacing}px`,
                                            pointerEvents: 'none',
                                            userSelect: 'none'
                                        }}>
                                            {el.content}
                                        </div>
                                    )}
                                </div>
                            </Rnd>
                        ))}
                    </Box>
                </Box>

                {/* VIEW & ZOOM CONTROLS */}
                <Group style={{ position: 'absolute', bottom: 32 }} gap="xl">
                    <Paper shadow="sm" radius="xl" withBorder p={4}>
                         <Group gap={4}>
                            <Button 
                                variant={view === 'front' ? 'filled' : 'subtle'} 
                                color="#0B3022" 
                                size="compact-md" 
                                onClick={() => setView('front')}
                                radius="xl"
                                fw={700}
                                leftSection={<IconRefresh size={14} />}
                            >
                                FRONT
                            </Button>
                            <Button 
                                variant={view === 'back' ? 'filled' : 'subtle'} 
                                color="#0B3022" 
                                size="compact-md" 
                                onClick={() => setView('back')}
                                radius="xl"
                                fw={700}
                            >
                                BACK
                            </Button>
                         </Group>
                    </Paper>

                    <Paper shadow="sm" radius="xl" withBorder p={4}>
                        <Group gap={8} p="0 12px">
                             <ActionIcon variant="subtle" color="gray" onClick={() => setZoom(Math.max(50, zoom - 10))}><IconMinus size={16} /></ActionIcon>
                             <Text size="xs" fw={700} w={40} ta="center">{zoom}%</Text>
                             <ActionIcon variant="subtle" color="gray" onClick={() => setZoom(Math.min(200, zoom + 10))}><IconPlus size={16} /></ActionIcon>
                        </Group>
                    </Paper>
                </Group>
            </Box>

            {/* SIDEBAR (RIGHT) */}
            <Box style={{ width: 420, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
                <Box p="xl" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <Title order={3} fw={900} style={{ fontFamily: 'Montserrat, sans-serif', color: '#0B3022' }}>Crea tu diseño</Title>
                </Box>

                <Tabs 
                    value={activeTab} 
                    onChange={(val) => {
                        const newTab = val as TabType;
                        setActiveTab(newTab);
                        
                        // Auto-deselect if the new tab category doesn't match the selected element
                        if (selectedId) {
                            const allElements = [...elementsMap.front, ...elementsMap.back];
                            const el = allElements.find(e => e.id === selectedId);
                            
                            if (el) {
                                if (el.type === 'text' && newTab !== 'text') {
                                    setSelectedId(null);
                                } else if (el.type === 'image' && newTab !== 'image' && newTab !== 'designs') {
                                    setSelectedId(null);
                                }
                            }
                        }
                    }} 
                    variant="unstyled"
                >
                    <Tabs.List grow>
                        <Tabs.Tab 
                            value="product" 
                            style={{ 
                                flex: 1,
                                height: 90,
                                backgroundColor: activeTab === 'product' ? '#0B3022' : 'transparent',
                                borderBottom: activeTab === 'product' ? '4px solid #D4AF37' : '1px solid #eee',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                            }}
                        >
                            <Stack gap={4} align="center">
                                <ActionIcon 
                                    size={40} 
                                    variant="transparent" 
                                    color={activeTab === 'product' ? 'white' : 'gray'}
                                    style={{ pointerEvents: 'none' }}
                                >
                                    <IconShirt size={26} />
                                </ActionIcon>
                                <Text 
                                    size="10px"
                                    fw={800} 
                                    c={activeTab === 'product' ? 'white' : 'dimmed'} 
                                    style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                >
                                    Prenda
                                </Text>
                            </Stack>
                        </Tabs.Tab>

                        <Tabs.Tab 
                            value="text" 
                            style={{ 
                                flex: 1,
                                height: 90,
                                backgroundColor: activeTab === 'text' ? '#0B3022' : 'transparent',
                                borderBottom: activeTab === 'text' ? '4px solid #D4AF37' : '1px solid #eee',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                            }}
                        >
                            <Stack gap={4} align="center">
                                <ActionIcon 
                                    size={40} 
                                    variant="transparent" 
                                    color={activeTab === 'text' ? 'white' : 'gray'}
                                    style={{ pointerEvents: 'none' }}
                                >
                                    <IconTypography size={26} />
                                </ActionIcon>
                                <Text 
                                    size="10px"
                                    fw={800} 
                                    c={activeTab === 'text' ? 'white' : 'dimmed'} 
                                    style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                >
                                    Texto
                                </Text>
                            </Stack>
                        </Tabs.Tab>

                        <Tabs.Tab 
                            value="image" 
                            style={{ 
                                flex: 1,
                                height: 90,
                                backgroundColor: activeTab === 'image' ? '#0B3022' : 'transparent',
                                borderBottom: activeTab === 'image' ? '4px solid #D4AF37' : '1px solid #eee',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                            }}
                        >
                            <Stack gap={4} align="center">
                                <ActionIcon 
                                    size={40} 
                                    variant="transparent" 
                                    color={activeTab === 'image' ? 'white' : 'gray'}
                                    style={{ pointerEvents: 'none' }}
                                >
                                    <IconPhoto size={26} />
                                </ActionIcon>
                                <Text 
                                    size="10px"
                                    fw={800} 
                                    c={activeTab === 'image' ? 'white' : 'dimmed'} 
                                    style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                >
                                    Subir
                                </Text>
                            </Stack>
                        </Tabs.Tab>

                        <Tabs.Tab 
                            value="designs" 
                            style={{ 
                                flex: 1,
                                height: 90,
                                backgroundColor: activeTab === 'designs' ? '#0B3022' : 'transparent',
                                borderBottom: activeTab === 'designs' ? '4px solid #D4AF37' : '1px solid #eee',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                            }}
                        >
                            <Stack gap={4} align="center">
                                <ActionIcon 
                                    size={40} 
                                    variant="transparent" 
                                    color={activeTab === 'designs' ? 'white' : 'gray'}
                                    style={{ pointerEvents: 'none' }}
                                >
                                    <IconBolt size={26} />
                                </ActionIcon>
                                <Text 
                                    size="10px"
                                    fw={800} 
                                    c={activeTab === 'designs' ? 'white' : 'dimmed'} 
                                    style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                >
                                    Diseños
                                </Text>
                            </Stack>
                        </Tabs.Tab>
                    </Tabs.List>

                    <Box p="xl" style={{ flex: 1, overflowY: 'auto', minHeight: 650 }}>
                        {/* PRODUCT SELECTOR */}
                        <Tabs.Panel value="product">
                             <Stack gap="lg">
                                <Select 
                                    label="TIPO DE PRENDA"
                                    placeholder="Selecciona una prenda"
                                    data={PRODUCTS.map(p => ({ label: p.name, value: p.id }))}
                                    value={product.id}
                                    onChange={(v: string | null) => setProduct(PRODUCTS.find(p => p.id === v) || PRODUCTS[0])}
                                    variant="filled"
                                    radius="md"
                                />
                                <Box>
                                    <Text size="xs" fw={700} c="#0B3022" mb="md" style={{ letterSpacing: '0.05em' }}>COLOR</Text>
                                    <Group gap="sm">
                                        {COLORS.map(c => (
                                            <Tooltip key={c.value} label={c.label}>
                                                <ActionIcon 
                                                    radius="xl"
                                                    size={38}
                                                    onClick={() => setColor(c.value)}
                                                    style={{ 
                                                        backgroundColor: c.value, 
                                                        border: color === c.value ? '2px solid #0B3022' : '1px solid #eee',
                                                        outline: color === c.value ? '2px solid #0B3022' : 'none',
                                                        outlineOffset: '2px'
                                                    }}
                                                />
                                            </Tooltip>
                                        ))}
                                    </Group>
                                </Box>
                             </Stack>
                        </Tabs.Panel>

                        {/* TEXT EDITOR */}
                        <Tabs.Panel value="text">
                            <Stack gap="lg">
                                <Button onClick={addText} leftSection={<IconPlus size={18} />} variant="filled" color="#0B3022" fullWidth radius="md" size="lg">
                                    Añadir Texto
                                </Button>
                                
                                {selectedElement?.type !== 'text' && elements.some(el => el.type === 'text') && (
                                    <Box mt="xs">
                                        <Text size="xs" fw={700} c="#0B3022" mb="sm">TEXTOS EN EL DISEÑO</Text>
                                        <Stack gap="xs">
                                            {elements.filter(el => el.type === 'text').map(el => (
                                                <Paper 
                                                    key={el.id} 
                                                    withBorder 
                                                    p="sm" 
                                                    radius="md" 
                                                    style={{ cursor: 'pointer', transition: 'all 0.2s', backgroundColor: '#F8F9FA' }}
                                                    onClick={() => setSelectedId(el.id)}
                                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0B3022'}
                                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'}
                                                >
                                                    <Group justify="space-between">
                                                        <Text size="sm" fw={600} truncate style={{ maxWidth: 220 }}>{el.content}</Text>
                                                        <IconTypography size={16} color="gray" />
                                                    </Group>
                                                </Paper>
                                            ))}
                                        </Stack>
                                    </Box>
                                )}

                                {selectedElement?.type === 'text' && (
                                    <Stack gap="md">
                                        <Box>
                                            <Text size="xs" fw={700} c="#0B3022" mb="xs" style={{ letterSpacing: '0.05em' }}>EDITAR TEXTO</Text>
                                            <textarea 
                                                value={selectedElement.content} 
                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateElement(selectedId!, { content: e.target.value })}
                                                style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #ddd', backgroundColor: '#F8F9FA', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', minHeight: '80px', resize: 'none' }}
                                            />
                                        </Box>
                                        
                                        <SimpleGrid cols={2} spacing="md">
                                            <Select 
                                                label="FUENTE"
                                                data={FONTS}
                                                value={selectedElement.fontFamily}
                                                onChange={(v: string | null) => updateElement(selectedId!, { fontFamily: v || '' })}
                                                variant="filled"
                                                radius="md"
                                                size="sm"
                                            />
                                            <Box>
                                                <Text size="xs" fw={700} c="dimmed" mb={4}>COLOR</Text>
                                                <ColorInput 
                                                    value={selectedElement.color}
                                                    onChange={(v: string) => updateElement(selectedId!, { color: v })}
                                                    variant="filled"
                                                    radius="md"
                                                    size="sm"
                                                />
                                            </Box>
                                        </SimpleGrid>

                                        <Box>
                                            <Group justify="space-between" mb="xs">
                                                <Text size="xs" fw={700} c="#0B3022">TAMAÑO</Text>
                                                <Text size="xs" fw={700}>{selectedElement.fontSize}</Text>
                                            </Group>
                                            <Slider 
                                                value={selectedElement.fontSize} 
                                                onChange={(v: number) => updateElement(selectedId!, { fontSize: v })}
                                                min={10} max={120}
                                                color="#0B3022"
                                                label={null}
                                            />
                                        </Box>

                                        <Box>
                                            <Text size="xs" fw={700} c="#0B3022" mb="xs">ESPACIADO</Text>
                                            <Slider 
                                                value={selectedElement.letterSpacing} 
                                                onChange={(v: number) => updateElement(selectedId!, { letterSpacing: v })}
                                                min={-5} max={40}
                                                color="#0B3022"
                                                label={null}
                                            />
                                        </Box>

                                        <Box>
                                            <Text size="xs" fw={700} c="#0B3022" mb="xs">ROTACIÓN</Text>
                                            <Slider 
                                                value={selectedElement.rotation} 
                                                onChange={(v) => updateElement(selectedId!, { rotation: v })}
                                                min={0} max={360}
                                                color="#0B3022"
                                                label={null}
                                            />
                                        </Box>

                                        <Box mt="sm">
                                            <Button variant="outline" color="#0B3022" fullWidth leftSection={<IconArrowsSort size={16} />} onClick={() => updateElement(selectedId!, { width: 500, height: 100, rotation: 0, fontSize: 40, letterSpacing: 2 })} radius="md" mb="lg">
                                                Poner Default
                                            </Button>

                                            <Text size="xs" fw={700} c="#0B3022" mb="xs">ORGANIZAR</Text>
                                            <Group grow gap="xs">
                                                <Tooltip label="Atrás"><ActionIcon variant="light" color="gray" size="lg" onClick={() => moveZ('back')}><IconArrowBackUp size={20} /></ActionIcon></Tooltip>
                                                <Tooltip label="Al Fondo"><ActionIcon variant="light" color="gray" size="lg" onClick={() => moveZ('bottom')}><IconArrowBarToDown size={20} /></ActionIcon></Tooltip>
                                                <Tooltip label="Adelante"><ActionIcon variant="light" color="gray" size="lg" onClick={() => moveZ('front')}><IconArrowForwardUp size={20} /></ActionIcon></Tooltip>
                                                <Tooltip label="Al Frente"><ActionIcon variant="light" color="gray" size="lg" onClick={() => moveZ('top')}><IconArrowBarToUp size={20} /></ActionIcon></Tooltip>
                                            </Group>
                                        </Box>

                                        <Button variant="subtle" color="red" mt="md" leftSection={<IconTrash size={16} />} onClick={() => removeElement(selectedId!)} radius="md">
                                            Eliminar Texto
                                        </Button>
                                    </Stack>
                                )}
                            </Stack>
                        </Tabs.Panel>

                        {/* IMAGE UPLOADER */}
                        <Tabs.Panel value="image">
                            <Stack gap="lg">
                                <FileButton 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                >
                                    {(props) => (
                                        <Paper 
                                            {...props}
                                            p="xl" 
                                            radius="xl" 
                                            withBorder 
                                            style={{ 
                                                borderStyle: 'dashed', 
                                                backgroundColor: '#F8F9FA', 
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <Stack gap="sm" align="center">
                                                <IconUpload size={40} stroke={1} color="#adb5bd" />
                                                <Text size="sm" fw={700} ta="center">Haz clic o arrastra para subir</Text>
                                            </Stack>
                                        </Paper>
                                    )}
                                </FileButton>

                                {uploadedImages.length > 0 && (
                                    <Box mt="sm">
                                        <Text size="xs" fw={700} c="#0B3022" mb="sm">GALERÍA DE SUBIDAS</Text>
                                        <SimpleGrid cols={3} spacing="xs">
                                            {uploadedImages.map((url, idx) => (
                                                <Paper 
                                                    key={idx} 
                                                    withBorder 
                                                    p={6} 
                                                    radius="md" 
                                                    style={{ cursor: 'pointer', transition: 'border-color 0.2s ease', height: 80 }}
                                                    onClick={() => addImage(url)}
                                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0B3022'}
                                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'}
                                                >
                                                    <img src={url} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                </Paper>
                                            ))}
                                        </SimpleGrid>
                                    </Box>
                                )}

                                {selectedElement?.type === 'image' && (
                                    <Stack gap="md" mt="sm">
                                        <Button variant="outline" color="#0B3022" leftSection={<IconArrowsSort size={16} />} onClick={() => updateElement(selectedId!, { width: 200, height: 200, rotation: 0 })} radius="md">
                                            Poner Default
                                        </Button>

                                        <Text size="xs" fw={700} c="#0B3022" mb="xs">ORGANIZAR</Text>
                                        <Group grow gap="xs">
                                            <Tooltip label="Atrás"><ActionIcon variant="light" color="gray" size="lg" onClick={() => moveZ('back')}><IconArrowBackUp size={20} /></ActionIcon></Tooltip>
                                            <Tooltip label="Al Fondo"><ActionIcon variant="light" color="gray" size="lg" onClick={() => moveZ('bottom')}><IconArrowBarToDown size={20} /></ActionIcon></Tooltip>
                                            <Tooltip label="Adelante"><ActionIcon variant="light" color="gray" size="lg" onClick={() => moveZ('front')}><IconArrowForwardUp size={20} /></ActionIcon></Tooltip>
                                            <Tooltip label="Al Frente"><ActionIcon variant="light" color="gray" size="lg" onClick={() => moveZ('top')}><IconArrowBarToUp size={20} /></ActionIcon></Tooltip>
                                        </Group>
                                        
                                        <Box>
                                            <Text size="xs" fw={700} c="#0B3022" mb="xs">ROTACIÓN</Text>
                                            <Slider 
                                                value={selectedElement.rotation} 
                                                onChange={(v) => updateElement(selectedId!, { rotation: v })}
                                                min={0} max={360}
                                                color="#0B3022"
                                                label={null}
                                            />
                                        </Box>
                                        <Button variant="subtle" color="red" leftSection={<IconTrash size={16} />} onClick={() => removeElement(selectedId!)} radius="md">
                                            Eliminar Imagen
                                        </Button>
                                    </Stack>
                                )}
                            </Stack>
                        </Tabs.Panel>

                        {/* DESIGNS PANEL (PLACEHOLDER) */}
                        <Tabs.Panel value="designs">
                             <Stack align="center" py="xl" gap="sm">
                                <IconSparkles size={48} color="#D4AF37" stroke={1} />
                                <Text fw={700} size="sm">Coming Soon</Text>
                                <Text size="xs" c="dimmed" ta="center">Nuestra colección de diseños predefinidos estará disponible muy pronto.</Text>
                             </Stack>
                        </Tabs.Panel>
                    </Box>
                </Tabs>

                <Box p="xl" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <Text size="xs" fw={700} c="dimmed" ta="center" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Diseño autoguardado listo para enviar
                    </Text>
                </Box>
            </Box>
        </Box>
    );
};
