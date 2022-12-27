import React, {useContext, useEffect, useState} from 'react'
import { useAuthState } from "react-firebase-hooks/auth";
import {useNavigate} from "react-router-dom"
import { SocketContext } from '../context/socket'
import { query, collection, getDocs, where } from "firebase/firestore";
import { auth, db } from "../firebase";

const Home = () => {
    const navigate = useNavigate()
    const [isButtonCallSalesConsultantDisabled, setIsButtonCallSalesConsultantDisabled] = useState(true)
    const socket = useContext(SocketContext);
    const [user, loading] = useAuthState(auth);
    const [username, setUsername] = useState("")

    const handleSubmitOpenChat = (e) => {
        e.preventDefault()
        
          socket.emit("newUser", {username, socketID: socket.id})
          navigate("/chat")
        
    }

    const handleSubmitAskSeller = (e) => {
        e.preventDefault()
        socket.emit("newUser", {username, socketID: socket.id})
        navigate("/seller")
    }

    const fetchUserName = async () => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        setUsername(data.name);
      } catch (err) {
        console.error(err);
        alert("An error occured while fetching user data");
      }
    };

    useEffect(() => {
      if (loading) return;
      if (!user) return navigate("/login");
      fetchUserName();
    }, [user, loading]);

  return (
    <div className="home__container">
      <div>
        <button className={'home__cta'} onClick={handleSubmitOpenChat} style={{marginRight: '10px'}}>CHAT OUVERT</button>
        <button className={isButtonCallSalesConsultantDisabled ? 'home__cta__disabled' : 'home__cta'} disabled={isButtonCallSalesConsultantDisabled} onClick={handleSubmitAskSeller}>DEMANDE CONSEILLER</button>
      </div>
    </div>
  )
}

export default Home