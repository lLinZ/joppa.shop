import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
        ViteImageOptimizer({
            png: { quality: 100 }, // Calidad nativa para no destruir el perfil ICC (color)
            jpeg: { quality: 90 }, // 90 es el borde dulce seguro para JPEG
            jpg: { quality: 90 },
            webp: { quality: 90, lossless: true },
        }),
    ],
});
