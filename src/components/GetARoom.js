import React, { useEffect } from "react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { db, auth } from "../firebase";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  getDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Room from "./Room";
import { useSyncExternalStore } from "react";
import Loading from "./Loading";

function GetARoom(props) {

  const [roomNumber, setRoomNumber] = useState("");
  const [roomName, setRoomName] = useState("");

  const [rooms, setRooms] = useState([]);

  const [user] = useAuthState(auth);
  const [showMessage, setShowMessage] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setShowMessage(false);
  }, [roomNumber]);

  // add listener to add people, if flag is down, redirect to page that claims that
  // room is closed now by admin order!

  const handleRoomNumberChange = (e) => {
    setShowMessage(false);
    setRoomNumber(e.target.value);
  };

  const handleRoomNameChange = (e) => {
    setRoomName(e.target.value);
  };

  // Creating New Room
  const createNewRoomURLAndGetInside = async () => {
    // Room id is the specific room creation time.
    props.setIsLoading(true);

    const rid = Date.now();

    let roomStr = "room" + rid;
    await setDoc(doc(db, "rooms", roomStr), {
      roomNumber: rid,
      roomName: roomName,
      showLyrics: true,
      addRequests: true,
      enterUsers: true,
    });
    const data = { 
      name: user.displayName,
      photoURL: user.photoURL, 
      isAdmin: true, 
      timestamp: serverTimestamp(),
      uid: props.uid,
      // Room creator will be remember as room creator.
      originalAdmin: true,
    }
    const docRef = await setDoc(doc(db, `rooms/room${rid}/users/${props.uid}`),data);
    
    setShowCreateForm(false);
    // Move to the room, by navigation to the mutual url.
    navigate("/jam-room/" + rid)
  };

  // Enetering Existing Room

  // if room exists, enter it. else, show an error message.
  const isRoomExists = async (id) => {
    props.setIsLoading(true);
    const colRef = collection(db, "rooms");
    const rooms = await getDocs(colRef);
    // check in all rooms, if one matches given id by user.
    let roomExists = false;
    rooms.forEach((room) =>
      room.data().roomNumber === parseInt(roomNumber)
        ? (roomExists = true)
        : null
    );

    if (roomExists) {
      const roomRef = doc(db, `rooms`, `room${id}`);
      const roomSnap = await getDoc(roomRef);
      joinRoom(id);
    } else {
      props.setIsLoading(false);
      setShowMessage(true);
    }
  };

  const joinRoom = async (id) => {

    // Check if user had already participated in this specific room.
    // If so, and he's also the original admin, hw would be an admin again.
    // else, he would turn to be regular user.
    const userRef = doc(db, `rooms/room${roomNumber}/users/${props.uid}`)
    const docSnap = await getDoc(userRef);
    
    let data = {}
    // Check if this user is the original admin.
    if (docSnap.exists() && docSnap.data().originalAdmin){
      console.log("commiting join room start original admin");
      data = {
      name: user.displayName,
      originalAdmin: true,
      photoURL: user.photoURL, 
      isAdmin: true, 
      timestamp: serverTimestamp(),
      uid: props.uid,
      }  
    }
    else{
      console.log("commiting join room start regular way");
      data = {
        name: user.displayName,
        originalAdmin: false,
        photoURL: user.photoURL, 
        isAdmin: false, 
        timestamp: serverTimestamp(),
        uid: props.uid,
      }
    }

    // Add/update user.
    await setDoc(doc(db, `rooms/room${roomNumber}/users/${props.uid}`),
    data);
    

    // Enter room.
    navigate("/jam-room/" + roomNumber);
  };

  // Get cuurent active rooms
  useEffect(() => {
    const q = query(
      collection(db, `rooms`),
      orderBy("roomNumber")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let rooms = [];
      querySnapshot.forEach((doc) => {
        rooms.push({ ...doc.data(), id: doc.id });
      });
      setRooms(rooms);
    });
    return () => unsubscribe();
  }, []);

  const tryRooms = () => {
    console.log("this is rooms:");
    console.log(rooms);
  }


  return (
    <div>
      <div>
        <h1>Get a Room</h1>
        {props.isLoading && <Loading/>}
      <div>
        {showCreateForm ? 
          <div>
          <form>
            <input
              onChange={handleRoomNameChange}
              type="text"
              placeholder="Enter Room Name"
              value={roomName}
            > 
            </input>
          </form>
          <button onClick={createNewRoomURLAndGetInside}>Create!</button>
        </div> : 
          <button onClick={()=>setShowCreateForm(true)}>Create New Room</button>}
      </div>
      <div>
        {showJoinForm ? 
          <div>
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
        </div> : 
          <button onClick={()=>setShowJoinForm(true)}>Join A Room!</button>
        }
        
        
        

      </div>
      </div>
      <div>
        <h1>Current Active Rooms:</h1>
          {rooms ?
          rooms.map((room) => (
            <Room room={room}/>
          )) : <Loading/>}
      </div>
    </div>
  );
}

export default GetARoom;
