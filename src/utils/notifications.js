// Browser notifications utility
export const notifications = {
  // Check if notifications are supported
  isSupported() {
    return 'Notification' in window;
  },

  // Get current permission status
  getPermission() {
    if (!this.isSupported()) {
      return 'unsupported';
    }
    return Notification.permission;
  },

  // Request notification permission
  async requestPermission() {
    if (!this.isSupported()) {
      throw new Error('Notifications are not supported in this browser');
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      throw new Error('Notifications are blocked. Please enable them in your browser settings.');
    }

    const permission = await Notification.requestPermission();
    return permission;
  },

  // Show a notification
  show(title, options = {}) {
    if (!this.isSupported()) {
      console.warn('Notifications not supported');
      return null;
    }

    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }

    const defaultOptions = {
      icon: '/vite.svg',
      badge: '/vite.svg',
      tag: 'eta-now',
      requireInteraction: false,
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);
      
      // Auto-close after 10 seconds if not set to require interaction
      if (!defaultOptions.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 10000);
      }

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  },

  // Show departure notification
  showDepartureNotification(routeName, departureTime, eta) {
    const title = `Time to leave for ${routeName}!`;
    const body = `You should leave now to arrive on time.\nEstimated travel time: ${eta}`;
    
    return this.show(title, {
      body: body,
      icon: '/vite.svg',
      tag: `departure-${routeName}`,
      requireInteraction: true,
      actions: [
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    });
  },

  // Show ETA update notification
  showETAUpdateNotification(routeName, newETA, oldETA) {
    const title = `ETA Update for ${routeName}`;
    const body = `Travel time changed from ${oldETA} to ${newETA}`;
    
    return this.show(title, {
      body: body,
      icon: '/vite.svg',
      tag: `eta-update-${routeName}`,
      requireInteraction: false
    });
  },

  // Schedule a notification (using setTimeout)
  scheduleNotification(title, options, delayMs) {
    if (delayMs <= 0) {
      return this.show(title, options);
    }

    return setTimeout(() => {
      this.show(title, options);
    }, delayMs);
  },

  // Cancel a scheduled notification
  cancelScheduledNotification(timeoutId) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  },

  // Check if it's time to send departure notification
  shouldSendDepartureNotification(departureTime, notificationMinutes = 15) {
    const now = new Date();
    const departure = new Date(departureTime);
    const notificationTime = new Date(departure.getTime() - (notificationMinutes * 60 * 1000));
    
    // Check if current time is within 1 minute of notification time
    const timeDiff = Math.abs(now.getTime() - notificationTime.getTime());
    return timeDiff <= 60000; // Within 1 minute
  },

  // Get time until departure notification should be sent
  getTimeUntilNotification(departureTime, notificationMinutes = 15) {
    const now = new Date();
    const departure = new Date(departureTime);
    const notificationTime = new Date(departure.getTime() - (notificationMinutes * 60 * 1000));
    
    const timeUntil = notificationTime.getTime() - now.getTime();
    return Math.max(0, timeUntil);
  },

  // Format time until notification
  formatTimeUntilNotification(milliseconds) {
    if (milliseconds <= 0) {
      return 'Now';
    }

    const minutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else {
      return `${minutes}m`;
    }
  },

  // Test notification (for settings page)
  showTestNotification() {
    return this.show('ETA Now Test', {
      body: 'Notifications are working correctly!',
      icon: '/vite.svg',
      tag: 'test-notification'
    });
  }
};
