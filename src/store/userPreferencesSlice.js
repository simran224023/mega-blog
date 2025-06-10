import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: {
    bio: "",
  },
  displayPreferences: {
    darkMode: false,
    compactView: false,
  },
  loading: false,
  error: null,
  initialized: false,
};

const userPreferencesSlice = createSlice({
  name: "userPreferences",
  initialState,
  reducers: {
    setPreferences: (state, action) => {
      state.profile = action.payload.profile || state.profile;
      state.displayPreferences = action.payload.displayPreferences || state.displayPreferences;
      state.initialized = true;
      state.loading = false;
      state.error = null;
    },
    setDarkMode: (state, action) => {
      state.displayPreferences.darkMode = action.payload;
    },
    setCompactView: (state, action) => {
      state.displayPreferences.compactView = action.payload;
    },
    updateBio: (state, action) => {
      state.profile.bio = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPreferences: (state) => {
      state.profile = { bio: "" };
      state.displayPreferences = { darkMode: false, compactView: false };
      state.initialized = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export default userPreferencesSlice.reducer;
export const { 
  setPreferences, 
  setDarkMode, 
  setCompactView, 
  updateBio, 
  setLoading, 
  setError, 
  clearError, 
  resetPreferences 
} = userPreferencesSlice.actions;