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
import Chatbot from "./components/ChatBot";
import HelpPage from "./components/Pages/HelpPage";

function App() {
  return (
    <Fragment>
      <Navbar />
      <Chatbot />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset" element={<ResetPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/seller" element={<SellerPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route
          path="*"
          element={
            <h1
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "100px",
              }}
            >
              404 not found 🫡
            </h1>
          }
        />
      </Routes>
      <Notification />
    </Fragment>
  );
}

export default App;
