require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

// Middleware CORS: debe ir antes que cualquier otro middleware o ruta
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Origen permitido
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    // Respuesta rápida para preflight
    return res.sendStatus(204);
  }

  next();
});

const PORT = process.env.PORT || 5001; // Cambiado a 5001 ya que el puerto 5000 está en uso por otro servicio

// No necesitamos un manejador explícito de OPTIONS ya que cors() lo maneja automáticamente

app.use(express.json());

// Configuración de la base de datos para MariaDB en XAMPP
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'receipts_db',
  port: process.env.DB_PORT || 4306, // Puerto de MariaDB en XAMPP
  socketPath: process.env.DB_SOCKET || '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock', // Socket de MariaDB en XAMPP
  // Configuraciones específicas para MariaDB
  supportBigNumbers: true,
  bigNumberStrings: true,
  dateStrings: true // Para manejar fechas como strings y evitar problemas de zona horaria
};


// Conexión a la base de datos MariaDB
let connection;
async function connectDB() {
  try {
    console.log('Intentando conectar a la base de datos MariaDB con configuración:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port,
      socketPath: dbConfig.socketPath ? 'Configurado' : 'No configurado'
    });
    
    // Intentar primero con socket si está disponible
    try {
      connection = await mysql.createConnection(dbConfig);
      console.log('Conectado a la base de datos MariaDB exitosamente');
    } catch (socketError) {
      console.warn('Error al conectar usando socket, intentando con TCP/IP:', socketError.message);
      
      // Si falla con socket, intentar sin socketPath
      const tcpConfig = {...dbConfig};
      delete tcpConfig.socketPath;
      connection = await mysql.createConnection(tcpConfig);
      console.log('Conectado a la base de datos MariaDB usando TCP/IP');
    }
    
    // Verificar la conexión con una consulta simple
    const [result] = await connection.query('SELECT VERSION() as version');
    console.log(`Versión de la base de datos: ${result[0].version}`);
  } catch (error) {
    console.error('Error al conectar a la base de datos MariaDB:', error);
    console.log('Reintentando conexión en 5 segundos...');
    setTimeout(connectDB, 5000); // Reintentar conexión
  }
}
connectDB();

// Configuración de multer para almacenar archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Permitir solo PDFs
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // Limitar a 5MB
});

// Middleware para verificar autenticación
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'No autorizado' });
  
  try {
    // En un entorno real, verificaríamos el token JWT
    // Por ahora, decodificamos el token simulado (que es el ID de usuario)
    const userId = token;
    
    // Verificar que la conexión a la base de datos esté activa
    if (!connection) {
      console.log('Error: No hay conexión a la base de datos en authenticateToken');
      try {
        await connectDB(); // Intentar reconectar
        if (!connection) {
          return res.status(503).json({ message: 'Servicio temporalmente no disponible. Intente más tarde.' });
        }
      } catch (connError) {
        console.error('Error al reconectar en authenticateToken:', connError);
        return res.status(503).json({ message: 'Servicio temporalmente no disponible. Intente más tarde.' });
      }
    }
    
    // Buscar usuario en la base de datos
    try {
      const [users] = await connection.execute(
        'SELECT user_id, username, role FROM users WHERE user_id = ?',
        [userId]
      );
      
      if (users.length === 0) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }
      
      const user = users[0];
      req.user = {
        id: user.user_id,
        username: user.username,
        role: user.role
      };
      next();
    } catch (dbError) {
      console.error('Error al verificar token:', dbError);
      
      // Intentar reconectar si hay un error de conexión
      if (dbError.code === 'PROTOCOL_CONNECTION_LOST' || 
          dbError.code === 'ECONNRESET' || 
          dbError.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
        console.log('Reconectando a la base de datos en authenticateToken...');
        try {
          await connectDB();
          // Reintentar la consulta
          const [users] = await connection.execute(
            'SELECT user_id, username, role FROM users WHERE user_id = ?',
            [userId]
          );
          
          if (users.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
          }
          
          const user = users[0];
          req.user = {
            id: user.user_id,
            username: user.username,
            role: user.role
          };
          next();
        } catch (retryError) {
          console.error('Error al reintentar verificación de token:', retryError);
          return res.status(500).json({ message: 'Error al verificar autenticación' });
        }
      } else {
        return res.status(500).json({ message: 'Error al verificar autenticación' });
      }
    }
  } catch (error) {
    console.error('Error al procesar token:', error);
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Middleware para verificar rol de administrador
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado: se requiere rol de administrador' });
  }
};

