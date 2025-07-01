// Componente de panel de usuario
import DashboardUploadForm from './DashboardUploadForm.js';
import DashboardReceiptList from './DashboardReceiptList.js';

const DashboardUserPanel = ({ receipts, onUploadReceipt, onDownloadReceipt }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
      <DashboardUploadForm onUploadReceipt={onUploadReceipt} />
      <DashboardReceiptList receipts={receipts} onDownloadReceipt={onDownloadReceipt} isAdminView={false} />
    </div>
  );
};

export default DashboardUserPanel;