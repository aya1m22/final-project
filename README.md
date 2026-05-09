# AURA — AI-Powered Fashion E-Commerce Platform

A luxury AI-powered fashion platform with an integrated AI stylist. Built as a graduation project.

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS v4 (using `@import "tailwindcss"` + `@theme`)
- React Router v6
- Zustand for state management
- TanStack React Query for server state
- Axios with JWT interceptors

### Backend
- Python 3.11+ / Django + Django REST Framework
- Simple JWT for authentication
- SQLite (development)
- Anthropic Claude API for AI stylist
- django-cors-headers

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Create & activate virtual environment
python -m venv ../.venv
# Windows:
..\.venv\Scripts\activate
# macOS/Linux:
# source ../.venv/bin/activate

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers anthropic pillow python-dotenv

# Run migrations (creates SQLite database automatically)
python manage.py migrate

# Create admin user
python manage.py createsuperuser
# Username: admin
# Email: admin@aura.com
# Password: admin123

# Seed product data (19 products with real Unsplash images)
python manage.py seed_products

# Start backend server
python manage.py runserver 8000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# → Runs on http://localhost:5173
```

### 3. Environment Variables

**Backend** (`backend/.env`):
```env
SECRET_KEY=django-insecure-aura-dev-key-change-in-production-xyz123
DEBUG=True
ANTHROPIC_API_KEY=your-anthropic-api-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Project Structure

```
├── backend/
│   ├── config/           # Django settings, root URLs
│   ├── accounts/         # User auth (JWT login/register/profile)
│   ├── products/         # Product & Category models, views, seed data
│   ├── orders/           # Orders, Cart (server-side)
│   ├── ai_chat/          # AI Stylist (Claude API integration)
│   └── manage.py
│
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios client with JWT interceptor
│   │   ├── store/        # Zustand stores (auth, cart, toast)
│   │   ├── components/
│   │   │   ├── layout/   # Navbar, Footer
│   │   │   ├── cart/     # CartDrawer
│   │   │   └── ui/       # ProductCard, LoadingSpinner, ToastContainer
│   │   ├── pages/        # All route pages
│   │   ├── App.tsx       # Routes
│   │   ├── main.tsx      # Entry point
│   │   └── index.css     # Tailwind v4 + design system
│   └── index.html
```

## Features

- 🏠 **Home Page** — Full-screen hero, category browsing, new arrivals
- 🛍️ **Shop** — Filterable product grid with search, sort, pagination
- 📦 **Product Detail** — Size/color selectors, add to cart, related products
- 🤖 **AI Stylist** — Chat with Claude AI, upload photos for style analysis
- 🛒 **Cart** — Server-side cart with quantity management
- 💳 **Checkout** — 3-step flow (Shipping → Payment → Confirmation)
- 👤 **Profile** — Edit info, view order history
- 🔐 **Auth** — JWT login/register with auto-refresh

## Design System

- **Background:** `#0a0a0a` (near-black)
- **Accent:** `#c9a96e` (warm gold)
- **Typography:** Cormorant Garamond (display) + DM Sans (body)
- **Aesthetic:** Luxury dark editorial with smooth animations

## Admin Access

Visit `http://localhost:8000/admin/` and login with your superuser credentials to manage products, orders, and chat logs.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/` | List products (filterable) |
| GET | `/api/products/:id/` | Product detail |
| GET | `/api/products/categories/` | List categories |
| POST | `/api/auth/login/` | JWT login |
| POST | `/api/auth/register/` | Register |
| POST | `/api/auth/refresh/` | Refresh token |
| GET/PATCH | `/api/auth/profile/` | User profile |
| GET/POST | `/api/orders/cart/` | Cart operations |
| GET/POST | `/api/orders/` | Orders |
| POST | `/api/ai/chat/` | AI stylist chat |
