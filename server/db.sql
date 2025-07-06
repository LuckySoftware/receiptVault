CREATE DATABASE receipts_db;
USE receipts_db;

-- Tabla de Usuarios
CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- En producción almacenar hash de contraseña
    email VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'user',  -- 'user' o 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Tabla de Recibos (sin almacenar archivos binarios)
CREATE TABLE receipts (
    receipt_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,         -- Nombre descriptivo del recibo
    amount DECIMAL(10,2) NOT NULL,      -- Monto del recibo
    category VARCHAR(50) NOT NULL,      -- Categoría del recibo
    file_name VARCHAR(255) NOT NULL,    -- Nombre original del archivo
    file_path VARCHAR(255) NOT NULL,    -- Ruta en el servidor o almacenamiento
    file_size INT,                      -- Tamaño en bytes
    mime_type VARCHAR(100) DEFAULT 'application/pdf', -- Tipo MIME para servir el archivo
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tabla para logs de accesos y acciones (opcional)
CREATE TABLE access_logs (
    log_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    receipt_id VARCHAR(36) NOT NULL,
    action VARCHAR(50) NOT NULL,  -- 'view', 'download', 'upload', 'delete'
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (receipt_id) REFERENCES receipts(receipt_id) ON DELETE CASCADE
);

-- Insertar usuarios de prueba
INSERT INTO users (user_id, username, password, email, role) VALUES
('user-1', 'user', 'password', 'user@example.com', 'user'),
('admin-1', 'admin', 'admin', 'admin@example.com', 'admin');
