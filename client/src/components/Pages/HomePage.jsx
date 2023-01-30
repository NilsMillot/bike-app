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
    navigate("/help2");
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    fetchAllRooms();
  }, [user, loading, navigate, fetchAllRooms]);

  return (
    <div className="home__container">
      <div>
        <h1>Liste des salons ouverts</h1>
        <ul className={"list_rooms"}>
          {allRooms.map((room, index) => (
            <li key={index}>
              <button
                className={"home__cta"}
                onClick={() => {
                  navigate("/chat?room=" + room.name);
                }}
                style={{ marginRight: "10px" }}
              >
                {room.name}
              </button>
            </li>
          ))}
        </ul>
        <button className={"home__cta"} onClick={handleSubmitAskSeller}>
          DEMANDE CONSEILLER
        </button>
      </div>
    </div>
  );
};

export default HomePage;
