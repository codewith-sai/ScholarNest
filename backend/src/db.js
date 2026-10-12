/**
 * ScholarNest Database Access Layer
 * 
 * Supports PostgreSQL via pg.Pool with the structured model architecture,
 * and maintains a transparent in-memory storage fallback for resilient zero-downtime operation.
 */

import 'dotenv/config';
import pg from 'pg';
import {
  UserModel,
  StudentProfileModel,
  ScholarshipModel,
  SavedScholarshipModel,
  ApplicationTrackingModel,
  NotificationModel
} from './models/index.js';

const { Pool } = pg;

// Shared memory store for transparent fallback
const memoryStore = {
  users: [],
  profiles: [],
  scholarships: [],
  saved: [],
  applications: [],
  notifications: [],
  idCounter: {
    users: 1,
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
