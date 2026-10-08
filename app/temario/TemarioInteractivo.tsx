'use client';

import { useState, useEffect, useMemo } from 'react';

type Tema = {
  id: string;
  nombre: string;
  subtemas: string;
  explicado: boolean;
};

type Subarea = {
  id: string;
  nombre: string;
  reactivos: number;
  temas: Tema[];
};

type Area = {
  id: string;
  numero: number;
  nombre: string;
  reactivos: number;
  color: string;
  subareas: Subarea[];
};

const areas: Area[] = [
  {
    id: 'area-1',
    numero: 1,
    nombre: 'Implementación de hardware',
    reactivos: 49,
    color: '#FF9500',
    subareas: [
      {
        id: '1-1',
        nombre: '1.1 Circuitos eléctricos y electrónica',
        reactivos: 11,
        temas: [
          { id: '1-1-1', nombre: 'Leyes fundamentales', subtemas: 'Ley de Ohm, Leyes de Kirchhoff (LCK, LVK), potencia eléctrica', explicado: false },
          { id: '1-1-2', nombre: 'Análisis de circuitos DC', subtemas: 'Series, paralelo, mixtos, divisor de voltaje, divisor de corriente', explicado: false },
          { id: '1-1-3', nombre: 'Análisis de circuitos AC', subtemas: 'Fasores, impedancia, resonancia, frecuencia', explicado: false },
          { id: '1-1-4', nombre: 'Componentes pasivos', subtemas: 'Resistencia, capacitor, inductor, código de colores', explicado: false },
          { id: '1-1-5', nombre: 'Semiconductores', subtemas: 'Diodos, rectificadores, transistores BJT y MOSFET', explicado: false },
          { id: '1-1-6', nombre: 'Amplificadores operacionales', subtemas: 'Configuraciones básicas, sumador, restador, integrador, derivador', explicado: false },
          { id: '1-1-7', nombre: 'Electrónica digital', subtemas: 'Compuertas lógicas, álgebra de Boole, mapas de Karnaugh', explicado: false },
          { id: '1-1-8', nombre: 'Circuitos combinacionales', subtemas: 'Sumadores, multiplexores, decodificadores, comparadores', explicado: false },
          { id: '1-1-9', nombre: 'Circuitos secuenciales', subtemas: 'Flip-flops, registros, contadores, máquinas de estado', explicado: false },
          { id: '1-1-10', nombre: 'Convertidores', subtemas: 'ADC y DAC, muestreo, cuantización', explicado: false },
        ],
      },
      {
        id: '1-2',
        nombre: '1.2 Arquitectura de computadoras y su organización',
        reactivos: 11,
        temas: [
          { id: '1-2-1', nombre: 'Modelo de von Neumann', subtemas: 'Unidad de control, ALU, memoria, buses, ciclo de instrucción', explicado: false },
          { id: '1-2-2', nombre: 'Sistemas numéricos', subtemas: 'Binario, octal, hexadecimal, complemento a dos, IEEE 754', explicado: false },
          { id: '1-2-3', nombre: 'Organización de CPU', subtemas: 'Registros, ciclo fetch-decode-execute, pipeline', explicado: false },
          { id: '1-2-4', nombre: 'Jerarquía de memoria', subtemas: 'Registros, caché L1/L2/L3, RAM, memoria virtual, paginación', explicado: false },
          { id: '1-2-5', nombre: 'Conjunto de instrucciones', subtemas: 'CISC vs RISC, modos de direccionamiento, ensamblador básico', explicado: false },
          { id: '1-2-6', nombre: 'Entrada/salida', subtemas: 'Polling, interrupciones, DMA, buses (PCI, USB)', explicado: false },
          { id: '1-2-7', nombre: 'Paralelismo', subtemas: 'Pipeline, superscalar, multihilo, multicore', explicado: false },
          { id: '1-2-8', nombre: 'Rendimiento', subtemas: 'Ley de Amdahl, MIPS, benchmarks, cuellos de botella', explicado: false },
          { id: '1-2-9', nombre: 'Almacenamiento', subtemas: 'Discos duros, SSD, RAID, jerarquía de almacenamiento', explicado: false },
          { id: '1-2-10', nombre: 'Arquitecturas modernas', subtemas: 'ARM, x86, GPU, arquitecturas heterogéneas', explicado: false },
        ],
      },
      {
        id: '1-3',
        nombre: '1.3 Sistemas embebidos',
        reactivos: 13,
        temas: [
          { id: '1-3-1', nombre: 'Introducción', subtemas: 'Definición, características, ejemplos, restricciones de diseño', explicado: false },
          { id: '1-3-2', nombre: 'Microcontroladores', subtemas: 'Arquitectura, familias (PIC, AVR, ARM Cortex-M), selección', explicado: false },
          { id: '1-3-3', nombre: 'Programación embebida', subtemas: 'C embebido, ensamblador, manejo de registros, GPIO', explicado: false },
          { id: '1-3-4', nombre: 'Periféricos', subtemas: 'Timers, contadores, UART, SPI, I2C, ADC, PWM', explicado: false },
          { id: '1-3-5', nombre: 'Interrupciones', subtemas: 'Vector de interrupciones, ISR, prioridades, manejo en tiempo real', explicado: false },
          { id: '1-3-6', nombre: 'Sistemas operativos embebidos', subtemas: 'FreeRTOS, Zephyr, planificación, tareas, semáforos', explicado: false },
          { id: '1-3-7', nombre: 'Comunicación inalámbrica', subtemas: 'Bluetooth, WiFi, Zigbee, LoRa, protocolos IoT', explicado: false },
          { id: '1-3-8', nombre: 'Sensores y actuadores', subtemas: 'Tipos, acondicionamiento de señal, calibración', explicado: false },
          { id: '1-3-9', nombre: 'Diseño de firmware', subtemas: 'Estructura, máquinas de estado, robustez, depuración', explicado: false },
          { id: '1-3-10', nombre: 'Prototipado', subtemas: 'Arduino, Raspberry Pi, ESP32, plataformas de desarrollo', explicado: false },
          { id: '1-3-11', nombre: 'Consumo de energía', subtemas: 'Modos de bajo consumo, gestión de batería, sleep modes', explicado: false },
          { id: '1-3-12', nombre: 'Tiempo real', subtemas: 'Sistemas de tiempo real duros y blandos, latencia, jitter', explicado: false },
          { id: '1-3-13', nombre: 'Verificación', subtemas: 'Pruebas en hardware, simuladores, análisis de fallas', explicado: false },
        ],
      },
      {
        id: '1-4',
        nombre: '1.4 Automatización y control de procesos',
        reactivos: 14,
        temas: [
          { id: '1-4-1', nombre: 'Introducción a la automatización', subtemas: 'Objetivos, niveles (campo, control, supervisión, gestión)', explicado: false },
          { id: '1-4-2', nombre: 'Sensores industriales', subtemas: 'Temperatura, presión, nivel, flujo, posición, proximidad', explicado: false },
          { id: '1-4-3', nombre: 'Actuadores', subtemas: 'Motores DC/AC, paso a paso, servos, válvulas, relés', explicado: false },
          { id: '1-4-4', nombre: 'Control todo o nada', subtemas: 'On-off, histéresis, aplicaciones con termostatos', explicado: false },
          { id: '1-4-5', nombre: 'Control PID', subtemas: 'Proporcional, integral, derivativo, sintonización Ziegler-Nichols', explicado: false },
          { id: '1-4-6', nombre: 'Controladores lógicos (PLC)', subtemas: 'Arquitectura, ciclo de scan, lenguajes (Ladder, FBD, SCL)', explicado: false },
          { id: '1-4-7', nombre: 'Sistemas SCADA', subtemas: 'HMI, historiador, alarmas, arquitectura cliente-servidor', explicado: false },
          { id: '1-4-8', nombre: 'Redes industriales', subtemas: 'Modbus, Profibus, Profinet, EtherNet/IP, OPC UA', explicado: false },
          { id: '1-4-9', nombre: 'Robótica industrial', subtemas: 'Grados de libertad, cinemática básica, programación de robots', explicado: false },
          { id: '1-4-10', nombre: 'Sistemas de tiempo real', subtemas: 'Requisitos, planificación, comunicaciones deterministas', explicado: false },
          { id: '1-4-11', nombre: 'Seguridad funcional', subtemas: 'IEC 61508, IEC 61511, SIL, análisis de riesgos', explicado: false },
          { id: '1-4-12', nombre: 'Instrumentación', subtemas: 'Lazos de control, transmisores, calibración, diagramas P&ID', explicado: false },
          { id: '1-4-13', nombre: 'Visión artificial', subtemas: 'Cámaras, procesamiento de imágenes, inspección automatizada', explicado: false },
          { id: '1-4-14', nombre: 'Industria 4.0', subtemas: 'IoT industrial, gemelos digitales, mantenimiento predictivo', explicado: false },
        ],
      },
    ],
  },
  {
    id: 'area-2',
    numero: 2,
    nombre: 'Implementación de redes de computadoras',
    reactivos: 41,
    color: '#5856D6',
    subareas: [
      {
        id: '2-1',
        nombre: '2.1 Diseño de redes',
        reactivos: 11,
        temas: [
          { id: '2-1-1', nombre: 'Modelos de referencia', subtemas: 'Modelo OSI (7 capas), modelo TCP/IP (4 capas), comparación', explicado: false },
          { id: '2-1-2', nombre: 'Topologías', subtemas: 'Estrella, bus, anillo, malla, árbol, híbridas', explicado: false },
          { id: '2-1-3', nombre: 'Medios de transmisión', subtemas: 'Par trenzado, coaxial, fibra óptica, inalámbrico', explicado: false },
          { id: '2-1-4', nombre: 'Cableado estructurado', subtemas: 'Normas TIA/EIA-568, categorías, patch panels, racks', explicado: false },
          { id: '2-1-5', nombre: 'Direccionamiento IP', subtemas: 'IPv4, IPv6, clases, máscaras, subnetting, CIDR, VLSM', explicado: false },
          { id: '2-1-6', nombre: 'Protocolos de enrutamiento', subtemas: 'RIP, OSPF, EIGRP, BGP, estáticos vs dinámicos', explicado: false },
          { id: '2-1-7', nombre: 'Conmutación', subtemas: 'VLANs, STP, trunking, EtherChannel', explicado: false },
          { id: '2-1-8', nombre: 'Diseño de redes LAN', subtemas: 'Segmentación, dominios de colisión y broadcast, escalabilidad', explicado: false },
          { id: '2-1-9', nombre: 'Diseño de redes WAN', subtemas: 'MPLS, VPN, SD-WAN, tecnologías de última milla', explicado: false },
          { id: '2-1-10', nombre: 'Redes inalámbricas', subtemas: 'Estándares 802.11, canales, seguridad WPA2/WPA3, roaming', explicado: false },
          { id: '2-1-11', nombre: 'Documentación', subtemas: 'Diagramas de red, planos, inventario, políticas', explicado: false },
        ],
      },
      {
        id: '2-2',
        nombre: '2.2 Administración de redes',
        reactivos: 13,
        temas: [
          { id: '2-2-1', nombre: 'Configuración de dispositivos', subtemas: 'Routers, switches, firewalls, access points', explicado: false },
          { id: '2-2-2', nombre: 'Servicios de red', subtemas: 'DHCP, DNS, NAT, NTP, HTTP, FTP, SMTP', explicado: false },
          { id: '2-2-3', nombre: 'Gestión de VLANs', subtemas: 'Creación, asignación de puertos, enrutamiento inter-VLAN', explicado: false },
          { id: '2-2-4', nombre: 'Monitoreo', subtemas: 'SNMP, NetFlow, syslog, Wireshark, Nagios, Zabbix', explicado: false },
          { id: '2-2-5', nombre: 'Gestión de ancho de banda', subtemas: 'QoS, traffic shaping, políticas de priorización', explicado: false },
          { id: '2-2-6', nombre: 'Alta disponibilidad', subtemas: 'HSRP, VRRP, balanceo de carga, redundancia', explicado: false },
          { id: '2-2-7', nombre: 'Gestión de cambios', subtemas: 'ITIL, documentación, control de versiones de configuraciones', explicado: false },
          { id: '2-2-8', nombre: 'Resolución de problemas', subtemas: 'Metodología, ping, traceroute, nslookup, troubleshooting', explicado: false },
          { id: '2-2-9', nombre: 'Gestión de usuarios', subtemas: 'AAA, RADIUS, TACACS+, directorio activo', explicado: false },
          { id: '2-2-10', nombre: 'Virtualización de red', subtemas: 'NFV, SDN, OpenFlow, controladores SDN', explicado: false },
          { id: '2-2-11', nombre: 'Redes en la nube', subtemas: 'VPC, subredes cloud, conectividad híbrida', explicado: false },
          { id: '2-2-12', nombre: 'Respaldos y recuperación', subtemas: 'Configuraciones, planes de contingencia', explicado: false },
          { id: '2-2-13', nombre: 'Documentación y políticas', subtemas: 'Manuales, procedimientos, SLA', explicado: false },
        ],
      },
      {
        id: '2-3',
        nombre: '2.3 Seguridad y evaluación en redes',
        reactivos: 17,
        temas: [
          { id: '2-3-1', nombre: 'Conceptos de seguridad', subtemas: 'Confidencialidad, integridad, disponibilidad, no repudio', explicado: false },
          { id: '2-3-2', nombre: 'Tipos de ataques', subtemas: 'DoS, DDoS, MITM, phishing, inyección, fuerza bruta', explicado: false },
          { id: '2-3-3', nombre: 'Vulnerabilidades', subtemas: 'Escaneo (Nmap), análisis, CVSS, CVE', explicado: false },
          { id: '2-3-4', nombre: 'Criptografía simétrica', subtemas: 'DES, AES, modos de operación, distribución de claves', explicado: false },
          { id: '2-3-5', nombre: 'Criptografía asimétrica', subtemas: 'RSA, ECC, Diffie-Hellman, certificados digitales, PKI', explicado: false },
          { id: '2-3-6', nombre: 'Funciones hash', subtemas: 'SHA, MD5, HMAC, integridad de mensajes', explicado: false },
          { id: '2-3-7', nombre: 'Protocolos seguros', subtemas: 'HTTPS, TLS/SSL, SSH, IPsec, VPN', explicado: false },
          { id: '2-3-8', nombre: 'Firewalls', subtemas: 'Tipos, reglas, iptables, pfSense, next-gen firewalls', explicado: false },
          { id: '2-3-9', nombre: 'IDS/IPS', subtemas: 'Detección por firmas y anomalías, Snort, Suricata', explicado: false },
          { id: '2-3-10', nombre: 'Autenticación', subtemas: 'Contraseñas, MFA, biometría, Kerberos, OAuth', explicado: false },
          { id: '2-3-11', nombre: 'Control de acceso', subtemas: 'ACLs, RBAC, principio de menor privilegio', explicado: false },
          { id: '2-3-12', nombre: 'Seguridad inalámbrica', subtemas: 'WEP, WPA, WPA2, WPA3, ataques comunes', explicado: false },
          { id: '2-3-13', nombre: 'Seguridad perimetral', subtemas: 'DMZ, proxy, honeypots, segmentación', explicado: false },
          { id: '2-3-14', nombre: 'Respuesta a incidentes', subtemas: 'Plan, detección, contención, erradicación, recuperación', explicado: false },
          { id: '2-3-15', nombre: 'Análisis forense', subtemas: 'Recolección de evidencia, cadena de custodia, herramientas', explicado: false },
          { id: '2-3-16', nombre: 'Auditoría', subtemas: 'Pentesting, ethical hacking, reportes de vulnerabilidades', explicado: false },
          { id: '2-3-17', nombre: 'Normativas', subtemas: 'ISO 27001, NIST, PCI-DSS, Ley de protección de datos', explicado: false },
        ],
      },
    ],
  },
  {
    id: 'area-3',
    numero: 3,
    nombre: 'Desarrollo de software',
    reactivos: 50,
    color: '#34C759',
    subareas: [
      {
        id: '3-1',
        nombre: '3.1 Ingeniería de software',
        reactivos: 16,
        temas: [
          { id: '3-1-1', nombre: 'Ciclo de vida del software', subtemas: 'Cascada, iterativo, incremental, espiral, ágil', explicado: false },
          { id: '3-1-2', nombre: 'Ingeniería de requisitos', subtemas: 'Elicitación, análisis, especificación, validación, SRS', explicado: false },
          { id: '3-1-3', nombre: 'Metodologías ágiles', subtemas: 'Scrum, Kanban, XP, roles, ceremonias, artefactos', explicado: false },
          { id: '3-1-4', nombre: 'Análisis y diseño', subtemas: 'Modelado, UML (casos de uso, clases, secuencia, actividad)', explicado: false },
          { id: '3-1-5', nombre: 'Patrones de diseño', subtemas: 'Creacionales, estructurales, de comportamiento, MVC, Singleton', explicado: false },
          { id: '3-1-6', nombre: 'Arquitectura de software', subtemas: 'Capas, microservicios, monolito, cliente-servidor, hexagonal', explicado: false },
          { id: '3-1-7', nombre: 'Diseño de interfaces', subtemas: 'Usabilidad, accesibilidad, HCI, prototipado, heurísticas de Nielsen', explicado: false },
          { id: '3-1-8', nombre: 'Pruebas de software', subtemas: 'Unitarias, integración, sistema, aceptación, caja blanca/negra', explicado: false },
          { id: '3-1-9', nombre: 'Calidad del software', subtemas: 'Normas ISO 25010, métricas, aseguramiento de calidad', explicado: false },
          { id: '3-1-10', nombre: 'Gestión de configuración', subtemas: 'Control de versiones (Git), ramas, merge, CI/CD', explicado: false },
          { id: '3-1-11', nombre: 'Gestión de proyectos', subtemas: 'PMBOK, estimación, cronograma, riesgos, WBS', explicado: false },
          { id: '3-1-12', nombre: 'Mantenimiento', subtemas: 'Correctivo, adaptativo, perfectivo, preventivo, deuda técnica', explicado: false },
          { id: '3-1-13', nombre: 'Refactorización', subtemas: 'Técnicas, code smells, mejora continua', explicado: false },
          { id: '3-1-14', nombre: 'Documentación', subtemas: 'Manuales, API docs, comentarios, wikis', explicado: false },
          { id: '3-1-15', nombre: 'DevOps', subtemas: 'CI/CD, contenedores, Docker, Kubernetes, infraestructura como código', explicado: false },
          { id: '3-1-16', nombre: 'Costos y estimación', subtemas: 'Puntos de función, COCOMO, story points, velocity', explicado: false },
        ],
      },
      {
        id: '3-2',
        nombre: '3.2 Programación y software base',
        reactivos: 13,
        temas: [
          { id: '3-2-1', nombre: 'Paradigmas de programación', subtemas: 'Imperativo, orientado a objetos, funcional, lógico, declarativo', explicado: false },
          { id: '3-2-2', nombre: 'Programación orientada a objetos', subtemas: 'Clases, objetos, herencia, polimorfismo, encapsulamiento, abstracción', explicado: false },
          { id: '3-2-3', nombre: 'Tipos de datos y variables', subtemas: 'Primitivos, compuestos, tipado fuerte/débil, dinámico/estático', explicado: false },
          { id: '3-2-4', nombre: 'Estructuras de control', subtemas: 'Condicionales, ciclos, switch, manejo de excepciones', explicado: false },
          { id: '3-2-5', nombre: 'Funciones y modularidad', subtemas: 'Parámetros, retorno, sobrecarga, paso por valor/referencia', explicado: false },
          { id: '3-2-6', nombre: 'Compiladores e intérpretes', subtemas: 'Análisis léxico, sintáctico, semántico, generación de código', explicado: false },
          { id: '3-2-7', nombre: 'Ensambladores', subtemas: 'Lenguaje ensamblador, instrucciones, macros, enlazadores', explicado: false },
          { id: '3-2-8', nombre: 'Sistemas operativos', subtemas: 'Procesos, hilos, planificación, memoria, sistemas de archivos', explicado: false },
          { id: '3-2-9', nombre: 'Concurrencia', subtemas: 'Hilos, semáforos, mutex, condiciones de carrera, deadlock', explicado: false },
          { id: '3-2-10', nombre: 'Gestión de memoria', subtemas: 'Stack, heap, garbage collection, punteros, memory leaks', explicado: false },
          { id: '3-2-11', nombre: 'Lenguajes de programación', subtemas: 'Comparación (Python, Java, C, JavaScript), tipado, paradigmas', explicado: false },
          { id: '3-2-12', nombre: 'Estándares y buenas prácticas', subtemas: 'Convenciones, clean code, principios SOLID, DRY, KISS', explicado: false },
          { id: '3-2-13', nombre: 'Seguridad en programación', subtemas: 'Validación de entrada, inyecciones, sanitización, OWASP', explicado: false },
        ],
      },
      {
        id: '3-3',
        nombre: '3.3 Manejo de datos y algoritmos',
        reactivos: 21,
        temas: [
          { id: '3-3-1', nombre: 'Estructuras de datos lineales', subtemas: 'Arreglos, listas enlazadas, pilas, colas', explicado: true },
          { id: '3-3-2', nombre: 'Estructuras no lineales', subtemas: 'Árboles, BST, grafos, tablas hash', explicado: true },
          { id: '3-3-3', nombre: 'Complejidad algorítmica', subtemas: 'Notación Big-O, análisis temporal y espacial, mejor/peor caso', explicado: true },
          { id: '3-3-4', nombre: 'Recursividad', subtemas: 'Caso base, caso recursivo, pila de llamadas, memoización', explicado: true },
          { id: '3-3-5', nombre: 'Ordenamiento', subtemas: 'Burbuja, selección, inserción, merge sort, quick sort, heap sort', explicado: true },
          { id: '3-3-6', nombre: 'Búsqueda', subtemas: 'Lineal, binaria, hash, en árboles', explicado: true },
          { id: '3-3-7', nombre: 'Algoritmos de grafos', subtemas: 'BFS, DFS, Dijkstra, Floyd-Warshall, árbol de expansión mínima', explicado: false },
          { id: '3-3-8', nombre: 'Algoritmos greedy', subtemas: 'Cambio de monedas, mochila fraccional, Huffman, Prim, Kruskal', explicado: false },
          { id: '3-3-9', nombre: 'Programación dinámica', subtemas: 'Mochila 0/1, subsecuencia común, caminos mínimos, fibonacci', explicado: false },
          { id: '3-3-10', nombre: 'Divide y vencerás', subtemas: 'Merge sort, quick sort, búsqueda binaria, multiplicación de matrices', explicado: false },
          { id: '3-3-11', nombre: 'Modelo relacional', subtemas: 'Tablas, filas, columnas, llaves primarias y foráneas, integridad', explicado: true },
          { id: '3-3-12', nombre: 'SQL básico', subtemas: 'SELECT, INSERT, UPDATE, DELETE, WHERE, ORDER BY', explicado: true },
          { id: '3-3-13', nombre: 'SQL avanzado', subtemas: 'JOIN, GROUP BY, HAVING, subconsultas, vistas, índices', explicado: true },
          { id: '3-3-14', nombre: 'Normalización', subtemas: '1FN, 2FN, 3FN, BCNF, dependencias funcionales', explicado: true },
          { id: '3-3-15', nombre: 'Transacciones ACID', subtemas: 'Atomicidad, consistencia, aislamiento, durabilidad', explicado: true },
          { id: '3-3-16', nombre: 'Concurrencia en BD', subtemas: 'Niveles de aislamiento, bloqueos, deadlocks, MVCC', explicado: true },
          { id: '3-3-17', nombre: 'Modelado de datos', subtemas: 'Entidad-relación, diagramas, cardinalidad, diseño lógico/físico', explicado: false },
          { id: '3-3-18', nombre: 'Álgebra relacional', subtemas: 'Selección, proyección, unión, intersección, producto cartesiano', explicado: false },
          { id: '3-3-19', nombre: 'NoSQL', subtemas: 'Documentales, clave-valor, grafos, columnas, casos de uso', explicado: false },
          { id: '3-3-20', nombre: 'Big Data', subtemas: 'Hadoop, MapReduce, Spark, procesamiento distribuido', explicado: false },
          { id: '3-3-21', nombre: 'Inteligencia artificial básica', subtemas: 'Búsqueda, representación del conocimiento, machine learning básico', explicado: false },
        ],
      },
    ],
  },
];

