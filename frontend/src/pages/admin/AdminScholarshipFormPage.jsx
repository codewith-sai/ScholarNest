import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
} from 'lucide-react';
import api from '../../services/api';

export default function AdminScholarshipFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    provider: 'Directorate of Higher Education (DHE)',
    department: 'Higher and Technical Education Department',
    scholarshipType: 'Category Specific',
    sourceType: 'MahaDBT',
    sourceName: 'MahaDBT Official Portal',
    sourceUrl: 'https://mahadbt.maharashtra.gov.in/',
    officialApplicationUrl: 'https://mahadbt.maharashtra.gov.in/',
    openingDate: new Date().toISOString().split('T')[0],
    deadline: '2026-11-30',
    description: '',
    active: true,
    isDemo: false,
    benefits: {
      tuitionFee: '100% Tuition Fee waiver as per government norms',
      maintenanceAllowance: '₹1,500/month for day scholars, ₹2,500/month for hostellers',
      examinationFee: '100% Exam Fee waiver',
      hostelAllowance: 'Included as per government rules',
      otherBenefits: 'Book bank and thesis allowance',
      amount: 50000,
    },
    eligibilityCriteria: [
      {
        field: 'casteCategory',
        operator: 'IN',
        values: ['OBC'],
        required: true,
        label: 'Category must be OBC',
      },
      {
        field: 'annualIncome',
        operator: 'LTE',
        maxValue: 800000,
        required: true,
        label: 'Annual family income <= ₹8,00,000',
      },
      {
        field: 'isMaharashtraDomicile',
        operator: 'BOOLEAN',
        booleanValue: true,
        required: true,
        label: 'Maharashtra Domicile Certificate required',
      },
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Caste Certificate & Validity Certificate',
      'Income Certificate (Issued by Tahsildar)',
      'Maharashtra Domicile Certificate',
      'Previous Marksheet',
      'College Fee Receipt',
    ],
    applicationGuidance: [
      {
        stepNumber: 1,
        title: 'Register or Login on MahaDBT Portal',
        description: 'Visit mahadbt.maharashtra.gov.in and log in with your credentials.',
      },
      {
        stepNumber: 2,
        title: 'Fill Profile & Select Scheme',
        description: 'Complete personal, caste, and income details, then select this scheme.',
      },
      {
        stepNumber: 3,
        title: 'Upload Documents & Submit',
        description: 'Upload original scanned documents, submit application, and download receipt.',
      },
    ],
  });

  useEffect(() => {
    if (isEditing) {
      async function loadExisting() {
        try {
          const res = await api.get(`/scholarships/${id}`);
          if (res.data?.success || res.data?.scholarship || res.data?.id) {
            const s = res.data.scholarship || res.data;

            // Normalize eligibilityCriteria
            const rawCriteria = s.eligibilityCriteria || s.eligibility || [];
            const normalizedCriteria = Array.isArray(rawCriteria)
              ? rawCriteria.map((r) => {
                  let vals = r.values;
                  if (typeof vals === 'string') {
                    try {
                      vals = JSON.parse(vals);
                    } catch (e) {
                      vals = vals.split(',').map((v) => v.trim()).filter(Boolean);
                    }
                  }
                  return {
                    field: r.field || 'casteCategory',
                    operator: r.operator || 'IN',
                    values: Array.isArray(vals) ? vals : (vals ? [vals] : []),
                    minValue: r.minValue ?? '',
                    maxValue: r.maxValue ?? '',
                    required: r.required !== undefined ? r.required : true,
                    label: r.label || '',
                  };
                })
              : [];

            // Normalize requiredDocuments
            const rawDocs = s.requiredDocuments || s.documents || [];
            const normalizedDocs = Array.isArray(rawDocs)
              ? rawDocs
                  .map((d) => (typeof d === 'string' ? d : (d.documentName || d.name || '')))
                  .filter(Boolean)
              : [];

            // Normalize benefits object
            let benefitsObj = {
              tuitionFee: '',
              maintenanceAllowance: '',
              examinationFee: '',
              hostelAllowance: '',
              otherBenefits: '',
              amount: 0,
            };

            if (s.benefits && typeof s.benefits === 'object') {
              benefitsObj = {
                tuitionFee: s.benefits.tuitionFee || s.tuitionFee || '',
                maintenanceAllowance: s.benefits.maintenanceAllowance || s.maintenanceAllowance || '',
                examinationFee: s.benefits.examinationFee || '',
                hostelAllowance: s.benefits.hostelAllowance || s.hostelAllowance || '',
                otherBenefits: s.benefits.otherBenefits || '',
                amount: s.benefits.amount !== undefined ? s.benefits.amount : (s.amount || 0),
              };
            } else {
              benefitsObj = {
                tuitionFee: s.tuitionFee || '',
                maintenanceAllowance: s.maintenanceAllowance || '',
                examinationFee: '',
                hostelAllowance: s.hostelAllowance || '',
                otherBenefits: typeof s.benefits === 'string' ? s.benefits : '',
                amount: s.amount || 0,
              };
            }

            // Normalize application guidance
            let guidance = [];
            if (Array.isArray(s.applicationGuidance) && s.applicationGuidance.length > 0) {
              guidance = s.applicationGuidance;
            } else if (s.applicationInstructions) {
              guidance = s.applicationInstructions
                .split('\n')
                .filter(Boolean)
                .map((line, idx) => ({
                  stepNumber: idx + 1,
                  title: `Step ${idx + 1}`,
                  description: line.replace(/^\d+[.)]\s*/, ''),
                }));
            }

            setFormData((prev) => ({
              ...prev,
              ...s,
              name: s.name || prev.name,
              provider: s.provider || prev.provider,
              department: s.governmentDepartment || s.department || prev.department,
              officialApplicationUrl: s.applicationUrl || s.officialApplicationUrl || prev.officialApplicationUrl,
              openingDate: s.openingDate ? s.openingDate.split('T')[0] : '',
              deadline: s.deadline ? s.deadline.split('T')[0] : '',
              benefits: benefitsObj,
              eligibilityCriteria: normalizedCriteria.length > 0 ? normalizedCriteria : prev.eligibilityCriteria,
              requiredDocuments: normalizedDocs.length > 0 ? normalizedDocs : prev.requiredDocuments,
              applicationGuidance: guidance.length > 0 ? guidance : prev.applicationGuidance,
            }));
          }
        } catch (e) {
          console.error('Failed to fetch existing scholarship:', e);
          setError('Failed to fetch existing scholarship.');
        } finally {
          setLoading(false);
        }
      }
      loadExisting();
    }
  }, [id, isEditing]);

  const handleBasicChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBenefitChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      benefits: {
        ...(typeof prev.benefits === 'object' && prev.benefits !== null ? prev.benefits : {}),
        [name]: name === 'amount' ? Number(value) : value,
      },
    }));
  };

  // Eligibility Rule Helpers
  const addRule = () => {
    setFormData((prev) => ({
      ...prev,
      eligibilityCriteria: [
        ...(prev.eligibilityCriteria || []),
        {
          field: 'course',
          operator: 'IN',
          values: ['Engineering'],
          required: true,
          label: 'Course requirement',
        },
      ],
    }));
  };

  const removeRule = (idx) => {
    setFormData((prev) => ({
      ...prev,
      eligibilityCriteria: (prev.eligibilityCriteria || []).filter((_, i) => i !== idx),
    }));
  };

  const updateRule = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.eligibilityCriteria || [])];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, eligibilityCriteria: updated };
    });
  };

  // Document Helpers
  const addDocument = () => {
    setFormData((prev) => ({
      ...prev,
      requiredDocuments: [...(prev.requiredDocuments || []), 'New Required Document'],
    }));
  };

  const updateDocument = (idx, value) => {
    setFormData((prev) => {
      const updated = [...(prev.requiredDocuments || [])];
      updated[idx] = value;
      return { ...prev, requiredDocuments: updated };
    });
  };

  const removeDocument = (idx) => {
    setFormData((prev) => ({
      ...prev,
      requiredDocuments: (prev.requiredDocuments || []).filter((_, i) => i !== idx),
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        department: formData.department || formData.governmentDepartment,
        governmentDepartment: formData.department || formData.governmentDepartment,
        officialApplicationUrl: formData.officialApplicationUrl || formData.applicationUrl,
        applicationUrl: formData.officialApplicationUrl || formData.applicationUrl,
        eligibility: formData.eligibilityCriteria || formData.eligibility || [],
        eligibilityCriteria: formData.eligibilityCriteria || formData.eligibility || [],
        documents: formData.requiredDocuments || formData.documents || [],
        requiredDocuments: formData.requiredDocuments || formData.documents || [],
      };

      if (isEditing) {
        await api.put(`/admin/scholarships/${id}`, payload);
        setSuccess('Scholarship updated successfully!');
      } else {
        await api.post('/admin/scholarships', payload);
        setSuccess('Scholarship created successfully!');
      }
      setTimeout(() => navigate('/admin/scholarships'), 1000);
    } catch (err) {
      console.error('Save scholarship error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to save scholarship.';
      setError(msg);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/scholarships"
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Scholarship Scheme' : 'Create New Scholarship Scheme'}
            </h2>
            <p className="text-xs text-gray-500">Configure parameters for automated eligibility checking</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-xs border border-emerald-200">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 text-xs">
        {/* Basic Scheme Information */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">
            1. Basic Information & Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Scholarship Name</label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleBasicChange}
                placeholder="e.g. Post-Matric Scholarship for OBC Students"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-purple-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Provider Agency</label>
              <input
                type="text"
                required
                name="provider"
                value={formData.provider}
                onChange={handleBasicChange}
                placeholder="e.g. Directorate of Higher Education"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Department</label>
              <input
                type="text"
                required
                name="department"
                value={formData.department}
                onChange={handleBasicChange}
                placeholder="e.g. Higher and Technical Education Department"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Scheme Category</label>
              <select
                name="scholarshipType"
                value={formData.scholarshipType}
                onChange={handleBasicChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-hidden"
              >
                <option value="Category Specific">Category Specific (OBC, SC, ST, VJNT)</option>
                <option value="Need-based">Need-based (EBC / Income Limit)</option>
                <option value="Merit">Merit / Academic Excellence</option>
                <option value="Minority Welfare">Minority Welfare</option>
                <option value="Disability Support">Disability Support (PwD)</option>
                <option value="Course Specific">Course Specific (STEM, Law, MBA)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Source Type</label>
              <select
                name="sourceType"
                value={formData.sourceType}
                onChange={handleBasicChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-hidden"
              >
                <option value="MahaDBT">MahaDBT 2.0</option>
                <option value="State Government">State Government</option>
                <option value="Central Government">Central Government</option>
                <option value="Private / Corporate">Private / Corporate</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Official Application URL</label>
              <input
                type="url"
                required
                name="officialApplicationUrl"
                value={formData.officialApplicationUrl}
                onChange={handleBasicChange}
                placeholder="https://mahadbt.maharashtra.gov.in/"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 font-mono focus:ring-2 focus:ring-purple-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Application Deadline</label>
              <input
                type="date"
                required
                name="deadline"
                value={formData.deadline}
                onChange={handleBasicChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-hidden"
              />
            </div>

            <div className="flex items-center gap-6 pt-5">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-800">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleBasicChange}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span>Active & Published</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-amber-800">
                <input
                  type="checkbox"
                  name="isDemo"
                  checked={formData.isDemo}
                  onChange={handleBasicChange}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Label as Sample / Demo</span>
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Description / Summary</label>
              <textarea
                rows={3}
                required
                name="description"
                value={formData.description}
                onChange={handleBasicChange}
                placeholder="Explain the scholarship purpose, funding source, and objectives in simple language..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-hidden text-xs"
              />
            </div>
          </div>
        </div>

        {/* Benefits Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">
            2. Financial Benefits Breakdown
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Tuition Fee Reimbursement</label>
              <input
                type="text"
                name="tuitionFee"
                value={formData.benefits?.tuitionFee ?? ''}
                onChange={handleBenefitChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Maintenance Allowance</label>
              <input
                type="text"
                name="maintenanceAllowance"
                value={formData.benefits?.maintenanceAllowance ?? ''}
                onChange={handleBenefitChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Examination Fee</label>
              <input
                type="text"
                name="examinationFee"
                value={formData.benefits?.examinationFee ?? ''}
                onChange={handleBenefitChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Hostel Allowance</label>
              <input
                type="text"
                name="hostelAllowance"
                value={formData.benefits?.hostelAllowance ?? ''}
                onChange={handleBenefitChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Estimated Annual Value (₹)</label>
              <input
                type="number"
                name="amount"
                value={formData.benefits?.amount ?? ''}
                onChange={handleBenefitChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-hidden font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Other Miscellaneous Benefits</label>
              <input
                type="text"
                name="otherBenefits"
                value={formData.benefits?.otherBenefits ?? ''}
                onChange={handleBenefitChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Configurable Eligibility Rules */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">3. Configurable Eligibility Rules</h3>
              <p className="text-[11px] text-gray-500">Evaluated deterministically by the eligibility service</p>
            </div>
            <button
              type="button"
              onClick={addRule}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Rule</span>
            </button>
          </div>

          <div className="space-y-3">
            {(formData.eligibilityCriteria || []).map((rule, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                <div>
                  <label className="text-[10px] font-semibold text-gray-500 block mb-0.5">Field</label>
                  <select
                    value={rule.field}
                    onChange={(e) => updateRule(idx, 'field', e.target.value)}
                    className="w-full p-1.5 rounded border border-gray-300 bg-white"
                  >
                    <option value="casteCategory">Caste Category</option>
                    <option value="annualIncome">Annual Income</option>
                    <option value="isMaharashtraDomicile">Maharashtra Domicile</option>
                    <option value="course">Course</option>
                    <option value="educationLevel">Education Level</option>
                    <option value="percentage">Percentage (%)</option>
                    <option value="cgpa">CGPA</option>
                    <option value="gender">Gender</option>
                    <option value="isMinority">Minority Status</option>
                    <option value="isDisability">Disability Status</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-gray-500 block mb-0.5">Values / Value</label>
                  {rule.field === 'annualIncome' ? (
                    <input
                      type="number"
                      placeholder="Max Income (₹)"
                      value={rule.maxValue ?? ''}
                      onChange={(e) => updateRule(idx, 'maxValue', Number(e.target.value))}
                      className="w-full p-1.5 rounded border border-gray-300 bg-white"
                    />
                  ) : rule.field === 'percentage' || rule.field === 'cgpa' ? (
                    <input
                      type="number"
                      placeholder="Min Mark"
                      value={rule.minValue ?? ''}
                      onChange={(e) => updateRule(idx, 'minValue', Number(e.target.value))}
                      className="w-full p-1.5 rounded border border-gray-300 bg-white"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder="Comma separated values"
                      value={Array.isArray(rule.values) ? rule.values.join(', ') : (rule.values ? String(rule.values) : '')}
                      onChange={(e) =>
                        updateRule(
                          idx,
                          'values',
                          e.target.value.split(',').map((v) => v.trim())
                        )
                      }
                      className="w-full p-1.5 rounded border border-gray-300 bg-white"
                    />
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-gray-500 block mb-0.5">User-Friendly Label</label>
                  <input
                    type="text"
                    value={rule.label || ''}
                    onChange={(e) => updateRule(idx, 'label', e.target.value)}
                    placeholder="e.g. Must be OBC category"
                    className="w-full p-1.5 rounded border border-gray-300 bg-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 sm:pt-0">
                  <label className="flex items-center gap-1 text-[11px] text-gray-600">
                    <input
                      type="checkbox"
                      checked={rule.required ?? true}
                      onChange={(e) => updateRule(idx, 'required', e.target.checked)}
                      className="rounded text-purple-600"
                    />
                    <span>Required</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeRule(idx)}
                    className="p-1.5 text-rose-500 hover:text-rose-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Required Documents */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="font-bold text-gray-900 text-sm">4. Required Documents Checklist</h3>
            <button
              type="button"
              onClick={addDocument}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Document</span>
            </button>
          </div>

          <div className="space-y-2">
            {(formData.requiredDocuments || []).map((doc, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={typeof doc === 'string' ? doc : (doc?.documentName || doc?.name || '')}
                  onChange={(e) => updateDocument(idx, e.target.value)}
                  className="flex-1 p-2 rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeDocument(idx)}
                  className="p-2 text-rose-500 hover:text-rose-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <Link
            to="/admin/scholarships"
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/20 transition disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving...' : isEditing ? 'Update Scholarship' : 'Create Scholarship'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
