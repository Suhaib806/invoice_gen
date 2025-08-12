import React from 'react';
import type { InvoiceData } from './types';

interface InvoiceListProps {
  invoices: InvoiceData[];
  handleDownloadPDF: (inv: InvoiceData) => void;
  handleView: (inv: InvoiceData) => void;
  formatCurrency: (amount: number) => string;
}

const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  handleDownloadPDF,
  handleView,
  formatCurrency,
}) => {
  if (invoices.length === 0) return null;
  return (
    <section aria-labelledby="your-invoices-heading" className="mt-12">
      <h2 id="your-invoices-heading" className="text-2xl font-bold mb-6 text-blue-700 dark:text-purple-300">Your Invoices</h2>
      <ul className="space-y-3">
        {invoices.map(inv => (
          <li key={inv.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-blue-50 dark:bg-gray-800 rounded-xl px-3 sm:px-6 py-3 sm:py-4 border border-blue-100 dark:border-gray-800 shadow-sm gap-2 sm:gap-0">
            <span className="text-gray-900 dark:text-white font-medium text-sm sm:text-base mb-1 sm:mb-0 break-words">Invoice {inv.invoiceNumber} - {inv.clientName}</span>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button onClick={() => handleDownloadPDF(inv)} aria-label={`Download PDF for invoice ${inv.invoiceNumber}`} className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-sm font-semibold shadow-md transition-all w-full sm:w-auto min-h-[36px] touch-manipulation">
                <span className="sm:hidden">PDF</span>
                <span className="hidden sm:inline">Download PDF</span>
              </button>
              <button onClick={() => handleView(inv)} aria-label={`View invoice ${inv.invoiceNumber}`} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-3 py-2 sm:px-5 sm:py-2 rounded-md sm:rounded-lg text-sm font-semibold shadow-md transition-all w-full sm:w-auto min-h-[36px] touch-manipulation">View</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default InvoiceList; 