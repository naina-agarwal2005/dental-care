# Tooth Aids | Emergency Dental Care Platform

Tooth Aids is a high-performance, medically-styled web application designed to bridge the gap between dental trauma and immediate clinical care.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: MongoDB 7
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **State Management**: React Context (Bilingual Support: English/Kannada)

## Key Features

### 1. Public Patient Triage
- **Emergency Grid**: Interactive symptom cards with immediate first-aid instructions.
- **Clinic Locator**: Custom map interface for 24/7 dental hospitals with proximity-based sorting.
- **Bilingual Support**: Real-time toggle between English and Kannada.

### 2. Secure Admin Panel
- **Authenticated Access**: Secure login with hashed passwords stored in database.
- **Protocol Management**: Dashboard to update clinical instructions and bilingual content.
- **Clinic Directory**: Manage verified clinical locations with precise GPS coordinates.

---

## Getting Started

### 1. Environment Setup

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# MongoDB credentials
MONGO_ROOT_USERNAME=your_username
MONGO_ROOT_PASSWORD=your_secure_password
MONGODB_URI=mongodb://your_username:your_secure_password@mongo:27017/dentalcare?authSource=admin

# Optional: Custom ports
APP_PORT=9002
MONGO_PORT=27017
```

### 2. Start with Docker Compose

```bash
docker compose up --build -d
```

- App: `http://localhost:9002`
- MongoDB: `localhost:27017`

### 3. Seed Admin Account

Create your admin account (required for first-time setup):

```bash
docker compose exec app sh -c "ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=your_secure_password node scripts/seed-admin.js"
```

**Example:**
```bash
docker compose exec app sh -c "ADMIN_EMAIL=admin@toothaids.com ADMIN_PASSWORD=MySecurePass123 node scripts/seed-admin.js"
```

**Expected output on success:**
```
========================================
  Tooth Aids - Admin Seeding Script
========================================

Connecting to MongoDB...
Connected to MongoDB successfully.

Hashing password...
Creating admin account...

========================================
  Admin account created successfully!
========================================
  Email: admin@toothaids.com
  Password: [hidden]
========================================
```

**Expected output if admin already exists:**
```
ERROR: An admin account already exists.
Existing admin email: admin@toothaids.com

To reset the admin account, you must clear the database first.
This is a safety measure to prevent accidental overwrites.
```

**Important Notes:**
- Admin password must be at least 8 characters
- You can only seed once per database - if an admin exists, you must reset the database first
- Passwords are securely hashed using bcrypt (12 rounds)
- To reset: `docker compose down -v && rm -rf db/* && docker compose up --build -d`

### 4. Add Emergency Protocols & Hospitals

After logging into the admin panel, use the dashboard to:
- **Protocols**: Click "Emergency Protocols" > "Add New" to create dental emergency guides
- **Hospitals**: Click "Hospital Locations" > "Add New" to register clinic locations

### 5. Access the Admin Panel

Navigate to `http://localhost:9002/admin` and login with your seeded credentials.

---

## Docker Commands

### Development Mode (with hot reload)
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### View Logs
```bash
docker compose logs -f app
```

### Stop Services
```bash
docker compose down
```

### Stop and Remove Database
```bash
docker compose down -v && rm -rf db/*
```

---

## API Routes

### Traumas (Protocols)
- `GET/POST /api/traumas`
- `GET/PUT/DELETE /api/traumas/:id`

### Clinics (Hospitals)
- `GET/POST /api/clinics`
- `GET/PUT/DELETE /api/clinics/:id`
- `GET /api/clinics?lat=<value>&lng=<value>` - Returns clinics sorted by proximity

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/verify` - Verify session

---

## Security

- Admin passwords are hashed using bcrypt (12 rounds)
- Session tokens are stored in HTTP-only cookies
- All credentials should be configured via environment variables
- Never commit `.env` file to version control
- Database files stored in `db/` directory (gitignored)
