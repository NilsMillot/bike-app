import React, {useContext, useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom"
import { SocketContext } from '../context/socket'

const Home = () => {
    const navigate = useNavigate()
    const [userName, setUserName] = useState("")
    const [isButtonCallSalesConsultantDisabled, setIsButtonCallSalesConsultantDisabled] = useState(true)
    const [isButtonOpenChatDisabled, setIsButtonOpenChatDisabled] = useState(true)
    const socket = useContext(SocketContext);

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

    useEffect(() => {
      if(userName.length > 5) {
        setIsButtonOpenChatDisabled(false)
      } else {
        setIsButtonOpenChatDisabled(true)
      }
    }, [userName])

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