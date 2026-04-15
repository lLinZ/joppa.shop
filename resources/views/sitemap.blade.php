@php echo '<?xml version="1.0" encoding="UTF-8"?>'; @endphp
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Home -->
    <url>
        <loc>{{ url('/') }}</loc>
        <lastmod>{{ now()->toAtomString() }}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    
    <!-- Catálogo Principal -->
    <url>
        <loc>{{ url('/catalog') }}</loc>
        <lastmod>{{ now()->toAtomString() }}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>

    <!-- Diseño Personalizado -->
    <url>
        <loc>{{ url('/custom-design') }}</loc>
        <lastmod>{{ now()->toAtomString() }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>

    <!-- Contacto -->
    <url>
        <loc>{{ url('/contact') }}</loc>
        <lastmod>{{ now()->toAtomString() }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>

    <!-- Productos Dinámicos -->
    @if(isset($products) && is_array($products))
        @foreach($products as $product)
        <url>
            <loc>{{ url('/catalog/' . ($product['slug'] ?? $product['id'])) }}</loc>
            <lastmod>{{ isset($product['updated_at']) ? \Illuminate\Support\Carbon::parse($product['updated_at'])->toAtomString() : now()->toAtomString() }}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>
        @endforeach
    @endif
</urlset>
