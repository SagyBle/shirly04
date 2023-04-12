import React from "react";
import "./styles/Loading.css";
import LogoShirly from "./styles/images/LogoShirly.png";

function Loading() {
  return (
    <div className="loading-container">
      <img className="logo-loading" src={LogoShirly} alt="Logo" />
      <div className="spinner"></div>
    </div>
  );
}

export default Loading;
