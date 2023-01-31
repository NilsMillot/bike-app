import { useCallback, useEffect, useState } from "react";
import Chat from "../PrivateChat/Chat";
import socket from "../../socket";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

function HelpPage() {
  const [user, loading] = useAuthState(auth);

  const [currentUser, setCurrentUser] = useState(null);

  const getCurrentUserFromFirebase = useCallback(async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setCurrentUser(doc.data());
    });
  }, [user]);

  useEffect(() => {
    if (user) {
      getCurrentUserFromFirebase();
    }
  }, [user, getCurrentUserFromFirebase]);

  useEffect(() => {
    if (currentUser) {
      socket.auth = {
        username: currentUser.name || currentUser.email,
        isSeller: Boolean(currentUser.roles?.includes("seller")),
      };
      socket.connect();
    }
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not logged in</div>;
  }

  return <Chat />;
}

export default HelpPage;
