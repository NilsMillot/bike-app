import React, { useEffect, useState, useRef, useContext} from 'react'
import { SocketContext } from '../context/socket'
import ChatBar from './ChatBar'
import ChatBody from './ChatBody'
import ChatFooter from './ChatFooter'

const ChatPage = () => { 
  const [messages, setMessages] = useState([])
  const [typingStatus, setTypingStatus] = useState("")
  const lastMessageRef = useRef(null);
  const socket = useContext(SocketContext);

  useEffect(()=> {
    socket.on("messageResponse", data => setMessages([...messages, data]))

    return () => {
      socket.off("messageResponse")
    }
  }, [socket, messages])

  useEffect(()=> {
    socket.on("typingResponse", data => setTypingStatus(data))

    return () => {
      socket.off("typingResponse")
    }
  }, [socket])

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  return (
    <div className="chat">
      <ChatBar />
      <div className='chat__main'>
        <ChatBody messages={messages} typingStatus={typingStatus} lastMessageRef={lastMessageRef} />
        <ChatFooter />
      </div>
    </div>
  )
}

export default ChatPage