import React from "react";
import "./styles/Loading.css";
import LogoShirly from "./styles/images/LogoShirly.png";

function Loading() {
  return (
    <div className="loader-container">
      <div className="center">
        <img className="logo-img logo-loading" src={LogoShirly} />
      </div>
      <div className="center">
        <div className="loader"></div>
      </div>
    </div>
  );
}

export default Loading;
