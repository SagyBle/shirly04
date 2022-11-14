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
import './styles/History.css'



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

  const handleButtonX = async (message)=>{
    console.log(`X pressed! Remove ${message.text} from history list in room number ${props.rid}`)
    console.log(`Message id is: ${message.id}`);
    const docref = doc(db, `rooms/room${props.rid}/history`, message.id);
    
    // get doc to see if he exists (so we can add his full profile to banned users) already left
    const docSnap = await getDoc(docref);

    if (docSnap.exists()){
      deleteDoc(docref)
        .then(() => {
          console.log(`${message.text} removed from history list`);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    else{
      console.log(`Error: ${message.text} has not been removed from history list Error`);
    }
    
  };
    
    
    return (
        <div>
          <h1>History:</h1>
           {history &&
            history.map((message) => (
              <div>
                <img onClick={()=>handleButtonX(message)} className='x-icon' src="https://uxwing.com/wp-content/themes/uxwing/download/checkmark-cross/red-x-icon.png" alt="" />
                <p>{message.text}</p>
              </div>

          ))}
          
        </div>

    )
}

export default History



