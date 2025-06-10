import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import authService from "./appwrite/auth";
import preferencesService from "./appwrite/preferences";
import { login, logout } from "./store/authSlice";
import { 
  setPreferences, 
  setLoading, 
  setError, 
  clearError 
} from "./store/userPreferencesSlice";
import { Footer, Header } from "./components";
import { Outlet } from "react-router-dom";
import { ToastProvider } from "./hooks/useToast";
import ToastContainer from "./components/Toast/ToastContainer";
import Loader from "./components/Loader/Loader";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop"; 

function App() {
  const dispatch = useDispatch();
  const [authLoading, setAuthLoading] = useState(true);
  const { userData } = useSelector(state => state.auth);
  const { initialized, displayPreferences } = useSelector(state => state.userPreferences);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        dispatch(logout());
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!userData || initialized) return;

      dispatch(setLoading(true));
      dispatch(clearError());

      try {
        const preferences = await preferencesService.getUserPreferences(userData.$id);
        dispatch(setPreferences(preferences));
        preferencesService.applyThemePreferences(preferences);
      } catch (error) {
        console.error("Error loading user preferences:", error);
        dispatch(setError(error.message));
      }
    };

    loadUserPreferences();
  }, [userData, initialized, dispatch]);

  useEffect(() => {
    if (displayPreferences?.darkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [displayPreferences?.darkMode]);

  if (authLoading) {
    return (
      <ToastProvider>
        <Loader 
          variant="logo" 
          fullScreen 
          text="Initializing app..." 
          size="large"
        />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <ScrollToTop /> 
      <div className="app-container">
        <div className="app-wrapper">
          <Header />
          <main className="main-content">
            <Outlet />
          </main>
          <Footer />
        </div>
        <ToastContainer />
      </div>
    </ToastProvider>
  );
}

export default App;