// Rutas
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Ruta para autenticación de usuarios
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Recibida petición de login:', req.body);
    const { username, password } = req.body;
    
    if (!username || !password) {
      console.log('Error: Faltan campos requeridos');
      return res.status(400).json({ message: 'Se requiere nombre de usuario y contraseña' });
    }
    
    // Verificar que la conexión a la base de datos esté activa
    if (!connection) {
      console.log('Error: No hay conexión a la base de datos');
      await connectDB(); // Intentar reconectar
      if (!connection) {
        return res.status(503).json({ message: 'Servicio temporalmente no disponible. Intente más tarde.' });
      }
    }
    
    // Buscar usuario en la base de datos
    console.log('Buscando usuario en la base de datos:', username);
    let users;
    try {
      [users] = await connection.execute(
        'SELECT user_id, username, password, role FROM users WHERE username = ?',
        [username]
      );
    } catch (dbError) {
      console.error('Error al consultar usuario:', dbError);
      // Intentar reconectar si hay un error de conexión
      if (dbError.code === 'PROTOCOL_CONNECTION_LOST' || 
          dbError.code === 'ECONNRESET' || 
          dbError.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
        console.log('Reconectando a la base de datos...');
        await connectDB();
        // Reintentar la consulta
        [users] = await connection.execute(
          'SELECT user_id, username, password, role FROM users WHERE username = ?',
          [username]
        );
      } else {
        throw dbError; // Relanzar otros errores
      }
    }
    
    console.log('Resultado de la búsqueda:', users);
    
    if (users.length === 0) {
      console.log('Error: Usuario no encontrado');
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
    
    const user = users[0];
    console.log('Usuario encontrado:', { id: user.user_id, username: user.username, role: user.role });
    
    // En un entorno de producción, deberíamos comparar hashes de contraseñas
    // Por ahora, comparamos directamente (asumiendo que están en texto plano en la DB)
    console.log('Comparando contraseñas:', { recibida: password, almacenada: user.password });
    if (user.password !== password) {
      console.log('Error: Contraseña incorrecta');
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
    
    // Actualizar último login
    try {
      await connection.execute(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?',
        [user.user_id]
      );
    } catch (updateError) {
      // No bloqueamos el login si falla la actualización del último acceso
      console.warn('No se pudo actualizar el último acceso:', updateError);
    }
    
    // En un entorno real, generaríamos un token JWT
    // Por ahora, enviamos la información del usuario
    const respuesta = {
      id: user.user_id,
      username: user.username,
      isAdmin: user.role === 'admin'
    };
    console.log('Login exitoso, enviando respuesta:', respuesta);
    res.json(respuesta);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
});

