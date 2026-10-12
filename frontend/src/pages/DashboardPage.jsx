
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Normalize gender values from profile and scholarship records.
const normalizeGender = (gender) => {
  const value = String(gender || '')
    .trim()
    .toLowerCase();

  if (['male', 'man', 'men'].includes(value)) {
    return 'male';
  }

  if (['female', 'woman', 'women'].includes(value)) {
    return 'female';
  }

  if (['other', 'others', 'non-binary', 'nonbinary'].includes(value)) {
    return 'other';
  }

  return '';
};

// Normalize scholarship gender restrictions.
const normalizeGenderEligibility = (gender) => {
  const value = String(gender || 'all')
    .trim()
    .toLowerCase();

  if (
    ['all', 'any', 'both', 'all genders', ''].includes(value)
  ) {
    return 'all';
  }

  if (['male', 'man', 'men', 'boys'].includes(value)) {
    return 'male';
  }

  if (
    ['female', 'woman', 'women', 'girls'].includes(value)
  ) {
    return 'female';
  }

  return 'unknown';
};

// Check whether the student's gender matches a scheme.
const isGenderEligible = (studentGender, scholarship) => {
  // Support either field name, depending on your backend schema.
  const restriction =
    scholarship.genderEligibility ??
    scholarship.eligibleGender ??
    scholarship.gender ??
    'all';

  const allowedGender = normalizeGenderEligibility(restriction);

  // Scholarships open to everyone.
  if (allowedGender === 'all') {
    return true;
  }

  // Do not match unknown student genders to restricted schemes.
  if (!studentGender) {
    return false;
  }

  return allowedGender === studentGender;
};

