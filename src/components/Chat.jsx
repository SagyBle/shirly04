import React, { useState, useEffect, useRef } from "react";
import Message from "./Message";
import SendMessage from "./SendMessage";
import { db, auth } from "../firebase";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import Song from "./Song";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ActiveUsers from "./ActiveUsers";
import { useAuthState } from 'react-firebase-hooks/auth'


const style = {
  main: `flex flex-col p-[10px]`,
  button: `bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`,
  home: `bg-purple-100 hover:bg-purple-300 text-black  py-2 px-2 rounded`,
};

const Chat = (props) => {


  


  const [messages, setMessages] = useState([]);

  const [playingNext, setPlayingNext] = useState("");

  const [askedBy, setAskedBy] = useState("");

  const [amIAdmin, setAmIAdmin] = useState(false);
    const [amIOriginallyAdmin, setAmIOriginallyAdmin] = useState(false);


  const { id } = useParams();

  const [user] = useAuthState(auth);

  const scroll = useRef();

  const navigate = useNavigate();


  // get amIAdmin field from firestore
  const unsubAdmin = onSnapshot(doc(db, `rooms/room${id}/users`, user.uid), (doc) => {
      console.log("Current data amIAdmin?: ", doc.data().isAdmin);
      setAmIAdmin(doc.data().isAdmin)
  });

  // Update isAdmin field
  const beAdminAgain = () => {
    updateDoc(doc(db, `rooms/room${id}/users/${user.uid}`), {isAdmin: true});
  };

  // Get amIOriginalAdmin from firestore
  const unsubOriginal = onSnapshot(doc(db, `rooms/room${id}/users`, user.uid), (doc) => {
      console.log("Current data amIOriginalAdmin?: ", doc.data().originalAdmin);
      setAmIOriginallyAdmin(doc.data().originalAdmin)
  });


  // set messages 
  useEffect(() => {
    const q = query(
      collection(db, `rooms/room${id}/messages`),
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
    return () => unsubscribe();
  }, []);

  // creating room document: mesasages and users as subdocument
  useEffect(() => {
    console.log("running useEffect creating room");
    async function createRoom() {
      const docRef1 = doc(db, `rooms/room${id}/messages`, "examplemessage1");
      await setDoc(docRef1, { title: "title1", artist: "artist1" });
    }
    createRoom();
  }, []);

  // Move to next song - Admin function only
  const moveNext = async () => {
    if (messages.length > 0) {
      setPlayingNext(messages[0].text);
      setAskedBy(messages[0].name);

      const docref = doc(db, `rooms/room${id}/messages`, messages[0].id);
      const subMessages = messages.slice(1);
      setMessages(subMessages);

      deleteDoc(docref)
        .then(() => {
          console.log("Entire document has been deleted successfully.");
        })
        .catch((error) => {
          console.log(error);
        });
    }

  };

  return (
    <>
      <button
        className={style.home}
        onClick={() => {
          navigate("/");
        }}
      >
        Home
      </button>
      <p>Hi, {user.displayName}</p>
      {amIAdmin? <p>Logged in as an Admin</p> : <p>Logged in as <a href=""></a> User</p>}
      <div>
        {(amIOriginallyAdmin && !amIAdmin)? <p>you are the room creator, do you want to be an admin again?</p> : null}
        {(amIOriginallyAdmin && !amIAdmin)? <button onClick={beAdminAgain}>Be room admin again</button> : null}
      </div>
      <h1>Room Number: {id}</h1>
      
      <Song playingNow={playingNext} />

      {messages.length > 0 && <h2>Playing Next: {messages[0].text} </h2>}
      <h3>Asked by: {askedBy}</h3>

      {amIAdmin && <button onClick={() => moveNext()} className={style.button}>
        Move Next!
      </button>}
      <h1>רשימת הבקשות</h1>
      <main className={style.main}>
        {messages &&
          messages.map((message) => (
            <Message key={message.id} message={message} rid={id} />
          ))}
        <SendMessage roomID={id} />
      </main>

      <span ref={scroll}></span>

      <ActiveUsers roomID={id} amIAdmin={amIAdmin} uid={user.uid}/>
    </>
  );
};

export default Chat;
