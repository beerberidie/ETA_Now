import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage.js';
import { maps } from '../utils/maps.js';
import { notifications } from '../utils/notifications.js';
import RouteForm from './RouteForm.jsx';
import RouteCard from './RouteCard.jsx';

function Dashboard({ user }) {
  const [routes, setRoutes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [etaData, setEtaData] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRoutes();
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(refreshETAs, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (routes.length > 0) {
      refreshETAs();
    }
  }, [routes]);

  const loadRoutes = () => {
    try {
      const userRoutes = storage.getRoutes();
      setRoutes(userRoutes);
    } catch (error) {
      console.error('Error loading routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshETAs = async () => {
    if (routes.length === 0) return;
    
    setRefreshing(true);
    const newEtaData = {};

    try {
      for (const route of routes) {
        try {
          const eta = await maps.calculateETA(route.fromLocation, route.toLocation);
          const departureInfo = maps.calculateDepartureTime(
            route.targetArrivalTime, 
            eta.durationInTraffic / 60
          );
          
          newEtaData[route.id] = {
            ...eta,
            ...departureInfo,
            lastUpdated: new Date()
          };

          // Check if notification should be sent
          if (route.notificationsEnabled && 
              notifications.shouldSendDepartureNotification(departureInfo.departureTime)) {
            notifications.showDepartureNotification(
              route.name,
              departureInfo.departureTimeString,
              eta.durationInTrafficText
            );
          }
        } catch (error) {
          console.error(`Error calculating ETA for route ${route.id}:`, error);
        }
      }
      
      setEtaData(newEtaData);
    } catch (error) {
      console.error('Error refreshing ETAs:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddRoute = async (routeData) => {
    try {
      const newRoute = storage.saveRoute(routeData);
      setRoutes([...routes, newRoute]);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving route:', error);
      alert('Error saving route: ' + error.message);
    }
  };

  const handleDeleteRoute = (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        storage.deleteRoute(routeId);
        setRoutes(routes.filter(route => route.id !== routeId));
        // Remove ETA data for deleted route
        const newEtaData = { ...etaData };
        delete newEtaData[routeId];
        setEtaData(newEtaData);
      } catch (error) {
        console.error('Error deleting route:', error);
        alert('Error deleting route: ' + error.message);
      }
    }
  };

  const handleToggleNotifications = async (routeId) => {
    try {
      const route = routes.find(r => r.id === routeId);
      if (!route) return;

      // Request notification permission if enabling notifications
      if (!route.notificationsEnabled) {
        try {
          await notifications.requestPermission();
        } catch (error) {
          alert('Notification permission denied. Please enable notifications in your browser settings.');
          return;
        }
      }

      const updatedRoute = storage.updateRoute(routeId, {
        notificationsEnabled: !route.notificationsEnabled
      });

      setRoutes(routes.map(r => r.id === routeId ? updatedRoute : r));
    } catch (error) {
      console.error('Error toggling notifications:', error);
      alert('Error updating notifications: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your routes...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Your Routes</h2>
        <div>
          <button 
            onClick={refreshETAs}
            className="btn btn-secondary"
            disabled={refreshing}
            style={{ marginRight: '10px' }}
          >
            {refreshing ? 'Refreshing...' : 'Refresh ETAs'}
          </button>
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn"
          >
            Add New Route
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>Add New Route</h3>
          <RouteForm 
            onSubmit={handleAddRoute}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {routes.length === 0 ? (
        <div className="card">
          <h3>No routes yet</h3>
          <p>Add your first route to start tracking travel times!</p>
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn"
          >
            Add Your First Route
          </button>
        </div>
      ) : (
        <div className="route-grid">
          {routes.map(route => (
            <RouteCard
              key={route.id}
              route={route}
              etaData={etaData[route.id]}
              onDelete={() => handleDeleteRoute(route.id)}
              onToggleNotifications={() => handleToggleNotifications(route.id)}
            />
          ))}
        </div>
      )}

      {refreshing && (
        <div style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          <p>Updating travel times...</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
