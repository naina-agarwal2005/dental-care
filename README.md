
# SwiftDental | Emergency Dental Care Platform

SwiftDental is a high-performance, medically-styled web application designed to bridge the gap between dental trauma and immediate clinical care in the Patna region.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **State Management**: React Context (Bilingual Support: English/Kannada)

## 🛠️ Key Features

### 1. Public Patient Triage
- **Emergency Grid**: Interactive symptom cards with immediate first-aid instructions.
- **Clinic Locator**: Custom map interface for 24/7 dental hospitals in Patna with proximity-based sorting.
- **Bilingual Support**: Real-time toggle between English and Kannada.

### 2. Secure Admin Panel (Login: admin@swiftdental.org / admin123)
- **Authenticated Access**: Secure gate for hospital staff using email and password.
- **Protocol Management**: Dashboard to update clinical instructions, bilingual content, and YouTube procedure videos.
- **Clinic Directory**: Manage verified clinical locations with precise GPS coordinates.

---

## 👩‍💻 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The website will be available at `http://localhost:9002`.

---

## 🐳 Docker Setup

### Run in Development Mode (recommended for coding)
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

- Next.js dev server with hot reload: `http://localhost:9002`
- MongoDB runs in Docker (`mongo` service)

To view logs:
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f app
```

To stop dev stack:
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

### MongoDB-backed API routes
- `GET/POST /api/traumas`
- `GET/PUT/DELETE /api/traumas/:id`
- `GET/POST /api/clinics`
- `GET/PUT/DELETE /api/clinics/:id`

`GET /api/clinics?lat=<value>&lng=<value>` returns clinics nearest-to-farthest using geospatial query.

### Run with Docker Compose (App + MongoDB)
```bash
docker compose up --build
```

- App: `http://localhost:9002`
- MongoDB: `mongodb://root:root@localhost:27017/dentalcare?authSource=admin`

To stop:
```bash
docker compose down
```

To stop and remove MongoDB volume:
```bash
docker compose down -v
```

### Run App Container Only
```bash
docker build -t dental-care .
docker run --rm -p 9002:9002 dental-care
```