const transversales: Area[] = [
  {
    id: 'trans-1',
    numero: 1,
    nombre: 'Comprensión lectora',
    reactivos: 30,
    color: '#5AC8FA',
    subareas: [
      {
        id: 'comp-lectora',
        nombre: 'Ámbitos y géneros',
        reactivos: 30,
        temas: [
          { id: 'cl-1', nombre: 'Ámbito de estudio', subtemas: 'Reseña académica, artículo de investigación (12 reactivos)', explicado: false },
          { id: 'cl-2', nombre: 'Ámbito literario', subtemas: 'Cuento, ensayo literario (12 reactivos)', explicado: false },
          { id: 'cl-3', nombre: 'Ámbito de participación social', subtemas: 'Convocatoria, nota informativa (6 reactivos)', explicado: false },
          { id: 'cl-4', nombre: 'Identificación de información', subtemas: 'Datos explícitos, detalles, secuencias, causa-efecto', explicado: false },
          { id: 'cl-5', nombre: 'Interpretación', subtemas: 'Idea central, inferencias, propósito del autor, tono', explicado: false },
          { id: 'cl-6', nombre: 'Evaluación de forma y contenido', subtemas: 'Argumentos, ejemplos, coherencia, validez', explicado: false },
        ],
      },
    ],
  },
  {
    id: 'trans-2',
    numero: 2,
    nombre: 'Redacción indirecta',
    reactivos: 30,
    color: '#AF52DE',
    subareas: [
      {
        id: 'redac-indirecta',
        nombre: 'Ámbitos y dimensiones',
        reactivos: 30,
        temas: [
          { id: 'ri-1', nombre: 'Ámbito de estudio', subtemas: 'Artículo de divulgación, protocolo de investigación, reseña (15 reactivos)', explicado: false },
          { id: 'ri-2', nombre: 'Ámbito de participación social', subtemas: 'Editorial de periódico, convocatoria, carta de exposición (15 reactivos)', explicado: false },
          { id: 'ri-3', nombre: 'Dimensión comunicativa', subtemas: 'Registro lingüístico, propósito, género textual, receptor', explicado: false },
          { id: 'ri-4', nombre: 'Dimensión gramatical', subtemas: 'Concordancia nominal y verbal, cohesión gramatical', explicado: false },
          { id: 'ri-5', nombre: 'Dimensión semántica', subtemas: 'Cohesión léxica, coherencia textual, conectores', explicado: false },
          { id: 'ri-6', nombre: 'Dimensión ortográfica', subtemas: 'Grafofonética, puntuación, acentuación', explicado: false },
        ],
      },
    ],
  },
];

export default function TemarioInteractivo() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    const guardado = localStorage.getItem('temario-progreso-v1');
    if (guardado) {
      try {
        setChecked(JSON.parse(guardado));
      } catch {
        // ignorar
      }
    }
    setHidratado(true);
  }, []);

  useEffect(() => {
    if (hidratado) {
      localStorage.setItem('temario-progreso-v1', JSON.stringify(checked));
    }
  }, [checked, hidratado]);

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function contarTemas(area: Area) {
    return area.subareas.reduce((acc, sub) => acc + sub.temas.length, 0);
  }

  function contarCompletados(area: Area) {
    return area.subareas.reduce(
      (acc, sub) => acc + sub.temas.filter((t) => checked[t.id]).length,
      0
    );
  }

  const totalTemas = useMemo(() => {
    const disciplinar = areas.reduce((acc, a) => acc + contarTemas(a), 0);
    const trans = transversales.reduce((acc, a) => acc + contarTemas(a), 0);
    return disciplinar + trans;
  }, []);

  const totalCompletados = useMemo(() => {
    const disciplinar = areas.reduce((acc, a) => acc + contarCompletados(a), 0);
    const trans = transversales.reduce((acc, a) => acc + contarCompletados(a), 0);
    return disciplinar + trans;
  }, [checked]);

  const porcentajeGlobal =
    totalTemas > 0 ? Math.round((totalCompletados / totalTemas) * 100) : 0;

  function reiniciar() {
    if (confirm('¿Reiniciar todo el progreso? Esta acción no se puede deshacer.')) {
      setChecked({});
    }
  }

  return (
    <div className="space-y-8">
      {/* Progreso global - glass hero */}
      <section className="glass-elevated rounded-[24px] p-6 md:p-7">
        <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-[0.14em]">
              Progreso general
            </p>
            <p className="text-4xl font-bold text-black tracking-tight mt-1.5 tabular-nums">
              {porcentajeGlobal}
              <span className="text-xl text-black/30 ml-0.5">%</span>
            </p>
            <p className="text-xs text-black/50 mt-1.5">
              {totalCompletados} de {totalTemas} temas dominados
            </p>
          </div>

          <button
            onClick={reiniciar}
            className="text-xs font-semibold text-black/40 hover:text-[#FF3B30] px-3 py-2 rounded-xl hover:bg-[#FF3B30]/10 transition-all tap-scale"
          >
            Reiniciar progreso
          </button>
        </div>

        <div className="h-2.5 bg-black/[0.05] rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#007AFF] via-[#4A8FE7] to-[#5856D6] transition-all duration-700 ease-out relative"
            style={{ width: `${porcentajeGlobal}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
          </div>
        </div>
      </section>

      {/* Info del examen */}
      <section className="glass-elevated rounded-[24px] p-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#007AFF]/15 to-[#5856D6]/15 flex items-center justify-center flex-shrink-0 border border-white/60">
            <svg
              className="w-5 h-5 text-[#007AFF]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-black text-sm">
              Sobre este temario
            </h2>
            <p className="text-sm text-black/60 mt-2 leading-relaxed">
              El Ceneval no publica la lista oficial de temas. Esta es una guía
              de estudio propuesta a partir de las subáreas oficiales de la guía
              del sustentante. Los temas con la etiqueta{' '}
              <span className="inline-flex items-center gap-1 mx-0.5 px-2 py-0.5 rounded-md bg-[#34C759]/15 text-[#34C759] text-[11px] font-semibold border border-[#34C759]/20">
                Contenido disponible
              </span>{' '}
              ya tienen lecciones en tu plataforma.
            </p>
          </div>
        </div>
      </section>

      {/* Sección Disciplinar */}
      <section>
        <div className="mb-5 px-1">
          <p className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-[0.14em]">
            Sección
          </p>
          <h2 className="text-2xl font-bold text-black tracking-tight mt-1">
            Disciplinar específica de la profesión
          </h2>
          <p className="text-sm text-black/50 mt-1">
            140 reactivos · 3 áreas · 10 subáreas
          </p>
        </div>

        <div className="space-y-6">
          {areas.map((area) => (
            <AreaBlock
              key={area.id}
              area={area}
              checked={checked}
              onToggle={toggle}
            />
          ))}
        </div>
      </section>

      {/* Sección Transversal */}
      <section>
        <div className="mb-5 px-1">
          <p className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-[0.14em]">
            Sección
          </p>
          <h2 className="text-2xl font-bold text-black tracking-tight mt-1">
            Transversal de Lenguaje y Comunicación
          </h2>
          <p className="text-sm text-black/50 mt-1">
            60 reactivos · 2 áreas · común a todas las profesiones
          </p>
        </div>

        <div className="space-y-6">
          {transversales.map((area) => (
            <AreaBlock
              key={area.id}
              area={area}
              checked={checked}
              onToggle={toggle}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function AreaBlock({
  area,
  checked,
  onToggle,
}: {
  area: Area;
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const totalTemas = area.subareas.reduce((acc, s) => acc + s.temas.length, 0);
  const completados = area.subareas.reduce(
    (acc, s) => acc + s.temas.filter((t) => checked[t.id]).length,
    0
  );
  const porcentaje =
    totalTemas > 0 ? Math.round((completados / totalTemas) * 100) : 0;

  return (
    <div className="glass-elevated rounded-[24px] overflow-hidden">
      {/* Header del área */}
      <div className="px-6 pt-6 pb-5 border-b border-black/[0.06] relative">
        {/* Glow de fondo según color del área */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            background: `radial-gradient(circle at top right, ${area.color} 0%, transparent 60%)`,
          }}
        />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2">
              <span
                className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${area.color}, ${area.color}CC)`,
                }}
              >
                {area.numero}
              </span>
              <span className="text-[10px] font-semibold text-black/50 uppercase tracking-[0.12em]">
                {area.reactivos} reactivos
              </span>
            </div>
            <h3 className="font-bold text-black text-lg tracking-tight leading-snug">
              {area.nombre}
            </h3>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="text-3xl font-bold text-black tracking-tight tabular-nums">
              {porcentaje}
              <span className="text-base text-black/30 ml-0.5">%</span>
            </p>
            <p className="text-[11px] text-black/40 font-medium tabular-nums">
              {completados} / {totalTemas}
            </p>
          </div>
        </div>

        <div className="h-1.5 bg-black/[0.05] rounded-full overflow-hidden mt-4 shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${porcentaje}%`,
              background: `linear-gradient(90deg, ${area.color}, ${area.color}DD)`,
            }}
          />
        </div>
      </div>

      {/* Subáreas */}
      <div className="divide-y divide-black/[0.05]">
        {area.subareas.map((sub) => (
          <SubareaBlock
            key={sub.id}
            subarea={sub}
            checked={checked}
            onToggle={onToggle}
            color={area.color}
          />
        ))}
      </div>
    </div>
  );
}

function SubareaBlock({
  subarea,
  checked,
  onToggle,
  color,
}: {
  subarea: Subarea;
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
  color: string;
}) {
  const completados = subarea.temas.filter((t) => checked[t.id]).length;
  const total = subarea.temas.length;

  return (
    <div className="px-6 py-5">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h4 className="font-semibold text-black text-sm leading-snug">
          {subarea.nombre}
        </h4>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] font-semibold text-black/50 tabular-nums">
            {completados}/{total}
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-md border"
            style={{
              backgroundColor: `${color}10`,
              borderColor: `${color}25`,
              color,
            }}
          >
            {subarea.reactivos} reactivos
          </span>
        </div>
      </div>

      <ul className="space-y-1">
        {subarea.temas.map((tema) => {
          const activo = !!checked[tema.id];
          return (
            <li key={tema.id}>
              <button
                type="button"
                onClick={() => onToggle(tema.id)}
                className={`w-full text-left flex items-start gap-3 p-3 rounded-2xl transition-all duration-200 group ${
                  activo
                    ? 'bg-[#34C759]/[0.06]'
                    : 'hover:bg-black/[0.03]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 check-glow ${
                    activo
                      ? 'bg-gradient-to-br from-[#34C759] to-[#2FB350] shadow-md shadow-[#34C759]/25'
                      : 'bg-white/80 border border-black/15 group-hover:border-black/30 backdrop-blur-sm'
                  }`}
                >
                  {activo && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm font-medium transition-all duration-200 ${
                        activo
                          ? 'text-black/40 line-through decoration-black/20'
                          : 'text-black'
                      }`}
                    >
                      {tema.nombre}
                    </span>
                    {tema.explicado && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[#34C759]/15 text-[#34C759] border border-[#34C759]/20">
                        Contenido disponible
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-0.5 leading-relaxed transition-all duration-200 ${
                      activo ? 'text-black/30' : 'text-black/50'
                    }`}
                  >
                    {tema.subtemas}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}