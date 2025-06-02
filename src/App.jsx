import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { Footer, Header } from "./components";
import { Outlet } from "react-router-dom";
import { ToastProvider } from "./hooks/useToast";
import ToastContainer from "./components/Toast/ToastContainer";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser().then((userData) => {
      if (userData) {
        dispatch(login({ userData }));
      } else {
        dispatch(logout());
      }
    });
  }, []);

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
