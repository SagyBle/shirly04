import React, { useState } from "react";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import Logo from "./styles/images/Logo.png";
import GoogleIcon from "./styles/icons/GoogleIcon.png";
import PlayingGuitar from "./styles/images/playingguitar.webp";
import PlayingPiano from "./styles/images/pianogirl.webp";
import PlayingBeach from "./styles/images/PlayingAtTheBeach.webp";
import YahalomChen from "./styles/images/YahalomChen.webp";
import SigninEmail from "./SigninEmail";
import "./styles/Signin.css";

const googleSignIn = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

const Signin = () => {
  const [imgIndex, setImageIndex] = useState(0);
  const images = [PlayingGuitar, PlayingPiano, PlayingBeach, YahalomChen];

  return (
    <>
      <div className="container-div">
        <div className="left-side">
          <div className="explenation-card">
            <img className="intro-image" src={images[imgIndex]} alt="" />
            <div className="intro-headers-div">
              <h5>לנגן עם חברים בקלות</h5>

              <p className="intro-small-header-p">
                ברוכים הבאים לשירלי, האפליקציה שתשדרג לכם כל ישיבה עם חברים, תקל
                על הנגנים ותשפר את החוויה
              </p>

              <div className="dots">
                <span
                  onClick={() => setImageIndex(0)}
                  className={imgIndex === 0 ? "dot dot-chosen" : "dot"}
                ></span>
                <span
                  onClick={() => setImageIndex(1)}
                  className={imgIndex === 1 ? "dot dot-chosen" : "dot"}
                ></span>
                <span
                  onClick={() => setImageIndex(2)}
                  className={imgIndex === 2 ? "dot dot-chosen" : "dot"}
                ></span>
                <span
                  onClick={() => setImageIndex(3)}
                  className={imgIndex === 3 ? "dot dot-chosen" : "dot"}
                ></span>
              </div>
            </div>
          </div>
        </div>

        <div className="right-side">
          <div className="lets-start-card-div">
            <h1 className="header-h1">בואו נתחיל</h1>

            <button className="login-button" onClick={googleSignIn}>
              <img className="button-image-google" src={GoogleIcon} alt="" />
              <span className="button-text-google">התחברו באמצעות גוגל </span>
            </button>
            <SigninEmail />
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
