<div align="center">
  <h1>🛒 Joppa E-commerce</h1>
  <h3>A Modern, High-Performance E-commerce Platform</h3>
  <p>Built with Laravel 11, React (Inertia.js), and Mantine UI</p>
</div>

---

## 🚀 Overview
Joppa E-commerce is a cutting-edge online store platform designed for speed, scalability, and an excellent developer experience. It features a clean, responsive user interface tailored to both desktop and mobile shoppers.

## ✨ Features
- **Modern Tech Stack**: Laravel 11 backend + React 18 frontend
- **Seamless SPA Experience**: Powered by Inertia.js (no more full-page reloads!)
- **Beautiful UI Components**: Built using [Mantine UI](https://mantine.dev/), ensuring accessibility and responsive design.
- **State Management**: Handled efficiently with [Zustand](https://github.com/pmndrs/zustand).
- **Iconography**: Clean, intuitive SVG icons powered by Tabler Icons and Lucide React.
- **Strict Typing**: Fully typed frontend with TypeScript for better developer experience and reliability.

## 🛠️ Tech Stack
### Backend
- **Framework:** [Laravel 11.x](https://laravel.com) (PHP 8.2+)
- **Authentication:** Laravel Sanctum
- **Routing:** Ziggy

### Frontend
- **Library:** [React](https://react.dev) 18
- **Integration:** [Inertia.js](https://inertiajs.com) v2
- **Components:** [Mantine UI](https://mantine.dev) 8
- **Language:** [TypeScript](https://www.typescriptlang.org)
- **State:** Zustand 5
- **Tooling:** Vite

---

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/lLinZ/joppa.shop.git
   cd joppa-ecommerce
   ```

2. **Install PHP Dependencies**
   ```bash
   composer install
   ```

3. **Install Node Dependencies**
   ```bash
   npm install
   ```

4. **Environment Setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database & Migrations**
   Update your database credentials in the `.env` file, then run:
   ```bash
   php artisan migrate --seed
   ```

6. **Storage Link**
   Create a symbolic link allowing public access to your storage directory:
   ```bash
   php artisan storage:link
   ```

7. **Run the Development Server**
   Start both the Laravel backend and Vite frontend using the built-in Composer script:
   ```bash
   composer dev
   ```
   *(Alternatively, you can manually run `php artisan serve` and `npm run dev` in separate terminals).*

---

<div align="center">
  <p><b>Joppa E-commerce</b> • Engineered with ❤️ for an unparalleled shopping experience.</p>
</div>
