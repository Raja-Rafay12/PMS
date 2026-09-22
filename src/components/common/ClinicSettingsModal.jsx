import React, { useState } from 'react';
import { usePatients } from '../../context/PatientContext';
import { X, Building2, Stethoscope, Phone, MapPin, Award } from 'lucide-react';

export const ClinicSettingsModal = ({ isOpen, onClose }) => {
  const { clinicConfig, setClinicConfig, showToast } = usePatients();
  const [formData, setFormData] = useState({ ...clinicConfig });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setClinicConfig(formData);
    showToast('Clinic & doctor profile updated');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Building2 size={22} color="#0284c7" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Clinic & Doctor Profile</h3>
          </div>
          <button
            type="button"
            className="btn-outline"
            style={{ padding: '6px', borderRadius: '50%', border: 'none' }}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 20 }}>
          This information will be displayed on the top header, patient consultation records, and printed prescriptions.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Doctor Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.doctorName}
              onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Qualifications & Specialty</label>
            <input
              type="text"
              className="form-input"
              value={formData.qualifications}
              onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
              placeholder="e.g. MBBS, FCPS (Internal Medicine)"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Clinic / Hospital Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Medical Registration No.</label>
              <input
                type="text"
                className="form-input"
                value={formData.regNumber}
                onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                placeholder="e.g. PMC-48201-P"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Clinic Phone / Contact</label>
              <input
                type="text"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Clinic Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address & Location</label>
            <input
              type="text"
              className="form-input"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
