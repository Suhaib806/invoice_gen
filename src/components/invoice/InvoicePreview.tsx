import React from 'react';
import type { InvoiceData } from './types';

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  formatCurrency: (amount: number) => string;
  logoDataUrl?: string | undefined;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoiceData,
  formatCurrency,
  logoDataUrl,
}) => {
  // Use custom labels from invoice data, fallback to defaults if not available
  const labels = invoiceData.labels || {
    invoiceNumber: 'Invoice Number',
    invoiceDate: 'Invoice Date',
    dueDate: 'Due Date',
    clientName: 'Client Name',
    clientEmail: 'Client Email',
    clientAddress: 'Client Address',
    items: 'Invoice Items',
    description: 'Description',
    quantity: 'Qty',
    rate: 'Rate',
    amount: 'Amount',
    tax: 'Tax',
    notes: 'Notes',
  };

  // Fallback SVG if no logoDataUrl
  const fallbackSVG = (
    <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-blue-100 dark:border-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-blue-100 dark:border-gray-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden bg-blue-50 dark:bg-gray-800">
            {logoDataUrl ? (
              <img src={logoDataUrl} alt="Company Logo" className="w-10 h-10 object-contain" />
            ) : (
              fallbackSVG
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Invoice</h1>
            <p className="text-sm text-blue-600 dark:text-purple-300 font-medium">Professional Invoicing</p>
          </div>
        </div>
        <div className="text-right">
          <span className="block text-xs text-gray-400">{labels.invoiceNumber}</span>
          <span className="block text-lg font-bold text-blue-700 dark:text-purple-300">{invoiceData.invoiceNumber}</span>
        </div>
      </div>

      {/* Bill To and Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-blue-700 dark:text-purple-300 mb-2">Bill To</h3>
          <div className="text-gray-700 dark:text-gray-300 space-y-1">
            <div className="font-semibold text-sm">{invoiceData.clientName || 'Client Name'}</div>
            <div className="text-xs">{invoiceData.clientEmail || 'client@email.com'}</div>
            <div className="whitespace-pre-line text-xs">{invoiceData.clientAddress || 'Client Address'}</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400 text-sm">{labels.invoiceDate}:</span>
            <span className="text-gray-900 dark:text-white font-medium text-sm">{invoiceData.invoiceDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400 text-sm">{labels.dueDate}:</span>
            <span className="text-gray-900 dark:text-white font-medium text-sm">{invoiceData.dueDate || 'Due Date'}</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto mb-6 rounded-lg border border-blue-100 dark:border-gray-800 bg-gradient-to-br from-blue-50/40 to-purple-50/20 dark:from-gray-800 dark:to-gray-900">
        <table className="w-full min-w-[400px]">
          <thead className="bg-blue-50 dark:bg-gray-800">
            <tr>
              <th className="px-3 py-2 text-left text-sm font-semibold text-blue-700 dark:text-purple-300">{labels.description}</th>
              <th className="px-3 py-2 text-center text-sm font-semibold text-blue-700 dark:text-purple-300">{labels.quantity}</th>
              <th className="px-3 py-2 text-right text-sm font-semibold text-blue-700 dark:text-purple-300">{labels.rate}</th>
              <th className="px-3 py-2 text-right text-sm font-semibold text-blue-700 dark:text-purple-300">{labels.amount}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100 dark:divide-gray-800">
            {invoiceData.items.map(item => (
              <tr key={item.id} className="hover:bg-blue-50/60 dark:hover:bg-gray-800/60 transition-colors">
                <td className="px-3 py-2 text-gray-900 dark:text-white text-sm">{item.description || 'Item Description'}</td>
                <td className="px-3 py-2 text-center text-gray-900 dark:text-white text-sm">{item.quantity}</td>
                <td className="px-3 py-2 text-right text-gray-900 dark:text-white text-sm">{formatCurrency(item.rate)}</td>
                <td className="px-3 py-2 text-right text-blue-700 dark:text-purple-300 font-bold text-sm">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex flex-col items-end mb-6">
        <div className="w-full max-w-xs space-y-2 bg-blue-50/60 dark:bg-gray-800/60 rounded-xl p-4 border border-blue-100 dark:border-gray-800">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Subtotal:</span>
            <span className="text-gray-900 dark:text-white font-semibold text-sm">{formatCurrency(invoiceData.items.reduce((sum, item) => sum + item.amount, 0))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400 text-sm">{labels.tax} ({invoiceData.taxRate}%):</span>
            <span className="text-gray-900 dark:text-white font-semibold text-sm">{formatCurrency(invoiceData.items.reduce((sum, item) => sum + item.amount, 0) * (invoiceData.taxRate / 100))}</span>
          </div>
          <div className="flex justify-between text-lg font-extrabold border-t border-blue-100 dark:border-gray-800 pt-2">
            <span className="text-blue-700 dark:text-purple-300">Total:</span>
            <span className="text-blue-700 dark:text-purple-300">{formatCurrency(invoiceData.items.reduce((sum, item) => sum + item.amount, 0) * (1 + invoiceData.taxRate / 100))}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoiceData.notes && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-blue-700 dark:text-purple-300 mb-2">{labels.notes}</h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line bg-blue-50/60 dark:bg-gray-800/60 rounded-lg p-3 border border-blue-100 dark:border-gray-800 text-sm">{invoiceData.notes}</p>
        </div>
      )}
    </div>
  );
};

export default InvoicePreview; 