import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import SendMessage from './SendMessage';
import { db } from '../firebase';
import { query, collection, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import Song from './Song';
import History from './History';
// import songs from '../data/songs.json'

const style = {
  main: `flex flex-col p-[10px]`,
  button: `bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`,
};

const Chat = (props) => {

  const [messages, setMessages] = useState([]);
  const [playingNext, setPlayingNext] = useState('');
  const [playingNow, setPlayingNow] = useState('');
  const [askedBy, setAskedBy] = useState('');
  const [playedSongs, setPlayedSongs] = useState([]);

  const scroll = useRef();

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
    return () => unsubscribe();
  }, []);

  const moveNext = async () => {
    if (messages.length > 0) {
      setPlayingNext(messages[0].text);
      setAskedBy(messages[0].name);

      // TODO: code duplication from DeleteMessage inner function
      const docref = doc(db, "messages", messages[0].id)
      // console.log(messages[0].id)
      deleteDoc(docref).then(() => {
        console.log("Entire document has been deleted successfully.")
      }).catch(error => { console.log(error) })

    }

    // work with history
    let updatedPlayedSongs = playedSongs.push(playingNext)
    setPlayedSongs(updatedPlayedSongs)
  }

  return (
    <>
      {(messages.length > 0 ) && <Song playingNow={playingNext} />}
      {(messages.length > 0) && <h2>Playing Next: {messages[0].text} </h2>} 
      <h3>Asked by: {askedBy}</h3>

      <button onClick={() => moveNext()} className={style.button}>Move Next!</button>
      <h1>רשימת הבקשות</h1>
      <main className={style.main}>
        {messages &&
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        <SendMessage />
      </main>

      <span ref={scroll}></span>
      { playedSongs && <History playedSongs={playedSongs}/>}
    </>
  );
};

export default Chat;

