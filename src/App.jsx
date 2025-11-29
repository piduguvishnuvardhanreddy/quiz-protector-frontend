import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import StudentLoginPage from '@/pages/StudentLoginPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AdminDashboard from '@/pages/AdminDashboard';
import StudentDashboard from '@/pages/StudentDashboard';
import CreateQuizPage from '@/pages/CreateQuizPage';
import QuizDetailsPage from '@/pages/QuizDetailsPage';
import QuizIntroPage from '@/pages/QuizIntroPage';
import ExamPage from '@/pages/ExamPage';
import FeedbackPage from '@/pages/FeedbackPage';
import ReportPage from '@/pages/ReportPage';
import AdminQuizAttemptsPage from '@/pages/AdminQuizAttemptsPage';
import AdminAttemptDetailsPage from '@/pages/AdminAttemptDetailsPage';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Authentication Routes */}
          <Route path="/login/student" element={<StudentLoginPage />} />
          <Route path="/login/admin" element={<AdminLoginPage />} />
          <Route path="/login" element={<Navigate to="/login/student" replace />} />
          <Route path="/register/student" element={<RegisterPage />} />
          <Route path="/register/admin" element={<RegisterPage />} />
          <Route path="/register" element={<Navigate to="/register/student" replace />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/quizzes/new"
            element={
              <ProtectedRoute roles={["admin"]}>
                <CreateQuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/quizzes/:id"
            element={
              <ProtectedRoute roles={["admin"]}>
                <QuizDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/quizzes/:id/attempts"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminQuizAttemptsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attempts/:id"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminAttemptDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute roles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Quiz Taking Routes (Public/Protected) */}
          <Route path="/quiz/:slug" element={<QuizIntroPage />} />
          <Route path="/exam/:attemptId" element={<ExamPage />} />
          <Route path="/feedback/:attemptId" element={<FeedbackPage />} />
          <Route path="/report/:attemptId" element={<ReportPage />} />

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
}