export default function DashboardPage() {
  const { user } = useAuth();

  const [scholarships, setScholarships] = useState([]);
  const [savedCount, setSavedCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      setLoading(true);
      setError('');

      try {
        // Fetch each resource independently so one failed request
        // does not prevent the other dashboard sections from loading.
        const results = await Promise.allSettled([
          api.get('/scholarships/eligible'),
          api.get('/profile'),
          api.get('/saved'),
          api.get('/applications')
        ]);

        if (!isMounted) return;

        const [
          eligibleResult,
          profileResult,
          savedResult,
          applicationsResult
        ] = results;

        if (eligibleResult.status === 'fulfilled') {
          setScholarships(
            eligibleResult.value.data.scholarships || []
          );
        } else {
          console.error(
            'Failed to load scholarships:',
            eligibleResult.reason
          );
          setScholarships([]);
          setError(
            'Could not load scholarships. Please try again.'
          );
        }

        if (profileResult.status === 'fulfilled') {
          setProfileData(profileResult.value.data);
        } else {
          console.error(
            'Failed to load profile:',
            profileResult.reason
          );
        }

        if (savedResult.status === 'fulfilled') {
          setSavedCount(
            savedResult.value.data.saved?.length || 0
          );
        } else {
          console.error(
            'Failed to load saved scholarships:',
            savedResult.reason
          );
        }

        if (applicationsResult.status === 'fulfilled') {
          setApplicationsCount(
            applicationsResult.value.data.applications?.length || 0
          );
        } else {
          console.error(
            'Failed to load applications:',
            applicationsResult.reason
          );
        }
      } catch (err) {
        if (!isMounted) return;

        console.error('Failed to load dashboard data:', err);
        setError('Unable to load dashboard data.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Get gender from the saved profile first, then the auth user.
  const studentGender = normalizeGender(
    profileData?.gender ??
    profileData?.profile?.gender ??
    user?.profile?.gender ??
    user?.gender
  );

  // Keep backend eligibility and apply gender eligibility together.
  const eligibleList = scholarships.filter((scholarship) => {
    const backendEligible = scholarship.match?.eligible === true;

    if (!backendEligible) {
      return false;
    }

    return isGenderEligible(studentGender, scholarship);
  });

  // Count deadlines occurring today or within the next 60 days.
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcomingDeadlines = eligibleList.filter((scholarship) => {
    if (!scholarship.deadline) return false;

    const deadline = new Date(scholarship.deadline);

    if (Number.isNaN(deadline.getTime())) {
      return false;
    }

    deadline.setHours(0, 0, 0, 0);

    const days = Math.ceil(
      (deadline.getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return days >= 0 && days <= 60;
  });

  const completionRate = Math.min(
    100,
    Math.max(
      0,
      Number(profileData?.completionRate) || 0
    )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
          role="status"
          aria-label="Loading dashboard"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-950/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
            <Sparkles size={14} />
            Personal Eligibility Engine
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Student'}!
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            Based on your profile (
            {profileData?.category ||
              profileData?.profile?.category ||
              user?.profile?.category ||
              'General'}
            ,{' '}
            {profileData?.state ||
              profileData?.profile?.state ||
              user?.profile?.state ||
              'Maharashtra'}
            ,{' '}
            {profileData?.course ||
              profileData?.profile?.course ||
              user?.profile?.course ||
              'Student'}
            ), here are your matching scholarship schemes.
          </p>

          {!studentGender && (
            <p className="text-amber-200 text-xs">
              Your gender is not available in your profile.
              Only scholarships open to all genders will be shown.
              Update your profile to see gender-specific schemes.
            </p>
          )}
        </div>

        {/* Profile Completion */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 min-w-[240px]">
          <div className="flex justify-between items-center text-xs font-semibold mb-2">
            <span>Profile Completion</span>
            <span className="text-blue-300 font-bold">
              {completionRate}%
            </span>
          </div>

          <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                completionRate >= 80
                  ? 'bg-emerald-400'
                  : 'bg-amber-400'
              }`}
              style={{ width: `${completionRate}%` }}
            />
          </div>

          {completionRate < 100 ? (
            <Link
              to="/profile"
              className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg block text-center transition"
            >
              Complete Profile (+Accuracy)
            </Link>
          ) : (
            <span className="text-xs text-emerald-300 flex items-center gap-1 justify-center">
              <CheckCircle2 size={13} />
              Complete &amp; Verified
            </span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Eligible Schemes
          </span>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-600">
              {eligibleList.length}
            </span>
            <span className="text-xs text-slate-400">
              / {scholarships.length} total
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Saved Opportunities
          </span>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-600">
              {savedCount}
            </span>
            <Link
              to="/saved"
              className="text-xs text-indigo-500 hover:underline"
            >
              View saved
            </Link>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Applications Tracked
          </span>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">
              {applicationsCount}
            </span>
            <Link
              to="/applications"
              className="text-xs text-emerald-500 hover:underline"
            >
              Pipeline
            </Link>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Upcoming Deadlines
          </span>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">
              {upcomingDeadlines.length}
            </span>
            <span className="text-xs text-slate-400">
              in next 60 days
            </span>
          </div>
        </div>
      </div>

      {/* Eligible Scholarships */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Scholarships You Appear Eligible For
            </h2>

            <p className="text-xs text-slate-500 mt-0.5">
              Matched against your profile, including gender
              restrictions. Verify eligibility and current dates
              on the official portal.
            </p>
          </div>

          <Link
            to="/scholarships"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0"
          >
            Browse all
            <ChevronRight size={14} />
          </Link>
        </div>

        {eligibleList.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>

            <h3 className="font-bold text-slate-800 text-base">
              No Matching Scholarships Found
            </h3>

            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {studentGender
                ? 'No scholarships currently match your saved eligibility results and gender. Check your profile or browse all schemes.'
                : 'Add your gender to your profile to find gender-specific schemes. You can also browse scholarships open to all genders.'}
            </p>

            <div className="flex justify-center gap-3 flex-wrap">
              <Link
                to="/profile"
                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
              >
                Update Profile
              </Link>

              <Link
                to="/scholarships"
                className="inline-block px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Browse Scholarships
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eligibleList.map((s) => (
              <div
                key={s.id || s._id}
                className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-emerald-300 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Appears Eligible
                    </span>

                    {s.amount != null && (
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-0.5">
                        <IndianRupee size={12} />
                        Up to ₹
                        {Number(s.amount).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-snug">
                      {s.name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      {s.provider || 'Scholarship provider not specified'}
                    </p>
                  </div>

                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700 block mb-0.5">
                      Key Benefit:
                    </span>
                    <p className="line-clamp-2">
                      {s.benefits || 'Check the official scheme details.'}
                    </p>
                  </div>

                  {/* Gender eligibility label */}
                  <div className="text-[11px] text-slate-600 bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                    <span className="font-semibold text-blue-900">
                      Gender eligibility:{' '}
                    </span>
                    {normalizeGenderEligibility(
                      s.genderEligibility ??
                      s.eligibleGender ??
                      s.gender ??
                      'all'
                    ) === 'all'
                      ? 'All genders'
                      : normalizeGenderEligibility(
                          s.genderEligibility ??
                          s.eligibleGender ??
                          s.gender
                        ) === 'male'
                        ? 'Male students'
                        : normalizeGenderEligibility(
                            s.genderEligibility ??
                            s.eligibleGender ??
                            s.gender
                          ) === 'female'
                          ? 'Female students'
                          : 'Check official eligibility'}
                  </div>

                  {/* Why it matches */}
                  {s.match?.matchReasons?.length > 0 && (
                    <div className="text-[11px] text-emerald-800 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100 space-y-1">
                      <span className="font-bold block text-emerald-950">
                        Why you match:
                      </span>

                      {s.match.matchReasons
                        .slice(0, 3)
                        .map((reason, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-1"
                          >
                            <CheckCircle2
                              size={11}
                              className="text-emerald-600 mt-0.5 shrink-0"
                            />
                            <span className="line-clamp-1">
                              {reason}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Deadline and Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-[11px] text-slate-400">
                    Deadline:{' '}
                    {s.deadline &&
                    !Number.isNaN(new Date(s.deadline).getTime())
                      ? new Date(s.deadline).toLocaleDateString(
                          'en-IN',
                          {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }
                        )
                      : 'Ongoing'}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/scholarships/${s.id || s._id}`}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    >
                      View Details
                    </Link>

                    {s.applicationUrl && (
                      <a
                        href={s.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 transition"
                      >
                        Apply
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
