/**
 * ScholarNest - ApplicationTracking Model
 * 
 * Manages the student's scholarship application progress:
 * SAVED -> PLANNING -> APPLIED -> UNDER_REVIEW -> SELECTED / REJECTED
 */

import { z } from 'zod';

export const ApplicationTrackingSchema = z.object({
  id: z.number().int().positive().optional(),
  studentId: z.number().int().positive(),
  scholarshipId: z.number().int().positive(),
  status: z.enum(['SAVED', 'PLANNING', 'APPLIED', 'UNDER_REVIEW', 'SELECTED', 'REJECTED']).default('SAVED'),
  appliedAt: z.date().nullable().optional(),
  notes: z.string().nullable().optional(),
  updatedAt: z.date().optional()
});

export class ApplicationTrackingModel {
  constructor(pool = null, memoryStore = null) {
    this.pool = pool;
    this.memoryStore = memoryStore;
  }

  async findMany({ where = {} } = {}) {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          const res = await client.query(
            `SELECT at.*, row_to_json(s.*) as scholarship
             FROM "ApplicationTracking" at
             JOIN "Scholarship" s ON at."scholarshipId" = s.id
             WHERE at."studentId" = $1
             ORDER BY at."updatedAt" DESC`,
            [Number(where.studentId)]
          );
          if (res && res.rows) return res.rows;
        } finally {
          client.release();
        }
      } catch (err) {}
    }

    if (this.memoryStore) {
      const list = this.memoryStore.applications.filter(x => x.studentId === Number(where.studentId));
      return list.map(item => ({
        ...item,
        scholarship: this.memoryStore.scholarships.find(s => s.id === item.scholarshipId) || null
      }));
    }
    return [];
  }

  async findUnique({ where }) {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          const res = await client.query('SELECT * FROM "ApplicationTracking" WHERE id = $1 LIMIT 1', [Number(where.id)]);
          if (res && res.rows.length > 0) return res.rows[0];
        } finally {
          client.release();
        }
      } catch (err) {}
    }

    if (this.memoryStore) {
      return this.memoryStore.applications.find(a => a.id === Number(where.id)) || null;
    }
    return null;
  }

  async upsert({ where, create, update }) {
    const sid = Number(where.studentId_scholarshipId.studentId);
    const scid = Number(where.studentId_scholarshipId.scholarshipId);

    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          const res = await client.query(
            `INSERT INTO "ApplicationTracking" ("studentId", "scholarshipId", status)
             VALUES ($1, $2, $3)
             ON CONFLICT ("studentId", "scholarshipId") DO NOTHING
             RETURNING *`,
            [sid, scid, create?.status || 'SAVED']
          );
          if (res && res.rows.length > 0) return res.rows[0];
        } finally {
          client.release();
        }
      } catch (err) {}
    }

    if (this.memoryStore) {
      let existing = this.memoryStore.applications.find(x => x.studentId === sid && x.scholarshipId === scid);
      if (!existing) {
        existing = {
          id: this.memoryStore.idCounter.applications++,
          studentId: sid,
          scholarshipId: scid,
          status: create?.status || 'SAVED',
          appliedAt: null,
          updatedAt: new Date()
        };
        this.memoryStore.applications.push(existing);
      } else if (update) {
        Object.assign(existing, update, { updatedAt: new Date() });
      }
      return existing;
    }
    return null;
  }

  async updateMany({ where, data }) {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          const res = await client.query(
            `UPDATE "ApplicationTracking"
             SET status = $1, "appliedAt" = $2, "updatedAt" = CURRENT_TIMESTAMP
             WHERE id = $3 AND "studentId" = $4
             RETURNING *`,
            [data.status, data.appliedAt || null, Number(where.id), Number(where.studentId)]
          );
          return { count: res.rowCount };
        } finally {
          client.release();
        }
      } catch (err) {}
    }

    if (this.memoryStore) {
      const item = this.memoryStore.applications.find(x => x.id === Number(where.id) && x.studentId === Number(where.studentId));
      if (!item) return { count: 0 };
      Object.assign(item, data, { updatedAt: new Date() });
      return { count: 1 };
    }
    return { count: 0 };
  }

  async count() {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          const res = await client.query('SELECT COUNT(*) as count FROM "ApplicationTracking"');
          if (res && res.rows.length > 0) return Number(res.rows[0].count);
        } finally {
          client.release();
        }
      } catch (err) {}
    }

    return this.memoryStore ? this.memoryStore.applications.length : 0;
  }

  async deleteMany() {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          await client.query('DELETE FROM "ApplicationTracking"');
        } finally {
          client.release();
        }
      } catch (err) {}
    }
    if (this.memoryStore) this.memoryStore.applications = [];
    return { count: 0 };
  }
}
