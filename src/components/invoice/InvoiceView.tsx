import React from 'react';
import type { InvoiceData } from './types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface InvoiceViewProps {
  selectedInvoice: InvoiceData;
  formatCurrency: (amount: number) => string;
  handlePrint: () => void;
  handleDelete: (id: string) => void;
  setEditingInvoice: (inv: InvoiceData) => void;
  setSelectedInvoice: (inv: InvoiceData | null) => void;
  logoDataUrl?: string | null;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({
  selectedInvoice,
  formatCurrency,
  handlePrint,
  handleDelete,
  setEditingInvoice,
  setSelectedInvoice,
  logoDataUrl,
}) => {
  // Use custom labels from invoice data, fallback to defaults if not available
  const labels = selectedInvoice.labels || {
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

  // Helper to convert SVG string to PNG data URL
  const svgStringToPngDataUrl = (svgString: string, width = 48, height = 48): Promise<string> => {
    return new Promise((resolve, reject) => {
      const svg = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svg);
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          URL.revokeObjectURL(url);
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject('No canvas context');
        }
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  // Function to generate and download PDF for the invoice
  const handleDownloadPDF = async () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    // Colors from the detail page
    const blue = '#2563eb'; // Tailwind blue-600
    const purple = '#a21caf'; // Tailwind purple-700
    const gray900 = '#111827'; // Tailwind gray-900
    const gray800 = '#1f2937'; // Tailwind gray-800
    const gray700 = '#374151'; // Tailwind gray-700
    const gray400 = '#9ca3af'; // Tailwind gray-400
    const gray50 = '#f9fafb'; // Tailwind gray-50
    const borderColor = '#dbeafe'; // Tailwind blue-100

    // Use uploaded logo if available, otherwise fallback to SVG
    let logoImg = logoDataUrl;
    if (!logoImg) {
      const svgMarkup = `<svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="white"/></svg>`;
      try {
        logoImg = await svgStringToPngDataUrl(svgMarkup, 100, 100);
      } catch (e) {
        logoImg = '';
      }
    }
    // Header with logo and brand
    if (logoImg) {
      doc.setFillColor(blue);
      // Place the logo at the top left
      doc.addImage(logoImg, 'PNG', 40, 36, 100, 100);
    }
    // Invoice number and title aligned with the logo, to the right of the logo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(gray900);
    // Place the invoice number and title to the right of the logo, vertically centered
    const headingX = 40 + 100 + 30; // right of logo + margin
    const headingY = 36 + 100 / 2 + 10; // vertical center of logo + offset
    doc.text(labels.invoiceNumber, headingX, headingY - 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(purple);
    doc.text(selectedInvoice.invoiceNumber, headingX, headingY + 10);
    // Bill To & Dates
    let y = 36 + 100 + 30; // below the logo and heading
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(blue);
    doc.text('Bill To', 40, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(gray900);
    doc.text(selectedInvoice.clientName, 40, y + 18);
    doc.setTextColor(gray700);
    doc.text(selectedInvoice.clientEmail, 40, y + 36);
    doc.text(selectedInvoice.clientAddress, 40, y + 54);
    // Dates
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(gray400);
    doc.text(`${labels.invoiceDate}:`, 350, y);
    doc.setTextColor(gray900);
    doc.text(selectedInvoice.invoiceDate, 450, y);
    doc.setTextColor(gray400);
    doc.text(`${labels.dueDate}:`, 350, y + 18);
    doc.setTextColor(gray900);
    doc.text(selectedInvoice.dueDate, 450, y + 18);

    // Items Table
    let tableStartY = y + 80;
    autoTable(doc, {
      startY: tableStartY,
      head: [[
        labels.description,
        labels.quantity,
        labels.rate,
        labels.amount,
      ]],
      body: selectedInvoice.items.map(item => [
        item.description,
        item.quantity,
        `$${item.rate.toFixed(2)}`,
        `$${item.amount.toFixed(2)}`,
      ]),
      headStyles: {
        fillColor: [37, 99, 235], // blue-600
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 13,
        halign: 'center',
      },
      bodyStyles: {
        textColor: [17, 24, 39], // gray-900
        fontSize: 12,
        halign: 'center',
      },
      styles: {
        font: 'helvetica',
        cellPadding: 6,
        lineColor: [219, 234, 254], // blue-100
        lineWidth: 1,
        valign: 'middle',
      },
      theme: 'grid',
      margin: { left: 40, right: 40 },
      tableLineColor: [219, 234, 254],
      tableLineWidth: 1,
    });
    let tableY = (doc as any).lastAutoTable.finalY || tableStartY + 40;

    // Totals box (rounded, blue-50 bg, border)
    const boxY = tableY + 20;
    doc.setFillColor(249, 250, 251); // blue-50
    doc.setDrawColor(219, 234, 254); // blue-100
    doc.roundedRect(340, boxY, 200, 80, 12, 12, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(gray400);
    doc.text('Subtotal:', 360, boxY + 22);
    doc.setTextColor(gray900);
    const subtotal = selectedInvoice.items.reduce((sum, item) => sum + item.amount, 0);
    doc.text(`$${subtotal.toFixed(2)}`, 520, boxY + 22, { align: 'right' });
    doc.setTextColor(gray400);
    doc.text(`${labels.tax} (${selectedInvoice.taxRate}%):`, 360, boxY + 42);
    doc.setTextColor(gray900);
    const tax = subtotal * (selectedInvoice.taxRate / 100);
    doc.text(`$${tax.toFixed(2)}`, 520, boxY + 42, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(blue);
    doc.text('Total:', 360, boxY + 70);
    doc.setTextColor(purple);
    const total = subtotal + tax;
    doc.text(`$${total.toFixed(2)}`, 520, boxY + 70, { align: 'right' });

    // Notes box (rounded, blue-50 bg, border)
    let endY = boxY + 80;
    if (selectedInvoice.notes) {
      const notesY = boxY + 110;
      doc.setFillColor(249, 250, 251); // blue-50
      doc.setDrawColor(219, 234, 254); // blue-100
      doc.roundedRect(40, notesY, 500, 60, 12, 12, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(blue);
      doc.text(labels.notes, 60, notesY + 20);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(gray700);
      doc.text(selectedInvoice.notes, 60, notesY + 40, { maxWidth: 460 });
      endY = notesY + 60;
    }

    // Add extra space at the bottom
    doc.setFontSize(1);
    doc.text(' ', 40, endY + 40);

    doc.save(`Invoice_${selectedInvoice.invoiceNumber}.pdf`);
  };

  // Fallback SVG if no logoDataUrl
  const fallbackSVG = (
    <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-100/40 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 sm:py-12 flex items-center justify-center px-4 sm:px-0">
      <article className="w-full max-w-2xl bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl border border-blue-100 dark:border-gray-800 p-4 sm:p-10 print:p-0 print:shadow-none print:bg-white print:border-none relative overflow-hidden" aria-label="Invoice Details">
        <header className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-br from-blue-200/40 via-purple-200/30 to-transparent rounded-full blur-2xl pointer-events-none print:hidden" />
        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-blue-100 dark:border-gray-800 pb-6 sm:pb-8 mb-6 sm:mb-10 gap-4 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-16 h-16 sm:w-22 sm:h-22 rounded-xl flex items-center justify-center overflow-hidden">
              {logoDataUrl ? (
                <img src={logoDataUrl} alt="Company Logo" className="w-14 h-14 sm:w-20 sm:h-20 object-contain" />
              ) : fallbackSVG}
            </div>
            {/* <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">InvoiceGen</h1>
              <p className="text-sm text-blue-600 dark:text-purple-300 font-medium">Professional Invoicing</p>
            </div> */}
          </div>
          <div className="text-left sm:text-right">
            <span className="block text-xs text-gray-400">{labels.invoiceNumber}</span>
            <span className="block text-lg sm:text-xl font-bold text-blue-700 dark:text-purple-300 tracking-wider">{selectedInvoice.invoiceNumber}</span>
          </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mb-6 sm:mb-10">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-blue-700 dark:text-purple-300 mb-2">Bill To</h3>
            <div className="text-gray-700 dark:text-gray-300 space-y-1">
              <div className="font-semibold text-sm sm:text-base">{selectedInvoice.clientName}</div>
              <div className="text-xs sm:text-sm">{selectedInvoice.clientEmail}</div>
              <div className="whitespace-pre-line text-xs sm:text-sm">{selectedInvoice.clientAddress}</div>
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">{labels.invoiceDate}:</span>
              <span className="text-gray-900 dark:text-white font-medium text-sm sm:text-base">{selectedInvoice.invoiceDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">{labels.dueDate}:</span>
              <span className="text-gray-900 dark:text-white font-medium text-sm sm:text-base">{selectedInvoice.dueDate}</span>
            </div>
          </div>
        </section>
        <section className="overflow-x-auto mb-6 sm:mb-10 rounded-2xl border border-blue-100 dark:border-gray-800 bg-gradient-to-br from-blue-50/40 to-purple-50/20 dark:from-gray-800 dark:to-gray-900">
          <table className="w-full min-w-[500px]">
            <thead className="bg-blue-50 dark:bg-gray-800">
              <tr>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-sm sm:text-base font-semibold text-blue-700 dark:text-purple-300">{labels.description}</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-sm sm:text-base font-semibold text-blue-700 dark:text-purple-300">{labels.quantity}</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-sm sm:text-base font-semibold text-blue-700 dark:text-purple-300">{labels.rate}</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-sm sm:text-base font-semibold text-blue-700 dark:text-purple-300">{labels.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100 dark:divide-gray-800">
              {selectedInvoice.items.map(item => (
                <tr key={item.id} className="hover:bg-blue-50/60 dark:hover:bg-gray-800/60 transition-colors">
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900 dark:text-white text-sm sm:text-base">{item.description}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-gray-900 dark:text-white text-sm sm:text-base">{item.quantity}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-right text-gray-900 dark:text-white text-sm sm:text-base">{formatCurrency(item.rate)}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-right text-blue-700 dark:text-purple-300 font-bold text-sm sm:text-base">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="flex flex-col items-end mb-6 sm:mb-10">
          <div className="w-full max-w-xs space-y-2 bg-blue-50/60 dark:bg-gray-800/60 rounded-xl p-3 sm:p-4 border border-blue-100 dark:border-gray-800">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">Subtotal:</span>
              <span className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base">{formatCurrency(selectedInvoice.items.reduce((sum, item) => sum + item.amount, 0))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">{labels.tax} ({selectedInvoice.taxRate}%):</span>
              <span className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base">{formatCurrency(selectedInvoice.items.reduce((sum, item) => sum + item.amount, 0) * (selectedInvoice.taxRate / 100))}</span>
            </div>
            <div className="flex justify-between text-lg sm:text-xl font-extrabold border-t border-blue-100 dark:border-gray-800 pt-2">
              <span className="text-blue-700 dark:text-purple-300">Total:</span>
              <span className="text-blue-700 dark:text-purple-300">{formatCurrency(selectedInvoice.items.reduce((sum, item) => sum + item.amount, 0) * (1 + selectedInvoice.taxRate / 100))}</span>
            </div>
          </div>
        </section>
        {selectedInvoice.notes && (
          <section className="mb-6 sm:mb-10" aria-labelledby="notes-heading">
            <h2 id="notes-heading" className="text-base sm:text-lg font-semibold text-blue-700 dark:text-purple-300 mb-2">{labels.notes}</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line bg-blue-50/60 dark:bg-gray-800/60 rounded-lg p-3 sm:p-4 border border-blue-100 dark:border-gray-800 text-sm sm:text-base">{selectedInvoice.notes}</p>
          </section>
        )}
        <footer className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 print:hidden justify-end">
          <button onClick={handleDownloadPDF} aria-label="Download PDF" className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-md sm:shadow-lg transition-all min-h-[36px] touch-manipulation">
            <span className="sm:hidden">PDF</span>
            <span className="hidden sm:inline">Download PDF</span>
          </button>
          <button onClick={() => handleDelete(selectedInvoice.id)} aria-label="Delete invoice" className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 sm:px-6 sm:py-2 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-sm sm:shadow transition-all min-h-[36px] touch-manipulation">Delete</button>
          <button onClick={() => {
            setEditingInvoice(selectedInvoice);
            setSelectedInvoice(null);
          }} aria-label="Edit invoice" className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 sm:px-6 sm:py-2 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-sm sm:shadow transition-all min-h-[36px] touch-manipulation">Edit</button>
          <button onClick={() => setSelectedInvoice(null)} aria-label="Back to previous page" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 sm:px-6 sm:py-2 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-sm sm:shadow transition-all min-h-[36px] touch-manipulation">Back</button>
        </footer>
      </article>
    </main>
  );
};

export default InvoiceView;