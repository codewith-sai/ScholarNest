/**
 * ScholarNest - Notification Model
 * 
 * Manages deadline alerts, matching scheme updates, and student notifications.
 */

import { z } from 'zod';

export const NotificationSchema = z.object({
  id: z.number().int().positive().optional(),
  studentId: z.number().int().positive(),
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(['INFO', 'DEADLINE', 'MATCH']).default('INFO'),
  read: z.boolean().default(false),
  createdAt: z.date().optional()
});

export class NotificationModel {
  constructor(pool = null, memoryStore = null) {
    this.pool = pool;
    this.memoryStore = memoryStore;
  }

  async findMany({ where = {}, orderBy } = {}) {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          let query = `
            SELECT n.*, 
                   s.name AS "scholarshipName",
                   s.provider AS "provider",
                   s."governmentDepartment" AS "governmentDepartment",
                   s."applicationUrl" AS "scholarshipApplicationUrl",
                   s.deadline AS "deadline",
                   s.amount AS "amount",
                   s.benefits AS "benefitsSummary"
            FROM "Notification" n
            LEFT JOIN "Scholarship" s ON s.id = n."scholarshipId"
          `;
          const params = [];
          if (where.studentId !== undefined && where.studentId !== null && !isNaN(Number(where.studentId))) {
            query += ` WHERE n."studentId" = $1`;
            params.push(Number(where.studentId));
          }
          query += ` ORDER BY n."createdAt" DESC`;

          const res = await client.query(query, params);
          if (res && res.rows) return res.rows;
        } finally {
          client.release();
        }
      } catch (err) {
        console.error('[Notification.findMany Error]', err.message);
      }
    }

    if (this.memoryStore) {
      let list = [...this.memoryStore.notifications];
      if (where.studentId !== undefined && where.studentId !== null && !isNaN(Number(where.studentId))) {
        list = list.filter(x => x.studentId === Number(where.studentId));
      }
      if (orderBy?.createdAt === 'desc') {
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      return list;
    }
    return [];
  }

  async findUnique({ where }) {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          const res = await client.query('SELECT * FROM "Notification" WHERE id = $1 LIMIT 1', [Number(where.id)]);
          if (res && res.rows.length > 0) return res.rows[0];
        } finally {
          client.release();
        }
      } catch (err) {}
    }

    if (this.memoryStore) {
      return this.memoryStore.notifications.find(n => n.id === Number(where.id)) || null;
    }
    return null;
  }

  async create({ data }) {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          const res = await client.query(
            `INSERT INTO "Notification" ("studentId", title, message, type, read, "scholarshipId", "actionUrl", "metadata")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [
              Number(data.studentId),
              data.title,
              data.message,
              data.type || 'INFO',
              false,
              data.scholarshipId ? Number(data.scholarshipId) : null,
              data.actionUrl || null,
              data.metadata ? (typeof data.metadata === 'string' ? data.metadata : JSON.stringify(data.metadata)) : null
            ]
          );
          if (res && res.rows.length > 0) return res.rows[0];
        } finally {
          client.release();
        }
      } catch (err) {}
    }

    if (this.memoryStore) {
      const n = {
        id: this.memoryStore.idCounter.notifications++,
        ...data,
        read: false,
        createdAt: new Date()
      };
      this.memoryStore.notifications.push(n);
      return n;
    }
    return null;
  }

  async updateMany({ where = {}, data }) {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          let query = `UPDATE "Notification" SET read = $1`;
          const params = [Boolean(data.read)];
          const conditions = [];
          if (where.id && !isNaN(Number(where.id))) {
            params.push(Number(where.id));
            conditions.push(`id = $${params.length}`);
          }
          if (where.studentId && !isNaN(Number(where.studentId))) {
            params.push(Number(where.studentId));
            conditions.push(`"studentId" = $${params.length}`);
          }
          if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
          }
          const res = await client.query(query, params);
          return { count: res.rowCount };
        } finally {
          client.release();
        }
      } catch (err) {
        console.error('[Notification.updateMany Error]', err.message);
      }
    }

    if (this.memoryStore) {
      let count = 0;
      this.memoryStore.notifications.forEach(item => {
        const matchesId = !where.id || item.id === Number(where.id);
        const matchesStudent = !where.studentId || item.studentId === Number(where.studentId);
        if (matchesId && matchesStudent) {
          Object.assign(item, data);
          count++;
        }
      });
      return { count };
    }
    return { count: 0 };
  }

  async deleteMany() {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          await client.query('DELETE FROM "Notification"');
        } finally {
          client.release();
        }
      } catch (err) {}
    }
    if (this.memoryStore) this.memoryStore.notifications = [];
    return { count: 0 };
  }
}
