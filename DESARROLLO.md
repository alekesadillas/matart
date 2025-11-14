# Desarrollo del Proyecto Novus

## Introducción

**Novus** es una aplicación web de red social desarrollada con tecnologías modernas del ecosistema JavaScript/TypeScript. El proyecto está diseñado para permitir a los usuarios compartir contenido, interactuar mediante likes y comentarios, seguir a otros usuarios y recibir notificaciones de actividades relevantes.

## Stack Tecnológico

### Frontend

- **Next.js 16.1.0**: Framework React con soporte para Server Components y App Router
- **React 19.2.0**: Biblioteca para la construcción de interfaces de usuario
- **TypeScript 5**: Lenguaje de programación tipado para mayor seguridad y mantenibilidad del código
- **Tailwind CSS 4**: Framework de CSS utility-first para diseño responsivo y moderno
- **Radix UI**: Biblioteca de componentes accesibles y personalizables
  - `@radix-ui/react-avatar`: Componente de avatar
  - `@radix-ui/react-dialog`: Componente de diálogo/modal
  - `@radix-ui/react-separator`: Componente separador visual
  - `@radix-ui/react-slot`: Utilidad para composición de componentes
- **Lucide React**: Biblioteca de iconos modernos y consistentes
- **next-themes**: Gestión de temas (modo claro/oscuro)
- **class-variance-authority**: Utilidad para variantes de componentes

### Backend

- **Next.js Server Actions**: Funciones del servidor para operaciones del lado del servidor
- **Prisma 6.19.0**: ORM (Object-Relational Mapping) para PostgreSQL
- **PostgreSQL**: Base de datos relacional para almacenamiento persistente
- **Clerk 6.34.5**: Servicio de autenticación y gestión de usuarios

### Herramientas de Desarrollo

- **Prisma Client**: Cliente generado para consultas tipadas a la base de datos
- **dotenv**: Gestión de variables de entorno
- **TypeScript**: Type checking y autocompletado

## Arquitectura del Proyecto

### Patrón de Diseño

El proyecto sigue el patrón de arquitectura de Next.js App Router, que permite:

- **Server Components**: Componentes que se renderizan en el servidor para mejor rendimiento y SEO
- **Client Components**: Componentes interactivos que requieren JavaScript en el cliente (marcados con `"use client"`)
- **Server Actions**: Funciones ejecutadas en el servidor para operaciones sensibles y mutaciones de datos

### Estructura de Directorios

```
matart/
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   └── migrations/            # Migraciones de base de datos
├── public/                    # Archivos estáticos
├── src/
│   ├── actions/               # Server Actions
│   │   └── user.actions.ts    # Acciones relacionadas con usuarios
│   ├── app/                   # App Router de Next.js
│   │   ├── layout.tsx         # Layout principal de la aplicación
│   │   ├── page.tsx           # Página principal
│   │   └── globals.css        # Estilos globales
│   ├── components/            # Componentes React
│   │   ├── ui/                # Componentes UI reutilizables
│   │   │   ├── avatar.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── separator.tsx
│   │   │   └── sheet.tsx
│   │   ├── DesktopNavbar.tsx  # Barra de navegación desktop
│   │   ├── MobileNavbar.tsx   # Barra de navegación móvil
│   │   ├── Navbar.tsx         # Componente contenedor de navegación
│   │   ├── Sidebar.tsx        # Barra lateral con información del usuario
│   │   ├── ModeToogle.tsx     # Toggle para tema claro/oscuro
│   │   └── ThemeProvider.tsx  # Proveedor de temas
│   ├── generated/             # Código generado por Prisma
│   │   └── prisma/
│   ├── lib/                   # Utilidades y configuración
│   │   ├── prisma.ts          # Cliente de Prisma (singleton)
│   │   └── utils.ts           # Utilidades generales
│   └── middleware.ts          # Middleware de Next.js
└── package.json               # Dependencias del proyecto
```

## Base de Datos y Modelos de Datos

### Esquema de Base de Datos

La aplicación utiliza PostgreSQL como base de datos relacional, con el siguiente esquema definido en Prisma:

#### Modelo User

Representa a los usuarios de la plataforma:

- **Campos principales**:
  - `id`: Identificador único (CUID)
  - `email`: Correo electrónico único
  - `username`: Nombre de usuario único
  - `clerkId`: Identificador del usuario en Clerk (único)
  - `name`: Nombre completo (opcional)
  - `bio`: Biografía del usuario (opcional)
  - `image`: URL de la imagen de perfil (opcional)
  - `location`: Ubicación del usuario (opcional)
  - `website`: Sitio web personal (opcional)
  - `createdAt`: Fecha de creación
  - `updatedAt`: Fecha de última actualización

- **Relaciones**:
  - `posts`: Posts creados por el usuario (uno a muchos)
  - `comments`: Comentarios realizados (uno a muchos)
  - `likes`: Likes dados (uno a muchos)
  - `followers`: Usuarios que siguen a este usuario (muchos a muchos)
  - `following`: Usuarios que este usuario sigue (muchos a muchos)
  - `notifications`: Notificaciones recibidas (uno a muchos)
  - `notificationsCreator`: Notificaciones creadas por el usuario (uno a muchos)

