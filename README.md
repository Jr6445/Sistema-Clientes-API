```markdown
# Sistema de Gestión de Clientes

Este proyecto es un backend para la gestión de clientes, incluyendo sus direcciones y documentos. Está construido con Node.js y utiliza SQL Server como base de datos.

## Características

- **CRUD de Clientes**: Crear, leer, actualizar y eliminar clientes.
- **Gestión de Direcciones y Documentos**: Asociar direcciones y documentos a los clientes.
- **Registro de Auditoría**: Registra las acciones realizadas sobre los clientes en la base de datos.
- **Validación de Datos**: Se asegura la integridad de los datos a través de validaciones básicas.

---

## Requisitos Previos

- **Node.js**: Recomendado v14 o superior.
- **SQL Server**: Base de datos configurada y accesible.
- **NPM o Yarn**: Para gestionar las dependencias del proyecto.

---

## Instalación

1. **Clonar el repositorio**:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_PROYECTO>
   ```

2. **Instalar dependencias**:

   ```bash
   npm install
   ```

3. **Configurar la base de datos**:

   Crea un archivo `.env` en la raíz del proyecto con el siguiente formato:

   ```
   DB_USER=<usuario_de_bd>
   DB_PASSWORD=<contraseña_de_bd>
   DB_SERVER=<servidor_de_bd>
   DB_DATABASE=<nombre_de_la_bd>
   ```

4. **Iniciar el servidor**:

   ```bash
   npm start
   ```

   El servidor estará disponible en `http://localhost:3000`.

---

## Endpoints

### Clientes

- **GET `/clientes`**  
  Obtiene todos los clientes con sus direcciones y documentos.

- **POST `/clientes`**  
  Crea un nuevo cliente con direcciones y documentos asociados.

  **Body de ejemplo**:
  ```json
  {
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "123456789",
    "correoelectronico": "juan.perez@example.com",
    "direcciones": [
      {
        "direccion": "Calle Falsa 123",
        "ciudad": "Ciudad",
        "estado": "Estado",
        "codigopostal": "12345",
        "pais": "País"
      }
    ],
    "documentos": [
      {
        "tipodocumento": "DNI",
        "numerodocumento": "123456789"
      }
    ]
  }
  ```

- **PUT `/clientes/:id`**  
  Actualiza un cliente existente, incluyendo direcciones y documentos.

  **Body de ejemplo**: Igual al de creación.

- **DELETE `/clientes/:id`**  
  Elimina un cliente y todos sus registros asociados (direcciones y documentos).

---

## Estructura del Proyecto

```
├── config/
│   └── db.js          # Configuración de conexión a la base de datos
├── controllers/
│   └── clienteController.js # Lógica principal de los endpoints
├── routes/
│   └── clienteRoutes.js     # Rutas del backend
├── .env.example      # Ejemplo de configuración del entorno
├── app.js            # Punto de entrada de la aplicación
├── package.json      # Dependencias y scripts del proyecto
```

---

## Base de Datos

### Tablas Principales

1. **Clientes**:
   - `ClienteID` (PK)
   - `Nombre`
   - `Apellido`
   - `Telefono`
   - `CorreoElectronico`
   - `FechaCreacion`
   - `FechaActualizacion`

2. **Direcciones**:
   - `DireccionID` (PK)
   - `ClienteID` (FK)
   - `Direccion`
   - `Ciudad`
   - `Estado`
   - `CodigoPostal`
   - `Pais`

3. **Documentos**:
   - `DocumentoID` (PK)
   - `ClienteID` (FK)
   - `TipoDocumento`
   - `NumeroDocumento`

4. **Auditoría**:
   - `AuditoriaID` (PK)
   - `ClienteID`
   - `UsuarioID`
   - `Accion`
   - `Detalles`
   - `Fecha`

---

## Registro de Auditoría

El sistema registra automáticamente las siguientes acciones en la tabla de auditoría:

- **Crear**: Guarda los datos iniciales del cliente.
- **Actualizar**: Guarda los cambios realizados en un cliente.
- **Eliminar**: Registra qué cliente fue eliminado y por quién.

---

## Dependencias

- **`express`**: Framework para construir la API.
- **`mssql`**: Conexión a SQL Server.
- **`dotenv`**: Manejo de variables de entorno.
- **`body-parser`**: Procesamiento de cuerpos de solicitud.

---

## Scripts Disponibles

- **`npm start`**: Inicia el servidor en modo producción.
