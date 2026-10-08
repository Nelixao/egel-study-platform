# EGEL ICOMPU

> Plataforma de estudio abierta para la preparación del EGEL Plus ICOMPU (Ingeniería Computacional) de Ceneval.

## Acerca del proyecto

Plataforma de estudio diseñada para estudiantes de ingeniería computacional que se preparan para el examen de titulación EGEL Plus ICOMPU. Combina teoría, práctica y evaluación en una sola herramienta.

## Funcionalidades

| Módulo | Descripción |
| :--- | :--- |
| Temario interactivo | Estructura completa del examen con seguimiento de progreso |
| Lecciones | Contenido teórico en markdown por subárea |
| Simulador | Exámenes cronometrados con preguntas aleatorias y opciones barajadas |
| Banco de preguntas | Flashcards interactivas con explicación de cada respuesta |
| Biblioteca | Subida de PDFs con extracción de texto automática |
| Generación con IA | Preguntas generadas desde PDFs con revisión humana |
| Panel de admin | CRUD completo de lecciones, preguntas y documentos |
| Autenticación | Rutas de administración protegidas con Auth.js |

## Aviso importante

Este sitio es un proyecto independiente con fines exclusivamente educativos.

NO está afiliado, respaldado ni patrocinado por Ceneval ni por ninguna institución educativa. Las preguntas y contenidos son de elaboración propia y no constituyen material oficial del examen.

El uso de esta plataforma no garantiza la aprobación del examen. Los resultados dependen exclusivamente del estudio y desempeño de cada usuario.

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

## Estructura del proyecto

- app/ - Rutas de Next.js
- app/admin/ - Panel de administración (protegido)
- app/api/ - API Routes
- app/area/ - Páginas por área
- app/banco/ - Banco de preguntas con flashcards
- app/biblioteca/ - Biblioteca de documentos
- app/legal/ - Términos, privacidad, cookies
- app/login/ - Página de login
- app/simulador/ - Simulador de exámenes
- app/subarea/ - Páginas por subárea
- app/temario/ - Temario interactivo
- src/app/actions/ - Server Actions
- src/components/ - Componentes reutilizables
- src/db/ - Drizzle ORM
- src/lib/queries.ts - Queries reutilizables

## Instalación local

### Requisitos

- Node.js 20.9 o superior
- PostgreSQL 16
- Cuenta en Groq (gratis)
- Cuenta en Cloudinary (gratis)

### Pasos

1. Clonar el repositorio
2. Instalar dependencias con npm install --legacy-peer-deps
3. Copiar .env.example a .env.local y configurar credenciales
4. Ejecutar npm run db:push
5. Ejecutar npm run db:seed
6. Ejecutar npm run db:seed-preguntas
7. Ejecutar npm run dev

## Variables de entorno

- DATABASE_URL - Cadena de conexión a PostgreSQL
- AUTH_SECRET - Secreto para Auth.js (genera con openssl rand -base64 32)
- ADMIN_EMAIL - Correo del administrador
- ADMIN_PASSWORD - Contraseña del administrador
- GROQ_API_KEY - API key de Groq
- CLOUDINARY_CLOUD_NAME - Cloud name de Cloudinary
- CLOUDINARY_API_KEY - API key de Cloudinary
- CLOUDINARY_API_SECRET - API secret de Cloudinary

## Scripts disponibles

| Comando | Descripción |
| :--- | :--- |
| npm run dev | Servidor de desarrollo |
| npm run build | Build de producción |
| npm run start | Servidor de producción |
| npm run lint | Linter |
| npm run db:push | Aplicar schema a la base |
| npm run db:seed | Cargar secciones, áreas y subáreas |
| npm run db:seed-preguntas | Cargar preguntas de ejemplo |

## Estructura del EGEL Plus ICOMPU

| Sección | Área | Reactivos |
| :--- | :--- | :--- |
| Disciplinar | Implementación de hardware | 49 |
| Disciplinar | Implementación de redes de computadoras | 41 |
| Disciplinar | Desarrollo de software | 50 |
| Transversal | Comprensión lectora | 30 |
| Transversal | Redacción indirecta | 30 |
| Total | | 200 |

## Roadmap

- Temario interactivo con progreso
- Lecciones en markdown
- Simulador con cronómetro
- Banco de preguntas con flashcards
- Generación con IA
- Autenticación y rutas protegidas
- Deploy a Vercel + Neon (pendiente)
- Pruebas E2E con Playwright (pendiente)
- Dashboard de progreso del usuario (pendiente)
- Modo de repaso espaciado (pendiente)

## Licencia

Este proyecto está bajo licencia MIT. Consulta LICENSE para más detalles.

## Contacto

- GitHub: @Nelixao
- Repositorio: egel-study-platform
