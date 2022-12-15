import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./components/Home"
import ChatPage from "./components/ChatPage";
import CalculPage from "./components/CalculPage";
import { socket, SocketContext } from "./context/socket";

// Print erros if there is some
socket.on("connect_error", (err) => {
  console.log(err instanceof Error); // true
});

function App() {
  return (
    // socket is provided in all our app
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/chat" element={<ChatPage />}></Route>
          <Route path="/calcul" element={<CalculPage />}></Route>
        </Routes>
      </BrowserRouter>
    </SocketContext.Provider>
  );
}

export default App;
