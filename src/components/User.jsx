import React from 'react'
import './User.css';
import {auth} from '../firebase'


function User(props) {
  // const currUser = auth.currentUser;
  // console.log(currUser);
  
  
  return (
    <div className='userline'>
      <img src={props.user.photoURL} alt="1" className='image1'/>
      <img className='x' onClick={()=>{console.log("pressed x")}}  src="https://uxwing.com/wp-content/themes/uxwing/download/checkmark-cross/red-x-icon.png" alt="" />
      <p className='para'>{props.user.name}</p>
      
    </div>
  )
}

export default User
