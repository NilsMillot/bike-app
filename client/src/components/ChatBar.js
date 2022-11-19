import React, {useState, useEffect, useContext} from 'react'
import { SocketContext } from '../context/socket';

const ChatBar = () => {
    const socket = useContext(SocketContext);
    const [users, setUsers] = useState([])

    useEffect(()=> {
        socket.on("newUserResponse", data => setUsers(data))

        // 👇️ return a function to clean up the effect
        return () => {
            socket.off("newUserResponse")
        }
    }, [socket, users])

  return (
    <div className='chat__sidebar'>
        <h2>Chat ouvert</h2>
        <div>
            <h4  className='chat__header'>Membres présents ici</h4>
            <div className='chat__users'>
                {users.map(user => <p key={user.socketID}>{user.userName}</p>)}
            </div>
        </div>
  </div>
  )
}

export default ChatBar