// Componente de panel de administrador
import DashboardReceiptList from './DashboardReceiptList.js';

const DashboardAdminPanel = ({ allReceipts, onDownloadReceipt }) => {
  return (
    <div className="p-8">
      <DashboardReceiptList receipts={allReceipts} onDownloadReceipt={onDownloadReceipt} isAdminView={true} />
    </div>
  );
};

export default DashboardAdminPanel;