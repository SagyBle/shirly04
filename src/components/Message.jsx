import React, { useState } from 'react'
import {auth} from '../firebase'
import DeleteMessage from './DeleteMessage'
import { db } from '../firebase'
import {doc, updateDoc, collection,DocumentReference, getDoc} from 'firebase/firestore'

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
    const messageClass = 
    message.uid === auth.currentUser.uid
    ? `${style.sent}`
    : `${style.received}`;

    const [liked, setLiked] = useState(false)

    // TODO: Make sure code shortcut is still right and handle mutex
    const likeunlikeMessage = async ( likesToAdd) => {
      
      const docref = doc(db, "messages", message.id)
      // TODO: Mutex!!!
      const docSnap = await getDoc(docref);
      let currLikesNum = -1;

      try {
        const docSnap = await getDoc(docref);
        if (docSnap.exists()) {
          currLikesNum = docSnap.data().likes;
        }
        else {
          console.log("Document does not exist")
        }
      }
      catch(error) {
        console.log(error);
      }
      if (currLikesNum !== -1) {
        const data = {
          likes: currLikesNum + likesToAdd
        }
        updateDoc(docref, data).then(docref=> {
          if (likesToAdd === 1){
            setLiked(true);
          }
          else {
            setLiked(false);
          }
          console.log("likes field has been updated from");
        }).catch(error => {
          console.log("Error on likes");
        })
      }

    };
    
    return (
      <div>
        <div className={`${style.message} ${messageClass}`}>
          <p className={style.name}>{message.name}</p>
          <p>{message.text}</p>
           {(message.uid === auth.currentUser.uid) && <DeleteMessage message={message}/>}

           {(message.uid !== auth.currentUser.uid) && !liked && 
           <button className={style.buttonLike} onClick={()=>likeunlikeMessage(1)}>Like</button>}

           {(message.uid !== auth.currentUser.uid) && liked && 
           <button className={style.buttonLike} onClick={()=>likeunlikeMessage(-1)}>Unlike</button>}
          
          

        </div>
        
      </div>
    );
  };
  
  export default Message;
  