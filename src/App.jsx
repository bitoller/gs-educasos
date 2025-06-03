import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EmergencyKits from './pages/EmergencyKits';
import EmergencyKitForm from './pages/EmergencyKitForm';
import LearnDisasters from './pages/LearnDisasters';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Home.css';

// Componente para proteger rotas administrativas
const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('userRole') === 'admin';
  return isAdmin ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavigationBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/learn" element={<LearnDisasters />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <UserDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/emergency-kits" 
              element={
                <PrivateRoute>
                  <EmergencyKits />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/emergency-kits/new" 
              element={
                <PrivateRoute>
                  <EmergencyKitForm />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
