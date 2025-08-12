import React from 'react';
import type { InvoiceItem } from './types';

interface InvoiceItemRowProps {
  item: InvoiceItem;
  updateItem: (id: string, field: keyof InvoiceItem, value: string | number) => void;
  removeItem: (id: string) => void;
  formatCurrency: (amount: number) => string;
  itemsLength: number;
}

const InvoiceItemRow: React.FC<InvoiceItemRowProps> = ({
  item,
  updateItem,
  removeItem,
  formatCurrency,
  itemsLength,
}) => {
  return (
    <tr className="border-b border-blue-100 dark:border-gray-800 hover:bg-blue-50/40 dark:hover:bg-gray-800/40 transition-colors">
      <td className="py-2 px-2">
        <input type="text" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} placeholder="Item description" aria-label="Item description" className="w-full px-2 py-1 border border-blue-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all" required />
      </td>
      <td className="py-2 px-2">
        <input type="number" value={item.quantity} min={1} onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} aria-label="Quantity" className="w-full px-2 py-1 border border-blue-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all" required />
      </td>
      <td className="py-2 px-2">
        <input type="number" value={item.rate} min={0} step={0.01} onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} aria-label="Rate" className="w-full px-2 py-1 border border-blue-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all" required />
      </td>
      <td className="py-2 px-2">
        <div className="px-2 py-1 bg-blue-50 dark:bg-gray-900 rounded-lg text-gray-900 dark:text-white">
          {formatCurrency(item.amount)}
        </div>
      </td>
      <td className="py-2 px-2">
        {itemsLength > 1 && (
          <button type="button" onClick={() => removeItem(item.id)} aria-label="Remove item" className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </td>
    </tr>
  );
};

export default InvoiceItemRow;