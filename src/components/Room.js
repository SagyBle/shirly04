import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";


function Room(props) {

  const navigate = useNavigate();

  const joinRoom = async () => {
    props.setIsLoading(true);

    // Check if user had already participated in this specific room.
    // If so, and he's also the original admin, hw would be an admin again.
    // else, he would turn to be regular user.
    const userRef = doc(db, `rooms/room${props.room.roomNumber}/users/${props.user.uid}`)
    const docSnap = await getDoc(userRef);
    
    let data = {}
    // Check if this user is the original admin.
    if (docSnap.exists() && docSnap.data().originalAdmin){
      console.log("commiting join room start original admin");
      data = {
      name: props.user.displayName,
      originalAdmin: true,
      photoURL: props.user.photoURL, 
      isAdmin: true, 
      timestamp: serverTimestamp(),
      uid: props.user.uid,
      }  
    }
    else{
      console.log("commiting join room start regular way");
      data = {
        name: props.user.displayName,
        originalAdmin: false,
        photoURL: props.user.photoURL, 
        isAdmin: false, 
        timestamp: serverTimestamp(),
        uid: props.user.uid,
      }
    }

    // Add/update user.
    await setDoc(doc(db, `rooms/room${props.room.roomNumber}/users/${props.user.uid}`),
    data);
    

    // Enter room.
    navigate("/jam-room/" + props.room.roomNumber);
  };


  return (
    <li>
      <div>
        {props.room && <div>
          <p>{props.room.roomName}</p>
          <p>{props.room.roomNumber}</p>
          <button onClick={joinRoom}>Join!</button>
        </div>}
      </div>
    </li>
  )
}

export default Room
