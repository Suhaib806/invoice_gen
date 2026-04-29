import React from 'react';
import type { InvoiceData } from './types';
import InvoiceForm from './InvoiceForm';
import InvoicePreview from './InvoicePreview';

interface InvoiceFormWithPreviewProps {
  invoiceData: InvoiceData;
  setInvoiceData: (data: InvoiceData) => void;
  labels: any;
  setLabels: any;
  editingLabel: any;
  setEditingLabel: any;
  handleLabelChange: any;
  handleLabelBlur: any;
  handleLabelKeyDown: any;
  addItem: any;
  updateItem: any;
  removeItem: any;
  calculateSubtotal: any;
  calculateTax: any;
  calculateTotal: any;
  formatCurrency: any;
  handleSubmit: any;
  showConfirmation: boolean;
  currency: string;
  setCurrency: (currency: string) => void;
  logoDataUrl: string | undefined;
  setLogoDataUrl: (url: string | undefined) => void;
}

const InvoiceFormWithPreview: React.FC<InvoiceFormWithPreviewProps> = ({
  invoiceData,
  setInvoiceData,
  labels,
  setLabels,
  editingLabel,
  setEditingLabel,
  handleLabelChange,
  handleLabelBlur,
  handleLabelKeyDown,
  addItem,
  updateItem,
  removeItem,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  formatCurrency,
  handleSubmit,
  showConfirmation,
  currency,
  setCurrency,
  logoDataUrl,
  setLogoDataUrl,
}) => {


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left side - Form */}
      <div className="space-y-6">
        <InvoiceForm
          invoiceData={invoiceData}
          setInvoiceData={setInvoiceData}
          labels={labels}
          setLabels={setLabels}
          editingLabel={editingLabel}
          setEditingLabel={setEditingLabel}
          handleLabelChange={handleLabelChange}
          handleLabelBlur={handleLabelBlur}
          handleLabelKeyDown={handleLabelKeyDown}
          addItem={addItem}
          updateItem={updateItem}
          removeItem={removeItem}
          calculateSubtotal={calculateSubtotal}
          calculateTax={calculateTax}
          calculateTotal={calculateTotal}
          formatCurrency={formatCurrency}
          handleSubmit={handleSubmit}
          showConfirmation={showConfirmation}
          currency={currency}
          setCurrency={setCurrency}
          logoDataUrl={logoDataUrl}
          setLogoDataUrl={setLogoDataUrl}
        />
      </div>

      {/* Right side - Preview */}
      <div className="space-y-6">
        <div className="sticky top-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Preview</h2>
          <InvoicePreview
            invoiceData={invoiceData}
            formatCurrency={formatCurrency}
            logoDataUrl={logoDataUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceFormWithPreview; 