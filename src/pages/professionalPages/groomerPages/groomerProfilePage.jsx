import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export default function GroomerProfilePage() {
  const authState = useSelector((state) => state.auth);
  const userData = authState?.user?.data || authState?.user;
  const user = userData?.user;

  const [availability, setAvailability] = useState('available');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  const handleStatusClick = (status) => {
    if (status === availability) return;
    setPendingStatus(status);
    setShowStatusModal(true);
  };

  const confirmStatusChange = () => {
    setAvailability(pendingStatus);
    setShowStatusModal(false);
    setPendingStatus(null);
  };

  const statusConfig = {
    available: { label: 'Available', color: 'bg-green-100 text-green-700 border-green-300', dot: 'bg-green-500' },
    unavailable: { label: 'Unavailable', color: 'bg-red-100 text-red-700 border-red-300', dot: 'bg-red-500' },
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="w-32 h-32 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shrink-0">
            <span className="text-white font-bold text-5xl">
              {user?.name?.charAt(0)?.toUpperCase() || 'G'}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-800">{user?.name || 'Groomer Name'}</h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig[availability].color} w-fit mx-auto md:mx-0`}>
                <span className={`w-2 h-2 rounded-full ${statusConfig[availability].dot}`}></span>
                {statusConfig[availability].label}
              </span>
            </div>
            <p className="text-gray-500 mb-1">{user?.email || 'groomer@example.com'}</p>
            <p className="text-sm text-purple-600 font-semibold mb-1">Groomer</p>
            <p className="text-sm text-gray-500 mb-4">Expertise: Breed-Specific Styling & Spa Treatments</p>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Manage Availability */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Manage Availability</h2>
        <p className="text-sm text-gray-500 mb-5">Set your current availability status so customers know when to book you.</p>
        <div className="flex gap-4">
          {Object.entries(statusConfig).map(([key, val]) => (
            <button
              key={key}
              onClick={() => handleStatusClick(key)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                availability === key
                  ? `${val.color} border-current shadow-sm`
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-gray-50'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${availability === key ? val.dot : 'bg-gray-400'}`}></span>
              {val.label}
            </button>
          ))}
        </div>
      </div>

      {/* Professional Details */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-5">Professional Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Speciality', value: 'Groomer' },
            { label: 'Expertise', value: 'Breed-Specific Styling' },
            { label: 'Experience', value: '5 Years' },
            { label: 'Rating', value: '4.7 / 5.0' },
            { label: 'Total Appointments', value: '128' },
            { label: 'Joined', value: 'June 22, 2024' },
          ].map(item => (
            <div key={item.label} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">{item.label}</p>
              <p className="text-gray-800 font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-5">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Email', value: user?.email || 'groomer@example.com' },
            { label: 'Phone', value: user?.phone || '+1 234 567 9002' },
            { label: 'Location', value: 'New York, NY' },
            { label: 'Working Hours', value: 'Mon – Sat, 9:00 AM – 6:00 PM' },
          ].map(item => (
            <div key={item.label} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">{item.label}</p>
              <p className="text-gray-800 font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Status Confirm Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Change Status</h3>
                <p className="text-sm text-gray-500">Update your availability</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <p className="text-sm text-gray-700">
                Are you sure you want to set your status to{' '}
                <span className={`font-bold ${pendingStatus === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                  {statusConfig[pendingStatus]?.label}
                </span>?
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowStatusModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm">
                Cancel
              </button>
              <button onClick={confirmStatusChange}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}