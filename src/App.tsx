import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import Home from './pages/Home';
import Aprender from './pages/Aprender';

const Kit = lazy(() => import('./pages/Kit'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Mapa = lazy(() => import('./pages/Mapa'));
const Monitoramento = lazy(() => import('./pages/Monitoramento'));
const Contato = lazy(() => import('./pages/Contato'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

function App() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="text-center mt-5">Carregando...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aprender" element={<Aprender />} />
          <Route path="/kit" element={<Kit />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/monitoramento" element={<Monitoramento />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}

export default App; 