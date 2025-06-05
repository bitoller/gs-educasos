import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavigationBar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmergencyKits from "./pages/EmergencyKits";
import CreateKit from "./pages/CreateKit";
import KitDetails from "./pages/KitDetails";
import EditKit from "./pages/EditKit";
import LearnDisasters from "./pages/LearnDisasters";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Quiz from "./pages/Quiz";
import QuizList from "./pages/QuizList";
import About from "./pages/About";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/Home.css";
import "./styles/Navbar.css";

const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("userRole") === "admin";
  return isAdmin ? children : <Navigate to="/dashboard" replace />;
};

const DashboardRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("userRole") === "admin";
  return isAdmin ? <Navigate to="/admin" replace /> : children;
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
            <Route path="/quizzes" element={<QuizList />} />
            <Route path="/quiz/:id" element={<Quiz />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardRoute>
                    <UserDashboard />
                  </DashboardRoute>
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
                  <CreateKit />
                </PrivateRoute>
              }
            />
            <Route
              path="/emergency-kits/:id"
              element={
                <PrivateRoute>
                  <KitDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/emergency-kits/:id/edit"
              element={
                <PrivateRoute>
                  <EditKit />
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
