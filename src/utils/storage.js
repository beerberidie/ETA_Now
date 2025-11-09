// Storage utility for managing routes and user data
import { auth } from './auth.js';

const ROUTES_KEY = 'eta_now_routes';

export const storage = {
  // Get all routes for current user
  getRoutes() {
    const user = auth.getCurrentUser();
    if (!user) return [];

    const allRoutes = localStorage.getItem(ROUTES_KEY);
    const routes = allRoutes ? JSON.parse(allRoutes) : {};
    return routes[user.id] || [];
  },

  // Save a new route
  saveRoute(route) {
    const user = auth.getCurrentUser();
    if (!user) {
      throw new Error('User must be logged in to save routes');
    }

    const newRoute = {
      id: Date.now(),
      userId: user.id,
      name: route.name,
      fromLocation: route.fromLocation,
      toLocation: route.toLocation,
      targetArrivalTime: route.targetArrivalTime,
      notificationsEnabled: route.notificationsEnabled || false,
      createdAt: new Date().toISOString(),
      ...route
    };

    const allRoutes = localStorage.getItem(ROUTES_KEY);
    const routes = allRoutes ? JSON.parse(allRoutes) : {};
    
    if (!routes[user.id]) {
      routes[user.id] = [];
    }
    
    routes[user.id].push(newRoute);
    localStorage.setItem(ROUTES_KEY, JSON.stringify(routes));
    
    return newRoute;
  },

  // Update an existing route
  updateRoute(routeId, updates) {
    const user = auth.getCurrentUser();
    if (!user) {
      throw new Error('User must be logged in to update routes');
    }

    const allRoutes = localStorage.getItem(ROUTES_KEY);
    const routes = allRoutes ? JSON.parse(allRoutes) : {};
    
    if (!routes[user.id]) {
      throw new Error('Route not found');
    }

    const routeIndex = routes[user.id].findIndex(route => route.id === routeId);
    if (routeIndex === -1) {
      throw new Error('Route not found');
    }

    routes[user.id][routeIndex] = {
      ...routes[user.id][routeIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(ROUTES_KEY, JSON.stringify(routes));
    return routes[user.id][routeIndex];
  },

  // Delete a route
  deleteRoute(routeId) {
    const user = auth.getCurrentUser();
    if (!user) {
      throw new Error('User must be logged in to delete routes');
    }

    const allRoutes = localStorage.getItem(ROUTES_KEY);
    const routes = allRoutes ? JSON.parse(allRoutes) : {};
    
    if (!routes[user.id]) {
      return false;
    }

    const initialLength = routes[user.id].length;
    routes[user.id] = routes[user.id].filter(route => route.id !== routeId);
    
    if (routes[user.id].length === initialLength) {
      return false; // Route not found
    }

    localStorage.setItem(ROUTES_KEY, JSON.stringify(routes));
    return true;
  },

  // Get a specific route by ID
  getRoute(routeId) {
    const routes = this.getRoutes();
    return routes.find(route => route.id === routeId) || null;
  },

  // Clear all routes for current user
  clearRoutes() {
    const user = auth.getCurrentUser();
    if (!user) return;

    const allRoutes = localStorage.getItem(ROUTES_KEY);
    const routes = allRoutes ? JSON.parse(allRoutes) : {};
    
    routes[user.id] = [];
    localStorage.setItem(ROUTES_KEY, JSON.stringify(routes));
  },

  // Export user data
  exportUserData() {
    const user = auth.getCurrentUser();
    if (!user) return null;

    return {
      user: user,
      routes: this.getRoutes(),
      exportedAt: new Date().toISOString()
    };
  },

  // Import user data
  importUserData(data) {
    const user = auth.getCurrentUser();
    if (!user) {
      throw new Error('User must be logged in to import data');
    }

    if (!data.routes || !Array.isArray(data.routes)) {
      throw new Error('Invalid data format');
    }

    // Update user IDs to current user
    const routes = data.routes.map(route => ({
      ...route,
      userId: user.id,
      id: Date.now() + Math.random(), // Generate new IDs
      importedAt: new Date().toISOString()
    }));

    const allRoutes = localStorage.getItem(ROUTES_KEY);
    const existingRoutes = allRoutes ? JSON.parse(allRoutes) : {};
    
    existingRoutes[user.id] = routes;
    localStorage.setItem(ROUTES_KEY, JSON.stringify(existingRoutes));

    return routes;
  }
};
