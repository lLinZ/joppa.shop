import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Text, 
    Group, 
    Stack, 
    Button, 
    TextInput, 
    Textarea, 
    Rating, 
    Paper, 
    Divider, 
    Badge, 
    Alert,
    Progress,
    ActionIcon,
    Collapse,
    rem
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Check, Star, MessageSquare, Plus, X, AlertCircle } from 'lucide-react';

interface Review {
    id: number;
    rating: number;
    comment: string;
    user_name: string;
    is_verified_purchase: boolean;
    created_at: string;
}

interface ReviewStats {
    total: number;
    average: number;
    breakdown: { [key: number]: number };
}

export default function ProductReviews({ productId, crmBase }: { productId: string | number, crmBase: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [opened, { toggle }] = useDisclosure(false);
    const [statsOpened, { toggle: toggleStats }] = useDisclosure(false);

    // Form state
    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        rating: 5,
        comment: ''
    });

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${crmBase}/catalog/${productId}/reviews`);
            if (!res.ok) throw new Error('Failed to fetch reviews');
            const data = await res.json();
            setReviews(data.reviews);
            setStats(data.stats);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const res = await fetch(`${crmBase}/catalog/${productId}/reviews`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const contentType = res.headers.get('content-type');
            let data;
            
            if (contentType && contentType.includes('application/json')) {
                data = await res.json();
            } else {
                throw new Error('El servidor no respondió correctamente (Error de Configuración).');
            }

            if (!res.ok) {
                // Handle Laravel validation errors specifically
                if (res.status === 422 && data.errors) {
                    const firstError = Object.values(data.errors)[0] as string[];
                    throw new Error(firstError[0] || 'Datos inválidos');
                }
                throw new Error(data.message || 'Error al enviar la reseña');
            }

            setSuccessMessage('¡Gracias! Tu reseña ha sido enviada y será publicada tras ser revisada.');
            setFormData({ user_name: '', user_email: '', rating: 5, comment: '' });
            toggle();
        } catch (err: any) {
            setErrorMessage(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return null;

    return (
        <Box mt={80} id="reviews-section" style={{ borderTop: '1px solid rgba(11,48,34,0.1)', paddingTop: '4rem' }}>
            <Group justify="space-between" mb={40} align="flex-end">
                        <Box>
                            <Text 
                                size={rem(14)} 
                                fw={700} 
                                c="#0B3022" 
                                mb={8} 
                                style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: '"Montserrat", sans-serif' }}
                            >
                                Opiniones Reales
                            </Text>
                            <Group gap="xs" style={{ cursor: 'pointer' }} onClick={toggleStats} title="Click para ver detalles">
                                <Rating 
                                    value={stats?.average || 0} 
                                    readOnly 
                                    fractions={2} 
                                    color="#CC9966"
                                    size="sm"
                                />
                                <Text 
                                    size={rem(18)} 
                                    fw={500} 
                                    c="#0B3022"
                                    style={{ fontFamily: '"Montserrat", sans-serif' }}
                                >
                                    {stats?.average.toFixed(1)} <Text span size="xs" c="dimmed" fw={400}>/ 5</Text>
                                </Text>
                            </Group>
                            
                            <Button 
                                variant="subtle" 
                                color="#0B3022" 
                                size="compact-xs" 
                                onClick={toggleStats}
                                styles={{ label: { fontSize: rem(11), textDecoration: 'underline' } }}
                                mt={4}
                            >
                                {statsOpened ? 'Cerrar detalles' : `Ver ${stats?.total} reseñas`}
                            </Button>
                        </Box>
                <Button 
                    variant="outline" 
                    color="#0B3022" 
                    radius="xl" 
                    size="xs"
                    px="lg"
                    leftSection={opened ? <X size={14} /> : <Plus size={14} />}
                    onClick={toggle}
                    style={{ 
                        borderWidth: '1.5px', 
                        fontFamily: '"Montserrat", sans-serif',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {opened ? 'Cancelar' : 'Escribir una reseña'}
                </Button>
            </Group>

            {/* Stats Collagen */}
            <Collapse in={statsOpened}>
                <Paper mb={40} p={30} bg="rgba(11,48,34,0.02)" radius="xl" style={{ border: '1px solid rgba(11,48,34,0.05)' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <Stack gap="xs">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = stats?.breakdown[star] || 0;
                                const percentage = stats?.total ? (count / stats.total) * 100 : 0;
                                return (
                                    <Group key={star} gap="md" wrap="nowrap">
                                        <Group gap={4} w={70}>
                                            <Text size="xs" fw={700} c="#0B3022">{star}</Text>
                                            <Star size={10} className="fill-zinc-400 text-zinc-400" />
                                        </Group>
                                        <Progress 
                                            value={percentage} 
                                            color="#0B3022" 
                                            size={3} 
                                            radius="xl" 
                                            style={{ flex: 1 }}
                                            bg="rgba(11,48,34,0.05)"
                                        />
                                        <Text size="xs" c="dimmed" w={20} ta="right">{count}</Text>
                                    </Group>
                                );
                            })}
                        </Stack>
                        <Box ta="center" hiddenFrom="md">
                           <Divider my="xl" label="Comentarios" labelPosition="center" color="rgba(11,48,34,0.1)" />
                        </Box>
                        <Box ta="center" visibleFrom="md">
                            <Text size="sm" c="dimmed">Basado en {stats?.total} opiniones de clientes verificados y visitantes.</Text>
                        </Box>
                    </div>
                </Paper>
            </Collapse>

            {/* Submission Form */}
            <Collapse in={opened}>
                <Paper withBorder p={30} radius="xl" mb={50} bg="rgba(11,48,34,0.02)" style={{ borderColor: 'rgba(11,48,34,0.1)' }}>
                    <form onSubmit={handleSubmit}>
                        <Stack gap={20}>
                            <Text fw={600} size="md" c="#0B3022" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                Comparte tu experiencia
                            </Text>
                            
                            <Box>
                                <Text size="xs" fw={700} c="#0B3022" mb={10} style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Tu Calificación
                                </Text>
                                <Rating 
                                    size="lg" 
                                    value={formData.rating} 
                                    onChange={(val) => setFormData({...formData, rating: val})} 
                                    color="#CC9966"
                                />
                            </Box>

                            <Group grow gap="xl">
                                <TextInput
                                    label="Nombre"
                                    placeholder="Nombre completo"
                                    required
                                    variant="filled"
                                    value={formData.user_name}
                                    onChange={(e) => setFormData({...formData, user_name: e.target.value})}
                                    radius="md"
                                    styles={{ input: { backgroundColor: 'white', border: '1px solid rgba(11,48,34,0.1)' } }}
                                />
                                <TextInput
                                    label="Email"
                                    placeholder="Para validación"
                                    value={formData.user_email}
                                    onChange={(e) => setFormData({...formData, user_email: e.target.value})}
                                    radius="md"
                                    variant="filled"
                                    styles={{ input: { backgroundColor: 'white', border: '1px solid rgba(11,48,34,0.1)' } }}
                                />
                            </Group>

                            <Textarea
                                label="Tu Reseña"
                                placeholder="Escribe aquí tu comentario sobre el producto..."
                                required
                                minRows={3}
                                variant="filled"
                                value={formData.comment}
                                onChange={(e) => setFormData({...formData, comment: e.target.value})}
                                radius="md"
                                styles={{ input: { backgroundColor: 'white', border: '1px solid rgba(11,48,34,0.1)' } }}
                            />

                            <Group justify="flex-end">
                                <Button 
                                    type="submit" 
                                    bg="#0B3022" 
                                    radius="xl" 
                                    size="md"
                                    px={30}
                                    loading={submitting}
                                >
                                    Publicar reseña
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Paper>
            </Collapse>

            {/* Feedback Messages */}
            {successMessage && (
                <Alert icon={<Check size={16} />} color="teal" variant="light" mb="xl" radius="xl">
                    {successMessage}
                </Alert>
            )}
            {errorMessage && (
                <Alert icon={<AlertCircle size={16} />} color="red" variant="light" mb="xl" radius="xl">
                    {errorMessage}
                </Alert>
            )}

            <Box>
                {/* Reviews List */}
                <Box>
                    {reviews.length === 0 ? (
                        <Paper p={40} radius="xl" bg="rgba(11,48,34,0.03)" ta="center" style={{ border: '1px dashed rgba(11,48,34,0.1)' }}>
                            <Box c="dimmed">
                                <MessageSquare size={32} strokeWidth={1} style={{ marginBottom: 12 }} />
                                <Text fw={500} size="sm">Aún no hay reseñas publicadas.</Text>
                                <Text size="xs">Sé el primero en calificar tu compra.</Text>
                            </Box>
                        </Paper>
                    ) : (
                        <Stack gap={40}>
                            {reviews.map((review) => (
                                <Box key={review.id}>
                                    <Group justify="space-between" mb="xs" align="flex-start">
                                        <Stack gap={2}>
                                            <Rating value={review.rating} readOnly size="xs" color="#CC9966" />
                                            <Group gap={8}>
                                                <Text fw={600} size="sm" c="#0B3022">{review.user_name}</Text>
                                                {review.is_verified_purchase && (
                                                    <Group gap={4}>
                                                        <Check size={10} color="#0B3022" strokeWidth={3} />
                                                        <Text size="xs" fw={700} c="#0B3022" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '10px' }}>
                                                            Compra Verificada
                                                        </Text>
                                                    </Group>
                                                )}
                                            </Group>
                                        </Stack>
                                        <Text size={rem(10)} c="dimmed" fw={500} style={{ textTransform: 'uppercase' }}>
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </Text>
                                    </Group>
                                    <Text size="sm" lh={1.7} c="#4A4A4A" style={{ maxWidth: '600px' }}>
                                        {review.comment}
                                    </Text>
                                    <Divider mt={30} color="rgba(11,48,34,0.05)" />
                                </Box>
                            ))}
                        </Stack>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
