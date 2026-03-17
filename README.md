<p align="center">
  <img src="https://copilot.microsoft.com/th/id/BCO.23effc03-d3ed-485f-97de-c3bddab00aeb.png" alt="Webmify Logo" width="120"/>
</p>

<h1 align="center">Webmify – Modern Portfolio (React + TypeScript)</h1>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4.1-06B6D4?logo=tailwindcss" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue" />
</p>

<p align="center">
  A sleek, full‑stack portfolio website with a React + TypeScript frontend and a Django-powered admin backend.<br/>
  <strong>✨ Fully editable content • Newsletter & contact notifications • Live map • Charts & more ✨</strong>
</p>

---

## 📱 Features at a Glance

- **React + TypeScript** – modern, type‑safe frontend with Vite for lightning‑fast development.
- **React Router** – smooth client‑side navigation (no page reloads).
- **Tailwind CSS** – utility‑first styling, fully responsive.
- **Django Admin** – manage all portfolio content (projects, blog posts, profile) through a familiar interface.
- **Interactive Maps** – live location display (Leaflet) on the contact page.
- **Newsletter System** – email collection with automated confirmation and admin alerts.
- **Custom Notifications** – toast‑style success / error / info popups.
- **Data Visualisation** – charts (Chart.js / Recharts) for skills or statistics.
- **Markdown Support** – blog posts rendered with `marked` + `dompurify`.
- **Image Galleries** – swipeable project slides using Swiper.

> **🔍 Legacy version** (vanilla JS + custom router) is preserved in the [`v1`](../../tree/v1) branch.

---

## 🧱 Tech Stack

| Area        | Technologies                                                                 |
|-------------|------------------------------------------------------------------------------|
| **Frontend**| React, TypeScript, Vite, Tailwind CSS, React Router, Chart.js, Recharts, Swiper, Leaflet, Axios |
| **Backend** | Django, Django REST Framework, Django Admin, SMTP / SendGrid (email)        |
| **DevOps**  | Environment variables, CORS, production static serving                       |

---

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 18+ & npm / yarn
- Python 3.10+ & pip
- (Optional) A map API key if using Google Maps – Leaflet works out‑of‑the‑box

### 1. Clone the repository
```bash
git clone <repository-url>
cd webmify
```

### 2. Backend (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate      # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
The admin panel will be available at `http://127.0.0.1:8000/admin`.

### 3. Frontend (React)
```bash
cd ../frontend          # or the root if the React app is there
npm install
npm run dev
```
The Vite dev server runs at `http://localhost:5173` – it proxies API requests to Django.

> **Environment variables**  
> Create a `.env` file in the frontend root with your API base URL:
> ```
> VITE_API_URL=http://127.0.0.1:8000/api
> ```

---

## 📦 Building for Production

- **Frontend**: `npm run build` – outputs static files to `dist/`.
- **Backend**: Configure Django with `DEBUG=False`, set `ALLOWED_HOSTS`, collect static files, and use a production WSGI server (Gunicorn + Nginx).

---

## 🗺️ Live Demo

[![Visit Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://darius-portfollio.vercel.app)

---

## 📁 Repository Structure (simplified)

```
webmify/
├── backend/               # Django project (API + Admin)
│   ├── api/               # Django app with models, views, serializers
│   ├── templates/         # (if any Django templates remain)
│   └── requirements.txt
├── frontend/              # React + TypeScript app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages (Home, About, Projects, Blog, Contact)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API calls (Axios)
│   │   └── types/         # TypeScript interfaces
│   ├── public/            # Static assets
│   └── package.json
└── README.md
```

---

## 👤 Author

**CyberArcenal** – [cyberarcenal1@gmail.com](mailto:cyberarcenal1@gmail.com)

---

## 📄 License

MIT – feel free to use this project as a template for your own portfolio.