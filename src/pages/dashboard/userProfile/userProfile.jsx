import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserDetailsThunk } from '../../../thunks/getUserDetailsThunk';
import { AlertCircle, Smile, PawPrint } from 'lucide-react';

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

  const pets = userDetails?.pets || [];
  const userName = userDetails?.name || user?.name || user?.email;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4">
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
      <div className="max-w-6xl mx-auto px-4">
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
    <div className="max-w-6xl mx-auto px-4">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Picture */}
          <div className="w-32 h-32 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-5xl">
              {userName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{userName}</h1>
            <p className="text-gray-600 mb-2">{userDetails?.email || user?.email || 'user@example.com'}</p>
            <p className="text-sm text-indigo-600 font-semibold mb-4 capitalize">
              {userDetails?.roles?.name || user?.roleName || 'User'}
            </p>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Pets Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <PawPrint className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">My Pets</h2>
          </div>
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
            {pets.length} {pets.length === 1 ? 'Pet' : 'Pets'}
          </span>
        </div>

        {/* Pets Grid */}
        {pets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => {
              const breedData = pet.breeds;
              const profileImage = breedData?.image
                ? `${import.meta.env.VITE_BASE_URL}/${breedData.image}`
                : null;

              return (
                <div
                  key={pet.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Pet Image */}
                  <div className="h-48 bg-linear-to-br from-indigo-400 to-purple-400 flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={pet.name || breedData?.name || 'Pet'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<div class="flex items-center justify-center w-full h-full"><svg class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg></div>`;
                        }}
                      />
                    ) : (
                      <Smile className="w-20 h-20 text-white" />
                    )}
                  </div>

                  {/* Pet Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {pet.name || 'Unnamed Pet'}
                    </h3>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Species</span>
                        <span className="text-sm font-semibold text-gray-800 capitalize">
                          {breedData?.species || 'N/A'}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Breed</span>
                        <span className="text-sm font-semibold text-gray-800">
                          {breedData?.name || 'N/A'}
                        </span>
                      </div>

                      {pet.age && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Age</span>
                          <span className="text-sm font-semibold text-gray-800">
                            {pet.age} {pet.age === 1 ? 'year' : 'years'}
                          </span>
                        </div>
                      )}

                      {pet.gender && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Gender</span>
                          <span className="text-sm font-semibold text-gray-800 capitalize">
                            {pet.gender}
                          </span>
                        </div>
                      )}

                      {pet.weight && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Weight</span>
                          <span className="text-sm font-semibold text-gray-800">
                            {pet.weight} kg
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Pet ID Badge */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Pet ID</span>
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                          #{pet.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Smile className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pets Yet</h3>
            <p className="text-gray-500 mb-6">Add your first pet to get started!</p>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Add Pet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}