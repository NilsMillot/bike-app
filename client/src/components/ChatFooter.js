import React, {useState} from 'react'

const ChatFooter = ({socket}) => {
    const [message, setMessage] = useState("")
    const handleTyping = () => socket.emit("typing",`${localStorage.getItem("username")} écrit un message...`)

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (!localStorage.getItem("username")) {
          alert('Qui est tu? Quittes ce chat et entre un nom d\'utilisateur');
        }
        if(message.trim() && localStorage.getItem("username")) {
        socket.emit("message", 
            {
            text: message, 
            name: localStorage.getItem("username"), 
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