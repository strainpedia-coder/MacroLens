import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './store/UserContext';
import { MealProvider } from './store/MealContext';
import { WaterProvider } from './store/WaterContext';
import { isOnboardingDone } from './utils/storage';
import BottomNav from './components/BottomNav';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Scan from './pages/Scan';
import Result from './pages/Result';
import Edit from './pages/Edit';
import History from './pages/History';
import Profile from './pages/Profile';

function AppRoutes() {
  const onboardingDone = isOnboardingDone();

  return (
    <>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={onboardingDone ? <Home /> : <Navigate to="/onboarding" replace />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/result" element={<Result />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <MealProvider>
          <WaterProvider>
            <AppRoutes />
          </WaterProvider>
        </MealProvider>
      </UserProvider>
    </BrowserRouter>
  );
}
