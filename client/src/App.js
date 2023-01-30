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

// IF WE WANT TO USE PROVIDER
// import { socket, SocketContext } from "./context/socket";
// Print errors if there is some
// socket.on("connect_error", (err) => {
//   console.log(err);
// });

function App() {
  return (
    <Fragment>
      <Navbar />
      {/* <SocketContext.Provider value={socket}> */}
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
      {/* </SocketContext.Provider> */}
      <Notification />
    </Fragment>
  );
}

export default App;
