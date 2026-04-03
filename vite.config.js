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
            png: { quality: 100 },
            pngquant: false, // <- Apaga el compresor de colores que estaba lavando tus imágenes
            optipng: { optimizationLevel: 3 }, // Solo comprime datos sin borrar paletas de color
            jpeg: { quality: 90 },
            jpg: { quality: 90 },
            webp: { lossless: true },
        }),
    ],
});
