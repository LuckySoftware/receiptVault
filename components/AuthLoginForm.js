// Componente de formulario de inicio de sesión
const AuthLoginForm = ({ onLogin, onNavigateToRegister }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleLogin = () => {
    if (!username || !password) {
      setError('¡Échale ganas! Ambos campos son obligatorios.');
      return;
    }
    setError('');
    onLogin(username, password);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800">¡Bienvenido de nuevo!</h2>
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
          ¡Regístrate aquí!
        </button>
      </p>
    </div>
  );
};

export default AuthLoginForm;