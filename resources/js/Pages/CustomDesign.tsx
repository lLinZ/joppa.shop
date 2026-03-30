// <ai_context>
// Propósito: Landing y Formulario Dinámico para Diseños Personalizados.
// Características: Formularios dinámicos con Mantine para prendas múltiples, estética Bento Box y previews en tiempo real.
// </ai_context>

import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { AppShell, Box, Container, Title, Text, Button, Divider, Group, TextInput, Textarea, Select, NumberInput, Card, ActionIcon, FileInput, Image, Loader, Notification, SimpleGrid, rem, Badge, ThemeIcon, Transition, Collapse, Modal, Stack, Paper, Tooltip } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconPlus, IconTrash, IconUpload, IconCheck, IconX, IconPhoto, IconSparkles, IconSettings, IconConfetti, IconBulb, IconPencil, IconRocket, IconDeviceFloppy, IconBrandWhatsapp, IconChevronDown, IconChevronUp, IconCopy } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

import { Header } from '../Components/Layout/Header';
import Footer from '../Components/Layout/Footer';
import CartDrawer from '../Components/UI/Cart/CartDrawer';
import { DesignStudio } from '../Components/Design/DesignStudio';

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
    const [contactOpened, { open: openContact, close: closeContact }] = useDisclosure(false);
    const [successOpened, { open: openSuccess, close: closeSuccess }] = useDisclosure(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [openedIndices, setOpenedIndices] = useState<number[]>([0]);
    const [error, setError] = useState<string | null>(null);
    const isMobile = useMediaQuery('(max-width: 992px)');

    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            phone_prefix: '+58',
            phone_number: '',
            state: '',
            general_comments: '',
            items: [
                { id: Math.random().toString(), gender: 'Caballero', style: 'Hoodie Premium', color: 'Negro', size: 'M', quantity: 1, placement: 'frontal', design_data: null as any }
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
                design_data: (value: any) => (!value ? 'Debes completar el diseño' : null),
            }
        },
    });

    // --- AUTOSAVE LOGIC ---
    // Load from localStorage on mount
    useEffect(() => {
        const savedDraft = localStorage.getItem('joppa_design_draft');
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft);
                if (draft && draft.items) {
                    form.setValues(draft);
                    // Open all items by default on draft load
                    if (draft.items.length > 0) {
                        setOpenedIndices(draft.items.map((_: any, i: number) => i));
                    }
                }
            } catch (e) {
                console.error('Failed to load design draft:', e);
            }
        }
    }, []);

    // Save to localStorage on changes (debounced)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            localStorage.setItem('joppa_design_draft', JSON.stringify(form.values));
        }, 1000); // 1 second debounce
        return () => clearTimeout(timeoutId);
    }, [form.values]);

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
                if (item.design_data) {
                    const designString = JSON.stringify(item.design_data);
                    console.log(`Submitting Design Data for Item ${index}:`, designString);
                    formData.append(`items[${index}][design_data]`, designString);
                }
            });

            await axios.post(`${CRM_API_URL}/design-requests`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            notifications.show({
                title: '¡Éxito!',
                message: 'Tu solicitud ha sido enviada correctamente.',
                color: 'teal',
                icon: <IconCheck size={20} />,
                loading: false,
                autoClose: 5000,
            });

            setSuccess(true);
            closeContact();
            openSuccess();
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message || 'Ocurrió un error al enviar la solicitud. Por favor, intenta de nuevo.';
            setError(msg);
            
            notifications.show({
                title: 'Error de Envío',
                message: msg,
                color: 'red',
                icon: <IconX size={20} />,
                autoClose: false,
            });
        } finally {
            setSubmitting(false);
            if (!error) window.scrollTo({ top: 0, behavior: 'smooth' });
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
            gender: 'Caballero',
            style: 'Hoodie Premium',
            color: 'Negro',
            size: 'M',
            quantity: 1,
            placement: 'frontal',
            design_data: null,
        });
        setOpenedIndices(prev => [...prev, form.values.items.length]);
    };

    const duplicateDesignBlock = (index: number) => {
        const source = form.values.items[index];
        form.insertListItem('items', {
            ...JSON.parse(JSON.stringify(source)), // Deep clone to avoid ref issues
            id: Math.random().toString(),
        });
        setOpenedIndices(prev => [...prev, form.values.items.length]);
        
        notifications.show({
            title: 'Prenda Duplicada',
            message: 'Se ha creado una copia exacta de esta prenda.',
            color: 'teal',
            icon: <IconCheck size={18} />
        });
    };

    const handleNextStep = () => {
        const result = form.validateField('items');
        if (!result.hasError) {
            openContact();
        } else {
            notifications.show({
                title: 'Diseño Incompleto',
                message: 'Por favor, asegúrate de completar todos los diseños antes de continuar.',
                color: 'red',
                icon: <IconX size={18} />
            });
        }
    };

    const handleFinalSubmit = () => {
        const result = form.validate();
        if (!result.hasErrors) {
            handleSubmit(form.values);
        }
    };

    const handleResetDesign = () => {
        form.reset();
        localStorage.removeItem('joppa_design_draft');
        setOpenedIndices([0]);
        closeSuccess();
        setSuccess(false);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleItem = (index: number) => {
        setOpenedIndices(current => 
            current.includes(index) 
                ? current.filter(i => i !== index)
                : [...current, index]
        );
    };

    const whatsappPhone = '584222030200';
    const whatsappMessage = `Hola! Acabo de enviar un diseño personalizado en Joppa Custom. Mi nombre es ${form.values.name}. Me gustaría recibir el presupuesto.`;
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`;


    return (
        <AppShell header={{ height: 100, collapsed: false, offset: true }} className="page-transition">
            <Head title="Personaliza tu Diseño - JOPPA" />

            <CartDrawer />
            <Header opened={opened} toggle={toggle} />

            <AppShell.Main bg="#F4F4E8" pt={isMobile ? rem(140) : rem(130)} pb={isMobile ? rem(120) : rem(80)} style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Background decorative elements */}
                <Box style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0) 70%)', zIndex: 0 }} />
                <Box style={{ position: 'absolute', bottom: 100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(11, 48, 34, 0.03) 0%, rgba(11, 48, 34, 0) 70%)', zIndex: 0 }} />

                <Container size="xl" style={{ position: 'relative', zIndex: 1 }}>

                    <Box style={{ textAlign: isMobile ? 'center' : 'left', marginBottom: isMobile ? rem(32) : rem(20), display: isMobile ? 'block' : 'flex', alignItems: 'center', gap: rem(32), justifyContent: 'space-between' }}>
                        <Box style={{ flex: 1, textAlign: isMobile ? 'center' : 'left' }}>
                            <Badge color="#0B3022" variant="filled" size={isMobile ? "lg" : "md"} radius="xl" mb="xs" style={{ letterSpacing: '0.1em', fontWeight: 800 }}>
                                EXCLUSIVO JOPPA
                            </Badge>
                            <Title order={1} c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif', fontSize: isMobile ? 'clamp(2rem, 5vw, 3.5rem)' : '3rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                                Hazlo <span style={{ color: '#D4AF37' }}>tuyo.</span>
                            </Title>
                        </Box>

                        {/* DESKTOP PROCESS CHIPS (HORIZONTAL IN HEADER) */}
                        {!isMobile && (
                            <Group gap="xs" wrap="nowrap">
                                <Paper radius="xl" p="xs" px="md" bg="#F9F9F4" style={{ border: '1px solid rgba(11,48,34,0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <ThemeIcon size={24} radius="xl" bg="white" c="#0B3022"><IconBulb size={14} /></ThemeIcon>
                                    <Text fw={800} size="xs" c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif', lineHeight: 1 }}>1. INSPIRACIÓN</Text>
                                </Paper>
                                <Paper radius="xl" p="xs" px="md" bg="#0B3022" style={{ display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(11, 48, 34, 0.15)' }}>
                                    <ThemeIcon size={24} radius="xl" bg="rgba(255,255,255,0.1)" c="#D4AF37"><IconPencil size={14} /></ThemeIcon>
                                    <Text fw={800} size="xs" c="white" style={{ fontFamily: '"Montserrat", sans-serif', lineHeight: 1 }}>2. DETALLE</Text>
                                </Paper>
                                <Paper radius="xl" p="xs" px="md" bg="#F9F9F4" style={{ border: '1px solid rgba(11,48,34,0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <ThemeIcon size={24} radius="xl" bg="white" c="#D4AF37"><IconRocket size={14} /></ThemeIcon>
                                    <Text fw={800} size="xs" c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif', lineHeight: 1 }}>3. CREACIÓN</Text>
                                </Paper>
                            </Group>
                        )}
                    </Box>

                    {/* MOBILE PROCESS CAROUSEL */}
                    {isMobile && (
                        <Box 
                            mb={rem(48)} 
                            style={{ 
                                overflowX: 'auto', 
                                msOverflowStyle: 'none', 
                                scrollbarWidth: 'none',
                                WebkitOverflowScrolling: 'touch',
                                margin: '0 -16px 2rem -16px',
                                padding: '4px 16px'
                            }}
                        >
                            <Group justify="flex-start" gap="md" wrap="nowrap" style={{ minWidth: 'max-content' }}>
                                <Paper radius="xl" p="xs" px="xl" bg="white" style={{ border: '1px solid rgba(11,48,34,0.1)', display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <ThemeIcon size={32} radius="xl" bg="#F9F9F4" c="#0B3022"><IconBulb size={18} /></ThemeIcon>
                                    <Text fw={800} size="sm" c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif', lineHeight: 1 }}>1. INSPIRACIÓN</Text>
                                </Paper>
                                <Paper radius="xl" p="xs" px="xl" bg="#0B3022" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 20px rgba(11, 48, 34, 0.2)' }}>
                                    <ThemeIcon size={32} radius="xl" bg="rgba(255,255,255,0.1)" c="#D4AF37"><IconPencil size={18} /></ThemeIcon>
                                    <Text fw={800} size="sm" style={{ fontFamily: '"Montserrat", sans-serif', lineHeight: 1 }}>2. DETALLE</Text>
                                </Paper>
                                <Paper radius="xl" p="xs" px="xl" bg="white" style={{ border: '1px solid rgba(11,48,34,0.1)', display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <ThemeIcon size={32} radius="xl" bg="#F9F9F4" c="#D4AF37"><IconRocket size={18} /></ThemeIcon>
                                    <Text fw={800} size="sm" c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif', lineHeight: 1 }}>3. CREACIÓN</Text>
                                </Paper>
                            </Group>
                        </Box>
                    )}


                    {error && (
                        <Notification icon={<IconX size={20} />} color="red" title="Error" onClose={() => setError(null)} mb={rem(48)} style={{ border: 'none', borderRadius: '16px', padding: '24px', fontFamily: '"Montserrat", sans-serif' }}>
                            {error}
                        </Notification>
                    )}

                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        {/* SUCCESS MODAL */}
                        <Modal
                            opened={successOpened}
                            onClose={closeSuccess}
                            withCloseButton={false}
                            centered
                            size={isMobile ? "100%" : "lg"}
                            radius={isMobile ? "0px" : "32px"}
                            padding={0}
                            transitionProps={{ transition: 'fade', duration: 300 }}
                            overlayProps={{
                                backgroundOpacity: 0.55,
                                blur: 10,
                            }}
                        >
                            <Box p={isMobile ? "xl" : rem(40)} ta="center">
                                <Box mb="xl" style={{ display: 'inline-block', padding: isMobile ? '12px' : '20px', borderRadius: '50%', backgroundColor: '#F9F9F4' }}>
                                    <IconCheck size={isMobile ? 40 : 60} color="#0B3022" stroke={1.5} />
                                </Box>
                                
                                <Title order={2} mb="md" style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 900, color: '#0B3022', fontSize: isMobile ? rem(24) : rem(32) }}>
                                    ¡Propuesta Recibida, {form.values.name.split(' ')[0]}!
                                </Title>
                                
                                <Text size={isMobile ? "sm" : "lg"} mb={isMobile ? rem(24) : rem(40)} c="dimmed" style={{ lineHeight: 1.6 }}>
                                    Tu diseño ha sido enviado con éxito. Nuestro equipo lo revisará y te contactaremos a la brevedad para los detalles finales.
                                </Text>

                                <Stack gap={isMobile ? "sm" : "md"}>
                                    <Button
                                        component="a"
                                        href={whatsappUrl}
                                        target="_blank"
                                        size={isMobile ? "lg" : "xl"}
                                        radius="xl"
                                        bg="#0B3022"
                                        leftSection={<IconBrandWhatsapp size={isMobile ? 20 : 24} />}
                                        style={{ height: isMobile ? 54 : 64, fontWeight: 900, boxShadow: '0 8px 30px rgba(11, 48, 34, 0.2)' }}
                                    >
                                        Chatear por WhatsApp
                                    </Button>

                                    <Button
                                        variant="subtle"
                                        color="gray"
                                        size={isMobile ? "xs" : "md"}
                                        onClick={handleResetDesign}
                                        radius="xl"
                                        fw={900}
                                        style={{ fontFamily: '"Montserrat", sans-serif' }}
                                    >
                                        ¿Quieres hacer otro diseño?
                                    </Button>

                                    <Button
                                        variant="transparent"
                                        color="dimmed"
                                        size="xs"
                                        onClick={handleResetDesign}
                                        fw={600}
                                    >
                                        Cerrar panel
                                    </Button>
                                </Stack>
                            </Box>
                        </Modal>

                        <Modal 
                            opened={contactOpened} 
                            onClose={closeContact} 
                            title={
                                <Box>
                                    <Text fw={900} size="xl" c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif' }}>Finalizar mi Solicitud</Text>
                                    <Text size="xs" c="dimmed">Completa tus datos para enviarte el presupuesto exclusivo.</Text>
                                </Box>
                            }
                            size="lg"
                            radius="32px"
                            padding="xl"
                            overlayProps={{
                                backgroundOpacity: 0.55,
                                blur: 3,
                            }}
                            styles={{
                                header: { marginBottom: rem(20) },
                                content: { border: '1px solid rgba(212, 175, 55, 0.2)' }
                            }}
                        >
                            <Stack gap="xl">
                                {error && (
                                    <Notification 
                                        icon={<IconX size={18} />} 
                                        color="red" 
                                        title="Ups, algo salió mal" 
                                        onClose={() => setError(null)}
                                        radius="md"
                                        styles={{ title: { fontWeight: 800 } }}
                                    >
                                        {error}
                                    </Notification>
                                )}
                                {/* DATOS DE CONTACTO - BENTO BOX inside Modal */}
                                <Box>
                                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" mb="xl">
                                        <TextInput
                                            withAsterisk
                                            label="Nombre Completo"
                                            placeholder="Jane Doe"
                                            size="md"
                                            radius="xl"
                                            {...form.getInputProps('name')}
                                            styles={{ label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: '8px' }, input: { fontFamily: '"Inter", sans-serif', backgroundColor: '#F9F9F4', border: 'none' } }}
                                        />
                                        <TextInput
                                            withAsterisk
                                            label="Correo Electrónico"
                                            placeholder="jane@ejemplo.com"
                                            size="md"
                                            radius="xl"
                                            {...form.getInputProps('email')}
                                            styles={{ label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: '8px' }, input: { fontFamily: '"Inter", sans-serif', backgroundColor: '#F9F9F4', border: 'none' } }}
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
                                                        input: { fontFamily: '"Montserrat", sans-serif', backgroundColor: '#F9F9F4', paddingLeft: 42, border: 'none' },
                                                    }}
                                                    {...form.getInputProps('phone_prefix')}
                                                />
                                                <TextInput
                                                    placeholder="412-123-4567"
                                                    radius="xl"
                                                    size="md"
                                                    type="tel"
                                                    styles={{
                                                        input: { fontFamily: '"Montserrat", sans-serif', backgroundColor: '#F9F9F4', border: 'none' },
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
                                                input: { fontFamily: '"Inter", sans-serif', backgroundColor: '#F9F9F4', border: 'none' }
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
                                        styles={{ label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: '8px' }, input: { fontFamily: '"Inter", sans-serif', backgroundColor: '#F9F9F4', border: 'none' } }}
                                    />
                                </Box>

                                <Button
                                    onClick={handleFinalSubmit}
                                    fullWidth
                                    size="lg"
                                    radius="xl"
                                    loading={submitting}
                                    style={{ 
                                        fontFamily: '"Montserrat", sans-serif', 
                                        backgroundColor: '#0B3022', 
                                        color: '#D4AF37', 
                                        height: 64, 
                                        fontWeight: 900,
                                        boxShadow: '0 8px 30px rgba(11, 48, 34, 0.2)'
                                    }}
                                >
                                    Confirmar y Enviar Solicitud
                                </Button>
                            </Stack>
                        </Modal>

                        {/* DESKTOP HEADER COMPACT */}
                        {!isMobile && (
                            <Box mb={rem(16)}>
                                <Group justify="space-between" align="center">
                                    <Title order={2} c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 900, letterSpacing: '-0.02em', fontSize: '1.8rem' }}>Personalización Premium</Title>
                                    <Badge variant="filled" color="#0B3022" size="xl" radius="md" p="xl" style={{ border: '1px solid #0B3022' }}>
                                        <Text fw={900} size="sm" c="#D4AF37" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                            {form.values.items.length} {form.values.items.length === 1 ? 'PRENDA' : 'PRENDAS'}
                                        </Text>
                                    </Badge>
                                </Group>
                            </Box>
                        )}

                        {form.values.items.map((item, index) => (
                            <Card 
                                key={item.id} 
                                shadow="md" 
                                radius={isMobile ? "0px" : "32px"} 
                                p={0} 
                                mb={rem(32)} 
                                bg="white" 
                                withBorder={false} 
                                style={{ 
                                    position: 'relative', 
                                    borderLeft: isMobile ? 'none' : '8px solid #0B3022', 
                                    borderTop: isMobile ? '8px solid #0B3022' : 'none', 
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {/* HEADER TOGGLE */}
                                <Box 
                                    p={isMobile ? "md" : "xl"} 
                                    onClick={() => toggleItem(index)}
                                    style={{ 
                                        cursor: 'pointer', 
                                        backgroundColor: openedIndices.includes(index) ? 'transparent' : 'rgba(11, 48, 34, 0.02)',
                                        borderBottom: openedIndices.includes(index) ? '1px solid rgba(0,0,0,0.05)' : 'none'
                                    }}
                                >
                                    <Group justify="space-between">
                                        <Group gap="md">
                                            <ThemeIcon size={40} radius="md" variant="light" color="#0B3022">
                                                {openedIndices.includes(index) ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
                                            </ThemeIcon>
                                            <Box>
                                                <Text fw={900} size={isMobile ? "md" : "lg"} c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                                    Prenda #{index + 1}
                                                </Text>
                                                {!openedIndices.includes(index) && (
                                                    <Text size="xs" c="dimmed" fw={700} style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                                        {item.style} • {item.gender} • Talla {item.size} • Cant. {item.quantity}
                                                    </Text>
                                                )}
                                            </Box>
                                        </Group>

                                        <Group>
                                            <Tooltip label="Duplicar">
                                                <ActionIcon
                                                    color="#0B3022"
                                                    variant="subtle"
                                                    size="lg"
                                                    radius="xl"
                                                    onClick={(e) => { e.stopPropagation(); duplicateDesignBlock(index); }}
                                                    aria-label="Duplicate item"
                                                >
                                                    <IconCopy size={20} />
                                                </ActionIcon>
                                            </Tooltip>

                                            {form.values.items.length > 1 && (
                                                <Tooltip label="Eliminar">
                                                    <ActionIcon
                                                        color="red"
                                                        variant="subtle"
                                                        size="lg"
                                                        radius="xl"
                                                        onClick={(e) => { e.stopPropagation(); form.removeListItem('items', index); }}
                                                        aria-label="Remove item"
                                                    >
                                                        <IconTrash size={20} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            )}
                                        </Group>
                                    </Group>
                                </Box>

                                <Collapse in={openedIndices.includes(index)} transitionDuration={400}>
                                    <Box p={{ base: "md", sm: isMobile ? 32 : 16, md: isMobile ? 48 : 24 }}>
                                        <Box mb={isMobile ? rem(20) : rem(24)}>
                                            <Box px={0}>
                                                <SimpleGrid cols={isMobile ? 2 : 3} spacing="lg" mb="xl">
                                                    <Select
                                                        label="Género"
                                                        size="md"
                                                        data={['Caballero', 'Dama']}
                                                        {...form.getInputProps(`items.${index}.gender`)}
                                                        styles={{ label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: '4px', fontSize: '12px' }, input: { backgroundColor: '#F9F9F4', border: 'none', borderRadius: '12px' } }}
                                                    />
                                                    <Select
                                                        label="Talla Base"
                                                        size="md"
                                                        data={['S', 'M', 'L', 'XL', '2XL']}
                                                        {...form.getInputProps(`items.${index}.size`)}
                                                        styles={{ label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: '4px', fontSize: '12px' }, input: { backgroundColor: '#F9F9F4', border: 'none', borderRadius: '12px' } }}
                                                    />
                                                    <NumberInput 
                                                        label="CANTIDAD"
                                                        min={1} 
                                                        {...form.getInputProps(`items.${index}.quantity`)} 
                                                        size="md" 
                                                        radius="md" 
                                                        styles={{ label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: '4px', fontSize: '12px', color: '#666' }, input: { backgroundColor: '#F9F9F4', border: 'none', borderRadius: '12px' } }}
                                                    />
                                                </SimpleGrid>
                                            </Box>

                                            {/* INTERACTIVE DESIGN STUDIO - NO PADDING HERE */}
                                            <Box mt="xl">
                                                <DesignStudio 
                                                    gender={item.gender as 'Caballero' | 'Dama'}
                                                    design_data={item.design_data}
                                                    crmApiUrl={CRM_API_URL}
                                                    onSave={(data) => {
                                                        form.setFieldValue(`items.${index}.design_data`, data);
                                                        // Update style and color from studio selection
                                                        form.setFieldValue(`items.${index}.style`, data.product.name);
                                                    }} 
                                                />
                                                {form.errors[`items.${index}.design_data`] && (
                                                    <Text c="red" size="xs" mt="sm">{form.errors[`items.${index}.design_data`] as string}</Text>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Collapse>
                            </Card>
                        ))}

                        <Button
                            variant="light"
                            color="#0B3022"
                            fullWidth
                            radius="xl"
                            size={isMobile ? "lg" : "xl"}
                            mt={rem(16)}
                            mb={rem(64)}
                            leftSection={<IconPlus size={isMobile ? 20 : 24} />}
                            onClick={addDesignBlock}
                            className="hover:bg-[#0B3022]/5 transition-colors duration-300"
                            style={{ 
                                fontFamily: '"Montserrat", sans-serif', 
                                borderStyle: 'dashed', 
                                borderWidth: '2px', 
                                backgroundColor: 'transparent', 
                                height: isMobile ? 60 : 80, 
                                fontSize: isMobile ? '1rem' : '1.2rem', 
                                fontWeight: 700 
                            }}
                        >
                            Añadir Otra Prenda
                        </Button>

                        <Divider mb={rem(64)} color="rgba(0,0,0,0.05)" />

                        <Button
                            onClick={handleNextStep}
                            fullWidth
                            size={isMobile ? "lg" : "xl"}
                            radius="xl"
                            loading={submitting}
                            className="btn-submit"
                            style={{ 
                                fontFamily: '"Montserrat", sans-serif', 
                                backgroundColor: '#0B3022', 
                                color: '#D4AF37', 
                                fontSize: isMobile ? '1.1rem' : '1.4rem', 
                                height: isMobile ? 68 : 84, 
                                fontWeight: 900, 
                                transition: 'all 0.3s ease', 
                                border: 'none',
                                boxShadow: '0 10px 40px rgba(11, 48, 34, 0.3)',
                                whiteSpace: 'normal',
                                padding: isMobile ? '0 10px' : '0 20px'
                            }}
                            onMouseEnter={(e) => {
                                if(!isMobile) {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 15px 50px rgba(11, 48, 34, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if(!isMobile) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(11, 48, 34, 0.3)';
                                }
                            }}
                        >
                            Enviar
                        </Button>
                    </form>

                </Container>
            </AppShell.Main>

            <Footer />
        </AppShell>
    );
}
