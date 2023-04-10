import React, { useEffect, useState } from "react";
import SendMessage from "./SendMessage";
import History from "./History";
import Message from "./Message";
import RoomSettings from "./RoomSettings";

function SognsFeed({
  rid,
  messages,
  addRequests,
  setDisplayNextSongs,
  displayNextSongs,
  amIAdmin,
  showLyrics,
  moveNext,
  history,
  setHistory,
  users,
  roomDescription,
  displaySettings,
  setDisplaySettings,
  roomName,
  maxParticipantsQuantity,
  isEntranceAllowed,
}) {
  return (
    <div className="left-side">
      <SendMessage
        messages={messages}
        history={history}
        rid={rid}
        addRequests={addRequests}
      />

      <div className="main-left-side">
        <div className="choose-songs-or-history-div">
          <button
            onClick={() => setDisplayNextSongs(false)}
            className={
              displayNextSongs ? "button-history" : "button-history-active"
            }
          >
            היסטוריית החדר
          </button>
          <button
            onClick={() => setDisplayNextSongs(true)}
            className={
              displayNextSongs ? "button-history-active" : "button-history"
            }
          >
            השירים הבאים
          </button>
        </div>
        {amIAdmin && amIAdmin && showLyrics && displayNextSongs && (
          <button className="move-next-button" onClick={() => moveNext()}>
            עבור לשיר הבא
          </button>
        )}

        {displayNextSongs ? (
          <div className="list-of-messages-div">
            <ul className="listtttt">
              {messages &&
                messages?.map((message) => (
                  <Message key={message.id} message={message} rid={rid} />
                ))}
            </ul>
          </div>
        ) : (
          <div className="list-of-messages-div">
            <History
              history={history}
              setHistory={setHistory}
              amIAdmin={amIAdmin}
              rid={rid}
            />
          </div>
        )}
        {displaySettings ? (
          <RoomSettings
            displaySettings={displaySettings}
            setDisplaySettings={setDisplaySettings}
            roomName={roomName}
            roomDescription={roomDescription}
            users={users}
            maxParticipantsQuantity={maxParticipantsQuantity}
            showLyrics={showLyrics}
            rid={rid}
            addRequests={addRequests}
            isEntranceAllowed={isEntranceAllowed}
          />
        ) : (
          <div className="room-setting-div">
            <div className="room-header-div">
              <button
                onClick={() => setDisplaySettings(!displaySettings)}
                className="open-setting-button"
              >
                פתח הגדרות
              </button>
              <h4 className="room-header-h4">{roomName}</h4>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SognsFeed;
