# ProyectoTecnoWeb 

Proyecto académico desarrollado en **Angular 15**, que simula un **sistema de gestión hotelera** para una franquicia de hoteles.

La aplicación permite a:
- **Clientes** buscar hoteles, reservar habitaciones y gestionar sus reservas.
- **Administradores** gestionar hoteles, habitaciones y promociones.

El proyecto no utiliza backend real, toda la información se gestiona mediante **LocalStorage y SessionStorage**, simulando un entorno real de autenticación y autorización.

---

## 🚀 Tecnologías utilizadas

- Angular 15
- TypeScript
- Bootstrap 5
- CryptoJS (hash y cifrado)
- LocalStorage / SessionStorage
- Angular Router
- Guards de autenticación y autorización

---

## 👥 Roles del sistema

### Cliente
- Registro e inicio de sesión
- Visualización de hoteles
- Reserva de habitaciones
- Historial de reservas
- Modificación y cancelación de reservas
- Configuración de perfil (cambio de contraseña)
- Ajustes de la aplicación (tema oscuro)

### Administrador
- Gestión de hoteles
- Gestión de habitaciones
- Gestión de promociones
- Acceso protegido mediante guards

---

## 🔐 Seguridad (nivel académico)

- Contraseñas almacenadas mediante **hash SHA-256**
- Roles y datos sensibles cifrados con **AES (CryptoJS)**
- Control de acceso mediante **Guards**
- Token de sesión en `SessionStorage`

---

## 📦 Instalación del proyecto

Instalar las dependencias del proyecto:

    npm install

---

## ▶️ Ejecución del proyecto

Ejecutar el servidor de desarrollo:

    ng serve

o alternativamente:

    ng s

Luego abrir en el navegador:

    http://localhost:4200/

---

## 🧪 Desarrollo

Proyecto generado con **Angular CLI 15.2.11**.

Comandos útiles:

    ng generate component component-name
    ng generate service service-name
    ng generate guard nombre-del-guard
o alternativamente:

    ng g c component-name
    ng g s service-name
    ng g guard nombre-del-guard
    
---

## 📌 Notas

- Proyecto con fines **académicos**
- Enfocado en rutas, guards, autenticación y lógica de negocio en Angular

---

## ✨ Autor
Grupo Gryffindor 
Proyecto académico desarrollado con Angular 15.

