import React, { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import ChatBar from "./ChatBar";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import { auth, db } from "../firebase";
import io from "socket.io-client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { collection, getDocs, query } from "firebase/firestore";

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState("");
  const lastMessageRef = useRef(null);
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const name = user?.name || user?.email;
  const room = searchParams.get("room");
  const [currentRoomDataFromServer, setCurrentRoomDataFromServer] = useState(
    []
  );
  const [autorisedRooms, setAutorisedRooms] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (loading) return;
    if (room && name && socket) {
      socket.on("message", (message) => {
        setMessages((messages) => [...messages, message]);
      });
    }
  }, [name, room, loading, socket]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchRooms = async () => {
    const q = query(collection(db, "rooms"));
    const querySnapshot = await getDocs(q);
    let arr = [];
    querySnapshot.forEach((doc) => {
      arr.push(doc.data());
    });
    setAutorisedRooms(arr);
    return arr;
  };

  useEffect(() => {
    let so = null;
    if (loading) return;
    if (name && room) {
      so = io("ws://localhost:4000");
      setSocket(so);

      fetchRooms().then((data) => {
        let maxUsers = 0;
        data.forEach((autorisedroom) => {
          if (autorisedroom.name === room) {
            maxUsers = autorisedroom.maxUsers;
          }
        });
        // 👇 Join the room
        so.emit("join", { name, room, maxUsers }, (error) => {
          if (error) {
            if (error === "Too many users in this room") {
              navigate("/");
            }
            alert(error);
          }
        });
        // 👇 Get all users in this room
        so.emit("getRoomConnections");
        so.on("roomData", (data) => {
          setCurrentRoomDataFromServer(data);
        });
        so.on("typingResponse", (data) => setTypingStatus(data));
      });
    }

    // 👇️ Clean up
    return () => {
      if (so) {
        so.disconnect();
      }
    };
  }, [name, room, loading, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  if (!room) {
    return <div>Not autorised</div>;
  }

  if (!autorisedRooms.find((room) => room.name === searchParams.get("room"))) {
    return <div>Not autorised</div>;
  }

  return (
    <div className="chat">
      <ChatBar roomData={currentRoomDataFromServer} />
      <div className="chat__main">
        <ChatBody
          messages={messages}
          typingStatus={typingStatus}
          lastMessageRef={lastMessageRef}
        />
        <ChatFooter socket={socket} />
      </div>
    </div>
  );
};

export default ChatPage;
