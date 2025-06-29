import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import courseSlice from './courseSlice';
import applicationSlice from './applicationSlice';
import examSlice from './examSlice';
import certificateSlice from './certificateSlice';
import contactSlice from './contactSlice';
import adminSlice from './adminSlice';

const store = configureStore({
  reducer: {
    user: userSlice,
    courses: courseSlice,
    applications: applicationSlice,
    exams: examSlice,
    certificates: certificateSlice,
    contacts: contactSlice,
    admin: adminSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store; 