/**
 * ScholarNest - User Model
 * 
 * Manages user authentication accounts, roles, and status.
 */

import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  passwordHash: z.string().min(1, 'Password hash is required'),
  role: z.enum(['STUDENT', 'ADMIN']).default('STUDENT'),
  enabled: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export class UserModel {
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
          if (where.id) {
            res = await client.query('SELECT * FROM "User" WHERE id = $1 LIMIT 1', [Number(where.id)]);
          } else if (where.email) {
            res = await client.query('SELECT * FROM "User" WHERE LOWER(email) = LOWER($1) LIMIT 1', [where.email]);
          }
          if (res && res.rows.length > 0) return res.rows[0];
        } finally {
          client.release();
        }
      } catch (err) {
        // fallback to memory store
      }
    }

    if (this.memoryStore) {
      if (where.id) return this.memoryStore.users.find(u => u.id === Number(where.id)) || null;
      if (where.email) return this.memoryStore.users.find(u => u.email.toLowerCase() === where.email.toLowerCase()) || null;
    }
    return null;
  }

  async findById(id) {
    return this.findUnique({ where: { id: Number(id) } });
  }

  async findMany({ where = {}, select } = {}) {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          let query = 'SELECT * FROM "User"';
          const params = [];
          const whereClauses = [];

          if (where.role) {
            params.push(where.role);
            whereClauses.push(`role = $${params.length}`);
          }

          if (where.search) {
            params.push(`%${where.search}%`);
            whereClauses.push(`(name ILIKE $${params.length} OR email ILIKE $${params.length})`);
          }

          if (whereClauses.length > 0) {
            query += ' WHERE ' + whereClauses.join(' AND ');
          }

          query += ' ORDER BY "createdAt" DESC';
          const res = await client.query(query, params);

          if (res && res.rows) {
            let users = res.rows;

            const shouldFetchProfile = !select || Boolean(select.profile);
            if (shouldFetchProfile && users.length > 0) {
              const userIds = users.map(u => u.id);
              const profRes = await client.query(
                'SELECT * FROM "StudentProfile" WHERE "userId" = ANY($1)',
                [userIds]
              );
              const profileMap = new Map();
              for (const p of profRes.rows) {
                profileMap.set(p.userId, p);
              }
              for (const u of users) {
                u.profile = profileMap.get(u.id) || null;
              }
            }

            for (const u of users) {
              u._id = u.id;
            }

            if (select) {
              users = users.map(u => {
                const item = { _id: u.id };
                for (const k of Object.keys(select)) {
                  item[k] = u[k];
                }
                return item;
              });
            } else {
              users.forEach(u => delete u.passwordHash);
            }

            return users;
          }
        } finally {
          client.release();
        }
      } catch (err) {
        console.error('[User.findMany Error]', err);
      }
    }

    let list = this.memoryStore ? [...this.memoryStore.users] : [];
    if (where.role) list = list.filter(u => u.role === where.role);
    if (where.search) {
      const s = String(where.search).toLowerCase();
      list = list.filter(u =>
        (u.name && u.name.toLowerCase().includes(s)) ||
        (u.email && u.email.toLowerCase().includes(s))
      );
    }

    list = list.map(u => {
      const copy = { ...u, _id: u.id };
      if (!select || select.profile) {
        copy.profile = this.memoryStore?.profiles.find(p => p.userId === u.id) || null;
      }
      return copy;
    });

    if (!select) {
      list.forEach(u => delete u.passwordHash);
      return list;
    }

    return list.map(u => {
      const res = { _id: u.id };
      for (const k of Object.keys(select)) {
        res[k] = u[k];
      }
      return res;
    });
  }

  async create({ data, include }) {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          const res = await client.query(
            `INSERT INTO "User" (name, email, "passwordHash", role, enabled)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [data.name, data.email, data.passwordHash, data.role || 'STUDENT', data.enabled !== undefined ? data.enabled : true]
          );
          if (res && res.rows.length > 0) {
            const user = res.rows[0];
            if (data.profile?.create) {
              const profData = data.profile.create;
              const cols = ['"userId"'];
              const placeholders = ['$1'];
              const vals = [user.id];
              let idx = 2;
              for (const [k, v] of Object.entries(profData)) {
                cols.push(`"${k}"`);
                placeholders.push(`$${idx++}`);
                vals.push(v);
              }
              const profRes = await client.query(
                `INSERT INTO "StudentProfile" (${cols.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
                vals
              );
              if (include?.profile) user.profile = profRes.rows[0];
            }
            return user;
          }
        } finally {
          client.release();
        }
      } catch (err) {
        console.error('[User.create Error]', err);
      }
    }

    const id = this.memoryStore ? this.memoryStore.idCounter.users++ : Date.now();
    const newUser = {
      id,
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role || 'STUDENT',
      enabled: data.enabled !== undefined ? data.enabled : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (this.memoryStore) {
      this.memoryStore.users.push(newUser);
      if (data.profile?.create) {
        const profId = this.memoryStore.idCounter.profiles++;
        const newProf = {
          id: profId,
          userId: id,
          ...data.profile.create,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.memoryStore.profiles.push(newProf);
        if (include?.profile) newUser.profile = newProf;
      }
    }
    return newUser;
  }

  async update({ where, data, select }) {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          const fields = [];
          const values = [];
          let idx = 1;
          for (const [key, val] of Object.entries(data)) {
            fields.push(`"${key}" = $${idx++}`);
            values.push(val);
          }
          values.push(Number(where.id));
          const query = `UPDATE "User" SET ${fields.join(', ')}, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *`;
          const res = await client.query(query, values);
          if (res && res.rows.length > 0) {
            const row = res.rows[0];
            row._id = row.id;
            delete row.passwordHash;
            return row;
          }
        } finally {
          client.release();
        }
      } catch (err) {}
    }

    if (this.memoryStore) {
      const u = this.memoryStore.users.find(x => x.id === Number(where.id));
      if (!u) throw new Error('User not found');
      Object.assign(u, data, { updatedAt: new Date() });
      if (select) {
        const res = {};
        for (const k of Object.keys(select)) res[k] = u[k];
        return res;
      }
      return u;
    }
    return null;
  }

  async count({ where = {} } = {}) {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          let query = 'SELECT COUNT(*) as count FROM "User"';
          const params = [];
          if (where.role) {
            query += ' WHERE role = $1';
            params.push(where.role);
          }
          const res = await client.query(query, params);
          if (res && res.rows.length > 0) return Number(res.rows[0].count);
        } finally {
          client.release();
        }
      } catch (err) {}
    }

    if (this.memoryStore) {
      let list = this.memoryStore.users;
      if (where.role) list = list.filter(u => u.role === where.role);
      return list.length;
    }
    return 0;
  }

  async deleteMany() {
    if (this.pool) {
      try {
        const client = await this.pool.connect();
        try {
          await client.query('DELETE FROM "StudentProfile"');
          await client.query('DELETE FROM "User"');
        } finally {
          client.release();
        }
      } catch (err) {}
    }
    if (this.memoryStore) this.memoryStore.users = [];
    return { count: 0 };
  }
}
