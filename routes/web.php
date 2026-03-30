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
    return Inertia::render('Catalog/Index');
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
    return Inertia::render('CustomDesign');
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

        $parsedUrl = parse_url($url);
        $urlHost = $parsedUrl['host'] ?? '';
        $currentHost = parse_url(config('app.url'), PHP_URL_HOST) ?? 'localhost';
        
        // If the URL is already on the current host, redirect or return the content directly
        // to avoid recursive/deadlock proxying in single-threaded environments
        if (in_array($urlHost, [$currentHost, 'localhost', '127.0.0.1'])) {
            // If it's the same port as this app, we should probably just return it or let the client fetch it
            // However, the client uses the proxy precisely because it might have CORS/403 issues.
            // But if it's the SAME app, it shouldn't have CORS issues.
        }

        // Security: Allow local hosts and specifically the crm subdomain
        $crmHost = parse_url(env('VITE_CRM_API_URL'), PHP_URL_HOST);
        $allowedHosts = ['localhost', '127.0.0.1', $currentHost, 'crm.joppa.shop'];
        if ($crmHost) $allowedHosts[] = $crmHost;

        if (!in_array($urlHost, $allowedHosts) && !str_ends_with($urlHost, '.joppa.shop')) {
            return response("Forbidden: Host $urlHost not allowed", 403);
        }

        $imgResponse = Http::timeout(10)->get($url);
        
        if ($imgResponse->failed()) {
            \Illuminate\Support\Facades\Log::error("Proxy failed for $url: " . $imgResponse->status());
            return response("Target returned " . $imgResponse->status(), 502);
        }

        return response($imgResponse->body())
            ->header('Content-Type', $imgResponse->header('Content-Type'))
            ->header('Cache-Control', 'public, max-age=3600');
    } catch (\Exception $e) {
        \Illuminate\Support\Facades\Log::error("Proxy Exception for $url: " . $e->getMessage());
        return response("Internal Server Error: " . $e->getMessage(), 500);
    }
})->name('proxy.image');
