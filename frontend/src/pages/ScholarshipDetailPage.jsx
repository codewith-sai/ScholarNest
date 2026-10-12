import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Bookmark,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  FileText,
  Building,
  ShieldCheck,
  ChevronLeft,
  Calendar,
  CheckSquare,
  Square
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ScholarshipDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState({});

  const loadDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/scholarships/${id}`);
      setScholarship(res.data);

      if (user) {
        const savedRes = await api.get('/saved');
        const savedList = savedRes.data?.saved || [];
        const exists = savedList.some(item =>
          item.scholarshipId === Number(id) ||
          item.scholarship?.id === Number(id)
        );
        setIsSaved(exists);
      }
    } catch (err) {
      console.error('Error loading scholarship detail', err);
      toast.error('Unable to load scholarship details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

  const handleToggleSave = async () => {
    if (!user) {
      toast.info('Please log in to save scholarships.');
      return;
    }
    try {
      if (isSaved) {
        await api.delete(`/scholarships/${id}/save`);
        setIsSaved(false);
        toast.info('Removed from saved scholarships.');
      } else {
        await api.post(`/scholarships/${id}/save`);
        setIsSaved(true);
        toast.success('Scholarship saved to your list!');
      }
    } catch (err) {
      console.error('Failed to toggle saved scholarship', err);
      toast.error('Failed to update saved status.');
    }
  };

  const toggleDoc = (docName) => {
    setCheckedDocs(prev => ({ ...prev, [docName]: !prev[docName] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Scholarship Not Found</h2>
        <Link to="/scholarships" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold">
          Back to Scholarships
        </Link>
      </div>
    );
  }

  const match = scholarship.match;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 font-sans">
      {/* Back Link */}
      <Link
        to="/scholarships"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <ChevronLeft size={16} /> Back to All Scholarships
      </Link>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {scholarship.schemeLevel === 'STATE' ? 'Maharashtra State Scheme (MahaDBT)' : 'Central Scheme (NSP)'}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {scholarship.scholarshipType}
            </span>
            {scholarship.verificationStatus === 'VERIFIED' && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck size={13} /> Verified by ScholarNest
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleToggleSave}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition ${isSaved ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
          >
            <Bookmark size={14} className={isSaved ? 'fill-indigo-600 text-indigo-600' : ''} />
            <span>{isSaved ? 'Saved in My List' : 'Save Scholarship'}</span>
          </button>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            {scholarship.name}
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-2">
            <Building size={16} className="text-slate-400 shrink-0" />
            <span>{scholarship.governmentDepartment || scholarship.provider}</span>
          </p>
        </div>

        {/* Quick Summary Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block mb-1">Financial Benefit</span>
            <span className="font-bold text-slate-900 text-sm flex items-center gap-0.5">
              <IndianRupee size={14} className="text-emerald-600" />
              {scholarship.amount ? `Up to ₹${scholarship.amount.toLocaleString('en-IN')}/year` : 'Full Fee Reimbursement'}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block mb-1">Application Deadline</span>
            <span className="font-bold text-slate-900 text-sm flex items-center gap-1">
              <Calendar size={14} className="text-blue-600" />
              {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Ongoing / Notice awaited'}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block mb-1">Source Authority</span>
            <span className="font-bold text-slate-900 text-sm truncate block">
              {scholarship.sourceAuthority || 'Govt of Maharashtra'}
            </span>
          </div>
        </div>

        {/* Official Application CTA Header */}
        <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-blue-900 block">External Official Portal Submission</span>
            <p className="text-xs text-blue-700">
              Applications must be completed on the official government website. ScholarNest does not submit applications.
            </p>
          </div>
          {scholarship.applicationUrl && (
            <a
              href={scholarship.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 shrink-0 transition"
            >
              <span>Apply on Official Portal</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Personalized Match Evaluation Banner (If evaluated) */}
      {match && (
        <div className={`p-6 rounded-3xl border shadow-xs space-y-4 ${match.eligible ? 'bg-emerald-50/80 border-emerald-200' : 'bg-amber-50/80 border-amber-200'}`}>
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center ${match.eligible ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}`}>
              {match.eligible ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            </span>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {match.eligible ? 'You appear to meet the listed eligibility criteria' : 'You do not currently meet all criteria'}
              </h3>
              <p className="text-xs text-slate-500">{match.disclaimer}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
            {match.matchReasons.length > 0 && (
              <div className="bg-white/80 p-3.5 rounded-xl border border-emerald-100">
                <span className="font-bold text-emerald-900 block mb-2">Requirements Satisfied:</span>
                <ul className="space-y-1.5 text-emerald-800">
                  {match.matchReasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {match.unmetCriteria.length > 0 && (
              <div className="bg-white/80 p-3.5 rounded-xl border border-amber-100">
                <span className="font-bold text-amber-900 block mb-2">Unmet / Pending Criteria:</span>
                <ul className="space-y-1.5 text-amber-800">
                  {match.unmetCriteria.map((err, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <AlertCircle size={13} className="text-amber-600 shrink-0 mt-0.5" />
                      <span>{err}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Two-Column Grid: Details & Criteria */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-slate-900">About the Scholarship</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {scholarship.description}
            </p>
          </section>

          {/* Detailed Financial Benefits Breakdown */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <IndianRupee size={20} className="text-emerald-600" />
              <span>Financial Benefits Breakdown</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="font-bold text-slate-800 block mb-1">Tuition Fee Support</span>
                <p className="text-slate-600">{scholarship.tuitionFee || scholarship.benefits}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="font-bold text-slate-800 block mb-1">Maintenance Allowance</span>
                <p className="text-slate-600">{scholarship.maintenanceAllowance || 'As per government course tier'}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 sm:col-span-2">
                <span className="font-bold text-slate-800 block mb-1">Hostel & Living Support</span>
                <p className="text-slate-600">{scholarship.hostelAllowance || 'Covered under respective welfare directives'}</p>
              </div>
            </div>
          </section>

          {/* How to Apply: Step-by-Step Guidance */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900">How to Apply (Step-by-Step)</h2>
            <div className="space-y-3 text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-2xl border border-slate-100">
              {scholarship.applicationInstructions || (
                `1. Visit the official government portal (MahaDBT 2.0 or NSP).\n2. Register and authenticate using your Aadhaar card.\n3. Complete the multi-step student profile.\n4. Select the specific scheme from the relevant department.\n5. Upload scanned copies of the mandatory documents.\n6. Submit application and retain the acknowledgment printout.`
              )}
            </div>
          </section>
        </div>

        {/* Sidebar: Documents Checklist & Verification Metadata */}
        <div className="space-y-8">
          {/* Required Documents Checklist */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileText size={18} className="text-blue-600" />
                <span>Document Checklist</span>
              </h3>
              <span className="text-[11px] text-slate-400">Interactive</span>
            </div>
            <p className="text-xs text-slate-500">
              Check off documents you have ready before beginning your official application:
            </p>

            <div className="space-y-2 pt-2">
              {scholarship.documents?.map((doc, i) => {
                const name = doc.documentName || doc;
                const isChecked = !!checkedDocs[name];
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDoc(name)}
                    className={`w-full text-left p-3 rounded-xl border text-xs flex items-center gap-2.5 transition ${isChecked ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'}`}
                  >
                    {isChecked ? (
                      <CheckSquare size={16} className="text-emerald-600 shrink-0" />
                    ) : (
                      <Square size={16} className="text-slate-400 shrink-0" />
                    )}
                    <span className={isChecked ? 'line-through text-slate-500' : 'font-medium'}>
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verification & Trust Metadata */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-3 text-xs text-slate-600">
            <span className="font-bold text-slate-900 block text-sm">Official Source Reference</span>
            <div>
              <span className="text-slate-400 block text-[11px]">Provider Department</span>
              <span className="font-semibold text-slate-800">{scholarship.governmentDepartment || scholarship.provider}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Last Verified by ScholarNest</span>
              <span className="font-semibold text-slate-800">
                {scholarship.lastVerifiedDate ? new Date(scholarship.lastVerifiedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently Verified'}
              </span>
            </div>
            {scholarship.officialInfoUrl && (
              <div className="pt-2">
                <a
                  href={scholarship.officialInfoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Official Government Resolution (GR) / Notice</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

