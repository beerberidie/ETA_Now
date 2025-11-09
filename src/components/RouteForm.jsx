import React, { useState } from 'react';
import { maps } from '../utils/maps.js';

function RouteForm({ onSubmit, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    fromLocation: initialData?.fromLocation || '',
    toLocation: initialData?.toLocation || '',
    targetArrivalTime: initialData?.targetArrivalTime || '',
    notificationsEnabled: initialData?.notificationsEnabled || false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Route name is required';
    }

    if (!formData.fromLocation.trim()) {
      newErrors.fromLocation = 'From location is required';
    }

    if (!formData.toLocation.trim()) {
      newErrors.toLocation = 'To location is required';
    }

    if (!formData.targetArrivalTime) {
      newErrors.targetArrivalTime = 'Target arrival time is required';
    }

    // Validate locations
    if (formData.fromLocation && !maps.isValidLocation(formData.fromLocation)) {
      newErrors.fromLocation = 'Please enter a valid location';
    }

    if (formData.toLocation && !maps.isValidLocation(formData.toLocation)) {
      newErrors.toLocation = 'Please enter a valid location';
    }

    // Check if from and to locations are the same
    if (formData.fromLocation.trim().toLowerCase() === formData.toLocation.trim().toLowerCase()) {
      newErrors.toLocation = 'From and To locations cannot be the same';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Test the route by calculating ETA
      await maps.calculateETA(formData.fromLocation, formData.toLocation);
      
      // If successful, submit the form
      onSubmit(formData);
    } catch (error) {
      console.error('Error validating route:', error);
      setErrors({
        general: 'Unable to calculate route. Please check your locations and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getDefaultArrivalTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1); // Default to 1 hour from now
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.general && (
        <div className="error" style={{ marginBottom: '15px' }}>
          {errors.general}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">Route Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="e.g., Morning Commute, Trip to Airport"
          required
        />
        {errors.name && <div className="error">{errors.name}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="fromLocation">From Location:</label>
        <input
          type="text"
          id="fromLocation"
          name="fromLocation"
          value={formData.fromLocation}
          onChange={handleInputChange}
          placeholder="e.g., 123 Main St, New York, NY or Home"
          required
        />
        {errors.fromLocation && <div className="error">{errors.fromLocation}</div>}
        <small style={{ color: '#666', fontSize: '14px' }}>
          Enter an address, landmark, or place name
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="toLocation">To Location:</label>
        <input
          type="text"
          id="toLocation"
          name="toLocation"
          value={formData.toLocation}
          onChange={handleInputChange}
          placeholder="e.g., 456 Work Ave, New York, NY or Office"
          required
        />
        {errors.toLocation && <div className="error">{errors.toLocation}</div>}
        <small style={{ color: '#666', fontSize: '14px' }}>
          Enter an address, landmark, or place name
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="targetArrivalTime">Target Arrival Time:</label>
        <input
          type="time"
          id="targetArrivalTime"
          name="targetArrivalTime"
          value={formData.targetArrivalTime}
          onChange={handleInputChange}
          required
        />
        {errors.targetArrivalTime && <div className="error">{errors.targetArrivalTime}</div>}
        <small style={{ color: '#666', fontSize: '14px' }}>
          When do you need to arrive? Current time: {getCurrentTime()}
        </small>
      </div>

      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="notificationsEnabled"
            checked={formData.notificationsEnabled}
            onChange={handleInputChange}
            style={{ marginRight: '8px' }}
          />
          Enable departure notifications (15 minutes before)
        </label>
        <small style={{ color: '#666', fontSize: '14px' }}>
          Get notified when it's time to leave
        </small>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button 
          type="submit" 
          className="btn"
          disabled={loading}
        >
          {loading ? 'Validating Route...' : (initialData ? 'Update Route' : 'Add Route')}
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default RouteForm;
