import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Search,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  FileText,
  IndianRupee,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import api from '../services/api';

const MAHARASHTRA_CATEGORIES = [
  'OPEN', 'OBC', 'SC', 'ST', 'EWS', 'VJNT', 'SBC', 'Minority'
];

const EDUCATION_LEVELS = [
  'Undergraduate', 'Postgraduate', 'Diploma', '12th', '10th', 'Professional Course'
];

export default function LandingPage() {

  // Quick Anonymous Eligibility Checker State
  const [formData, setFormData] = useState({
    state: 'Maharashtra',
    category: 'OBC',
    educationLevel: 'Undergraduate',
    course: 'Engineering',
    annualIncome: 250000,
    percentage: 75,
    gender: 'Female'
  });

  const [loading, setLoading] = useState(false);
  const [matchedResults, setMatchedResults] = useState(null);
  const [activeStep, setActiveStep] = useState(1);

  const handleEvaluate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/scholarships/evaluate-anonymous', formData);
      setMatchedResults(res.data);
      // scroll to results
      const resultsEl = document.getElementById('match-results-section');
      if (resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Anonymous evaluation error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Disclaimer Bar */}
      <div className="bg-amber-500 text-amber-950 px-4 py-2 text-xs md:text-sm font-medium flex items-center justify-center gap-2 text-center border-b border-amber-600/20">
        <AlertCircle size={16} className="shrink-0 text-amber-900" />
        <span>
          <strong>Informational Guidance Only:</strong> ScholarNest is an independent discovery platform. We do not process government applications. Verify all criteria on official government portals (MahaDBT / NSP).
        </span>
      </div>

      {/* Main Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <GraduationCap size={24} />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-slate-900">Scholar<span className="text-blue-600">Nest</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Maharashtra & Central</span>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/scholarships" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">
              Browse Scholarships
            </Link>
            <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition">
              Log in
            </Link>
            <Link to="/register" className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg shadow-sm shadow-blue-500/20 transition">
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 py-16 md:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles size={14} /> Find. Understand. Apply.
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Maharashtra & National Scholarships, <span className="text-blue-600">Simplified.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
              Discover MahaDBT 2.0 and Central Government schemes you actually qualify for. Check eligibility criteria deterministically, view exact benefits, and get official portal links.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#quick-checker"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition"
              >
                <span>Find My Scholarships</span>
                <ArrowRight size={18} />
              </a>
              <Link
                to="/scholarships"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base border border-slate-300 shadow-xs flex items-center justify-center gap-2 transition"
              >
                <Search size={18} />
                <span>Browse All 9 Schemes</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Interactive Eligibility Questionnaire (Anonymous) */}
      <section id="quick-checker" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-slate-900/10">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">No Registration Required</span>
              <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-white">Instant Eligibility Matcher</h2>
              <p className="text-slate-400 text-sm mt-2">
                Answer 3 quick questions to discover government schemes matched specifically to your background and income.
              </p>
            </div>

            {/* Stepper Tabs */}
            <div className="flex border-b border-slate-800 mb-8 pb-4 justify-around text-xs sm:text-sm font-medium">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className={`flex items-center gap-2 pb-2 border-b-2 transition ${activeStep === 1 ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'}`}
              >
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs">1</span>
                <span>Category & State</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className={`flex items-center gap-2 pb-2 border-b-2 transition ${activeStep === 2 ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'}`}
              >
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs">2</span>
                <span>Education & Course</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className={`flex items-center gap-2 pb-2 border-b-2 transition ${activeStep === 3 ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'}`}
              >
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs">3</span>
                <span>Income & Marks</span>
              </button>
            </div>

            <form onSubmit={handleEvaluate}>
              {/* Step 1 */}
              {activeStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      State Domicile
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value, domicileState: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-hidden focus:border-blue-500 text-sm"
                    >
                      <option value="Maharashtra">Maharashtra (MahaDBT 2.0 Eligible)</option>
                      <option value="Other">Other State (Central / NSP Schemes)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Social / Caste Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {MAHARASHTRA_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: cat })}
                          className={`px-3 py-2.5 rounded-xl text-xs font-semibold border text-center transition ${formData.category === cat ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Gender
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Female', 'Male', 'Other'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setFormData({ ...formData, gender: g })}
                          className={`px-3 py-2.5 rounded-xl text-xs font-semibold border text-center transition ${formData.gender === g ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-sm flex items-center gap-1 transition"
                    >
                      Next: Education <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {activeStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Current Education Level
                    </label>
                    <select
                      value={formData.educationLevel}
                      onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-hidden focus:border-blue-500 text-sm"
                    >
                      {EDUCATION_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Degree / Course Stream
                    </label>
                    <input
                      type="text"
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      placeholder="e.g. Engineering, B.Tech, Medical, Arts, Commerce, Pharmacy"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-hidden focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-sm transition"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveStep(3)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-sm flex items-center gap-1 transition"
                    >
                      Next: Financial & Marks <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {activeStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Annual Family Income
                      </label>
                      <span className="text-sm font-bold text-blue-400">
                        ₹{Number(formData.annualIncome).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="1200000"
                      step="25000"
                      value={formData.annualIncome}
                      onChange={(e) => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                      <span>₹50,000</span>
                      <span>₹2.5 Lakh (SC/ST limit)</span>
                      <span>₹8.0 Lakh (EBC/OBC limit)</span>
                      <span>₹12+ Lakh</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Previous Examination Percentage / Marks (%)
                    </label>
                    <input
                      type="number"
                      min="35"
                      max="100"
                      value={formData.percentage}
                      onChange={(e) => setFormData({ ...formData, percentage: Number(e.target.value) })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-hidden focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-sm transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition"
                    >
                      {loading ? (
                        <span>Evaluating...</span>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          <span>Check Matching Scholarships</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Matched Results Section (If checked) */}
      {matchedResults && (
        <section id="match-results-section" className="py-12 bg-blue-50/50 border-b border-blue-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-blue-200/60 mb-8 gap-4">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Evaluation Results</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  You appear eligible for {matchedResults.eligibleCount} of {matchedResults.total} scholarships
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  *Based on your provided demographic details ({formData.category}, {formData.state}, ₹{Number(formData.annualIncome).toLocaleString('en-IN')})
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
                >
                  Create Account to Save
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              {matchedResults.scholarships.map((s) => (
                <div
                  key={s.id}
                  className={`bg-white rounded-2xl p-6 border transition shadow-xs ${s.match?.eligible ? 'border-emerald-300 hover:border-emerald-400' : 'border-slate-200 opacity-80'}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${s.match?.eligible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                          {s.match?.eligible ? '✓ Appears Eligible' : '✕ Unmet Criteria'}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {s.schemeLevel === 'STATE' ? 'Maharashtra State (MahaDBT)' : 'Central (NSP)'}
                        </span>
                        {s.amount && (
                          <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-0.5">
                            <IndianRupee size={12} /> Up to ₹{s.amount.toLocaleString('en-IN')}/yr
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-bold text-slate-900">{s.name}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{s.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to={`/scholarships/${s.id}`}
                        className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 hover:bg-slate-50 text-slate-700 transition"
                      >
                        View Details
                      </Link>
                      {s.applicationUrl && (
                        <a
                          href={s.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 transition"
                        >
                          <span>Official Portal</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Why it matches breakdown */}
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {s.match?.matchReasons?.length > 0 && (
                      <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                        <span className="font-bold text-emerald-900 block mb-1">Why you match:</span>
                        <ul className="space-y-1 text-emerald-800">
                          {s.match.matchReasons.map((reason, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {s.match?.unmetCriteria?.length > 0 && (
                      <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-100">
                        <span className="font-bold text-amber-900 block mb-1">Unmet requirements:</span>
                        <ul className="space-y-1 text-amber-800">
                          {s.match.unmetCriteria.map((err, i) => (
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
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Feature Pillars */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">Why Students Trust ScholarNest</h2>
            <p className="mt-3 text-slate-600 text-sm">
              Built specifically to remove the confusion and opaque paperwork surrounding Maharashtra government schemes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Deterministic Matching</h3>
              <p className="text-sm text-slate-600">
                No black-box algorithms or AI hallucinations. Our engine computes exact mathematical limits against officially published government resolutions (GRs).
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <FileText size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Full Document Checklists</h3>
              <p className="text-sm text-slate-600">
                Never get rejected for a missing Tehsildar certificate or Caste Validity. Know exactly what stamps, affidavits, and letters are required before you apply.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Privacy & Zero Sensitive Storage</h3>
              <p className="text-sm text-slate-600">
                We never ask for your Aadhaar card number, bank account details, or upload documents to our servers. Your data stays strictly yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <GraduationCap size={20} className="text-blue-500" />
                <span>ScholarNest</span>
              </div>
              <p className="text-slate-400">
                Maharashtra Scholarship Discovery, Eligibility & Application Guidance Platform.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Official Portals</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://mahadbt.maharashtra.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
                    <span>MahaDBT 2.0 Portal</span> <ExternalLink size={10} />
                  </a>
                </li>
                <li>
                  <a href="https://scholarships.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
                    <span>National Scholarship Portal (NSP)</span> <ExternalLink size={10} />
                  </a>
                </li>
                <li>
                  <a href="https://www.aicte-india.org/" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
                    <span>AICTE Official Portal</span> <ExternalLink size={10} />
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Quick Navigation</h4>
              <ul className="space-y-2">
                <li><Link to="/scholarships" className="hover:text-white">Browse All Scholarships</Link></li>
                <li><Link to="/login" className="hover:text-white">Student Login</Link></li>
                <li><Link to="/register" className="hover:text-white">Create Free Account</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Official Disclaimer</h4>
              <p className="text-slate-400 leading-relaxed">
                ScholarNest is not affiliated with the Government of Maharashtra, MahaDBT, or the Ministry of Education. We provide educational discovery guidance only.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-slate-500">
            © {new Date().getFullYear()} ScholarNest. Designed for students in Maharashtra & India.
          </div>
        </div>
      </footer>
    </div>
  );
}

