import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/prisma.js';

const documents = ['Government-issued photo ID', 'Income certificate (if applicable)', 'Previous marksheet', 'Admission or bonafide certificate'];
const rules = (items) => items.map(([field, values, minValue, maxValue, label]) => ({ field, values: values || [], minValue: minValue ?? null, maxValue: maxValue ?? null, label, required: true }));
const demos = [
  ['Demo OBC Engineering Grant', 'ScholarNest Demo Foundation', 'Demo record only — shows how a category and engineering match can work. Verify real opportunities independently.', 'Merit + need', 'Up to ₹40,000 demo tuition support', 40000, rules([['category',['OBC'],null,null,'Category'],['course',['B.Tech','Engineering'],null,null,'Course'],['annualIncome',null,null,300000,'Family income'],['cgpa',null,7,null,'CGPA']])],
  ['Demo Women in STEM Award', 'ScholarNest Demo Foundation', 'Demo record only — example of a women-in-STEM eligibility configuration.', 'Merit', 'Up to ₹50,000 demo assistance', 50000, rules([['gender',['Female'],null,null,'Gender'],['course',['B.Tech','Computer Science','Engineering'],null,null,'Course'],['percentage',null,70,null,'Previous percentage']])],
  ['Demo Maharashtra Access Fund', 'ScholarNest Demo Foundation', 'Demo record only — example state-specific listing.', 'Need based', 'Up to ₹25,000 demo maintenance support', 25000, rules([['state',['Maharashtra'],null,null,'State'],['annualIncome',null,null,250000,'Family income']])],
  ['Demo SC Higher Education Support', 'ScholarNest Demo Foundation', 'Demo record only — example social-category listing.', 'Need based', 'Up to ₹35,000 demo support', 35000, rules([['category',['SC'],null,null,'Category'],['annualIncome',null,null,250000,'Family income']])],
  ['Demo EWS Merit Scholarship', 'ScholarNest Demo Foundation', 'Demo record only — example EWS merit listing.', 'Merit', 'Up to ₹30,000 demo support', 30000, rules([['category',['EWS'],null,null,'Category'],['percentage',null,75,null,'Previous percentage']])],
];

async function main() {
  await prisma.notification.deleteMany(); await prisma.applicationTracking.deleteMany(); await prisma.savedScholarship.deleteMany(); await prisma.scholarshipEligibility.deleteMany(); await prisma.scholarshipDocument.deleteMany(); await prisma.scholarship.deleteMany(); await prisma.user.deleteMany();
  await prisma.user.create({ data: { name: 'ScholarNest Admin', email: 'admin@scholarnest.local', passwordHash: await bcrypt.hash('Admin@123', 12), role: 'ADMIN' } });
  const student = await prisma.user.create({ data: { name: 'Demo Student', email: 'student@scholarnest.local', passwordHash: await bcrypt.hash('Student@123', 12), profile: { create: { gender: 'Female', state: 'Maharashtra', district: 'Pune', city: 'Pune', category: 'OBC', annualIncome: 250000, educationLevel: 'Undergraduate', college: 'Demo Institute', course: 'B.Tech', branch: 'Computer Science', academicYear: 2, percentage: 82, cgpa: 8.1, minorityStatus: false, disabilityStatus: false, incomeCertificate: true, profileCompleted: true } } }, include: { profile: true } });
  for (const [name, provider, description, scholarshipType, benefits, amount, eligibility] of demos) {
    await prisma.scholarship.create({ data: { name, provider, description, scholarshipType, benefits, amount, openingDate: new Date('2026-08-01'), deadline: new Date(2026, 9, 15), applicationUrl: 'https://example.com/scholarnest-demo-not-an-official-portal', applicationInstructions: 'Demo only. This is not an official application link. An administrator must replace it with a verified official URL.', isDemo: true, eligibility: { create: eligibility }, documents: { create: documents.map(documentName => ({ documentName })) } } });
  }
  await prisma.notification.create({ data: { studentId: student.profile.id, title: 'Welcome to ScholarNest', message: 'Your demo profile is complete. These listings are demo data; verify any real scholarship requirements before applying.', type: 'INFO' } });
}
main().then(() => prisma.$disconnect()).catch(error => { console.error(error); prisma.$disconnect(); process.exit(1); });
