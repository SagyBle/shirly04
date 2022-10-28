import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import SendMessage from './SendMessage';
import { db } from '../firebase';
import { query, collection, orderBy, onSnapshot, doc, deleteDoc, setDoc } from 'firebase/firestore';
import Song from './Song';
import History from './History';
// import songs from '../data/songs.json'
import { useParams } from 'react-router-dom';


const style = {
  main: `flex flex-col p-[10px]`,
  button: `bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`,
};

const Chat = (props) => {

  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);

  const [playingNext, setPlayingNext] = useState('');
  // const [playingNow, setPlayingNow] = useState('');
  const [askedBy, setAskedBy] = useState('');
  const [playedSongs, setPlayedSongs] = useState([]);

  const { id } = useParams();

  const scroll = useRef();

  // useEffect(() => {
  //   const q = query(collection(db, 'messages'), orderBy('timestamp'));
  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     let messages = [];
  //     querySnapshot.forEach((doc) => {
  //       messages.push({ ...doc.data(), id: doc.id });
  //     });
  //     setMessages(messages);
  //   });
  //   return () => unsubscribe();

    
  // }, []);

    useEffect(() => {
    const q = query(collection(db, `rooms/room${id}/messages`), orderBy('timestamp'));
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
  useEffect(()=>{
    console.log("running useEffect creating room");
    async function createRoom(){
      console.log(id);
      const docRef1 = doc(db, `rooms/room${id}/messages`, 'examplemessage1');
      await setDoc(docRef1, { title: 'title1', artist: 'artist1' });

      const docRef2 = doc(db, `rooms/room${id}/users`, 'firstuser');
      await setDoc(docRef2, { name: 'moshe', photo: 'moshephoto' });
    }
    createRoom(); 
  },[])

  const moveNext = async () => {
    if (messages.length > 0) {
      setPlayingNext(messages[0].text);
      setAskedBy(messages[0].name);

      // TODO: code duplication from DeleteMessage inner function
      const docref = doc(db, "messages", messages[0].id)
      console.log(messages[0].id)

      let newHistory = [...history, messages[0]];
      console.log("this is newHistory:");
      console.log(newHistory);
      setHistory(newHistory);
      const subMessages = messages.slice(1);
      // console.log(subMessages);
      // setHistory(updatedHistory);
      setMessages(subMessages);
      
    }

    // work with history
    // let updatedPlayedSongs = playedSongs.push(playingNext)
    // setPlayedSongs(updatedPlayedSongs)
  }

  return (
    <>
      <h1>Room Number: {id}</h1>
      <Song playingNow={playingNext} />

      {(messages.length > 0) && <h2>Playing Next: {messages[0].text} </h2>} 
      <h3>Asked by: {askedBy}</h3>

      <button onClick={() => moveNext()} className={style.button}>Move Next!</button>
      <h1>רשימת הבקשות</h1>
      <main className={style.main}>
        {messages &&
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        <SendMessage roomID={id} />
      </main>

      <span ref={scroll}></span>
      {/* { history && <History history={history}/>} */}
    </>
  );
};

export default Chat;

