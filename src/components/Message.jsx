import React, { useState } from 'react'
import {auth} from '../firebase'
import DeleteMessage from './DeleteMessage'
import { db } from '../firebase'
import {doc, updateDoc, onSnapshot, increment} from 'firebase/firestore'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom';


const style = {
    message: `flex items-center shadow-xl m-4 py-2 rounded-tl-full rounded-tr-full`,
    name: `fixed mt-[-4rem] text-gray-600`,
    sent: `bg-[#bababa] text-black flex-row-reverse text-end float-left rounded-bl-full`,
    received: `bg-[#e5e5ea] text-black float-left rounded-br-full`,
    button: `w-[20%] bg-red-300 border border-solid`,
    buttonLike: `bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`,
    buttonDelete: `bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`,
}



const Message = ({ message }) => {
      
    const { id } = useParams();


    const messageClass = 
    message.uid === auth.currentUser.uid
    ? `${style.sent}`
    : `${style.received}`;

    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState('');

    // Subscribe to likes 
      useEffect(()=>{
        const unsubLikes = onSnapshot(doc(db, `rooms/room${id}/messages/${message.id}`), (doc) => {
        console.log(`rooms/room${id}/messgaes/${message.id}`);
        // console.log("Current data likes?: ", doc.data().likes);
        console.log("Current data likes?: ", doc.data().likes);
        setLikes(doc.data().likes);
      });
      }
      ,[]);

    // Add like to likes field im messages document
    const likeMessage = async ( likesToAdd ) => {
      const docref = doc(db, `rooms/room${id}/messages/${message.id}`);
        await updateDoc(docref, {likes: increment(likesToAdd)})
        setLiked(!liked);
      }
    
    return (
      <div>
        <div className={`${style.message} ${messageClass}`}>
          <p className={style.name}>{message.name}</p>
          <p>{message.text}</p>

          {<p>&nbsp; {likes} likes</p>}

          {(message.uid === auth.currentUser.uid) && <DeleteMessage message={message}/>}

          {(message.uid !== auth.currentUser.uid) && !liked && 
          <button className={style.buttonLike} onClick={()=>likeMessage(1)}>Like</button>}

          {(message.uid !== auth.currentUser.uid) && liked && 
          <button className={style.buttonLike} onClick={()=>likeMessage(-1)}>Unlike</button>}
          
          

        </div>
        
      </div>
    );
  };
  
  export default Message;
  