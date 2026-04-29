# WhiteCircle Group

Full-stack MERN tax and compliance SaaS platform for GST, ITR, TDS, company registration, trademark workflows, role dashboards, document uploads, reminders, chat, invoices, and mock payment/GSTIN integrations.

## Tech Stack

- Client: React, Vite, Tailwind CSS, lucide-react
- Server: Node.js, Express, MongoDB, Mongoose, JWT, Multer
- Roles: Client, Admin, Accountant

## Project Structure

```txt
client/              React + Tailwind frontend
server/              Express API
server/src/models    MongoDB models
server/src/routes    REST API routes
server/src/controllers
server/src/middleware
server/uploads       Multer local secure-vault simulation
```

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Create environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

On Windows PowerShell:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

3. Start MongoDB locally and confirm `MONGO_URI` in `server/.env`.

4. Seed dummy data:

```bash
npm run seed
```

5. Run the full app:

```bash
npm run dev
```

Client: `http://localhost:5173`  
API: `http://localhost:5000/api`

## Environment Variables

### Server

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/whitecircle_group
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
UPLOAD_DIR=uploads
RAZORPAY_KEY_ID=rzp_test_mock
RAZORPAY_KEY_SECRET=mock_secret
```

### Client

```env
VITE_API_URL=http://localhost:5000/api
```

## Demo Accounts

After seeding:

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@whitecircle.in | Password123 |
| Accountant | ca@whitecircle.in | Password123 |
| Client | client@whitecircle.in | Password123 |

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/client/dashboard`
- `POST /api/client/documents`
- `POST /api/client/chat`
- `GET /api/admin/dashboard`
- `POST /api/admin/assign-accountant`
- `POST /api/admin/filings`
- `PATCH /api/admin/filings/:id`
- `POST /api/admin/reminders`
- `GET /api/accountant/dashboard`
- `PATCH /api/accountant/filings/:id`
- `POST /api/accountant/filings/:id/acknowledgement`
- `GET /api/public/gstin/:gstin`
- `GET /api/public/calendar`

## Notes

- File storage is simulated with Multer in `server/uploads`.
- Email/SMS notifications are mocked by database records and console output.
- Razorpay integration is represented with mock order fields so live payment APIs can be added later.
- The frontend includes fallback demo data, so dashboards remain explorable if the API is not running yet.
