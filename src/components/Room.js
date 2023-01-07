import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

import './styles/Room.css'
import LockedIcon from './styles/icons/locked.png'


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
      {props.room &&
      // 0start total div
      <div className="room-card">

        {/* 1start users images*/}
        <div className="room-card-top">
          <div className="avatar-group">
            {users.map((user)=>{
              return(
                <div className="avatar">
                  <img src={user.photoURL} alt="" />
                </div>
              )
            })}
            
            <div className="hidden-avatars">
              +10
            </div>
          </div>
          <div className="lock-icon-div">
            {isEntranceAllowed && <img className="lock-icon" src={LockedIcon} alt="" />}
          </div>
        </div>
        {/* 1end users images */}

        {/* 1start room name and description*/}
        <div className="room-headers">
            
            <div className="room-name">
              <h5 className="room-name-letters">{props.room.roomName}</h5>
            </div>
            <div className="room-description">
              <p className="room-description-letters">{props.room.roomDescription}</p>
            </div>  
        </div>
        {/* 1end room name and description */}

        {/* 1start room time */}
        <div>
            
        </div>
        {/* 1end room time */}

        {/* try 1start capacity */}
        
        <div className="row g-0">
          <div className="col-4">
             <div className="room-capacity">
                <p className="center room-capacity-letters">{users.length} / {props.room.roomMaxParticipantsQuantity}</p>
             </div>
             
          </div>
          <div className="col-4">
             <div className="pink center">
              <JoinRoom setIsLoading={props.setIsLoading} room={props.room} />
             </div>
          </div>
          <div className="col-4">
             <div className="center room-playing-now-letters">{props.room.currPlayingNow}</div>
          </div>
        </div>

        {/* try 1end capcity */}

        
      </div>}
      {/* 0end total div */}

    </li>
  )
}

export default Room