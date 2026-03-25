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

    return Inertia::render('Product/Show', [
        'id' => $id
    ])->withViewData([
        'og_title' => $og_title,
        'og_description' => $og_description,
        'og_image' => $og_image,
        'og_url' => url()->current(),
    ]);
})->name('product.show');

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

    return Inertia::render('Product/Show', [
        'id' => $id,
        'fromCatalog' => true,
    ])->withViewData([
        'og_title' => $og_title,
        'og_description' => $og_description,
        'og_image' => $og_image,
        'og_url' => url()->current(),
    ]);
})->name('catalog.show');

Route::get('/checkout', function () {
    return Inertia::render('Checkout/Checkout');
})->name('checkout');

Route::get('/custom-design', function () {
    return Inertia::render('CustomDesign');
})->name('custom.design');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
