// <ai_context>
// Propósito: React Component que provee el aura radiante Forest Green para fondos de vistas de Producto.
// Responsividad: Fluido con absolute positioning cubriendo la vista respectiva sin interrumpir DOM flow.
// Dependencias: @mantine/core.
// </ai_context>

import React from 'react';
import { Box } from '@mantine/core';

export default function ProductAura() {
    return (
        <Box style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <Box style={{
                position: 'absolute',
                top: '-10%',
                right: '10%',
                width: '600px',
                height: '600px',
                backgroundColor: '#0B3022',
                borderRadius: '50%',
                filter: 'blur(150px)',
                opacity: 0.04
            }} />
            <Box style={{
                position: 'absolute',
                bottom: '10%',
                left: '-5%',
                width: '800px',
                height: '800px',
                backgroundColor: '#0B3022',
                borderRadius: '50%',
                filter: 'blur(150px)',
                opacity: 0.05
            }} />
        </Box>
    );
}
