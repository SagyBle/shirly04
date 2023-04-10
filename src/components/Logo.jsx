import React from "react";
import LogOut from "./LogOut";
import { useNavigate } from "react-router-dom";
import LogoShirly from "./styles/images/LogoShirly.png";

function Logo({ userDisplayName }) {
  const navigate = useNavigate();

  return (
    <div className="logo-div">
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        <img className="logo-img" src={LogoShirly} />
      </button>
      <div className="user-greetings-div">
        <span className="hello-username">{userDisplayName} שלום</span>
        <LogOut />
      </div>
    </div>
  );
}

export default Logo;
