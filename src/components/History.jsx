import React, { useState, useEffect } from "react";
import Message from "./Message";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import "./styles/History.css";
import TrashBin from "./styles/icons/trash-bin.png";

function History(props) {
  const history = props.history;
  const setHistory = props.setHistory;

  // set history
  useEffect(() => {
    const q = query(
      collection(db, `rooms/room${props.rid}/history`),
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let history = [];
      querySnapshot.forEach((doc) => {
        history.push({ ...doc.data(), id: doc.id });
      });
      setHistory(history);
    });
    return () => unsubscribe();
  }, []);

  // creating room document: mesasages and users as subdocument
  useEffect(() => {
    async function createHistory() {
      const docRef1 = doc(
        db,
        `rooms/room${props.rid}/history`,
        "examplemessage1"
      );
      await setDoc(docRef1, { title: "title1", artist: "artist1" });
    }
    createHistory();
  }, []);

  const handleButtonX = async (message) => {
    console.log(
      `X pressed! Remove ${message.text} from history list in room number ${props.rid}`
    );
    console.log(`Message id is: ${message.id}`);
    const docref = doc(db, `rooms/room${props.rid}/history`, message.id);

    // get doc to see if he exists (so we can add his full profile to banned users) already left
    const docSnap = await getDoc(docref);

    if (docSnap.exists()) {
      deleteDoc(docref)
        .then(() => {
          console.log(`${message.text} removed from history list`);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log(
        `Error: ${message.text} has not been removed from history list Error`
      );
    }
  };

  const cleanAll = async () => {
    console.log("pressed clean all");
    history.map((message) => {
      handleButtonX(message);
    });
  };

  const getSongName = (item) => {
    const array = item.split(" - ");
    return array[0];
  };

  const getArtistName = (item) => {
    const array = item.split(" - ");
    return array[1];
  };

  return history.map((message) => {
    return (
      <div className="history-song-div">
        <div className="trash-bin-icon-div">
          <img
            onClick={() => handleButtonX(message)}
            className="trash-bin-icon"
            src={TrashBin}
            alt=""
          />
        </div>
        <div className="history-song-info-div">
          <div className="history-song-header-div">
            <p className="song-header-p">{getSongName(message.text)}</p>
          </div>
          <div className="history-song-author-div">
            <p className="song-author-p">{getArtistName(message.text)}</p>
          </div>
        </div>
      </div>
    );
  });
}

export default History;
