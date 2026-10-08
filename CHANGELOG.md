# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato sigue Keep a Changelog y el proyecto adhiere a Semantic Versioning.

## [Unreleased]

### En desarrollo

- Deploy a Vercel + Neon
- Dashboard de progreso del usuario
- Pruebas E2E con Playwright

## [0.1.0] - 2026-10-07

Primera versión funcional de la plataforma.

### Añadido

#### Contenido

- Temario interactivo con las 12 subáreas del EGEL Plus ICOMPU
- 6 lecciones completas de Manejo de datos y algoritmos
- Carga inicial de secciones, áreas y subáreas
- Banco de preguntas con flashcards interactivas

#### Simulador

- Simulador de exámenes con cronómetro configurable
- Selección múltiple de subáreas
- Barajado aleatorio de preguntas y opciones
- Resultado detallado con explicaciones
- Botón Seleccionar todo y Limpiar

#### Biblioteca

- Subida de PDFs con extracción automática de texto
- Almacenamiento en Cloudinary
- Generación de preguntas con IA (Groq)
- Revisión de borradores antes de aprobar
- Edición de metadatos de documentos

#### Admin

- Panel centralizado con contadores
- CRUD completo de lecciones
- CRUD completo de preguntas
- Configuración de videos por subárea
- Sistema de borradores para preguntas generadas por IA

#### Diseño

- Interfaz glass morphism inspirada en iOS
- Navbar dual (público y admin)
- Footer ejecutivo con avisos legales
- Página de temario interactivo con seguimiento de progreso

#### Legal

- Términos y condiciones
- Aviso de privacidad
- Política de cookies
- Banner de consentimiento de cookies
- Licencia MIT

#### Seguridad

- Autenticación con Auth.js
- Rutas de administración protegidas
- Validación de subidas (tipo y tamaño)

### Cambiado

- Migración de PDFs locales a Cloudinary
- Reorganización del navbar por secciones

### Corregido

- Error de hidratación en el texto extraído de PDFs
- Error de import de pdf-parse con Turbopack
- Query de conteo de preguntas agrupadas por subárea

### Notas

- Los modelos de Groq se actualizaron a openai/gpt-oss-120b
- Requiere Node.js 20.9 o superior
