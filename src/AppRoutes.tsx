// src/AppRoutes.tsx

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/ProfilePage";
import ShowSelectionPage from "./pages/ShowSelectionPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import PaymentPage from "./pages/PaymentPage";
import ShowSessionsPage from "./pages/ShowSessionPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import CreateShowPage from "./pages/CreateShowPage";
import CreateSessionPage from "./pages/CreateSessionPage";

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {isAuthenticated ? (
        <>
          <Route path="/" element={<MainPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/shows" element={<ShowSelectionPage />} />
          <Route path="/shows/:id/payment" element={<PaymentPage />} />
          <Route path="/shows/:showId" element={<ShowSessionsPage />} />
          <Route path="/shows/:showId/seats" element={<SeatSelectionPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/admin/create-show" element={<CreateShowPage />} />
          <Route path="/admin/create-session/:showId" element={<CreateSessionPage />} />


        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}

export default AppRoutes;
