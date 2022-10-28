import React, { useEffect } from 'react'
import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { db, auth } from '../firebase';
import { doc, setDoc, collection, getDocs, getFirestore } from 'firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth'





function GetARoom() {

  const [roomNumber, setRoomNumber] = useState('');
  const [user] = useAuthState(auth);

  // const [roomExists, setroomExists] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(()=>{
    setShowMessage(false);
  },[roomNumber])


  // const history = useHistory();
  const navigate = useNavigate();


  const handleRoomNumberChange = (e) => {
        setShowMessage(false)
        setRoomNumber(e.target.value)
        
  }

  const createNewRoomURLAndGetInside = async() => {
    const rid = Date.now();

    //creating new room in firestore
    let roomStr = "room" + rid;
    await setDoc(doc(db, "rooms", roomStr), {
      roomNumber: rid,
      numOfUsers: 1,
      users: [user.photoURL]
    });
    
    navigate("/jam-room/" + rid);
  }

  const isRoomExists = async (id) => {
    console.log("launch is room exists");
    const colRef = collection(db, 'rooms');
    const rooms = await getDocs(colRef);

    let roomExists = false;

    rooms.forEach((room)=> 
      (room.data().roomNumber == parseInt(roomNumber)) ? roomExists = true : null
    )
    // roomExists ? null :  setShowMessage(true)
    if (roomExists) {
      navigate("/jam-room/" + roomNumber);
    }
    else {
      setShowMessage(true)
    }

  }


  return (
    <div>
      <h1>Get a Room</h1>

      
        <button onClick={createNewRoomURLAndGetInside}>
          New Room
        </button>

        <form>
          <input
            onChange={handleRoomNumberChange}
            type="text"
            placeholder="Enter Room Number"
            value={roomNumber}
          />
        </form>
        {/* <a href ={'/jam-room/' + roomNumber}>
          <button type='submit'>Join!</button>
        </a> */}

        {/* check if the room exists */}
        {showMessage && <p style={{color: "red"}}>we can't find this room... try again?</p>}
        <button onClick={()=>isRoomExists()}>Join!</button>

    </div>
  )
}

export default GetARoom
