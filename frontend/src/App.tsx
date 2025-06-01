import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './components/Layout/MainLayout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Monitoring } from './pages/Monitoring';
import { ProtectedRoute } from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/monitoramento"
          element={
            <ProtectedRoute requireAdmin>
              <MainLayout>
                <Monitoring />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
