import React from 'react'
import Chat from './Chat'
import { useState } from 'react'


function Home() {
    const [showChat, setShowCat] = useState(false);
    const [roomID, setRoomID] = useState(0);


    const handleCreateNewRoom = (e) => {
        setShowCat(!showChat)
        const id = Date.now()
        setRoomID(id)
        console.log(id)
    }
    
  return (
    <div>
        <h3>Welcome to Shirly!</h3>
        
        {!showChat &&
            <div>
                <div>
                    <p>Join a room</p>
                    <input type="text" placeholder='Enter room number' />
                    <button>Join!</button>
                </div>
            <div>
            </div>
                <button onClick={()=> handleCreateNewRoom()}>Create new room</button>
            </div>
        }
        {showChat && <Chat roomID={roomID}/>}

    </div>
  )
}

export default Home