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
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/Home.css";
import "./styles/Navbar.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Alerts from "./pages/Alerts";

const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return null;
  return isAdmin ? children : <Navigate to="/dashboard" replace />;
};

const DashboardRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return null;
  return isAdmin ? <Navigate to="/admin" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          style={{
            fontSize: "14px",
            fontFamily: "'Poppins', sans-serif",
          }}
          toastStyle={{
            background: "rgba(33, 37, 41, 0.95)",
            color: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
          progressStyle={{
            background: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
          }}
        />
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
            <Route
              path="/alerts"
              element={
                <PrivateRoute>
                  <Alerts />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
