import { z } from 'zod';
import { db } from '../db.js';
import { notifyStudentsAboutScholarship } from '../services/emailService.js';

function parseDateSafely(val) {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  const str = String(val).trim();
  const dmy = str.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (dmy) {
    const d = new Date(`${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function normalizeScholarshipInput(body) {
  const b = body || {};

  // Benefits parsing
  let benefitsSummary = '';
  let tuitionFee = b.tuitionFee || null;
  let maintenanceAllowance = b.maintenanceAllowance || null;
  let hostelAllowance = b.hostelAllowance || null;
  let amount = b.amount !== undefined ? (b.amount === null || b.amount === '' ? null : Number(b.amount)) : null;

  if (typeof b.benefits === 'string') {
    benefitsSummary = b.benefits;
  } else if (b.benefits && typeof b.benefits === 'object') {
    if (b.benefits.tuitionFee) tuitionFee = b.benefits.tuitionFee;
    if (b.benefits.maintenanceAllowance) maintenanceAllowance = b.benefits.maintenanceAllowance;
    if (b.benefits.hostelAllowance) hostelAllowance = b.benefits.hostelAllowance;
    if (b.benefits.amount !== undefined && b.benefits.amount !== null && b.benefits.amount !== '') {
      amount = Number(b.benefits.amount);
    }
    benefitsSummary = [
      b.benefits.tuitionFee,
      b.benefits.maintenanceAllowance,
      b.benefits.examinationFee,
      b.benefits.hostelAllowance,
      b.benefits.otherBenefits
    ].filter(Boolean).join('; ') || (amount ? `Financial benefit of ₹${amount}` : 'Scholarship financial aid');
  }

  if (!benefitsSummary && (tuitionFee || amount)) {
    benefitsSummary = tuitionFee || `Financial benefit of ₹${amount}`;
  }
  if (!benefitsSummary) {
    benefitsSummary = 'Financial assistance as per government guidelines';
  }

  // Department & Authority
  const governmentDepartment = b.governmentDepartment || b.department || null;
  const sourceAuthority = b.sourceAuthority || b.sourceType || b.sourceName || 'MahaDBT 2.0';

  // URLs
  const applicationUrl = b.applicationUrl || b.officialApplicationUrl || b.sourceUrl || null;
  const officialInfoUrl = b.officialInfoUrl || b.sourceUrl || b.officialApplicationUrl || null;

  // Instructions
  let applicationInstructions = b.applicationInstructions || null;
  if (!applicationInstructions && Array.isArray(b.applicationGuidance)) {
    applicationInstructions = b.applicationGuidance
      .map(g => `${g.stepNumber || ''}. ${g.title || ''}: ${g.description || ''}`.trim())
      .join('\n');
  }

  // Eligibility
  const rawElig = b.eligibility || b.eligibilityCriteria || [];
  const eligibility = Array.isArray(rawElig) ? rawElig.map(r => ({
    field: r.field || 'casteCategory',
    operator: r.operator || 'IN',
    values: Array.isArray(r.values) ? r.values : (r.values ? [r.values] : []),
    minValue: r.minValue !== undefined && r.minValue !== null && r.minValue !== '' ? Number(r.minValue) : null,
    maxValue: r.maxValue !== undefined && r.maxValue !== null && r.maxValue !== '' ? Number(r.maxValue) : null,
    required: r.required !== undefined ? Boolean(r.required) : true,
    label: r.label || null
  })) : [];

  // Documents
  const rawDocs = b.documents || b.requiredDocuments || [];
  const documents = Array.isArray(rawDocs) ? rawDocs.map(d => ({
    documentName: typeof d === 'string' ? d : (d.documentName || d.name || 'Document'),
    mandatory: typeof d === 'object' && d.mandatory !== undefined ? Boolean(d.mandatory) : true
  })) : [];

  const openingDate = parseDateSafely(b.openingDate);
  const deadline = parseDateSafely(b.deadline);

  return {
    name: String(b.name || '').trim(),
    provider: String(b.provider || '').trim() || 'Government Department',
    governmentDepartment,
    schemeLevel: b.schemeLevel || 'STATE',
    applicableStates: Array.isArray(b.applicableStates) ? b.applicableStates : ['Maharashtra'],
    description: String(b.description || '').trim() || 'Government scholarship scheme for eligible students.',
    scholarshipType: b.scholarshipType || 'Category Specific',
    benefits: benefitsSummary,
    tuitionFee,
    maintenanceAllowance,
    hostelAllowance,
    amount,
    openingDate,
    deadline,
    applicationUrl,
    officialInfoUrl,
    applicationInstructions,
    sourceAuthority,
    verificationStatus: (b.verificationStatus === 'NEEDS_VERIFICATION' || b.verificationStatus === 'EXPIRED') ? b.verificationStatus : 'VERIFIED',
    active: b.active !== undefined ? Boolean(b.active) : (b.isActive !== undefined ? Boolean(b.isActive) : true),
    isDemo: Boolean(b.isDemo),
    eligibility,
    documents
  };
}

export async function getStats(req, res, next) {
  try {
    const students = await db.user.count({ where: { role: 'STUDENT' } });
    const scholarships = await db.scholarship.count();
    const active = await db.scholarship.count({ where: { active: true } });
    const applications = await db.applicationTracking.count();
    const upcoming = await db.scholarship.count({
      where: { deadline: { gte: new Date() } }
    });

    res.json({
      students,
      scholarships,
      active,
      applications,
      upcoming
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllScholarships(req, res, next) {
  try {
    const scholarships = await db.scholarship.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    res.json({ success: true, scholarships });
  } catch (error) {
    next(error);
  }
}

export async function createScholarship(req, res, next) {
  try {
    if (!req.body || !req.body.name) {
      return res.status(400).json({ message: 'Scholarship name is required.' });
    }

    const data = normalizeScholarshipInput(req.body);
    data.lastVerifiedDate = new Date();

    const created = await db.scholarship.create({ data });

    // Send in-app notification & email alert to all students in background
    notifyStudentsAboutScholarship(created).catch(err => {
      console.error('⚠️ [Notification Broadcast Error on create]:', err.message);
    });

    res.status(201).json({
      success: true,
      scholarship: created,
      message: 'Scholarship created successfully. Notification and email alerts dispatched to students.'
    });
  } catch (error) {
    next(error);
  }
}

export async function broadcastScholarshipNotification(req, res, next) {
  try {
    const id = Number(req.params.id);
    const scholarship = await db.scholarship.findUnique({ where: { id } });
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found.' });
    }

    const stats = await notifyStudentsAboutScholarship(scholarship);
    res.json({
      success: true,
      message: `Notification broadcast dispatched for "${scholarship.name}".`,
      stats
    });
  } catch (error) {
    next(error);
  }
}

export async function updateScholarship(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'Valid scholarship ID is required.' });
    }

    let data;
    // If partial update (like toggling status)
    if (!req.body.name && (req.body.active !== undefined || req.body.isActive !== undefined)) {
      data = {
        active: req.body.active !== undefined ? Boolean(req.body.active) : Boolean(req.body.isActive)
      };
    } else {
      data = normalizeScholarshipInput(req.body);
      data.lastVerifiedDate = new Date();
    }

    const updated = await db.scholarship.update({
      where: { id },
      data
    });

    res.json({ success: true, scholarship: updated, message: 'Scholarship updated successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function deleteScholarship(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'Valid scholarship ID is required.' });
    }
    await db.scholarship.delete({
      where: { id }
    });
    res.json({ success: true, message: 'Scholarship deleted successfully.' });
  } catch (error) {
    next(error);
  }
}

function calculateCompletion(p = {}) {
  if (!p) return 0;
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

export async function getAllStudents(req, res, next) {
  try {
    const search = req.query.search ? String(req.query.search).trim() : '';
    const students = await db.user.findMany({
      where: {
        role: 'STUDENT',
        ...(search ? { search } : {})
      },
      select: {
        id: true,
        name: true,
        email: true,
        enabled: true,
        createdAt: true,
        profile: true
      }
    });

    const mappedStudents = (students || []).map(st => {
      const prof = st.profile;
      const completionPercentage = prof ? calculateCompletion(prof) : 0;
      const isMaharashtraDomicile = Boolean(
        prof && ((prof.domicileState || prof.state || '').toLowerCase() === 'maharashtra')
      );

      return {
        ...st,
        _id: st.id,
        profile: prof ? {
          ...prof,
          casteCategory: prof.category || prof.casteCommunity || 'Not specified',
          isMaharashtraDomicile,
          annualIncome: prof.annualIncome !== null && prof.annualIncome !== undefined ? Number(prof.annualIncome) : 0,
          completionPercentage
        } : {
          casteCategory: 'Not specified',
          isMaharashtraDomicile: false,
          course: '—',
          college: '—',
          annualIncome: 0,
          completionPercentage: 0
        }
      };
    });

    res.json({
      success: true,
      students: mappedStudents
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleStudentEnabled(req, res, next) {
  try {
    const id = Number(req.params.id);
    let enabled = req.body?.enabled;
    if (enabled === undefined) {
      const existing = await db.user.findUnique({ where: { id } });
      enabled = !existing?.enabled;
    }

    const updated = await db.user.update({
      where: { id },
      data: { enabled: Boolean(enabled) },
      select: { id: true, enabled: true, name: true, email: true }
    });

    res.json({
      success: true,
      user: updated,
      message: `Student account ${enabled ? 'enabled' : 'disabled'}.`
    });
  } catch (error) {
    next(error);
  }
}

