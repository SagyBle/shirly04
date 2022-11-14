import React from 'react'
import './User.css';
import { db } from '../firebase'
import { doc, updateDoc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


function User(props) {

  console.log("props.user.id:", props.user.id);
  console.log("props.myuid:", props.myuid);
  console.log(props.user.id === props.myuid);

    
  const navigate = useNavigate();


  // const currUser = auth.currentUser;
  // console.log(currUser);
  
  const handleButtonX = async ()=>{
    console.log(`X pressed by admin: Ban ${props.user.name}!`)
    const docref = doc(db, `rooms/room${props.roomID}/users`, props.user.id);
    
    // get doc to see if he exists (so we can add his full profile to banned users) already left
    const docSnap = await getDoc(docref);

    if (docSnap.exists()){
      const userData = docSnap.data()
      // TODO Banned: delete user from users 
      deleteDoc(docref)
        .then(() => {
          console.log(`user id: ${props.user.id} was removed from room`);
        })
        .catch((error) => {
          console.log(error);
        });
      // TODO Banned: add user to banned users
      await setDoc(doc(db, `rooms/room${props.roomID}/bannedUsers/${props.user.id}`),userData);
      // // TODO Banned: navigate to shirly/banned
      // navigate("/banned")
    }
    else{
      console.log(``);
    }
    
  };
  const hadnleButtonAdmin = async ()=>{
    console.log(`Admin pressed by admin: make ${props.user.name} a boss ahusharnuta!`)
    const data = {isAdmin: true}
    const docRef = doc(db, `rooms/room${props.roomID}/users/${props.user.uid}`);
    await updateDoc(docRef, data)

  };

  const tryuserFunction = async () => {

    await setDoc(doc(db, `rooms/room${props.roomID}/bannedUsers/${props.user.id}`),{uid: props.user.id});

  }

  return (
    <div>
      <div className='userline'>
        
        <img src={props.user.photoURL} alt="profile-pic" className='profile-pic'/>
        {props.amIAdmin && <img src="https://image.shutterstock.com/image-vector/businessman-icon-600w-564112600.jpg" alt="" className='admin-icon' onClick={hadnleButtonAdmin} />}
        {props.amIAdmin && <img className='x-icon' onClick={handleButtonX}  src="https://uxwing.com/wp-content/themes/uxwing/download/checkmark-cross/red-x-icon.png" alt="" />}
        <p className='para'>{props.user.name}</p>{(props.user.id === props.myuid) && <p> &nbsp;(me)</p>}{(props.user.isAdmin) && <p> &nbsp;(admin)</p>}
        <button onClick={tryuserFunction}>tryuser</button>
      </div>
    </div>
  )
}

export default User
