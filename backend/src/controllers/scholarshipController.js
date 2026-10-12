import { db } from '../db.js';
import { evaluateEligibility } from '../services/eligibilityService.js';

export async function getAllScholarships(req, res, next) {
  try {
    const {
      search,
      category,
      state,
      educationLevel,
      course,
      gender,
      maxIncome,
      sort
    } = req.query;

    let scholarships = await db.scholarship.findMany({
      where: { active: true }
    });

    // 1. Text Search
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      scholarships = scholarships.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q) ||
        (s.governmentDepartment && s.governmentDepartment.toLowerCase().includes(q)) ||
        s.description.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (category && category.trim()) {
      const cat = category.trim().toLowerCase();
      scholarships = scholarships.filter(s => {
        const catRule = s.eligibility?.find(r => r.field === 'category');
        if (!catRule) return true; // open to all
        return catRule.values?.some(v => String(v).toLowerCase() === cat);
      });
    }

    // 3. State Filter
    if (state && state.trim()) {
      const st = state.trim().toLowerCase();
      scholarships = scholarships.filter(s => {
        const stRule = s.eligibility?.find(r => r.field === 'state' || r.field === 'domicileState');
        if (!stRule) return true;
        return stRule.values?.some(v => String(v).toLowerCase() === st || String(v).toLowerCase() === 'all');
      });
    }

    // 4. Education Level Filter
    if (educationLevel && educationLevel.trim()) {
      const el = educationLevel.trim().toLowerCase();
      scholarships = scholarships.filter(s => {
        const elRule = s.eligibility?.find(r => r.field === 'educationLevel');
        if (!elRule) return true;
        return elRule.values?.some(v => String(v).toLowerCase().includes(el));
      });
    }

    // 5. Course Filter
    if (course && course.trim()) {
      const cr = course.trim().toLowerCase();
      scholarships = scholarships.filter(s => {
        const crRule = s.eligibility?.find(r => r.field === 'course');
        if (!crRule) return true;
        return crRule.values?.some(v => String(v).toLowerCase().includes(cr));
      });
    }

    // 6. Max Income Filter
    if (maxIncome) {
      const inc = Number(maxIncome);
      scholarships = scholarships.filter(s => {
        const incRule = s.eligibility?.find(r => r.field === 'annualIncome');
        if (!incRule || incRule.maxValue == null) return true;
        return inc <= incRule.maxValue;
      });
    }

    // 7. Gender Filter
    if (gender && gender.trim()) {
      const gen = gender.trim().toLowerCase();
      scholarships = scholarships.filter(s => {
        const genRule = s.eligibility?.find(r => r.field === 'gender');
        if (!genRule) return true;
        return genRule.values?.some(v => String(v).toLowerCase() === gen || String(v).toLowerCase() === 'any');
      });
    }

    // 8. Sorting
    if (sort === 'deadline') {
      scholarships.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });
    } else if (sort === 'amount') {
      scholarships.sort((a, b) => (b.amount || 0) - (a.amount || 0));
    } else if (sort === 'verified') {
      scholarships.sort((a, b) => new Date(b.lastVerifiedDate || 0) - new Date(a.lastVerifiedDate || 0));
    }

    res.json({
      total: scholarships.length,
      scholarships
    });
  } catch (error) {
    next(error);
  }
}

export async function getEligibleScholarships(req, res, next) {
  try {
    const studentProfile = req.user?.profile;
    const allScholarships = await db.scholarship.findMany({
      where: { active: true }
    });

    if (!studentProfile) {
      return res.json({
        total: allScholarships.length,
        eligibleCount: 0,
        scholarships: allScholarships.map(s => ({
          ...s,
          match: {
            eligible: false,
            matchScore: 0,
            matchReasons: [],
            unmetCriteria: ['Please complete your student profile to evaluate eligibility.']
          }
        }))
      });
    }

    const evaluated = allScholarships.map(s => {
      const match = evaluateEligibility(studentProfile, s);
      return {
        ...s,
        match
      };
    });

    // Sort: eligible first, then higher match score
    evaluated.sort((a, b) => {
      if (a.match.eligible && !b.match.eligible) return -1;
      if (!a.match.eligible && b.match.eligible) return 1;
      return (b.match.matchScore || 0) - (a.match.matchScore || 0);
    });

    const eligibleCount = evaluated.filter(s => s.match.eligible).length;

    res.json({
      total: evaluated.length,
      eligibleCount,
      scholarships: evaluated
    });
  } catch (error) {
    next(error);
  }
}

