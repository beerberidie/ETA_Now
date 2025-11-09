# ETA Now ⏰🚗

**Smart Route Planning with Real-Time Traffic ETAs**

ETA Now is a web application that helps you plan your commutes by calculating estimated arrival times based on real-time traffic conditions. Set your target arrival time, and the app tells you exactly when to leave.

---

## ✨ Features

### 🗺️ Route Management
- **Save multiple routes** - Home to work, gym, appointments, etc.
- **Custom route names** - Label routes for easy identification
- **From/To locations** - Set origin and destination addresses
- **Target arrival times** - Specify when you need to arrive

### ⏱️ Real-Time ETA Calculation
- **Live traffic data** - Real-time traffic conditions
- **Accurate ETAs** - Calculate travel time with current traffic
- **Departure time calculation** - Know exactly when to leave
- **Auto-refresh** - Updates every 5 minutes automatically

### 🔔 Smart Notifications
- **Departure alerts** - Get notified when it's time to leave
- **Customizable notifications** - Enable/disable per route
- **Browser notifications** - Native notification support

### 👤 User Management
- **User authentication** - Secure login system
- **Personal routes** - Each user has their own saved routes
- **Settings management** - Customize app preferences

### 🎨 Modern UI
- **Clean interface** - Intuitive and easy to use
- **Responsive design** - Works on desktop and mobile
- **Real-time updates** - Live ETA updates
- **Visual feedback** - Loading states and refresh indicators

---

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm
- Modern web browser with notification support

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ETA_Now
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```

---

## 📖 How to Use

### 1. Login
- Create an account or login with existing credentials
- Your routes are saved per user account

### 2. Add a Route
- Click "Add Route" button
- Enter route details:
  - **Route Name** - e.g., "Home to Work"
  - **From Location** - Starting address
  - **To Location** - Destination address
  - **Target Arrival Time** - When you need to arrive
  - **Enable Notifications** - Get departure alerts

### 3. View ETAs
- Dashboard shows all your saved routes
- Each route displays:
  - Current travel time with traffic
  - Recommended departure time
  - Time until you need to leave
  - Last updated timestamp

### 4. Manage Routes
- **Edit** - Update route details
- **Delete** - Remove routes you no longer need
- **Refresh** - Manually update ETAs
- **Auto-refresh** - Automatic updates every 5 minutes

### 5. Notifications
- Enable browser notifications when prompted
- Receive alerts when it's time to leave
- Notifications show:
  - Route name
  - Departure time
  - Estimated travel duration

---

## 🛠️ Development

### Project Structure

```
ETA_Now/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx      # Main dashboard view
│   │   ├── Login.jsx           # Login/signup page
│   │   ├── Header.jsx          # App header
│   │   ├── RouteCard.jsx       # Individual route display
│   │   ├── RouteForm.jsx       # Add/edit route form
│   │   └── Settings.jsx        # User settings
│   ├── utils/
│   │   ├── auth.js             # Authentication utilities
│   │   ├── storage.js          # Local storage management
│   │   ├── maps.js             # ETA calculation logic
│   │   └── notifications.js    # Notification handling
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # App entry point
│   └── index.css               # Global styles
├── public/                     # Static assets
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
└── package.json                # Dependencies
```

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Technologies Used

- **React 18** - UI framework
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server
- **LocalStorage** - Data persistence
- **Browser Notifications API** - Departure alerts
- **Maps API** - ETA calculations (configurable)

---

## 🔧 Configuration

### Maps API Integration

The app uses a maps service for ETA calculations. Configure in `src/utils/maps.js`:

```javascript
// Example: Google Maps API, Mapbox, or custom service
const API_KEY = 'your_api_key_here';
```

**Note:** For development, the app includes mock ETA calculations. For production, integrate with a real maps API service.

---

## 📱 Browser Support

- **Chrome/Edge** - Full support
- **Firefox** - Full support
- **Safari** - Full support (notifications require permission)
- **Mobile browsers** - Responsive design works on all devices

---

## 🔔 Notifications

### Enable Notifications

1. Click "Allow" when prompted for notification permission
2. Enable notifications per route in route settings
3. Receive alerts when it's time to leave

### Notification Timing

- Alerts sent when departure time approaches
- Configurable notification window
- Smart timing based on traffic conditions

---

## 💾 Data Storage

- **LocalStorage** - All data stored locally in browser
- **No backend required** - Fully client-side application
- **Privacy-focused** - Your data stays on your device
- **Per-user storage** - Routes saved per user account

---

## 🎯 Use Cases

- **Daily commute** - Never be late to work
- **Appointments** - Arrive on time for meetings
- **School runs** - Plan pickups and drop-offs
- **Gym sessions** - Time your workout commute
- **Social events** - Arrive punctually to gatherings

---

## 🚧 Future Enhancements

- [ ] Multiple route alternatives
- [ ] Historical traffic patterns
- [ ] Calendar integration
- [ ] Public transit options
- [ ] Carpool coordination
- [ ] Weather-based adjustments
- [ ] Recurring routes (daily/weekly)
- [ ] Mobile app (React Native)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for lightning-fast development
- Maps API providers for traffic data

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review the code comments

---

**Built with ❤️ by Garason**

*Never be late again!* ⏰✨

