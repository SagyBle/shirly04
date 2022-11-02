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
import ActiveUsers from "./ActiveUsers";

const style = {
  main: `flex flex-col p-[10px]`,
  button: `bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`,
  home: `bg-purple-100 hover:bg-purple-300 text-black  py-2 px-2 rounded`,
};

const Chat = (props) => {
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);

  const [playingNext, setPlayingNext] = useState("");
  // const [playingNow, setPlayingNow] = useState('');
  const [askedBy, setAskedBy] = useState("");
  const [playedSongs, setPlayedSongs] = useState([]);

  const [isAdmin, setIsAdmin] = useState(false);

  const { id } = useParams();

  const scroll = useRef();

  const navigate = useNavigate();

  const tryFunction = async () => {
    console.log("try function started!");
    const docRef = doc(db, "rooms", "room1667145166870");
    // setDoc(docRef, { users: [...users, "moshe"] });
    const docSnap = await getDoc(docRef);
    // TODO: Find better solution using arrayUnion
    // let newUsers = [...docSnap.data().users, "yusuf"];
    // setDoc(docRef, { users: newUsers });
    // if (docSnap.exists()) {
    //   console.log("Document data:", docSnap.data().users);
    // } else {
    //   // doc.data() will be undefined in this case
    //   console.log("No such document!");
    // }
  };

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

  // creating room database: mesasages and users
  useEffect(() => {
    console.log("running useEffect creating room");
    async function createRoom() {
      console.log(id);
      const docRef1 = doc(db, `rooms/room${id}/messages`, "examplemessage1");
      await setDoc(docRef1, { title: "title1", artist: "artist1" });

      // const docRef2 = doc(db, `rooms/room${id}/users`, 'firstuser');
      // await addDoc(docRef2, { name: 'moshe', photo: 'moshephoto' });
    }
    createRoom();
  }, []);

  const moveNext = async () => {
    if (messages.length > 0) {
      setPlayingNext(messages[0].text);
      setAskedBy(messages[0].name);

      // TODO: code duplication from DeleteMessage inner function
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

    // work with history
    // let updatedPlayedSongs = playedSongs.push(playingNext)
    // setPlayedSongs(updatedPlayedSongs)
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
      <h1>Room Number: {id}</h1>
      
      <Song playingNow={playingNext} />

      {messages.length > 0 && <h2>Playing Next: {messages[0].text} </h2>}
      <h3>Asked by: {askedBy}</h3>

      <button onClick={() => moveNext()} className={style.button}>
        Move Next!
      </button>
      <h1>רשימת הבקשות</h1>
      <main className={style.main}>
        {messages &&
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        <SendMessage roomID={id} />
      </main>

      <span ref={scroll}></span>

      <button onClick={() => tryFunction()}>Try Function</button>
      <ActiveUsers roomID={id}/>
      {/* { history && <History history={history}/>} */}
    </>
  );
};

export default Chat;
