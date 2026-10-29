/**
 * Unit Tests for ScholarNest Authentication & Default Admin Account
 */
import assert from 'node:assert';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';

console.log('--- RUNNING AUTHENTICATION & ADMIN VERIFICATION TESTS ---');

async function runTests() {
  const adminEmail = process.env.ADMIN_EMAIL || 'sai@gmail.com';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin1234';

  const admin = await db.user.findUnique({ where: { email: adminEmail } });

  assert.ok(admin, `Admin account (${adminEmail}) should exist in database`);
  assert.strictEqual(admin.role, 'ADMIN', `Admin account role must be ADMIN`);
  assert.strictEqual(admin.enabled, true, `Admin account must be enabled`);

  const passwordValid = await bcrypt.compare(expectedPassword, admin.passwordHash);
  assert.strictEqual(passwordValid, true, `Password hash should match '${expectedPassword}'`);

  console.log(`✓ Test 1 Passed: Default admin user (${adminEmail}) exists with ADMIN role.`);
  console.log(`✓ Test 2 Passed: Password hash matches '${expectedPassword}'.`);
  console.log('ALL AUTHENTICATION TESTS PASSED SUCCESSFULLY!');
}

runTests()
  .then(() => {
    if (db._pool) {
      db._pool.end().then(() => process.exit(0));
    } else {
      process.exit(0);
    }
  })
  .catch(err => {
    console.error('❌ Auth test failed:', err);
    process.exit(1);
  });

