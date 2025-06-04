require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const userRoutes = require('./routes/adminUserRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const staffRoutes = require('./routes/staffRoutes');
const residentRoutes = require('./routes/residentRoutes');
const adminMaintenanceRoutes = require('./routes/adminMaintenanceRoutes');

const app = express();

// Middleware
app.use(cookieParser());
const allowedOrigins = [
  'http://localhost:3000', // Local React app
  'https://hstmng.netlify.app', // Netlify deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow no-origin requests (like from Postman or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());


// Route Mounting
app.use('/api/auth', authRoutes);
app.use('/api/admin/rooms', roomRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/residents',residentRoutes);
app.use('/api/admin', adminMaintenanceRoutes);

// Test route
app.get('/', (req, res) => res.send('API running'));

// Start server after DB is connected
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}\n`);

      // Print registered routes
      if (app._router) {
        console.log('✅ Registered routes:');
        app._router.stack.forEach((middleware) => {
          if (middleware.route) {
            console.log(`  ${Object.keys(middleware.route.methods).join(',').toUpperCase()} ${middleware.route.path}`);
          } else if (middleware.name === 'router') {
            middleware.handle.stack.forEach((handler) => {
              if (handler.route) {
                console.log(`  ${Object.keys(handler.route.methods).join(',').toUpperCase()} ${handler.route.path}`);
              }
            });
          }
        });
      } else {
        console.log('⚠️ No routes registered yet');
      }
    });
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
};

startServer();
