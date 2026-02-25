import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../feature/loginSlice';
import breedReducer from '../feature/getAnimalBreedSlice';
import registerReducer from '../feature/registerUserSlice';
import vetsReducer from '../feature/listVetsSlice';
import groomersReducer from '../feature/listGroomersSlice';
import userDetailsReducer from '../feature/getUserDetailsSlice';
import createAppointmentReducer from '../feature/createAppointmentSlice';
import upcomingAppointmentsReducer from '../feature/getUpcomingAppointmentSlice';
import completedAppointmentsReducer from '../feature/getCompletedAppointmentSlice';
import cancelledAppointmentsReducer from '../feature/getCancelledAppointmentSlice';
import createProfessionalReducer from '../feature/createProfessionalSlice';
import listProfessionalsReducer from '../feature/listProfessionalsSlice';
import editProfessionalReducer from '../feature/editProfessionalDetailsSlice';
import deleteProfessionalReducer from '../feature/deleteProfessionalSlice';
import listUsersReducer from '../feature/listUsersSlice';
import editUserReducer from '../feature/editUserDetailsSlice';
import deleteUserReducer from '../feature/deleteUserSlice';
import addPetReducer from '../feature/addPetsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    breed: breedReducer,
    register: registerReducer,
    vets: vetsReducer,
    groomers: groomersReducer,
    userDetails: userDetailsReducer,
    createAppointment: createAppointmentReducer,
    upcomingAppointments: upcomingAppointmentsReducer,
    completedAppointments: completedAppointmentsReducer,
    cancelledAppointments: cancelledAppointmentsReducer,
    createProfessional: createProfessionalReducer,
    listProfessionals: listProfessionalsReducer,
    editProfessional: editProfessionalReducer,
    deleteProfessional: deleteProfessionalReducer,
    listUsers: listUsersReducer,
    editUser: editUserReducer,
    deleteUser: deleteUserReducer,
    addPet: addPetReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;