// Ruta para subir recibos (solo admin)
app.post('/api/receipts', authenticateToken, isAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha proporcionado ningún archivo' });
    }

    const { name, amount, category } = req.body;
    if (!name || !amount || !category) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }
    
    // Verificar que la conexión a la base de datos esté activa
    if (!connection) {
      console.log('Error: No hay conexión a la base de datos');
      await connectDB(); // Intentar reconectar
      if (!connection) {
        // Eliminar el archivo subido si no podemos guardar en la base de datos
        if (req.file && req.file.path) {
          try {
            fs.unlinkSync(req.file.path);
            console.log(`Archivo eliminado: ${req.file.path}`);
          } catch (unlinkError) {
            console.error('Error al eliminar archivo:', unlinkError);
          }
        }
        return res.status(503).json({ message: 'Servicio temporalmente no disponible. Intente más tarde.' });
      }
    }

    const receiptId = uuidv4();
    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const fileSize = req.file.size;
    const mimeType = req.file.mimetype;
    const userId = req.user.id;

    // Guardar en la base de datos
    try {
      const [result] = await connection.execute(
        'INSERT INTO receipts (receipt_id, name, amount, category, file_name, file_path, file_size, mime_type, user_id, upload_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
        [receiptId, name, parseFloat(amount), category, fileName, filePath, fileSize, mimeType, userId]
      );
      
      console.log('Recibo guardado en la base de datos:', { receiptId, name, category });
      
      res.status(201).json({
        id: receiptId,
        name,
        amount: parseFloat(amount),
        category,
        date: new Date().toISOString().split('T')[0],
        userId,
        username: req.user.username,
        filePath
      });
    } catch (dbError) {
      console.error('Error al guardar recibo en la base de datos:', dbError);
      
      // Eliminar el archivo subido si no podemos guardar en la base de datos
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
          console.log(`Archivo eliminado: ${req.file.path}`);
        } catch (unlinkError) {
          console.error('Error al eliminar archivo:', unlinkError);
        }
      }
      
      // Intentar reconectar si hay un error de conexión
      if (dbError.code === 'PROTOCOL_CONNECTION_LOST' || 
          dbError.code === 'ECONNRESET' || 
          dbError.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
        console.log('Reconectando a la base de datos...');
        await connectDB();
        // No reintentamos la inserción para evitar duplicados
      }
      
      throw dbError; // Relanzar el error para que lo maneje el catch general
    }
  } catch (error) {
    console.error('Error al subir recibo:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
});

