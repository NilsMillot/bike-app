import React, {useContext, useEffect, useState} from 'react'
import { useAuthState } from "react-firebase-hooks/auth";
import {useNavigate} from "react-router-dom"
import { SocketContext } from '../context/socket'
import { query, collection, getDocs, where } from "firebase/firestore";
import { auth, db } from "../firebase";

const Home = () => {
    const navigate = useNavigate()
    const [userName, setUserName] = useState("")
    const [isButtonCallSalesConsultantDisabled, setIsButtonCallSalesConsultantDisabled] = useState(true)
    const [isButtonOpenChatDisabled, setIsButtonOpenChatDisabled] = useState(true)
    const socket = useContext(SocketContext);
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");

    const handleSubmitOpenChat = (e) => {
        e.preventDefault()
        if(userName.length > 5) {
          localStorage.setItem("userName", userName)
          socket.emit("newUser", {userName, socketID: socket.id})
          navigate("/chat")
        }
    }

    const handleSubmitAskSeller = (e) => {
        e.preventDefault()
        localStorage.setItem("userName", userName)
        socket.emit("newUser", {userName, socketID: socket.id})
        navigate("/seller")
    }

    const fetchUserName = async () => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        setName(data.name);
      } catch (err) {
        console.error(err);
        alert("An error occured while fetching user data");
      }
    };

    useEffect(() => {
      if(userName.length > 5) {
        setIsButtonOpenChatDisabled(false)
      } else {
        setIsButtonOpenChatDisabled(true)
      }
    }, [userName])

    useEffect(() => {
      if (loading) return;
      if (!user) return navigate("/login");
      fetchUserName();
    }, [user, loading]);

  return (
    <div className="home__container">
      <h2>Comment t'appelles-tu? (min 6 char)</h2>
      <input type="text" 
        minLength={6} 
        name="username" 
        id='username'
        className='username__input' 
        value={userName} 
        onChange={e => setUserName(e.target.value)}
      />
      <div>
        <button className={isButtonOpenChatDisabled ? 'home__cta__disabled' : 'home__cta'} disabled={isButtonOpenChatDisabled} onClick={handleSubmitOpenChat} style={{marginRight: '10px'}}>CHAT OUVERT</button>
        <button className={isButtonCallSalesConsultantDisabled ? 'home__cta__disabled' : 'home__cta'} disabled={isButtonCallSalesConsultantDisabled} onClick={handleSubmitAskSeller}>DEMANDE CONSEILLER</button>
      </div>
    </div>
  )
}

export default Home