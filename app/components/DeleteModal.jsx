import { useEffect } from 'react';

export default function ConfirmModal({ isOpen, onClose, onConfirm }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white p-4 rounded-lg shadow-lg z-10">
        <h2 className="text-xl font-bold mb-4">Bu resmi silmek istediğinizden emin misiniz?</h2>
        <div className="flex justify-end">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            onClick={onConfirm}
          >
            Evet
          </button>
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={onClose}
          >
            Hayır
          </button>
        </div>
      </div>
    </div>
  );
}