#### Modelo Post

Representa las publicaciones de los usuarios:

- **Campos principales**:
  - `id`: Identificador único
  - `content`: Contenido textual del post
  - `image`: URL de imagen adjunta (opcional)
  - `authorId`: Referencia al usuario autor
  - `createdAt`: Fecha de creación
  - `updatedAt`: Fecha de última actualización

- **Relaciones**:
  - `author`: Usuario que creó el post
  - `comments`: Comentarios del post (uno a muchos)
  - `likes`: Likes del post (uno a muchos)
  - `notifications`: Notificaciones relacionadas (uno a muchos)

- **Características**:
  - Eliminación en cascada: si se elimina el autor, se eliminan sus posts

#### Modelo Comment

Representa los comentarios en posts:

- **Campos principales**:
  - `id`: Identificador único
  - `content`: Contenido del comentario
  - `authorId`: Referencia al usuario que comenta
  - `postId`: Referencia al post comentado
  - `createdAt`: Fecha de creación
  - `updatedAt`: Fecha de última actualización

- **Relaciones**:
  - `author`: Usuario que realizó el comentario
  - `post`: Post al que pertenece el comentario
  - `notifications`: Notificaciones relacionadas (uno a muchos)

- **Optimizaciones**:
  - Índice compuesto en `[authorId, postId]` para mejorar consultas
  - Eliminación en cascada: si se elimina el autor o el post, se eliminan los comentarios

#### Modelo Like

Representa los likes en posts:

- **Campos principales**:
  - `id`: Identificador único
  - `userId`: Referencia al usuario que dio like
  - `postId`: Referencia al post
  - `createdAt`: Fecha del like

- **Relaciones**:
  - `user`: Usuario que dio el like
  - `post`: Post al que se dio like

- **Restricciones**:
  - Constraint único en `[userId, postId]`: un usuario solo puede dar like una vez por post
  - Índice en `[userId, postId]` para optimizar consultas
  - Eliminación en cascada

#### Modelo Follows

Representa la relación de seguimiento entre usuarios:

- **Campos principales**:
  - `followerId`: ID del usuario que sigue
  - `followingId`: ID del usuario seguido
  - `createdAt`: Fecha en que se estableció el seguimiento

- **Relaciones**:
  - `follower`: Usuario que sigue
  - `following`: Usuario seguido

- **Restricciones**:
  - Constraint único en `[followerId, followingId]`: un usuario no puede seguir a otro más de una vez
  - Índice en `[followerId, followingId]` para optimizar consultas
  - Eliminación en cascada

#### Modelo Notification

Representa las notificaciones del sistema:

- **Campos principales**:
  - `id`: Identificador único
  - `userId`: Usuario que recibe la notificación
  - `creatorId`: Usuario que generó la notificación
  - `type`: Tipo de notificación (LIKE, COMMENT, FOLLOW)
  - `read`: Estado de lectura (por defecto: false)
  - `postId`: Referencia al post relacionado (opcional)
  - `commentId`: Referencia al comentario relacionado (opcional)
  - `createdAt`: Fecha de creación

- **Relaciones**:
  - `user`: Usuario receptor de la notificación
  - `creator`: Usuario que creó la notificación
  - `post`: Post relacionado (opcional)
  - `comment`: Comentario relacionado (opcional)

- **Optimizaciones**:
  - Índice en `[userId, createdAt]` para ordenar notificaciones por usuario y fecha
  - Eliminación en cascada

#### Enum NotificationType

Define los tipos de notificaciones disponibles:
- `LIKE`: Notificación por like en un post
- `COMMENT`: Notificación por comentario en un post
- `FOLLOW`: Notificación por nuevo seguidor

## Funcionalidades Implementadas

### Autenticación y Gestión de Usuarios

- **Integración con Clerk**: Sistema de autenticación completo
  - Registro e inicio de sesión de usuarios
  - Gestión de sesiones
  - Componentes `SignInButton` y `SignUpButton` integrados
  - Componente `UserButton` para gestión del perfil de usuario

- **Sincronización de Usuarios**:
  - Función `syncUser()`: Sincroniza usuarios de Clerk con la base de datos local
  - Creación automática de usuarios en la base de datos al autenticarse
  - Validación y manejo de errores en la sincronización
  - Verificación de existencia previa antes de crear nuevos registros

- **Gestión de Perfiles**:
  - Función `getUserByClerkId()`: Obtiene información completa del usuario incluyendo conteos
  - Visualización de perfil de usuario con avatar, nombre, username, bio, ubicación y sitio web
  - Conteo de seguidores y seguidos
  - Enlaces a perfiles de usuario mediante username

### Componentes de Interfaz

#### Navbar (Barra de Navegación)

