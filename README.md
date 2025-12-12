# Wayru – Prueba técnica (ToDo App)

Repositorio fullstack para la prueba técnica de Wayru: una aplicación de lista de tareas con backend en Koa y frontend en Next.js.

## 🧱 Stack

- Backend: Node.js, Koa, TypeScript, Prisma, PostgreSQL (Neon)
- Frontend: Next.js, React, TypeScript
- Infra: Deploy en servicios gratuitos (Render y Vercel)

## ✅ Funcionalidad

- Crear tareas nuevas.
- Listar tareas desde el backend.
- Marcar tareas como completadas.
- Eliminar tareas. *(extra)*
- Validación para evitar tareas vacías.
- Contador de tareas pendientes.
- Estilos responsive (mobile / tablet / desktop).

## 📂 Estructura del repo

- `backend/` – código del servidor en Koa + Prisma.
- `frontend/` – aplicación de Next.js que consume la API.

## 🚀 Cómo correr el proyecto localmente

### 1. Backend

cd backend
npm install

Configura el archivo `.env`:
  DATABASE_URL="postgresql://USUARIO:PASS@HOST/DB?sslmode=require"
  PORT=4000

Aplica migraciones de Prisma:
  npx prisma migrate dev

Levanta el servidor:
  npm run dev

### 2. Frontend

cd frontend
npm install

Crea `.env.local`:
  NEXT_PUBLIC_BACKEND_URL=http://localhost:4000

Ejecuta:
  npm run dev

La app estará disponible en `http://localhost:3001`.

## 🌐 Deploy

- Frontend (Next.js): URL pública -> `https://wayru-pruebaa.vercel.app/`
- Backend (Koa): URL pública -> `https://wayru-prueba.onrender.com`
- Base de datos: Neon (PostgreSQL)

## ℹ️ Notas

- La autenticación no está incluida, ya que el alcance de la prueba se centra en CRUD, integración fullstack y buenas prácticas básicas.
- La API de Next.js actúa como puente entre el cliente y el backend de Koa.
