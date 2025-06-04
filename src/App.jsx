import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { fetchUserPreferences } from "./store/userPreferencesSlice";
import { Footer, Header } from "./components";
import { Outlet } from "react-router-dom";
import { ToastProvider } from "./hooks/useToast";
import ToastContainer from "./components/Toast/ToastContainer";

function App() {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.auth);
  const { initialized, displayPreferences } = useSelector(state => state.userPreferences);

  useEffect(() => {
    // Auth check
    authService.getCurrentUser().then((userData) => {
      if (userData) {
        dispatch(login({ userData }));
      } else {
        dispatch(logout());
      }
    });
  }, [dispatch]);

  // Load user preferences when user data is available
  useEffect(() => {
    if (userData && !initialized) {
      dispatch(fetchUserPreferences(userData.$id));
    }
  }, [userData, initialized, dispatch]);

  // Apply theme based on preferences
  useEffect(() => {
    if (displayPreferences?.darkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [displayPreferences?.darkMode]);

  return (
    <ToastProvider>
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
