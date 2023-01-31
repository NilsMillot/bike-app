import React, { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import socketio from "socket.io-client";
import { query, collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";

socketio.connect("ws://localhost:4000");

const HomePage = () => {
  const navigate = useNavigate();
  // const socket = useContext(SocketContext);
  const [user, loading] = useAuthState(auth);

  // Get all rooms available from firebase
  const [allRooms, setAllRooms] = useState([]);
  const fetchAllRooms = useCallback(async () => {
    const q = query(collection(db, "rooms"));
    const doc = await getDocs(q);
    setAllRooms(doc.docs.map((doc) => doc.data()));
  }, []);

  const handleSubmitAskSeller = (e) => {
    e.preventDefault();
    navigate("/help");
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    fetchAllRooms();
  }, [user, loading, navigate, fetchAllRooms]);

  return (
    <div className="home__container">
      <img src="hornet.png" alt="hornet" style={{ width: "360px" }} />
      <div>
        <h1>Liste des salons ouverts</h1>
        <ul className={"list_rooms"}>
          {allRooms.map((room, index) => (
            <li
              key={index}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <button
                className={"home__cta"}
                onClick={() => {
                  navigate("/chat?room=" + room.name);
                }}
              >
                {room.name}
              </button>
            </li>
          ))}
        </ul>
        <button
          className={"home__cta"}
          style={{ width: "100%" }}
          onClick={handleSubmitAskSeller}
        >
          CHAT AVEC UN VENDEUR (ou d'autres passionnés motorisés) !
        </button>
      </div>
    </div>
  );
};

export default HomePage;
