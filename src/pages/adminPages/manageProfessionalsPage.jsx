import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProfessional } from '../../thunks/createProfessionalThunk';
import { resetProfessionalState } from '../../feature/createProfessionalSlice';
import { listProfessionals } from '../../thunks/listProfessionalsThunk';

const roleColors = {
  Vet: 'bg-blue-100 text-blue-700',
  Groomer: 'bg-purple-100 text-purple-700',
};

const statusColors = {
  Available: 'bg-green-100 text-green-700',
  available: 'bg-green-100 text-green-700',
  Unavailable: 'bg-red-100 text-red-700',
  unavailable: 'bg-red-100 text-red-700',
};

const roleOptions = [
  { label: 'Veterinarian', roleId: 3 },
  { label: 'Groomer', roleId: 4 },
];

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  roleId: 3,
  speciality: '',
  expertise: '',
  status: 'available',
};

// Normalize API response row into flat table shape
function normalizeProfessional(p) {
  const isVet = p.roleId === 3;
  // vets and groomers are arrays — grab first element
  const profile = isVet
    ? (Array.isArray(p.vets) ? p.vets[0] : null)
    : (Array.isArray(p.groomers) ? p.groomers[0] : null);

  const roleName = p.roles?.name || (isVet ? 'Vet' : 'Groomer');

  return {
    id: p.id,
    name: p.name || '—',
    email: p.email || '—',
    phone: p.phone || '—',
    role: roleName,
    roleId: p.roleId,
    speciality: profile?.specialization || '—',
    expertise: profile?.experienceYears ?? '—',
    status: profile?.status || '—',
  };
}

function ProfessionalModal({ professional, onClose, onSave, isAdd, loading, error }) {
  const [form, setForm] = useState(
    isAdd
      ? emptyForm
      : {
          name: professional.name !== '—' ? professional.name : '',
          email: professional.email !== '—' ? professional.email : '',
          phone: professional.phone !== '—' ? professional.phone : '',
          password: '',
          roleId: professional.roleId,
          speciality: professional.speciality !== '—' ? professional.speciality : '',
          expertise: professional.expertise !== '—' ? professional.expertise : '',
          status: professional.status !== '—' ? professional.status : 'available',
        }
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isAdd
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              }
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{isAdd ? 'Add Professional' : 'Edit Professional'}</h3>
            {!isAdd && <p className="text-sm text-gray-500">{professional.name}</p>}
          </div>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-4 mb-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm"
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm"
              placeholder="Phone number"
            />
          </div>
          {isAdd && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm"
                placeholder="Set a password"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
            <select
              value={form.roleId}
              onChange={e => setForm({ ...form, roleId: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm"
            >
              {roleOptions.map(opt => (
                <option key={opt.roleId} value={opt.roleId}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Specialization</label>
            <input
              type="text"
              value={form.speciality}
              onChange={e => setForm({ ...form, speciality: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm"
              placeholder="e.g. Small Animal Surgery, Exotic Animals..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Years of Experience</label>
            <input
              type="number"
              min="0"
              max="50"
              value={form.expertise}
              onChange={e => setForm({ ...form, expertise: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm"
              placeholder="e.g. 5"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm"
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                {isAdd ? 'Adding...' : 'Saving...'}
              </>
            ) : (
              isAdd ? 'Add Professional' : 'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ professional, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Delete Professional</h3>
            <p className="text-sm text-gray-600">This action cannot be undone.</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 mb-5">
          <p className="text-sm font-semibold text-gray-800">{professional.name}</p>
          <p className="text-sm text-gray-500">{professional.role} — {professional.email}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm">Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function ManageProfessionalsPage() {
  const dispatch = useDispatch();

  const { loading: createLoading, error: createError, success: createSuccess } = useSelector((state) => state.createProfessional);
  const { professionals: apiProfessionals, loading: listLoading, error: listError } = useSelector((state) => state.listProfessionals);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    dispatch(listProfessionals({}));
  }, [dispatch]);

  useEffect(() => {
    if (createSuccess) {
      setShowAddModal(false);
      dispatch(resetProfessionalState());
      dispatch(listProfessionals({}));
    }
  }, [createSuccess, dispatch]);

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    dispatch(resetProfessionalState());
  };

  const professionals = Array.isArray(apiProfessionals)
    ? apiProfessionals.map(normalizeProfessional)
    : [];

  const filtered = professionals.filter(p => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.speciality?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSaveEdit = (id, fields) => {
    // TODO: wire up edit API
    setEditModal(null);
  };

  const handleAdd = (form) => {
    const professionalData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      roleId: form.roleId,
      speciality: form.speciality,
      expertise: form.expertise,
      status: form.status,
    };
    dispatch(createProfessional({ professionalData }));
  };

  const handleDelete = (id) => {
    // TODO: wire up delete API
    setDeleteModal(null);
  };

  // Avatar initials from name
  const getInitials = (name) => {
    if (!name || name === '—') return '?';
    const cleaned = name.replace('Dr. ', '');
    const parts = cleaned.split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Professionals</h1>
          <p className="text-gray-600">View, add, and manage veterinarians and groomers on the platform</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold shadow-lg shadow-indigo-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Professional
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Professionals', value: professionals.length, color: 'bg-indigo-100 text-indigo-700' },
          { label: 'Veterinarians', value: professionals.filter(p => p.roleId === 3).length, color: 'bg-blue-100 text-blue-700' },
          { label: 'Groomers', value: professionals.filter(p => p.roleId === 4).length, color: 'bg-purple-100 text-purple-700' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-lg p-5 flex items-center gap-4">
            <div className={`px-3 py-2 rounded-xl text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 max-w-md">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Professionals</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, or specialization..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Role</label>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            >
              <option value="all">All</option>
              <option value="Vet">Veterinarian</option>
              <option value="Groomer">Groomer</option>
            </select>
          </div>
        </div>
      </div>

      {/* List error */}
      {listError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600 font-medium">{listError}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="px-6 py-4 text-left text-sm font-semibold">#</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Professional</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Specialization</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Experience</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="animate-spin w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      <p className="text-gray-500 font-medium">Loading professionals...</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-gray-500 font-medium">No professionals found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((pro, index) => (
                  <tr key={pro.id} className="hover:bg-indigo-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {getInitials(pro.name)}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{pro.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColors[pro.role] || 'bg-gray-100 text-gray-700'}`}>
                        {pro.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{pro.speciality}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {pro.expertise !== '—' ? (
                        <>
                          <span className="font-semibold text-gray-800">{pro.expertise}</span>
                          <span className="text-gray-500 ml-1">yrs</span>
                        </>
                      ) : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{pro.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{pro.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[pro.status] || 'bg-gray-100 text-gray-700'}`}>
                        {pro.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditModal(pro)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-xs font-semibold"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteModal(pro)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-red-400 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-xs font-semibold"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <ProfessionalModal
          isAdd
          onClose={handleCloseAddModal}
          onSave={handleAdd}
          loading={createLoading}
          error={createError}
        />
      )}
      {editModal && (
        <ProfessionalModal
          professional={editModal}
          onClose={() => setEditModal(null)}
          onSave={(fields) => handleSaveEdit(editModal.id, fields)}
        />
      )}
      {deleteModal && (
        <DeleteModal
          professional={deleteModal}
          onClose={() => setDeleteModal(null)}
          onConfirm={() => handleDelete(deleteModal.id)}
        />
      )}
    </div>
  );
}