const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://brave-miracle-production-f9bf.up.railway.app',
      'https://kisanmel.com',
      'https://www.kisanmel.com'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kisan-mel';

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout for server selection
    socketTimeoutMS: 45000, // 45 seconds timeout for socket operations
    connectTimeoutMS: 10000, // 10 seconds timeout for initial connection
    retryWrites: true,
    retryReads: true
})
.then(() => {
    console.log('✅ Connected to MongoDB successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
})
.catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('\n🔧 Troubleshooting steps:');
    console.error('1. Check your internet connection');
    console.error('2. Verify MongoDB Atlas cluster is running (not paused)');
    console.error('3. Check if your IP is whitelisted in MongoDB Atlas Network Access');
    console.error('4. Verify the MONGODB_URI connection string format:');
    console.error('   mongodb+srv://username:password@cluster.mongodb.net/database-name');
    console.error('5. Try using a standard connection string instead of SRV:');
    console.error('   mongodb://username:password@cluster-shard-00-00.mongodb.net:27017/database-name');
    console.error('6. Check DNS resolution - try: nslookup cluster0.tjryvzk.mongodb.net');
    process.exit(1);
});

// Routes (to be implemented)
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/crops', require('./routes/cropRoutes'));
app.use('/api', require('./routes/recommendRoutes'));
app.use('/api/v1/farm-logs', require('./routes/farmLogRoutes'));
app.use('/api/v1/alerts', require('./routes/alertRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));

// AFTER routes and before error handling
if (process.env.NODE_ENV === 'production') {
    // Serve static files from React app
    const buildPath = path.resolve(__dirname, '../frontend/build');
    app.use(express.static(buildPath));

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 