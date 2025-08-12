'use client';
import React, { useEffect, useState } from 'react';
import type { InvoiceData } from '@/components/invoice/types';
import InvoiceView from '@/components/invoice/InvoiceView';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

const InvoiceHistoryPage = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [currency, setCurrency] = useState('USD');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const router = useRouter();

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

  // Add a function to generate and download PDF for an invoice
  const handleDownloadPDF = async (inv: InvoiceData) => {
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

    // Use custom labels from invoice data, fallback to defaults if not available
    const labels = inv.labels || {
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

    // Use uploaded logo if available, otherwise fallback to SVG
    let logoImg = inv.logoDataUrl;
    if (!logoImg) {
      const svgMarkup = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="white"/></svg>`;
      try {
        logoImg = await svgStringToPngDataUrl(svgMarkup, 40, 40);
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
    doc.text(inv.invoiceNumber, headingX, headingY + 10);
    // Bill To & Dates
    let y = 36 + 100 + 30; // below the logo and heading
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(blue);
    doc.text('Bill To', 40, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(gray900);
    doc.text(inv.clientName, 40, y + 18);
    doc.setTextColor(gray700);
    doc.text(inv.clientEmail, 40, y + 36);
    doc.text(inv.clientAddress, 40, y + 54);
    // Dates
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(gray400);
    doc.text(`${labels.invoiceDate}:`, 350, y);
    doc.setTextColor(gray900);
    doc.text(inv.invoiceDate, 450, y);
    doc.setTextColor(gray400);
    doc.text(`${labels.dueDate}:`, 350, y + 18);
    doc.setTextColor(gray900);
    doc.text(inv.dueDate, 450, y + 18);
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
      body: inv.items.map(item => [
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
    const subtotal = inv.items.reduce((sum, item) => sum + item.amount, 0);
    doc.text(`$${subtotal.toFixed(2)}`, 520, boxY + 22, { align: 'right' });
    doc.setTextColor(gray400);
    doc.text(`${labels.tax} (${inv.taxRate}%):`, 360, boxY + 42);
    doc.setTextColor(gray900);
    const tax = subtotal * (inv.taxRate / 100);
    doc.text(`$${tax.toFixed(2)}`, 520, boxY + 42, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(blue);
    doc.text('Total:', 360, boxY + 70);
    doc.setTextColor(purple);
    const total = subtotal + tax;
    doc.text(`$${total.toFixed(2)}`, 520, boxY + 70, { align: 'right' });
    // Notes box (rounded, blue-50 bg, border)
    if (inv.notes) {
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
      doc.text(inv.notes, 60, notesY + 40, { maxWidth: 460 });
    }
    doc.save(`Invoice_${inv.invoiceNumber}.pdf`);
  };

  // Add a function to handle editing an invoice from history
  const handleEditInvoice = (invoice: InvoiceData) => {
    localStorage.setItem('editingInvoice', JSON.stringify(invoice));
    router.push('/invoices');
  };

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'invoices') {
        const stored = localStorage.getItem('invoices');
        if (stored) {
          setInvoices(JSON.parse(stored));
        } else {
          setInvoices([]);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('invoices');
    if (stored) {
      setInvoices(JSON.parse(stored));
    }
    const storedCurrency = localStorage.getItem('currency');
    if (storedCurrency) {
      setCurrency(storedCurrency);
    }
  }, []);

  if (selectedInvoice) {
    return (
      <InvoiceView
        selectedInvoice={selectedInvoice}
        formatCurrency={amount => formatCurrency(amount, currency)}
        handlePrint={() => window.print()}
        handleDelete={() => {}}
        setEditingInvoice={handleEditInvoice}
        setSelectedInvoice={setSelectedInvoice}
        logoDataUrl={selectedInvoice.logoDataUrl}
      />
    );
  }

  return (
    <>
      <Head>
        <title>Invoice History | InvoiceGen</title>
        <meta name="description" content="View and manage your past invoices. Download PDFs and review invoice details in your InvoiceGen history." />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-100/40 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 flex items-center justify-center">
        <section className="w-full max-w-4xl bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl border border-blue-100 dark:border-gray-800 p-10 relative overflow-hidden">
          <h1 className="text-3xl font-bold mb-8 text-blue-700 dark:text-purple-300 text-center">Invoice History</h1>
          {invoices.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">No invoices found in history.</div>
          ) : (
            <div className="overflow-x-auto sm:overflow-x-visible">
              <table className="w-full mb-2 rounded-lg overflow-hidden sm:table-fixed" aria-label="Invoice History Table">
                <thead className="bg-blue-100 dark:bg-gray-800">
                  <tr>
                    <th className="py-3 px-1 sm:px-2 text-left text-xs sm:text-sm font-semibold text-blue-700 dark:text-purple-300 sm:w-[15%]">Invoice #</th>
                    <th className="py-3 px-1 sm:px-2 text-left text-xs sm:text-sm font-semibold text-blue-700 dark:text-purple-300 sm:w-[25%]">Client</th>
                    <th className="py-3 px-1 sm:px-2 text-left text-xs sm:text-sm font-semibold text-blue-700 dark:text-purple-300 sm:w-[15%]">Date</th>
                    <th className="py-3 px-1 sm:px-2 text-right text-xs sm:text-sm font-semibold text-blue-700 dark:text-purple-300 sm:w-[15%]">Total</th>
                    <th className="py-3 px-1 sm:px-2 text-center text-xs sm:text-sm font-semibold text-blue-700 dark:text-purple-300 sm:w-[30%]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => {
                    const total = inv.items.reduce((sum, item) => sum + item.amount, 0) * (1 + inv.taxRate / 100);
                    return (
                      <tr key={inv.id} className="border-b border-blue-100 dark:border-gray-800 hover:bg-blue-50/40 dark:hover:bg-gray-800/40 transition-colors">
                        <td className="py-2 px-1 sm:px-2 text-xs sm:text-sm truncate sm:truncate-none">{inv.invoiceNumber}</td>
                        <td className="py-2 px-1 sm:px-2 text-xs sm:text-sm truncate sm:truncate-none" title={inv.clientName}>{inv.clientName}</td>
                        <td className="py-2 px-1 sm:px-2 text-xs sm:text-sm">{new Date(inv.invoiceDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                        <td className="py-2 px-1 sm:px-2 text-right text-xs sm:text-sm">{formatCurrency(total, currency)}</td>
                        <td className="py-2 px-1 sm:px-2 text-center">
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 justify-center">
                            <button
                              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-3 py-2 sm:px-5 sm:py-2 rounded-md sm:rounded-lg text-sm font-semibold shadow-md transition-all w-full sm:w-auto min-h-[36px] touch-manipulation"
                              onClick={() => setSelectedInvoice(inv)}
                              aria-label={`View invoice ${inv.invoiceNumber}`}
                            >
                              View
                            </button>
                            <button
                              className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-sm font-semibold shadow-md transition-all w-full sm:w-auto min-h-[36px] touch-manipulation"
                              onClick={() => handleDownloadPDF(inv)}
                              aria-label={`Download PDF for invoice ${inv.invoiceNumber}`}
                            >
                              <span className="sm:hidden">PDF</span>
                              <span className="hidden sm:inline">Download PDF</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default InvoiceHistoryPage; 