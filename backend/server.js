const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const taskRoutes = require('./src/routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

// MongoDB connection
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log('⚡ MongoDB already connected');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected successfully!');
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    console.log(`Port: ${conn.connection.port}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Connect to DB
connectDB();

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: '✅ Server is running!', time: new Date() });
});

// **Set port from environment variables**
const PORT = process.env.PORT;

// Start server only if not in serverless environment
if (process.env.NODE_ENV !== 'serverless') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
module.exports.handler = serverless(app);
