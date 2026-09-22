import React from 'react';
import { usePatients } from '../../context/PatientContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const Toast = () => {
  const { toast } = usePatients();
  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className="toast-container">
      <div className={`toast ${isError ? 'toast-error' : ''}`}>
        {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} color="#4ade80" />}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
