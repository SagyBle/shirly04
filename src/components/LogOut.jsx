import React from "react";
import { auth } from "../firebase";

const LogOut = () => {
  const signOut = () => {
    signOut(auth);
  };
  return <button onClick={() => auth.signOut()}>Logout</button>;
};

export default LogOut;
