<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Response;

class SitemapController extends Controller
{
    public function index()
    {
        $products = [];
        try {
            // Usamos VITE_CRM_API_URL desde el .env
            $apiUrl = config('services.crm.api_url') ?? env('VITE_CRM_API_URL');
            $response = Http::get($apiUrl . '/catalog/sitemap-data');
            if ($response->successful()) {
                $products = $response->json('products');
            }
        } catch (\Exception $e) {
            // Log fallback or empty
        }

        return Response::view('sitemap', [
            'products' => $products
        ])->header('Content-Type', 'text/xml');
    }
}
