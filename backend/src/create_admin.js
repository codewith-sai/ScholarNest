import { db } from './db.js';
import bcrypt from 'bcryptjs';

const email = process.argv[2] || process.env.ADMIN_EMAIL;
const password = process.argv[3] || process.env.ADMIN_PASSWORD;
const name = process.argv[4] || process.env.ADMIN_NAME || 'ScholarNest Admin';

if (!email || !password) {
  console.error('❌ Error: Email and password are required.');
  console.error('Usage: node src/create_admin.js <email> <password> [name]');
  console.error('Example: node src/create_admin.js admin@example.com MyStrongPassword123');
  process.exit(1);
}

async function main() {
  const passwordHash = await bcrypt.hash(password, 10);
  
  if (db._pool) {
    const client = await db._pool.connect();
    try {
      const res = await client.query('SELECT id FROM "User" WHERE LOWER(email) = LOWER($1)', [email]);
      if (res.rows.length > 0) {
        await client.query(
          'UPDATE "User" SET name = $1, "passwordHash" = $2, role = \'ADMIN\', enabled = true, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $3',
          [name, passwordHash, res.rows[0].id]
        );
        console.log(`✅ Updated existing admin account for: ${email}`);
      } else {
        await client.query(
          'INSERT INTO "User" (name, email, "passwordHash", role, enabled) VALUES ($1, $2, $3, \'ADMIN\', true)',
          [name, email, passwordHash]
        );
        console.log(`✅ Created new admin account for: ${email}`);
      }
    } finally {
      client.release();
    }
  } else {
    let u = await db.user.findUnique({ where: { email } });
    if (u) {
      await db.user.update({ where: { id: u.id }, data: { name, passwordHash, role: 'ADMIN', enabled: true } });
      console.log(`✅ Updated admin in memory: ${email}`);
    } else {
      await db.user.create({ data: { name, email, passwordHash, role: 'ADMIN', enabled: true } });
      console.log(`✅ Created admin in memory: ${email}`);
    }
  }

  console.log(`===============================================`);
  console.log(`  Admin Credentials Ready:                     `);
  console.log(`  Email:    ${email}                           `);
  console.log(`  Password: ${password}                        `);
  console.log(`===============================================`);
  process.exit(0);
}

main().catch(err => {
  console.error('Error creating admin:', err);
  process.exit(1);
});

