import React from 'react';
import type { InvoiceItem } from './types';
import InvoiceItemRow from './InvoiceItemRow';

interface InvoiceFormProps {
  invoiceData: any;
  setInvoiceData: any;
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

const InvoiceForm: React.FC<InvoiceFormProps> = ({
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
  // Handle logo upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogoDataUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <header>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-10 text-center tracking-tight" tabIndex={0}>Create Invoice</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit} className="space-y-10" aria-label="Invoice Form">
          {/* Currency & Logo Row */}
          <div className="flex  md:flex-row justify-between items-center mb-4 gap-4">
            <div className="flex items-center">
              
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="border border-blue-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CNY">CNY (¥)</option>
                <option value="PKR">PKR (₨)</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
            
              {logoDataUrl === undefined ? (
                <label className="flex flex-col items-center justify-center  md:h-32 md:w-48 h-22 w-34 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900 hover:border-blue-400 transition-all relative overflow-hidden group">
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm md:text-lg font-medium text-gray-400">+ Add Your Logo</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </label>
              ) : (
                <div className="relative h-16 w-16">
                  <img src={logoDataUrl} alt="Logo Preview" className="h-16 w-16 object-contain rounded border border-blue-200 dark:border-gray-700 bg-white" />
                  <button
                    type="button"
                    onClick={() => setLogoDataUrl(undefined)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow hover:bg-red-600"
                    title="Remove logo"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Invoice & Client Details */}
          <section aria-labelledby="invoice-client-details">
            <h2 id="invoice-client-details" className="sr-only">Invoice and Client Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-blue-50/60 dark:bg-gray-800/60 rounded-xl p-6 border border-blue-100 dark:border-gray-800">
              <div>
                {editingLabel === 'invoiceNumber' ? (
                  <input
                    type="text"
                    value={labels.invoiceNumber}
                    autoFocus
                    onChange={e => handleLabelChange('invoiceNumber', e.target.value)}
                    onBlur={handleLabelBlur}
                    onKeyDown={handleLabelKeyDown}
                    className="w-full px-2 py-1 mb-2 text-sm border border-blue-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-blue-700 dark:text-purple-300 font-semibold"
                  />
                ) : (
                  <label
                    className="block text-sm font-semibold text-blue-700 dark:text-purple-300 mb-2 cursor-pointer"
                    onClick={() => setEditingLabel('invoiceNumber')}
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter') setEditingLabel('invoiceNumber'); }}
                  >
                    {labels.invoiceNumber}
                  </label>
                )}
                <input type="text" value={invoiceData.invoiceNumber} onChange={e => setInvoiceData((prev: any) => ({ ...prev, invoiceNumber: e.target.value }))} className="w-full px-3 py-2 border border-blue-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  {editingLabel === 'invoiceDate' ? (
                    <input
                      type="text"
                      value={labels.invoiceDate}
                      autoFocus
                      onChange={e => handleLabelChange('invoiceDate', e.target.value)}
                      onBlur={handleLabelBlur}
                      onKeyDown={handleLabelKeyDown}
                      className="w-full px-2 py-1 mb-2 text-sm border border-blue-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-blue-700 dark:text-purple-300 font-semibold"
                    />
                  ) : (
                    <label
                      className="block text-sm font-semibold text-blue-700 dark:text-purple-300 mb-2 cursor-pointer"
                      onClick={() => setEditingLabel('invoiceDate')}
                      tabIndex={0}
                      onKeyDown={e => { if (e.key === 'Enter') setEditingLabel('invoiceDate'); }}
                    >
                      {labels.invoiceDate}
                    </label>
                  )}
                  <input type="date" value={invoiceData.invoiceDate} onChange={e => setInvoiceData((prev: any) => ({ ...prev, invoiceDate: e.target.value }))} className="w-full px-3 py-2 border border-blue-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all" required />
                </div>
                <div>
                  {editingLabel === 'dueDate' ? (
                    <input
                      type="text"
                      value={labels.dueDate}
                      autoFocus
                      onChange={e => handleLabelChange('dueDate', e.target.value)}
                      onBlur={handleLabelBlur}
                      onKeyDown={handleLabelKeyDown}
                      className="w-full px-2 py-1 mb-2 text-sm border border-blue-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-blue-700 dark:text-purple-300 font-semibold"
                    />
                  ) : (
                    <label
                      className="block text-sm font-semibold text-blue-700 dark:text-purple-300 mb-2 cursor-pointer"
                      onClick={() => setEditingLabel('dueDate')}
                      tabIndex={0}
                      onKeyDown={e => { if (e.key === 'Enter') setEditingLabel('dueDate'); }}
                    >
                      {labels.dueDate}
                    </label>
                  )}
                  <input type="date" value={invoiceData.dueDate} onChange={e => setInvoiceData((prev: any) => ({ ...prev, dueDate: e.target.value }))} className="w-full px-3 py-2 border border-blue-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all" />
                </div>
              </div>
              <div>
                {editingLabel === 'clientName' ? (
                  <input
                    type="text"
                    value={labels.clientName}
                    autoFocus
                    onChange={e => handleLabelChange('clientName', e.target.value)}
                    onBlur={handleLabelBlur}
                    onKeyDown={handleLabelKeyDown}
                    className="w-full px-2 py-1 mb-2 text-sm border border-blue-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-blue-700 dark:text-purple-300 font-semibold"
                  />
                ) : (
                  <label
                    className="block text-sm font-semibold text-blue-700 dark:text-purple-300 mb-2 cursor-pointer"
                    onClick={() => setEditingLabel('clientName')}
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter') setEditingLabel('clientName'); }}
                  >
                    {labels.clientName}
                  </label>
                )}
                <input type="text" value={invoiceData.clientName} onChange={e => setInvoiceData((prev: any) => ({ ...prev, clientName: e.target.value }))} className="w-full px-3 py-2 border border-blue-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all" required />
              </div>
              <div>
                {editingLabel === 'clientEmail' ? (
                  <input
                    type="text"
                    value={labels.clientEmail}
                    autoFocus
                    onChange={e => handleLabelChange('clientEmail', e.target.value)}
                    onBlur={handleLabelBlur}
                    onKeyDown={handleLabelKeyDown}
                    className="w-full px-2 py-1 mb-2 text-sm border border-blue-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-blue-700 dark:text-purple-300 font-semibold"
                  />
                ) : (
                  <label
                    className="block text-sm font-semibold text-blue-700 dark:text-purple-300 mb-2 cursor-pointer"
                    onClick={() => setEditingLabel('clientEmail')}
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter') setEditingLabel('clientEmail'); }}
                  >
                    {labels.clientEmail}
                  </label>
                )}
                <input type="email" value={invoiceData.clientEmail} onChange={e => setInvoiceData((prev: any) => ({ ...prev, clientEmail: e.target.value }))} className="w-full px-3 py-2 border border-blue-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all" />
              </div>
              <div className="md:col-span-2">
                {editingLabel === 'clientAddress' ? (
                  <input
                    type="text"
                    value={labels.clientAddress}
                    autoFocus
                    onChange={e => handleLabelChange('clientAddress', e.target.value)}
                    onBlur={handleLabelBlur}
                    onKeyDown={handleLabelKeyDown}
                    className="w-full px-2 py-1 mb-2 text-sm border border-blue-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-blue-700 dark:text-purple-300 font-semibold"
                  />
                ) : (
                  <label
                    className="block text-sm font-semibold text-blue-700 dark:text-purple-300 mb-2 cursor-pointer"
                    onClick={() => setEditingLabel('clientAddress')}
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter') setEditingLabel('clientAddress'); }}
                  >
                    {labels.clientAddress}
                  </label>
                )}
                <textarea value={invoiceData.clientAddress} onChange={e => setInvoiceData((prev: any) => ({ ...prev, clientAddress: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-blue-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all" />
              </div>
            </div>
          </section>
          {/* Invoice Items */}
          <section aria-labelledby="invoice-items-section">
            <h2 id="invoice-items-section" className="sr-only">Invoice Items</h2>
            <div className="bg-blue-50/60 dark:bg-gray-800/60 rounded-xl p-6 border border-blue-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  {editingLabel === 'items' ? (
                    <input
                      type="text"
                      value={labels.items}
                      autoFocus
                      onChange={e => handleLabelChange('items', e.target.value)}
                      onBlur={handleLabelBlur}
                      onKeyDown={handleLabelKeyDown}
                      className="w-full px-2 py-1 mb-2 text-sm border border-blue-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-blue-700 dark:text-purple-300 font-semibold"
                    />
                  ) : (
                    <label
                      className="block text-sm font-semibold text-blue-700 dark:text-purple-300 mb-2 cursor-pointer"
                      onClick={() => setEditingLabel('items')}
                      tabIndex={0}
                      onKeyDown={e => { if (e.key === 'Enter') setEditingLabel('items'); }}
                    >
                      {labels.items}
                    </label>
                  )}
                </div>
                <button type="button" onClick={addItem} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 text-blue-700 font-medium rounded-lg transition-colors duration-200 shadow-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Item
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full mb-2 rounded-lg overflow-hidden" aria-label="Invoice Items Table">
                  <thead className="bg-blue-100 dark:bg-gray-800">
                    <tr>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-blue-700 dark:text-purple-300">
                        {editingLabel === 'description' ? (
                          <input
                            type="text"
                            value={labels.description}
                            autoFocus
                            onChange={e => handleLabelChange('description', e.target.value)}
                            onBlur={handleLabelBlur}
                            onKeyDown={handleLabelKeyDown}
                            className="w-full px-1 py-0.5 mb-1 text-xs border border-blue-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-blue-700 dark:text-purple-300 font-semibold"
                          />
                        ) : (
                          <label
                            className="block text-sm font-semibold text-blue-700 dark:text-purple-300 cursor-pointer"
                            onClick={() => setEditingLabel('description')}
                            tabIndex={0}
                            onKeyDown={e => { if (e.key === 'Enter') setEditingLabel('description'); }}
                          >
                            {labels.description}
                          </label>
                        )}
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-blue-700 dark:text-purple-300 w-20">
                        {editingLabel === 'quantity' ? (
                          <input
                            type="text"
                            value={labels.quantity}
                            autoFocus
                            onChange={e => handleLabelChange('quantity', e.target.value)}
                            onBlur={handleLabelBlur}
                            onKeyDown={handleLabelKeyDown}
                            className="w-full px-1 py-0.5 mb-1 text-xs border border-blue-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-blue-700 dark:text-purple-300 font-semibold"
                          />
                        ) : (
                          <label
                            className="block text-sm font-semibold text-blue-700 dark:text-purple-300 cursor-pointer"
                            onClick={() => setEditingLabel('quantity')}
                            tabIndex={0}
                            onKeyDown={e => { if (e.key === 'Enter') setEditingLabel('quantity'); }}
                          >
                            {labels.quantity}
                          </label>
                        )}
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-blue-700 dark:text-purple-300 w-32">
                        {editingLabel === 'rate' ? (
                          <input
                            type="text"
                            value={labels.rate}
                            autoFocus
                            onChange={e => handleLabelChange('rate', e.target.value)}
                            onBlur={handleLabelBlur}
                            onKeyDown={handleLabelKeyDown}
                            className="w-full px-1 py-0.5 mb-1 text-xs border border-blue-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-blue-700 dark:text-purple-300 font-semibold"
                          />
                        ) : (
                          <label
                            className="block text-sm font-semibold text-blue-700 dark:text-purple-300 cursor-pointer"
                            onClick={() => setEditingLabel('rate')}
                            tabIndex={0}
                            onKeyDown={e => { if (e.key === 'Enter') setEditingLabel('rate'); }}
                          >
                            {labels.rate}
                          </label>
                        )}
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-blue-700 dark:text-purple-300 w-32">
                        {editingLabel === 'amount' ? (
                          <input
                            type="text"
                            value={labels.amount}
                            autoFocus
                            onChange={e => handleLabelChange('amount', e.target.value)}
                            onBlur={handleLabelBlur}
                            onKeyDown={handleLabelKeyDown}
                            className="w-full px-1 py-0.5 mb-1 text-xs border border-blue-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-blue-700 dark:text-purple-300 font-semibold"
                          />
                        ) : (
                          <label
                            className="block text-sm font-semibold text-blue-700 dark:text-purple-300 cursor-pointer"
                            onClick={() => setEditingLabel('amount')}
                            tabIndex={0}
                            onKeyDown={e => { if (e.key === 'Enter') setEditingLabel('amount'); }}
                          >
                            {labels.amount}
                          </label>
                        )}
                      </th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items.map((item: InvoiceItem, idx: number) => (
                      <InvoiceItemRow
                        key={item.id}
                        item={item}
                        updateItem={updateItem}
                        removeItem={removeItem}
                        formatCurrency={formatCurrency}
                        itemsLength={invoiceData.items.length}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Totals section */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 dark:text-purple-300 font-semibold">Subtotal:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {editingLabel === 'tax' ? (
                      <input
                        type="text"
                        value={labels.tax}
                        autoFocus
                        onChange={e => handleLabelChange('tax', e.target.value)}
                        onBlur={handleLabelBlur}
                        onKeyDown={handleLabelKeyDown}
                        className="w-16 px-1 py-0.5 mb-1 text-xs border border-blue-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-blue-700 dark:text-purple-300 font-semibold"
                      />
                    ) : (
                      <label
                        className="block text-sm font-semibold text-blue-700 dark:text-purple-300 cursor-pointer"
                        onClick={() => setEditingLabel('tax')}
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === 'Enter') setEditingLabel('tax'); }}
                      >
                        {labels.tax}:
                      </label>
                    )}
                    <input type="number" value={invoiceData.taxRate} onChange={e => setInvoiceData((prev: any) => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))} min="0" max="100" step="0.1" className="w-16 px-2 py-1 border border-blue-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all" />
                    <span className="text-blue-700 dark:text-purple-300 font-semibold">%</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(calculateTax())}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-extrabold border-t border-blue-100 dark:border-gray-800 pt-3">
                  <span className="text-blue-700 dark:text-purple-300">Total:</span>
                  <span className="text-blue-700 dark:text-purple-300">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>
          </section>
          {/* Notes section */}
          <section aria-labelledby="invoice-notes-section">
            <h2 id="invoice-notes-section" className="sr-only">Notes</h2>
            <div className="bg-blue-50/60 dark:bg-gray-800/60 rounded-xl p-6 border border-blue-100 dark:border-gray-800">
              {editingLabel === 'notes' ? (
                <input
                  type="text"
                  value={labels.notes}
                  autoFocus
                  onChange={e => handleLabelChange('notes', e.target.value)}
                  onBlur={handleLabelBlur}
                  onKeyDown={handleLabelKeyDown}
                  className="w-full px-2 py-1 mb-2 text-sm border border-blue-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-blue-700 dark:text-purple-300 font-semibold"
                />
              ) : (
                <label
                  className="block text-sm font-semibold text-blue-700 dark:text-purple-300 mb-2 cursor-pointer"
                  onClick={() => setEditingLabel('notes')}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter') setEditingLabel('notes'); }}
                >
                  {labels.notes}
                </label>
              )}
              <textarea value={invoiceData.notes} onChange={e => setInvoiceData((prev: any) => ({ ...prev, notes: e.target.value }))} rows={3} placeholder="Additional notes or payment terms..." className="w-full px-3 py-2 border border-blue-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all" />
            </div>
          </section>
          {/* Actions section */}
          <footer className="flex justify-end">
            <button type="submit" className="px-10 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg transition-all">Create Invoice</button>
          </footer>
          {showConfirmation && (
            <div className="mt-8 p-4 bg-green-100 text-green-800 rounded-xl text-center font-semibold shadow">Invoice created! See below to view or manage your invoices.</div>
          )}
        </form>
      </main>
    </>
  );
};

export default InvoiceForm;