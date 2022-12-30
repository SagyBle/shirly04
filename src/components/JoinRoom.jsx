import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../firebase";
import Swal from "sweetalert2";  

import { useNavigate } from "react-router-dom";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";

// fixed rid, uid

// user entering 
// room we want to enter to
function JoinRoom(props) {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const showPinCode = props.showPinCode;


  const joinRoom1 = async () => {
    props.setIsLoading(true);
    console.log("got in join room");
    const uid = user.uid;
    let rid = null;
    if (props.room) {
      rid = props.room.roomNumber;   
    }
    else if (props.roomNumber){
      rid = props.roomNumber;
    }
    else {
      throw new Error("problem with props.roomNumber in JoinRoom component sagy")
    }

    console.log(uid);
    console.log(rid);

    let isRoomExist = false;
    let isExist = false;
    let isAdmin = false;
    
    // check if the room exsits (even if its from the room card from get a room)
    const roomRef = doc(db, `rooms/room${rid}`)
    const docSnapRoom = await getDoc(roomRef);
    // if room exists
    if (isRoomExist = docSnapRoom.exists()){
      console.log("got in room exists");

      // check if the user that trying to get in is admin.
      const userRef = doc(db, `rooms/room${rid}/users/${uid}`)
      const docSnapUser = await getDoc(userRef);
      // check if user exits
      if (isExist = docSnapUser.exists()){
        console.log("got in user exists in users room");

        // check if admin
        if (isAdmin = docSnapUser.data().isAdmin){
          console.log("got in isAdmin ");
          //get in as admin
          joinRoomAsAdmin(rid, uid);
          console.log("get in room as admin: " + isAdmin);
        }
        else {
          joinRoomAsUser(rid, uid, isExist, docSnapRoom)
        }
      }
      else {
          joinRoomAsUser(rid, uid, isExist, docSnapRoom)
      } 
    }
    // room doesnt exists
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })

    }
    

    props.setIsLoading(false);    
    
  }

  const joinRoomAsAdmin = async (rid, uid) => {
    
    const data = {
      name: user.displayName,
      originalAdmin: true,
      photoURL: user.photoURL, 
      isAdmin: true, 
      timestamp: serverTimestamp(),
      uid: user.uid,
      }
      // Add/update user.
      await setDoc(doc(db, `rooms/room${rid}/users/${uid}`),
      data);

      // get in the room
      navigate(`/jam-room/${rid}`);
  }

  const joinRoomAsUser = async (rid, uid, isExist, docSnapRoom) => {
    console.log("got into joinRoomAsUser");
    // check if room entrance is disabled
    if (docSnapRoom.data().isEntranceAllowed) {
      // check if user is not banned from room
      let bannedUsersArray = docSnapRoom.data().bannedUsersA
      let userIsBanned = false
      if (bannedUsersArray) {
        userIsBanned = bannedUsersArray.includes(uid)
      }
      console.log("user " + uid + "is banned: " + userIsBanned);
      if (!userIsBanned) {
        let data = {
        name: user.displayName,
        originalAdmin: false,
        photoURL: user.photoURL, 
        isAdmin: false, 
        timestamp: serverTimestamp(),
        uid: user.uid,
        }
        await setDoc(doc(db, `rooms/room${rid}/users/${uid}`),
        data);

        navigate("/jam-room/" + rid);
      }
      
      // user is banned
      // setshowbannedmessage true
      //loading false
      else {
        props.setIsLoading(false);
        Swal.fire({
        title: 'שובב אחד',
        text: 'נראה שהמנהל חסם אותך',
        icon: 'question',
        confirmButtonText: 'אנטישמי',
        cancelButtonText: 'הוא צודק',
        showCancelButton: true,
        showCloseButton: true
      })
        
      }
    }
    else {
      props.setIsLoading(false);
      alert("Access to this room is currently disabled");
      
    }

  }

  return (
    <div>
      <div>
        <button onClick={joinRoom1}>הצטרף כעת</button>
      </div>
    </div>
  )
}

export default JoinRoom