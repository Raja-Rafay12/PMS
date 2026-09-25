import React from 'react';

/**
 * Universal dynamic letterhead header renderer
 * Reads the ordered `sections` array and renders each section according to its
 * drag-and-drop sequence, orientation (horizontal vs vertical), and alignment.
 */
export const HeaderSectionRenderer = ({ sections = [], data = {}, isPreview = false }) => {
  const {
    doctorName = 'Consultant Physician',
    specialtyTitle = '',
    qualifications = 'MBBS, FCPS',
    regNumber = '',
    pmcNumber = '',
    clinicName = 'PatientCare Medical Center',
    tagline = '',
    address = '',
    phone = '',
    email = '',
    consultationHours = '',
    locations = [],
    activeLocation = null
  } = data;

  const effectivePmc = regNumber || pmcNumber || '';
  const currentHospitalName = activeLocation ? activeLocation.hospitalName : (locations[0]?.hospitalName || clinicName);
  const currentDepartment = activeLocation ? (activeLocation.department || activeLocation.address) : (locations[0]?.department || address || 'Outpatient Department');
  const currentAddress = activeLocation?.address || locations[0]?.address || address || '';
  const currentPhone = activeLocation?.phone || locations[0]?.phone || phone || '';
  const currentHours = activeLocation?.consultationHours || locations[0]?.consultationHours || consultationHours || '';

  // Filter only enabled sections
  const enabledSections = (Array.isArray(sections) && sections.length > 0)
    ? sections.filter(s => s.enabled !== false)
    : [
        { id: 'doctor_info', layout: 'horizontal', align: 'left' },
        { id: 'hospital_info', layout: 'horizontal', align: 'right' },
        { id: 'divider_line', layout: 'vertical', align: 'center', dividerStyle: 'solid' },
        { id: 'schedule_info', layout: 'vertical', align: 'left', schedulePosition: 'banner' }
      ];

  // Group sections into rows
  const rows = [];
  let pendingRow = [];

  enabledSections.forEach((section) => {
    if (section.id === 'divider_line') {
      if (pendingRow.length > 0) {
        rows.push({ type: 'content', items: pendingRow });
        pendingRow = [];
      }
      rows.push({ type: 'divider', item: section });
      return;
    }

    if (section.layout === 'horizontal' && (section.align === 'left' || section.align === 'right')) {
      if (pendingRow.length === 0) {
        pendingRow.push(section);
      } else if (pendingRow.length === 1 && pendingRow[0].layout === 'horizontal' && pendingRow[0].align !== section.align) {
        pendingRow.push(section);
        rows.push({ type: 'content', items: pendingRow });
        pendingRow = [];
      } else {
        rows.push({ type: 'content', items: pendingRow });
        pendingRow = [section];
      }
    } else {
      if (pendingRow.length > 0) {
        rows.push({ type: 'content', items: pendingRow });
        pendingRow = [];
      }
      rows.push({ type: 'content', items: [section] });
    }
  });

  if (pendingRow.length > 0) {
    rows.push({ type: 'content', items: pendingRow });
  }

  // Section renderers
  const renderDoctorInfo = (section) => {
    const align = section.align || (section.layout === 'horizontal' ? 'left' : 'left');
    const flexAlign = align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start';

    return (
      <div style={{ textAlign: align, display: 'flex', flexDirection: 'column', alignItems: flexAlign, width: '100%' }}>
        <h2 style={{ fontSize: isPreview ? '1.25rem' : '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
          {doctorName}
        </h2>
        {specialtyTitle && (
          <div style={{ fontSize: isPreview ? '0.8rem' : '0.9rem', color: '#0284c7', fontWeight: 700, marginTop: 2 }}>
            {specialtyTitle}
          </div>
        )}
        <div style={{ fontSize: isPreview ? '0.775rem' : '0.825rem', color: '#334155', fontWeight: 600, marginTop: 2, whiteSpace: 'pre-line', lineHeight: 1.35 }}>
          {qualifications}
        </div>
        {effectivePmc && (
          <div style={{ fontSize: isPreview ? '0.725rem' : '0.775rem', color: '#64748b', marginTop: 2 }}>
            PMDC / PMC Reg: <strong style={{ color: '#0f172a' }}>{effectivePmc}</strong>
          </div>
        )}
      </div>
    );
  };

  const renderHospitalInfo = (section) => {
    const align = section.align || (section.layout === 'horizontal' ? 'right' : 'left');
    const flexAlign = align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start';

    return (
      <div style={{ textAlign: align, display: 'flex', flexDirection: 'column', alignItems: flexAlign, width: '100%' }}>
        <h3 style={{ fontSize: isPreview ? '1.05rem' : '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          {currentHospitalName}
        </h3>
        {tagline && (
          <div style={{ fontSize: isPreview ? '0.7rem' : '0.75rem', color: '#64748b', marginTop: 2 }}>
            {tagline}
          </div>
        )}
        <div style={{ fontSize: isPreview ? '0.75rem' : '0.775rem', color: '#334155', fontWeight: 600, marginTop: 3 }}>
          {currentDepartment}
        </div>
        {currentAddress && currentDepartment !== currentAddress && (
          <div style={{ fontSize: isPreview ? '0.7rem' : '0.725rem', color: '#64748b' }}>
            {currentAddress}
          </div>
        )}
        {currentPhone && (
          <div style={{ fontSize: isPreview ? '0.725rem' : '0.775rem', color: '#0284c7', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: 2 }}>
            Ph: {currentPhone}
          </div>
        )}
      </div>
    );
  };

  const renderScheduleInfo = (section) => {
    const isCompact = section.schedulePosition === 'compact';

    if (activeLocation && activeLocation.consultationHours) {
      return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4, padding: isPreview ? '5px 10px' : '6px 12px', fontSize: isPreview ? '0.725rem' : '0.75rem', color: '#475569', width: '100%' }}>
          <span>🏥 <strong>{activeLocation.hospitalName}:</strong> {activeLocation.consultationHours} {activeLocation.department ? `· ${activeLocation.department}` : ''}</span>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Official Clinical Record</span>
        </div>
      );
    }

    if (locations.length > 1) {
      if (isCompact) {
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 4, padding: '6px 12px', fontSize: '0.725rem', width: '100%' }}>
            {locations.map((loc, idx) => (
              <span key={loc.id || idx} style={{ color: '#334155' }}>
                🏥 <strong>{loc.hospitalName}:</strong> {loc.consultationHours || 'OPD'} {loc.phone ? `(${loc.phone})` : ''}
              </span>
            ))}
          </div>
        );
      }

      return (
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: isPreview ? '8px 10px' : '9px 12px', width: '100%' }}>
          <div style={{ fontSize: '0.675rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.04em', display: 'flex', justifyContent: 'space-between' }}>
            <span>Clinical Practice Chambers &amp; Schedule</span>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Active Multi-Hospital Practice</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: locations.length === 2 ? '1fr 1fr' : 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
            {locations.map((loc, idx) => (
              <div key={loc.id || idx} style={{ borderLeft: '2px solid #0284c7', paddingLeft: 8, fontSize: isPreview ? '0.7rem' : '0.735rem' }}>
                <div style={{ fontWeight: 800, color: '#0f172a' }}>
                  🏥 {loc.hospitalName}
                </div>
                {loc.department && <div style={{ color: '#334155', fontWeight: 600 }}>{loc.department}</div>}
                {loc.address && <div style={{ color: '#64748b', fontSize: '0.685rem' }}>{loc.address}</div>}
                {loc.consultationHours && (
                  <div style={{ color: '#0284c7', fontWeight: 700, marginTop: 1 }}>
                    🕒 {loc.consultationHours}
                  </div>
                )}
                {loc.phone && (
                  <div style={{ color: '#475569', fontFamily: 'var(--font-mono)', fontSize: '0.675rem' }}>
                    📞 {loc.phone}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (currentHours) {
      return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4, padding: isPreview ? '5px 10px' : '6px 12px', fontSize: isPreview ? '0.725rem' : '0.75rem', color: '#475569', width: '100%' }}>
          <span>🕒 <strong>Consultation Hours:</strong> {currentHours}</span>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Official Clinical Record</span>
        </div>
      );
    }

    return null;
  };

  const renderContactInfo = (section) => {
    const align = section.align || 'left';
    const flexAlign = align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start';

    return (
      <div style={{ textAlign: align, display: 'flex', flexDirection: 'column', alignItems: flexAlign, width: '100%', fontSize: isPreview ? '0.725rem' : '0.75rem', color: '#475569' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start' }}>
          {currentAddress && <span>📍 {currentAddress}</span>}
          {currentPhone && <span>📞 <strong>Helpline:</strong> {currentPhone}</span>}
          {email && <span>✉️ {email}</span>}
        </div>
      </div>
    );
  };

  const renderBlock = (section) => {
    switch (section.id) {
      case 'doctor_info':
        return renderDoctorInfo(section);
      case 'hospital_info':
        return renderHospitalInfo(section);
      case 'schedule_info':
        return renderScheduleInfo(section);
      case 'contact_info':
        return renderContactInfo(section);
      default:
        return null;
    }
  };

  const renderDivider = (item) => {
    const dividerStyle = item.dividerStyle || 'solid';
    const dividerCss = {
      margin: '12px 0 16px 0',
      width: '100%',
      ...(dividerStyle === 'double'
        ? { borderBottom: '4px double #0f172a' }
        : dividerStyle === 'cyan-accent'
        ? { borderBottom: '3px solid #0284c7', boxShadow: '0 2px 4px rgba(2, 132, 199, 0.15)' }
        : dividerStyle === 'minimal'
        ? { borderBottom: '1px solid #cbd5e1' }
        : dividerStyle === 'dotted'
        ? { borderBottom: '2px dotted #94a3b8' }
        : dividerStyle === 'none'
        ? { borderBottom: 'none' }
        : { borderBottom: '2px solid #0f172a' })
    };

    return <div key="divider-line" style={dividerCss} />;
  };

  return (
    <div style={{ width: '100%', marginBottom: 12 }}>
      {rows.map((row, rIdx) => {
        if (row.type === 'divider') {
          return renderDivider(row.item);
        }

        if (row.items.length === 2) {
          // Sort items so left is on left, right is on right
          const leftItem = row.items.find(i => i.align === 'left') || row.items[0];
          const rightItem = row.items.find(i => i.align === 'right') || row.items[1];

          return (
            <div
              key={`row-${rIdx}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                width: '100%',
                marginBottom: 12,
                gap: 16
              }}
            >
              <div style={{ flex: '1 1 50%', maxWidth: '52%' }}>
                {renderBlock(leftItem)}
              </div>
              <div style={{ flex: '1 1 50%', maxWidth: '48%', display: 'flex', justifyContent: 'flex-end' }}>
                {renderBlock(rightItem)}
              </div>
            </div>
          );
        }

        const singleItem = row.items[0];
        return (
          <div key={`row-${rIdx}`} style={{ width: '100%', marginBottom: 12 }}>
            {renderBlock(singleItem)}
          </div>
        );
      })}
    </div>
  );
};
