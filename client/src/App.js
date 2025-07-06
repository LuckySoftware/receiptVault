import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext, StrictMode } from 'react';

// /components/AuthLayout.js
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        {children}
      </div>
    </div>
  );
};

// /components/AuthLoginForm.js
const AuthLoginForm = ({ onLogin, onNavigateToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!username || !password) {
      setError('Ambos campos son obligatorios.');
      return;
    }
    setError('');
    onLogin(username, password);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800">Bienvenido a ReceiptVault</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">{error}</div>}
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
          Usuario
        </label>
        <input
          type="text"
          id="username"
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
          placeholder="Tu nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
          placeholder="Tu contraseña secreta"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        onClick={handleLogin}
        className="w-full mt-3 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
      >
        Iniciar Sesión
      </button>
      <p className="text-center text-gray-600 text-sm">
        ¿No tienes cuenta?{' '}
        <button onClick={onNavigateToRegister} className="text-black font-semibold hover:underline">
          Registrarse
        </button>
      </p>
    </div>
  );
};

// /components/AuthRegisterForm.js
const AuthRegisterForm = ({ onRegister, onNavigateToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = () => {
    if (!username || !password) {
      setError('Ambos campos son obligatorios.');
      return;
    }
    setError('');
    onRegister(username, password);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800">Crear Cuenta</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">{error}</div>}
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="reg-username">
          Usuario
        </label>
        <input
          type="text"
          id="reg-username"
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
          placeholder="Elige un nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="reg-password">
          Contraseña
        </label>
        <input
          type="password"
          id="reg-password"
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
          placeholder="Crea una contraseña segura"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        onClick={handleRegister}
        className="w-full mt-3 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
      >
        Registrarse
      </button>
      <p className="text-center text-gray-600 text-sm">
        ¿Ya tienes cuenta?{' '}
        <button onClick={onNavigateToLogin} className="text-black font-semibold hover:underline">
          Inicia Sesión
        </button>
      </p>
    </div>
  );
};

