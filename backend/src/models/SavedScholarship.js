/**
 * ScholarNest - SavedScholarship Model
 * 
 * Manages students' bookmarked and saved scholarship opportunities.
 */

import { z } from 'zod';

export const SavedScholarshipSchema = z.object({
  id: z.number().int().positive().optional(),
  studentId: z.number().int().positive(),
  scholarshipId: z.number().int().positive(),
  createdAt: z.date().optional()
});

export class SavedScholarshipModel {
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
            `SELECT ss.*, row_to_json(s.*) as scholarship 
             FROM "SavedScholarship" ss
             JOIN "Scholarship" s ON ss."scholarshipId" = s.id
             WHERE ss."studentId" = $1
             ORDER BY ss."createdAt" DESC`,
            [Number(where.studentId)]
          );
          if (res && res.rows) return res.rows;
        } finally {
          client.release();
        }
      } catch (err) {}
    }

    if (this.memoryStore) {
      const list = this.memoryStore.saved.filter(x => x.studentId === Number(where.studentId));
      return list.map(item => ({
        ...item,
        scholarship: this.memoryStore.scholarships.find(s => s.id === item.scholarshipId) || null
      }));
    }
    return [];
  }

  async upsert({ where, create }) {
    const sid = Number(where.studentId_scholarshipId.studentId);
    const scid = Number(where.studentId_scholarshipId.scholarshipId);

    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          const res = await client.query(
            `INSERT INTO "SavedScholarship" ("studentId", "scholarshipId")
             VALUES ($1, $2)
             ON CONFLICT ("studentId", "scholarshipId") DO NOTHING
             RETURNING *`,
            [sid, scid]
          );
          if (res && res.rows.length > 0) return res.rows[0];
        } finally {
          client.release();
        }
      } catch (err) {}
    }

    if (this.memoryStore) {
      let existing = this.memoryStore.saved.find(x => x.studentId === sid && x.scholarshipId === scid);
      if (!existing) {
        existing = {
          id: this.memoryStore.idCounter.saved++,
          studentId: sid,
          scholarshipId: scid,
          createdAt: new Date()
        };
        this.memoryStore.saved.push(existing);
      }
      return existing;
    }
    return { studentId: sid, scholarshipId: scid };
  }

  async delete({ where }) {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          if (where.studentId_scholarshipId) {
            const sid = Number(where.studentId_scholarshipId.studentId);
            const scid = Number(where.studentId_scholarshipId.scholarshipId);
            await client.query(
              `DELETE FROM "SavedScholarship" 
               WHERE "studentId" = $1 AND ("scholarshipId" = $2 OR id = $2)`,
              [sid, scid]
            );
          } else if (where.id) {
            await client.query('DELETE FROM "SavedScholarship" WHERE id = $1', [Number(where.id)]);
          }
        } finally {
          client.release();
        }
      } catch (err) {}
    }

    if (this.memoryStore) {
      if (where.studentId_scholarshipId) {
        const sid = Number(where.studentId_scholarshipId.studentId);
        const scid = Number(where.studentId_scholarshipId.scholarshipId);
        this.memoryStore.saved = this.memoryStore.saved.filter(x => !(x.studentId === sid && (x.scholarshipId === scid || x.id === scid)));
      } else if (where.id) {
        this.memoryStore.saved = this.memoryStore.saved.filter(x => x.id !== Number(where.id));
      }
    }
    return { count: 1 };
  }

  async deleteMany() {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          await client.query('DELETE FROM "SavedScholarship"');
        } finally {
          client.release();
        }
      } catch (err) {}
    }
    if (this.memoryStore) this.memoryStore.saved = [];
    return { count: 0 };
  }
}
