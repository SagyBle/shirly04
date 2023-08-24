import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ActiveUsers from "./ActiveUsers";
import { useAuthState } from "react-firebase-hooks/auth";

import "./styles/Chat.css";
import LogoShirly from "./styles/images/LogoShirly.png";
import SongLyrics from "./SongLyrics";
import LogOut from "./LogOut";
import SognsFeed from "./SognsFeed";
import PopupShare from "./PopupShare";
import HomeIcon from "./styles/icons/HomeIcon.svg";

const Chat = (props) => {
  const RoomSongsRef = useRef(null);
  const currSongRef = useRef(null);

  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [displayNextSongs, setDisplayNextSongs] = useState(true);
  const [history, setHistory] = useState([]);
  const [roomDescription, setRoomDescription] = useState("");
  const [displaySettings, setDisplaySettings] = useState(false);

  const [users, setUsers] = useState([]);
  const [amIAdmin, setAmIAdmin] = useState(false);
  const [showLyrics, setShowLyrics] = useState("");
  const [addRequests, setAddRequests] = useState(true);
  const [isEntranceAllowed, setIsEntranceAllowed] = useState(true);
  const [isRepeatAllowed, setIsRepeatAllowed] = useState(false);
  const [setCurrPlayingNow, currPlayingNow] = useState("");

  const [maxParticipantsQuantity, setMaxParticipantsQuantity] = useState(0);
  const [showInvitePopup, setShowInvitePopup] = useState(false);

  const { id } = useParams();
  const rid = id;

  const [user] = useAuthState(auth);
  const uid = user.uid;

  const navigate = useNavigate();

  // set listeners to rooms meta
  const unsubRoomData = onSnapshot(doc(db, `rooms/room${rid}`), (doc) => {
    setRoomName(doc.data().roomName);
    setRoomDescription(doc.data().roomDescription);
    setShowLyrics(doc.data().showLyrics);
    setAddRequests(doc.data().addRequests);
    setIsEntranceAllowed(doc.data().isEntranceAllowed);
    setIsRepeatAllowed(doc.data().isRepeatAllowed);
    setCurrPlayingNow(doc.data().currPlayingNow);
    setMaxParticipantsQuantity(doc.data().roomMaxParticipantsQuantity);
  });

  // get amIAdmin field from firestore
  const unsubAdmin = onSnapshot(
    doc(db, `rooms/room${rid}/users`, uid),
    (doc) => {
      // console.log("Current data amIAdmin?: ", doc.data().isAdmin);
      setAmIAdmin(doc.data().isAdmin);
    }
  );

  useEffect(() => {
    onSnapshot(doc(db, `rooms/room${rid}`));
  }, []);

  // set messages
  useEffect(() => {
    const q = query(
      collection(db, `rooms/room${rid}/messages`),
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
    return () => unsubscribe();
  }, []);

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

  // creating room document: mesasages and users as subdocument
  useEffect(() => {
    console.log("running useEffect creating room");
    async function createRoom() {
      const docRef1 = doc(db, `rooms/room${rid}/messages`, "examplemessage1");
      await setDoc(docRef1, { title: "title1", artist: "artist1" });
    }
    createRoom();
    props.setIsLoading(false);
  }, []);

  // Move to next song - Admin function only
  const moveNext = async () => {
    if (messages.length > 0) {
      updateDoc(doc(db, `rooms/room${rid}`), {
        currPlayingNow: messages[0].text,
      });
      const data = messages[0];
      await setDoc(doc(db, `rooms/room${rid}/history/${messages[0].id}`), data);
      const docref = doc(db, `rooms/room${rid}/messages`, messages[0].id);
      const subMessages = messages.slice(1);
      setMessages(subMessages);

      deleteDoc(docref)
        .then(() => {
          console.log("Entire document has been deleted successfully.");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="container-div-chat">
      {showInvitePopup && (
        <PopupShare rid={rid} setShowInvitePopup={setShowInvitePopup} />
      )}
      <div className="user-greetings-div-mobile">
        <span className="hello-username">{`שלום ${user.displayName}, ${
          amIAdmin ? "אתה מחובר כאדמין" : "אתה מחובר כמשתמש"
        }`}</span>
        <div className="mobile-header-icons-div">
          <LogOut />
          <img
            onClick={() => navigate("/")}
            className="hello-username home-button"
            src={HomeIcon}
            alt=""
          />
        </div>
      </div>
      <SognsFeed
        setShowInvitePopup={setShowInvitePopup}
        RoomSongsRef={RoomSongsRef}
        currSongRef={currSongRef}
        uid={uid}
        rid={rid}
        messages={messages}
        setMessages={setMessages}
        addRequests={addRequests}
        setAddRequests={setAddRequests}
        setDisplayNextSongs={setDisplayNextSongs}
        displayNextSongs={displayNextSongs}
        setAmIAdmin={setAmIAdmin}
        amIAdmin={amIAdmin}
        showLyrics={showLyrics}
        moveNext={moveNext}
        currPlayingNow={currPlayingNow}
        history={history}
        setHistory={setHistory}
        users={users}
        setUsers={setUsers}
        roomDescription={roomDescription}
        displaySettings={displaySettings}
        setDisplaySettings={setDisplaySettings}
        roomName={roomName}
        maxParticipantsQuantity={maxParticipantsQuantity}
        isEntranceAllowed={isEntranceAllowed}
      />
      <div className="right-side">
        <div className="logo-arrow-div-chat">
          <div className="logo-img-div">
            <button
              onClick={() => {
                navigate("/");
              }}
            >
              <img className="logo-img" src={LogoShirly} />
            </button>
          </div>
          <div className="user-greetings-div">
            <LogOut />
            <span className="hello-username">{`שלום ${user.displayName}, ${
              amIAdmin ? "אתה מחובר כאדמין" : "אתה מחובר כמשתמש"
            }`}</span>
          </div>
        </div>

        <div ref={currSongRef} className="lyrics-author-song-header-div">
          {showLyrics ? (
            <SongLyrics currSongRef={currSongRef} rid={rid} />
          ) : (
            <p>הצגת מילות השיר הושהתה על ידי מנהל החדר.</p>
          )}
        </div>
        <button
          onClick={() =>
            RoomSongsRef.current.scrollIntoView({ behavior: "smooth" })
          }
          className="curr-song-button"
        >
          חזור לרשימת השירים
        </button>
      </div>
    </div>
  );
};

export default Chat;
