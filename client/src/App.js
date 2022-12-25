import { Routes, Route} from "react-router-dom"
import Home from "./components/Home"
import ChatPage from "./components/ChatPage";
import Login from "./components/Login";
import Reset from "./components/Reset";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import { socket, SocketContext } from "./context/socket";

// Print erros if there is some
socket.on("connect_error", (err) => {
  console.log(err instanceof Error); // true
});

function App() {
  console.log(process.env.REACT_APP_API_KEY);
  return (

      <>
        <Navbar/> 
        <SocketContext.Provider value={socket}>
          <Routes>
              <Route path="/login" element={<Login/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/reset" element={<Reset/>}/>
              <Route path="/" element={<Home />}/>
              <Route path="/chat" element={<ChatPage />}/>
              <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </SocketContext.Provider>
      </>
    
 
   
  );
}

export default App;
