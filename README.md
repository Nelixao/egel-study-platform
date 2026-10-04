# Simulador EGEL ICOMPU

> Plataforma de estudio abierta y sin fines de lucro para la preparación del **EGEL Plus ICOMPU** (Ingeniería Computacional).

##  Acerca del proyecto

Este proyecto nace como una herramienta de estudio personal y de código abierto para ayudar a estudiantes de ingeniería computacional a prepararse para el examen de titulación EGEL Plus ICOMPU de Ceneval.

Ofrece lecciones teóricas, banco de preguntas, simuladores con cronómetro y una biblioteca de recursos, todo bajo una interfaz moderna inspirada en iOS.

##  Funcionalidades

-  **Lecciones** estilo Khan Academy con markdown enriquecido
-  **Simulador** de exámenes con cronómetro y resultados detallados
-  **Banco de preguntas** con generación asistida por IA (Groq)
-  **Biblioteca** de recursos con extracción de texto de PDFs
-  **Videos** embebidos por subárea
-  **Diseño iOS** con glass morphism y animaciones sutiles

##  Aviso importante

Este sitio es un **proyecto independiente** con fines **exclusivamente educativos**.

**NO está afiliado, respaldado ni patrocinado por Ceneval** ni por ninguna institución educativa. Las preguntas y contenidos son de elaboración propia y **no constituyen material oficial** del examen.

El uso de esta plataforma **no garantiza la aprobación del examen**. Los resultados dependen exclusivamente del estudio y desempeño de cada usuario.

##  Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Estilos | Tailwind CSS 4 |
| Base de datos | PostgreSQL + Drizzle ORM |
| IA | Groq (Llama 3.3) |
| Deploy | Vercel |

##  Instalación local

```bash
# 1. Clonar
git clone https://github.com/Nelixao/egel-study-platform.git
cd egel-study-platform

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales

# 4. Aplicar schema a la base de datos
npm run db:push

# 5. Cargar datos iniciales
npm run db:seed
npm run db:seed-descripciones

# 6. Arrancar
npm run dev
