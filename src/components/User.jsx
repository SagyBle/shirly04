import React from 'react'
import './User.css';
import { db, auth } from '../firebase'
import { doc, updateDoc, getDoc} from "firebase/firestore";


function User(props) {

  console.log("props.user.id:", props.user.id);
  console.log("props.myuid:", props.myuid);
  console.log(props.user.id === props.myuid);

  // const currUser = auth.currentUser;
  // console.log(currUser);
  
  const handleButtonX = ()=>{
    console.log(`X pressed by admin: Ban ${props.user.name}!`)
  };
  const hadnleButtonAdmin = async ()=>{
    console.log(`Admin pressed by admin: make ${props.user.name} a boss ahusharnuta!`)
    const data = {isAdmin: true}
    const docRef = doc(db, `rooms/room${props.roomID}/users/${props.user.uid}`);
    await updateDoc(docRef, data)

  };

  return (
    <div>
      <div className='userline'>
        
        <img src={props.user.photoURL} alt="profile-pic" className='profile-pic'/>
        {props.amIAdmin && <img src="https://image.shutterstock.com/image-vector/businessman-icon-600w-564112600.jpg" alt="" className='admin-icon' onClick={hadnleButtonAdmin} />}
        {props.amIAdmin && <img className='x-icon' onClick={handleButtonX}  src="https://uxwing.com/wp-content/themes/uxwing/download/checkmark-cross/red-x-icon.png" alt="" />}
        <p className='para'>{props.user.name}</p>{(props.user.id === props.myuid) && <p> &nbsp;(me)</p>}
        
      </div>
    </div>
  )
}

export default User
