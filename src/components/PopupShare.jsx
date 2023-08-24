import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import "./styles/PopupShare.css";
import { Copy, Share, Copied, ExitX } from "./styles/icons/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { shareOnMobile } from "react-mobile-share";

function PopupShare({ rid, setShowInvitePopup }) {
  const [url, setUrl] = useState(
    `https://shirly04.netlify.app/invitation/${rid}`
  );
  const [qrcode, setQrcode] = useState("");
  const [copied, setCopied] = useState(false);

  const generateQRCode = () => {
    QRCode.toDataURL(url, (err, url) => {
      if (err) return console.log(err);
      setQrcode(url);
    });
  };

  useEffect(() => {
    generateQRCode();
  }, []);

  return (
    <div className="overlay-share">
      {/* <div className="overlay" onClick={() => setShowInvitePopup(false)}> */}
      <div className="dialog-share">
        <div className="share-button-x-div">
          <button
            className="share-button-x"
            onClick={() => setShowInvitePopup(false)}
          >
            {" "}
            {ExitX}
          </button>
        </div>
        <h1 className="share-header">סרקו את הQR</h1>

        <h5 className="share-sub-header">
          סרקו את קוד הQR והיכנסו לחדר הג׳ימג׳ום
        </h5>
        <img className="share-qr-image" src={qrcode} alt="" />
        <div className="share-other-ways-div">
          <span className="share-line"></span>
          <span className="share-other-ways">
            או שתפו את הלינק בדרכים אחרות
          </span>
          <span className="share-line"></span>
        </div>
        <div className="share-url-total-div">
          <div className="share-url-div">
            <input
              className="share-url-input"
              value={`shirly04.netlify.app/invitation/${rid}`}
            ></input>
            <CopyToClipboard text={url} onCopy={() => setCopied(true)}>
              <button className="share-button">{Copy}</button>
            </CopyToClipboard>
            <button
              className="share-button"
              onClick={() =>
                shareOnMobile({
                  text: `היי, הוזמנתם לשירלי! הצטרפו כעת`,
                  url: url,
                  title: "בואו לנגן איתנו",
                })
              }
            >
              {Share}
            </button>
          </div>
          {copied && (
            <span className="share-link-copied">הקישור הועתק{Copied}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default PopupShare;
