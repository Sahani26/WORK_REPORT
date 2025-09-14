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
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(
    process.env.MONGO_URI || "mongodb+srv://sunilsahani484_db_user:U8Gz73IyKoKg8AL7@cluster0.tdbruro.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
};

connectDB()
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Only export handler for Vercel
module.exports = serverless(app);
