import React from "react";
import "./styles/Loading.css";
import Logo from "./styles/images/Logo.png";

function Loading() {
  return (
    <div className="loader-container">
      <div className="center">
        <img className="logo-img logo-loading" src={Logo} />
      </div>
      <div className="center">
        <div class="loader"></div>
      </div>
    </div>
  );
}

export default Loading;
