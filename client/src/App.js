import { Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/Pages/HomePage";
import ChatPage from "./components/Pages/ChatPage";
import LoginPage from "./components/Pages/LoginPage";
import ResetPage from "./components/Pages/ResetPage";
import DashboardPage from "./components/Pages/DashboardPage";
import RegisterPage from "./components/Pages/RegisterPage";
import Navbar from "./components/Navbar";
import AdminPage from "./components/Pages/AdminPage";
import SellerPage from "./components/Pages/SellerPage";
import Notification from "./components/Notification";
import HelpPage2 from "./components/Pages/HelpPage2";
import Chatbot from "./components/ChatBot";

function App() {
  return (
    <Fragment>
      <Navbar />
      <Chatbot/>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset" element={<ResetPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/seller" element={<SellerPage />} />
        <Route path="/help2" element={<HelpPage2 />} />
      </Routes>
      <Notification />
    </Fragment>
  );
}

export default App;
