// <ai_context>
// Propósito: Landing y Formulario Dinámico para Diseños Personalizados.
// Características: Formularios dinámicos con Mantine para prendas múltiples, estética Bento Box y previews en tiempo real.
// </ai_context>

import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { AppShell, Box, Container, Title, Text, Button, Divider, Group, TextInput, Textarea, Select, NumberInput, Card, ActionIcon, FileInput, Image, Loader, Notification, SimpleGrid, rem, Badge, ThemeIcon, Transition, Collapse } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconTrash, IconUpload, IconCheck, IconX, IconPhoto, IconSparkles, IconSettings, IconConfetti, IconBulb, IconPencil, IconRocket } from '@tabler/icons-react';
import axios from 'axios';

import { Header } from '../Components/Layout/Header';
import Footer from '../Components/Layout/Footer';
import CartDrawer from '../Components/UI/Cart/CartDrawer';

const CRM_API_URL = (import.meta.env.VITE_CRM_API_URL as string) || 'http://localhost:8000/api';

const countries = [
    { value: '+58', label: '+58', country: 've' },
    { value: '+1', label: '+1', country: 'us' },
    { value: '+34', label: '+34', country: 'es' },
    { value: '+57', label: '+57', country: 'co' },
    { value: '+56', label: '+56', country: 'cl' },
    { value: '+54', label: '+54', country: 'ar' },
    { value: '+52', label: '+52', country: 'mx' },
    { value: '+51', label: '+51', country: 'pe' },
    { value: '+507', label: '+507', country: 'pa' },
    { value: '+55', label: '+55', country: 'br' },
    { value: '+593', label: '+593', country: 'ec' },
    { value: '+506', label: '+506', country: 'cr' }
];

