<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use App\Http\Controllers\SitemapController;

Route::get('/sitemap.xml', [SitemapController::class, 'index']);

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/product/{id}', function ($id) {
    $og_title = 'Joppa | Estampados en DTF de alta calidad';
    $og_description = 'Los mejores estampados en DTF de alta calidad. Crea y personaliza tus prendas con Joppa, tu tienda virtual de estampados.';
    $og_image = \Illuminate\Support\Facades\Vite::asset('resources/images/portada_dario.png');

    try {
        $response = Http::get(env('VITE_CRM_API_URL') . '/catalog/' . $id);
        if ($response->successful()) {
            $product = $response->json('product');
            $og_title = $product['name'] . ' - JOPPA Boutique';
            if (!empty($product['description'])) {
                $og_description = htmlspecialchars(strip_tags($product['description']));
            }
            if (!empty($product['images']) && count($product['images']) > 0) {
                $og_image = $product['images'][0];
            }
        }
    } catch (\Exception $e) {}

    return Inertia::render('Product/BetaShow', [
        'id' => $id
    ])->withViewData([
        'og_title' => $og_title,
        'og_description' => $og_description,
        'og_image' => $og_image,
        'og_url' => url()->current(),
    ]);
})->name('product.show');

Route::get('/product/{id}/legacy', function ($id) {
    // Legacy view for fallback
    $og_title = 'Joppa | Estampados en DTF de alta calidad';
    $og_description = 'Los mejores estampados en DTF de alta calidad. Crea y personaliza tus prendas con Joppa, tu tienda virtual de estampados.';
    $og_image = \Illuminate\Support\Facades\Vite::asset('resources/images/portada_dario.png');

    try {
        $response = Http::get(env('VITE_CRM_API_URL') . '/catalog/' . $id);
        if ($response->successful()) {
            $product = $response->json('product');
            $og_title = $product['name'] . ' - JOPPA Boutique';
            if (!empty($product['description'])) {
                $og_description = htmlspecialchars(strip_tags($product['description']));
            }
            if (!empty($product['images']) && count($product['images']) > 0) {
                $og_image = $product['images'][0];
            }
        }
    } catch (\Exception $e) {}

    return Inertia::render('Product/Show', [
        'id' => $id
    ])->withViewData([
        'og_title' => $og_title,
        'og_description' => $og_description,
        'og_image' => $og_image,
        'og_url' => url()->current(),
    ]);
})->name('product.legacy');

Route::get('/product/{id}/beta', function ($id) {
    return redirect()->route('product.show', ['id' => $id]);
});

Route::get('/catalog', function () {
    return Inertia::render('Catalog/Index')->withViewData([
        'og_title' => 'Catálogo Oficial | Joppa',
        'og_description' => 'Explora nuestra inmensa colección de prendas con estampados en DTF premium listas para ti.',
        'og_image' => \Illuminate\Support\Facades\Vite::asset('resources/images/portada.jpeg'),
        'og_url' => url()->current(),
    ]);
})->name('catalog.index');

Route::get('/catalog/{id}', function ($id) {
    $og_title = 'JOPPA Boutique - Edición Ilimitada';
    $og_description = 'Diseños con alma vintage y tela premium. Tu idea, nuestra tinta.';
    $og_image = asset('portada_dario.png');

    try {
        $response = Http::get(env('VITE_CRM_API_URL') . '/catalog/' . $id);
        if ($response->successful()) {
            $product = $response->json('product');
            $og_title = $product['name'] . ' - JOPPA Boutique';
            if (!empty($product['description'])) {
                $og_description = htmlspecialchars(strip_tags($product['description']));
            }
            if (!empty($product['images']) && count($product['images']) > 0) {
                $og_image = $product['images'][0];
            }
        }
    } catch (\Exception $e) {}

    return Inertia::render('Product/BetaShow', [
        'id' => $id,
        'fromCatalog' => true,
    ])->withViewData([
        'og_title' => $og_title,
        'og_description' => $og_description,
        'og_image' => $og_image,
        'og_url' => url()->current(),
    ]);
})->name('catalog.show');

Route::get('/catalog/{id}/legacy', function ($id) {
    return Inertia::render('Product/Show', [
        'id' => $id,
        'fromCatalog' => true,
    ]);
})->name('catalog.legacy');

