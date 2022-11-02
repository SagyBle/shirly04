import React, { useEffect } from "react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { db, auth } from "../firebase";
import {
  doc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  getDoc,
  addDoc,
  getFirestore,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
} from "firebase/firestore";


import { useAuthState } from "react-firebase-hooks/auth";

function GetARoom() {
  const [roomNumber, setRoomNumber] = useState("");
  const [user] = useAuthState(auth);

  // const [roomExists, setroomExists] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    setShowMessage(false);
  }, [roomNumber]);

  // const history = useHistory();
  const navigate = useNavigate();

  const handleRoomNumberChange = (e) => {
    setShowMessage(false);
    setRoomNumber(e.target.value);
  };
  // New Room
  const createNewRoomURLAndGetInside = async () => {
    const rid = Date.now();

    //creating new room in firestore
    let roomStr = "room" + rid;

    await setDoc(doc(db, "rooms", roomStr), {
      roomNumber: rid,
    });

    // adding the user who created the room as adimn
    const docRef = await addDoc(collection(db, `rooms/room${rid}/users`),
     { name: user.displayName, photoURL: user.photoURL, isAdmin: true, timestamp: serverTimestamp(),
    });
    console.log("user from create written with ID: ", docRef.id);

    navigate("/jam-room/" + rid);
    console.log("this is rid from create");
    console.log(rid);
  };

  // Existing Room
  const isRoomExists = async (id) => {
    console.log("launch is room exists");
    const colRef = collection(db, "rooms");
    const rooms = await getDocs(colRef);

    let roomExists = false;

    rooms.forEach((room) =>
      room.data().roomNumber == parseInt(roomNumber)
        ? (roomExists = true)
        : null
    );

    if (roomExists) {
      const roomRef = doc(db, `rooms`, `room${id}`);
      const roomSnap = await getDoc(roomRef);
      if (roomSnap.exists()) {
        console.log("docSnap:");
        console.log(roomSnap.data());
      } else {
        console.log("room ref wasn't found");
      }
      joinRoom(id);
    } else {
      setShowMessage(true);
    }
  };

  const joinRoom = async (id) => {
    // add name to users
    // const docRef = doc(db, "rooms", `room${id}`);
    // const docSnap = await getDoc(docRef);
    // console.log(docSnap.data());
    // // TODO: Find better solution using arrayUnion
    // let newUsers = [...docSnap.data().users, user.displayName];
    // setDoc(docRef, { users: newUsers });

    // adding the user who joined the room as user
    const docRef = await addDoc(collection(db, `rooms/room${roomNumber}/users`),
    //  { name: user.displayName, photoURL: user.photoURL, isAdmin: false });
    { name: user.displayName, photoURL: user.photoURL, isAdmin: false, timestamp: serverTimestamp(), });
    console.log("user from join written with ID: ", docRef.id);
    
    navigate("/jam-room/" + roomNumber);
    console.log("this is id from join");
    console.log(id);
  };

  return (
    <div>
      <h1>Get a Room</h1>

      <button onClick={createNewRoomURLAndGetInside}>New Room</button>

      <form>
        <input
          onChange={handleRoomNumberChange}
          type="text"
          placeholder="Enter Room Number"
          value={roomNumber}
        />
      </form>

      {/* check if the room exists */}
      {showMessage && (
        <p style={{ color: "red" }}>we can't find this room... try again?</p>
      )}
      <button onClick={() => isRoomExists()}>Join!</button>
    </div>
  );
}

export default GetARoom;
