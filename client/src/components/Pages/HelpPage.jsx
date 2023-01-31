import { useEffect } from "react";
import Chat from "../PrivateChat/Chat";
import socket from "../../socket";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function HelpPage() {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      socket.auth = { username: user.name || user.email };
      socket.connect();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not logged in</div>;
  }

  return <Chat />;
}

export default HelpPage;
