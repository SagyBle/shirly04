import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  onSnapshot,
  query,
  collection,
  orderBy,
} from "firebase/firestore";
import { useState } from "react";
import JoinRoom from "./JoinRoom";

import "./styles/Room.css";
import LockedIcon from "./styles/icons/locked.png";

function Room({ room, user, isLoading, setIsLoading }) {
  const rid = room.roomNumber;
  const uid = user.uid;

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
    setIsEntranceAllowed(doc.data().isEntranceAllowed);
  });

  const navigate = useNavigate();

  const tryUsers = async () => {
    console.log(users[0].photoURL);
  };

  return (
    <li className="room-card">
      <div className="room-card-top">
        <div className="avatar-group">
          {users.slice(0, 5).map((user) => {
            return (
              <div className="avatar">
                <img src={user.photoURL} alt="" />
              </div>
            );
          })}
          {users.length > 5 && (
            <div className="hidden-avatars">+{users.length - 5}</div>
          )}
        </div>

        {!isEntranceAllowed && (
          <img className="lock-icon" src={LockedIcon} alt="" />
        )}
      </div>

      <div className="room-card-bottom">
        <div className="room-headers-div">
          <h5 className="room-name">{room.roomName}</h5>
          <span className="room-description">{room.roomDescription}</span>
        </div>

        <div className="room-details-div">
          <span className="room-users-capacity">
            {users.length} / {room.roomMaxParticipantsQuantity}
          </span>

          <JoinRoom setIsLoading={setIsLoading} room={room} />

          <span className="playing-now-span">{room.currPlayingNow}</span>
        </div>
      </div>
    </li>
  );
}

export default Room;
