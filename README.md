# 📚 Indexa - Backend

> **API RESTful para la gestión e indexación de temarios de libros físicos**

[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![Prettier](https://img.shields.io/badge/prettier-192a32?style=for-the-badge&logo=prettier&logoColor=dc524a)](https://prettier.io/)
[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/)
[![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](./LICENSE)

## 📖 Descripción

Indexa API es el backend de una aplicación web que permite indexar y organizar los temarios de libros físicos. Esta API REST proporciona todos los endpoints necesarios para gestionar libros, capítulos, temas y subtemas, facilitando la búsqueda y organización de contenido bibliográfico.

El sistema está diseñado para trabajar con un frontend en HTML/JavaScript vanilla y utiliza una base de datos MySQL para el almacenamiento persistente de datos.

## ⚙️ Tecnologías Backend

- **Node.js** (v22.x o superior) - Entorno de ejecución
- **Express.js** - Framework web
- **MySQL** - Sistema de gestión de base de datos
- **JavaScript** - Lenguaje de programación

### Stack Completo del Sistema

- **Frontend**: HTML5 + CSS3 + JavaScript (ES6+)
- **Backend**: Node.js + Express.js
- **Base de Datos**: MySQL
- **API**: RESTful

## 🏗️ Arquitectura

Este proyecto sigue el patrón de arquitectura **MVC (Model-View-Controller)** adaptado para una API REST:

```
indexa-api/
├── config/             # Configuración de la aplicación y base de datos
│   └── ...
├── controllers/
│   └── ...
├── middleware/
│   └── ...
├── models/
│   └── ...
├── repositories/
│   └── ...
├── routes/
│   └── ...
├── services/
│   └── ...
├── .env                # Variables de entorno (no incluido en el repositorio)
├── .env.example        # Variables de entorno de ejemplo
├── .gitignore          # Archivos y carpetas ignorados por Git
├── index.js            # Punto de entrada de la aplicación
├── LICENSE             # Licencia del proyecto
├── package.json        # Dependencias y configuración del proyecto
├── package-lock.json   # Versiones exactas de las dependencias
└── README.md           # Documentación del proyecto
```

### Capas de la arquitectura:

- **Routes**: Define los endpoints de la API y los vincula con los controladores
- **Middleware**: Funciones intermedias para autenticación, validación, logs, etc.
- **Controllers**: Reciben las peticiones HTTP, validan datos y coordinan la respuesta
- **Services**: Contienen la lógica de negocio de la aplicación
- **Repositories**: Abstraen el acceso a la base de datos
- **Models**: Definen la estructura de datos y entidades del dominio

## 🚀 Instalación y Configuración

### Prerequisitos

- [Node.js](https://nodejs.org/) (versión 22.0.0 o superior)
- [MySQL](https://www.mysql.com/) (versión 8.0 o superior)
- npm (incluido con Node.js)

### Configuración

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/kitorosano/indexa-api.git
   cd indexa-api
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   ```

   Edita el archivo `.env` con tus credenciales de base de datos:

   ```env
   PORT=
   ```

4. **Configurar la base de datos**

   Ejecuta las migraciones o scripts SQL necesarios (ubicados en `config/` o directorio específico).

5. **Iniciar el servidor**

   ```bash
   npm run dev
   ```

   El servidor estará disponible en `http://localhost:3000` (o el puerto configurado en `.env`).

## 📡 Endpoints de la API

### Libros

```
GET    /api/books           # Obtener todos los libros
GET    /api/books/:id       # Obtener un libro por ID
POST   /api/books           # Crear un nuevo libro
PUT    /api/books/:id       # Actualizar un libro
DELETE /api/books/:id       # Eliminar un libro
```

### Capítulos

```
GET    /api/chapters        # Obtener todos los capítulos
GET    /api/chapters/:id    # Obtener un capítulo por ID
POST   /api/chapters        # Crear un nuevo capítulo
PUT    /api/chapters/:id    # Actualizar un capítulo
DELETE /api/chapters/:id    # Eliminar un capítulo
```

### Temas

```
GET    /api/topics          # Obtener todos los temas
GET    /api/topics/:id      # Obtener un tema por ID
POST   /api/topics          # Crear un nuevo tema
PUT    /api/topics/:id      # Actualizar un tema
DELETE /api/topics/:id      # Eliminar un tema
```

> **Nota**: La documentación completa de la API estará disponible próximamente.

## 🗄️ Modelo de base de datos

### Entidades principales:

- **Books** (Libros): Información principal de cada libro físico
- **Chapters** (Capítulos): Capítulos de cada libro
- **Topics** (Temas): Temas principales dentro de capítulos
- **Subtopics** (Subtemas): Subtemas dentro de cada tema

## 🔒 Seguridad

- Validación de datos de entrada en todos los endpoints
- Sanitización de consultas SQL para prevenir inyecciones
- Variables de entorno para información sensible
- Middleware de autenticación

## 🔗 Repositorios Relacionados

- **Frontend Web**: [indexa-web](https://github.com/kitorosano/indexa-web) - Frontend en HTML/JavaScript para interactuar con esta API.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autores

**kitorosano**

- GitHub: [@kitorosano](https://github.com/kitorosano)

---

⭐️ Si este proyecto te resulta útil, considera darle una estrella en GitHub