// Ruta para obtener recibos (filtrados por rol)
app.get('/api/receipts', authenticateToken, async (req, res) => {
  try {
    let query;
    let params = [];
    
    // Filtrar según el rol del usuario
    if (req.user.role === 'admin') {
      // Los administradores pueden ver todos los recibos
      query = `
        SELECT r.receipt_id as id, r.name, r.amount, r.category, 
               DATE_FORMAT(r.upload_date, '%Y-%m-%d') as date, 
               r.user_id as userId, u.username 
        FROM receipts r 
        JOIN users u ON r.user_id = u.user_id 
        ORDER BY r.upload_date DESC
      `;
    } else {
      // Los usuarios normales solo ven sus propios recibos
      query = `
        SELECT r.receipt_id as id, r.name, r.amount, r.category, 
               DATE_FORMAT(r.upload_date, '%Y-%m-%d') as date, 
               r.user_id as userId, u.username 
        FROM receipts r 
        JOIN users u ON r.user_id = u.user_id 
        WHERE r.user_id = ? 
        ORDER BY r.upload_date DESC
      `;
      params.push(req.user.id);
    }
    
    try {
      const [receipts] = await connection.execute(query, params);
      res.json(receipts);
    } catch (queryError) {
      console.error('Error en la consulta SQL:', queryError);
      
      // Si hay un error con DATE_FORMAT (que es compatible con MySQL y MariaDB), intentar con una versión alternativa
      if (queryError.message && queryError.message.includes('DATE_FORMAT')) {
        console.log('Intentando consulta alternativa para compatibilidad con MariaDB...');
        
        // Versión alternativa usando CONVERT o FORMAT
        let altQuery;
        if (req.user.role === 'admin') {
          altQuery = `
            SELECT r.receipt_id as id, r.name, r.amount, r.category, 
                   CONVERT(VARCHAR(10), r.upload_date, 120) as date, 
                   r.user_id as userId, u.username 
            FROM receipts r 
            JOIN users u ON r.user_id = u.user_id 
            ORDER BY r.upload_date DESC
          `;
        } else {
          altQuery = `
            SELECT r.receipt_id as id, r.name, r.amount, r.category, 
                   CONVERT(VARCHAR(10), r.upload_date, 120) as date, 
                   r.user_id as userId, u.username 
            FROM receipts r 
            JOIN users u ON r.user_id = u.user_id 
            WHERE r.user_id = ? 
            ORDER BY r.upload_date DESC
          `;
        }
        
        const [altReceipts] = await connection.execute(altQuery, params);
        res.json(altReceipts);
      } else {
        // Si es otro tipo de error, relanzarlo
        throw queryError;
      }
    }
  } catch (error) {
    console.error('Error al obtener recibos:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
});

// Ruta para descargar un recibo
app.get('/api/receipts/:id/download', authenticateToken, async (req, res) => {
  try {
    const receiptId = req.params.id;
    
    // Verificar que la conexión a la base de datos esté activa
    if (!connection) {
      console.log('Error: No hay conexión a la base de datos');
      await connectDB(); // Intentar reconectar
      if (!connection) {
        return res.status(503).json({ message: 'Servicio temporalmente no disponible. Intente más tarde.' });
      }
    }
    
    // Buscar el recibo en la base de datos
    let query;
    let params = [receiptId];
    
    if (req.user.role !== 'admin') {
      // Los usuarios normales solo pueden descargar sus propios recibos
      query = 'SELECT * FROM receipts WHERE receipt_id = ? AND user_id = ?';
      params.push(req.user.id);
    } else {
      // Los administradores pueden descargar cualquier recibo
      query = 'SELECT * FROM receipts WHERE receipt_id = ?';
    }
    
    let receipts;
    try {
      [receipts] = await connection.execute(query, params);
    } catch (dbError) {
      console.error('Error al consultar recibo:', dbError);
      // Intentar reconectar si hay un error de conexión
      if (dbError.code === 'PROTOCOL_CONNECTION_LOST' || 
          dbError.code === 'ECONNRESET' || 
          dbError.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
        console.log('Reconectando a la base de datos...');
        await connectDB();
        // Reintentar la consulta
        [receipts] = await connection.execute(query, params);
      } else {
        throw dbError; // Relanzar otros errores
      }
    }
    
    if (receipts.length === 0) {
      return res.status(404).json({ message: 'Recibo no encontrado o no tienes permiso para acceder a él' });
    }
    
    const receipt = receipts[0];
    const filePath = receipt.file_path;
    
    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }
    
    // Configurar headers para descarga
    res.setHeader('Content-Type', receipt.mime_type || 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${receipt.file_name}"`);
    
    // Enviar el archivo
    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', (err) => {
      console.error('Error al leer el archivo:', err);
      // Solo enviar respuesta de error si no se ha enviado ya
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error al leer el archivo' });
      }
    });
    
    fileStream.pipe(res);
    
    // Registrar la descarga en los logs (opcional)
    try {
      const logId = uuidv4();
      await connection.execute(
        'INSERT INTO access_logs (log_id, user_id, receipt_id, action, log_date) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)',
        [logId, req.user.id, receiptId, 'download']
      );
    } catch (logError) {
      console.error('Error al registrar log de descarga:', logError);
      // No interrumpimos la descarga si falla el registro del log
    }
  } catch (error) {
    console.error('Error al descargar recibo:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
  }
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
  // No cerramos el proceso para poder ver el error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
  // No cerramos el proceso para poder ver el error
});

// Iniciar el servidor con manejo de errores mejorado
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('IMPORTANTE: Mantenga esta ventana abierta para que el servidor siga funcionando');
});

server.on('error', (error) => {
  console.error('Error en el servidor:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`El puerto ${PORT} ya está en uso. Intentando con otro puerto...`);
    // Intentar con otro puerto dinámico
    const newPort = PORT + 1;
    console.log(`Intentando con el puerto ${newPort}...`);
    setTimeout(() => {
      server.close();
      server.listen(newPort, () => {
        console.log(`Server running on port ${newPort}`);
        console.log('IMPORTANTE: Mantenga esta ventana abierta para que el servidor siga funcionando');
        // Actualizar la variable PORT para que los logs sean correctos
        PORT = newPort;
      });
    }, 1000);
  }
});

// Mantener el proceso vivo
setInterval(() => {
  console.log(`Servidor sigue activo en http://localhost:${PORT}`);
}, 60000); // Log cada minuto para confirmar que sigue activo