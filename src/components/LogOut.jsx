import React from "react";
import { auth } from "../firebase";
import LogOutIcon from "./styles/icons/LogoutIcon.svg";

const LogOut = () => {
  const signOut = () => {
    signOut(auth);
  };
  return (
    // <button
    //   className="hello-username logout-button"
    //   onClick={() => auth.signOut()}
    // >
    //   התנתק
    // </button>
    <img
      onClick={() => auth.signOut()}
      className="hello-username logout-button"
      src={LogOutIcon}
      alt=""
    />
  );
};

export default LogOut;
