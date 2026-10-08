
# EGEL ICOMPU

> Plataforma de estudio abierta para la preparación del **EGEL Plus ICOMPU** (Ingeniería Computacional) de Ceneval.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=flat-square&logo=postgresql)](https://www.postgresql.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## Acerca del proyecto

Plataforma de estudio diseñada para estudiantes de ingeniería computacional que se preparan para el examen de titulación EGEL Plus ICOMPU. Combina teoría, práctica y evaluación en una sola herramienta.

**Demo en vivo:** *próximamente*

---

## Funcionalidades

| Módulo | Descripción |
| :--- | :--- |
| **Temario interactivo** | Estructura completa del examen con seguimiento de progreso |
| **Lecciones** | Contenido teórico en markdown por subárea |
| **Simulador** | Exámenes cronometrados con preguntas aleatorias y opciones barajadas |
| **Banco de preguntas** | Flashcards interactivas con explicación de cada respuesta |
| **Biblioteca** | Subida de PDFs con extracción de texto automática |
| **Generación con IA** | Preguntas generadas desde PDFs con revisión humana |
| **Panel de admin** | CRUD completo de lecciones, preguntas y documentos |
| **Autenticación** | Rutas de administración protegidas con Auth.js |

---

## Aviso importante

Este sitio es un **proyecto independiente** con fines **exclusivamente educativos**.

**NO está afiliado, respaldado ni patrocinado por Ceneval** ni por ninguna institución educativa. Las preguntas y contenidos son de elaboración propia y **no constituyen material oficial** del examen.

El uso de esta plataforma **no garantiza la aprobación del examen**. Los resultados dependen exclusivamente del estudio y desempeño de cada usuario.

---

## Stack tecnológico

| Capa | Tecnología |
| :--- | :--- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS 4 |
| Base de datos | PostgreSQL 16 + Drizzle ORM |
| Autenticación | Auth.js (NextAuth v5) |
| IA | Groq API (GPT-OSS 120B) |
| Almacenamiento | Cloudinary |
| Markdown | react-markdown + remark-gfm |

---

## Estructura del proyecto
egel-study-platform/
├── app/ # Rutas de Next.js
│ ├── admin/ # Panel de administración (protegido)
│ ├── api/ # API Routes
│ ├── area/ # Páginas por área
│ ├── banco/ # Banco de preguntas con flashcards
│ ├── biblioteca/ # Biblioteca de documentos
│ ├── legal/ # Términos, privacidad, cookies
│ ├── login/ # Página de login
│ ├── simulador/ # Simulador de exámenes
│ ├── subarea/ # Páginas por subárea
│ └── temario/ # Temario interactivo
├── src/
│ ├── app/actions/ # Server Actions
│ ├── components/ # Componentes reutilizables
│ ├── db/ # Drizzle ORM
│ └── lib/queries.ts # Queries reutilizables
├── public/ # Assets estáticos
└── proxy.ts # Middleware de auth
---

## Instalación local

### Requisitos

- Node.js 20.9 o superior
- PostgreSQL 16
- Cuenta en Groq (gratis)
- Cuenta en Cloudinary (gratis)

### Pasos

```bash
git clone https://github.com/Nelixao/egel-study-platform.git
cd egel-study-platform
npm install --legacy-peer-deps
cp .env.example .env.local
# Edita .env.local con tus credenciales
npm run db:push
npm run db:seed
npm run db:seed-preguntas
npm run dev