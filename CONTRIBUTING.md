# Guía de contribución

Gracias por tu interés en contribuir a EGEL ICOMPU.

## Cómo puedes ayudar

### Reportar un bug

1. Verifica que el bug no esté ya reportado en Issues.
2. Abre un nuevo issue incluyendo pasos para reproducirlo, comportamiento esperado vs actual, capturas si es posible, y tu sistema operativo.

### Proponer una funcionalidad

1. Abre un issue describiendo la funcionalidad.
2. Explica el problema que resuelve y por qué es útil.
3. Espera retroalimentación antes de programar.

### Enviar código

1. Haz fork del repositorio.
2. Crea una rama descriptiva: feat/nombre-corto o fix/nombre-corto.
3. Haz commits pequeños y descriptivos.
4. Envía un Pull Request con descripción clara.

## Estándares de código

### TypeScript

- Usa tipos explícitos cuando el tipo no sea obvio.
- Evita any. Usa unknown y valida.

### Componentes

- Server Components por defecto.
- Client Components solo cuando necesites useState o event handlers.
- Nombra archivos en PascalCase.

### Estilos

- Usa Tailwind CSS.
- Sigue el sistema de diseño existente.
- Sin emojis en el código. Usa SVG para íconos.

### Commits

Usa Conventional Commits: feat, fix, docs, style, refactor, chore, test.

Ejemplos:

feat: add progress dashboard for users

fix: correct pdf-parse import for text extraction

docs: update README with setup instructions

## Qué NO hacer

- No subas archivos .env.local ni credenciales.
- No subas PDFs con derechos de autor.
- No uses any en TypeScript sin justificación.
- No mezcles refactorizaciones con nuevas funcionalidades.
