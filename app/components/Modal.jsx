import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, children }) {
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
      <div className="fixed inset-0 bg-black opacity-70" onClick={onClose}></div>
      <div className="bg-white p-1 rounded-lg shadow-lg z-10">
        {children}
        <button
          className="absolute text-lg top-0 right-0 m-4 text-red-700 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
}
