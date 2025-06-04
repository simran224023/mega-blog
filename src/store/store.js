import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./authSlice";
import postSliceReducer from "./postSlice";
import userPreferencesReducer from "./userPreferencesSlice";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    posts: postSliceReducer,
    userPreferences: userPreferencesReducer,
  },
});

export default store;