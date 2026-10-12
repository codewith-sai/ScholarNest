import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  TrendingUp,
  FileText
} from 'lucide-react';
import api from '../../services/api';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, schRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/scholarships')
      ]);
      setStats(statsRes.data);
      setScholarships(schRes.data.scholarships || []);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Administration</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">ScholarNest Overview</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage official government scheme metadata, deterministic rules, and student verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/scholarships/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus size={16} />
            <span>Add Scholarship</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Registered Students</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 block">{stats?.students || 0}</span>
          <Link to="/admin/students" className="text-xs text-blue-600 hover:underline mt-1 block">View accounts</Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Schemes</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 block">{stats?.scholarships || 0}</span>
          <Link to="/admin/scholarships" className="text-xs text-blue-600 hover:underline mt-1 block">Manage listings</Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Active Listings</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2 block">{stats?.active || 0}</span>
          <span className="text-[11px] text-slate-400">Currently visible</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Applications Tracked</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 mt-2 block">{stats?.applications || 0}</span>
          <span className="text-[11px] text-slate-400">By active students</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Upcoming Deadlines</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2 block">{stats?.upcoming || 0}</span>
          <span className="text-[11px] text-slate-400">Require review</span>
        </div>
      </div>

      {/* Recent Schemes Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base text-slate-900">Scholarship Catalog Review</h2>
            <p className="text-xs text-slate-500">Live listings, verification badges, and quick toggles.</p>
          </div>
          <Link to="/admin/scholarships" className="text-xs font-semibold text-blue-600 hover:underline">
            View All ({scholarships.length})
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-6">Scheme Name</th>
                <th className="py-3 px-6">Department</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Verification</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {scholarships.slice(0, 6).map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-6 font-semibold text-slate-900 max-w-xs truncate">
                    {s.name}
                  </td>
                  <td className="py-4 px-6 text-slate-500 max-w-xs truncate">
                    {s.governmentDepartment || s.provider}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${s.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                      {s.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px] border border-blue-200">
                      {s.verificationStatus || 'VERIFIED'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <Link
                      to={`/scholarships/${s.id}`}
                      className="px-2.5 py-1 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg font-medium"
                    >
                      Preview
                    </Link>
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/scholarships`)}
                      className="px-2.5 py-1 text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg font-semibold bg-blue-50/50"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

