/**
 * ScholarNest - Scholarship Model
 * 
 * Manages government schemes, financial benefits, deadlines, eligibility criteria, and documents.
 */

import { z } from 'zod';

export const ScholarshipSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(3),
  provider: z.string().min(2),
  governmentDepartment: z.string().nullable().optional(),
  schemeLevel: z.enum(['STATE', 'CENTRAL']).default('STATE'),
  applicableStates: z.array(z.string()).optional(),
  description: z.string().min(10),
  scholarshipType: z.string().default('Need-based'),
  benefits: z.string().min(2),
  tuitionFee: z.string().nullable().optional(),
  maintenanceAllowance: z.string().nullable().optional(),
  hostelAllowance: z.string().nullable().optional(),
  amount: z.number().nullable().optional(),
  openingDate: z.date().nullable().optional(),
  deadline: z.date().nullable().optional(),
  applicationUrl: z.string().nullable().optional(),
  officialInfoUrl: z.string().nullable().optional(),
  applicationInstructions: z.string().nullable().optional(),
  sourceAuthority: z.string().nullable().optional(),
  lastVerifiedDate: z.date().optional(),
  verificationStatus: z.enum(['VERIFIED', 'NEEDS_VERIFICATION', 'EXPIRED']).default('VERIFIED'),
  active: z.boolean().default(true),
  isDemo: z.boolean().default(false),
  eligibility: z.array(z.any()).default([]),
  documents: z.array(z.any()).default([]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export class ScholarshipModel {
  constructor(pool = null, memoryStore = null) {
    this.pool = pool;
    this.memoryStore = memoryStore;
  }

  async findUnique({ where }) {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          const res = await client.query('SELECT * FROM "Scholarship" WHERE id = $1 LIMIT 1', [Number(where.id)]);
          if (res && res.rows.length > 0) {
            const sch = res.rows[0];
            const elig = await client.query('SELECT * FROM "ScholarshipEligibility" WHERE "scholarshipId" = $1', [sch.id]);
            const docs = await client.query('SELECT * FROM "ScholarshipDocument" WHERE "scholarshipId" = $1', [sch.id]);
            sch.eligibility = elig.rows;
            sch.documents = docs.rows;
            sch._id = sch.id;
            sch.isActive = sch.active;
            return sch;
          }
        } finally {
          client.release();
        }
      } catch (err) {}
    }

    if (this.memoryStore) {
      const s = this.memoryStore.scholarships.find(x => x.id === Number(where.id)) || null;
      if (s) { s._id = s.id; s.isActive = s.active; }
      return s;
    }
    return null;
  }

  async findMany({ where = {}, orderBy } = {}) {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          let query = 'SELECT * FROM "Scholarship" WHERE 1=1';
          const params = [];
          let idx = 1;

          if (where.active !== undefined) {
            query += ` AND active = $${idx++}`;
            params.push(where.active);
          }
          if (where.deadline?.gte) {
            query += ` AND (deadline IS NULL OR deadline >= $${idx++})`;
            params.push(where.deadline.gte);
          }
          query += ' ORDER BY "updatedAt" DESC';

          const res = await client.query(query, params);
          if (res && res.rows) {
            // Attach eligibility rules and documents to each scholarship
            for (const sch of res.rows) {
              const elig = await client.query('SELECT * FROM "ScholarshipEligibility" WHERE "scholarshipId" = $1', [sch.id]);
              const docs = await client.query('SELECT * FROM "ScholarshipDocument" WHERE "scholarshipId" = $1', [sch.id]);
              sch.eligibility = elig.rows;
              sch.documents = docs.rows;
              sch._id = sch.id;
              sch.isActive = sch.active;
            }
            return res.rows;
          }
        } finally {
          client.release();
        }
      } catch (err) {}
    }

    let list = this.memoryStore ? [...this.memoryStore.scholarships] : [];
    if (where.active !== undefined) list = list.filter(s => s.active === where.active);
    if (where.deadline?.gte) list = list.filter(s => !s.deadline || new Date(s.deadline) >= where.deadline.gte);
    if (orderBy?.updatedAt === 'desc') {
      list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
    return list;
  }

  async create({ data }) {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          const res = await client.query(
            `INSERT INTO "Scholarship" (
              name, provider, "governmentDepartment", "schemeLevel", "applicableStates",
              description, "scholarshipType", benefits, "tuitionFee", "maintenanceAllowance",
              "hostelAllowance", amount, "openingDate", deadline, "applicationUrl",
              "officialInfoUrl", "applicationInstructions", "sourceAuthority",
              "verificationStatus", active, "isDemo"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
            RETURNING *`,
            [
              data.name, data.provider, data.governmentDepartment || null, data.schemeLevel || 'STATE',
              JSON.stringify(data.applicableStates || ['Maharashtra']),
              data.description, data.scholarshipType || 'Need-based', data.benefits,
              data.tuitionFee || null, data.maintenanceAllowance || null, data.hostelAllowance || null,
              data.amount || null, data.openingDate || null, data.deadline || null,
              data.applicationUrl || null, data.officialInfoUrl || null, data.applicationInstructions || null,
              data.sourceAuthority || 'MahaDBT 2.0', data.verificationStatus || 'VERIFIED',
              data.active !== undefined ? data.active : true, data.isDemo || false
            ]
          );

          if (res && res.rows.length > 0) {
            const sch = res.rows[0];
            const rules = data.eligibility?.create || data.eligibility || [];
            for (const r of rules) {
              await client.query(
                `INSERT INTO "ScholarshipEligibility" ("scholarshipId", field, operator, values, "minValue", "maxValue", required, label)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [sch.id, r.field, r.operator || 'IN', JSON.stringify(r.values || []), r.minValue ?? null, r.maxValue ?? null, r.required !== undefined ? r.required : true, r.label || null]
              );
            }
            const docs = data.documents?.create || data.documents || [];
            for (const d of docs) {
              await client.query(
                `INSERT INTO "ScholarshipDocument" ("scholarshipId", "documentName", mandatory)
                 VALUES ($1, $2, $3)`,
                [sch.id, d.documentName || d, d.mandatory !== undefined ? d.mandatory : true]
              );
            }
            sch.eligibility = rules;
            sch.documents = docs;
            return sch;
          }
        } finally {
          client.release();
        }
      } catch (err) {}
    }

    const id = this.memoryStore ? this.memoryStore.idCounter.scholarships++ : Date.now();
    const eligibility = data.eligibility?.create || data.eligibility || [];
    const documents = data.documents?.create || data.documents || [];
    const item = {
      ...data,
      id,
      eligibility,
      documents,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    if (this.memoryStore) this.memoryStore.scholarships.push(item);
    return item;
  }

  async update({ where, data }) {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          const ALLOWED_COLS = new Set([
            'name', 'provider', 'governmentDepartment', 'schemeLevel', 'applicableStates',
            'description', 'scholarshipType', 'benefits', 'tuitionFee', 'maintenanceAllowance',
            'hostelAllowance', 'amount', 'openingDate', 'deadline', 'applicationUrl',
            'officialInfoUrl', 'applicationInstructions', 'sourceAuthority', 'lastVerifiedDate',
            'verificationStatus', 'active', 'isDemo'
          ]);

          const updateData = { ...data };
          if (updateData.isActive !== undefined) {
            updateData.active = Boolean(updateData.isActive);
            delete updateData.isActive;
          }
          if (updateData.department !== undefined && !updateData.governmentDepartment) {
            updateData.governmentDepartment = updateData.department;
          }
          if (updateData.officialApplicationUrl !== undefined && !updateData.applicationUrl) {
            updateData.applicationUrl = updateData.officialApplicationUrl;
          }

          const fields = [];
          const values = [];
          let idx = 1;

          for (const [key, val] of Object.entries(updateData)) {
            if (!ALLOWED_COLS.has(key)) continue;
            fields.push(`"${key}" = $${idx++}`);
            if (key === 'applicableStates' && Array.isArray(val)) {
              values.push(JSON.stringify(val));
            } else {
              values.push(val === undefined ? null : val);
            }
          }

          let sch = null;
          if (fields.length > 0) {
            values.push(Number(where.id));
            const query = `UPDATE "Scholarship" SET ${fields.join(', ')}, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *`;
            const res = await client.query(query, values);
            if (res && res.rows.length > 0) sch = res.rows[0];
          } else {
            const res = await client.query('SELECT * FROM "Scholarship" WHERE id = $1', [Number(where.id)]);
            if (res && res.rows.length > 0) sch = res.rows[0];
          }

          if (sch) {
            const rules = data.eligibility?.create || data.eligibility || data.eligibilityCriteria;
            if (Array.isArray(rules)) {
              await client.query('DELETE FROM "ScholarshipEligibility" WHERE "scholarshipId" = $1', [sch.id]);
              for (const r of rules) {
                await client.query(
                  `INSERT INTO "ScholarshipEligibility" ("scholarshipId", field, operator, values, "minValue", "maxValue", required, label)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                  [
                    sch.id,
                    r.field || 'casteCategory',
                    r.operator || 'IN',
                    JSON.stringify(Array.isArray(r.values) ? r.values : (r.values ? [r.values] : [])),
                    r.minValue ?? null,
                    r.maxValue ?? null,
                    r.required !== undefined ? Boolean(r.required) : true,
                    r.label || null
                  ]
                );
              }
              sch.eligibility = rules;
            } else {
              const eligRes = await client.query('SELECT * FROM "ScholarshipEligibility" WHERE "scholarshipId" = $1', [sch.id]);
              sch.eligibility = eligRes.rows;
            }

            const docs = data.documents?.create || data.documents || data.requiredDocuments;
            if (Array.isArray(docs)) {
              await client.query('DELETE FROM "ScholarshipDocument" WHERE "scholarshipId" = $1', [sch.id]);
              for (const d of docs) {
                const docName = typeof d === 'string' ? d : (d.documentName || d.name || 'Document');
                const mandatory = typeof d === 'object' && d.mandatory !== undefined ? Boolean(d.mandatory) : true;
                await client.query(
                  `INSERT INTO "ScholarshipDocument" ("scholarshipId", "documentName", mandatory)
                   VALUES ($1, $2, $3)`,
                  [sch.id, docName, mandatory]
                );
              }
              sch.documents = docs;
            } else {
              const docRes = await client.query('SELECT * FROM "ScholarshipDocument" WHERE "scholarshipId" = $1', [sch.id]);
              sch.documents = docRes.rows;
            }

            sch._id = sch.id;
            sch.isActive = sch.active;
            return sch;
          }
        } finally {
          client.release();
        }
      } catch (err) {
        console.error('[Scholarship.update Error]', err);
      }
    }

    if (this.memoryStore) {
      const s = this.memoryStore.scholarships.find(x => x.id === Number(where.id));
      if (!s) throw new Error('Scholarship not found');
      const activeVal = data.active !== undefined ? data.active : (data.isActive !== undefined ? data.isActive : s.active);
      Object.assign(s, data, { active: activeVal, isActive: activeVal, updatedAt: new Date() });
      s._id = s.id;
      return s;
    }
    return null;
  }

  async count({ where = {} } = {}) {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          let q = 'SELECT COUNT(*) as count FROM "Scholarship" WHERE 1=1';
          const params = [];
          if (where.active !== undefined) {
            q += ' AND active = $1';
            params.push(where.active);
          }
          const res = await client.query(q, params);
          if (res && res.rows.length > 0) return Number(res.rows[0].count);
        } finally {
          client.release();
        }
      } catch (err) {}
    }

    let list = this.memoryStore ? this.memoryStore.scholarships : [];
    if (where.active !== undefined) list = list.filter(s => s.active === where.active);
    return list.length;
  }

  async delete({ where }) {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          const id = Number(where.id);
          await client.query('DELETE FROM "ScholarshipEligibility" WHERE "scholarshipId" = $1', [id]);
          await client.query('DELETE FROM "ScholarshipDocument" WHERE "scholarshipId" = $1', [id]);
          await client.query('DELETE FROM "SavedScholarship" WHERE "scholarshipId" = $1', [id]);
          await client.query('DELETE FROM "ApplicationTracking" WHERE "scholarshipId" = $1', [id]);
          const res = await client.query('DELETE FROM "Scholarship" WHERE id = $1 RETURNING *', [id]);
          return res.rows[0] || null;
        } finally {
          client.release();
        }
      } catch (err) {
        console.error('[Scholarship.delete Error]', err);
      }
    }

    if (this.memoryStore) {
      const idx = this.memoryStore.scholarships.findIndex(x => x.id === Number(where.id));
      if (idx !== -1) {
        const [removed] = this.memoryStore.scholarships.splice(idx, 1);
        return removed;
      }
    }
    return null;
  }

  async deleteMany() {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          await client.query('DELETE FROM "ScholarshipDocument"');
          await client.query('DELETE FROM "ScholarshipEligibility"');
          await client.query('DELETE FROM "Scholarship"');
        } finally {
          client.release();
        }
      } catch (err) {}
    }
    if (this.memoryStore) this.memoryStore.scholarships = [];
    return { count: 0 };
  }
}
