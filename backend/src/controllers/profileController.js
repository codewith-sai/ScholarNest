import { db } from '../db.js';

function toBoolean(val) {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val === 1;
  if (typeof val === 'string') {
    const lower = val.trim().toLowerCase();
    if (lower === 'yes' || lower === 'true' || lower === '1' || lower === 'available' || lower === 'applied') return true;
    if (lower === 'no' || lower === 'false' || lower === '0' || lower === '' || lower === 'not available' || lower === 'not_available' || lower === 'none') return false;
  }
  return false;
}

function toNumber(val) {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'string') {
    const match = val.match(/\d+(\.\d+)?/);
    if (match) return Number(match[0]);
  }
  const num = Number(val);
  return isNaN(num) ? null : num;
}

function toDate(val) {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

function calculateCompletion(p = {}) {
  const fields = [
    'gender', 'state', 'category', 'annualIncome',
    'educationLevel', 'course', 'percentage'
  ];
  let filled = 0;
  for (const f of fields) {
    if (p[f] !== null && p[f] !== undefined && p[f] !== '') filled++;
  }
  return Math.round((filled / fields.length) * 100);
}

function formatAcademicYear(val) {
  if (val === null || val === undefined || val === '') return '';
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.toLowerCase() === 'other') return 'Other';
    if (trimmed.toLowerCase().includes('year')) return trimmed;
  }
  const num = typeof val === 'number' ? val : parseInt(String(val).match(/\d+/)?.[0] || '', 10);
  if (num === 1) return '1st Year';
  if (num === 2) return '2nd Year';
  if (num === 3) return '3rd Year';
  if (num === 4) return '4th Year';
  if (num === 5) return '5th Year';
  if (isNaN(num)) return String(val);
  return `${num}th Year`;
}

function mapProfileForClient(profile, userName = '', userEmail = '') {
  const p = profile || {};
  return {
    ...p,
    fullName: userName || p.fullName || '',
    email: userEmail || p.email || '',
    state: p.state || 'Maharashtra',
    domicileState: p.domicileState || p.state || 'Maharashtra',
    dob: p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().slice(0, 10) : '',
    annualIncome: p.annualIncome !== null && p.annualIncome !== undefined ? p.annualIncome : '',
    annualFamilyIncome: p.annualIncome !== null && p.annualIncome !== undefined ? p.annualIncome : '',
    previousPercentage: p.percentage !== null && p.percentage !== undefined ? p.percentage : '',
    percentage: p.percentage !== null && p.percentage !== undefined ? p.percentage : '',
    currentCGPA: p.cgpa !== null && p.cgpa !== undefined ? p.cgpa : '',
    cgpa: p.cgpa !== null && p.cgpa !== undefined ? p.cgpa : '',
    institution: p.college || '',
    college: p.college || '',
    taluka: p.taluka || '',
    district: p.district || '',
    city: p.city || '',
    category: p.category || '',
    minority: p.minorityStatus === true ? 'Yes' : p.minorityStatus === false ? 'No' : '',
    minorityStatus: p.minorityStatus === true ? 'Yes' : p.minorityStatus === false ? 'No' : '',
    disability: p.disabilityStatus === true ? 'Yes' : p.disabilityStatus === false ? 'No' : '',
    disabilityStatus: p.disabilityStatus === true ? 'Yes' : p.disabilityStatus === false ? 'No' : '',
    incomeCertificate: p.incomeCertificate === true ? 'Available' : p.incomeCertificate === false ? 'Not Available' : '',
    academicYear: formatAcademicYear(p.academicYear),
  };
}

export async function getProfile(req, res, next) {
  try {
    let profile = await db.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) {
      try {
        profile = await db.studentProfile.create({
          data: {
            userId: req.user.id,
            state: 'Maharashtra',
            domicileState: 'Maharashtra',
            profileCompleted: false
          }
        });
      } catch (e) {
        console.warn('Auto-create student profile note:', e.message);
      }
    }

    const completionRate = calculateCompletion(profile || {});
    const mapped = mapProfileForClient(profile, req.user.name, req.user.email);

    res.json({
      profile: mapped,
      data: mapped,
      completionRate,
      profileCompleted: completionRate >= 70
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const body = req.body || {};

    const rawIncome = body.annualIncome ?? body.annualFamilyIncome;
    const rawPercentage = body.percentage ?? body.previousPercentage;
    const rawCgpa = body.cgpa ?? body.currentCGPA;
    const rawCollege = body.college ?? body.institution;
    const rawDob = body.dateOfBirth ?? body.dob;
    const rawMinority = body.minorityStatus ?? body.minority;
    const rawDisability = body.disabilityStatus ?? body.disability;

    const parsedData = {
      dateOfBirth: toDate(rawDob),
      gender: body.gender || null,
      state: body.state || null,
      district: body.district || null,
      taluka: body.taluka || null,
      city: body.city || null,
      domicileState: body.domicileState || body.state || null,
      category: body.category || null,
      casteCommunity: body.casteCommunity || null,
      minorityStatus: toBoolean(rawMinority),
      disabilityStatus: toBoolean(rawDisability),
      disabilityPercentage: toNumber(body.disabilityPercentage),
      annualIncome: toNumber(rawIncome),
      incomeCertificate: toBoolean(body.incomeCertificate),
      parentOccupation: body.parentOccupation || null,
      educationLevel: body.educationLevel || null,
      college: rawCollege || null,
      course: body.course || null,
      branch: body.branch || null,
      academicYear: toNumber(body.academicYear),
      percentage: toNumber(rawPercentage),
      cgpa: toNumber(rawCgpa),
    };

    // If student updated full name, persist to User model as well
    const fullName = body.fullName || body.name;
    if (fullName && fullName.trim()) {
      await db.user.update({
        where: { id: req.user.id },
        data: { name: fullName.trim() }
      });
    }

    const completionRate = calculateCompletion(parsedData);
    const profileCompleted = completionRate >= 70;

    const profile = await db.studentProfile.upsert({
      where: { userId: req.user.id },
      create: {
        ...parsedData,
        profileCompleted
      },
      update: {
        ...parsedData,
        profileCompleted
      }
    });

    const mapped = mapProfileForClient(profile, fullName || req.user.name);

    res.json({
      profile: mapped,
      data: mapped,
      completionRate,
      profileCompleted,
      message: 'Profile updated successfully.'
    });
  } catch (error) {
    next(error);
  }
}
