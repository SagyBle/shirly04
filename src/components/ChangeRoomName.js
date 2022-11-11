import React, { useState } from 'react'
import { db } from "../firebase";
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
} from "firebase/firestore";

function ChangeRoomName(props) {
  const [openChangeForm, setOpenChangeForm] = useState(false);
  const [newName, setNewName] = useState('');

  

  const handleRoomNameChange = (e) => {
    setNewName(e.target.value);
  };

  const changeRoomName = async () => {

    console.log("change room name to this:");
    console.log(newName);
    setNewName('');
    const docRef = doc(db, `rooms/room${props.rid}`);
    await updateDoc(docRef, {roomName: newName});
    const doc1 = await getDoc(docRef);
    setOpenChangeForm(false);
    
  }


  return (
    <div>
      {openChangeForm ?
        <div>
           <input 
            type="text" 
            placeholder='Enter new name...' 
            value={newName}
            onChange={handleRoomNameChange}
            />
          <button onClick={changeRoomName}>Change Now!</button>
          <button onClick={()=>{setOpenChangeForm(false)}}>Nevermind</button>
        </div>
        :
        <button onClick={()=>setOpenChangeForm(true)}>Change Room Name</button>
      }

    </div>
  )
}

export default ChangeRoomName


// return (
//     <div>
//       {openChangeForm ?
//       <div>
//           <input 
//             type="text" 
//             placeholder='Enter new name...' 
//             value={newName}
//             onChange={handleRoomNameChange}
//             />
//           <button onClick={changeRoomName}>Change Now!</button>
//         :
//        <button onClick={()=>setOpenChangeForm(true)}>Change Room Name</button>
//        </div>}
//     </div>
//   )
// }
