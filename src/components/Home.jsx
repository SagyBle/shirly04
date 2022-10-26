import React from 'react'
import Chat from './Chat'
import { useState } from 'react'

import {Link, Route, Routes} from 'react-router-dom'



function Home() {
    const [showChat, setShowCat] = useState(false);
    const [roomNumber, setRoomNumber] = useState('');


    const handleCreateNewRoom = (e) => {
        setShowCat(!showChat)
        const id = Date.now()
        setRoomNumber(id)
        console.log(id)

        // change url to ptah="/id"
    }

    const handleRoomNumberChange = (e) => {
    setRoomNumber(e.target.value)
  }

    const handleJoinRoom = (e) => {
        e.preventDefault()
        
        console.log("join this room:");
        console.log(roomNumber);

        // change url to path ="/roomNumber"
    }
    
  return (
    <>
        <div>
            <h3>Welcome to Shirly!</h3>
            
            {!showChat &&
                <div>
                    <div>
                        <form onSubmit={handleJoinRoom}>
                            <p>join a room</p>
                            <input
                                onChange={handleRoomNumberChange}
                                type="text"
                                name="room-number"
                                placeholder="Enter Room Number"
                                value={roomNumber}
                            />
                            <button type='submit'>Go!</button>
                        
                        </form>
                    </div>
                <div>
                </div>
                    <button onClick={()=> handleCreateNewRoom()}>Create new room</button>
                </div>
            }
            {showChat && <Chat roomNumber={roomNumber}/>}
        </div>
    </>
  )
}

export default Home