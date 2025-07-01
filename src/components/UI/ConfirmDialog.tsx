import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-red-400',
          button: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
          border: 'border-red-500/20',
          bg: 'bg-red-500/10'
        };
      case 'warning':
        return {
          icon: 'text-yellow-400',
          button: 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700',
          border: 'border-yellow-500/20',
          bg: 'bg-yellow-500/10'
        };
      case 'info':
        return {
          icon: 'text-blue-400',
          button: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
          border: 'border-blue-500/20',
          bg: 'bg-blue-500/10'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl max-w-md w-full border border-white/10 shadow-2xl">
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className={`w-12 h-12 ${colors.bg} ${colors.border} rounded-full flex items-center justify-center border`}>
              <AlertTriangle className={`w-6 h-6 ${colors.icon}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-300 leading-relaxed mb-6">{message}</p>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 border border-white/20 text-white py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 ${colors.button} text-white py-3 rounded-xl font-semibold transition-all duration-300`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;