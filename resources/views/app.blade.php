<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Joppa | Estampados en DTF de alta calidad') }}</title>

        <meta name="description" content="{{ $og_description ?? 'Los mejores estampados en DTF de alta calidad. Crea y personaliza tus prendas con Joppa, tu tienda virtual de estampados.' }}">
        <link rel="canonical" href="{{ url()->current() }}" />

        <meta property="og:site_name" content="Joppa" />
        <meta property="og:title" content="{{ $og_title ?? 'Joppa | Estampados en DTF de alta calidad' }}" />
        <meta property="og:description" content="{{ $og_description ?? 'Los mejores estampados en DTF de alta calidad. Crea y personaliza tus prendas con Joppa, tu tienda virtual de estampados.' }}" />
        <meta property="og:image" content="{{ $og_image ?? Vite::asset('resources/images/portada_dario.png') }}" />
        <meta property="og:url" content="{{ $og_url ?? url()->current() }}" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="{{ $og_title ?? 'Joppa | Estampados en DTF de alta calidad' }}" />
        <meta name="twitter:description" content="{{ $og_description ?? 'Los mejores estampados en DTF de alta calidad. Crea y personaliza tus prendas con Joppa.' }}" />
        <meta name="twitter:image" content="{{ $og_image ?? Vite::asset('resources/images/portada_dario.png') }}" />

        <!-- Favicons y SEO Mobile Icons (Previene que Google cachee logos por defecto) -->
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />

        <!-- SEO Structured Data (JSON-LD) para incentivar Sitelinks de Google -->
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "name": "Joppa",
              "url": "https://www.joppa.shop/"
            },
            {
              "@type": "SiteNavigationElement",
              "name": "Custom Design",
              "url": "https://www.joppa.shop/custom-design",
              "description": "Crea y personaliza tu propio estampado en DTF de alta calidad."
            },
            {
              "@type": "SiteNavigationElement",
              "name": "Catálogo",
              "url": "https://www.joppa.shop/catalog",
              "description": "Explora nuestra colección de prendas con estampados premium."
            }
          ]
        }
        </script>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-E45Q26Z1H3"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-E45Q26Z1H3');
        </script>

        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
