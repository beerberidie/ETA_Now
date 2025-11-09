// Google Maps API utility for calculating ETAs
// Using Google Maps JavaScript API with Distance Matrix Service

const GOOGLE_MAPS_API_KEY = 'AIzaSyC18JN3f3FzBImnUuq5kXkWn6G3I1QlYPo'; // Replace with your actual API key

// Load Google Maps JavaScript API
let googleMapsLoaded = false;
let googleMapsPromise = null;

const loadGoogleMaps = () => {
  if (googleMapsLoaded) {
    return Promise.resolve();
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Google Maps can only be loaded in browser environment'));
      return;
    }

    // Check if already loaded
    if (window.google && window.google.maps) {
      googleMapsLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      googleMapsLoaded = true;
      resolve();
    };

    script.onerror = () => {
      reject(new Error('Failed to load Google Maps API'));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

export const maps = {
  // Calculate ETA between two locations
  async calculateETA(fromLocation, toLocation, departureTime = 'now') {
    try {
      if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_API_KEY') {
        console.log('Using mock data - no API key provided');
        return this.getMockETA(fromLocation, toLocation);
      }

      // Load Google Maps API
      await loadGoogleMaps();

      return new Promise((resolve, reject) => {
        const service = new window.google.maps.DistanceMatrixService();

        service.getDistanceMatrix({
          origins: [fromLocation],
          destinations: [toLocation],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.IMPERIAL,
          drivingOptions: {
            departureTime: departureTime === 'now' ? new Date() : new Date(departureTime * 1000),
            trafficModel: window.google.maps.TrafficModel.BEST_GUESS
          },
          avoidHighways: false,
          avoidTolls: false
        }, (response, status) => {
          if (status === 'OK') {
            const element = response.rows[0].elements[0];

            if (element.status === 'OK') {
              console.log('Google Maps API Response:', response);

              resolve({
                duration: element.duration.value,
                durationText: element.duration.text,
                durationInTraffic: element.duration_in_traffic ? element.duration_in_traffic.value : element.duration.value,
                durationInTrafficText: element.duration_in_traffic ? element.duration_in_traffic.text : element.duration.text,
                distance: element.distance.value,
                distanceText: element.distance.text,
                startAddress: response.originAddresses[0],
                endAddress: response.destinationAddresses[0],
                isRealData: true
              });
            } else {
              reject(new Error(`Route calculation error: ${element.status}`));
            }
          } else {
            reject(new Error(`Google Maps API error: ${status}`));
          }
        });
      });
    } catch (error) {
      console.error('Error calculating ETA:', error);
      console.log('Falling back to mock data');
      // Return mock data as fallback
      return this.getMockETA(fromLocation, toLocation);
    }
  },

  // Mock ETA data for demo purposes
  getMockETA(fromLocation, toLocation) {
    // Generate realistic mock data based on location names
    const baseTime = 15 + Math.random() * 45; // 15-60 minutes base time
    const trafficMultiplier = 1 + (Math.random() * 0.5); // 1x to 1.5x for traffic

    const durationInSeconds = Math.floor(baseTime * 60);
    const durationInTrafficSeconds = Math.floor(durationInSeconds * trafficMultiplier);

    const distance = Math.floor(baseTime * 0.5 * 1609); // Rough estimate: 0.5 miles per minute, converted to meters

    return {
      duration: durationInSeconds,
      durationText: this.formatDuration(durationInSeconds),
      durationInTraffic: durationInTrafficSeconds,
      durationInTrafficText: this.formatDuration(durationInTrafficSeconds),
      distance: distance,
      distanceText: this.formatDistance(distance),
      startAddress: fromLocation,
      endAddress: toLocation,
      isMockData: true
    };
  },

  // Format duration in seconds to human readable text
  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    } else {
      return `${minutes} min`;
    }
  },

  // Format distance in meters to human readable text
  formatDistance(meters) {
    const miles = meters * 0.000621371;
    if (miles >= 1) {
      return `${miles.toFixed(1)} mi`;
    } else {
      const feet = meters * 3.28084;
      return `${Math.round(feet)} ft`;
    }
  },

  // Calculate recommended departure time
  calculateDepartureTime(targetArrivalTime, etaMinutes) {
    const [hours, minutes] = targetArrivalTime.split(':').map(Number);
    const arrivalDate = new Date();
    arrivalDate.setHours(hours, minutes, 0, 0);

    // If the arrival time is earlier than current time, assume it's for tomorrow
    if (arrivalDate < new Date()) {
      arrivalDate.setDate(arrivalDate.getDate() + 1);
    }

    const departureTime = new Date(arrivalDate.getTime() - (etaMinutes * 60 * 1000));

    return {
      departureTime: departureTime,
      departureTimeString: departureTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      arrivalTime: arrivalDate,
      arrivalTimeString: arrivalDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      minutesUntilDeparture: Math.max(0, Math.floor((departureTime - new Date()) / (1000 * 60)))
    };
  },

  // Validate location string
  isValidLocation(location) {
    return location && location.trim().length > 0;
  },

  // Get coordinates for a location (mock implementation)
  async getCoordinates(location) {
    // In a real implementation, this would use Google Geocoding API
    // For demo, return mock coordinates
    return {
      lat: 40.7128 + (Math.random() - 0.5) * 0.1,
      lng: -74.0060 + (Math.random() - 0.5) * 0.1,
      address: location
    };
  }
};
