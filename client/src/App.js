import { Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import ChatPage from "./components/ChatPage";
import LoginPage from "./components/LoginPage";
import ResetPage from "./components/ResetPage";
import DashboardPage from "./components/DashboardPage";
import RegisterPage from "./components/RegisterPage";
import Navbar from "./components/Navbar";
import { socket, SocketContext } from "./context/socket";
import AdminPage from "./components/AdminPage";
import SellerPage from "./components/SellerPage";
import Notification from "./components/Notification";

// Print errors if there is some
socket.on("connect_error", (err) => {
  console.log(err instanceof Error); // true
});

function App() {
  return (
    <Fragment>
      <Navbar />
      <SocketContext.Provider value={socket}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset" element={<ResetPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/seller" element={<SellerPage />} />
        </Routes>
      </SocketContext.Provider>
      <Notification />
    </Fragment>
  );
}

export default App;