- **Componente responsivo**:
  - `DesktopNavbar`: Navegación para pantallas medianas y grandes
  - `MobileNavbar`: Navegación para dispositivos móviles
  - Detección automática del tamaño de pantalla

- **Funcionalidades**:
  - Enlace a página principal
  - Enlace a notificaciones (usuarios autenticados)
  - Enlace a perfil de usuario (usuarios autenticados)
  - Botones de inicio de sesión/registro (usuarios no autenticados)
  - Toggle de tema claro/oscuro
  - Sincronización automática de usuario al cargar la navegación

#### Sidebar (Barra Lateral)

- **Para usuarios autenticados**:
  - Avatar del usuario con imagen de perfil
  - Nombre y username del usuario
  - Biografía (si está disponible)
  - Estadísticas: número de seguidos y seguidores
  - Ubicación y sitio web personal
  - Enlace al perfil del usuario

- **Para usuarios no autenticados**:
  - Mensaje de bienvenida
  - Botones de inicio de sesión y registro

- **Características**:
  - Posición sticky (se mantiene visible al hacer scroll)
  - Diseño centrado y limpio
  - Componentes de separación visual (Separator)

#### Sistema de Temas

- **Soporte para modo claro y oscuro**:
  - Toggle visual para cambiar entre temas
  - Detección de preferencias del sistema operativo
  - Persistencia de preferencias del usuario
  - Transiciones suaves entre temas
  - Componente `ThemeProvider` envolviendo la aplicación

### Diseño y Estilos

- **Tailwind CSS**: Utilización de clases utility-first
- **Diseño Responsive**: Adaptación a diferentes tamaños de pantalla
  - Grid system: `grid-cols-1 lg:grid-cols-12` para layout principal
  - Sidebar visible solo en pantallas grandes (`hidden lg:block`)
  - Navegación adaptativa desktop/mobile
- **Componentes UI Reutilizables**: Sistema de componentes basado en Radix UI
  - Avatar, Button, Card, Separator, Sheet
  - Personalización mediante props y variantes

## Configuración y Setup

### Variables de Entorno

El proyecto requiere las siguientes variables de entorno:

- `DATABASE_URL`: URL de conexión a PostgreSQL
- Variables de configuración de Clerk (incluidas automáticamente por Clerk)

### Instalación de Dependencias

```bash
npm install
```

### Configuración de Base de Datos

1. Configurar la URL de base de datos en `.env`
2. Ejecutar migraciones de Prisma:

```bash
npx prisma migrate dev
```

3. Generar el cliente de Prisma:

```bash
npx prisma generate
```

### Ejecución del Proyecto

- **Desarrollo**:
```bash
npm run dev
```

- **Producción**:
```bash
npm run build
npm start
```

## Características Técnicas Destacadas

### Server Actions

Utilización de Server Actions de Next.js para operaciones del servidor:

- **Ventajas**:
  - Ejecución segura en el servidor
  - No requiere endpoints API explícitos
  - Type-safe con TypeScript
  - Integración directa con componentes

### Optimización de Base de Datos

- **Índices estratégicos**: Mejora del rendimiento en consultas frecuentes
- **Constraints únicos**: Prevención de datos duplicados
- **Eliminación en cascada**: Mantenimiento de integridad referencial
- **Queries optimizadas**: Uso de `include` y `_count` de Prisma para obtener datos relacionados eficientemente

### Renderizado del Servidor

- **Server Components por defecto**: Mejor rendimiento y SEO
- **Client Components selectivos**: Solo donde se requiere interactividad
- **Loading states**: Manejo de estados de carga en componentes client-side

### Type Safety

- **TypeScript estricto**: Configuración con `strict: true`
- **Prisma Client tipado**: Autocompletado y validación en consultas a la base de datos
- **Path aliases**: Configuración de `@/*` para imports limpios

## Consideraciones de Desarrollo

### Buenas Prácticas Implementadas

1. **Separación de responsabilidades**: Actions separadas de componentes
2. **Reutilización de componentes**: Componentes UI compartidos
3. **Manejo de errores**: Try-catch en operaciones críticas
4. **Validación de datos**: Verificación de existencia antes de operaciones
5. **Código tipado**: Uso extensivo de TypeScript

### Áreas de Mejora Futura

- Implementación completa de funcionalidades de posts, comentarios y likes
- Sistema de búsqueda de usuarios
- Filtros y ordenamiento de contenido
- Paginación en listas de contenido
- Carga de imágenes con optimización
- Sistema de notificaciones en tiempo real
- Pruebas unitarias y de integración

## Conclusión

El proyecto **Novus** está construido sobre una base sólida y escalable, utilizando tecnologías modernas y mejores prácticas de desarrollo. La arquitectura permite un crecimiento ordenado y la incorporación de nuevas funcionalidades de manera eficiente. El sistema de base de datos está optimizado para manejar relaciones complejas entre usuarios, contenido e interacciones, mientras que la interfaz de usuario proporciona una experiencia responsive y moderna.

