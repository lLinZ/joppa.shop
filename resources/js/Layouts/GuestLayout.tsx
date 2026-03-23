// <ai_context>
// Propósito: Layout principal para páginas de autenticación (Login, Registro).
// Responsividad: Contenedor centrado que se adapta al ancho de pantalla en móviles, con máximo en desktop.
// Dependencias: @mantine/core, @inertiajs/react.
// Debugging: Revisar color de fondo '#F5F5DC'.
// </ai_context>

import React, { PropsWithChildren } from 'react';
import { Center, Container, Paper, Title, Anchor } from '@mantine/core';
import { Link } from '@inertiajs/react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <Center style={{ minHeight: '100vh', backgroundColor: '#F5F5DC' }}>
            <Container size="xs" w="100%">
                <Center mb="xl">
                    <Anchor component={Link} href="/" underline="never">
                        <Title c="#0B3022" order={1} style={{ letterSpacing: '-0.05em', fontWeight: 900 }}>
                            JOPPA
                        </Title>
                    </Anchor>
                </Center>
                <Paper radius="md" p="xl" shadow="sm" withBorder>
                    {children}
                </Paper>
            </Container>
        </Center>
    );
}
