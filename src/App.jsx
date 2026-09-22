import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PatientProvider, usePatients } from './context/PatientContext';
import { Header } from './components/common/Header';
import { Toast } from './components/common/Toast';
import { LoginPage } from './components/auth/LoginPage';
import { PatientList } from './components/patients/PatientList';
import { PatientForm } from './components/patients/PatientForm';
import { PatientDetail } from './components/patients/PatientDetail';
import { PrintSummaryView } from './components/print/PrintSummaryView';
import { AdminDashboard } from './components/admin/AdminDashboard';

const AppContent = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { viewMode } = usePatients();

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <Toast />
      </>
    );
  }

  // 1. ADMIN PORTAL: Strictly isolated for Administrator
  if (isAdmin) {
    return (
      <div className="app-container">
        <Header />
        <main className="main-content">
          <AdminDashboard />
        </main>
        <Toast />
      </div>
    );
  }

  // 2. CLINICAL PORTAL: Strictly isolated for Doctor
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {viewMode === 'list' && <PatientList />}
        {viewMode === 'new' && <PatientForm isEdit={false} />}
        {viewMode === 'edit-patient' && <PatientForm isEdit={true} />}
        {viewMode === 'detail' && <PatientDetail />}
        {viewMode === 'print' && <PrintSummaryView />}
      </main>
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PatientProvider>
        <AppContent />
      </PatientProvider>
    </AuthProvider>
  );
}
