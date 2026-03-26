// <ai_context>
// Propósito: Checkout page premium para Joppa E-commerce. Muestra el formulario de datos del cliente
// y el resumen del carrito, luego envía la orden al CRM (Joppa CRM API) vía axios.
// Dependencias: @mantine/core, @mantine/form, @inertiajs/react, axios, zustand (useAppStore).
// </ai_context>

import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    AppShell,
    Box,
    Button,
    Divider,
    Flex,
    Grid,
    Group,
    Image,
    rem,
    Stack,
    Text,
    TextInput,
    Textarea,
    Title,
    ThemeIcon,
    Paper,
    Badge,
    SimpleGrid,
    Card,
    Select,
    ActionIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconShoppingBag, IconArrowLeft, IconBrandWhatsapp, IconShoppingCartPlus, IconMinus, IconPlus, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Header } from '../../Components/Layout/Header';
import { useAppStore } from '../../store/useAppStore';
import axios from 'axios';

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

const parsePrice = (priceStr: string): number => {
    const num = parseFloat(String(priceStr).replace(/[^0-9.-]+/g, ''));
    return isNaN(num) ? 0 : num;
};

export default function Checkout() {
    const [opened, { toggle }] = useDisclosure(false);
    const { cartItems, clearCart, addToCart, updateQuantity, removeFromCart } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [createdOrder, setCreatedOrder] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);

    React.useEffect(() => {
        // Fetch a few products for suggestions if the cart is empty
        fetch(`${CRM_API_URL}/catalog`)
            .then(res => res.json())
            .then(data => {
                if (data.products) {
                    // Randomize or just take the first 3
                    const shuffled = data.products.sort(() => 0.5 - Math.random());
                    setSuggestedProducts(shuffled.slice(0, 3));
                }
            })
            .catch(err => console.error(err));
    }, []);

    const subtotal = cartItems.reduce(
        (sum, item) => sum + parsePrice(item.price) * item.quantity,
        0
    );

    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            phone_prefix: '+58',
            phone_number: '',
            state: '',
            address_detail: '',
        },
        validate: {
            name: (v: string) => (v.trim().length < 2 ? 'Nombre requerido.' : null),
            email: (v: string) => (/^\S+@\S+$/.test(v) ? null : 'Email inválido.'),
            phone_number: (v: string) => (v.replace(/\D/g, '').length < 10 ? 'El número debe tener al menos 10 dígitos.' : null),
            state: (v: string) => (!v ? 'Estado requerido.' : null),
            address_detail: () => null,
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        setError(null);
        try {
            const payload = {
                name: values.name,
                email: values.email,
                phone: `${values.phone_prefix}${values.phone_number.replace(/\D/g, '')}`,
                address: values.state,
                notes: values.address_detail || null,
                total_amount: subtotal,
                items: cartItems.map((item) => ({
                    product_id: String(item.productId || item.id),
                    product_name: item.name,
                    quantity: item.quantity,
                    price: parsePrice(item.price),
                    size: item.size || null,
                    color: item.color || null,
                })),
            };

            const res = await axios.post(`${CRM_API_URL}/orders`, payload);
            clearCart();
            setCreatedOrder(res.data.order);
            setSuccess(true);
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.errors?.name?.[0] ||
                'Error al crear la orden. Intenta de nuevo.';
            setError(msg);
        } finally {
            setLoading(false);
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

    return (
        <AppShell header={{ height: 100, collapsed: false, offset: true }}>
            <Head title="Checkout - JOPPA" />
            <Header opened={opened} toggle={toggle} />

            <AppShell.Main bg="#F4F4E8" pt={rem(120)}>
                <Box px={{ base: 'md', md: 'xl' }} pb={rem(80)} maw={1100} mx="auto">

                    {/* Back link */}
                    <Button
                        variant="subtle"
                        color="dark"
                        leftSection={<IconArrowLeft size={16} stroke={2} />}
                        mb="xl"
                        style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 600 }}
                        onClick={() => router.visit('/')}
                    >
                        Volver a la tienda
                    </Button>

                    <Title
                        order={1}
                        mb="xl"
                        style={{
                            fontFamily: '"Montserrat", sans-serif',
                            fontWeight: 800,
                            letterSpacing: '-0.04em',
                            color: '#0B3022',
                        }}
                    >
                        Checkout
                    </Title>

                    {success ? (
                        /* ─── SUCCESS STATE ─── */
                        <Paper radius="32px" p={64} bg="#F9F9F4" ta="center">
                            <ThemeIcon size={80} radius="100%" color="teal" variant="light" mb="xl">
                                <IconCheck size={44} stroke={2} />
                            </ThemeIcon>
                            <Title order={2} mb="sm" style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 800 }}>
                                ¡Orden #{createdOrder?.id} recibida!
                            </Title>
                            <Text c="dimmed" size="lg" mb="xl" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                Tu pedido fue enviado correctamente. Por favor contáctanos por WhatsApp para coordinar el pago y envío.
                            </Text>
                            <Group justify="center" gap="md">
                                <Button
                                    size="lg"
                                    radius="xl"
                                    component="a"
                                    href={`https://wa.me/584222030200?text=Hola,%20acabo%20de%20hacer%20el%20pedido%20%23${createdOrder?.id}%20en%20la%20tienda.`}
                                    target="_blank"
                                    color="#25D366"
                                    c="#FFFFFF"
                                    leftSection={<IconBrandWhatsapp size={22} />}
                                    style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700 }}
                                >
                                    Contactar por WhatsApp
                                </Button>
                                <Button
                                    size="lg"
                                    radius="xl"
                                    variant="outline"
                                    color="#0B3022"
                                    style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700 }}
                                    onClick={() => router.visit('/')}
                                >
                                    Volver al Inicio
                                </Button>
                            </Group>
                        </Paper>
                    ) : cartItems.length === 0 ? (
                        /* ─── EMPTY CART STATE ─── */
                        <Stack gap="xl">
                            <Paper radius="32px" p={64} bg="#F9F9F4" ta="center">
                                <ThemeIcon size={80} radius="100%" color="gray" variant="light" mb="xl">
                                    <IconShoppingBag size={44} stroke={2} />
                                </ThemeIcon>
                                <Title order={2} mb="sm" style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 800 }}>
                                    Tu carrito está vacío
                                </Title>
                                <Text c="dimmed" size="lg" mb="xl" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                    Parece que aún no has agregado productos. Explora nuestro catálogo y descubre lo que tenemos para ti.
                                </Text>
                                <Button
                                    size="lg"
                                    radius="xl"
                                    color="#0B3022"
                                    c="#FFFFFF"
                                    style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700 }}
                                    onClick={() => router.visit('/catalog')}
                                >
                                    Ir al Catálogo de Productos
                                </Button>
                            </Paper>
                        </Stack>
                    ) : (
                        /* ─── CHECKOUT FORM ─── */
                        <Grid gutter="xl">
                            {/* LEFT: Form */}
                            <Grid.Col span={{ base: 12, md: 7 }}>
                                <Paper radius="32px" p={36} bg="#F9F9F4">
                                    <Text
                                        fw={800}
                                        size="xl"
                                        mb="lg"
                                        style={{ fontFamily: '"Montserrat", sans-serif', color: '#0B3022' }}
                                    >
                                        Datos de entrega
                                    </Text>
                                    <form onSubmit={form.onSubmit(handleSubmit)}>
                                        <Stack gap="md">
                                            <TextInput
                                                label="Nombre completo"
                                                placeholder="Juan Pérez"
                                                radius="xl"
                                                size="md"
                                                styles={{
                                                    label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 600, marginBottom: 6 },
                                                    input: { fontFamily: '"Montserrat", sans-serif', backgroundColor: '#FFFFFF' },
                                                }}
                                                {...form.getInputProps('name')}
                                            />
                                            <TextInput
                                                label="Email"
                                                placeholder="juan@ejemplo.com"
                                                radius="xl"
                                                size="md"
                                                type="email"
                                                styles={{
                                                    label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 600, marginBottom: 6 },
                                                    input: { fontFamily: '"Montserrat", sans-serif', backgroundColor: '#FFFFFF' },
                                                }}
                                                {...form.getInputProps('email')}
                                            />
                                            <Grid gutter="md">
                                                <Grid.Col span={4}>
                                                    <Select
                                                        label="Cód. País"
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
                                                            label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 600, marginBottom: 6 },
                                                            input: { fontFamily: '"Montserrat", sans-serif', backgroundColor: '#FFFFFF', paddingLeft: 42 },
                                                        }}
                                                        {...form.getInputProps('phone_prefix')}
                                                    />
                                                </Grid.Col>
                                                <Grid.Col span={8}>
                                                    <TextInput
                                                        label="Teléfono"
                                                        placeholder="412-123-4567"
                                                        radius="xl"
                                                        size="md"
                                                        type="tel"
                                                        styles={{
                                                            label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 600, marginBottom: 6 },
                                                            input: { fontFamily: '"Montserrat", sans-serif', backgroundColor: '#FFFFFF' },
                                                        }}
                                                        {...form.getInputProps('phone_number')}
                                                        onChange={handlePhoneChange}
                                                    />
                                                </Grid.Col>
                                            </Grid>

                                            <Select
                                                label="Estado (Venezuela)"
                                                placeholder="Selecciona un estado"
                                                data={['Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar', 'Carabobo', 'Cojedes', 'Delta Amacuro', 'Distrito Capital', 'Falcón', 'Guárico', 'Lara', 'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre', 'Táchira', 'Trujillo', 'La Guaira', 'Yaracuy', 'Zulia']}
                                                radius="xl"
                                                size="md"
                                                styles={{
                                                    label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 600, marginBottom: 6 },
                                                    input: { fontFamily: '"Montserrat", sans-serif', backgroundColor: '#FFFFFF' },
                                                }}
                                                {...form.getInputProps('state')}
                                            />

                                            <Textarea
                                                label="Instrucciones de Entrega (Opcional)"
                                                placeholder="Municipio, zona, punto de referencia o instrucciones adicionales"
                                                radius="lg"
                                                size="md"
                                                rows={3}
                                                styles={{
                                                    label: { fontFamily: '"Montserrat", sans-serif', fontWeight: 600, marginBottom: 6 },
                                                    input: { fontFamily: '"Montserrat", sans-serif', backgroundColor: '#FFFFFF' },
                                                }}
                                                {...form.getInputProps('address_detail')}
                                            />

                                            {error && (
                                                <Text c="red" size="sm" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                                    {error}
                                                </Text>
                                            )}

                                            <Button
                                                type="submit"
                                                fullWidth
                                                size="xl"
                                                radius="xl"
                                                color="#0B3022"
                                                c="#FFFFFF"
                                                h={60}
                                                loading={loading}
                                                style={{
                                                    fontWeight: 800,
                                                    fontSize: '1.05rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    fontFamily: '"Montserrat", sans-serif',
                                                    marginTop: 8,
                                                }}
                                            >
                                                Confirmar Orden — ${subtotal.toFixed(2)}
                                            </Button>
                                        </Stack>
                                    </form>
                                </Paper>
                            </Grid.Col>

                            {/* RIGHT: Order Summary */}
                            <Grid.Col span={{ base: 12, md: 5 }}>
                                <Paper radius="32px" p={36} bg="#F9F9F4">
                                    <Group justify="space-between" mb="lg">
                                        <Text fw={800} size="xl" style={{ fontFamily: '"Montserrat", sans-serif', color: '#0B3022' }}>
                                            Tu pedido
                                        </Text>
                                        <Badge color="dark" radius="xl" variant="light">
                                            {cartItems.length} {cartItems.length === 1 ? 'artículo' : 'artículos'}
                                        </Badge>
                                    </Group>

                                        <Stack gap="sm">
                                            {cartItems.map((item) => (
                                                <Group key={item.id} wrap="nowrap" align="center">
                                                    <Box
                                                        w={60}
                                                        h={72}
                                                        style={{ borderRadius: 12, overflow: 'hidden', backgroundColor: '#F4F4E8', flexShrink: 0 }}
                                                    >
                                                        <Image src={item.image} alt={item.name} height={72} fit="cover" style={{ mixBlendMode: 'darken' }} />
                                                    </Box>
                                                    <Box style={{ flex: 1 }}>
                                                        <Text fw={700} size="sm" c="#000000" style={{ fontFamily: '"Montserrat", sans-serif', lineHeight: 1.2 }}>
                                                            {item.name}
                                                        </Text>
                                                        {(item.color || item.size) && (
                                                            <Text size="11px" c="dimmed" fw={600} style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                                {item.color} {item.color && item.size && '•'} {item.size}
                                                            </Text>
                                                        )}
                                                        <Group gap={8} mt="xs">
                                                            <Group gap={4} bg="#F4F4E8" style={{ borderRadius: 20 }} p={4}>
                                                                <ActionIcon 
                                                                    size="sm" 
                                                                    radius="xl" 
                                                                    variant="transparent" 
                                                                    color="dark"
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                >
                                                                    <IconMinus size={14} />
                                                                </ActionIcon>
                                                                <Text size="sm" fw={700} w={20} ta="center" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                                                    {item.quantity}
                                                                </Text>
                                                                <ActionIcon 
                                                                    size="sm" 
                                                                    radius="xl" 
                                                                    variant="transparent" 
                                                                    color="dark"
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                >
                                                                    <IconPlus size={14} />
                                                                </ActionIcon>
                                                            </Group>
                                                            <ActionIcon 
                                                                size="md" 
                                                                variant="subtle" 
                                                                color="red"
                                                                onClick={() => removeFromCart(item.id)}
                                                            >
                                                                <IconTrash size={16} />
                                                            </ActionIcon>
                                                        </Group>
                                                    </Box>
                                                    <Text fw={800} size="sm" c="#000000" style={{ fontFamily: '"Montserrat", sans-serif', flexShrink: 0 }}>
                                                        ${(parsePrice(item.price) * item.quantity).toFixed(2)}
                                                    </Text>
                                                </Group>
                                            ))}

                                            <Divider my="sm" color="#E8E8E0" />

                                            <Group justify="space-between">
                                                <Text fw={600} c="dimmed" style={{ fontFamily: '"Montserrat", sans-serif' }}>Total</Text>
                                                <Text fw={800} size="xl" c="#000000" style={{ fontFamily: '"Montserrat", sans-serif', letterSpacing: '-0.02em' }}>
                                                    ${subtotal.toFixed(2)}
                                                </Text>
                                            </Group>
                                        </Stack>
                                </Paper>
                            </Grid.Col>
                        </Grid>
                    )}

                    {!success && suggestedProducts.length > 0 && (
                        <Box mt={64}>
                            <Title order={3} mb="xl" c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 800 }}>
                                Productos Destacados
                            </Title>
                            <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="xl">
                                {suggestedProducts.map(p => (
                                    <Card key={p.id} radius="xl" p="md" bg="#FFFFFF" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                                        <Card.Section mb="sm">
                                            <Box style={{ aspectRatio: '1', backgroundColor: '#F0EFE6', overflow: 'hidden' }}>
                                                {p.images?.[0] ? (
                                                    <Image src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <Flex justify="center" align="center" h="100%">
                                                        <IconShoppingBag size={40} color="#C8C7BC" stroke={1} />
                                                    </Flex>
                                                )}
                                            </Box>
                                        </Card.Section>
                                        <Text fw={700} size="sm" lineClamp={1} style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                            {p.name}
                                        </Text>
                                        <Text fw={800} size="md" c="#0B3022" mt={2} mb="md" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                            ${Number(p.price).toLocaleString('es-AR')}
                                        </Text>
                                        <Button
                                            fullWidth
                                            radius="xl"
                                            variant="light"
                                            color="#0B3022"
                                            leftSection={<IconShoppingCartPlus size={18} />}
                                            onClick={() => addToCart({
                                                id: p.id,
                                                name: p.name,
                                                price: typeof p.price === 'number' ? p.price.toString() : p.price,
                                                image: p.images?.[0] || ''
                                            })}
                                            style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 600 }}
                                        >
                                            Agregar rápido
                                        </Button>
                                    </Card>
                                ))}
                            </SimpleGrid>
                        </Box>
                    )}
                </Box>
            </AppShell.Main>
        </AppShell>
    );
}
