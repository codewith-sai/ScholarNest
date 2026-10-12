/**
 * ScholarNest - StudentProfile Model
 * 
 * Manages demographic, academic, and financial matching attributes of students.
 */

import { z } from 'zod';

export const StudentProfileSchema = z.object({
  id: z.number().int().positive().optional(),
  userId: z.number().int().positive(),
  dateOfBirth: z.date().nullable().optional(),
  gender: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  district: z.string().nullable().optional(),
  taluka: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  domicileState: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  casteCommunity: z.string().nullable().optional(),
  minorityStatus: z.boolean().default(false),
  disabilityStatus: z.boolean().default(false),
  disabilityPercentage: z.number().nullable().optional(),
  annualIncome: z.number().nullable().optional(),
  incomeCertificate: z.boolean().default(false),
  parentOccupation: z.string().nullable().optional(),
  educationLevel: z.string().nullable().optional(),
  college: z.string().nullable().optional(),
  course: z.string().nullable().optional(),
  branch: z.string().nullable().optional(),
  academicYear: z.number().nullable().optional(),
  percentage: z.number().nullable().optional(),
  cgpa: z.number().nullable().optional(),
  profileCompleted: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export class StudentProfileModel {
  constructor(pool = null, memoryStore = null) {
    this.pool = pool;
    this.memoryStore = memoryStore;
  }

  async findUnique({ where }) {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          let res;
          if (where.userId) {
            res = await client.query('SELECT * FROM "StudentProfile" WHERE "userId" = $1 LIMIT 1', [Number(where.userId)]);
          } else if (where.id) {
            res = await client.query('SELECT * FROM "StudentProfile" WHERE id = $1 LIMIT 1', [Number(where.id)]);
          }
          if (res && res.rows.length > 0) return res.rows[0];
        } finally {
          client.release();
        }
      } catch (err) {}
    }

    if (this.memoryStore) {
      if (where.userId) return this.memoryStore.profiles.find(p => p.userId === Number(where.userId)) || null;
      if (where.id) return this.memoryStore.profiles.find(p => p.id === Number(where.id)) || null;
    }
    return null;
  }

  async upsert({ where, create, update }) {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          const uid = Number(where.userId);
          const existing = await client.query('SELECT id FROM "StudentProfile" WHERE "userId" = $1', [uid]);
          const ALLOWED_COLS = new Set([
            'dateOfBirth', 'gender', 'state', 'district', 'taluka', 'city', 'domicileState',
            'category', 'casteCommunity', 'minorityStatus', 'disabilityStatus', 'disabilityPercentage',
            'annualIncome', 'incomeCertificate', 'parentOccupation', 'educationLevel', 'college',
            'course', 'branch', 'academicYear', 'percentage', 'cgpa', 'profileCompleted'
          ]);

          if (existing.rows.length > 0) {
            // Update
            const fields = [];
            const values = [];
            let idx = 1;
            for (const [k, v] of Object.entries(update)) {
              if (!ALLOWED_COLS.has(k)) continue;
              fields.push(`"${k}" = $${idx++}`);
              values.push(v === undefined ? null : v);
            }
            if (fields.length > 0) {
              values.push(uid);
              const q = `UPDATE "StudentProfile" SET ${fields.join(', ')}, "updatedAt" = CURRENT_TIMESTAMP WHERE "userId" = $${idx} RETURNING *`;
              const res = await client.query(q, values);
              if (res && res.rows.length > 0) return res.rows[0];
            } else {
              return existing.rows[0];
            }
          } else {
            // Create
            const cols = ['"userId"'];
            const placeholders = ['$1'];
            const values = [uid];
            let idx = 2;
            for (const [k, v] of Object.entries(create)) {
              if (!ALLOWED_COLS.has(k)) continue;
              cols.push(`"${k}"`);
              placeholders.push(`$${idx++}`);
              values.push(v === undefined ? null : v);
            }
            const q = `INSERT INTO "StudentProfile" (${cols.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
            const res = await client.query(q, values);
            if (res && res.rows.length > 0) return res.rows[0];
          }
        } finally {
          client.release();
        }
      } catch (err) {}
    }

    if (this.memoryStore) {
      let prof = this.memoryStore.profiles.find(p => p.userId === Number(where.userId));
      if (prof) {
        Object.assign(prof, update, { updatedAt: new Date() });
      } else {
        const id = this.memoryStore.idCounter.profiles++;
        prof = {
          id,
          userId: Number(where.userId),
          ...create,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.memoryStore.profiles.push(prof);
      }
      return prof;
    }
    return null;
  }

  async create({ data }) {
    return this.upsert({
      where: { userId: data.userId },
      create: data,
      update: data
    });
  }

  async deleteMany() {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          await client.query('DELETE FROM "StudentProfile"');
        } finally {
          client.release();
        }
      } catch (err) {}
    }
    if (this.memoryStore) this.memoryStore.profiles = [];
    return { count: 0 };
  }
}
