# Volt Rental – Frontend (React + TypeScript + Vite)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

## Development

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:5173 and proxies `/api/*` requests to the Java backend at `http://localhost:8080`.

## Build

```bash
npm run build
npm run preview
```
