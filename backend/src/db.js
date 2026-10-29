/**
 * ScholarNest Database Access Layer
 * 
 * Supports PostgreSQL via pg.Pool with the structured model architecture,
 * and maintains a transparent in-memory storage fallback for resilient zero-downtime operation.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });
dotenv.config();

import {
  UserModel,
  StudentProfileModel,
  ScholarshipModel,
  SavedScholarshipModel,
  ApplicationTrackingModel,
  NotificationModel
} from './models/index.js';

const { Pool } = pg;

const defaultAdminEmail = process.env.ADMIN_EMAIL || 'sai@gmail.com';
const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'admin1234';
const adminHash = bcrypt.hashSync(defaultAdminPassword, 10);
const studentHash = bcrypt.hashSync('Student@123', 10);

// Shared memory store for transparent fallback
const memoryStore = {
  users: [
    {
      id: 1,
      name: process.env.ADMIN_NAME || 'Sai Mutthalkar',
      email: defaultAdminEmail,
      passwordHash: adminHash,
      role: 'ADMIN',
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Pooja Patil',
      email: 'student@scholarnest.local',
      passwordHash: studentHash,
      role: 'STUDENT',
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  profiles: [],
  scholarships: [],
  saved: [],
  applications: [],
  notifications: [],
  idCounter: {
    users: 3,
    profiles: 1,
    scholarships: 1,
    saved: 1,
    applications: 1,
    notifications: 1
  }
};

let pool = null;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 3000
    });

    pool.on('error', (err) => {
      console.error('⚠️ [Database Pool Error]', err.message);
    });

    // Test connection on startup
    pool.connect().then(client => {
      console.log(`✅ [Database] PostgreSQL connected successfully to [${client.database}]`);
      client.release();
    }).catch(err => {
      console.warn(`⚠️ [Database] PostgreSQL connection failed (${err.message}). Using resilient in-memory storage fallback.`);
    });
  } catch (err) {
    console.warn(`⚠️ [Database] Error initializing Pool (${err.message}). Using in-memory store.`);
  }
}

export const db = {
  user: new UserModel(pool, memoryStore),
  studentProfile: new StudentProfileModel(pool, memoryStore),
  scholarship: new ScholarshipModel(pool, memoryStore),
  savedScholarship: new SavedScholarshipModel(pool, memoryStore),
  applicationTracking: new ApplicationTrackingModel(pool, memoryStore),
  notification: new NotificationModel(pool, memoryStore),
  _pool: pool,
  _memoryStore: memoryStore
};

export default db;
