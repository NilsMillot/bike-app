import React, {useContext, useState} from 'react'
import { SocketContext } from '../context/socket';

const ChatFooter = () => {
    const [message, setMessage] = useState("")
    const socket = useContext(SocketContext);
    const handleTyping = () => socket.emit("typing",`${localStorage.getItem("userName")} écrit un message...`)

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (!localStorage.getItem("userName")) {
          alert('Qui est tu? Quittes ce chat et entre un nom d\'utilisateur');
        }
        if(message.trim() && localStorage.getItem("userName")) {
        socket.emit("message", 
            {
            text: message, 
            name: localStorage.getItem("userName"), 
            id: `${socket.id}${Math.random()}`,
            socketID: socket.id
            }
        )
        }
        setMessage("")
    }
  return (
    <div className='chat__footer'>
        <form className='form' onSubmit={handleSendMessage}>
          <input 
            type="text" 
            placeholder='Ecris ton message' 
            className='message' 
            value={message} 
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleTyping}
            />
            <button className="sendBtn">ENVOYER</button>
        </form>
     </div>
  )
}

export default ChatFooter