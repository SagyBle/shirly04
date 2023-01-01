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
import PlayingNow from "./PlayingNow";
import PlayingTest from "./PlayingTest";
import Toggle from "./Toggle";

import './styles/Chat.css'
import Dugma from "./Dugma";
import TrashBin from "./styles/icons/trash-bin.png"
import Person from "./styles/images/person.jpeg"
import RightArrow from "./styles/icons/right-arrow.png"
import Logo from "./styles/images/Logo.png"
import Heart from "./styles/icons/heart.png"
import RedHeart from "./styles/icons/heart-red.png"
import Plus from "./styles/icons/add-plus.png"



// const style = {
//   main: `flex flex-col p-[10px]`,
//   button: `bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`,
//   home: `bg-purple-100 hover:bg-purple-300 text-black  py-2 px-2 rounded`,
// };

const Chat = (props) => {

  const [displaySettings, setDisplaySettings] = useState(false);
  const [displayNextSongs, setDisplayNextSongs] = useState(true); 
  const [displayRoomHistory, displayShowRoomHistory] = useState(false);

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);

  const [currPlayingNow, setCurrPlayingNow] = useState("");

  const [askedBy, setAskedBy] = useState("");

  const [amIAdmin, setAmIAdmin] = useState(false);
  const [amIOriginallyAdmin, setAmIOriginallyAdmin] = useState(false);

  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [showLyrics, setShowLyrics] = useState("");
  const [addRequests, setAddRequests] = useState(true);
  const [isEntranceAllowed, setIsEntranceAllowed] = useState(true);
  const [isRepeatAllowed, setIsRepeatAllowed] = useState(false);
  
  const [maxParticipantsQuantity, setMaxParticipantsQuantity] = useState(null);

  const tryHis = [
    "אהבתיה - שלמה ארצי",
    "בוא - עברי לידר",
    "גן סגור - הכבש השישה עשר",
  ];

  const { id } = useParams();
  const rid = id;

  const [user] = useAuthState(auth);
  const uid = user.uid;

  const scroll = useRef();
  const [isTyping, setIsTyping] = useState(false);


  const navigate = useNavigate();


  // get amIAdmin field from firestore
  const unsubAdmin = onSnapshot(doc(db, `rooms/room${rid}/users`, uid), (doc) => {
      console.log("Current data amIAdmin?: ", doc.data().isAdmin);
      setAmIAdmin(doc.data().isAdmin)
  });

  // contin here
    // get amIAdmin field from firestore
  const unsubMaxParticipantsQuantity = onSnapshot(doc(db, `rooms/room${rid}`), (doc) => {
      setMaxParticipantsQuantity(doc.data().roomMaxParticipantsQuantity)
  });

  // Update isAdmin field
  const beAdminAgain = () => {
    updateDoc(doc(db, `rooms/room${rid}/users/${uid}`), {isAdmin: true});
  };


  // // toggle up showLyrics field
  // const toggleUpShowLyrics = () => {
  //   updateDoc(doc(db, `rooms/room${rid}`), {showLyrics: true});
  // };

  // // toggle down showLyrics field
  // const toggleDownShowLyrics = () => {
  //   updateDoc(doc(db, `rooms/room${rid}`), {showLyrics: false});
  // };

   // toggle up addRequests field
  const toggleUpAddRequests = () => {
    updateDoc(doc(db, `rooms/room${rid}`), {addRequests: true});
  };

  // toggle down addRequests field
  const toggleDownAddRequests = () => {
    updateDoc(doc(db, `rooms/room${rid}`), {addRequests: false});
  };

  //  // toggle up enterUsers field
  // const toggleUpEnterUsers = () => {
  //   updateDoc(doc(db, `rooms/room${rid}`), {enterUsers: true});
  // };

  // // toggle down enterUsers field
  // const toggleDownEnterUsers = () => {
  //   updateDoc(doc(db, `rooms/room${rid}`), {enterUsers: false});
  // };

    // toggle up isRepeatAllowed field
  const toggleUpIsRepeatAllowed = () => {
    updateDoc(doc(db, `rooms/room${rid}`), {isRepeatAllowed: true});
  };

  // toggle down isRepeatAllowed field
  const toggleDownIsRepeatAllowed = () => {
    updateDoc(doc(db, `rooms/room${rid}`), {isRepeatAllowed: false});
  };

  // Get amIOriginalAdmin from firestore
  const unsubOriginal = onSnapshot(doc(db, `rooms/room${rid}/users`, uid), (doc) => {
      console.log("Current data amIOriginalAdmin?: ", doc.data().originalAdmin);
      setAmIOriginallyAdmin(doc.data().originalAdmin)
  });

  // Get room name, show lyrics, add requests and enter users.
    const unsubRoomName = onSnapshot(doc(db, `rooms/room${rid}`), (doc) => {
      setRoomName(doc.data().roomName);
      setRoomDescription(doc.data().roomDescription)
      setShowLyrics(doc.data().showLyrics);
      setAddRequests(doc.data().addRequests);
      setIsEntranceAllowed(doc.data().isEntranceAllowed);
      setIsRepeatAllowed(doc.data().isRepeatAllowed);
      setCurrPlayingNow(doc.data().currPlayingNow);
  });

  // set messages 
  useEffect(() => {
    const q = query(
      collection(db, `rooms/room${rid}/messages`),
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
      const docRef1 = doc(db, `rooms/room${rid}/messages`, "examplemessage1");
      await setDoc(docRef1, { title: "title1", artist: "artist1" });
    }
    createRoom();
    props.setIsLoading(false);
  }, []);

  // Move to next song - Admin function only
  const moveNext = async () => {
    if (messages.length > 0) {

      updateDoc(doc(db, `rooms/room${rid}`),{currPlayingNow: messages[0].text});
      const data = messages[0];   
      await setDoc(doc(db, `rooms/room${rid}/history/${messages[0].id}`), data)
      const docref = doc(db, `rooms/room${rid}/messages`, messages[0].id);
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
    const data = {isAdmin: false}
    const docRef = doc(db, `rooms/room${rid}/users/${uid}`);
    await updateDoc(docRef, data)
  };


  const tryFunction = () => {
    console.log("start printing messages[0]:");
    console.log(messages[0]);      
    console.log("end printing messages[0]:");
  }

  const toggleDisplaySettings = () => {
    setDisplaySettings(!displaySettings)
    console.log("display setting: " + displaySettings);
  }

  let heart = false;

  

  return (
    <>
    <div>
        <button
        // className={}
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
        <p>Room Description: {roomDescription}</p>
        {amIAdmin ? <ChangeRoomName rid={id}/> : null}

        <h2>Room Number: {id}</h2>
        <p>Participants: {users.length}/{maxParticipantsQuantity}</p>
        
      </div>

      

      {amIAdmin? <div>
        <p>תצוגת מילים</p>
        <Toggle toggle={showLyrics} rid={rid} dataT={{showLyrics: true}} dataF={{showLyrics: false}}/>
        <p>הוספת שירים</p>
        <Toggle toggle={addRequests} rid={rid} dataT={{addRequests: true}} dataF={{addRequests: false}}/>
        <p>הצטרפות לחדר</p>
        <Toggle toggle={isEntranceAllowed} rid={rid} dataT={{isEntranceAllowed: true}} dataF={{isEntranceAllowed: false}}/>
        <p>חזרה על שירים</p>
        <Toggle toggle={isRepeatAllowed} rid={rid} dataT={{isRepeatAllowed: true}} dataF={{isRepeatAllowed: false}}/>
  



       </div> : null}
      {showLyrics ? 
        <div>
          <p>playing now id: {currPlayingNow}</p>
          <p>playing now name:</p>
          <p>playing now lyrics:</p>
          <p>playing as test: <PlayingTest/></p>
        </div>:
        <p>Lyrics are currently not displayed by admin.</p>}

      {messages.length > 0 && <h2>Playing Next: {messages[0].text} </h2>}
      <h3>Asked by: {askedBy}</h3>
      {amIAdmin && showLyrics && <button onClick={() => moveNext()} >
        Move Next!
      </button>}
      <h1>רשימת הבקשות</h1>
      <main>
        {messages &&
          messages.map((message) => (
            <Message key={message.id} message={message} rid={rid} />
          ))}
        <button onClick={()=>{tryFunction()}}>try chat</button>
        {addRequests ? <SendMessage isTyping={isTyping} setIsTyping={setIsTyping} messages={messages} history={history} tryHis={tryHis} rid={rid} /> : <p>Adding song requests was disabled by admin.</p>}
      </main>

      <span ref={scroll}></span>
      <ActiveUsers users={users} setUsers={setUsers} rid={rid} amIAdmin={amIAdmin} uid={uid}/>
      <div>
        <CopyLink rid={rid}/>
        <SendWhatsapp rid={rid} />
      </div>
      <History history={history} setHistory={setHistory} amIAdmin={amIAdmin} rid={rid}/>
      </div> 

      <div className="container-div">
        
        <div className="left-side">


          <div className="search-song-to-add-sector">
            <div className="search-song-div">
              <SendMessage messages={messages} history={history} tryHis={tryHis} rid={rid} />
              {isTyping? <div> typing...</div> : null}
            <div className="drop-down"></div></div>
          </div>
          {/* strart */}
          {!isTyping ? 
          <div>
            <div className="choose-songs-or-history-div">
              <button onClick={()=>setDisplayNextSongs(false)} className={displayNextSongs? "button-history" : "button-history-active" }>היסטוריית החדר</button>
              <button onClick={()=>setDisplayNextSongs(true)} className={displayNextSongs? "button-history-active" : "button-history"}>השירים הבאים</button>
            </div>
            <div className="main-left-side"> 
              {displayNextSongs? 
              // next songs div
              <div className="room-history-div">


                <div className="history-song-div">
                  <div>
                    <div className="trash-bin-icon-div"><img className="trash-bin-icon" src={TrashBin} alt="" /></div>
                    <div className="trash-bin-icon-div"><img className="trash-bin-icon" src={heart? RedHeart : Heart} alt="" /></div>
                    <div className="trash-bin-icon-div number-of-likes"><p className="number-of-likes-p">1</p></div>
                  </div>
                  
                  <div className="history-song-info-div">
                    <div className="history-song-header-div"><p className="song-header-p">קרן שמש</p></div>
                    <div className="history-song-author-div"><p className="song-author-p">בניה ברבי</p></div>
                  </div>
                </div>


              </div> 
              
              :
                // history div
              <div className="room-history-div">
                <History history={history} setHistory={setHistory} amIAdmin={amIAdmin} rid={rid}/>
              </div>
                }
              </div>
            </div>
            : null}
          {/* end */}

          {/* start2 */}
          <div className="serach-songs-suggestions-div">

            

            {/* <div className="suggestion-line-div">
              <div className="suggestion-add-song-div">
                <button className="suggestion-add-song-button"><img className="suggestion-add-song-icon" src={Plus} alt="" /></button>
                <div className="suggestion-was-before-div"><p className="suggestion-was-before-p">נוגן לפני 3 שירים</p></div>
              </div>
              <div className="suggestion-song-info-div">
                <div className="suggestion-song-name-div"><h6 className="suggestion-song-name-h6">אהבה קטנה</h6></div>
                <div className="suggestion-author-name-div"><p className="suggestion-author-name-p">שירי מימון</p></div>
              </div>
            </div>

            <div className="suggestion-line-div">
              <div className="suggestion-add-song-div">
                <button className="suggestion-add-song-button"><img className="suggestion-add-song-icon" src={Plus} alt="" /></button>
                <div className="suggestion-was-before-div"><p className="suggestion-was-before-p">נוגן לפני 3 שירים</p></div>
              </div>
              <div className="suggestion-song-info-div">
                <div className="suggestion-song-name-div"><h6 className="suggestion-song-name-h6">אהבה קטנה</h6></div>
                <div className="suggestion-author-name-div"><p className="suggestion-author-name-p">שירי מימון</p></div>
              </div>
            </div> */}


          </div>
          {/* end2 */}

          {displaySettings? 
          <div className="room-setting-div-open">
            <div className="setting-info-header-open">
              <div className="room-header-open-div">
                <div className="open-setting-div"><button onClick={()=>setDisplaySettings(!displaySettings)} className="open-setting-button">סגור</button></div>
                <div className="room-header-div"><h4 className="room-header-h4"> החדר של שגיא</h4></div>
              </div>
              <div className="room-desc-open-div">
                <div className="order-the-right-side"></div>
                <p className="room-desc-open-p">מפגש חברים בית קפה ״שמיים גדול״</p></div>
              
              <div className="setting-line-div ">
                <div className="room-menager-profile-pic-div">
                  <img className="room-menager-profile-pic-img" src={Person} alt="" />
                </div>
                <div className="room-setting-toggle-header">
                  <p className="room-setting-toggle-header-p"> 19/20 משתמשים בחדר</p>
                </div>
              </div>

              <div className="setting-line-div ">
                <div className="room-menager-profile-pic-div">
                  <img className="room-menager-profile-pic-img" src={Person} alt="" />
                </div>
                <div className="room-setting-toggle-header">
                  <p className="room-setting-toggle-header-p">מנהל החדר</p>
                </div>
              </div>
              
              <div className="setting-line-div ">
                <div className="room-setting-toggle-div">
                  <Toggle toggle={showLyrics} rid={rid} dataT={{showLyrics: true}} dataF={{showLyrics: false}}/>
                </div>
                <div className="room-setting-toggle-header">
                  <p className="room-setting-toggle-header-p">תצוגת מילים</p>
                  </div>
              </div>
              <div className="setting-line-div">
                <div className="room-setting-toggle-div">
                  <Toggle toggle={addRequests} rid={rid} dataT={{addRequests: true}} dataF={{addRequests: false}}/>
                </div>
                <div className="room-setting-toggle-header">
                  <p className="room-setting-toggle-header-p">הוספת שירים</p>
                  </div>
              </div>
              <div className="setting-line-div">
                <div className="room-setting-toggle-div">
                  <Toggle toggle={isEntranceAllowed} rid={rid} dataT={{isEntranceAllowed: true}} dataF={{isEntranceAllowed: false}}/>
                </div>
                <div className="room-setting-toggle-header">
                  <p className="room-setting-toggle-header-p">הצטרפות לחדר</p>
                  </div>
              </div>

            </div>
          </div>
          :
          <div className="room-setting-div">
            <div className="open-setting-div"><button onClick={()=>setDisplaySettings(!displaySettings)} className="open-setting-button">פתח הגדרות</button></div>
            <div className="room-header-div"><h4 className="room-header-h4"> החדר של שגיא</h4></div>
          </div>}
            

            
        </div>


        <div className="right-side">

          <div className="logo-arrow-div coral"></div>



          <div className="lyrics-author-song-header-div">
            <div className="song-header-div">
              <h1 className="song-header-h1">קצת אהבה לא תזיק</h1>
            </div>
            <div className="author-header-div">
              <h5 className="author-header-h5">אלון עדר  / </h5>
            </div>
            

            
          </div>
          {/* <div className="lyrics-main-div">
            <span itemprop="Lyrics" class="artist_lyrics_text">אל תלכי,
            <br/>קרן שמש 
            <br/>לא נגמר לנו היום. 
            <br/>למה את, מסתתרת 
            <br/>עננים בכל מקום.
            <br/>
            <br/>אל תבכי, כמו הגשם
            <br/>לא חבל על הדמעות.
            <br/>יד חמה, מבקשת 
            <br/>לחבק אותך שעות.
            <br/>
            <br/>אשים שירים שאת אוהבת,
            <br/>אתן לך יום להירגע.
            <br/>אני נגנב שאת צוחקת 
            <br/>ככה אליי.
            <br/>תגידי מה את מבקשת 
            <br/>שלא יהיה לי שום תירוץ.
            <br/>כשאין מילים את מתרגשת 
            <br/>ככה אליי.
            <br/>
            <br/>תחייכי,
            <br/>זה יפה לך
            <br/>זה עושה לי את היום.
            <br/>אם פתאום את נרדמת 
            <br/>תחייכי גם בחלום.
            <br/>
            <br/>מטוסים בשמיים,
            <br/>אנשים על רכבות.
            <br/>אל תבכי, קרן שמש
            <br/>זה הזמן שלך לחיות.
            <br/>
            <br/>אשים שירים שאת אוהבת 
            <br/>אתן לך יום להירגע 
            <br/>אני נגנב כשאת צוחקת 
            <br/>ככה אליי.
            <br/>תגידי מה את מבקשת,
            <br/>שלא יהיה לי שום תירוץ.
            <br/>כשאין מילים את מתרגשת
            <br/>ככה אליי.
            <br/>
            <br/>אל תבכי, קרן שמש,
            <br/>קחי לך בית אחרון.
            <br/>איך תמיד את אומרת 
            <br/>ניפגש עם אור ראשון.
            <br/>
            <br/>אשים שירים שאת אוהבת,
            <br/>אתן לך יום להירגע.
            <br/>אני נגנב שאת צוחקת,
            <br/>ככה אליי.
            <br/>
            <br/>תגידי מה את מבקשת,
            <br/>שלא יהיה לי שום תירוץ.
            <br/>כשאין מילים את מתרגשת 
            <br/>ככה אליי.</span>
                      </div> */}
                    </div>
                    
                  </div>





    </>
  );
};

