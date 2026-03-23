<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/product/{id}', function ($id) {
    return Inertia::render('Product/Show', [
        'id' => $id
    ]);
})->name('product.show');

Route::get('/catalog', function () {
    return Inertia::render('Catalog/Index');
})->name('catalog.index');

Route::get('/catalog/{id}', function ($id) {
    return Inertia::render('Product/Show', [
        'id' => $id,
        'fromCatalog' => true,
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
