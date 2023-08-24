import React, { useDebugValue, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  getDoc,
  doc,
  onSnapshot,
  query,
  collection,
  orderBy,
} from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import GoogleIcon from "./styles/icons/GoogleIcon.png";
import { db, auth } from "../firebase";
import "./styles/InvitationPage.css";

function InvitationPage() {
  const { rid } = useParams();
  const [roomName, setRoomName] = useState("");
  const [user] = useAuthState(auth);

  const [users, setUsers] = useState([]);
  const [playingNow, setPlayingNow] = useState("");

  const navigate = useNavigate();

  const getRoomName = async () => {
    const roomRef = doc(db, `rooms/room${rid}`);
    getDoc(roomRef).then((docSnap) => {
      setRoomName(docSnap.data().roomName);
      setPlayingNow(docSnap.data().currPlayingNow);
    });
  };

  useEffect(() => {
    getRoomName();
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

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const joinRoom = () => {
    if (user) {
      navigate(`/jam-room/${rid}`);
    }
  };

  return (
    <div className="overlay-share">
      <div className="dialog-share">
        <h1 className="invitation-header">הוזמנתם לג׳מג׳ם!</h1>
        <h4 className="invitation-sub-header">{roomName}</h4>
        <div className="invitation-room-details-div">
          <span className="invitation-room-details">
            {users.length} משתתפים
          </span>
          <span className="invitation-room-details">&#8226;</span>
          <span className="invitation-room-details">{playingNow}</span>
        </div>
        <div className="avatar-group invitation-avatars">
          {users.length > 10 && (
            <div className="hidden-avatars">+{users.length - 10}</div>
          )}
          {users.slice(0, 10).map((user) => {
            return (
              <div key={user.uid} className="avatar">
                <img src={user.photoURL} alt="" />
              </div>
            );
          })}
        </div>
        <div className="invitation-buttons-div">
          <button
            onClick={() => joinRoom()}
            className={`invitation-login-button ${!user && "disabled-button"}`}
          >
            הצטרפו עכשיו
          </button>

          {user ? (
            <button
              className={`invitation-login-button ${user && "disabled-button"}`}
              onClick={() => auth.signOut()}
            >
              <span className="invitation-button-text">
                היי {user.displayName.split(" ")[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={() => {
                googleSignIn();
              }}
              className={`invitation-login-button ${user && "disabled-button"}`}
            >
              <>
                <img className="button-image-google" src={GoogleIcon} alt="" />
                <span className="invitation-button-text">התחברו </span>
              </>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InvitationPage;
