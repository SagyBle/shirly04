import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { db, auth } from "../firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "./Loading";
import DialogCreateRoom from "./DialogCreateRoom";
import Swal from "sweetalert2";
import Logo from "./Logo";
import ListOfRooms from "./ListOfRooms";
import EnterRoomIntro from "./EnterRoomIntro";
import Header from "./Header.jsx";
import LogOut from "./LogOut";

import "./styles/GetARoom.css";

function GetARoom({ uid, isLoading, setIsLoading }) {
  const myRef = useRef(null);
  const [user] = useAuthState(auth);
  const [values, setValues] = useState(["", "", "", "", "", ""]);
  const [roomNumber, setRoomNumber] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomMaxParticipantsQuantity, setRoomMaxParticipantsQuantity] =
    useState("");
  const [queryRoomName, setQueryRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [isLockedWithPassword, setIsLockedWithPassword] = useState(false);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRooms, setShowRooms] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  const navigate = useNavigate();

  // add listener to add people, if flag is down, redirect to page that claims that
  // room is closed now by admin order!

  // Creating New Room
  const createNewRoomURLAndGetInside = async () => {
    setIsLoading(true);

    const rid = Date.now().toString().slice(-6);

    // making room 6 digits only
    console.log("new rid: " + rid);
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
    };
    const docRef = await setDoc(doc(db, `rooms/room${rid}/users/${uid}`), data);

    // setShowCreateForm(false);
    // Move to the room, by navigation to the mutual url.
    navigate("/jam-room/" + rid);
  };

  const joinRoom = async () => {
    const uid = user.uid;
    let rid = roomNumber;
    let isRoomExist = false;
    let isExist = false;
    let isAdmin = false;

    // check if the room exsits (even if its from the room card from get a room)
    const roomRef = doc(db, `rooms/room${rid}`);
    const docSnapRoom = await getDoc(roomRef);
    console.log(`docSnapRoom ${docSnapRoom.exists()}`);

    // if room exists
    if ((isRoomExist = docSnapRoom.exists())) {
      // check if the user that trying to get in is admin.
      const userRef = doc(db, `rooms/room${rid}/users/${uid}`);
      const docSnapUser = await getDoc(userRef);
      // check if user exits
      if ((isExist = docSnapUser.exists())) {
        console.log("got in user exists in users room");

        // check if admin
        if ((isAdmin = docSnapUser.data().isAdmin)) {
          console.log("got in isAdmin ");
          //get in as admin
          joinRoomAsAdmin(rid, uid);
          console.log("get in room as admin: " + isAdmin);
        } else {
          joinRoomAsUser(rid, uid, isExist, docSnapRoom);
        }
      } else {
        joinRoomAsUser(rid, uid, isExist, docSnapRoom);
      }
    }
    // room doesnt exists
    else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }

    // setIsLoading(false);
  };

  const joinRoomAsAdmin = async (rid, uid) => {
    const data = {
      name: user.displayName,
      originalAdmin: true,
      photoURL: user.photoURL,
      isAdmin: true,
      timestamp: serverTimestamp(),
      uid: user.uid,
    };
    // Add/update user.
    await setDoc(doc(db, `rooms/room${rid}/users/${uid}`), data);

    // get in the room
    navigate(`/jam-room/${rid}`);
  };

  const joinRoomAsUser = async (rid, uid, isExist, docSnapRoom) => {
    // check if room entrance is disabled
    if (docSnapRoom.data().isEntranceAllowed) {
      // check if user is not banned from room
      let bannedUsersArray = docSnapRoom.data().bannedUsersA;
      let userIsBanned = false;
      if (bannedUsersArray) {
        userIsBanned = bannedUsersArray.includes(uid);
      }
      if (!userIsBanned) {
        let data = {
          name: user.displayName,
          originalAdmin: false,
          photoURL: user.photoURL,
          isAdmin: false,
          timestamp: serverTimestamp(),
          uid: user.uid,
        };
        await setDoc(doc(db, `rooms/room${rid}/users/${uid}`), data);

        navigate("/jam-room/" + rid);
      }

      // user is banned
      // setshowbannedmessage true
      //loading false
      else {
        // setIsLoading(false);
        Swal.fire({
          title: "שובב אחד",
          text: "נראה שהמנהל חסם אותך",
          icon: "question",
          confirmButtonText: "בושה! בושה! בושה!",
          cancelButtonText: "הוא צודק",
          showCancelButton: true,
          showCloseButton: true,
        });
      }
    } else {
      // setIsLoading(false);
      alert("Access to this room is currently disabled");
    }
  };

  const enterRoomFromPin = async () => {
    setRoomNumber(values.join(""));
    joinRoom();
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 500) {
        setMobileView(true);
      } else {
        setMobileView(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="container-div-get-a-room">
      <div className="user-greetings-div-mobile">
        <span className="hello-username">{`שלום ${user.displayName}`}</span>
        <LogOut />
      </div>
      {showCreateDialog && (
        <DialogCreateRoom
          setRoomName={setRoomName}
          setRoomMaxParticipantsQuantity={setRoomMaxParticipantsQuantity}
          setRoomDescription={setRoomDescription}
          setRoomPassword={setRoomPassword}
          roomName={roomName}
          roomDescription={roomDescription}
          roomMaxParticipantsQuantity={roomMaxParticipantsQuantity}
          roomPassword={roomPassword}
          isLockedWithPassword={isLockedWithPassword}
          setIsLockedWithPassword={setIsLockedWithPassword}
          setShowCreateDialog={setShowCreateDialog}
          createNewRoomURLAndGetInside={createNewRoomURLAndGetInside}
        />
      )}
      {isLoading && <Loading />}

      <ListOfRooms
        // rooms={rooms}
        myRef={myRef}
        setQueryRoomName={setQueryRoomName}
        queryRoomName={queryRoomName}
        user={user}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      <div className="right-side-get-a-room">
        <Logo userDisplayName={user.displayName} />
        <EnterRoomIntro
          myRef={myRef}
          mobileView={mobileView}
          values={values}
          setValues={setValues}
          enterRoomFromPin={enterRoomFromPin}
          setShowCreateDialog={setShowCreateDialog}
        />
      </div>
    </div>
  );
}

export default GetARoom;
