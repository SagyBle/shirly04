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
import JoinRoom from "./JoinRoom";
import Toggle from "./Toggle";

// fixed uid


function GetARoom(props) {

  const uid = props.uid;

  const [roomNumber, setRoomNumber] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomMaxParticipantsQuantity, setRoomMaxParticipantsQuantity] = useState("");
  const [queryRoomName, setQueryRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");

  const [toggle, setToggle] = useState(false);


  const [rooms, setRooms] = useState([]);

  const [user] = useAuthState(auth);
  const [showNotFindMessage, setShowNotFindMessage] = useState(false);
  const [showBannedMessage, setShowBannedMessage] = useState(false);
  const [showShortName, setShowShortName] = useState(false);
  const [showEntranceNotAllowed, setShowEntranceNotAllowed] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setShowNotFindMessage(false);
    setShowBannedMessage(false);
  }, [roomNumber]);

  // add listener to add people, if flag is down, redirect to page that claims that
  // room is closed now by admin order!

  const handleRoomNumberChange = (e) => {
    setShowNotFindMessage(false);
    setShowBannedMessage(false);
    setRoomNumber(e.target.value);
    setShowEntranceNotAllowed(false);
  };

  const handleRoomNameChange = (e) => {
    setRoomName(e.target.value);
    setShowShortName(false);
  };

  const handleMaxParticipantsQuantity = (e) => {
    setRoomMaxParticipantsQuantity(e.target.value);
  }

  const handleRoomDescriptionChange = (e) => {
    setRoomDescription(e.target.value);
  }

  // Creating New Room
  const createNewRoomURLAndGetInside = async () => {
    if (roomName.length < 3) {
      setShowShortName(true);
    }
    // Room id is the specific room creation time.
    else {
      props.setIsLoading(true);

      const rid = Date.now();

      let roomStr = "room" + rid;
      await setDoc(doc(db, "rooms", roomStr), {
        roomNumber: rid,
        roomName: roomName,
        showLyrics: true,
        addRequests: true,
        isRepeatAllowed: false,
        isEntranceAllowed: true,
        roomMaxParticipantsQuantity: parseInt(roomMaxParticipantsQuantity),
        roomDescription: roomDescription,
      });
      const data = { 
        name: user.displayName,
        photoURL: user.photoURL, 
        isAdmin: true, 
        timestamp: serverTimestamp(),
        uid: uid,
        // Room creator will be remember as room creator.
        originalAdmin: true,
      }
      const docRef = await setDoc(doc(db, `rooms/room${rid}/users/${uid}`),data);
      
      setShowCreateForm(false);
      // Move to the room, by navigation to the mutual url.
      navigate("/jam-room/" + rid)}
  };

  // Enetering Existing Room

  // if room exists, enter it. else, show an error message.
  const isRoomExists = async () => {
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
    // check if room is open (isEntranceAllowed)

    if (roomExists) {
      // const roomRef = doc(db, `rooms`, `room${id}`);
      // const roomSnap = await getDoc(roomRef);

      // check if user is allowed in 
      const roomRef = doc(db, `rooms/room${roomNumber}`)
      const docSnap = await getDoc(roomRef);
      let bannedUsersArray = [];
      let isUserAllowed = true;
      let isEntranceAllowed = true;
      if (docSnap.exists()){
        console.log(docSnap.data());
        bannedUsersArray = docSnap.data().bannedUsersA
        console.log(bannedUsersArray);
        console.log("does bannedUsersArray indluedes userid? ");

        // check if 
        console.log("isEntranceAllowed:");
        console.log(docSnap.data().isEntranceAllowed);
        isEntranceAllowed = docSnap.data().isEntranceAllowed;
        
        if (bannedUsersArray){
          isUserAllowed = !bannedUsersArray.includes(user.uid);
        }

        if (isEntranceAllowed && isUserAllowed){
          joinRoom();
        }
        else if (!isEntranceAllowed){
          setShowEntranceNotAllowed(true);
          console.log("join room is not possible for anyone including you sir!");
        }
        // !isUserAllowed
        else {
          setShowBannedMessage(true);
          console.log("join room is not possible for you sir!");
        }
      }
      else {
        console.log("error getting room");
      }
      
      
    } else {
      props.setIsLoading(false);
      setShowNotFindMessage(true);
    }
  };

  const joinRoom = async () => {

  
    // check if user is banned
    // get array of banned users id 
    // check if array includes userid only if array exists
    // if no just show message and dont go


    // Check if user had already participated in this specific room.
    // If so, and he's also the original admin, hw would be an admin again.
    // else, he would turn to be regular user.
    const userRef = doc(db, `rooms/room${roomNumber}/users/${uid}`)
    const docSnap = await getDoc(userRef);

    // TODO Banned: check if user in banned users, if no continue regualry,
    // else (he is banned) show him message that he is banned from this room.
    
    let data = {}
    // Check if this user is an admin.
    if (docSnap.exists() && docSnap.data().isAdmin){

      // check if user is banned
      console.log("commiting join room start original admin");
      data = {
      name: user.displayName,
      originalAdmin: true,
      photoURL: user.photoURL, 
      isAdmin: true, 
      timestamp: serverTimestamp(),
      uid: uid,
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
        uid: uid,
      }
    }

    // Add/update user.
    await setDoc(doc(db, `rooms/room${roomNumber}/users/${uid}`),
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


  const tryfunc = async (room) => {
    console.log("tryfunc: ");
    console.log(room);
  
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
            <input
              onChange={handleMaxParticipantsQuantity}
              type="number"
              placeholder="Enter Max Participants Number"
              value={roomMaxParticipantsQuantity}
            > 
            </input>
            <input
              onChange={handleRoomDescriptionChange}
              type="text"
              placeholder="Describe the meeting in a few words..."
              value={roomDescription}
            > 
            </input>
          </form>
          {showShortName && <p style={{ color: "red" }}>Room name has to be at least 3 characters</p>}          
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
          {showNotFindMessage && (
            <p style={{ color: "red" }}>we can't find this room... try again?</p>
          )}
          {showBannedMessage && (
            <p style={{ color: "red" }}>It seems like you are banned from this room</p>
          )}
          {showEntranceNotAllowed && <p>Entrance to room number {roomNumber.substring(roomNumber.length -5)} is prohibited</p>}
          <button onClick={() => isRoomExists()}>-Join!-</button>
          <JoinRoom roomNumber={roomNumber}/>
        </div> : 
          <button onClick={()=>setShowJoinForm(true)}>Join A Room!</button>
        }
        
        
      
      </div>
      </div>
      <div>
        <h1>Current Active Rooms:</h1>
        <input
        type="text"
        placeholder="serach by name..."
        onChange={(e) => setQueryRoomName(e.target.value) }

      ></input>
        <ul>
          {rooms ?
          rooms.filter(
            (room)=>(room.roomName.toLowerCase().includes(queryRoomName.toLocaleLowerCase()) || room.roomNumber.toString().includes(queryRoomName.toLocaleLowerCase()))
          ).map((room) => (
            <div>
              <Room key={room.roomNumber} room={room} user={user} isLoading={props.isLoading} setIsLoading={props.setIsLoading}/>
              {/* <button onClick={()=>console.log(room)}>try func</button> */}
            </div>
          )) : <Loading/>}
        </ul>
      </div>
    </div>
  );
}

export default GetARoom;
