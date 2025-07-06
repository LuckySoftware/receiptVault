const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la base de datos para MariaDB en XAMPP
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'receipts_db',
  port: process.env.DB_PORT || 4306,
  socketPath: process.env.DB_SOCKET || '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock',
  // Configuraciones específicas para MariaDB
  supportBigNumbers: true,
  bigNumberStrings: true,
  dateStrings: true
};

async function testMariaDBConnection() {
  console.log('=== Test de conexión a MariaDB ===');
  console.log('Configuración:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    port: dbConfig.port,
    socketPath: dbConfig.socketPath ? 'Configurado' : 'No configurado'
  });
  
  let connection;
  
  try {
    // Intentar primero con socket si está disponible
    console.log('\nIntentando conectar usando socket...');
    try {
      connection = await mysql.createConnection(dbConfig);
      console.log('✅ Conexión exitosa usando socket');
    } catch (socketError) {
      console.warn('❌ Error al conectar usando socket:', socketError.message);
      
      // Si falla con socket, intentar sin socketPath
      console.log('\nIntentando conectar usando TCP/IP...');
      const tcpConfig = {...dbConfig};
      delete tcpConfig.socketPath;
      connection = await mysql.createConnection(tcpConfig);
      console.log('✅ Conexión exitosa usando TCP/IP');
    }
    
    // Verificar la versión de la base de datos
    console.log('\nVerificando versión de la base de datos...');
    const [versionResult] = await connection.query('SELECT VERSION() as version');
    console.log(`✅ Versión de la base de datos: ${versionResult[0].version}`);
    
    // Verificar si es MariaDB o MySQL
    console.log('\nVerificando tipo de base de datos...');
    const [typeResult] = await connection.query("SELECT @@version_comment as comment");
    const dbType = typeResult[0].comment.toLowerCase().includes('mariadb') ? 'MariaDB' : 'MySQL';
    console.log(`✅ Tipo de base de datos: ${dbType}`);
    
    // Probar consulta a la tabla de usuarios
    console.log('\nProbando consulta a la tabla de usuarios...');
    const [users] = await connection.execute('SELECT user_id, username, role FROM users LIMIT 5');
    console.log(`✅ Consulta exitosa. Se encontraron ${users.length} usuarios:`);
    users.forEach(user => {
      console.log(`  - ID: ${user.user_id}, Username: ${user.username}, Role: ${user.role}`);
    });
    
    // Probar consulta con DATE_FORMAT
    console.log('\nProbando consulta con DATE_FORMAT...');
    try {
      const [dateFormatResult] = await connection.execute(
        "SELECT DATE_FORMAT(NOW(), '%Y-%m-%d') as formatted_date"
      );
      console.log(`✅ DATE_FORMAT funciona correctamente: ${dateFormatResult[0].formatted_date}`);
    } catch (dateFormatError) {
      console.error('❌ Error con DATE_FORMAT:', dateFormatError.message);
      console.log('Intentando alternativa...');
      
      try {
        const [convertResult] = await connection.execute(
          "SELECT CONVERT(VARCHAR(10), NOW(), 120) as formatted_date"
        );
        console.log(`✅ CONVERT funciona como alternativa: ${convertResult[0].formatted_date}`);
      } catch (convertError) {
        console.error('❌ Error con CONVERT:', convertError.message);
        console.log('Intentando otra alternativa...');
        
        const [simpleResult] = await connection.execute(
          "SELECT DATE(NOW()) as formatted_date"
        );
        console.log(`✅ DATE funciona como alternativa: ${simpleResult[0].formatted_date}`);
      }
    }
    
    console.log('\n=== Resumen ===');
    console.log('✅ La conexión a la base de datos funciona correctamente');
    console.log(`✅ Tipo de base de datos: ${dbType}`);
    console.log(`✅ Se puede acceder a los datos de usuarios`);
    console.log('✅ Test completado con éxito');
    
  } catch (error) {
    console.error('\n❌ Error general en la prueba de conexión:', error);
    console.log('\n=== Resumen ===');
    console.log('❌ La prueba de conexión ha fallado');
    console.log(`❌ Error: ${error.message}`);
  } finally {
    if (connection) {
      console.log('\nCerrando conexión...');
      await connection.end();
      console.log('✅ Conexión cerrada correctamente');
    }
  }
}

// Ejecutar la prueba
testMariaDBConnection().catch(error => {
  console.error('Error no capturado:', error);
});