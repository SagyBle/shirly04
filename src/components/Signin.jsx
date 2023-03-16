import React from "react";
// import GoogleButton from "react-google-button";

import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import "./styles/Signin.css";
import GoogleIcon from "./styles/icons/GoogleIcon.png";
import IDCard from "./styles/icons/id-card.png";
import Logo from "./styles/images/Logo.png";
import PlayingGuitar from "./styles/images/playingguitar.webp";
import PlayingPiano from "./styles/images/pianogirl.webp";
import PlayingBeach from "./styles/images/PlayingAtTheBeach.webp";
import YahalomChen from "./styles/images/YahalomChen.webp";
import { useState } from "react";

const style = {
  wrapper: `flex justify-center`,
};

const googleSignIn = () => {
  const provider = new GoogleAuthProvider();
  signInWithRedirect(auth, provider);
};

const Signin = () => {
  const [imgIndex, setImageIndex] = useState(0);
  const images = [PlayingGuitar, PlayingPiano, PlayingBeach, YahalomChen];
  return (
    <>
      <div className="container-div">
        <div className="left-side">
          <div className="explenation-card">
            <div className="intro-image-div">
              <img className="intro-image" src={images[imgIndex]} alt="" />
            </div>
            <div className="intro-headers-div">
              <div className="flex-and-center">
                <h5>לנגן עם חברים בקלות</h5>
              </div>
              <div>
                <p className="intro-small-header-p">
                  ברוכים הבאים לשירלי, האפליקציה שתשדרג לכם כל ישיבה עם חברים,
                  תקל על הנגנים ותשפר את החוויה
                </p>
              </div>
              <div className="dots-container">
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
        </div>

        <div className="right-side">
          <div className="logo">
            <div className="logo-img-div">
              <img className="logo-img" src={Logo} />
            </div>
          </div>
          <div className="lets-start-card-div">
            <div className="header-div">
              <h1 className="header-h1">בואו נתחיל</h1>
            </div>

            <div className="login-div">
              <button className="login-button" onClick={googleSignIn}>
                <div className="block">
                  <img
                    className="button-image-google"
                    src={GoogleIcon}
                    alt=""
                  />
                  <p className="button-text-google">התחברו באמצעות גוגל </p>
                </div>
              </button>
            </div>
            <div className="login-div">
              <button className="login-button" onClick={googleSignIn}>
                <div className="block">
                  <img className="button-image-google" src={IDCard} alt="" />
                  <p className="button-text-google">התחברו בדרך אחרת </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
