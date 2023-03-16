import React, { useEffect } from "react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { PinInput } from "react-input-pin-code";

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

import "./styles/GetARoom.css";
import FormDialog from "./FormDialog";
import Toggle from "./Toggle";
import ToggleBoolean from "./ToggleBoolean";
import DialogCreateRoom from "./DialogCreateRoom";
import LogOut from "./LogOut";

import Logo from "./styles/images/Logo.png";

import Swal from "sweetalert2";

function GetARoom({ uid, isLoading, setIsLoading }) {
  // const uid = props.uid;

  const [values, setValues] = useState(["", "", "", "", "", ""]);

  const [roomNumber, setRoomNumber] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomMaxParticipantsQuantity, setRoomMaxParticipantsQuantity] =
    useState("");
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

  // Creating New Room
  const createNewRoomURLAndGetInside = async () => {
    if (roomName.length < 3) {
      setShowShortName(true);
    }
    // Room id is the specific room creation time.
    else {
      setIsLoading(true);

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
      };
      const docRef = await setDoc(
        doc(db, `rooms/room${rid}/users/${uid}`),
        data
      );

      // setShowCreateForm(false);
      // Move to the room, by navigation to the mutual url.
      navigate("/jam-room/" + rid);
    }
  };

  const joinRoom1 = async () => {
    // setIsLoading(true);
    const uid = user.uid;
    let rid = roomNumber;

    console.log(uid);
    console.log(`maybe rid is the prob?${rid}`);

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
    console.log("got into joinRoomAsUser");
    // check if room entrance is disabled
    if (docSnapRoom.data().isEntranceAllowed) {
      // check if user is not banned from room
      let bannedUsersArray = docSnapRoom.data().bannedUsersA;
      let userIsBanned = false;
      if (bannedUsersArray) {
        userIsBanned = bannedUsersArray.includes(uid);
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
          confirmButtonText: "אנטישמי",
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

  // Get cuurent active rooms
  useEffect(() => {
    const q = query(collection(db, `rooms`), orderBy("roomNumber"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let rooms = [];
      querySnapshot.forEach((doc) => {
        rooms.push({ ...doc.data(), id: doc.id });
      });
      setRooms(rooms);
    });
    return () => unsubscribe();
  }, []);

  const enterRoomFromPin = async () => {
    setRoomNumber(values.join(""));
    console.log(`enterRoomFromPin ${roomNumber}`);
    joinRoom1();
  };

  return (
    /* 0start total div */
    <div className="container-fluid">
      {/* 2 loading div */}
      <div>{isLoading && <Loading />}</div>
      {/* 2 loading div */}

      <div className="row g-0 px-0">
        {/* start col4 */}
        <div className="col-4">
          <div>
            {/* 1start left side */}
            <div className="left-div">
              {/* 2start search room */}
              <div className="d-flex justify-content-center">
                <div className="search-room-div">
                  {/* <input
                className="search-room-box"
                type="text"
                placeholder="חיפוש"
                onChange={(e) => setQueryRoomName(e.target.value) }
                >
                </input> */}

                  <input
                    type="text"
                    className="search-room-box"
                    placeholder="חיפוש"
                    onChange={(e) => setQueryRoomName(e.target.value)}
                  />
                </div>
              </div>
              {/* 2end search room */}

              {/* 2start header */}
              <div className="active-rooms-header">
                <h4 className="justify-content-center">חדרים פעילים</h4>
              </div>
              {/* 2end header */}

              {/* 2start list of rooms  */}
              <div className="list-of-rooms">
                <ul>
                  {rooms ? (
                    rooms
                      .filter(
                        (room) =>
                          room.roomName
                            .toLowerCase()
                            .includes(queryRoomName.toLocaleLowerCase()) ||
                          room.roomNumber
                            .toString()
                            .includes(queryRoomName.toLocaleLowerCase())
                      )
                      .map((room) => (
                        <div>
                          <Room
                            key={room.roomNumber}
                            room={room}
                            user={user}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                          />
                        </div>
                      ))
                  ) : (
                    <Loading />
                  )}
                </ul>

                {rooms.filter(
                  (room) =>
                    room.roomName
                      .toLowerCase()
                      .includes(queryRoomName.toLocaleLowerCase()) ||
                    room.roomNumber
                      .toString()
                      .includes(queryRoomName.toLocaleLowerCase())
                ).length === 0 ? (
                  // <div className="not-found-room-div-div">
                  <div className="not-found-room-div">
                    <div className="not-found-room">
                      <h4>לא נמצאו תוצאות לחיפוש זה</h4>
                    </div>
                    <div className="circle">
                      <div className="inner-circle"></div>
                    </div>
                    {/* </div> */}
                  </div>
                ) : null}
              </div>
              {/* 2end list of rooms  */}
            </div>
            {/* 1end left side */}
          </div>
        </div>
        {/* end col4 */}

        {/* start col */}
        <div className="col">
          <div className="row">
            <div className="col">
              <div className="logo">
                <div className="logo-arrow-div">
                  <div className="logo-img-div">
                    <button
                      onClick={() => {
                        navigate("/");
                      }}
                    >
                      <img className="logo-img" src={Logo} />
                    </button>
                  </div>
                  <div className="user-greetings-div">
                    <p className="hello-username-p">שלום {user.displayName}</p>
                    <LogOut />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="break"></div>
            </div>
          </div>
          <div className="row">
            <div className="col-3"></div>
            <div className="col-9">
              <h1 className="main-header">
                הגיע הזמן להינות יותר מערבי הנגינה שלכם
              </h1>
              <h2 className="sub-header">
                הנדסנו מחדש את הדרך שלכם לנגן ולשיר עם החברים. הצטרפו לאותו החדר
                ונגנו ללא דאגות.
              </h2>
            </div>
          </div>
          <div className="row">
            <div className="col-9 offset-3">
              <div className=" small-break"></div>
            </div>
          </div>
          <div className="row">
            {/* <div className="col-3">
                  
                </div> */}
            <div className="col-9 offset-3">
              <div className="">
                {/* 2start get in by pincode */}
                <div className="container">
                  <div>
                    {/* 3 header */}
                    <div>
                      <h3 className="sub-header enter-room">קוד כניסה לחדר</h3>
                    </div>
                    {/* 3 header */}

                    {/* 3 pincode */}
                    <div className=" d-flex justify-content-center">
                      <div>
                        <PinInput
                          className="pin-input"
                          values={values}
                          placeholder=""
                          onChange={(value, index, values) => setValues(values)}
                          // onComplete={() => setRoomNumber(values.join(""))}
                          onComplete={() => enterRoomFromPin()}
                          size="lg"
                          borderColor="#EEEEEE"
                          focusBorderColor="#246BFD"
                        />
                      </div>
                      {/* <JoinRoom setIsLoading={setIsLoading} roomNumber={roomNumber} /> */}
                    </div>
                    {/* 3 pincode */}
                  </div>
                  {/* 2end get in by pincode */}
                </div>

                {/* 1start or */}
                <div className=" d-flex justify-content-center">
                  <h3 className="or">או</h3>
                </div>
                {/* 1end or */}

                {/* 2start cerate new room */}
                <div>
                  {/* 3start button create */}
                  <div className="d-flex justify-content-center">
                    {/* <button className="create-room-button" onClick={createNewRoomURLAndGetInside}>צור חדר חדש +</button> */}
                    {/* button below to open create room dialog */}

                    <button
                      className="create-room-button-index"
                      onClick={() => setShowCreateDialog(true)}
                    >
                      צור חדר חדש +
                    </button>

                    {showCreateDialog && (
                      <DialogCreateRoom
                        setRoomName={setRoomName}
                        setRoomMaxParticipantsQuantity={
                          setRoomMaxParticipantsQuantity
                        }
                        setRoomDescription={setRoomDescription}
                        setRoomPassword={setRoomPassword}
                        roomName={roomName}
                        roomDescription={roomDescription}
                        roomMaxParticipantsQuantity={
                          roomMaxParticipantsQuantity
                        }
                        roomPassword={roomPassword}
                        isLockedWithPassword={isLockedWithPassword}
                        setIsLockedWithPassword={setIsLockedWithPassword}
                        setShowCreateDialog={setShowCreateDialog}
                        createNewRoomURLAndGetInside={
                          createNewRoomURLAndGetInside
                        }
                      />
                    )}
                  </div>
                  {/* 3end button create */}
                </div>
                {/* 2end cerate new room */}
              </div>
            </div>
          </div>
        </div>
        {/* end col */}
      </div>
    </div>
    /* 0end total div */
  );
}

export default GetARoom;
