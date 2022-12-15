import React, { useContext, useEffect, useState} from 'react'
import { SocketContext } from '../context/socket'

const CalculPage = () => { 
  const [num1, setNum1] = useState('')
  const [num2, setNum2] = useState('')
  const [calcul, setCalcul] = useState('')
  const socket = useContext(SocketContext);

  useEffect(()=> {
    socket.on("calculResponse", data => setCalcul(data))
  }, [socket, calcul])

  return (
    <div className="calcul">
      <form>
        <input type="number" value={num1} onChange={(e) => setNum1(e.target.value)} />
        +
        <input type="number" value={num2} onChange={(e) => setNum2(e.target.value)} />
        <button type="submit" onClick={(e) => {
          e.preventDefault()
          socket.emit("calcul", {num1, num2})
        }}>Calcul</button>
      </form>
      {calcul && <p>{calcul.number1} + {calcul.number2} vaut {calcul.result}</p>}
    </div>
  )
}

export default CalculPage