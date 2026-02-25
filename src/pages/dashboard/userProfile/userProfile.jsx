import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserDetailsThunk } from '../../../thunks/getUserDetailsThunk';
import { AlertCircle, Smile } from 'lucide-react';

export default function UserProfile() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const { userDetails, loading, error } = useSelector((state) => state.userDetails);

  const user = authState?.user?.user;
  const petFromAuth = authState?.user?.pet;

  useEffect(() => {
    if (user?.id && petFromAuth?.id) {
      dispatch(getUserDetailsThunk({ userId: user.id, petId: petFromAuth.id }));
    }
  }, [dispatch, user?.id, petFromAuth?.id]);

  const petData = userDetails?.pets?.[0];
  const breedData = petData?.breeds;
  const profileImage = breedData?.image
    ? `${import.meta.env.VITE_BASE_URL}/${breedData.image}`
    : null;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

          {/* Profile Picture */}
          <div className="w-32 h-32 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
            {profileImage ? (
              <img
                src={profileImage}
                alt={user?.email || 'Profile'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<span class="text-white font-bold text-5xl">${user?.email?.charAt(0)?.toUpperCase() || 'U'}</span>`;
                }}
              />
            ) : (
              <span className="text-white font-bold text-5xl">
                {user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{user?.email || 'User'}</h1>
            <p className="text-gray-600 mb-2">{user?.email || 'user@example.com'}</p>
            <p className="text-sm text-indigo-600 font-semibold mb-4 capitalize">{user?.roleName || 'User'}</p>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Pet Information */}
      {(petFromAuth || petData) && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Smile className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Pet Information</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Pet ID</label>
              <p className="text-gray-800 font-semibold">{petData?.id || petFromAuth?.id || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Age</label>
              <p className="text-gray-800 font-semibold">{petData?.age || petFromAuth?.age || 'N/A'} years old</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Species</label>
              <p className="text-gray-800 font-semibold">{breedData?.species || petFromAuth?.species || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Breed</label>
              <p className="text-gray-800 font-semibold">{breedData?.name || petFromAuth?.breed || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}