import React from "react";
import { PinInput } from "react-input-pin-code";

function EnterRoomIntro({
  values,
  setValues,
  enterRoomFromPin,
  setShowCreateDialog,
}) {
  return (
    <div className="enter-room-div">
      <h1 className="main-header">הגיע הזמן להינות יותר מערבי הנגינה שלכם</h1>
      <h2 className="sub-header">
        הנדסנו מחדש את הדרך שלכם לנגן ולשיר עם החברים. הצטרפו לאותו החדר ונגנו
        ללא דאגות.
      </h2>
      <div className="room-enter-code-div">
        <h3 className="sub-header">קוד כניסה לחדר</h3>

        <div className="room-enter-input-buttons-div">
          <PinInput
            className="pin-input"
            values={values}
            placeholder=""
            onChange={(value, index, values) => setValues(values)}
            onComplete={() => enterRoomFromPin()}
            size="lg"
            borderColor="##c9c5c5"
            focusBorderColor="#246BFD"
          />

          <div className="or-div">
            <div className="horizontal-line"></div>
            <h3 className="or">או</h3>
            <div className="horizontal-line"></div>
          </div>

          <button
            className="create-room-button-index"
            onClick={() => setShowCreateDialog(true)}
          >
            צור חדר חדש +
          </button>
        </div>
      </div>
    </div>
  );
}

export default EnterRoomIntro;
