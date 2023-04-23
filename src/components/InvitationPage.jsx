import React, { useDebugValue, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDoc, doc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import GoogleIcon from "./styles/icons/GoogleIcon.png";
import { db, auth } from "../firebase";
import QRGenerator from "./QRGenerator";

import "./styles/InvitationPage.css";

function InvitationPage() {
  const { rid } = useParams();
  const [roomName, setRoomName] = useState("");
  const [user] = useAuthState(auth);

  const getRoomName = async () => {
    const roomRef = doc(db, `rooms/room${rid}`);
    getDoc(roomRef).then((docSnap) => {
      console.log(docSnap.data().roomNumber);
      setRoomName(docSnap.data().roomName);
    });
  };

  useEffect(() => {
    getRoomName();
  }, []);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const joinRoom = () => {
    console.log(`join room ${rid} if exists`);
  };

  return (
    <div className="invitation-container">
      <div className="invitation-headers">
        <h1>ברוכים הבאים!</h1>
        <h4>הוזמנתם לחדר: {roomName}</h4>
      </div>

      <div className="invitation-buttons">
        {!user && (
          <button className="invitation-login-button" onClick={googleSignIn}>
            <img className="button-image-google" src={GoogleIcon} alt="" />
            <span className="invitation-button-text">התחברו באמצעות גוגל </span>
          </button>
        )}

        <button
          onClick={() => joinRoom()}
          className={`invitation-login-button ${!user && "disabled"}`}
        >
          הצטרפו כעת
        </button>
      </div>
    </div>
  );
}

export default InvitationPage;
