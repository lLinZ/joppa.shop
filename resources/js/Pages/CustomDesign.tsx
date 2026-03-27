// <ai_context>
// Propósito: Landing y Formulario Dinámico para Diseños Personalizados.
// Características: Formularios dinámicos con Mantine para prendas múltiples, estética Bento Box y previews en tiempo real.
// </ai_context>

import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { AppShell, Box, Container, Title, Text, Button, Divider, Group, TextInput, Textarea, Select, NumberInput, Card, ActionIcon, FileInput, Image, Loader, Notification, SimpleGrid, rem, Badge, ThemeIcon, Transition, Collapse } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconTrash, IconUpload, IconCheck, IconX, IconPhoto, IconSparkles, IconSettings, IconConfetti, IconBulb, IconPencil, IconRocket, IconDeviceFloppy } from '@tabler/icons-react';
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
            gender: 'Caballero',
            style: 'Hoodie Premium',
            color: 'Negro',
            size: 'M',
            quantity: 1,
            placement: 'frontal',
            design_data: null,
        });
    };


    return (
        <AppShell header={{ height: 100, collapsed: false, offset: true }} className="page-transition">
            <Head title="Personaliza tu Diseño - JOPPA" />

            <CartDrawer />
            <Header opened={opened} toggle={toggle} />

            <AppShell.Main bg="#F4F4E8" pt={rem(140)} pb={rem(120)} style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Background decorative elements */}
                <Box style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0) 70%)', zIndex: 0 }} />
                <Box style={{ position: 'absolute', bottom: 100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(11, 48, 34, 0.03) 0%, rgba(11, 48, 34, 0) 70%)', zIndex: 0 }} />

                <Container size="xl" style={{ position: 'relative', zIndex: 1 }}>

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

                                <Box mb={rem(40)}>
                                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" mb="xl">
                                        <Select
                                            label="Género"
                                            size="md"
                                            data={['Caballero', 'Dama']}
                                            {...form.getInputProps(`items.${index}.gender`)}
                                            styles={{ label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: '8px' }, input: { backgroundColor: '#F9F9F4', border: 'none', borderRadius: '12px' } }}
                                        />
                                        <Select
                                            label="Talla Base"
                                            size="md"
                                            data={['S', 'M', 'L']}
                                            {...form.getInputProps(`items.${index}.size`)}
                                            styles={{ label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: '8px' }, input: { backgroundColor: '#F9F9F4', border: 'none', borderRadius: '12px' } }}
                                        />
                                    </SimpleGrid>

                                    <Group justify="space-between" mb="md">
                                        <Text fw={700} size="sm" c="dimmed" style={{ letterSpacing: '0.05em' }}>CANTIDAD: {item.quantity}</Text>
                                        <Box style={{ width: 120 }}>
                                            <NumberInput min={1} {...form.getInputProps(`items.${index}.quantity`)} size="sm" radius="md" />
                                        </Box>
                                    </Group>

                                    {/* INTERACTIVE DESIGN STUDIO */}
                                    <Box mt="xl">
                                        <DesignStudio 
                                            gender={item.gender as 'Caballero' | 'Dama'}
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
