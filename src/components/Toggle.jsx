import React, {useState} from 'react'
import './styles/Toggle.css'
import {
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";


// parameters(toggle: state, rid: string, dataT, dataF )
function Toggle(props) {
  const toggle = props.toggle;
  // const setToggle = props.setToggle

  const rid = props.rid;
  const dataT = props.dataT;
  const dataF = props.dataF;

  // const handleClick = ()=> {
  //   setToggle(!toggle);
  // }

  // toggle up showLyrics field
  const toggleUp = () => {
    updateDoc(doc(db, `rooms/room${rid}`), dataT);
    console.log("toggle:" + toggle);
  };

  // toggle down showLyrics field
  const toggleDown = () => {
    updateDoc(doc(db, `rooms/room${rid}`), dataF);
    console.log("toggle:" + toggle);

  };

  return (
    // <div onClick={handleClick} className={toggle ? 'toggle-l' : 'toggle-r'}>
    <div 
    
      onClick={
        toggle? toggleDown : toggleUp}
        className={toggle ?'toggle-r'  : 'toggle-l'}>
      {toggle?
      
      <div className='toggle-right'></div> :
      <div className='toggle-left'></div>}
    </div>
  )
}

export default Toggle
