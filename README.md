# Sistema de Gestión de Parking 🚗

## **Descripción del Proyecto**
Este proyecto implementa un sistema de gestión de plazas de parking, cumpliendo con los requisitos de la **Práctica PW1**. Permite la autenticación de usuarios, la gestión de plazas (asignación, listado y creación), y la búsqueda de plazas mediante un filtro. La implementación utiliza tecnologías modernas y sigue buenas prácticas en arquitectura y desarrollo web.

---

## **Características Principales**
1. **Autenticación de Usuarios**  
   - Registro de usuarios con validación de contraseña.  
   - Login mediante JWT (JSON Web Tokens).  
   - Protección de rutas mediante middleware.

2. **Gestión de Plazas de Parking**  
   - Creación de nuevas plazas.  
   - Listado de todas las plazas existentes.  
   - Asignación de plazas a usuarios autenticados.  
   - Filtro para buscar plazas por número.

3. **Base de Datos**  
   - Colección de usuarios autenticados.  
   - Colección de plazas de parking.  
   - Relación entre ambas colecciones: una plaza se asigna a un usuario.  

---

## **Tecnologías Utilizadas**
- **Backend**  
  - Node.js  
  - Express.js  
  - MongoDB (a través de Mongoose)  
  - JWT (JSON Web Token)  
  - Bcrypt.js (para hashear contraseñas)  

- **Frontend**  
  - HTML5  
  - CSS (con Tailwind CSS)  
  - JavaScript Vanilla  

- **Herramientas de Desarrollo**  
  - Visual Studio Code  
  - Postman (para pruebas de API)  
  - Git y GitHub (control de versiones)  

---

## **Estructura del Proyecto**

ProyectoParking/
│
├── backend/
│   ├── controllers/
│   │   ├── parkingController.js  # Controlador de gestión de plazas
│   │   └── userController.js     # Controlador de autenticación
│   │
│   ├── models/
│   │   ├── ParkingSpot.js        # Modelo de plazas de parking
│   │   └── user.js               # Modelo de usuario
│   │
│   ├── routes/
│   │   ├── parkingRoutes.js      # Rutas relacionadas con plazas
│   │   └── userRoutes.js         # Rutas relacionadas con autenticación
│   │
│   ├── middlewares/
│   │   └── auth.js               # Middleware para proteger rutas
│   │
│   ├── .env                      # Configuración de variables de entorno
│   ├── server.js                 # Configuración principal del servidor
│   └── package.json              # Dependencias y scripts del proyecto
│
├── frontend/
│   ├── index.html


---

## Diagrama de Arquitectura

![Diagrama de Arquitectura](./diagrama.png)


## **Explicación de la Implementación**

1. **Autenticación y Seguridad**  
   - Se utiliza **JWT** (JSON Web Token) para autenticar a los usuarios.  
   - Al iniciar sesión, se genera un token que contiene el **ID del usuario** y su **nombre de usuario**.
   - Este token se envía al cliente y se almacena en el **localStorage**.
   - El middleware `auth.js` verifica la validez del token y permite proteger rutas que requieren autenticación.

2. **Gestión de Plazas**  
   - El servidor utiliza **Express** para gestionar las solicitudes HTTP.
   - **Controladores**:
     - `createSpot`: Crea nuevas plazas si no existen.
     - `listSpots`: Devuelve todas las plazas existentes con el estado de asignación y los usuarios asociados.
     - `assignSpot`: Asigna una plaza a un usuario autenticado. Verifica que:
       - El usuario no tenga ya una plaza asignada.
       - La plaza seleccionada esté disponible.  
   - Los datos de las plazas se almacenan en la base de datos **MongoDB** a través del modelo `ParkingSpot`.

3. **Base de Datos**  
   - Se utilizan **dos colecciones** en MongoDB:
     - **Users**: Contiene los datos de los usuarios registrados, como `username` y la contraseña **hasheada** mediante **bcryptjs**.
     - **ParkingSpots**: Almacena las plazas de parking con el número de plaza, estado (`isAssigned`) y el ID del usuario que tiene asignada la plaza.  
   - Se establece una **relación** entre ambas colecciones a través de la referencia (`user` en `ParkingSpot`).

4. **Frontend**  
   - Se han desarrollado tres páginas HTML principales:  
     - **Registro** (`index.html`): Permite a los usuarios registrarse.  
     - **Login** (`login.html`): Facilita la autenticación y guarda el token JWT en el navegador.  
     - **Dashboard** (`dashboard.html`):  
       - Muestra un listado de plazas (disponibles y asignadas).  
       - Permite agregar nuevas plazas y asignar plazas libres al usuario autenticado.  
   - **Interacción con el Backend**:
     - Se utiliza **`fetch()`** para realizar solicitudes HTTP al servidor.
     - El token JWT se incluye en los headers (`Authorization`) para acceder a rutas protegidas.

5. **Flujo de Trabajo**  
   - El usuario accede a la página de **registro** o **inicio de sesión**.
   - Una vez autenticado, el usuario es redirigido a la página **Dashboard**.
   - En el **Dashboard**, el usuario puede:  
     - Ver todas las plazas disponibles y asignadas.  
     - Asignarse una plaza libre.  
     - Crear nuevas plazas si es necesario.  
   - Toda la información se almacena y se actualiza en la base de datos MongoDB, mientras el servidor asegura la **validación** y **protección** de las rutas.
