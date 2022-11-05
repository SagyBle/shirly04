import React, { useState, useEffect, useRef } from "react";
import Message from "./Message";
import SendMessage from "./SendMessage";
import { db } from "../firebase";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import User from "./User";
import './ActiveUsers.css';

const style = {
  button: `bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`,
  home: `bg-purple-100 hover:bg-purple-300 text-black  py-2 px-2 rounded`,
};


const ActiveUsers = (props) => {
  const [users, setUsers] = useState([]);

  const scroll = useRef();

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
            <User key={user.id} user={user} myuid={props.uid} amIAdmin={props.amIAdmin} roomID={props.roomID} />
          ))}
      </main>

      <span ref={scroll}></span>      
    </>
  );
};

export default ActiveUsers;
