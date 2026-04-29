'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import InvoiceFormWithPreview from '@/components/invoice/InvoiceFormWithPreview';
import InvoiceList from '@/components/invoice/InvoiceList';
import InvoiceView from '@/components/invoice/InvoiceView';
import type { InvoiceData, InvoiceItem } from '@/components/invoice/types';
import Link from 'next/link';
import Head from 'next/head';

const InvoicesPage = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    id: '',
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [
      { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
    ],
    notes: '',
    taxRate: 0,
    labels: {
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
    },
    logoDataUrl: undefined, // was null
  });
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceData | null>(null);
  const [editingLabel, setEditingLabel] = useState<keyof typeof invoiceData.labels | null>(null);
  const [currency, setCurrency] = useState('USD');
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>(undefined); // was string | null

  // Load invoices, currency, and logo from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('invoices');
    if (stored) {
      setInvoices(JSON.parse(stored));
    }
    const storedCurrency = localStorage.getItem('currency');
    if (storedCurrency) {
      setCurrency(storedCurrency);
    }
    // Check for editingInvoice from history page
    const editing = localStorage.getItem('editingInvoice');
    if (editing) {
      try {
        const parsed = JSON.parse(editing);
        setEditingInvoice(parsed);
        setInvoiceData(parsed);
        setLogoDataUrl(parsed.logoDataUrl);
      } catch {}
      localStorage.removeItem('editingInvoice');
    }
    setHasLoaded(true);
  }, []);

  // Save invoices, currency, and logo to localStorage whenever they change
  useEffect(() => {
    if (!hasLoaded) return;
    const stored = localStorage.getItem('invoices');
    if (invoices.length > 0 || (stored && JSON.parse(stored).length > 0)) {
      localStorage.setItem('invoices', JSON.stringify(invoices));
    }
  }, [invoices, hasLoaded]);
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

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

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (id: string) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (invoiceData.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (invoiceData.id) {
      // Update existing invoice
      setInvoices((prevInvoices: InvoiceData[]) => prevInvoices.map(inv => inv.id === invoiceData.id ? { ...invoiceData, logoDataUrl } : inv));
      setShowConfirmation(true);
    } else {
      // Create new invoice
      const newInvoice: InvoiceData = {
        ...invoiceData,
        id: Date.now().toString(),
        logoDataUrl,
      };
      setInvoices((prevInvoices: InvoiceData[]) => [newInvoice, ...prevInvoices]);
      setShowConfirmation(true);
    }
    setInvoiceData({
      id: '',
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      clientName: '',
      clientEmail: '',
      clientAddress: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      items: [
        { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
      ],
      notes: '',
      taxRate: 0,
      labels: {
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
      },
      logoDataUrl: undefined, // was null
    });
    setLogoDataUrl(undefined); // was null
    setTimeout(() => setShowConfirmation(false), 1500);
  };

  const handleView = (inv: InvoiceData) => {
    setSelectedInvoice(inv);
  };

  const handleDelete = (id: string) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
    setSelectedInvoice(null);
  };

  const handlePrint = () => {
    window.print();
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
    let logoImg = inv.logoDataUrl; // Use inv.logoDataUrl
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

  // Company logo path (use your own logo in public/ or use /public/logo-colorful.svg as placeholder)
  const logoSrc = '/logo-colorful.svg';

  // When editing an invoice, set the form and logoDataUrl to the invoice's values
  React.useEffect(() => {
    if (editingInvoice) {
      setInvoiceData(editingInvoice);
      setLogoDataUrl(editingInvoice.logoDataUrl); // no fallback to null
      setEditingInvoice(null);
    }
  }, [editingInvoice]);

  // When logoDataUrl changes, update invoiceData.logoDataUrl
  useEffect(() => {
    setInvoiceData(prev => ({ ...prev, logoDataUrl }));
  }, [logoDataUrl]);

  const handleLabelBlur = () => setEditingLabel(null);
  const handleLabelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') setEditingLabel(null);
  };

  if (selectedInvoice) {
    return (
      <InvoiceView
        selectedInvoice={selectedInvoice}
        formatCurrency={formatCurrency}
        handlePrint={handlePrint}
        handleDelete={handleDelete}
        setEditingInvoice={setEditingInvoice}
        setSelectedInvoice={setSelectedInvoice}
        logoDataUrl={selectedInvoice.logoDataUrl}
      />
    );
  }

  return (
    <>
      <Head>
        <title>Invoices | InvoiceGen</title>
        <meta name="description" content="Create, view, and manage your invoices with InvoiceGen. Professional, responsive, and SEO-friendly invoice generator." />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-100/40 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 flex items-center justify-center">
        <div className="w-full mx-3 max-w-6xl bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl border border-blue-100 dark:border-gray-800 p-5 md:p-10 relative overflow-hidden">
          {/* <div className="flex justify-end mb-6">
            <Link href="/invoices/history" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-5 py-2 rounded-lg font-semibold shadow transition-all">View Invoice History</Link>
          </div> */}
          <div className="flex justify-end mb-6">
            <Link href="/invoices/history" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-5 py-2 rounded-lg font-semibold shadow transition-all">View Invoice History</Link>
          </div>
          <InvoiceFormWithPreview
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
            labels={invoiceData.labels}
            setLabels={(newLabels: any) => setInvoiceData((prev: any) => ({ ...prev, labels: newLabels }))}
            editingLabel={editingLabel}
            setEditingLabel={setEditingLabel}
            handleLabelChange={(key: string, value: string) => {
              setInvoiceData((prev: any) => ({
                ...prev,
                labels: { ...prev.labels, [key]: value }
              }));
            }}
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
          
          {/* Invoice History */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Invoice History</h2>
            <InvoiceList
              invoices={invoices}
              handleDownloadPDF={handleDownloadPDF}
              handleView={handleView}
              formatCurrency={formatCurrency}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default InvoicesPage;
