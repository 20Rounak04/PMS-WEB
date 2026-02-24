import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserDetailsThunk } from '../thunks/getUserDetailsThunk';

const mockNotifications = [
  { id: 1, title: 'Appointment Confirmed', message: 'Your grooming appointment on Feb 25 has been confirmed.', time: '2 min ago', read: false },
  { id: 2, title: 'Reminder', message: 'Bella has a vet checkup tomorrow at 10:00 AM.', time: '1 hr ago', read: false },
  { id: 3, title: 'Appointment Cancelled', message: 'Your appointment with Dr. Lee on Feb 20 was cancelled.', time: '3 hrs ago', read: true },
  { id: 4, title: 'New Message', message: 'Dr. Amanda Lee sent you a follow-up note about Bella.', time: 'Yesterday', read: true },
];

// Map roleId to the correct profile route
const profileRouteByRole = {
  1: '/dashboard/profile',         
  2: '/dashboard/profile',         
  3: '/dashboard/vet-profile',     
  4: '/dashboard/groomer-profile', 
};

export default function Topbar({ setSidebarOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authState = useSelector((state) => state.auth);
  const { userDetails } = useSelector((state) => state.userDetails);

  const userData = authState?.user?.data || authState?.user;
  const user = userData?.user;
  const petFromAuth = userData?.pet;

  const roleId = user?.roleId;
  const profileRoute = profileRouteByRole[roleId] || '/dashboard/profile';

  const [notifications, setNotifications] = useState(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (user?.id && petFromAuth?.id) {
      dispatch(getUserDetailsThunk({ userId: user.id, petId: petFromAuth.id }));
    }
  }, [dispatch, user?.id, petFromAuth?.id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const petData = userDetails?.pets?.[0];
  const breedData = petData?.breeds;
  const profileImage = breedData?.image
    ? `${import.meta.env.VITE_BASE_URL}/${breedData.image}`
    : null;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markOneRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-30 bg-white shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            PetPerfect
          </h2>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(prev => !prev)}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-indigo-50 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <p className="text-sm text-gray-400">No notifications</p>
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div
                        key={notification.id}
                        onClick={() => markOneRead(notification.id)}
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-indigo-50 transition-colors ${!notification.read ? 'bg-indigo-50/60' : ''}`}
                      >
                        {/* Dot */}
                        <div className="mt-1.5 shrink-0">
                          {!notification.read
                            ? <span className="w-2 h-2 rounded-full bg-indigo-500 block"></span>
                            : <span className="w-2 h-2 rounded-full bg-transparent block"></span>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold text-gray-800 ${!notification.read ? '' : 'font-medium'}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notification.message}</p>
                          <p className="text-xs text-indigo-400 mt-1 font-medium">{notification.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile — navigates based on roleId */}
          <div
            onClick={() => navigate(profileRoute)}
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-800 truncate max-w-40">
                {user?.email || 'No email'}
              </p>
              {user?.roleName && (
                <p className="text-xs text-indigo-500 font-medium">{user.roleName}</p>
              )}
            </div>
            <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden shadow-md">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={user?.email || 'Profile'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<span class="text-white font-bold text-lg">${user?.email?.charAt(0)?.toUpperCase() || 'U'}</span>`;
                  }}
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}