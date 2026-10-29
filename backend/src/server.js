import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ZodError } from 'zod';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import scholarshipRoutes from './routes/scholarshipRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import savedRoutes from './routes/savedRoutes.js';
import { requireAuth, requireRole } from './middleware/auth.js';
import { seedDatabase } from './seed.js';
import { db } from './db.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[API] ${req.method} ${req.url}`);
    next();
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ScholarNest API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found.` });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('[Error]', err);

  if (err instanceof ZodError) {
    const messages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    return res.status(400).json({
      message: messages || 'Validation error in request payload.',
      errors: err.errors
    });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error. Please try again later.'
  });
});

// Auto-seed and start server
async function startServer() {
  try {
    const existingCount = await db.scholarship.count();
    if (existingCount === 0) {
      console.log('[Server] No scholarships found. Seeding initial database...');
      await seedDatabase();
    } else {
      // Ensure default admin account exists
      const adminEmail = process.env.ADMIN_EMAIL || 'sai@gmail.com';
      const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } });
      if (!existingAdmin) {
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';
        const passwordHash = await bcrypt.hash(adminPassword, 10);
        await db.user.create({
          data: {
            name: process.env.ADMIN_NAME || 'Sai Mutthalkar',
            email: adminEmail,
            passwordHash,
            role: 'ADMIN',
            enabled: true
          }
        });
        console.log(`[Server] Ensured default admin account: ${adminEmail}`);
      }
    }

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`  ScholarNest API Server running on port ${PORT} `);
      console.log(`  Base URL: http://localhost:${PORT}/api         `);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('[Server Start Error]', error);
    process.exit(1);
  }
}

startServer();

export default app;

