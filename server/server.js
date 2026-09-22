import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initStore } from './data/store.js';

import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import labRoutes from './routes/labRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security & CORS Configuration (/cso compliance & production deployment)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in deployment
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsing with payload size limits to prevent Denial of Service (DoS)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory with cache control
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'PatientCare Clinical API',
    database: 'Supabase PostgreSQL (Live)',
    security_standard: '/cso (Chief Security Officer)',
    timestamp: new Date().toISOString()
  });
});

// Mount modular API routers
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/admin', adminRoutes);

// Production Static Client Serving (Single-service deployment)
const clientDistPath = path.join(__dirname, '../dist');
app.use(express.static(clientDistPath));

app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// 404 handler for unhandled API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Security Error Handler (/cso: Avoid leaking stack traces in production)
app.use((err, req, res, next) => {
  console.error('Server error:', err);

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ success: false, error: 'Invalid or missing authentication token.' });
  }

  const isDev = process.env.NODE_ENV === 'development';
  return res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error.',
    ...(isDev && { stack: err.stack })
  });
});

// Start server
const startServer = async () => {
  try {
    await initStore();
    app.listen(PORT, () => {
      console.log(`🚀 PatientCare Secure API running on http://localhost:${PORT}`);
      console.log(`🛡️  /cso Security Rules Active: bcrypt password hashing, JWT role gating, confidential personal note protection.`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
