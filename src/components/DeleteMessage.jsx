import React from 'react'
import { db } from '../firebase'
import {doc, deleteDoc, collection,DocumentReference} from 'firebase/firestore'
import { useParams } from 'react-router-dom';


const style = {
    buttonDelete: `bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`,
}

function DeleteMessage(props) {
    
    const { id } = useParams(); 
    const removeMessage = async (e) => {
        const docref = doc(db, `rooms/room${id}/messages`, props.message.id)
        deleteDoc(docref).then(()=>{
            console.log("Entire document has been deleted successfully.")
        }).catch(error=> {console.log(error)})
    }

    return (
        <button className={style.buttonDelete} onClick={() => removeMessage()}>Delete</button>
    )
}

export default DeleteMessage;
