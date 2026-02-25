import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUpcomingAppointments } from '../../../thunks/getUpcomingAppointmentThunk';
import { fetchCompletedAppointments } from '../../../thunks/getCompletedAppointmentThunk';
import { fetchCancelledAppointments } from '../../../thunks/getCancelledAppointmentThunk';
import { Search, AlertTriangle, Star, CalendarDays, Clock, User, FileText, CalendarX } from 'lucide-react';

function resolveUserId(user) {
  if (!user) return null;
  return (
    user?.data?.user?.id ||
    user?.data?.id ||
    user?.user?.id ||
    user?.id ||
    null
  );
}

function getProfessionalName(professional) {
  if (!professional) return 'N/A';
  if (professional.name) return professional.name;
  const first = professional.firstName || '';
  const last = professional.lastName || '';
  return `${first} ${last}`.trim() || 'N/A';
}

function getInitialsFromName(fullName) {
  if (!fullName || fullName === 'N/A') return 'NA';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || 'NA';
  const first = parts[0];
  const last = parts[parts.length - 1];
  const honorifics = ['dr.', 'mr.', 'ms.', 'mrs.', 'prof.'];
  const firstInitial = honorifics.includes(first.toLowerCase())
    ? parts[1]?.[0] || first[0]
    : first[0];
  return `${firstInitial}${last[0]}`.toUpperCase();
}

export default function MyAppointmentsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const upcomingState = useSelector((state) => state.upcomingAppointments) || {};
  const completedState = useSelector((state) => state.completedAppointments) || {};
  const cancelledState = useSelector((state) => state.cancelledAppointments) || {};

  const upcomingAppointments = upcomingState.appointments || [];
  const upcomingLoading = upcomingState.loading || false;
  const upcomingError = upcomingState.error || null;

  const completedAppointments = completedState.appointments || [];
  const completedLoading = completedState.loading || false;
  const completedError = completedState.error || null;

  const cancelledAppointments = cancelledState.appointments || [];
  const cancelledLoading = cancelledState.loading || false;
  const cancelledError = cancelledState.error || null;

  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const userId = resolveUserId(user);
    if (!userId) {
      console.warn('[MyAppointmentsPage] userId is null/undefined — appointments will NOT be fetched.');
      return;
    }
    dispatch(fetchUpcomingAppointments(userId));
    dispatch(fetchCompletedAppointments(userId));
    dispatch(fetchCancelledAppointments(userId));
  }, [dispatch, user]);

  const appointmentsByTab = {
    upcoming: Array.isArray(upcomingAppointments) ? upcomingAppointments : [],
    past: Array.isArray(completedAppointments) ? completedAppointments : [],
    cancelled: Array.isArray(cancelledAppointments) ? cancelledAppointments : [],
  };

  const errorByTab = {
    upcoming: upcomingError,
    past: completedError,
    cancelled: cancelledError,
  };

  const currentAppointments = appointmentsByTab[selectedTab];
  const currentError = errorByTab[selectedTab];

  const formatAppointment = (apt) => {
    const professional = apt.vet || apt.groomer;
    const serviceType = apt.serviceType === 'vet' ? 'Veterinary Consultation' : 'Grooming Service';
    const professionalName = getProfessionalName(professional);
    const avatar = getInitialsFromName(professionalName);

    return {
      id: apt.id,
      type: apt.appointmentType || serviceType,
      professional: {
        name: professionalName,
        specialty: professional?.specialization || professional?.expertise || 'General Service',
        avatar,
        rating: professional?.rating || 4.5,
      },
      date: apt.appointmentDate,
      time: apt.time,
      status: apt.status,
      petName: apt.pet?.name || 'Unknown Pet',
      notes: apt.description || '',
      serviceType: apt.serviceType,
    };
  };

  const filteredAppointments = currentAppointments
    .map(formatAppointment)
    .filter((apt) => {
      const q = searchTerm.toLowerCase();
      return (
        apt.professional.name.toLowerCase().includes(q) ||
        apt.type.toLowerCase().includes(q) ||
        apt.petName.toLowerCase().includes(q)
      );
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type) => {
    const t = type.toLowerCase();
    if (t.includes('veterinary') || t.includes('consultation')) return '🏥';
    if (t.includes('grooming')) return '✂️';
    if (t.includes('vaccination')) return '💉';
    if (t.includes('checkup') || t.includes('check-up')) return '🩺';
    return '📋';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    try {
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

  const handleReschedule = (appointment) => {};

  const isLoading =
    (selectedTab === 'upcoming' && upcomingLoading) ||
    (selectedTab === 'past' && completedLoading) ||
    (selectedTab === 'cancelled' && cancelledLoading);

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
            { key: 'upcoming', label: 'Upcoming', count: upcomingAppointments.length },
            { key: 'past', label: 'Past', count: completedAppointments.length },
            { key: 'cancelled', label: 'Cancelled', count: cancelledAppointments.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`pb-4 px-4 font-semibold transition-all relative ${
                selectedTab === tab.key ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                selectedTab === tab.key ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
              }`}>
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">Search Appointments</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by professional, type, or pet name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {currentError && !isLoading && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
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
            <div key={appointment.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
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
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold text-gray-800">{appointment.professional.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-indigo-500" />
                    <span className="text-sm text-gray-800 font-medium">{formatDate(appointment.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-500" />
                    <span className="text-sm text-gray-800 font-medium">{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-500" />
                    <span className="text-sm text-gray-800 font-medium">Pet: {appointment.petName}</span>
                  </div>
                  {appointment.notes && (
                    <div className="flex items-start gap-2">
                      <FileText className="w-5 h-5 text-indigo-500 mt-0.5" />
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
          <CalendarX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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
                <AlertTriangle className="w-6 h-6 text-red-600" />
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