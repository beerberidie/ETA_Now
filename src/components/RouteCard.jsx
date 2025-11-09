import React from 'react';
import { notifications } from '../utils/notifications.js';

function RouteCard({ route, etaData, onDelete, onToggleNotifications }) {
  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (minutesUntilDeparture) => {
    if (minutesUntilDeparture <= 0) return '#dc3545'; // Red - should have left
    if (minutesUntilDeparture <= 15) return '#ffc107'; // Yellow - leaving soon
    return '#28a745'; // Green - plenty of time
  };

  const getStatusText = (minutesUntilDeparture) => {
    if (minutesUntilDeparture <= 0) return 'You should have left!';
    if (minutesUntilDeparture <= 15) return 'Leave soon!';
    return 'On track';
  };

  const handleTestNotification = () => {
    if (notifications.getPermission() !== 'granted') {
      notifications.requestPermission().then(() => {
        notifications.showDepartureNotification(
          route.name,
          'Now (Test)',
          '25 min'
        );
      }).catch(() => {
        alert('Please enable notifications in your browser settings to test notifications.');
      });
    } else {
      notifications.showDepartureNotification(
        route.name,
        'Now (Test)',
        '25 min'
      );
    }
  };

  return (
    <div className="route-card">
      <h3>{route.name}</h3>

      <div className="route-info">
        <p><strong>From:</strong> {route.fromLocation}</p>
        <p><strong>To:</strong> {route.toLocation}</p>
        <p><strong>Target Arrival:</strong> {route.targetArrivalTime}</p>
      </div>

      {etaData ? (
        <div className="eta-info">
          <div className="eta-time">
            Current ETA: {etaData.durationInTrafficText}
            {etaData.isMockData && (
              <span style={{ fontSize: '12px', color: '#666', marginLeft: '5px' }}>
                (Demo Data)
              </span>
            )}
            {etaData.isRealData && (
              <span style={{ fontSize: '12px', color: '#28a745', marginLeft: '5px' }}>
                (Live Data)
              </span>
            )}
          </div>

          <div className="departure-time">
            Recommended departure: {etaData.departureTimeString}
          </div>

          <div
            style={{
              marginTop: '10px',
              padding: '8px',
              borderRadius: '4px',
              backgroundColor: getStatusColor(etaData.minutesUntilDeparture),
              color: 'white',
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            {etaData.minutesUntilDeparture > 0
              ? `${etaData.minutesUntilDeparture} min until departure`
              : getStatusText(etaData.minutesUntilDeparture)
            }
          </div>

          {etaData.distance && (
            <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
              Distance: {etaData.distanceText}
            </div>
          )}

          <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
            Last updated: {formatTime(etaData.lastUpdated)}
          </div>
        </div>
      ) : (
        <div className="eta-info">
          <div style={{ color: '#666', fontStyle: 'italic' }}>
            Loading ETA data...
          </div>
        </div>
      )}

      <div style={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px' }}>
          <input
            type="checkbox"
            checked={route.notificationsEnabled}
            onChange={onToggleNotifications}
            style={{ marginRight: '5px' }}
          />
          Notifications
        </label>

        {route.notificationsEnabled && notifications.getPermission() === 'granted' && (
          <button
            onClick={handleTestNotification}
            className="btn"
            style={{
              fontSize: '12px',
              padding: '4px 8px',
              backgroundColor: '#17a2b8',
              border: 'none'
            }}
          >
            Test
          </button>
        )}

        <button
          onClick={onDelete}
          className="btn btn-danger"
          style={{
            fontSize: '12px',
            padding: '4px 8px',
            marginLeft: 'auto'
          }}
        >
          Delete
        </button>
      </div>

      {route.notificationsEnabled && notifications.getPermission() !== 'granted' && (
        <div style={{
          marginTop: '10px',
          padding: '8px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          ⚠️ Notifications are enabled but permission not granted.
          <button
            onClick={() => notifications.requestPermission()}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '12px',
              marginLeft: '5px'
            }}
          >
            Enable now
          </button>
        </div>
      )}

      {etaData && etaData.minutesUntilDeparture <= 15 && etaData.minutesUntilDeparture > 0 && (
        <div style={{
          marginTop: '10px',
          padding: '8px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          🚨 Time to start getting ready to leave!
        </div>
      )}
    </div>
  );
}

export default RouteCard;
