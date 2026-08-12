import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { PeraturanProvider } from './context/PeraturanContext';
import { ToastProvider } from './context/ToastContext';

import ProtectedRoute from './components/common/ProtectedRoute';
import Toast from './components/common/Toast';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import PeraturanListPage from './pages/PeraturanListPage';
import PeraturanDetailPage from './pages/PeraturanDetailPage';
import PanduanPage from './pages/PanduanPage';
import AIAssistantPage from './pages/AIAssistantPage';

export default function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <PeraturanProvider>

          <ToastProvider>

            <Toast />

            <Routes>

              {/* =========================
                  PUBLIC ROUTES
              ========================== */}

              <Route
                path="/"
                element={<LandingPage />}
              />

              <Route
                path="/login"
                element={<LoginPage />}
              />


              {/* =========================
                  PROTECTED ROUTES
              ========================== */}

              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />


              <Route
                path="/peraturan"
                element={
                  <ProtectedRoute>
                    <PeraturanListPage />
                  </ProtectedRoute>
                }
              />


              <Route
                path="/peraturan/:id"
                element={
                  <ProtectedRoute>
                    <PeraturanDetailPage />
                  </ProtectedRoute>
                }
              />


              <Route
                path="/panduan"
                element={
                  <ProtectedRoute>
                    <PanduanPage />
                  </ProtectedRoute>
                }
              />


              {/* =========================
                  HARMONITAS AI
              ========================== */}

              <Route
                path="/ai"
                element={
                  <ProtectedRoute>
                    <AIAssistantPage />
                  </ProtectedRoute>
                }
              />


              {/* =========================
                  FALLBACK
              ========================== */}

              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />

            </Routes>

          </ToastProvider>

        </PeraturanProvider>

      </AuthProvider>

    </BrowserRouter>
  );
}