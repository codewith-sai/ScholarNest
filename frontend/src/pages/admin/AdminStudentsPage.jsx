import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Power,
  ShieldCheck,
  User,
  GraduationCap,
} from 'lucide-react';
import api from '../../api/client';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    loadStudents();
  }, [search]);

  async function loadStudents() {
    try {
      setLoading(true);
      const res = await api.get(`/admin/students?search=${encodeURIComponent(search)}`);
      if (res.data?.success) {
        setStudents(res.data.students || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleStatus = async (st) => {
    try {
      await api.put(`/admin/students/${st._id}/status`);
      setActionMessage(`Updated account status for ${st.name}.`);
      setTimeout(() => setActionMessage(''), 3000);
      await loadStudents();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Registered Students Directory</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            View student profile parameters, completion scores, and account access status.
          </p>
        </div>
      </div>

      {actionMessage && (
        <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-lg border border-emerald-200">
          {actionMessage}
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student name or email..."
          className="w-full pl-9 pr-4 py-2 bg-white rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-purple-500 outline-hidden"
        />
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5">Student Information</th>
                  <th className="px-6 py-3.5">Category & Domicile</th>
                  <th className="px-6 py-3.5">Education / Course</th>
                  <th className="px-6 py-3.5">Annual Income</th>
                  <th className="px-6 py-3.5">Completion</th>
                  <th className="px-6 py-3.5 text-right">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((st) => (
                  <tr key={st._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 text-sm">{st.name}</div>
                      <div className="text-gray-400 text-xs">{st.email}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {st.profile?.casteCategory || 'Not specified'}
                      </span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {st.profile?.isMaharashtraDomicile ? 'Maharashtra Domicile' : 'Non-domicile'}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">{st.profile?.course || '—'}</div>
                      <div className="text-[11px] text-gray-400 truncate max-w-xs">{st.profile?.college || '—'}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-gray-900">
                        ₹{st.profile?.annualIncome?.toLocaleString('en-IN') || 0}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-700">
                          {st.profile?.completionPercentage || 0}%
                        </span>
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              (st.profile?.completionPercentage || 0) >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${st.profile?.completionPercentage || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(st)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition ${
                          st.enabled
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        <span>{st.enabled ? 'Active' : 'Disabled'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
