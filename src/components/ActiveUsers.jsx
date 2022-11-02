import React, { useState, useEffect, useRef } from "react";
import Message from "./Message";
import SendMessage from "./SendMessage";
import { db } from "../firebase";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  setDoc,
  addDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import Song from "./Song";
import History from "./History";
// import songs from '../data/songs.json'
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import User from "./User";
import './ActiveUsers.css';

const style = {
  
  button: `bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`,
  home: `bg-purple-100 hover:bg-purple-300 text-black  py-2 px-2 rounded`,
};

const ActiveUsers = (props) => {
  const [users, setUsers] = useState([]);


  const [askedBy, setAskedBy] = useState("");
  

  const [isAdmin, setIsAdmin] = useState(false);


  const scroll = useRef();

  const navigate = useNavigate();

  const tryFunction = async () => {
    console.log("try function started from activr users!");
    // const docRef = doc(db, "rooms", `room${props.roomID}`);
    // const docSnap = await getDoc(docRef);
    console.log(users)
  };

  useEffect(() => {
    const q = query(
      collection(db, `rooms/room${props.roomID}/users`),
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id });
      });
      setUsers(users);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>

      <h1>Room Number: {props.roomID}</h1>
      
      <h1>Users:</h1>
      <main className="main">
        {users &&
          users.map((user) => (
            <User key={user.id} user={user} />
          ))}
          
          
      </main>

      <span ref={scroll}></span>

      <button onClick={() => tryFunction()}>Try Function</button>
      
    </>
  );
};

export default ActiveUsers;
