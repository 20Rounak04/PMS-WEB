import React, { useState } from 'react';

const mockAppointments = [
  {
    id: 1,
    customerName: 'Sarah Johnson',
    petName: 'Bella',
    breed: 'Golden Retriever',
    age: 3,
    appointmentDate: '2026-02-25',
    appointmentTime: '09:00 AM',
    notes: 'Bella has been scratching her left ear a lot. Also due for annual vaccinations. She gets scared at the vet so please handle gently.',
    status: 'confirmed',
  },
  {
    id: 2,
    customerName: 'Daniel Park',
    petName: 'Whiskers',
    breed: 'Persian Cat',
    age: 4,
    appointmentDate: '2026-02-25',
    appointmentTime: '10:30 AM',
    notes: '',
    status: 'confirmed',
  },
  {
    id: 3,
    customerName: 'Olivia Martinez',
    petName: 'Coco',
    breed: 'French Bulldog',
    age: 1,
    appointmentDate: '2026-02-26',
    appointmentTime: '1:00 PM',
    notes: 'First vet visit. Needs full checkup and initial vaccines.',
    status: 'pending',
  },
  {
    id: 4,
    customerName: 'Tom Wilson',
    petName: 'Shadow',
    breed: 'German Shepherd',
    age: 6,
    appointmentDate: '2026-02-27',
    appointmentTime: '11:00 AM',
    notes: '',
    status: 'confirmed',
  },
  {
    id: 5,
    customerName: 'Priya Sharma',
    petName: 'Mango',
    breed: 'Indian Parrot',
    age: 2,
    appointmentDate: '2026-02-27',
    appointmentTime: '3:30 PM',
    notes: 'Mango has been losing feathers on the neck area. Possible infection.',
    status: 'pending',
  },
];

const statusColors = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

function NotesModal({ notes, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800">Customer Notes</h3>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 mb-5">
          <p className="text-gray-700 text-sm leading-relaxed">{notes}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function EditModal({ appointment, onClose, onSave }) {
  const [form, setForm] = useState({
    appointmentDate: appointment.appointmentDate,
    appointmentTime: appointment.appointmentTime,
    status: appointment.status,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Edit Appointment</h3>
            <p className="text-sm text-gray-500">{appointment.customerName} — {appointment.petName}</p>
          </div>
        </div>

        <div className="space-y-4 mb-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Appointment Date</label>
            <input
              type="date"
              value={form.appointmentDate}
              onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Appointment Time</label>
            <input
              type="time"
              value={form.appointmentTime}
              onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VetAppointmentPage() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [searchTerm, setSearchTerm] = useState('');
  const [notesModal, setNotesModal] = useState(null);
  const [editModal, setEditModal] = useState(null);

  const filtered = appointments.filter((apt) =>
    apt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleSaveEdit = (id, updatedFields) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, ...updatedFields } : apt))
    );
    setEditModal(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Veterinary Appointments</h1>
        <p className="text-gray-600">Manage and track all your veterinary consultations</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Today', value: appointments.filter(a => a.appointmentDate === '2026-02-25').length, color: 'bg-indigo-100 text-indigo-700' },
          { label: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length, color: 'bg-green-100 text-green-700' },
          { label: 'Pending', value: appointments.filter(a => a.status === 'pending').length, color: 'bg-yellow-100 text-yellow-700' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-lg p-5 flex items-center gap-4">
            <div className={`px-3 py-2 rounded-xl text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
        <div className="max-w-md">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Search Appointments</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by customer, pet name, or breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="px-6 py-4 text-left text-sm font-semibold">#</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Customer Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Pet & Breed</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Age</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Notes</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500 font-medium">No appointments found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((apt, index) => (
                  <tr key={apt.id} className="hover:bg-indigo-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {apt.customerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{apt.customerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-800">{apt.petName}</p>
                      <p className="text-xs text-gray-500">{apt.breed}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{apt.age} yr{apt.age !== 1 ? 's' : ''}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatDate(apt.appointmentDate)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{apt.appointmentTime}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[apt.status] || 'bg-gray-100 text-gray-700'}`}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {apt.notes ? (
                        <button
                          onClick={() => setNotesModal(apt.notes)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-xs font-semibold"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No notes</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setEditModal(apt)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-xs font-semibold"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes Modal */}
      {notesModal && <NotesModal notes={notesModal} onClose={() => setNotesModal(null)} />}

      {/* Edit Modal */}
      {editModal && (
        <EditModal
          appointment={editModal}
          onClose={() => setEditModal(null)}
          onSave={(fields) => handleSaveEdit(editModal.id, fields)}
        />
      )}
    </div>
  );
}