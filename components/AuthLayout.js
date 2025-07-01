// Componente de diseño para las páginas de autenticación
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        {children}
      </div>
    </div>
  );
};

// Exponemos el componente globalmente
window.AuthLayout = AuthLayout;