export async function evaluateAnonymous(req, res, next) {
  try {
    const candidateProfile = req.body || {};
    const allScholarships = await db.scholarship.findMany({
      where: { active: true }
    });

    const evaluated = allScholarships.map(s => {
      const match = evaluateEligibility(candidateProfile, s);
      return {
        ...s,
        match
      };
    });

    evaluated.sort((a, b) => {
      if (a.match.eligible && !b.match.eligible) return -1;
      if (!a.match.eligible && b.match.eligible) return 1;
      return (b.match.matchScore || 0) - (a.match.matchScore || 0);
    });

    const eligibleCount = evaluated.filter(s => s.match.eligible).length;

    res.json({
      total: evaluated.length,
      eligibleCount,
      scholarships: evaluated,
      disclaimer: 'Based on the information you provided, you appear to meet the listed eligibility criteria. Always verify current requirements on the official portal before applying.'
    });
  } catch (error) {
    next(error);
  }
}

export async function getScholarshipById(req, res, next) {
  try {
    const scholarship = await db.scholarship.findUnique({
      where: { id: Number(req.params.id) }
    });

    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found.' });
    }

    let match = null;
    if (req.user?.profile) {
      match = evaluateEligibility(req.user.profile, scholarship);
    }

    const eligibilityCriteria = (scholarship.eligibility || []).map(r => {
      let vals = r.values;
      if (typeof vals === 'string') {
        try { vals = JSON.parse(vals); } catch(e) { vals = [vals]; }
      }
      return {
        ...r,
        values: Array.isArray(vals) ? vals : (vals ? [vals] : [])
      };
    });

    const requiredDocuments = (scholarship.documents || []).map(d =>
      typeof d === 'string' ? d : (d.documentName || d.name || '')
    ).filter(Boolean);

    const enriched = {
      ...scholarship,
      _id: scholarship.id,
      eligibilityCriteria,
      requiredDocuments,
      department: scholarship.governmentDepartment || '',
      officialApplicationUrl: scholarship.applicationUrl || '',
      match
    };

    res.json({
      success: true,
      scholarship: enriched,
      ...enriched
    });
  } catch (error) {
    next(error);
  }
}

export async function saveScholarship(req, res, next) {
  try {
    if (!req.user.profile) {
      return res.status(400).json({ message: 'Profile required to save scholarships.' });
    }

    const scholarshipId = Number(req.params.id || req.body?.scholarshipId || req.body?.id);
    if (!scholarshipId || isNaN(scholarshipId)) {
      return res.status(400).json({ message: 'Valid scholarship ID is required.' });
    }

    await db.savedScholarship.upsert({
      where: {
        studentId_scholarshipId: {
          studentId: req.user.profile.id,
          scholarshipId
        }
      },
      create: {}
    });

    await db.applicationTracking.upsert({
      where: {
        studentId_scholarshipId: {
          studentId: req.user.profile.id,
          scholarshipId
        }
      },
      create: { status: 'SAVED' }
    });

    res.status(201).json({ message: 'Scholarship saved to your list.' });
  } catch (error) {
    next(error);
  }
}

export async function unsaveScholarship(req, res, next) {
  try {
    if (!req.user.profile) {
      return res.status(400).json({ message: 'Profile required.' });
    }

    const scholarshipId = Number(req.params.id || req.body?.scholarshipId || req.body?.id);
    if (!scholarshipId || isNaN(scholarshipId)) {
      return res.status(400).json({ message: 'Valid scholarship ID is required.' });
    }

    await db.savedScholarship.delete({
      where: {
        studentId_scholarshipId: {
          studentId: req.user.profile.id,
          scholarshipId
        }
      }
    });

    res.json({ message: 'Scholarship removed from saved list.' });
  } catch (error) {
    next(error);
  }
}

export async function getSavedScholarships(req, res, next) {
  try {
    if (!req.user.profile) {
      return res.json({ saved: [] });
    }

    const saved = await db.savedScholarship.findMany({
      where: { studentId: req.user.profile.id }
    });

    res.json({ saved });
  } catch (error) {
    next(error);
  }
}
