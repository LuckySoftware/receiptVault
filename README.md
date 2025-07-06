# ReceiptVault

Aplicación para gestionar y almacenar recibos digitales con control de roles (administrador y usuario).

## Estructura del Proyecto

- `client/`: Frontend React con TailwindCSS
- `server/`: Backend Express con almacenamiento de archivos
- `components/`: Componentes React reutilizables

## Características

- Autenticación de usuarios con roles (admin/user)
- Subida de recibos en PDF (solo administradores)
- Visualización de recibos según rol
- Descarga de recibos
- Almacenamiento de metadatos en base de datos SQL
- Almacenamiento de archivos en disco

## Requisitos

- Node.js (versión LTS recomendada)
- npm (Node Package Manager)
- MySQL o MariaDB (para la base de datos)

### Instalación

#### Backend

```bash
cd server
npm install
# Configurar variables de entorno en .env
npm run dev
```

#### Frontend

```bash
cd client
npm install
npm start
```

## Uso

- **Administrador**: Puede subir, ver y descargar todos los recibos
  - Usuario: `admin`
  - Contraseña: `admin`

- **Usuario**: Solo puede ver y descargar sus propios recibos
  - Usuario: `user`
  - Contraseña: `password`










## Configuración de la Base de Datos

El backend se conecta a MySQL/MariaDB usando la configuración proporcionada en el archivo `.env`. Asegúrate de que tu servidor de base de datos esté en funcionamiento.

## Endpoints de la API

La API del backend proporciona los siguientes endpoints:

- `GET /api/receipts`: Obtener recibos (filtrados según el rol del usuario).
- `POST /api/receipts`: Crear un nuevo recibo (solo administradores).
- `GET /api/receipts/:id/download`: Descargar un recibo específico.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.