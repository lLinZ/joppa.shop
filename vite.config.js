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
            exclude: /_pro\.(webp|png|jpe?g)$/i, // Evita tocar las imágenes procesadas manualmente
            png: { quality: 100 },
            pngquant: false,
            optipng: { optimizationLevel: 3 },
            jpeg: { quality: 90 },
            jpg: { quality: 90 },
            webp: { lossless: true },
        }),
    ],
});
