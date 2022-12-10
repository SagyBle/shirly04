import React from 'react'
import ToggleBoolean from './ToggleBoolean'

import './styles/DialogCreateRoom.css'

// roomName, roomDescription, roomMaxParticipantsQuantity
// isLockedWithPassword, setIsLockedWithPassword
// roomPassword
// setRoomName, setRoomMaxParticipantsQuantity, setRoomDescription, setRoomPassword



function DialogCreateRoom(props) {
  const setRoomName = props.setRoomName;
  const setRoomMaxParticipantsQuantity = props.setRoomMaxParticipantsQuantity;
  const setRoomDescription = props.setRoomDescription;
  const setRoomPassword = props.setRoomPassword;

  const roomName = props.roomName;
  const roomDescription = props.roomDescription;
  const roomMaxParticipantsQuantity = props.roomMaxParticipantsQuantity;
  const roomPassword = props.roomPassword;

  const isLockedWithPassword = props.isLockedWithPassword;
  const setIsLockedWithPassword = props.setIsLockedWithPassword;

  const createNewRoomURLAndGetInside = props.createNewRoomURLAndGetInside;
  const setShowCreateDialog= props.setShowCreateDialog;


  const handleRoomNameChange = (e) => {
    setRoomName(e.target.value);
    // setShowShortName(false);
  };

  const handleMaxParticipantsQuantity = (e) => {
    setRoomMaxParticipantsQuantity(e.target.value);
  }

  const handleRoomDescriptionChange = (e) => {
    setRoomDescription(e.target.value);
  }

  const handlePasswordChange = (e) => {
    setRoomPassword(e.target.value);
  }




  return (
    
      <div onClick={()=>setShowCreateDialog(false)} className='overlay'>
      {/* 4 room creation format */}
        <div onClick={(e)=> e.stopPropagation()} className="dialog-create-room">

          {/* <form className="form-create-room"> */}
            <div>
            <h3 className="dialog-headline">יצירת חדר חדש</h3>
            <input
            className="input-create-room"
              onChange={handleRoomNameChange}
              type="text"
              placeholder="שם החדר"
              value={roomName}
            > 
            </input>
            </div>
            <div>
            <input
            className="input-create-room"
              onChange={handleRoomDescriptionChange}
              type="text"
              placeholder="תיאור החדר"
              value={roomDescription}
            > 
            </input>
            </div>
            <div>
            <input
            className="input-create-room"
              onChange={handleMaxParticipantsQuantity}
              type="number"
              placeholder="כמות המשתתפים"
              value={roomMaxParticipantsQuantity}
            > 
            </input>
            </div>

            <div>
              <div>
                <p className="password-headline">נעל חדר בסיסמה</p>
                <ToggleBoolean toggle={isLockedWithPassword} setToggle={setIsLockedWithPassword}/>
              </div>
              {isLockedWithPassword && 
                <div>
                  <input
                  className="input-create-room"
                  onChange={handlePasswordChange}
                  type="password"
                  placeholder="הכנס סיסמה"
                  value={roomPassword}> 
                </input>
              </div>}

              <div>
                {/* button bellow to actually run room creation (url...) */}
                <button onClick={createNewRoomURLAndGetInside} className="create-room-dialog-button">צור חדר</button>
                <button onClick={()=>setShowCreateDialog(false)} className="cancel-dialog-button">ביטול</button>

              </div>


            </div>
            
          {/* </form> */}
        </div>
      {/* 4 room creation format */}
      </div>
  )
}

export default DialogCreateRoom
