import React, { useState } from 'react'
import { db } from '../firebase'
import {doc, updateDoc, collection,DocumentReference} from 'firebase/firestore'

function LikeMessage(props) {
  const [liked, setLiked] = useState(false);

  const likeMessage = async (e) => {
    const docref = doc(db, "messages", props.message.id)
    const data = {
      likes: 1
    }
    updateDoc(docref, data).then(docref=> {
      setLiked(true);
      console.log("likes field has been updated");
    }).catch(error => {
      console.log("Error on likes");
    })
}
  return (
    <button onClick={()=>likeMessage()}>Like</button>
  )
}

export default LikeMessage
