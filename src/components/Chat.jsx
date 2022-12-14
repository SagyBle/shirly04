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
import { useAuthState } from "react-firebase-hooks/auth";
import CopyLink from "./CopyLink";
import SendWhatsapp from "./SendWhatsapp";
import ChangeRoomName from "./ChangeRoomName";
import History from "./History";
import Loading from "./Loading";
import PlayingNow from "./PlayingNow";
import PlayingTest from "./PlayingTest";
import Toggle from "./Toggle";

import "./styles/Chat.css";
import Dugma from "./Dugma";
import TrashBin from "./styles/icons/trash-bin.png";
import Person from "./styles/images/person.jpeg";
import RightArrow from "./styles/icons/right-arrow.png";
import Logo from "./styles/images/Logo.png";
import Heart from "./styles/icons/heart.png";
import RedHeart from "./styles/icons/heart-red.png";
import Plus from "./styles/icons/add-plus.png";
import SongLyrics from "./SongLyrics";
import SongInfo from "./SongInfo";

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
    "???????????? - ???????? ????????",
    "?????? - ???????? ????????",
    "???? ???????? - ???????? ?????????? ??????",
  ];

  const { id } = useParams();
  const rid = id;

  const [user] = useAuthState(auth);
  const uid = user.uid;

  const scroll = useRef();
  const [isTyping, setIsTyping] = useState(false);

  const navigate = useNavigate();

  // get amIAdmin field from firestore
  const unsubAdmin = onSnapshot(
    doc(db, `rooms/room${rid}/users`, uid),
    (doc) => {
      // console.log("Current data amIAdmin?: ", doc.data().isAdmin);
      setAmIAdmin(doc.data().isAdmin);
    }
  );

  useEffect(() => {
    const q = query(
      collection(db, `rooms/room${rid}/users`),
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

  // contin here
  // get amIAdmin field from firestore
  const unsubMaxParticipantsQuantity = onSnapshot(
    doc(db, `rooms/room${rid}`),
    (doc) => {
      setMaxParticipantsQuantity(doc.data().roomMaxParticipantsQuantity);
    }
  );

  // Update isAdmin field
  const beAdminAgain = () => {
    updateDoc(doc(db, `rooms/room${rid}/users/${uid}`), { isAdmin: true });
  };

  // toggle up addRequests field
  const toggleUpAddRequests = () => {
    updateDoc(doc(db, `rooms/room${rid}`), { addRequests: true });
  };

  // toggle down addRequests field
  const toggleDownAddRequests = () => {
    updateDoc(doc(db, `rooms/room${rid}`), { addRequests: false });
  };

  // toggle up isRepeatAllowed field
  const toggleUpIsRepeatAllowed = () => {
    updateDoc(doc(db, `rooms/room${rid}`), { isRepeatAllowed: true });
  };

  // toggle down isRepeatAllowed field
  const toggleDownIsRepeatAllowed = () => {
    updateDoc(doc(db, `rooms/room${rid}`), { isRepeatAllowed: false });
  };

  // Get amIOriginalAdmin from firestore
  const unsubOriginal = onSnapshot(
    doc(db, `rooms/room${rid}/users`, uid),
    (doc) => {
      console.log("Current data amIOriginalAdmin?: ", doc.data().originalAdmin);
      setAmIOriginallyAdmin(doc.data().originalAdmin);
    }
  );

  // Get room name, show lyrics, add requests and enter users.
  const unsubRoomName = onSnapshot(doc(db, `rooms/room${rid}`), (doc) => {
    setRoomName(doc.data().roomName);
    setRoomDescription(doc.data().roomDescription);
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
      updateDoc(doc(db, `rooms/room${rid}`), {
        currPlayingNow: messages[0].text,
      });
      const data = messages[0];
      await setDoc(doc(db, `rooms/room${rid}/history/${messages[0].id}`), data);
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
    const data = { isAdmin: false };
    const docRef = doc(db, `rooms/room${rid}/users/${uid}`);
    await updateDoc(docRef, data);
  };

  const tryFunction = () => {
    console.log("start printing messages[0]:");
    console.log(messages[0]);
    console.log("end printing messages[0]:");
  };

  const toggleDisplaySettings = () => {
    setDisplaySettings(!displaySettings);
    console.log("display setting: " + displaySettings);
  };

  let heart = true;

  const getSongName = (item) => {
    const array = item.split(" - ");
    return array[0];
  };

  const getArtistName = (item) => {
    const array = item.split(" - ");
    return array[1];
  };

  return (
    <>
      {/* <div>
      <button onClick={() => {navigate("/")}}><img src={Logo}/></button>
      {props.isLoading && <Loading/>}

      <p>Hi, {user.displayName}</p>
      {amIAdmin ? <p>Logged in as an Admin</p> : <p>Logged in as a User</p>}
      {amIAdmin ? <button onClick={adminToUser}>Become a User</button> : null} 
      <div>
        <h1>Room Name: {roomName}</h1>
        <p>Room Description: {roomDescription}</p>
        {amIAdmin ? <ChangeRoomName rid={id}/> : null}

        <h2>Room Number: {id}</h2>
        <p>Participants: {users.length}/{maxParticipantsQuantity}</p>
        
      </div>

      

      {amIAdmin? <div>
        <p>?????????? ??????????</p>
        <Toggle toggle={showLyrics} rid={rid} dataT={{showLyrics: true}} dataF={{showLyrics: false}}/>
        <p>?????????? ??????????</p>
        <Toggle toggle={addRequests} rid={rid} dataT={{addRequests: true}} dataF={{addRequests: false}}/>
        <p>?????????????? ????????</p>
        <Toggle toggle={isEntranceAllowed} rid={rid} dataT={{isEntranceAllowed: true}} dataF={{isEntranceAllowed: false}}/>
        <p>???????? ???? ??????????</p>
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
      <h1>?????????? ????????????</h1>
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
      </div>  */}

      {/* !!!current version!!! */}

      <div className="container-div">
        <div className="left-side">
          <div className="search-song-to-add-sector">
            <div className="search-song-div">
              <SendMessage
                messages={messages}
                history={history}
                tryHis={tryHis}
                rid={rid}
                addRequests={addRequests}
              />
              {/* {isTyping? <div> typing...</div> : null} */}
              <div className="drop-down"></div>
            </div>
          </div>
          {/* strart */}
          {!isTyping ? (
            <div>
              <div className="choose-songs-or-history-div">
                <div className="choose-songs-or-history-buttons">
                  <button
                    onClick={() => setDisplayNextSongs(false)}
                    className={
                      displayNextSongs
                        ? "button-history"
                        : "button-history-active"
                    }
                  >
                    ?????????????????? ????????
                  </button>
                  <button
                    onClick={() => setDisplayNextSongs(true)}
                    className={
                      displayNextSongs
                        ? "button-history-active"
                        : "button-history"
                    }
                  >
                    ???????????? ??????????
                  </button>
                </div>
              </div>
              {amIAdmin && (
                <div className="move-next-div">
                  {amIAdmin && showLyrics && (
                    <button
                      className="move-next-button"
                      onClick={() => moveNext()}
                    >
                      ???????? ???????? ??????
                    </button>
                  )}
                </div>
              )}
              <div className="main-left-side">
                {displayNextSongs ? (
                  // next songs div
                  <div className="room-history-div">
                    {/* {messages &&
                  messages.map((message) => ) */}

                    {messages &&
                      messages.map((message) => (
                        <Message key={message.id} message={message} rid={rid} />
                      ))}
                  </div>
                ) : (
                  // history div
                  <div className="room-history-div">
                    <History
                      history={history}
                      setHistory={setHistory}
                      amIAdmin={amIAdmin}
                      rid={rid}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : null}
          {/* end */}

          {/* start2 */}
          <div className="serach-songs-suggestions-div"></div>
          {/* end2 */}

          {displaySettings ? (
            <div className="room-setting-div-open">
              <div className="setting-info-header-open">
                <div className="room-header-open-div">
                  <div className="open-setting-div">
                    <button
                      onClick={() => setDisplaySettings(!displaySettings)}
                      className="open-setting-button"
                    >
                      ????????
                    </button>
                  </div>
                  <div className="room-header-div">
                    <h4 className="room-header-h4">{roomName}</h4>
                  </div>
                </div>
                <div className="room-desc-open-div">
                  <div className="order-the-right-side"></div>
                  <p className="room-desc-open-p">{roomDescription}</p>
                </div>

                <div className="setting-line-div ">
                  <div className="avatar-group in-setting">
                    {users.map((user) => {
                      return (
                        <div className="avatar">
                          <img src={user.photoURL} alt="" />
                        </div>
                      );
                    })}
                    {users.length > 3 && (
                      <div className="hidden-avatars">{users.length - 3}</div>
                    )}
                  </div>
                  <div className="room-setting-toggle-header">
                    <p className="room-setting-toggle-header-p">
                      {users.length}/{maxParticipantsQuantity} ?????????????? ????????
                    </p>
                  </div>
                </div>

                <div className="setting-line-div ">
                  <div className="avatar-group in-setting">
                    {}
                    {users
                      .filter((user) => user.isAdmin)
                      .map((user) => {
                        return (
                          <div className="avatar">
                            <img src={user.photoURL} alt="" />
                          </div>
                        );
                      })}
                    {users.length > 3 && (
                      <div className="hidden-avatars">{users.length - 3}</div>
                    )}
                  </div>

                  <div className="room-setting-toggle-header">
                    <p className="room-setting-toggle-header-p">???????? ????????</p>
                  </div>
                </div>

                <div className="setting-line-div ">
                  <div className="room-setting-toggle-div">
                    <Toggle
                      toggle={showLyrics}
                      rid={rid}
                      dataT={{ showLyrics: true }}
                      dataF={{ showLyrics: false }}
                    />
                  </div>
                  <div className="room-setting-toggle-header">
                    <p className="room-setting-toggle-header-p">?????????? ??????????</p>
                  </div>
                </div>
                <div className="setting-line-div">
                  <div className="room-setting-toggle-div">
                    <Toggle
                      toggle={addRequests}
                      rid={rid}
                      dataT={{ addRequests: true }}
                      dataF={{ addRequests: false }}
                    />
                  </div>
                  <div className="room-setting-toggle-header">
                    <p className="room-setting-toggle-header-p">?????????? ??????????</p>
                  </div>
                </div>
                <div className="setting-line-div">
                  <div className="room-setting-toggle-div">
                    <Toggle
                      toggle={isEntranceAllowed}
                      rid={rid}
                      dataT={{ isEntranceAllowed: true }}
                      dataF={{ isEntranceAllowed: false }}
                    />
                  </div>
                  <div className="room-setting-toggle-header">
                    <p className="room-setting-toggle-header-p">?????????????? ????????</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="room-setting-div">
              <div className="open-setting-div">
                <button
                  onClick={() => setDisplaySettings(!displaySettings)}
                  className="open-setting-button"
                >
                  ?????? ????????????
                </button>
              </div>
              <div className="room-header-div">
                <h4 className="room-header-h4">{roomName}</h4>
              </div>
            </div>
          )}
        </div>

        <div className="right-side">
          <div className="logo-arrow-div">
            <div className="logo-img-div">
              <button
                onClick={() => {
                  navigate("/");
                }}
              >
                <img className="logo-img" src={Logo} />
              </button>
            </div>
            <div className="user-greetings-div">
              <p className="hello-username-p">???????? {user.displayName} ,</p>
              {amIAdmin ? (
                <p className="hello-username-p admin-notadmin-p">
                  ?????? ?????????? ????????????.
                </p>
              ) : (
                <p className="hello-username-p admin-notadmin-p">
                  ?????? ?????????? ????????????
                </p>
              )}
            </div>
          </div>

          <div className="lyrics-author-song-header-div">
            {showLyrics ? (
              <SongLyrics />
            ) : (
              <p>???????? ?????????? ???????? ???????????? ???? ?????? ???????? ????????.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;

// {displaySettings ? <div className="setting-div-open">
//   <div className="setting-div-open-setting-div-open"><p onClick={toggleDisplaySettings} className="setting-div-open-setting-p">????????</p></div>
//   <div><h4 className="setting-div-room-header-p-open">???????? ???? ????????</h4></div>
// </div>
// :
// <div className="setting-div-closed">
//   <div className="setting-div-open-setting-div"><p onClick={toggleDisplaySettings} className="setting-div-open-setting-p-open">?????? ????????????</p></div>
//   <div><h4 className="setting-div-room-header-p">???????? ???? ????????</h4></div>
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

{
  /* const [enterUsers, setEnterUsers] = useState(true);
        const [isRepeatAllowed, setIsRepeatAllowed] = useState(false); */
}
{
  /* {enterUsers ?
        <button onClick={toggleDownEnterUsers}>Disable Users In</button>:
        <button onClick={toggleUpEnterUsers}>Allow Users In</button>
        }
        {isRepeatAllowed ?
        <button onClick={toggleDownIsRepeatAllowed}>Disable Song Repeat</button>:
        <button onClick={toggleUpIsRepeatAllowed}>Allow Song Repeat</button>
        }
         */
}
