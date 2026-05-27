import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AdminPage } from "./pages/AdminPage";
import { AuthPage } from "./pages/AuthPage";
import { ChatbotPage } from "./pages/ChatbotPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DiseasePage } from "./pages/DiseasePage";
import { LandingPage } from "./pages/LandingPage";
import { SoilPage } from "./pages/SoilPage";
import { WeatherPage } from "./pages/WeatherPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/disease" element={<DiseasePage />} />
        <Route path="/soil" element={<SoilPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
