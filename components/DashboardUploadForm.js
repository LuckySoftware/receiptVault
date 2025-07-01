// Componente de formulario de carga de recibos
const DashboardUploadForm = ({ onUploadReceipt }) => {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [fileName, setFileName] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setFileName(file.name);
      setError('');
    } else {
      setSelectedFile(null);
      setFileName('');
      setError('¡Aguas! Solo se permiten archivos PDF.');
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setError('¡No se te olvide seleccionar un archivo!');
      return;
    }
    setError('');
    setSuccess('');
    onUploadReceipt(selectedFile);
    setSelectedFile(null);
    setFileName('');
    setSuccess('¡Recibo subido con éxito! ¡Qué chido!');
    setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">Sube tu Recibo</h3>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative" role="alert">{success}</div>}
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="receipt-upload">
          Selecciona un archivo PDF
        </label>
        <input
          type="file"
          id="receipt-upload"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex items-center space-x-3">
          <button
            onClick={() => document.getElementById('receipt-upload').click()}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Elegir Archivo
          </button>
          <span className="text-gray-600 text-sm truncate">
            {fileName || 'Ningún archivo seleccionado'}
          </span>
        </div>
      </div>
      <button
        onClick={handleUpload}
        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
        disabled={!selectedFile}
      >
        Subir Recibo
      </button>
    </div>
  );
};

export default DashboardUploadForm;