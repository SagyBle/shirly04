import React, { useState } from "react";
import QRCode from "qrcode";

function QRGenerator() {
  const [url, setUrl] = useState("https://shirly04.netlify.app/");
  const [qrcode, setQrcode] = useState("");

  const generateQRCode = () => {
    QRCode.toDataURL(url, (err, url) => {
      if (err) return console.log(err);
      console.log("generates to url: ", url);
      setQrcode(url);
    });
  };
  return (
    <div>
      <h1>QR generator</h1>
      <button onClick={() => generateQRCode()}>generate QR code</button>
      <img src={qrcode} alt="" />
    </div>
  );
}

export default QRGenerator;