// /components/DashboardHeader.js
const DashboardHeader = ({ username, onLogout }) => {
  return (
    <header className="w-full bg-white shadow-md p-4 flex justify-between items-center rounded-b-2xl">
      <h1 className="text-2xl font-bold text-gray-800">ReceiptVault</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 font-medium hidden sm:block">Hola, {username}</span>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

// /components/DashboardReceiptList.js
const DashboardReceiptList = ({ receipts, onDownloadReceipt, isAdminView }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        {isAdminView ? 'Todos los Recibos del Sistema' : 'Mis Recibos'}
      </h3>
      {receipts.length === 0 ? (
        <p className="text-gray-600 text-center py-8">
          {isAdminView ? 'Aún no hay recibos, sube el primero' : 'Aún no hay recibos disponibles'}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                {isAdminView && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {receipts.map((receipt) => (
                <tr key={receipt.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {receipt.name}
                  </td>
                  {isAdminView && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {receipt.username}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {receipt.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${receipt.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {receipt.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onDownloadReceipt(receipt.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Descargar
                    </button>
                    {isAdminView && (
                      <button
                        onClick={() => console.log('Eliminar', receipt.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// /components/DashboardUploadForm.js
const DashboardUploadForm = ({ onUploadReceipt }) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !name || !amount || !category) {
      setError('¡Faltan campos! Asegúrate de llenar todo.');
      return;
    }
    setError('');
    onUploadReceipt({ file, name, amount: parseFloat(amount), category });
    setFile(null);
    setName('');
    setAmount('');
    setCategory('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Sube un Nuevo Recibo</h3>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="receipt-file">
            Archivo del Recibo
          </label>
          <input
            type="file"
            id="receipt-file"
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="receipt-name">
            Nombre del Recibo
          </label>
          <input
            type="text"
            id="receipt-name"
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
            placeholder="Ej. Recibo ..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="receipt-amount">
            Monto
          </label>
          <input
            type="number"
            id="receipt-amount"
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
            placeholder="Ej. 123.45"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="receipt-category">
            Categoría
          </label>
          <select
            id="receipt-category"
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Selecciona una categoría</option>
            <option value="Sueldo">Sueldo</option>
            <option value="Aguinaldo">Aguinaldo</option>
            <option value="SalarioVacacional">Salario vacacional</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
        >
          Subir Recibo
        </button>
      </form>
    </div>
  );
};

// /components/DashboardAdminControls.js
const DashboardAdminControls = ({ onToggleAdminView }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Controles de Administrador</h3>
      <button
        onClick={onToggleAdminView}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
      >
        Ver Todos los Recibos
      </button>
    </div>
  );
};

// /pages/AuthPage.js
const AuthPage = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);

  const handleLogin = async (username, password) => {
    console.log('Login:', username, password);
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar sesión');
      }
      
      const userData = await response.json();
      onLoginSuccess({
        id: userData.id,
        username: userData.username,
        isAdmin: userData.isAdmin
      });
    } catch (error) {
      console.error('Error de login:', error);
      alert('Credenciales incorrectas. Intenta de nuevo.');
    }
  };

  const handleRegister = (username, password) => {
    console.log('Register:', username, password);
    // Simulate API call
    setTimeout(() => {
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      setIsRegister(false);
    }, 1000);
  };

  return (
    <AuthLayout>
      {isRegister ? (
        <AuthRegisterForm onRegister={handleRegister} onNavigateToLogin={() => setIsRegister(false)} />
      ) : (
        <AuthLoginForm onLogin={handleLogin} onNavigateToRegister={() => setIsRegister(true)} />
      )}
    </AuthLayout>
  );
};

// /pages/DashboardPage.js
const DashboardPage = ({ user, onLogout }) => {
  const [receipts, setReceipts] = useState([]);
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    // Función para obtener recibos del backend
    const fetchReceipts = async () => {
      try {
        // Obtener token (ID de usuario) del localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        const token = userData.id;
        
        // Realizar solicitud al backend
        const response = await fetch('http://localhost:5001/api/receipts', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Error al obtener los recibos');
        }
        
        const data = await response.json();
        
        // Filtrar según el rol y vista
        if (user.isAdmin && isAdminView) {
          setReceipts(data);
        } else {
          setReceipts(data.filter(r => r.username === user.username));
        }
      } catch (error) {
        console.error('Error:', error);
        // Usar datos de respaldo en caso de error
        const backupReceipts = [
          { id: 1, name: 'Supermercado', date: '2023-01-15', amount: 75.50, category: 'Sueldo', userId: 'user1', username: 'user' },
          { id: 2, name: 'Gasolina', date: '2023-01-10', amount: 40.00, category: 'SalarioVacacional', userId: 'user1', username: 'user' },
          { id: 3, name: 'Cena', date: '2023-01-05', amount: 120.00, category: 'Aguinaldo', userId: 'user2', username: 'admin' },
        ];
        
        if (user.isAdmin && isAdminView) {
          setReceipts(backupReceipts);
        } else {
          setReceipts(backupReceipts.filter(r => r.username === user.username));
        }
      }
    };
    
    fetchReceipts();
  }, [user, isAdminView]);

const handleUploadReceipt = async (file, name, amount, category) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('amount', amount);
    formData.append('category', category);

    const response = await fetch('http://localhost:5001/api/receipts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        // ⚠️ NO INCLUYAS Content-Type, fetch lo gestiona por FormData automáticamente
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al subir el recibo: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    console.log("Recibo subido correctamente:", data);
  } catch (error) {
    console.error("Error:", error);
    setError(error.message || 'Error al subir el recibo');
  }
};


  const handleDownloadReceipt = async (id) => {
    console.log('Downloading receipt', id);
    try {
      // Obtener token (ID de usuario) del localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      const token = userData.id;
      
      // Realizar solicitud al backend para descargar el recibo
      const response = await fetch(`http://localhost:5001/api/receipts/${id}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        let errorMessage = 'Error desconocido al subir el recibo.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          // Si la respuesta no es JSON, usar el estado de la respuesta
          errorMessage = `Error al subir el recibo: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      // Crear un blob a partir de la respuesta
      const blob = await response.blob();
      
      // Crear una URL para el blob
      const url = window.URL.createObjectURL(blob);
      
      // Crear un enlace temporal para descargar el archivo
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `recibo-${id}.pdf`;
      
      // Añadir el enlace al documento y hacer clic en él
      document.body.appendChild(a);
      a.click();
      
      // Limpiar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al descargar el recibo: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <DashboardHeader username={user.username} onLogout={onLogout} />
      <main className="container mx-auto mt-6 p-4">
        {user.isAdmin && (
          <DashboardAdminControls onToggleAdminView={() => setIsAdminView(prev => !prev)} />
        )}
        {user.isAdmin && (
          <DashboardUploadForm onUploadReceipt={handleUploadReceipt} />
        )}
        <DashboardReceiptList
          receipts={receipts}
          onDownloadReceipt={handleDownloadReceipt}
          isAdminView={user.isAdmin && isAdminView}
        />
      </main>
    </div>
  );
};

// /App.js (Main Application Component)
const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing session or token
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <StrictMode>
      {user ? (
        <DashboardPage user={user} onLogout={handleLogout} />
      ) : (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      )}
    </StrictMode>
  );
};

export default App;