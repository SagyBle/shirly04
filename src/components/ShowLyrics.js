import React, { useState, useEffect } from 'react'
import {
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";



function ShowLyrics() {

  const [showLyrics, setShowLyrics] = useState(true);

  const unsubShowLyrics = onSnapshot(doc(db, `rooms/room${id}`), (doc) => {
      setShowLyrics(doc.data().showLyrics);
      console.log("show lyrics: " + doc.data().showLyrics);
  });

  return (
    <div>
      {showLyrics ? <p></p>: null}
      
    </div>
  )
}

export default ShowLyrics
