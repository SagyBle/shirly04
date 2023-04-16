import React from "react";
import { onSnapshot } from "@firebase/firestore";
import { useState, useEffect } from "react";
import { doc } from "firebase/firestore";
import { db } from "../firebase";

import { getSongID } from "../data/preview";

import "./styles/SongLyrics.css";

function SongLyrics({ rid, currSongRef }) {
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
        })
        .catch((error) => console.error(error));
    }
    getLyrics();
  }, [currHeader]);

  const isChordElement = (element) => {
    const chordRegExp =
      /^(?:\s*)?[A-G](?:#|b)?(?:m|maj(?:7)?|4|5|6|7|9|sus4|dim)?\s*/g;
    const chordString = element;
    return chordRegExp.test(chordString);
  };

  const tryFunc = () => {};

  return (
    <div className="lyrics-main-div">
      {songName ? (
        <div className="song-header-div">
          <div className="author-name-div">
            <h5 className="author-name-h5">{artist} / </h5>
          </div>
          <div className="song-name-div">
            <h1 className="song-name-h1">{songName}</h1>
          </div>
        </div>
      ) : (
        <div className="song-header-div">
          <div className="song-name-div">
            <h1 className="song-name-h1">טוען...</h1>
          </div>
        </div>
      )}
      <div className="song-lyrics-div">
        {/* <p className="lyrics-text">{lyrics}</p> */}
        {lyrics.map((line) => (
          <p
            className={`lyrics-text ${
              isChordElement(line) ? "chord-element" : ""
            }`}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

export default SongLyrics;
