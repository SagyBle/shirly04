import React from "react";
import "../components/styles/Header.css";
import Logo from "./Logo";
import LogOut from "./LogOut";

function Header({ userDisplayName }) {
  return (
    <div className="header-div">
      {/* <span className="hello-username">{userDisplayName} שלום</span> */}
      <span className="hello-username">שגילי שלום</span>
      <LogOut />
    </div>
  );
}

export default Header;
