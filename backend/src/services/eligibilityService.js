/**
 * ScholarNest - Deterministic Eligibility Service
 * 
 * Evaluates student profiles against scholarship criteria using strict,
 * deterministic logic. Never guesses; returns explainable reasons.
 */

const FIELD_LABELS = {
  category: 'Caste / Social Category',
  state: 'State',
  domicileState: 'Maharashtra Domicile',
  course: 'Course / Stream',
  branch: 'Branch / Specialization',
  educationLevel: 'Education Level',
  academicYear: 'Academic Year',
  gender: 'Gender Requirement',
  minorityStatus: 'Minority Status',
  disabilityStatus: 'Disability Status',
  annualIncome: 'Annual Family Income Limit',
  percentage: 'Minimum Marks / Percentage',
  cgpa: 'Minimum CGPA',
  incomeCertificate: 'Income Certificate Availability'
};

/**
 * Normalizes string for case-insensitive matching
 */
function normalize(str) {
  return String(str || '').trim().toLowerCase();
}

/**
 * Evaluates a single student against a scholarship's criteria
 * @param {Object} profile - Student profile data
 * @param {Object} scholarship - Scholarship object including eligibility rules array
 * @returns {Object} { eligible, matchScore, matchReasons, unmetCriteria, pendingProfileFields, disclaimer }
 */
export function evaluateEligibility(profile = {}, scholarship = {}) {
  const matchReasons = [];
  const unmetCriteria = [];
  const pendingProfileFields = [];
  const rules = scholarship.eligibility || [];

  if (!rules || rules.length === 0) {
    return {
      eligible: true,
      matchScore: 100,
      matchReasons: ['Open to all eligible students meeting standard institutional criteria.'],
      unmetCriteria: [],
      pendingProfileFields: [],
      disclaimer: 'Informational match based on available information. Please verify latest guidelines on the official portal.'
    };
  }

  for (const rule of rules) {
    const fieldKey = rule.field;
    const label = rule.label || FIELD_LABELS[fieldKey] || fieldKey;
    const studentVal = profile[fieldKey];

    // Check if student profile is missing this required field
    if (studentVal === null || studentVal === undefined || studentVal === '') {
      if (rule.required) {
        pendingProfileFields.push({
          field: fieldKey,
          label,
          message: `Add ${label} to your profile to verify this requirement.`
        });
        unmetCriteria.push(`${label}: Information missing from profile`);
      }
      continue;
    }

    let isMatch = true;
    let matchDetail = '';
    let failureDetail = '';

    // 1. IN / NOT_IN operator (categorical values e.g. OBC, SC, Maharashtra, Engineering)
    if (rule.operator === 'IN' || !rule.operator) {
      const allowed = Array.isArray(rule.values) ? rule.values : [];
      if (allowed.length > 0) {
        const allowedNormalized = allowed.map(normalize);
        const actualNormalized = normalize(studentVal);

        // Substring / exact containment check (handles e.g. "B.Tech" matching "Engineering")
        const hasMatch = allowedNormalized.some(opt => 
          opt === actualNormalized || actualNormalized.includes(opt) || opt.includes(actualNormalized)
        );

        if (hasMatch) {
          matchDetail = `${label}: Your "${studentVal}" matches eligible categories (${allowed.join(', ')})`;
        } else {
          isMatch = false;
          failureDetail = `${label}: Your "${studentVal}" is not listed in eligible categories (${allowed.join(', ')})`;
        }
      }
    }

    // 2. Numerical Minimum constraint (percentage >= min, cgpa >= min)
    if (rule.minValue !== null && rule.minValue !== undefined) {
      const numVal = Number(studentVal);
      const minVal = Number(rule.minValue);
      if (!isNaN(numVal) && !isNaN(minVal)) {
        if (numVal >= minVal) {
          matchDetail = `${label}: Your score (${numVal}) meets or exceeds the required minimum (${minVal})`;
        } else {
          isMatch = false;
          failureDetail = `${label}: Your score (${numVal}) is below the required minimum (${minVal})`;
        }
      }
    }

    // 3. Numerical Maximum constraint (annual income <= max income)
    if (rule.maxValue !== null && rule.maxValue !== undefined) {
      const numVal = Number(studentVal);
      const maxVal = Number(rule.maxValue);
      if (!isNaN(numVal) && !isNaN(maxVal)) {
        if (numVal <= maxVal) {
          matchDetail = `${label}: Your family income (₹${numVal.toLocaleString('en-IN')}) is within the allowable limit (₹${maxVal.toLocaleString('en-IN')})`;
        } else {
          isMatch = false;
          failureDetail = `${label}: Your family income (₹${numVal.toLocaleString('en-IN')}) exceeds the ceiling limit of ₹${maxVal.toLocaleString('en-IN')})`;
        }
      }
    }

    // 4. Boolean constraint (minorityStatus, disabilityStatus, incomeCertificate)
    if (typeof rule.values === 'boolean' || rule.values === 'true' || rule.values === 'false') {
      const requiredBool = rule.values === true || rule.values === 'true';
      const actualBool = Boolean(studentVal);
      if (actualBool === requiredBool) {
        matchDetail = `${label}: Requirement fulfilled`;
      } else {
        isMatch = false;
        failureDetail = `${label}: Requires ${requiredBool ? 'Yes' : 'No'}`;
      }
    }

    if (isMatch) {
      if (matchDetail) matchReasons.push(matchDetail);
    } else {
      if (failureDetail) unmetCriteria.push(failureDetail);
    }
  }

  const eligible = unmetCriteria.length === 0 && pendingProfileFields.length === 0;
  const totalChecked = rules.length;
  const matchScore = totalChecked > 0 
    ? Math.round((matchReasons.length / totalChecked) * 100) 
    : 100;

  return {
    eligible,
    matchScore: eligible ? matchScore : Math.max(0, matchScore - 20),
    matchReasons,
    unmetCriteria,
    pendingProfileFields,
    disclaimer: 'Based on the information you provided, you appear to meet the listed eligibility criteria. Always verify current requirements on the official portal before applying.'
  };
}

/**
 * Evaluates multiple scholarships for a student profile
 */
export function evaluateAllScholarships(profile, scholarships = []) {
  return scholarships.map(scholarship => {
    const evaluation = evaluateEligibility(profile, scholarship);
    return {
      ...scholarship,
      match: evaluation
    };
  });
}

