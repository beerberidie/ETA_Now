import React, { useState, useEffect } from 'react';
import { auth } from '../utils/auth.js';
import { storage } from '../utils/storage.js';
import { notifications } from '../utils/notifications.js';

function Settings({ user, onUserUpdate }) {
  const [routes, setRoutes] = useState([]);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email
  });
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadRoutes();
    setNotificationPermission(notifications.getPermission());
  }, []);

  const loadRoutes = () => {
    try {
      const userRoutes = storage.getRoutes();
      setRoutes(userRoutes);
    } catch (error) {
      console.error('Error loading routes:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const updatedUser = auth.updateProfile(profileData);
      onUserUpdate(updatedUser);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleDeleteRoute = (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        storage.deleteRoute(routeId);
        setRoutes(routes.filter(route => route.id !== routeId));
        setMessage('Route deleted successfully!');
      } catch (error) {
        setMessage('Error deleting route: ' + error.message);
      }
    }
  };

  const handleClearAllRoutes = () => {
    if (window.confirm('Are you sure you want to delete ALL routes? This cannot be undone.')) {
      try {
        storage.clearRoutes();
        setRoutes([]);
        setMessage('All routes deleted successfully!');
      } catch (error) {
        setMessage('Error clearing routes: ' + error.message);
      }
    }
  };

  const handleRequestNotifications = async () => {
    try {
      const permission = await notifications.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        setMessage('Notifications enabled successfully!');
        notifications.showTestNotification();
      } else {
        setMessage('Notification permission denied.');
      }
    } catch (error) {
      setMessage('Error requesting notifications: ' + error.message);
    }
  };

  const handleTestNotification = () => {
    notifications.showTestNotification();
    setMessage('Test notification sent!');
  };

  const handleExportData = () => {
    try {
      const data = storage.exportUserData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `eta-now-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage('Data exported successfully!');
    } catch (error) {
      setMessage('Error exporting data: ' + error.message);
    }
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const importedRoutes = storage.importUserData(data);
        setRoutes(importedRoutes);
        setMessage(`Successfully imported ${importedRoutes.length} routes!`);
      } catch (error) {
        setMessage('Error importing data: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container">
      <h2>Settings</h2>

      {message && (
        <div className={message.includes('Error') ? 'error' : 'success'}>
          {message}
        </div>
      )}

      {/* Profile Settings */}
      <div className="card">
        <h3>Profile Settings</h3>
        <form onSubmit={handleProfileUpdate}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <h3>Notification Settings</h3>
        <p>
          <strong>Status:</strong> {
            notificationPermission === 'granted' ? '✅ Enabled' :
            notificationPermission === 'denied' ? '❌ Blocked' :
            '⚠️ Not requested'
          }
        </p>
        
        {notificationPermission !== 'granted' && (
          <button 
            onClick={handleRequestNotifications}
            className="btn"
            style={{ marginRight: '10px' }}
          >
            Enable Notifications
          </button>
        )}
        
        {notificationPermission === 'granted' && (
          <button 
            onClick={handleTestNotification}
            className="btn btn-secondary"
          >
            Test Notification
          </button>
        )}
        
        <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
          <p>Notifications will alert you 15 minutes before your recommended departure time.</p>
          {notificationPermission === 'denied' && (
            <p style={{ color: '#dc3545' }}>
              Notifications are blocked. Please enable them in your browser settings and refresh the page.
            </p>
          )}
        </div>
      </div>

      {/* Route Management */}
      <div className="card">
        <h3>Route Management</h3>
        <p>You have {routes.length} saved route{routes.length !== 1 ? 's' : ''}.</p>
        
        {routes.length > 0 && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <h4>Your Routes:</h4>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {routes.map(route => (
                  <div 
                    key={route.id}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '8px',
                      borderBottom: '1px solid #eee'
                    }}
                  >
                    <div>
                      <strong>{route.name}</strong>
                      <br />
                      <small>{route.fromLocation} → {route.toLocation}</small>
                    </div>
                    <button
                      onClick={() => handleDeleteRoute(route.id)}
                      className="btn btn-danger"
                      style={{ fontSize: '12px', padding: '4px 8px' }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={handleClearAllRoutes}
              className="btn btn-danger"
            >
              Delete All Routes
            </button>
          </>
        )}
      </div>

      {/* Data Management */}
      <div className="card">
        <h3>Data Management</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={handleExportData}
            className="btn btn-secondary"
          >
            Export Data
          </button>
          
          <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
            Import Data
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              style={{ display: 'none' }}
            />
          </label>
        </div>
        
        <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
          <p>Export your routes and settings as a backup, or import data from a previous export.</p>
        </div>
      </div>

      {/* Account Info */}
      <div className="card">
        <h3>Account Information</h3>
        <p><strong>User ID:</strong> {user.id}</p>
        <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        <p><strong>Data Storage:</strong> Local browser storage</p>
        
        <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
          <p>This is a demo application. All data is stored locally in your browser and will be lost if you clear your browser data.</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
