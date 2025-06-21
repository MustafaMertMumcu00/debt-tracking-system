import React, { useState } from 'react';

function MessageModal({ onClose, onSend, isSending, selectedCount }) {
  const [message, setMessage] = useState('');

  const handleSendClick = () => {
    onSend(message);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 w-full max-w-lg mx-4 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <h2 className="text-xl font-bold text-white mb-4">
          {selectedCount} adet seçili müşteriye mesaj gönder
        </h2>
        
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mutabakat talebi mesajınızı buraya yazın..."
          className="w-full h-40 p-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          autoFocus
        />
        
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={onClose}
            disabled={isSending}
            className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSendClick}
            disabled={isSending || message.trim() === ''}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {isSending ? 'Gönderiliyor...' : 'Mesaj Gönder'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageModal;