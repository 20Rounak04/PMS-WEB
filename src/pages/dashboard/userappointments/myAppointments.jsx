import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUpcomingAppointments } from '../../../thunks/getUpcomingAppointmentThunk';
import { fetchCompletedAppointments } from '../../../thunks/getCompletedAppointmentThunk';
import { fetchCancelledAppointments } from '../../../thunks/getCancelledAppointmentThunk';

// ─── Helper: extract userId from any known auth state shape ──────────────────
function resolveUserId(user) {
  if (!user) return null;

  return (
    user?.data?.user?.id   ||
    user?.data?.id         ||
    user?.user?.id         ||
    user?.id               ||
    null
  );
}

// ─── Helper: get full name from professional object ───────────────────────────
// Handles both { name: "Dr. X" } and { firstName: "X", lastName: "Y" } shapes
function getProfessionalName(professional) {
  if (!professional) return 'N/A';
  if (professional.name) return professional.name;
  const first = professional.firstName || '';
  const last  = professional.lastName  || '';
  return `${first} ${last}`.trim() || 'N/A';
}

// ─── Helper: get initials from a full name string ─────────────────────────────
function getInitialsFromName(fullName) {
  if (!fullName || fullName === 'N/A') return 'NA';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || 'NA';
  // Use first and last word's first character (handles "Dr. Aayush Pandey" → "AP")
  const first = parts[0];
  const last  = parts[parts.length - 1];
  // Skip honorifics like "Dr.", "Mr.", "Ms." for the first initial
  const honorifics = ['dr.', 'mr.', 'ms.', 'mrs.', 'prof.'];
  const firstInitial = honorifics.includes(first.toLowerCase())
    ? parts[1]?.[0] || first[0]
    : first[0];
  return `${firstInitial}${last[0]}`.toUpperCase();
}

export default function MyAppointmentsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const upcomingState   = useSelector((state) => state.upcomingAppointments)   || {};
  const completedState  = useSelector((state) => state.completedAppointments)  || {};
  const cancelledState  = useSelector((state) => state.cancelledAppointments)  || {};

  const upcomingAppointments  = upcomingState.appointments  || [];
  const upcomingLoading       = upcomingState.loading       || false;
  const upcomingError         = upcomingState.error         || null;

  const completedAppointments = completedState.appointments || [];
  const completedLoading      = completedState.loading      || false;
  const completedError        = completedState.error        || null;

  const cancelledAppointments = cancelledState.appointments || [];
  const cancelledLoading      = cancelledState.loading      || false;
  const cancelledError        = cancelledState.error        || null;

  const [selectedTab, setSelectedTab]                 = useState('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showCancelModal, setShowCancelModal]         = useState(false);
  const [searchTerm, setSearchTerm]                   = useState('');

  // ─── Fetch appointments whenever user changes ───────────────────────────────
  useEffect(() => {
    const userId = resolveUserId(user);


    if (!userId) {
      console.warn(
        '[MyAppointmentsPage] userId is null/undefined — appointments will NOT be fetched. ' +
        'Check that auth.user is populated and resolveUserId() covers its shape.'
      );
      return;
    }

    dispatch(fetchUpcomingAppointments(userId));
    dispatch(fetchCompletedAppointments(userId));
    dispatch(fetchCancelledAppointments(userId));
  }, [dispatch, user]);

  // ─── Tab data map ───────────────────────────────────────────────────────────
  const appointmentsByTab = {
    upcoming:  Array.isArray(upcomingAppointments)  ? upcomingAppointments  : [],
    past:      Array.isArray(completedAppointments) ? completedAppointments : [],
    cancelled: Array.isArray(cancelledAppointments) ? cancelledAppointments : [],
  };

  const errorByTab = {
    upcoming:  upcomingError,
    past:      completedError,
    cancelled: cancelledError,
  };

  const currentAppointments = appointmentsByTab[selectedTab];
  const currentError        = errorByTab[selectedTab];

  // ─── Format raw API appointment into UI shape ───────────────────────────────
  const formatAppointment = (apt) => {
    // Support both vet and groomer, each may use { name } or { firstName, lastName }
    const professional = apt.vet || apt.groomer;
    const serviceType  = apt.serviceType === 'vet' ? 'Veterinary Consultation' : 'Grooming Service';

    const professionalName = getProfessionalName(professional);
    const avatar           = getInitialsFromName(professionalName);

    return {
      id:   apt.id,
      type: apt.appointmentType || serviceType,
      professional: {
        name:      professionalName,
        specialty: professional?.specialization || professional?.expertise || 'General Service',
        avatar,
        rating:    professional?.rating || 4.5,
      },
      date:        apt.appointmentDate,
      time:        apt.time,
      status:      apt.status,
      petName:     apt.pet?.name || 'Unknown Pet',
      notes:       apt.description || '',
      serviceType: apt.serviceType,
    };
  };

  // ─── Filtered list ──────────────────────────────────────────────────────────
  const filteredAppointments = currentAppointments
    .map(formatAppointment)
    .filter((apt) => {
      const q = searchTerm.toLowerCase();
      return (
        apt.professional.name.toLowerCase().includes(q) ||
        apt.type.toLowerCase().includes(q)              ||
        apt.petName.toLowerCase().includes(q)
      );
    });

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':  return 'bg-green-100 text-green-700';
      case 'pending':    return 'bg-yellow-100 text-yellow-700';
      case 'completed':  return 'bg-blue-100 text-blue-700';
      case 'cancelled':  return 'bg-red-100 text-red-700';
      default:           return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type) => {
    const t = type.toLowerCase();
    if (t.includes('veterinary') || t.includes('consultation')) return '🏥';
    if (t.includes('grooming'))                                  return '✂️';
    if (t.includes('vaccination'))                               return '💉';
    if (t.includes('checkup') || t.includes('check-up'))        return '🩺';
    return '📋';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year:    'numeric',
      month:   'long',
      day:     'numeric',
    });
  };

  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    try {
      // TODO: replace with real API call
      // await api.put(`/user/appointment/${selectedAppointment.id}/cancel`);

      const userId = resolveUserId(user);
      if (userId) {
        await dispatch(fetchUpcomingAppointments(userId));
        await dispatch(fetchCancelledAppointments(userId));
      }
      setShowCancelModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };

  const handleReschedule = (appointment) => {
  };

  const isLoading =
    (selectedTab === 'upcoming'  && upcomingLoading)  ||
    (selectedTab === 'past'      && completedLoading) ||
    (selectedTab === 'cancelled' && cancelledLoading);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Appointments</h1>
        <p className="text-gray-600">View and manage your scheduled appointments</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-4 border-b border-gray-200">
          {[
            { key: 'upcoming',  label: 'Upcoming',  count: upcomingAppointments.length  },
            { key: 'past',      label: 'Past',       count: completedAppointments.length },
            { key: 'cancelled', label: 'Cancelled',  count: cancelledAppointments.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`pb-4 px-4 font-semibold transition-all relative ${
                selectedTab === tab.key
                  ? 'text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  selectedTab === tab.key
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tab.count}
              </span>
              {selectedTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="max-w-md">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search Appointments
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by professional, type, or pet name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {currentError && !isLoading && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
          <span className="text-sm font-medium">{currentError}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      )}

      {/* Appointments List */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Professional Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {appointment.professional.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{getTypeIcon(appointment.type)}</span>
                      <h3 className="text-lg font-bold text-gray-800">{appointment.type}</h3>
                    </div>
                    <p className="text-gray-600 font-semibold">{appointment.professional.name}</p>
                    <p className="text-sm text-gray-500">{appointment.professional.specialty}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-800">
                        {appointment.professional.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-800 font-medium">{formatDate(appointment.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-800 font-medium">{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm text-gray-800 font-medium">Pet: {appointment.petName}</span>
                  </div>
                  {appointment.notes && (
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-indigo-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-gray-600">{appointment.notes}</span>
                    </div>
                  )}
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col items-end gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                    {appointment.status
                      ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)
                      : 'Unknown'}
                  </span>

                  {selectedTab === 'upcoming' && (
                    <div className="flex flex-col gap-2 w-full lg:w-auto">
                      <button
                        onClick={() => handleReschedule(appointment)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancelAppointment(appointment)}
                        className="px-4 py-2 bg-white border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-semibold text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {selectedTab === 'past' && (
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm">
                      Book Again
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && filteredAppointments.length === 0 && !currentError && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Appointments Found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? 'Try adjusting your search criteria'
              : `You don't have any ${selectedTab} appointments`}
          </p>
          {selectedTab === 'upcoming' && !searchTerm && (
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
              Book New Appointment
            </button>
          )}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Cancel Appointment</h3>
                <p className="text-sm text-gray-600">Are you sure you want to cancel?</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-800 font-semibold">{selectedAppointment.type}</p>
              <p className="text-sm text-gray-600">with {selectedAppointment.professional.name}</p>
              <p className="text-sm text-gray-600">
                {formatDate(selectedAppointment.date)} at {selectedAppointment.time}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowCancelModal(false); setSelectedAppointment(null); }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Keep Appointment
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}