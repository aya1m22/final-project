# AURA — AI Fashion E-Commerce Platform

A high-fidelity luxury fashion editorial platform built with Django REST Framework and React (Vite).

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.9+
- Node.js 18+
- Anthropic API Key (for the AI Stylist)

---

### 2. Backend Setup (Django)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - **Windows:** `venv\Scripts\activate`
   - **Mac/Linux:** `source venv/bin/activate`

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up Environment Variables:**
   Create a `.env` file in the `backend/` directory:
   ```env
   SECRET_KEY=your_secret_key_here
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

6. **Run Migrations:**
   ```bash
   python manage.py migrate
   ```

7. **(Optional) Create a Superuser:**
   ```bash
   python manage.py createsuperuser
   ```

8. **Start the server:**
   ```bash
   python manage.py runserver
   ```
   The backend will be running at `http://127.0.0.1:8000`.

---

### 3. Frontend Setup (React + Vite)

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL=http://127.0.0.1:8000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will be running at `http://localhost:5173`.

---

### 4. Key Features
- **AI Stylist:** Personal styling advice and product analysis via Claude 3.5.
- **Editorial Design:** Premium glassmorphism and motion-driven UI.
- **Cart & Wishlist:** Fully functional client-side persistent storage.
- **Order Management:** Complete checkout flow integrated with DRF.

---

### 📝 Note on AI Stylist
To use the AI Stylist feature, ensure your `ANTHROPIC_API_KEY` is correctly set in the backend `.env` file. Without it, the AI chat will return an error.
