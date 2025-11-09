// Simple authentication utility using localStorage
const AUTH_KEY = 'eta_now_user';

export const auth = {
  // Check if user is logged in
  isAuthenticated() {
    return localStorage.getItem(AUTH_KEY) !== null;
  },

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem(AUTH_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Login user
  login(email, password) {
    // In a real app, this would make an API call
    // For demo purposes, we'll use simple validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const user = {
      id: Date.now(),
      email: email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },

  // Register user
  register(email, password, confirmPassword) {
    if (!email || !password || !confirmPassword) {
      throw new Error('All fields are required');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Check if user already exists (in localStorage)
    const existingUsers = this.getAllUsers();
    if (existingUsers.some(user => user.email === email)) {
      throw new Error('User with this email already exists');
    }

    const user = {
      id: Date.now(),
      email: email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString()
    };

    // Store user in a list of all users (for demo purposes)
    const users = [...existingUsers, user];
    localStorage.setItem('eta_now_all_users', JSON.stringify(users));
    
    // Set as current user
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },

  // Logout user
  logout() {
    localStorage.removeItem(AUTH_KEY);
  },

  // Get all users (for demo purposes)
  getAllUsers() {
    const users = localStorage.getItem('eta_now_all_users');
    return users ? JSON.parse(users) : [];
  },

  // Update user profile
  updateProfile(updates) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));

    // Update in all users list too
    const allUsers = this.getAllUsers();
    const userIndex = allUsers.findIndex(user => user.id === currentUser.id);
    if (userIndex !== -1) {
      allUsers[userIndex] = updatedUser;
      localStorage.setItem('eta_now_all_users', JSON.stringify(allUsers));
    }

    return updatedUser;
  }
};
