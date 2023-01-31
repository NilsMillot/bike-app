import { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { io } from "socket.io-client";
import { auth, db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import MessagePanel from "../MessagePanel";

const socket = io("ws://localhost:4000/seller", { autoConnect: false });

const User = ({ user, selected, onSelect }) => {
  const onClick = () => {
    onSelect();
  };

  return (
    <div className={`user ${selected ? "selected" : ""}`} onClick={onClick}>
      <div className="description">
        <div className="name">{user?.name || user?.email}</div>
      </div>
    </div>
  );
};

const Chat = () => {
  const [user, loading] = useAuthState(auth);
  const [currentUser, setCurrentUser] = useState(null);

  const [sellers, setSellers] = useState([]);
  const [isOnlineSeller, setIsOnlineSeller] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const getCurrentUserFromFirebase = useCallback(async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setCurrentUser(doc.data());
    });
  }, [user]);

  const setCurrentUserIsAvailable = useCallback(
    async (isOnlineSeller) => {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      let docId = "";
      querySnapshot.forEach((doc) => {
        docId = doc.id;
      });
      const docRef = doc(db, "users", docId);
      await updateDoc(docRef, {
        isAvailable: isOnlineSeller,
      });
    },
    [user]
  );

  const setCurrentUserSocketId = useCallback(
    async (socketId) => {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      let docId = "";
      querySnapshot.forEach((doc) => {
        docId = doc.id;
      });
      const docRef = doc(db, "users", docId);
      await updateDoc(docRef, {
        socketId: socketId,
      });
    },
    [user]
  );

  const getAvailableSellersFromFirebase = useCallback(async () => {
    const q = query(
      collection(db, "users"),
      where("roles", "array-contains", "seller"),
      where("isAvailable", "==", true)
    );
    const querySnapshot = await getDocs(q);
    const sellers = [];
    querySnapshot.forEach((doc) => {
      sellers.push(doc.data());
    });
    setSellers(sellers);
  }, []);

  useEffect(() => {
    if (currentUser?.roles?.includes("seller")) {
      setIsOnlineSeller(currentUser.isAvailable);
      socket.connect();
    }
  }, [currentUser, setCurrentUserIsAvailable]);

  const [socketId, setSocketId] = useState(null);
  socket.on("connect", () => {
    setSocketId(socket.id); // x8WIv7-mJelg7on_ALbx
  });

  useEffect(() => {
    if (socketId && user) {
      setCurrentUserSocketId(socketId);
    }
  }, [socketId, setCurrentUserSocketId, user]);

  useEffect(() => {
    if (user) {
      getCurrentUserFromFirebase();
      getAvailableSellersFromFirebase();
    }
  }, [user, getCurrentUserFromFirebase, getAvailableSellersFromFirebase]);

  const handleSwitchOnline = () => {
    setIsOnlineSeller(!isOnlineSeller);
    if (!isOnlineSeller) {
      setCurrentUserIsAvailable(true);
    } else {
      setCurrentUserIsAvailable(false);
    }
  };

  const onSelectUser = (user) => {
    setSelectedUser(user);
    // user.hasNewMessages = false
  };

  console.log(selectedUser);
  useEffect(() => {
    console.log("sellers", sellers);
  }, [sellers]);

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Not logged in</div>;

  if (currentUser?.roles?.includes("seller")) {
    return (
      <div style={{ height: "94vh", display: "flex", position: "relative" }}>
        {isOnlineSeller ? (
          <>
            <div className="help-left-panel">
              {/* TODO: List of demands */}Liste des users à aider
            </div>
            {/* {selectedUser ? (
              <MessagePanel user={selectedUser} onInput={onMessage} />
            ) : null} */}
            <button
              style={{ position: "absolute", right: "5px", top: "5px" }}
              className="home__cta"
              onClick={handleSwitchOnline}
            >
              offline
            </button>
          </>
        ) : (
          <div
            style={{
              margin: "auto",
              height: "fit-content",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span>Passez en ligne pour vous rendre disponible!</span>
            <button className="home__cta" onClick={handleSwitchOnline}>
              online
            </button>
          </div>
        )}
      </div>
    );
  }

  if (sellers.length === 0) {
    return <span>Aucun conseiller pour vous aider...</span>;
  }

  const onMessage = (content) => {
    if (selectedUser) {
      socket.emit("privateMessage", {
        content,
        to: selectedUser.socketId,
      });
      setSelectedUser((current) => {
        selectedUser.messages.push({
          content,
          fromSelf: true,
        });
        return {
          ...current,
          messages: selectedUser.messages,
        };
      });
    }
  };

  // socket on privateMessage
  socket.on("privateMessage", ({ user, text }) => {
    console.log("privateMessage", user, text);
  });

  return (
    <div style={{ height: "94vh", display: "flex" }}>
      <div className="help-left-panel">
        {sellers?.map((seller) => (
          <User
            key={seller.uid}
            user={seller}
            selected={selectedUser === seller}
            onSelect={() => onSelectUser(seller)}
          />
        ))}
      </div>

      {selectedUser ? (
        <MessagePanel user={selectedUser} onInput={onMessage} />
      ) : null}
    </div>
  );
};

export default Chat;
