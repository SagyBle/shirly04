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
  getDoc,
  deleteDoc,
  updateDoc,
  setDoc,
  addDoc,
  serverTimestamp,

} from "firebase/firestore";
import Song from "./Song";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ActiveUsers from "./ActiveUsers";
import { useAuthState } from 'react-firebase-hooks/auth';
import CopyLink from "./CopyLink"
import SendWhatsapp from "./SendWhatsapp";  
import ChangeRoomName from "./ChangeRoomName";
import History from "./History";
import Loading from "./Loading";


const style = {
  main: `flex flex-col p-[10px]`,
  button: `bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`,
  home: `bg-purple-100 hover:bg-purple-300 text-black  py-2 px-2 rounded`,
};

const Chat = (props) => {

  const [messages, setMessages] = useState([]);
  // const [bannedUsers, setBannedUsers] = useState([]);
  // const [getTheFuckOut, setGetTheFuckOut] = useState(false);

  const [allowPeopleIn, setAllowPeopleIn] = useState(false);
  const [allowAddingRequsets, setAllowAddingRequsets] = useState(false);

  const [playingNext, setPlayingNext] = useState("");

  const [askedBy, setAskedBy] = useState("");

  const [amIAdmin, setAmIAdmin] = useState(false);
  const [amIOriginallyAdmin, setAmIOriginallyAdmin] = useState(false);

  const [roomName, setRoomName] = useState("");
  const [showLyrics, setShowLyrics] = useState(true);
  const [addRequests, setAddRequests] = useState(true);
  const [enterUsers, setEnterUSers] = useState(true);
  const [isRepeatAllowed, setIsRepeatAllowed] = useState(false);




  const { id } = useParams();

  const [user] = useAuthState(auth);

  const scroll = useRef();

  const navigate = useNavigate();

  // // set banned users 
  // useEffect(() => {
  //   const q = query(
  //     collection(db, `rooms/room${id}/bannedUsers`),
  //     orderBy("timestamp")
  //   );
  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     let bannedUsers = [];
  //     querySnapshot.forEach((doc) => {
  //       messages.push({ ...doc.data(), id: doc.id });
  //     });
  //     setBannedUsers(bannedUsers);
  //   });
  //   return () => unsubscribe();
  // }, []);

  // // if bannedUsers array changed, check if its me, and go out if so.
  // useEffect( async ()=>{
  //   const docRef = doc(db, `rooms/room${id}/bannedUsers/${user.uid}`)
  //   const docSnap = await getDoc(docRef);
  //   // if (docSnap.exists()){
  //   //   setGetTheFuckOut(true);
  //   // }
  // },[bannedUsers]);



  // get amIAdmin field from firestore
  const unsubAdmin = onSnapshot(doc(db, `rooms/room${id}/users`, user.uid), (doc) => {
      console.log("Current data amIAdmin?: ", doc.data().isAdmin);
      setAmIAdmin(doc.data().isAdmin)
  });

  // Update isAdmin field
  const beAdminAgain = () => {
    updateDoc(doc(db, `rooms/room${id}/users/${user.uid}`), {isAdmin: true});
  };


  // toggle up showLyrics field
  const toggleUpShowLyrics = () => {
    updateDoc(doc(db, `rooms/room${id}`), {showLyrics: true});
  };

  // toggle down showLyrics field
  const toggleDownShowLyrics = () => {
    updateDoc(doc(db, `rooms/room${id}`), {showLyrics: false});
  };

   // toggle up addRequests field
  const toggleUpAddRequests = () => {
    updateDoc(doc(db, `rooms/room${id}`), {addRequests: true});
  };

  // toggle down addRequests field
  const toggleDownAddRequests = () => {
    updateDoc(doc(db, `rooms/room${id}`), {addRequests: false});
  };

   // toggle up enterUsers field
  const toggleUpEnterUsers = () => {
    updateDoc(doc(db, `rooms/room${id}`), {enterUsers: true});
  };

  // toggle down enterUsers field
  const toggleDownEnterUsers = () => {
    updateDoc(doc(db, `rooms/room${id}`), {enterUsers: false});
  };

    // toggle up isRepeatAllowed field
  const toggleUpIsRepeatAllowed = () => {
    updateDoc(doc(db, `rooms/room${id}`), {isRepeatAllowed: true});
  };

  // toggle down isRepeatAllowed field
  const toggleDownIsRepeatAllowed = () => {
    updateDoc(doc(db, `rooms/room${id}`), {isRepeatAllowed: false});
  };

  // Get amIOriginalAdmin from firestore
  const unsubOriginal = onSnapshot(doc(db, `rooms/room${id}/users`, user.uid), (doc) => {
      console.log("Current data amIOriginalAdmin?: ", doc.data().originalAdmin);
      setAmIOriginallyAdmin(doc.data().originalAdmin)
  });


  // Get room name, show lyrics, add requests and enter users.
    const unsubRoomName = onSnapshot(doc(db, `rooms/room${id}`), (doc) => {
      setRoomName(doc.data().roomName);
      setShowLyrics(doc.data().showLyrics);
      setAddRequests(doc.data().addRequests);
      setEnterUSers(doc.data().enterUsers);
      setIsRepeatAllowed(doc.data().isRepeatAllowed)
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
      const docRef2 = doc(db, `rooms/room${id}/bannedUsers`, "examplemessage1");
      await setDoc(docRef2, { title: "banni the banned" });
    }
    createRoom();
    props.setIsLoading(false);
  }, []);

  // Move to next song - Admin function only
  const moveNext = async () => {
    if (messages.length > 0) {
      setPlayingNext(messages[0].text);
      setAskedBy(messages[0].name);
      const data = messages[0];

      const docref = doc(db, `rooms/room${id}/messages`, messages[0].id);
      
      await addDoc(collection(db, `rooms/room${id}/history`), data)


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

  const adminToUser = async () => {
    console.log("starting adminToUser!");
    const data = {isAdmin: false}
    const docRef = doc(db, `rooms/room${id}/users/${user.uid}`);
    await updateDoc(docRef, data)
  };


  const tryFunction = () => {
    console.log("this is show lyrics: " + showLyrics);
  }

  

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
      {props.isLoading && <Loading/>}

      <p>Hi, {user.displayName}</p>
      {amIAdmin ? <p>Logged in as an Admin</p> : <p>Logged in as <a href=""></a> User</p>}
      {amIAdmin ? <button onClick={adminToUser}>Become a User</button> : null} 
      <div>
        <h1>Room Name: {roomName}</h1>
        {amIAdmin ? <ChangeRoomName rid={id}/> : null}

        <h2>Room Number: {id}</h2>
        
      </div>

      {amIAdmin? <div>
        {showLyrics ?
        <button onClick={toggleDownShowLyrics}>Hide Lyrics</button>:
        <button onClick={toggleUpShowLyrics}>Show Lyrics</button>
        }
        {addRequests ?
        <button onClick={toggleDownAddRequests}>Disable Adding Requests</button>:
        <button onClick={toggleUpAddRequests}>Allow Adding Requests</button>
        }
        {enterUsers ?
        <button onClick={toggleDownEnterUsers}>Disable Users In</button>:
        <button onClick={toggleUpEnterUsers}>Allow Users In</button>
        }
        {isRepeatAllowed ?
        <button onClick={toggleDownIsRepeatAllowed}>Disable Song Repeat</button>:
        <button onClick={toggleUpIsRepeatAllowed}>Allow Song Repeat</button>
        }
        

      </div> : null}
      {showLyrics? <Song playingNow={playingNext} /> : <h1>Lyrics display was disabled by the admin</h1>}

      {messages.length > 0 && <h2>Playing Next: {messages[0].text} </h2>}
      <h3>Asked by: {askedBy}</h3>
      {amIAdmin && showLyrics && <button onClick={() => moveNext()} className={style.button}>
        Move Next!
      </button>}
      <h1>רשימת הבקשות</h1>
      <main className={style.main}>
        {messages &&
          messages.map((message) => (
            <Message key={message.id} message={message} rid={id} />
          ))}
        <button onClick={()=>{tryFunction()}}>try</button>
        {addRequests ? <SendMessage roomID={id} /> : <p>Adding song requests was disabled by admin.</p>}
      </main>

      <span ref={scroll}></span>
      <ActiveUsers roomID={id} amIAdmin={amIAdmin} uid={user.uid}/>
      <div>
        <CopyLink rid={id}/>
        <SendWhatsapp rid={id} />
      </div>
      <History rid={id}/>
    </>
  );
};

export default Chat;