export default function CustomDesign() {
    const [opened, { toggle }] = useDisclosure(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            phone_prefix: '+58',
            phone_number: '',
            state: '',
            general_comments: '',
            items: [
                { id: Math.random().toString(), gender: 'Unisex', style: 'Oversize', color: 'Negro', size: 'M', quantity: 1, placement: 'frontal' as 'frontal' | 'trasero' | 'doble' | 'pocket', image: null as File | null, image_back: null as File | null }
            ],
        },
        validate: {
            name: (value: string) => (value.length < 2 ? 'El nombre es muy corto' : null),
            email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Correo inválido'),
            phone_number: (v: string) => (v.replace(/\D/g, '').length < 10 ? 'El número debe tener al menos 10 dígitos.' : null),
            state: (v: string) => (!v ? 'Estado requerido' : null),
            items: {
                gender: (value: string) => (!value ? 'Requerido' : null),
                style: (value: string) => (!value ? 'Requerido' : null),
                color: (value: string) => (!value ? 'Requerido' : null),
                size: (value: string) => (!value ? 'Requerido' : null),
                quantity: (value: number) => (value < 1 ? 'Mínimo 1' : null),
                image: (value: File | null) => {
                    if (value && value.size > 5 * 1024 * 1024) return 'Máximo 5MB permitido';
                    return null;
                }
            }
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('email', values.email);

            const fullPhone = `${values.phone_prefix} ${values.phone_number.replace(/\D/g, '')}`;
            formData.append('phone', fullPhone);

            formData.append('state', values.state);
            formData.append('general_comments', values.general_comments || '');

            values.items.forEach((item, index) => {
                formData.append(`items[${index}][gender]`, item.gender);
                formData.append(`items[${index}][style]`, item.style);
                formData.append(`items[${index}][color]`, item.color);
                formData.append(`items[${index}][size]`, item.size);
                formData.append(`items[${index}][quantity]`, item.quantity.toString());
                formData.append(`items[${index}][placement]`, item.placement || 'frontal');
                if (item.image) {
                    formData.append(`items[${index}][image]`, item.image);
                }
                if (item.image_back && item.placement === 'doble') {
                    formData.append(`items[${index}][image_back]`, item.image_back);
                }
            });

            await axios.post(`${CRM_API_URL}/design-requests`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setSuccess(true);
            form.reset();
        } catch (err: any) {
            console.error(err);
            setError('Ocurrió un error al enviar la solicitud. Por favor, intenta de nuevo.');
        } finally {
            setSubmitting(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 10) val = val.slice(0, 10);
        let formatted = val;
        if (val.length > 3 && val.length <= 6) {
            formatted = `${val.slice(0, 3)}-${val.slice(3)}`;
        } else if (val.length > 6) {
            formatted = `${val.slice(0, 3)}-${val.slice(3, 6)}-${val.slice(6)}`;
        }
        form.setFieldValue('phone_number', formatted);
    };

    const addDesignBlock = () => {
        form.insertListItem('items', {
            id: Math.random().toString(),
            gender: 'Unisex',
            style: 'Oversize',
            color: 'Negro',
            size: 'M',
            quantity: 1,
            placement: 'frontal',
            image: null,
            image_back: null,
        });
    };

    // ── T-Shirt Mockup SVG ──────────────────────────────────────────────────────
    const TShirtMockup = ({ placement }: { placement: string }) => {
        const gold = '#D4AF37';
        const goldLight = 'rgba(212,175,55,0.18)';
        const strokeW = 2;

        // Zone visibility
        const showFront  = placement === 'frontal' || placement === 'doble';
        const showBack   = placement === 'trasero';
        const showPocket = placement === 'pocket'  || placement === 'doble';

        return (
            <Box style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                {/* FRONT VIEW */}
                {(showFront || showPocket || !showBack) && (
                    <Box style={{ textAlign: 'center' }}>
                        <Text size="xs" fw={700} c="dimmed" mb={4} style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>Frontal</Text>
                        <svg width="140" height="160" viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* T-Shirt silhouette */}
                            <path d="M30 10 L10 45 L30 50 L30 145 Q30 150 35 150 L105 150 Q110 150 110 145 L110 50 L130 45 L110 10 L90 25 Q70 35 50 25 Z"
                                fill="#1A1A1A" stroke="#333" strokeWidth="1.5" />
                            {/* Collar */}
                            <path d="M50 25 Q70 40 90 25" fill="none" stroke="#444" strokeWidth="1.5" />

                            {/* Frontal full-chest zone */}
                            {showFront && (
                                <rect x="40" y="55" width="60" height="65" rx="6"
                                    fill={goldLight} stroke={gold} strokeWidth={strokeW} strokeDasharray="5 3" />
                            )}

                            {/* Pocket zone */}
                            {showPocket && (
                                <rect x="43" y="58" width="24" height="24" rx="4"
                                    fill={gold} fillOpacity="0.3" stroke={gold} strokeWidth={strokeW} />
                            )}

                            {/* Labels */}
                            {showFront && !showPocket && (
                                <text x="70" y="92" textAnchor="middle" fontSize="9" fill={gold} fontWeight="bold" fontFamily="Montserrat,sans-serif">FRENTE</text>
                            )}
                            {showPocket && (
                                <text x="55" y="73" textAnchor="middle" fontSize="7" fill={gold} fontWeight="bold" fontFamily="Montserrat,sans-serif">POCKET</text>
                            )}
                        </svg>
                    </Box>
                )}

                {/* BACK VIEW */}
                {(showBack || placement === 'doble') && (
                    <Box style={{ textAlign: 'center' }}>
                        <Text size="xs" fw={700} c="dimmed" mb={4} style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>Espalda</Text>
                        <svg width="140" height="160" viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M30 10 L10 45 L30 50 L30 145 Q30 150 35 150 L105 150 Q110 150 110 145 L110 50 L130 45 L110 10 L90 25 Q70 35 50 25 Z"
                                fill="#2a2a2a" stroke="#444" strokeWidth="1.5" />
                            <path d="M50 25 Q70 40 90 25" fill="none" stroke="#555" strokeWidth="1.5" />

                            {/* Back zone */}
                            <rect x="40" y="55" width="60" height="75" rx="6"
                                fill={goldLight} stroke={gold} strokeWidth={strokeW} strokeDasharray="5 3" />
                            <text x="70" y="97" textAnchor="middle" fontSize="9" fill={gold} fontWeight="bold" fontFamily="Montserrat,sans-serif">ESPALDA</text>
                        </svg>
                    </Box>
                )}
            </Box>
        );
    };

    // ── Placement option cards ──────────────────────────────────────────────────
    const PLACEMENTS = [
        { value: 'frontal',  label: 'Frontal',         desc: 'Diseño en el pecho completo',    emoji: '🎨' },
        { value: 'trasero',  label: 'Trasero',          desc: 'Diseño en la espalda completa',  emoji: '🖼️' },
        { value: 'doble',    label: 'Doble',            desc: 'Pocket + Espalda (2 imágenes)',  emoji: '✨' },
        { value: 'pocket',   label: 'Solo Pocket',      desc: 'Diseño pequeño en el pecho',     emoji: '🔲' },
    ] as const;

    return (
        <AppShell header={{ height: 100, collapsed: false, offset: true }} className="page-transition">
            <Head title="Personaliza tu Diseño - JOPPA" />

            <CartDrawer />
            <Header opened={opened} toggle={toggle} />

            <AppShell.Main bg="#F4F4E8" pt={rem(140)} pb={rem(120)} style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Background decorative elements */}
                <Box style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0) 70%)', zIndex: 0 }} />
                <Box style={{ position: 'absolute', bottom: 100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(11, 48, 34, 0.03) 0%, rgba(11, 48, 34, 0) 70%)', zIndex: 0 }} />

                <Container size="md" style={{ position: 'relative', zIndex: 1 }}>

                    <Box style={{ textAlign: 'center', marginBottom: rem(60) }}>
                        <Badge color="#0B3022" variant="filled" size="lg" radius="xl" mb="md" style={{ letterSpacing: '0.1em', fontWeight: 800 }}>
                            EXCLUSIVO JOPPA
                        </Badge>
                        <Title order={1} c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                            Hazlo <span style={{ color: '#D4AF37' }}>tuyo.</span>
                        </Title>
                        <Text c="#4A4A4A" mt="xl" size="xl" style={{ fontFamily: '"Montserrat", sans-serif', maxWidth: '700px', margin: '1.5rem auto 0 auto', lineHeight: 1.6, fontWeight: 500 }}>
                            Da vida a tu visión con nuestra calidad premium. Sigue los pasos y crea una prenda única diseñada por ti.
                        </Text>
                    </Box>

                    {/* PROCESS BENTO GRID */}
                    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb={rem(80)}>
                        <Card radius="24px" p="xl" bg="white" shadow="sm" style={{ border: '1px solid rgba(11,48,34,0.05)' }}>
                            <ThemeIcon size={54} radius="md" bg="#F9F9F4" c="#0B3022" mb="lg">
                                <IconBulb size={28} stroke={1.5} />
                            </ThemeIcon>
                            <Text fw={800} size="lg" mb="sm" c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif' }}>1. Inspiración</Text>
                            <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>Comparte tus ideas o referencias. Cualquier imagen o boceto sirve para empezar.</Text>
                        </Card>

                        <Card radius="24px" p="xl" bg="#0B3022" shadow="md">
                            <ThemeIcon size={54} radius="md" bg="rgba(255,255,255,0.1)" c="#D4AF37" mb="lg">
                                <IconPencil size={28} stroke={1.5} />
                            </ThemeIcon>
                            <Text fw={800} size="lg" mb="sm" c="white" style={{ fontFamily: '"Montserrat", sans-serif' }}>2. Detalle</Text>
                            <Text size="sm" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>Elige el corte, color y materiales de nuestra selección premium.</Text>
                        </Card>

                        <Card radius="24px" p="xl" bg="white" shadow="sm" style={{ border: '1px solid rgba(11,48,34,0.05)' }}>
                            <ThemeIcon size={54} radius="md" bg="#F9F9F4" c="#D4AF37" mb="lg">
                                <IconRocket size={28} stroke={1.5} />
                            </ThemeIcon>
                            <Text fw={800} size="lg" mb="sm" c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif' }}>3. Creación</Text>
                            <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>Recibe una cotización exclusiva y, tras tu aprobación, ¡comenzamos!</Text>
                        </Card>
                    </SimpleGrid>

                    {success && (
                        <Notification icon={<IconCheck size={20} />} color="teal" title="¡Propuesta Recibida!" onClose={() => setSuccess(false)} mb={rem(48)} style={{ border: 'none', borderRadius: '16px', padding: '24px', backgroundColor: '#E8F5E9', fontFamily: '"Montserrat", sans-serif' }}>
                            Tu solicitud de diseño ha sido enviada con éxito. Nuestro equipo la revisará y te contactará muy pronto para acordar los detalles.
                        </Notification>
                    )}

                    {error && (
                        <Notification icon={<IconX size={20} />} color="red" title="Error" onClose={() => setError(null)} mb={rem(48)} style={{ border: 'none', borderRadius: '16px', padding: '24px', fontFamily: '"Montserrat", sans-serif' }}>
                            {error}
                        </Notification>
                    )}

                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        {/* DATOS DE CONTACTO - BENTO BOX */}
                        <Card shadow="xl" radius="32px" p={{ base: 32, md: 54 }} mb={rem(64)} bg="white" withBorder={false} style={{ border: '1px solid rgba(11,48,34,0.03)' }}>
                            <Group gap="md" mb={rem(40)} align="center">
                                <ThemeIcon size={44} radius="xl" bg="#D4AF37" c="white">
                                    <IconCheck size={22} stroke={2.5} />
                                </ThemeIcon>
                                <Title order={2} c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 900, letterSpacing: '-0.02em' }}>Datos de Contacto</Title>
                            </Group>

                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" mb="xl">
                                <TextInput
                                    withAsterisk
                                    label="Nombre Completo"
                                    placeholder="Jane Doe"
                                    size="md"
                                    radius="xl"
                                    {...form.getInputProps('name')}
                                    styles={{ label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: '8px' }, input: { fontFamily: '"Inter", sans-serif', backgroundColor: '#FFFFFF', border: 'none' } }}
                                />
                                <TextInput
                                    withAsterisk
                                    label="Correo Electrónico"
                                    placeholder="jane@ejemplo.com"
                                    size="md"
                                    radius="xl"
                                    {...form.getInputProps('email')}
                                    styles={{ label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: '8px' }, input: { fontFamily: '"Inter", sans-serif', backgroundColor: '#FFFFFF', border: 'none' } }}
                                />
                            </SimpleGrid>

                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" mb="xl">
                                <Box>
                                    <Text size="sm" style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: '8px' }}>Teléfono de Contacto</Text>
                                    <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="sm">
                                        <Select
                                            searchable
                                            allowDeselect={false}
                                            data={countries}
                                            renderOption={({ option }) => (
                                                <Group gap="xs" wrap="nowrap">
                                                    <img
                                                        src={`https://flagcdn.com/w20/${(option as any).country}.png`}
                                                        srcSet={`https://flagcdn.com/w40/${(option as any).country}.png 2x`}
                                                        width={20}
                                                        alt={(option as any).country}
                                                        style={{ flexShrink: 0, borderRadius: 2 }}
                                                    />
                                                    <Text size="sm" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                                        {option.label}
                                                    </Text>
                                                </Group>
                                            )}
                                            leftSection={
                                                <img
                                                    src={`https://flagcdn.com/w20/${countries.find(c => c.value === form.values.phone_prefix)?.country || 've'}.png`}
                                                    width={20}
                                                    alt=""
                                                    style={{ borderRadius: 2 }}
                                                />
                                            }
                                            radius="xl"
                                            size="md"
                                            styles={{
                                                input: { fontFamily: '"Montserrat", sans-serif', backgroundColor: '#FFFFFF', paddingLeft: 42, border: 'none' },
                                            }}
                                            {...form.getInputProps('phone_prefix')}
                                        />
                                        <TextInput
                                            placeholder="412-123-4567"
                                            radius="xl"
                                            size="md"
                                            type="tel"
                                            styles={{
                                                input: { fontFamily: '"Montserrat", sans-serif', backgroundColor: '#FFFFFF', border: 'none' },
                                            }}
                                            {...form.getInputProps('phone_number')}
                                            onChange={handlePhoneChange}
                                        />
                                    </SimpleGrid>
                                    {form.errors.phone_number && (
                                        <Text c="red" size="xs" mt="xs">{form.errors.phone_number}</Text>
                                    )}
                                </Box>

                                <Select
                                    withAsterisk
                                    label="Estado (Venezuela)"
                                    placeholder="Selecciona un estado"
                                    data={['Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar', 'Carabobo', 'Cojedes', 'Delta Amacuro', 'Distrito Capital', 'Falcón', 'Guárico', 'Lara', 'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre', 'Táchira', 'Trujillo', 'La Guaira', 'Yaracuy', 'Zulia']}
                                    radius="xl"
                                    size="md"
                                    styles={{
                                        label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: '8px' },
                                        input: { fontFamily: '"Inter", sans-serif', backgroundColor: '#FFFFFF', border: 'none' }
                                    }}
                                    {...form.getInputProps('state')}
                                />
                            </SimpleGrid>

                            <Textarea
                                label="Comentarios Generales (Opcional)"
                                placeholder="Alguna preferencia adicional, restricciones de tela, ideas locas, etc."
                                minRows={4}
                                size="md"
                                radius="xl"
                                {...form.getInputProps('general_comments')}
                                styles={{ label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: '8px' }, input: { fontFamily: '"Inter", sans-serif', backgroundColor: '#FFFFFF', border: 'none' } }}
                            />
                        </Card>

                        {/* BLOQUES DE PRENDAS - BENTO BOXES */}
                        <Box mb={rem(24)}>
                            <Group justify="space-between" align="end" mb={rem(40)}>
                                <Box>
                                    <Title order={2} c="#0B3022" mb={rem(8)} style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 900, letterSpacing: '-0.02em' }}>Tus Diseños Propuestos</Title>
                                    <Text c="dimmed" style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 500 }}>Añade tantas prendas como necesites a esta solicitud.</Text>
                                </Box>
                                <Badge variant="outline" color="#0B3022" size="xl" radius="md" p="md">
                                    {form.values.items.length} {form.values.items.length === 1 ? 'Prenda' : 'Prendas'}
                                </Badge>
                            </Group>
                        </Box>

                        {form.values.items.map((item, index) => (
                            <Collapse key={item.id} in={true} transitionDuration={500}>
                                <Card shadow="md" radius="32px" p={{ base: 32, md: 48 }} mb={rem(32)} bg="white" withBorder={false} style={{ position: 'relative', borderLeft: '8px solid #0B3022' }}>
                                {form.values.items.length > 1 && (
                                    <ActionIcon
                                        color="red"
                                        variant="light"
                                        size="xl"
                                        radius="xl"
                                        style={{ position: 'absolute', top: 32, right: 32 }}
                                        onClick={() => form.removeListItem('items', index)}
                                        aria-label="Remove item"
                                    >
                                        <IconTrash size={24} />
                                    </ActionIcon>
                                )}

                                <Text fw={800} size="xl" c="#0B3022" mb={rem(32)} style={{ fontFamily: '"Montserrat", sans-serif' }}>Prenda #{index + 1}</Text>

                                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" mb="xl">
                                    <Select
                                        label="Género"
                                        size="md"
                                        data={['Dama', 'Caballero', 'Unisex', 'Niño', 'Niña']}
                                        {...form.getInputProps(`items.${index}.gender`)}
                                        styles={{ label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: '8px' }, input: { backgroundColor: '#FFFFFF', border: 'none', borderRadius: '12px' } }}
                                    />
                                    <Select
                                        label="Estilo de Prenda"
                                        size="md"
                                        data={['Oversize', 'Regular Clásica', 'Crop Top', 'Hoodie']}
                                        {...form.getInputProps(`items.${index}.style`)}
                                        styles={{ label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: '8px' }, input: { backgroundColor: '#FFFFFF', border: 'none', borderRadius: '12px' } }}
                                    />
                                </SimpleGrid>

                                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" mb={rem(40)}>
                                    <Box>
                                        <Text size="sm" style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: '8px' }}>Color de Prenda <span style={{ color: 'red' }}>*</span></Text>
                                        <Group gap="xs">
                                            {[
                                                { label: 'Negro', value: 'Negro', hex: '#1A1A1A' },
                                                { label: 'Blanco', value: 'Blanco', hex: '#FFFFFF' },
                                                { label: 'Beige', value: 'Beige', hex: '#F5F5DC' },
                                                { label: 'Azul Marino', value: 'Azul Marino', hex: '#0A1128' },
                                            ].map(c => (
                                                <div 
                                                    key={c.value}
                                                    onClick={() => form.setFieldValue(`items.${index}.color`, c.value)}
                                                    style={{
                                                        width: 38,
                                                        height: 38,
                                                        borderRadius: '50%',
                                                        backgroundColor: c.hex,
                                                        border: form.values.items[index].color === c.value ? '2px solid #0B3022' : '1px solid #E0E0E0',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: form.values.items[index].color === c.value ? '0 0 0 2px #FFFFFF inset' : 'none',
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                    title={c.label}
                                                >
                                                    {form.values.items[index].color === c.value && (
                                                        <IconCheck stroke={3} size={18} color={c.hex === '#FFFFFF' || c.hex === '#F5F5DC' ? '#000' : '#FFF'} />
                                                    )}
                                                </div>
                                            ))}
                                        </Group>
                                        {form.errors[`items.${index}.color`] && (
                                            <Text c="red" size="xs" mt={4}>{form.errors[`items.${index}.color`] as string}</Text>
                                        )}
                                    </Box>
                                    <Select
                                        label="Talla"
                                        size="md"
                                        data={['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']}
                                        {...form.getInputProps(`items.${index}.size`)}
                                        styles={{ label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: '8px' }, input: { backgroundColor: '#FFFFFF', border: 'none', borderRadius: '12px' } }}
                                    />
                                    <NumberInput
                                        label="Cantidad esperada"
                                        size="md"
                                        min={1}
                                        {...form.getInputProps(`items.${index}.quantity`)}
                                        styles={{ label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: '8px' }, input: { backgroundColor: '#FFFFFF', border: 'none', borderRadius: '12px' } }}
                                    />
                                </SimpleGrid>

                                {/* PLACEMENT SELECTOR + MOCKUP */}
                                <Box mb={rem(32)}>
                                    <Text fw={700} size="sm" mb="sm" style={{ fontFamily: '"Montserrat", sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#0B3022' }}>
                                        Posición del Diseño
                                    </Text>
                                    <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm" mb={rem(24)}>
                                        {PLACEMENTS.map(p => (
                                            <Box
                                                key={p.value}
                                                onClick={() => form.setFieldValue(`items.${index}.placement`, p.value)}
                                                style={{
                                                    border: form.values.items[index].placement === p.value ? '2px solid #D4AF37' : '2px solid rgba(11,48,34,0.1)',
                                                    borderRadius: '16px',
                                                    padding: '14px 10px',
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    background: form.values.items[index].placement === p.value ? 'rgba(212,175,55,0.08)' : '#F9F9F4',
                                                    transition: 'all 0.2s ease',
                                                    userSelect: 'none',
                                                }}
                                            >
                                                <Text size="xl" mb={4}>{p.emoji}</Text>
                                                <Text fw={800} size="sm" c={form.values.items[index].placement === p.value ? '#0B3022' : '#555'} style={{ fontFamily: '"Montserrat", sans-serif', lineHeight: 1.2 }}>{p.label}</Text>
                                                <Text size="10px" c="dimmed" mt={2} style={{ lineHeight: 1.3 }}>{p.desc}</Text>
                                            </Box>
                                        ))}
                                    </SimpleGrid>

                                    {/* SVG Mockup */}
                                    <Box p={rem(24)} bg="#111" style={{ borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                        <Text size="xs" fw={700} c="rgba(255,255,255,0.4)" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>Vista Previa del Diseño</Text>
                                        <TShirtMockup placement={form.values.items[index].placement || 'frontal'} />
                                        <Text size="xs" c="rgba(255,255,255,0.3)" mt={4}>
                                            {PLACEMENTS.find(p => p.value === form.values.items[index].placement)?.desc}
                                        </Text>
                                    </Box>
                                </Box>

                                {/* IMAGE UPLOAD AREA */}
                                <Box bg="#F9F9F4" p={rem(28)} style={{ borderRadius: '20px' }}>
                                    <Text fw={700} size="sm" mb="md" style={{ fontFamily: '"Montserrat", sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#0B3022' }}>
                                        {form.values.items[index].placement === 'doble' ? 'Tus Diseños (2 archivos)' : 'Tu Diseño de Referencia'}
                                    </Text>
                                    <SimpleGrid cols={{ base: 1, sm: form.values.items[index].placement === 'doble' ? 2 : (item.image ? 2 : 1) }} spacing="xl">
                                        {/* PRIMARY IMAGE */}
                                        <Box>
                                            <Text size="xs" fw={700} c="dimmed" mb={8} style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                                {form.values.items[index].placement === 'doble' ? '① Pocket (frontal)' : 'Imagen de Referencia'}
                                            </Text>
                                            <FileInput
                                                placeholder="Sube tu imagen (PNG, JPG, PDF)"
                                                size="lg"
                                                accept="image/png,image/jpeg,image/webp,.pdf"
                                                leftSection={<IconUpload size={20} />}
                                                {...form.getInputProps(`items.${index}.image`)}
                                                styles={{
                                                    input: { backgroundColor: '#FFFFFF', border: '2px dashed rgba(11,48,34,0.15)', borderRadius: '14px', cursor: 'pointer', height: '70px' }
                                                }}
                                            />
                                            {item.image && item.image.type?.startsWith('image/') && (
                                                <Box mt={12} style={{ height: '160px', backgroundColor: '#F4F4E8', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Image src={URL.createObjectURL(item.image as File)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                </Box>
                                            )}
                                        </Box>

                                        {/* BACK IMAGE — only for 'doble' */}
                                        {form.values.items[index].placement === 'doble' && (
                                            <Box>
                                                <Text size="xs" fw={700} c="dimmed" mb={8} style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>② Espalda</Text>
                                                <FileInput
                                                    placeholder="Sube tu diseño de espalda"
                                                    size="lg"
                                                    accept="image/png,image/jpeg,image/webp,.pdf"
                                                    leftSection={<IconUpload size={20} />}
                                                    {...form.getInputProps(`items.${index}.image_back`)}
                                                    styles={{
                                                        input: { backgroundColor: '#FFFFFF', border: '2px dashed rgba(212,175,55,0.4)', borderRadius: '14px', cursor: 'pointer', height: '70px' }
                                                    }}
                                                />
                                                {form.values.items[index].image_back && (form.values.items[index].image_back as File)?.type?.startsWith('image/') && (
                                                    <Box mt={12} style={{ height: '160px', backgroundColor: '#F4F4E8', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Image src={URL.createObjectURL(form.values.items[index].image_back as File)} alt="Back Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                    </Box>
                                                )}
                                            </Box>
                                        )}

                                        {/* Preview for single image */}
                                        {form.values.items[index].placement !== 'doble' && item.image && (
                                            <Box />
                                        )}
                                    </SimpleGrid>
                                </Box>
                            </Card>
                        </Collapse>
                    ))}

                        <Button
                            variant="light"
                            color="#0B3022"
                            fullWidth
                            radius="xl"
                            size="xl"
                            mt={rem(16)}
                            mb={rem(64)}
                            leftSection={<IconPlus size={24} />}
                            onClick={addDesignBlock}
                            className="hover:bg-[#0B3022]/5 transition-colors duration-300"
                            style={{ fontFamily: '"Montserrat", sans-serif', borderStyle: 'dashed', borderWidth: '2px', backgroundColor: 'transparent', height: 80, fontSize: '1.2rem', fontWeight: 700 }}
                        >
                            Añadir Otra Prenda
                        </Button>

                        <Divider mb={rem(64)} color="rgba(0,0,0,0.05)" />

                        <Button
                            type="submit"
                            fullWidth
                            size="xl"
                            radius="xl"
                            loading={submitting}
                            className="btn-submit"
                            style={{ 
                                fontFamily: '"Montserrat", sans-serif', 
                                backgroundColor: '#0B3022', 
                                color: '#D4AF37', 
                                fontSize: '1.4rem', 
                                height: 84, 
                                fontWeight: 900, 
                                transition: 'all 0.3s ease', 
                                border: 'none',
                                boxShadow: '0 10px 40px rgba(11, 48, 34, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 15px 50px rgba(11, 48, 34, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 40px rgba(11, 48, 34, 0.3)';
                            }}
                        >
                            Confirmar y Enviar Solicitud
                        </Button>
                    </form>

                </Container>
            </AppShell.Main>

            <Footer />
        </AppShell>
    );
}
