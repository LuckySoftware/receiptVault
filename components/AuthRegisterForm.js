// Componente de formulario de registro
const AuthRegisterForm = ({ onRegister, onNavigateToLogin }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleRegister = () => {
    if (!username || !password) {
      setError('¡No te rajes! Ambos campos son obligatorios.');
      return;
    }
    setError('');
    onRegister(username, password);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800">¡Crea tu cuenta!</h2>
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
          ¡Inicia Sesión!
        </button>
      </p>
    </div>
  );
};

export default AuthRegisterForm;