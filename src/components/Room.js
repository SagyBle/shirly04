import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import './styles/Room.css'


import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  onSnapshot,
  query,
  collection,
  orderBy,
} from "firebase/firestore";
import { useState } from "react";
import JoinRoom from "./JoinRoom";

// fixed rid, uid


function Room(props) {

  const rid = props.room.roomNumber;
  const uid = props.user.uid;

  const [users, setUsers] = useState([]);

  const [showBannedMessage, setShowBannedMessage] = useState(false);
  const [isEntranceAllowed, setIsEntranceAllowed] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, `rooms/room${rid}/users`),
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id });
      });
      setUsers(users);
    });
    return () => unsubscribe();
  }, []);


  // TODO: Fix this shit (too much logs because of changes in roomNumber)
  // Get room name, show lyrics, add requests and enter users.
  const unsubRoomName = onSnapshot(doc(db, `rooms/room${rid}`), (doc) => {
      console.log('unsubRoomName');
      setIsEntranceAllowed(doc.data().isEntranceAllowed);
  });

  const navigate = useNavigate();

  const tryUsers = async ()=> {
    console.log(users[0].photoURL);
  }


  return (
    <li>
      <div>
        {props.room && 
        <div>
          <p>{props.room.roomName}</p>
          <p>Participants: {users.length}/{props.room.roomMaxParticipantsQuantity}</p>
          <div className="avatar-group">
            {users.map((user)=>{
              return(
              <div className="avatar">
                <img src={user.photoURL} alt="" />
            </div>)
            })}
          <div className="hidden-avatars">
            +10
          </div>
        </div>
    
          <p>playing now: {props.room.currPlayingNow} </p>
          <p>{rid}</p>
          {!isEntranceAllowed && <p style={{ color: "red" }}>LOCKED</p>}
          {/* {showBannedMessage ?
          <div>
            <p style={{ color: "red" }}>It seems like you are banned from this room</p>
            <button onClick={()=> {setShowBannedMessage(false)}}>OK</button>
          </div> :
          <button onClick={checkIfAllowed}>-Join!-</button>} */}
          <JoinRoom setIsLoading={props.setIsLoading} room={props.room} />
          
          
          {/* <button onClick={roomtryfunc}>roomtryfunc</button> */}
          
        </div>}
        <button onClick={tryUsers}>try users</button>
      </div>
    </li>
  )
}

export default Room