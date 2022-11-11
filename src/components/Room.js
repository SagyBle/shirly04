import React from 'react'
import { useNavigate } from "react-router-dom";


function Room(props) {

  const navigate = useNavigate();

  const joinRoom = () => {
      console.log("join room number " + props.room.roomNumber);
      navigate("/jam-room/" + props.room.roomNumber);

    }

  return (
    
    <div>
      {props.room && <div>
        <p>{props.room.roomName}</p>
        <p>{props.room.roomNumber}</p>
        <button onClick={joinRoom}>Join!</button>
      </div>}
    </div>
  )
}

export default Room
