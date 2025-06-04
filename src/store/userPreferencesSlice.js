import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Default preferences state
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

// Async thunk to fetch user preferences
export const fetchUserPreferences = createAsyncThunk(
  "userPreferences/fetchUserPreferences",
  async (userId, { rejectWithValue }) => {
    try {
      // In a real implementation, you'd fetch from a "preferences" collection
      // For now, we'll check if there's a preferences document or create one if not
      const preferences = localStorage.getItem(`user_preferences_${userId}`);
      return preferences ? JSON.parse(preferences) : initialState;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update user preferences
export const updateUserPreferences = createAsyncThunk(
  "userPreferences/updateUserPreferences",
  async ({ userId, preferences }, { rejectWithValue }) => {
    try {
      // In a real implementation, you'd update a document in Appwrite
      // For now, we'll save to localStorage as a demo
      const updatedPreferences = {
        ...preferences,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(
        `user_preferences_${userId}`,
        JSON.stringify(updatedPreferences)
      );

      // Apply dark mode to the document if it's enabled
      if (updatedPreferences.displayPreferences.darkMode) {
        document.documentElement.classList.add("dark-theme");
      } else {
        document.documentElement.classList.remove("dark-theme");
      }

      return updatedPreferences;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userPreferencesSlice = createSlice({
  name: "userPreferences",
  initialState,
  reducers: {
    setDarkMode: (state, action) => {
      state.displayPreferences.darkMode = action.payload;
    },
    setCompactView: (state, action) => {
      state.displayPreferences.compactView = action.payload;
    },
    updateBio: (state, action) => {
      state.profile.bio = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPreferences.fulfilled, (state, action) => {
        return {
          ...state,
          ...action.payload,
          loading: false,
          initialized: true,
        };
      })
      .addCase(fetchUserPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        return {
          ...state,
          ...action.payload,
          loading: false,
        };
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setDarkMode, setCompactView, updateBio } =
  userPreferencesSlice.actions;
export default userPreferencesSlice.reducer;