export default Chat;



            // {displaySettings ? <div className="setting-div-open">
            //   <div className="setting-div-open-setting-div-open"><p onClick={toggleDisplaySettings} className="setting-div-open-setting-p">סגור</p></div>
            //   <div><h4 className="setting-div-room-header-p-open">החדר של שגיא</h4></div>
            // </div>
            // :
            // <div className="setting-div-closed">
            //   <div className="setting-div-open-setting-div"><p onClick={toggleDisplaySettings} className="setting-div-open-setting-p-open">פתח הגדרות</p></div>
            //   <div><h4 className="setting-div-room-header-p">החדר של שגיא</h4></div>
            // </div>}



      // <div className="container-fluid">
      //   <div className="row g-0 px-0">
      //     <div className="col-4 ">
      //       <div>
      //           <div className="serch-song-div">
      //            {addRequests ? <SendMessage messages={messages} history={history} tryHis={tryHis} rid={rid} /> : <p>Adding song requests was disabled by admin.</p>}
      //            <Dugma></Dugma>
      //           </div>
      //       </div>

      //     </div>
      //     <div className="col">
      //       <div className="red"></div>
      //     </div>

      //   </div>
      // </div>







        {/* const [enterUsers, setEnterUsers] = useState(true);
        const [isRepeatAllowed, setIsRepeatAllowed] = useState(false); */}
        {/* {enterUsers ?
        <button onClick={toggleDownEnterUsers}>Disable Users In</button>:
        <button onClick={toggleUpEnterUsers}>Allow Users In</button>
        }
        {isRepeatAllowed ?
        <button onClick={toggleDownIsRepeatAllowed}>Disable Song Repeat</button>:
        <button onClick={toggleUpIsRepeatAllowed}>Allow Song Repeat</button>
        }
         */}

