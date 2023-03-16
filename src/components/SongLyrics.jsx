import React from "react";
import { onSnapshot } from "@firebase/firestore";
import { useState, useEffect } from "react";
import { doc } from "firebase/firestore";
import { db } from "../firebase";

import { getSongID } from "../data/preview";

import "./styles/SongLyrics.css";

function SongLyrics({ rid }) {
  const [currHeader, setCurrHeader] = useState("notDef");
  const [songName, setSongName] = useState("");
  const [artist, setArtist] = useState("");
  const [lyrics, setLyrics] = useState([""]);

  useEffect(() => {
    onSnapshot(doc(db, `rooms/room${rid}`), (snapshot) => {
      setCurrHeader(snapshot.data().currPlayingNow);
    });
  }, []);

  useEffect(() => {
    async function getLyrics() {
      const songID = getSongID(currHeader);
      console.log(
        `get lyrics activated! with ${currHeader}, got id: ${songID}`
      );
      const api_url = "https://theminhelet.com";
      fetch(`${api_url}/song?id=${songID}`)
        .then((response) => response.json())
        .then((data) => {
          setLyrics(data.lyrics);
          setArtist(data.artist);
          setSongName(data.song_name);

          console.log(lyrics);
        })
        .catch((error) => console.error(error));
    }
    getLyrics();
  }, [currHeader]);

  return (
    <div className="lyrics-main-div">
      <div className="song-header-div">
        <div className="author-name-div">
          <h5 className="author-name-h5">{artist} / </h5>
        </div>
        <div className="song-name-div">
          <h1 className="song-name-h1">{songName}</h1>
        </div>
      </div>
      <div className="song-lyrics-div">
        {/* <p className="lyrics-text">{lyrics}</p> */}
        {lyrics.map((line) => (
          <p className="lyrics-text">{line}</p>
        ))}
      </div>
    </div>
  );
}

export default SongLyrics;
