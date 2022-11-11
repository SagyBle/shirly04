import React, { useState, useEffect } from 'react'
import Message from './Message'
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Song from './Song';



function History(props) {

  const [history, setHistory] = useState([]);

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
      const docRef1 = doc(db, `rooms/room${props.rid}/history`, "examplemessage1");
      await setDoc(docRef1, { title: "title1", artist: "artist1" });
    }
    createHistory();
  }, []);
    
    
    return (
        <div>
          <h1>History:</h1>
           {history &&
            history.map((message) => (
            <p>{message.text}</p>
            
          ))}
        </div>

    )
}

export default History



