import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const input = 'resources/images/portada_dario.png';
const output = 'resources/images/portada_dario_pro.webp';

async function processImage() {
    try {
        console.log('Processing with ICC profile retention...');
        await sharp(input)
            .withMetadata() // Preserve EXIF/ICC profiles to avoid color wash!
            .webp({ quality: 85, lossless: false })
            .toFile(output);
        
        const inStats = fs.statSync(input);
        const outStats = fs.statSync(output);
        console.log(`✅ Done. Original: ${(inStats.size/1024/1024).toFixed(2)}MB -> New: ${(outStats.size/1024/1024).toFixed(2)}MB`);
    } catch (e) {
        console.error('Error:', e);
    }
}

processImage();
