import React, { useState, useEffect } from 'react';
import { usePatients } from '../../context/PatientContext';

export const PatientForm = ({ isEdit = false }) => {
  const { activePatient, addPatient, updatePatient, navigateTo } = usePatients();

  const [formData, setFormData] = useState({
    name: '',
    ageSource: 'age_only', // 'dob' or 'age_only'
    age: '',
    dob: '',
    gender: 'Male',
    phone: '',
    bloodGroup: '',
    address: '',
    emergencyContact: {
      name: '',
      phone: '',
      relation: ''
    }
  });

  useEffect(() => {
    if (isEdit && activePatient) {
      setFormData({
        name: activePatient.name || '',
        ageSource: activePatient.ageSource || 'age_only',
        age: activePatient.age || '',
        dob: activePatient.dob || '',
        gender: activePatient.gender || 'Male',
        phone: activePatient.phone || '',
        bloodGroup: activePatient.bloodGroup || '',
        address: activePatient.address || '',
        emergencyContact: {
          name: activePatient.emergencyContact?.name || '',
          phone: activePatient.emergencyContact?.phone || '',
          relation: activePatient.emergencyContact?.relation || ''
        }
      });
    }
  }, [isEdit, activePatient]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Patient name is required');
      return;
    }

    if (!formData.phone.trim()) {
      alert('Phone number is required (used as MRN)');
      return;
    }

    if (formData.ageSource === 'dob' && !formData.dob) {
      alert('Please enter date of birth');
      return;
    }

    if (formData.ageSource === 'age_only' && !formData.age) {
      alert('Please enter age in years');
      return;
    }

    if (isEdit && activePatient) {
      updatePatient(activePatient.id, formData);
      navigateTo('detail', activePatient.id);
    } else {
      const newId = addPatient(formData);
      navigateTo('detail', newId);
    }
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <button
        type="button"
        className="breadcrumb-back"
        onClick={() => {
          if (isEdit && activePatient) navigateTo('detail', activePatient.id);
          else navigateTo('list');
        }}
      >
        &larr; All patients
      </button>

      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">{isEdit ? 'Edit patient' : 'Add patient'}</h1>
        <p className="page-subtitle">Phone is unique and acts as the MRN.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Demographics */}
          <div className="form-section">
            <h2 className="form-section-title">Demographics</h2>

            <div className="form-group">
              <label className="form-label">Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Zain Safdar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Age source *</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="ageSource"
                    value="dob"
                    checked={formData.ageSource === 'dob'}
                    onChange={() => setFormData({ ...formData, ageSource: 'dob' })}
                  />
                  <span>Date of birth (known)</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="ageSource"
                    value="age_only"
                    checked={formData.ageSource === 'age_only'}
                    onChange={() => setFormData({ ...formData, ageSource: 'age_only' })}
                  />
                  <span>Age only (DOB unknown)</span>
                </label>
              </div>
            </div>

            <div className="form-row">
              {formData.ageSource === 'dob' ? (
                <div className="form-group">
                  <label className="form-label">Date of birth *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    required
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Age (years) *</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 35"
                    min="0"
                    max="130"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select
                  className="form-select"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone (used as MRN) *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. +92 300 1234567 or +1 555 0100"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Blood group</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. O+, B+, A-"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Residential address..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="form-section">
            <h2 className="form-section-title">Emergency Contact</h2>

            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Contact person name"
                  value={formData.emergencyContact.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Emergency phone number"
                  value={formData.emergencyContact.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Relation</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Spouse, Parent, Brother"
                  value={formData.emergencyContact.relation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: { ...formData.emergencyContact, relation: e.target.value }
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                if (isEdit && activePatient) navigateTo('detail', activePatient.id);
                else navigateTo('list');
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Save changes' : 'Create patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
