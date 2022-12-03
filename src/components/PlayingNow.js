import React from 'react'
import { useState, useEffect } from 'react';
import { db } from "../firebase";
import {
  doc,
  getDoc,
} from "firebase/firestore";

function PlayingNow(props) {
  const [song, setSong] = useState(null);
  
  const getSongData = async () => {
    const docref = doc(db, `rooms/room${props.roomID}/history/${props.songID}`);
    const docSnap = await getDoc(docref);
    
    // console.log("data: "+ docSnap.data());
    return docSnap.data();
  }

  const tryPlayingNow = async () =>{
    const docref = doc(db, `rooms/room${props.roomID}/history/${props.songID}`);
    const docSnap = await getDoc(docref);
    // setSong(docSnap.data());
    console.log("way to song: "+`rooms/room${props.roomID}/history/${props.songID}`);
    // console.log("data: "+ docSnap.data().PlayingNow);
  }

  

  useEffect(()=>{
    getSongData()
      .then(()=>{console.log("get song data fullfiled");})
      .catch(()=>{console.log("some error occured");})
  },[]);

  return (
    <div>
      <p>playing now id: {props.songID}</p>
      <button onClick={tryPlayingNow}>try playing now</button>
    </div>
  )
}

export default PlayingNow
