<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <meta name="description" content="{{ $og_description ?? 'JOPPA Boutique: Edición Ilimitada. Diseños con alma vintage y tela premium. Tu idea, nuestra tinta.' }}">
        <link rel="canonical" href="{{ url()->current() }}" />

        <meta property="og:title" content="{{ $og_title ?? 'JOPPA Boutique - Edición Ilimitada' }}" />
        <meta property="og:description" content="{{ $og_description ?? 'Diseños con alma vintage y tela premium. Tu idea, nuestra tinta.' }}" />
        <meta property="og:image" content="{{ $og_image ?? asset('portada_dario.png') }}" />
        <meta property="og:url" content="{{ $og_url ?? url()->current() }}" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="{{ $og_title ?? 'JOPPA Boutique' }}" />
        <meta name="twitter:description" content="{{ $og_description ?? 'Edición Ilimitada de JOPPA Boutique.' }}" />
        <meta name="twitter:image" content="{{ $og_image ?? asset('portada_dario.png') }}" />

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
