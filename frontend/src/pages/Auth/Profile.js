import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export default function Profile() {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || ''
  });

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateProfile(formData);
    setEditMode(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="profile-page">
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--spacing-3xl) var(--spacing-lg)' }}>
        <h1>My Profile</h1>

        <div className="profile-card" style={{ background: 'white', padding: 'var(--spacing-2xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          <div className="profile-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold' }}>
              {user?.firstName?.charAt(0)?.toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0 }}>{user?.firstName} {user?.lastName}</h2>
              <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)' }}>{user?.email}</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editMode ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)' }}>
              <div className="form-group">
                <label>First Name</label>
                <input 
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input 
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input 
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <button 
                  className="btn btn-primary btn-large"
                  onClick={handleSave}
                  style={{ width: '100%' }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
              <div style={{ padding: 'var(--spacing-lg)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>Email</div>
                <div>{user?.email}</div>
              </div>
              <div style={{ padding: 'var(--spacing-lg)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>Phone</div>
                <div>{user?.phone || 'Not provided'}</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 'var(--spacing-3xl)', textAlign: 'center' }}>
          <button 
            className="btn btn-outline"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
