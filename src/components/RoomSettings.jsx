import React from "react";
import Toggle from "./Toggle";

function RoomSettings({
  displaySettings,
  setDisplaySettings,
  roomName,
  roomDescription,
  users,
  maxParticipantsQuantity,
  showLyrics,
  rid,
  addRequests,
  isEntranceAllowed,
}) {
  return (
    <div className="room-setting-div room-setting-div-open">
      <div className="room-header-div">
        <button
          onClick={() => setDisplaySettings(!displaySettings)}
          className="open-setting-button"
        >
          סגור
        </button>
        <h4 className="room-header-h4">{roomName}</h4>
      </div>

      <span className="room-desc">{roomDescription}</span>
      <div className="settings-div">
        <div className="setting-line-div">
          <div className="avatars-button-div">
            <button className="invite-button">הזמן</button>
            <div className="avatar-group room-setting-avatar-group">
              {users.map((user) => {
                return (
                  <div key={user.uid} className="avatar">
                    <img src={user.photoURL} alt="" />
                  </div>
                );
              })}
            </div>
          </div>
          <span className="room-setting-toggle-header-p">
            {users.length}/{maxParticipantsQuantity} משתמשים בחדר
          </span>
        </div>

        <div className="setting-line-div">
          <div className="avatar-group">
            {users
              .filter((user) => user.isAdmin)
              .map((user) => {
                return (
                  <div className="avatar">
                    <img src={user.photoURL} alt="" />
                  </div>
                );
              })}
          </div>

          <span className="room-setting-toggle-header-p">מנהל החדר</span>
        </div>

        <div className="setting-line-div ">
          <Toggle
            toggle={showLyrics}
            rid={rid}
            dataT={{ showLyrics: true }}
            dataF={{ showLyrics: false }}
          />

          <span className="room-setting-toggle-header-p">תצוגת מילים</span>
        </div>
        <div className="setting-line-div">
          <Toggle
            toggle={addRequests}
            rid={rid}
            dataT={{ addRequests: true }}
            dataF={{ addRequests: false }}
          />

          <span className="room-setting-toggle-header-p">הוספת שירים</span>
        </div>
        <div className="setting-line-div">
          <Toggle
            toggle={isEntranceAllowed}
            rid={rid}
            dataT={{ isEntranceAllowed: true }}
            dataF={{ isEntranceAllowed: false }}
          />
          <span className="room-setting-toggle-header-p">הצטרפות לחדר</span>
        </div>
      </div>
    </div>
  );
}

export default RoomSettings;
