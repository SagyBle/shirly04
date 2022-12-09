import React, { useEffect } from "react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { PinInput } from 'react-input-pin-code'

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

import './styles/GetARoom.css'
import FormDialog from "./FormDialog";
import Toggle from "./Toggle";
import ToggleBoolean from "./ToggleBoolean";



function GetARoom(props) {
  
  const uid = props.uid;

  const [values, setValues] = useState(['','','','','','']);

  const [roomNumber, setRoomNumber] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomMaxParticipantsQuantity, setRoomMaxParticipantsQuantity] = useState("");
  const [queryRoomName, setQueryRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [roomPassword, setRoomPassword] = useState("");

  const [isLockedWithPassword, setIsLockedWithPassword] = useState(false);


  const [rooms, setRooms] = useState([]);

  const [user] = useAuthState(auth);
  const [showNotFindMessage, setShowNotFindMessage] = useState(false);
  const [showBannedMessage, setShowBannedMessage] = useState(false);
  const [showShortName, setShowShortName] = useState(false);
  const [showEntranceNotAllowed, setShowEntranceNotAllowed] = useState(false);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
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

  const handlePasswordChange = (e) => {
    setRoomPassword(e.target.value);
  }

  // Creating New Room
  const createNewRoomURLAndGetInside = async () => {
    if (roomName.length < 3) {
      setShowShortName(true);
    }
    // Room id is the specific room creation time.
    else {
      props.setIsLoading(true);

      const rid = Date.now().toString().slice(-6);

      // making room 6 digits only
      console.log("new rid: " + rid);
      // console.log("after substring-6: " + rid);
      // TODO: check if this id is not already exists.


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
      
      // setShowCreateForm(false);
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

  const tryGetAAroom = async () => {
    console.log("try get a room started");
    let rid = Date.now().toString().slice(-6);
    // rid = rid.;
    // rid = rid.;
    console.log(rid);
  }


  return (
    /* 0start total div */
    <div>
 

      {/* 1start right side */}
      <div>

        {/* 2 headers div */}
        <div className="headers">

          <h1 className="main-header">הגיע הזמן להצטרף לחגיגה בחינם וזמין לכולם</h1>
          <h2 className="sub-header">הנדסנו מחדש את השירות שבנינו לפגישות עסקיות מאובטחות, כדי להפוך אותו בחינם וזמין לכולם.</h2>
        </div>
        {/* 2 headers div */}

        {/* 2 loading div */}
        <div>
            {props.isLoading && <Loading/>}
        </div>
        {/* 2 loading div */}



        {/* 2start get in by pincode */}
        <div>
          {/* 3 header */}
          <div>
            <h3 className="sub-header">קוד כניסה לחדר</h3>
          </div>
          {/* 3 header */}
          
          {/* 3 pincode */}
          <div>
            <form>
              <PinInput
              className="pin-input"
              values={values}
              placeholder=''
              onChange={(value, index, values) => setValues(values)}
              onComplete={()=>setRoomNumber(values.join(""))}
              />
            </form>
            <JoinRoom setIsLoading={props.setIsLoading} roomNumber={roomNumber} />
          </div>
          {/* 3 pincode */}

        </div>
        {/* 2end get in by pincode */}

        {/* 1start or */}
        <div>
          <h3 className="or">או</h3>
        </div>
        {/* 1end or */}

        {/* 2start cerate new room */}
        <div>
          {/* 3start button create */}
          <div>
            <button className="create-room-button" onClick={createNewRoomURLAndGetInside}>צור חדר חדש +</button>

            {/* 4 room creation format */}
            <div className="dialog-create-room">

              <div>
                <h3 className="dialog-headline">יצירת חדר חדש</h3>
              </div>
              
              {/* <form className="form-create-room"> */}
                <div>
                <input
                className="input-create-room"
                  onChange={handleRoomNameChange}
                  type="text"
                  placeholder="שם החדר"
                  value={roomName}
                > 
                </input>
                </div>
                <div>
                <input
                className="input-create-room"
                  onChange={handleRoomDescriptionChange}
                  type="text"
                  placeholder="תיאור החדר"
                  value={roomDescription}
                > 
                </input>
                </div>
                <div>
                <input
                className="input-create-room"
                  onChange={handleMaxParticipantsQuantity}
                  type="number"
                  placeholder="כמות המשתתפים"
                  value={roomMaxParticipantsQuantity}
                > 
                </input>
                </div>

                <div>
                  <div>
                    <p className="password-headline">נעל חדר בסיסמה</p>
                    <ToggleBoolean toggle={isLockedWithPassword} setToggle={setIsLockedWithPassword}/>
                  </div>
                  {isLockedWithPassword && 
                    <div>
                      <input
                      className="input-create-room"
                      onChange={handlePasswordChange}
                      type="password"
                      placeholder="הכנס סיסמה"
                      value={roomPassword}> 
                    </input>
                  </div>}

                  <div>
                    <button className="create-room-dialog-button">צור חדר</button>
                  </div>


                </div>
                
              {/* </form> */}
            </div>
            {/* 4 room creation format */}



          </div>
          {/* 3end button create */}

 

        </div>
        {/* 2end cerate new room */}




      </div>
      {/* 1end right side */}




      {/* 1start left side */}
      <div className="left-div">    

        {/* 2start search room */}
        <div className="search-room-div">
          <input
          className="search-room-box"
          type="text"
          placeholder="חיפוש"
          onChange={(e) => setQueryRoomName(e.target.value) }>
          </input>
        </div>
        {/* 2end search room */}

        {/* 2start header */}
        <div className="active-rooms-header">
          <h1>חדרים פעילים</h1>
        </div>
        {/* 2end header */}

        {/* 2start list of rooms  */}
        <div>
          <ul>
            {rooms ?
              rooms.filter((room)=>
                (room.roomName.toLowerCase().includes(queryRoomName.toLocaleLowerCase())
                ||
                room.roomNumber.toString().includes(queryRoomName.toLocaleLowerCase()))
                ).map((room) => (
              <div>
                <Room key={room.roomNumber} room={room} user={user} isLoading={props.isLoading} setIsLoading={props.setIsLoading}/>
              </div>
                ))
            : <Loading/>}


          </ul>

          {rooms.filter((room)=>
                (room.roomName.toLowerCase().includes(queryRoomName.toLocaleLowerCase())
                ||
                room.roomNumber.toString().includes(queryRoomName.toLocaleLowerCase()))
                ).length === 0 ?
                <div>
                  <div className="not-found-room">
                    <h4>לא נמצאו תוצאות לחיפוש זה</h4>
                  </div>
                  
                  <div className="outside-box">
                    <div className="circle">
                      <div className="inner-circle"></div>
                    </div>
                  </div>
                </div>
                 : null}
        </div>
        {/* 2end list of rooms  */}


      </div>
      {/* 1end left side */}

    </div>
    /* 0end total div */   
    
  );
}


export default GetARoom;
