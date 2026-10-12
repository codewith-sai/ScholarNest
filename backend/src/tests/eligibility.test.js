/**
 * Unit Tests for ScholarNest Deterministic Eligibility Engine
 */
import assert from 'node:assert';
import { evaluateEligibility } from '../services/eligibilityService.js';

console.log('--- RUNNING DETERMINISTIC ELIGIBILITY TESTS ---');

// Mock MahaDBT Scholarship: Rajarshi Chhatrapati Shahu Maharaj (EBC / Open)
const ebcScholarship = {
  id: 1,
  name: 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC)',
  eligibility: [
    { field: 'state', operator: 'IN', values: ['Maharashtra'], required: true, label: 'State Domicile' },
    { field: 'category', operator: 'IN', values: ['OPEN', 'General', 'EWS'], required: true, label: 'Caste Category' },
    { field: 'annualIncome', maxValue: 800000, required: true, label: 'Annual Family Income' },
    { field: 'percentage', minValue: 50, required: true, label: 'Previous Percentage' },
  ]
};

// Mock MahaDBT Scholarship: Post-Matric SC
const scScholarship = {
  id: 2,
  name: 'Government of India Post-Matric Scholarship for SC Students',
  eligibility: [
    { field: 'state', operator: 'IN', values: ['Maharashtra'], required: true, label: 'State Domicile' },
    { field: 'category', operator: 'IN', values: ['SC'], required: true, label: 'Caste Category' },
    { field: 'annualIncome', maxValue: 250000, required: true, label: 'Annual Family Income' }
  ]
};

// Test 1: Eligible EBC Student
{
  const student = {
    state: 'Maharashtra',
    category: 'OPEN',
    annualIncome: 350000,
    percentage: 75
  };
  const res = evaluateEligibility(student, ebcScholarship);
  assert.strictEqual(res.eligible, true, 'Student should be eligible for EBC');
  assert.strictEqual(res.unmetCriteria.length, 0);
  assert.ok(res.matchReasons.length >= 3);
  console.log('✓ Test 1 Passed: Eligible EBC student correctly identified.');
}

// Test 2: Ineligible due to income exceeding ceiling
{
  const wealthyStudent = {
    state: 'Maharashtra',
    category: 'OPEN',
    annualIncome: 950000, // exceeds 8,00,000
    percentage: 85
  };
  const res = evaluateEligibility(wealthyStudent, ebcScholarship);
  assert.strictEqual(res.eligible, false, 'Student exceeding income ceiling must be ineligible');
  assert.ok(res.unmetCriteria.some(c => c.includes('exceeds the ceiling limit')));
  console.log('✓ Test 2 Passed: Income ceiling correctly disqualifies student.');
}

// Test 3: SC Category matching
{
  const scStudent = {
    state: 'Maharashtra',
    category: 'SC',
    annualIncome: 180000
  };
  const res = evaluateEligibility(scStudent, scScholarship);
  assert.strictEqual(res.eligible, true, 'SC student within income limit is eligible');
  console.log('✓ Test 3 Passed: SC student correctly identified.');
}

// Test 4: Category mismatch
{
  const obcStudent = {
    state: 'Maharashtra',
    category: 'OBC',
    annualIncome: 180000
  };
  const res = evaluateEligibility(obcStudent, scScholarship);
  assert.strictEqual(res.eligible, false, 'OBC student is not eligible for SC scheme');
  assert.ok(res.unmetCriteria.some(c => c.includes('not listed in eligible categories')));
  console.log('✓ Test 4 Passed: Category mismatch correctly identified.');
}

// Test 5: Missing required field flagged as pending
{
  const incompleteStudent = {
    state: 'Maharashtra',
    category: 'SC'
    // annualIncome missing
  };
  const res = evaluateEligibility(incompleteStudent, scScholarship);
  assert.strictEqual(res.eligible, false, 'Missing income must prevent certification');
  assert.strictEqual(res.pendingProfileFields.length, 1);
  console.log('✓ Test 5 Passed: Incomplete profile fields flagged accurately.');
}

console.log('ALL 5 ELIGIBILITY TESTS PASSED SUCCESSFULLY!');

