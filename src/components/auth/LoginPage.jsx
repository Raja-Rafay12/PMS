import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Activity,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Stethoscope,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const LoginPage = () => {
  const { loginDoctor, loginAdmin } = useAuth();

  // Check if current URL indicates admin mode
  const checkIsAdminUrl = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return path.includes('admin') || hash.includes('admin') || search.includes('admin');
  };

  // Mode: 'doctor' (default) or 'admin' (accessed via URL /admin or pressing key 'a')
  const [isAdminMode, setIsAdminMode] = useState(checkIsAdminUrl);

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberWorkstation, setRememberWorkstation] = useState(true);

  // Clean URL: strip any lingering '#' or set clean '/admin' path
  useEffect(() => {
    if (!isAdminMode) {
      if (window.location.hash || window.location.pathname.toLowerCase().includes('admin') || window.location.search.toLowerCase().includes('admin')) {
        window.history.replaceState(null, '', '/');
      }
    } else {
      if (window.location.hash || !window.location.pathname.toLowerCase().includes('admin')) {
        window.history.replaceState(null, '', '/admin');
      }
    }
  }, [isAdminMode]);

  // URL listener and Secret Key listener
  useEffect(() => {
    const handleUrlChange = () => {
      const hasAdmin = checkIsAdminUrl();
      setIsAdminMode(hasAdmin);
      setErrorMessage('');
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    // Secret trigger: Type specific letter 'a' (when outside inputs) or 'Ctrl+Shift+A' or type 'admin'
    let typedBuffer = '';
    let bufferTimer = null;

    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isInputActive = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');

      // 1. Secret hotkey: Ctrl + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminMode(prev => {
          const next = !prev;
          if (next) {
            window.history.pushState(null, '', '/admin');
          } else {
            window.history.pushState(null, '', '/');
          }
          return next;
        });
        setErrorMessage('');
        return;
      }

      // 2. Secret single letter 'a' / 'A' when user is on the screen without an input focused
      if (!isInputActive && (e.key === 'a' || e.key === 'A') && !e.ctrlKey && !e.altKey && !e.metaKey) {
        setIsAdminMode(true);
        window.history.pushState(null, '', '/admin');
        setErrorMessage('');
        return;
      }

      // 3. Secret typed sequence 'admin'
      if (!isInputActive && e.key && e.key.length === 1) {
        typedBuffer += e.key.toLowerCase();
        clearTimeout(bufferTimer);
        bufferTimer = setTimeout(() => {
          typedBuffer = '';
        }, 1500);

        if (typedBuffer.includes('admin')) {
          typedBuffer = '';
          setIsAdminMode(true);
          window.history.pushState(null, '', '/admin');
          setErrorMessage('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(bufferTimer);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage(isAdminMode ? 'Please enter your Admin ID or Email.' : 'Please enter your Doctor Email or Username.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      let res;
      if (isAdminMode) {
        res = await loginAdmin(identifier, password);
      } else {
        res = await loginDoctor(identifier, password);
      }

      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Authentication error.');
    }
  };

  return (
    <div className="login-viewport">
      {/* Background Visual Elements */}
      <div className="login-bg-glow glow-1" />
      <div className="login-bg-glow glow-2" />

      <div className="login-container">
        {/* Left Side: Brand & Clinical Environment */}
        <div className="login-hero-panel">
          <div className="hero-brand">
            <div className="hero-brand-icon">
              <Activity size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="hero-brand-title">PatientCare EHR</h1>
              <p className="hero-brand-subtitle">Clinical Information &amp; Practice Suite</p>
            </div>
          </div>

          <div className="hero-content">
            <div className="hero-tag">
              <ShieldCheck size={16} />
              <span>Medical Records &amp; Clinical Audit</span>
            </div>

            <h2 className="hero-heading">
              {isAdminMode ? (
                <>
                  System Administration <br />
                  <span className="hero-gradient-text">&amp; Master Controls</span>
                </>
              ) : (
                <>
                  Outpatient Diagnostics, <br />
                  <span className="hero-gradient-text">Prescriptions &amp; Notes</span>
                </>
              )}
            </h2>

            <p className="hero-desc">
              {isAdminMode
                ? 'Authorized administrator management console for doctor credentialing, clinic branding, security audit logs, and encrypted database operations.'
                : 'Dedicated clinical workstation for licensed physicians. Manage patient histories, physical vitals, bilingual prescriptions (Rx), and private doctor impressions.'}
            </p>

            <div className="hero-feature-list">
              {isAdminMode ? (
                <>
                  <div className="hero-feature-item">
                    <CheckCircle2 size={16} className="feature-icon" />
                    <span>Doctor Credentialing &amp; Account Licensing</span>
                  </div>
                  <div className="hero-feature-item">
                    <CheckCircle2 size={16} className="feature-icon" />
                    <span>Clinic Master Letterhead &amp; PMC Configuration</span>
                  </div>
                  <div className="hero-feature-item">
                    <CheckCircle2 size={16} className="feature-icon" />
                    <span>Security Audit Logs &amp; Database Disaster Recovery</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="hero-feature-item">
                    <CheckCircle2 size={16} className="feature-icon" />
                    <span>Confidential Doctor-Only Personal Perception Log</span>
                  </div>
                  <div className="hero-feature-item">
                    <CheckCircle2 size={16} className="feature-icon" />
                    <span>Bilingual English &amp; Urdu Prescription Generator</span>
                  </div>
                  <div className="hero-feature-item">
                    <CheckCircle2 size={16} className="feature-icon" />
                    <span>Encrypted Local Storage with Export/Restore Capability</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="hero-footer">
            <div className="hero-security-note">
              <Lock size={14} />
              <span>Secured Session · HIPAA Compliant Local Architecture</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="login-form-panel">
          <div className="login-card-header">
            <div className={`login-mode-badge ${isAdminMode ? 'admin-badge' : 'doctor-badge'}`}>
              {isAdminMode ? (
                <>
                  <ShieldAlert size={14} />
                  <span>ADMINISTRATIVE ACCESS</span>
                </>
              ) : (
                <>
                  <Stethoscope size={14} />
                  <span>PHYSICIAN SIGN IN</span>
                </>
              )}
            </div>

            <h2 className="login-card-title">
              {isAdminMode ? 'System Admin Portal' : 'Welcome Back, Doctor'}
            </h2>
            <p className="login-card-subtitle">
              {isAdminMode
                ? 'Enter your administrative credentials to configure the clinic.'
                : 'Enter your physician credentials to access your patient panel.'}
            </p>
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="login-error-banner" role="alert">
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label htmlFor="login-identifier" className="login-label">
                {isAdminMode ? 'Admin ID / Email' : 'Doctor Email or Username'}
              </label>
              <div className="login-input-wrapper">
                {isAdminMode ? (
                  <Building2 size={18} className="login-input-icon" />
                ) : (
                  <Mail size={18} className="login-input-icon" />
                )}
                <input
                  id="login-identifier"
                  type="text"
                  className="login-input"
                  placeholder={isAdminMode ? 'e.g. admin or admin@clinic.org' : 'e.g. doctor or doctor@clinic.org'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div className="login-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="login-password" className="login-label">
                  {isAdminMode ? 'Master Passkey' : 'Doctor Password'}
                </label>
              </div>
              <div className="login-input-wrapper">
                <KeyRound size={18} className="login-input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(prev => !prev)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="login-options-row">
              <label className="login-remember-label">
                <input
                  type="checkbox"
                  checked={rememberWorkstation}
                  onChange={(e) => setRememberWorkstation(e.target.checked)}
                />
                <span>Keep workstation signed in</span>
              </label>
            </div>

            <button
              type="submit"
              className={`btn btn-primary login-submit-btn ${isAdminMode ? 'btn-admin' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>{isAdminMode ? 'Enter Admin Console' : 'Sign In as Doctor'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
