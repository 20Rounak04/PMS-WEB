import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVets } from '../../../thunks/listVetsThunk';
import { fetchGroomers } from '../../../thunks/listGroomersThunk';

export default function ListProfessionalPage() {
  const dispatch = useDispatch();
  
  // Get vets state
  const { vets = [], loading: vetsLoading, error: vetsError } = useSelector((state) => state.vets);
  
  // Get groomers state
  const { groomers = [], loading: groomersLoading, error: groomersError } = useSelector((state) => state.groomers);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('vet');

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchVets());
    dispatch(fetchGroomers());
  }, [dispatch]);

  // Transform backend vets data to match frontend structure
  const transformedVets = Array.isArray(vets) ? vets.map(vet => ({
    id: vet.id,
    name: vet.name,
    specialty: vet.specialization,
    rating: vet.rating || 4.5,
    experience: `${vet.experienceYears} years`,
    avatar: vet.name.split(' ').map(n => n[0]).join('').toUpperCase(),
    available: vet.status === 'available'
  })) : [];

  // Transform backend groomers data to match frontend structure
  const transformedGroomers = Array.isArray(groomers) ? groomers.map(groomer => ({
    id: groomer.id,
    name: groomer.name,
    specialty: groomer.specialization,
    rating: groomer.rating || 4.5,
    experience: `${groomer.experienceYears} years`,
    avatar: groomer.name.split(' ').map(n => n[0]).join('').toUpperCase(),
    available: groomer.status === 'available'
  })) : [];

  // Get current list and loading/error states based on selected type
  const currentList = selectedType === 'vet' ? transformedVets : transformedGroomers;
  const loading = selectedType === 'vet' ? vetsLoading : groomersLoading;
  const error = selectedType === 'vet' ? vetsError : groomersError;

  // Filter professionals based on search
  const filteredProfessionals = currentList.filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prof.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Retry function based on selected type
  const handleRetry = () => {
    if (selectedType === 'vet') {
      dispatch(fetchVets());
    } else {
      dispatch(fetchGroomers());
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Available Professionals</h1>
        <p className="text-gray-600">Browse and connect with our pet care experts</p>
      </div>

      {/* Toggle Slider */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-center gap-4">
          <span className={`text-lg font-semibold transition-colors ${selectedType === 'vet' ? 'text-indigo-600' : 'text-gray-400'}`}>
            Veterinarians
          </span>
          <button
            onClick={() => setSelectedType(selectedType === 'vet' ? 'groomer' : 'vet')}
            className={`relative w-20 h-10 rounded-full transition-colors ${
              selectedType === 'vet' ? 'bg-indigo-600' : 'bg-purple-600'
            }`}
          >
            <div
              className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow-md transition-transform ${
                selectedType === 'vet' ? 'left-1' : 'translate-x-10 left-1'
              }`}
            ></div>
          </button>
          <span className={`text-lg font-semibold transition-colors ${selectedType === 'groomer' ? 'text-purple-600' : 'text-gray-400'}`}>
            Groomers
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="max-w-md">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search Professionals
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {selectedType === 'vet' ? 'veterinarians' : 'groomers'}...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-red-800">Error Loading {selectedType === 'vet' ? 'Veterinarians' : 'Groomers'}</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
          <button 
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Professionals Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map(professional => (
            <div key={professional.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              {/* Professional Avatar and Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                    selectedType === 'vet' 
                      ? 'bg-linear-to-br from-indigo-500 to-purple-500'
                      : 'bg-linear-to-br from-purple-500 to-pink-500'
                  }`}>
                    {professional.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{professional.name}</h3>
                    <p className="text-sm text-gray-600">{professional.specialty}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  professional.available 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {professional.available ? 'Available' : 'Busy'}
                </div>
              </div>

              {/* Professional Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-800">{professional.rating}</span>
                  <span className="text-sm text-gray-600">rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600">{professional.experience} experience</span>
                </div>
              </div>

              {/* Action Button */}
              <button className={`w-full text-white px-4 py-2 rounded-lg transition-colors font-semibold ${
                selectedType === 'vet'
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}>
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {filteredProfessionals.length === 0 && !loading && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No {selectedType === 'vet' ? 'Veterinarians' : 'Groomers'} Found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}