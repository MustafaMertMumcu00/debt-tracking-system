import React from 'react';
import SkeletonTableRow from './SkeletonTableRow';
import { FaCheck } from 'react-icons/fa';

function CustomerTable({ customers, selectedIds, isLoading, onSelectCustomer }) {
  
  const statusConfig = {
    confirmed: { text: 'Onaylandı', className: 'bg-green-600 text-white' },
    rejected: { text: 'Reddedildi', className: 'bg-red-600 text-white' },
    pending: { text: 'Yanıt Yok', className: 'bg-orange-500 text-white' }
  };

  return (
    <div className="bg-gray-800 bg-opacity-40 backdrop-blur-lg rounded-xl shadow-lg border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-900 bg-opacity-50">
            <tr>
              <th scope="col" className="p-4 w-16">
                <span className="sr-only">Select</span>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">CARİ HESAP KODU</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">CARİ HESAP ÜNVANI</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">TELEFON NO</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">BAKİYE</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">YANIT DURUMU</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">SON FT. TAR.</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">SON TAHS. TAR.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {isLoading ? (
              [...Array(15)].map((_, index) => <SkeletonTableRow key={index} />)
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-10 text-gray-400">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.id}
                  className={`${selectedIds.includes(customer.id) ? 'bg-blue-900 bg-opacity-40' : 'hover:bg-gray-700 hover:bg-opacity-80'} transition-colors duration-200`}
                >
                  <td className="p-4">
                    {/* Özel Checkbox Yapısı */}
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(customer.id)}
                        onChange={() => onSelectCustomer(customer.id)}
                      />
                      <span className="checkmark">
                        <FaCheck />
                      </span>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{customer.accountCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{customer.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                    {customer.balance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {customer.status && (
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusConfig[customer.status]?.className || 'bg-gray-500'}`}>
                        {statusConfig[customer.status]?.text || 'Bilinmiyor'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">{customer.lastInvoiceDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">{customer.lastPaymentDate || 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerTable;