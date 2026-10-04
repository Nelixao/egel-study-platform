import { db } from './index';
import { areas, subareas } from './schema';
import { eq } from 'drizzle-orm';

async function seedDescripciones() {
  // Descripciones de las áreas (basadas en la guía Ceneval 2023)
  const descripcionesAreas: Record<string, string> = {
    hardware:
      'Se abordan conocimientos para analizar, diseñar e implementar hardware de computadoras por medio de circuitos eléctricos, electrónica digital y analógica, arquitectura de computadoras y su organización, sistemas embebidos y automatización y control de procesos.',
    redes:
      'Se aborda el diseño, implementación, seguridad, administración, mantenimiento y evaluación de redes de computadoras tomando en cuenta las metodologías, los protocolos y los estándares.',
    software:
      'Se abordan los algoritmos computacionales, sistemas operativos, ingeniería de software, bases de datos e inteligencia artificial. Considerando las técnicas, metodologías y los estándares para los requisitos, diseño, construcción, prueba y mantenimiento de software de calidad.',
    'comprension-lectora':
      'Habilidad que permite al individuo identificar, interpretar y evaluar la forma y el contenido de diversos textos, en diferentes ámbitos o contextos como el estudio, el literario o el de participación social.',
    'redaccion-indirecta':
      'Habilidad del individuo para seleccionar textos coherentes, cohesionados, que cumplan con las convenciones propias de la lengua, a partir de un propósito determinado de comunicación.',
  };

  for (const [slug, descripcion] of Object.entries(descripcionesAreas)) {
    await db.update(areas).set({ descripcion }).where(eq(areas.slug, slug));
  }

  // Descripciones y temas de las subáreas
  const detallesSubareas: Record<string, { descripcion: string; temas: string }> = {
    circuitos: {
      descripcion:
        'Análisis y diseño de circuitos eléctricos y electrónicos, tanto analógicos como digitales.',
      temas: `Ley de Ohm y leyes de Kirchhoff
Análisis de circuitos en corriente continua y alterna
Diodos, transistores y amplificadores operacionales
Compuertas lógicas y álgebra de Boole
Circuitos combinacionales y secuenciales
Convertidores analógico-digitales y digital-analógico`,
    },
    arquitectura: {
      descripcion:
        'Estructura interna de una computadora, desde el procesador hasta la memoria y el conjunto de instrucciones.',
      temas: `Modelo de von Neumann
Unidad Central de Proceso (CPU) y ciclos de instrucción
Jerarquía de memoria (registros, caché, RAM, disco)
Sistemas numéricos y representación de datos
Conjunto de instrucciones y modos de direccionamiento
Pipeline y paralelismo a nivel de instrucción`,
    },
    embebidos: {
      descripcion:
        'Diseño e implementación de sistemas embebidos, microcontroladores y firmware.',
      temas: `Microcontroladores y microprocesadores embebidos
Programación de firmware en C y ensamblador
Periféricos: GPIO, timers, UART, I2C, SPI
Interrupciones y manejo de tiempo real
Sistemas operativos embebidos (FreeRTOS, etc.)
Prototipado con plataformas como Arduino y Raspberry Pi`,
    },
    automatizacion: {
      descripcion:
        'Automatización y control de procesos industriales mediante sensores, actuadores y controladores.',
      temas: `Sensores y acondicionadores de señal
Actuadores: motores, servos, relés
Control todo o nada, PID y sus variantes
PLC y sistemas SCADA
Robótica y control de movimiento
Sistemas de tiempo real y su aplicación industrial`,
    },
    'diseno-redes': {
      descripcion:
        'Diseño de redes de computadoras considerando topologías, protocolos y estándares.',
      temas: `Modelo OSI y modelo TCP/IP
Topologías de red (estrella, bus, anillo, malla)
Medios de transmisión: cobre, fibra, inalámbrico
Direccionamiento IP y subredes (IPv4 e IPv6)
Protocolos de enrutamiento (RIP, OSPF, BGP)
Cableado estructurado y documentación`,
    },
    'admin-redes': {
      descripcion:
        'Administración, mantenimiento y monitoreo de redes de computadoras.',
      temas: `Configuración de dispositivos (routers, switches, firewalls)
Servicios de red: DHCP, DNS, HTTP, FTP
Monitoreo con SNMP y herramientas como Wireshark
Gestión de VLANs y enrutamiento inter-VLAN
Balanceo de carga y alta disponibilidad
Documentación y políticas de red`,
    },
    'seguridad-redes': {
      descripcion:
        'Seguridad, detección de vulnerabilidades y protección de la información en redes.',
      temas: `Tipos de ataques: DoS, MITM, phishing, inyección
Criptografía simétrica y asimétrica
Protocolos seguros: HTTPS, SSH, VPN, IPsec
Firewalls, IDS e IPS
Autenticación y control de acceso
Auditoría, análisis forense y respuesta a incidentes`,
    },
    'ing-software': {
      descripcion:
        'Metodologías, técnicas y estándares para el desarrollo de software de calidad.',
      temas: `Ciclo de vida del software (cascada, iterativo, ágil)
Ingeniería de requisitos y elicitación
Diseño arquitectónico y patrones de diseño
UML y modelado de sistemas
Metodologías ágiles: Scrum, Kanban, XP
Pruebas de software y aseguramiento de la calidad
Gestión de proyectos y estimación`,
    },
    programacion: {
      descripcion:
        'Paradigmas de programación, lenguajes, compiladores y sistemas operativos.',
      temas: `Paradigmas: imperativo, orientado a objetos, funcional
Estructuras de control y tipos de datos
Compiladores e intérpretes: análisis léxico, sintáctico, semántico
Ensambladores y código máquina
Sistemas operativos: procesos, hilos, planificación
Concurrencia y sincronización`,
    },
    'datos-algoritmos': {
      descripcion:
        'Algoritmos, estructuras de datos, bases de datos e inteligencia artificial.',
      temas: `Complejidad algorítmica (notación Big-O)
Estructuras de datos: pilas, colas, árboles, grafos, tablas hash
Algoritmos de ordenamiento y búsqueda
Bases de datos relacionales y SQL
Modelo entidad-relación y normalización
Transacciones ACID
Inteligencia artificial: búsqueda, representación del conocimiento`,
    },
    'comp-estudio': {
      descripcion:
        'Textos académicos como la reseña académica o el artículo de investigación.',
      temas: `Identificación de información explícita e implícita
Interpretación global y particular
Evaluación de la forma y el contenido
Estructura de artículos de investigación
Características de la reseña académica`,
    },
    'comp-literario': {
      descripcion:
        'Textos literarios como el cuento y el ensayo literario.',
      temas: `Narrador, personajes, trama y ambiente
Recursos literarios y figuras retóricas
Interpretación de símbolos y metáforas
Ensayo literario: tesis, argumentación y estilo`,
    },
    'comp-social': {
      descripcion:
        'Textos de participación social como la convocatoria y la nota informativa.',
      temas: `Estructura de la convocatoria
Características de la nota informativa
Hechos vs opiniones
Análisis de fuentes y veracidad`,
    },
    'redac-estudio': {
      descripcion:
        'Selección de textos académicos según su propósito comunicativo y corrección.',
      temas: `Registro lingüístico formal y especializado
Géneros textuales académicos
Concordancia nominal y verbal
Cohesión gramatical, léxica y textual
Puntuación y acentuación`,
    },
    'redac-social': {
      descripcion:
        'Selección de textos de participación social con corrección gramatical y ortográfica.',
      temas: `Editorial de periódico, convocatoria, carta de exposición
Registro lingüístico adecuado al receptor
Cohesión y coherencia textual
Grafofonética, puntuación y acentuación`,
    },
  };

  for (const [slug, datos] of Object.entries(detallesSubareas)) {
    await db
      .update(subareas)
      .set({ descripcion: datos.descripcion, temas: datos.temas })
      .where(eq(subareas.slug, slug));
  }

  console.log('✅ Descripciones y temas actualizados');
  process.exit(0);
}

seedDescripciones().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});