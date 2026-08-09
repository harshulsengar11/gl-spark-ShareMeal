import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DonorDashboard from './pages/DonorDashboard';
import NgoDashboard from './pages/NgoDashboard';
import FoodListPage from './pages/FoodListPage';
import AddFoodPage from './pages/AddFoodPage';
import RankingPage from './pages/RankingPage';
import NotificationPage from './pages/NotificationPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Box className="app-shell">
      <Navbar />

      <Box component="main" className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/donor-dashboard"
            element={
              <ProtectedRoute allowedRoles={['DONOR']}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ngo-dashboard"
            element={
              <ProtectedRoute allowedRoles={['NGO']}>
                <NgoDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/foods"
            element={
              <ProtectedRoute>
                <FoodListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-food"
            element={
              <ProtectedRoute allowedRoles={['DONOR']}>
                <AddFoodPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ranking"
            element={
              <ProtectedRoute allowedRoles={['DONOR', 'NGO']}>
                <RankingPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>

      <Footer />
    </Box>
  );
}

export default App;
