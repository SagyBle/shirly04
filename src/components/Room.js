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
        </div>
        {/* 1end users images */}

        {/* 1start room name and description*/}
        <div>
            {!isEntranceAllowed && <p style={{ color: "red" }}>LOCKED</p>}
            <div className="room-name">
              <h5>{props.room.roomName}</h5>
            </div>
            <div className="room-description">
              <p>{props.room.roomDescription}</p>
            </div>
            
            
        </div>
        {/* 1end room name and description */}

        {/* 1start room time */}
        <div>
            
        </div>
        {/* 1end room time */}

        {/* 1start capacity */}
        <div className="room-curr-situation">
          <div className="room-capacity">
              <h3>{users.length} / {props.room.roomMaxParticipantsQuantity}</h3>
          </div>
          <div className="join-now-button">
            <JoinRoom setIsLoading={props.setIsLoading} room={props.room} />
          </div>
          <div className="room-playing-now">
            <p>{props.room.currPlayingNow}</p>
          </div>
        </div>
        {/* 1end capcity */}

        
      </div>}
      {/* 0end total div */}

    </li>
  )
}

export default Room