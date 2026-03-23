// <ai_context>
// Propósito: Landing y Formulario Dinámico para Diseños Personalizados.
// Características: Formularios dinámicos con Mantine para prendas múltiples, estética Bento Box y previews en tiempo real.
// </ai_context>

import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { AppShell, Box, Container, Title, Text, Button, Divider, Group, TextInput, Textarea, Select, NumberInput, Card, ActionIcon, FileInput, Image, Loader, Notification, SimpleGrid, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconTrash, IconUpload, IconCheck, IconX, IconPhoto } from '@tabler/icons-react';
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
                { id: Math.random().toString(), gender: 'Unisex', style: 'Media Manga Oversize', color: 'Negro', size: 'M', quantity: 1, image: null as File | null }
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
                if (item.image) {
                    formData.append(`items[${index}][image]`, item.image);
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
            style: 'Media Manga Oversize',
            color: 'Negro',
            size: 'M',
            quantity: 1,
            image: null
        });
    };

    return (
        <AppShell header={{ height: 100, collapsed: false, offset: true }} className="page-transition">
            <Head title="Personaliza tu Diseño - JOPPA" />

            <CartDrawer />
            <Header opened={opened} toggle={toggle} />

            <AppShell.Main bg="#F4F4E8" pt={rem(140)} pb={rem(120)}>
                <Container size="md">

                    <Box style={{ textAlign: 'center', marginBottom: rem(80) }}>
                        <Title order={1} c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.04em' }}>
                            Hazlo tuyo.
                        </Title>
                        <Text c="#4A4A4A" mt="md" size="xl" style={{ fontFamily: '"Montserrat", sans-serif', maxWidth: '700px', margin: '1.5rem auto 0 auto', lineHeight: 1.6 }}>
                            Envíanos tus referencias de diseño, elige el corte que deseas y nuestros equipo creará una cotización exclusiva para ti.
                        </Text>
                    </Box>

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
                        <Card shadow="none" radius="32px" p={{ base: 32, md: 64 }} mb={rem(64)} bg="#F9F9F4" withBorder={false}>
                            <Title order={2} c="#0B3022" mb={rem(40)} style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 800, letterSpacing: '-0.02em' }}>Datos de Contacto</Title>

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
                            <Title order={2} c="#0B3022" mb={rem(8)} style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 800, letterSpacing: '-0.02em' }}>Tus Diseños Propuestos</Title>
                            <Text c="dimmed" mb={rem(40)} style={{ fontFamily: '"Montserrat", sans-serif' }}>Añade tantas prendas como necesites a esta única solicitud.</Text>
                        </Box>

                        {form.values.items.map((item, index) => (
                            <Card key={item.id} shadow="none" radius="32px" p={{ base: 32, md: 48 }} mb={rem(32)} bg="#F9F9F4" withBorder={false} style={{ position: 'relative' }}>
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
                                        data={['Media Manga Oversize', 'Franela Clásica', 'Tank Top', 'Sudadera (Hoodie)', 'Chemise']}
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

                                {/* IMAGE UPLOAD & PREVIEW AREA */}
                                <Box bg="#FFFFFF" p={rem(32)} style={{ borderRadius: '24px' }}>
                                    <SimpleGrid cols={{ base: 1, sm: item.image ? 2 : 1 }} spacing="xl">
                                        <Box>
                                            <FileInput
                                                label="Diseño deseado, solo el diseño (Max 5MB)"
                                                placeholder="Sube tu imagen (PNG, JPG)"
                                                size="xl"
                                                accept="image/png,image/jpeg,image/webp,.pdf"
                                                leftSection={<IconUpload size={24} />}
                                                {...form.getInputProps(`items.${index}.image`)}
                                                styles={{
                                                    label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, marginBottom: '16px' },
                                                    input: { backgroundColor: '#F9F9F4', border: '2px dashed rgba(11,48,34,0.1)', borderRadius: '16px', cursor: 'pointer', height: '80px' }
                                                }}
                                            />
                                        </Box>

                                        {item.image && (
                                            <Box style={{ height: '200px', backgroundColor: '#F4F4E8', borderRadius: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {item.image.type.startsWith('image/') ? (
                                                    <Image
                                                        src={URL.createObjectURL(item.image as File)}
                                                        alt="Design Preview"
                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                    />
                                                ) : (
                                                    <Box ta="center">
                                                        <IconPhoto size={48} color="rgba(11,48,34,0.3)" />
                                                        <Text mt="xs" fw={700} c="dimmed">{(item.image as File).name}</Text>
                                                    </Box>
                                                )}
                                            </Box>
                                        )}
                                    </SimpleGrid>
                                </Box>
                            </Card>
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
                            style={{ fontFamily: '"Montserrat", sans-serif', backgroundColor: '#0B3022', color: '#D4A017', fontSize: '1.4rem', height: 84, fontWeight: 800, transition: 'all 0.3s ease', border: 'none' }}
                        >
                            Enviar Solicitudes de Diseño
                        </Button>
                    </form>

                </Container>
            </AppShell.Main>

            <Footer />
        </AppShell>
    );
}