Route::get('/catalog/{id}/beta', function ($id) {
    return redirect()->route('catalog.show', ['id' => $id]);
});

Route::get('/checkout', function () {
    return Inertia::render('Checkout/Checkout');
})->name('checkout');

Route::get('/custom-design', function () {
    return Inertia::render('CustomDesign')->withViewData([
        'og_title' => 'Design Studio | Joppa',
        'og_description' => 'Personaliza desde cero tu prenda ideal en nuestro Estudio de Diseño interactivo.',
        'og_image' => \Illuminate\Support\Facades\Vite::asset('resources/images/portada_dario_gemini.png'),
        'og_url' => url()->current(),
    ]);
})->name('custom.design');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

// Proxy de Imágenes para resolver problemas de CORS/403 con el CRM en local
Route::get('/api/proxy-image', function (Illuminate\Http\Request $request) {
    try {
        $url = $request->query('url');
        if (!$url) return response('Missing URL', 400);

        // Robust URL handling: ensure it has the CRM base if it's a relative storage path
        if (str_starts_with($url, 'storage/')) {
            $base = env('VITE_CRM_API_URL');
            $base = preg_replace('/\/api\/?$/', '', $base);
            if ($base) $url = $base . '/' . $url;
        }

        $parsedUrl = parse_url($url);
        $urlHost = $parsedUrl['host'] ?? '';
        $currentHost = parse_url(config('app.url'), PHP_URL_HOST) ?? 'localhost';
        
        // Security: Allow local hosts and specifically the crm subdomain
        $crmHost = parse_url(env('VITE_CRM_API_URL'), PHP_URL_HOST);
        $allowedHosts = ['localhost', '127.0.0.1', $currentHost, 'crm.joppa.shop'];
        if ($crmHost) $allowedHosts[] = $crmHost;

        if (!in_array($urlHost, $allowedHosts) && !str_ends_with($urlHost, '.joppa.shop')) {
            return response("Forbidden: Host $urlHost not allowed", 403);
        }

        // Support for video streaming and partial content
        $streamOptions = ['stream' => true];
        $requestHeaders = [];
        if (request()->header('Range')) {
            $requestHeaders['Range'] = request()->header('Range');
        }

        $streamResponse = Http::timeout(60)->withHeaders($requestHeaders)->withOptions($streamOptions)->get($url);
        
        if ($streamResponse->failed()) {
            // Fallback for cases where it fails due to range (some servers don't like it)
            if (isset($requestHeaders['Range'])) {
                $streamResponse = Http::timeout(60)->withOptions($streamOptions)->get($url);
            }
        }
        
        if ($streamResponse->failed()) {
            \Illuminate\Support\Facades\Log::error("Proxy failed for $url: " . $streamResponse->status());
            return response("Target returned " . $streamResponse->status(), 502);
        }

        $status = $streamResponse->status();
        $headers = [
            'Content-Type' => $streamResponse->header('Content-Type'),
            'Cache-Control' => 'no-cache, private', // Better for proxied streams
            'X-Accel-Buffering' => 'no', // DIRECTIVE TO NGINX: Do NOT buffer this stream
            'Accept-Ranges' => 'bytes',
        ];

        if ($streamResponse->header('Content-Range')) {
            $headers['Content-Range'] = $streamResponse->header('Content-Range');
        }

        // Only forward Content-Length if it's a fixed response (not already chunked by upstream)
        if ($streamResponse->header('Content-Length') && $status === 206) {
             $headers['Content-Length'] = $streamResponse->header('Content-Length');
        }

        return response()->stream(function () use ($streamResponse) {
            // Ensure no output buffering is active that could cause memory issues
            if (ob_get_level()) ob_end_clean();
            
            $body = $streamResponse->toPsrResponse()->getBody();
            while (!$body->eof()) {
                echo $body->read(1024 * 64); // 64kb chunks
                flush();
            }
        }, $status, $headers);
    } catch (\Exception $e) {
        \Illuminate\Support\Facades\Log::error("Proxy Exception for $url: " . $e->getMessage());
        return response("Internal Server Error: " . $e->getMessage(), 500);
    }
})->name('proxy.image');
