import React, {useState} from 'react'
import './styles/Toggle.css'
import {
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";


// parameters(toggle: state)
function ToggleBoolean(props) {
  const toggle = props.toggle;
  const setToggle = props.setToggle;

  // toggle up boolean
  const toggleUp = () => {
    setToggle(true);
  };

  // toggle down boolean
  const toggleDown = () => {
    setToggle(false);
  };

  return (
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

export default ToggleBoolean
