import React from 'react'
import Chat from './Chat'
import { useState } from 'react'

import {Link, Route, Routes} from 'react-router-dom'
import GetARoom from './GetARoom'



function Home(props) {
    const [roomNumber, setRoomNumber] = useState('');

    const handleRoomNumberChange = (e) => {
        setRoomNumber(e.target.value)
  }

    
  return (
    <>
        <div>
            <h3>Welcome to Shirly!</h3>
            <Routes>
                <Route path='/' element={<GetARoom uid={props.uid}/>}/>
            </Routes>
            
            
        </div>
    </>
  )
}


// {!showChat &&
//                 <div>
//                     <div>
//                         <form onSubmit={handleJoinRoom}>
//                             <p>join a room</p>
//                             <input
//                                 onChange={handleRoomNumberChange}
//                                 type="text"
//                                 name="room-number"
//                                 placeholder="Enter Room Number"
//                                 value={roomNumber}
//                             />
//                             <a href={()=>createRoomURL(roomNumber)}>
//                                 <button type='submit'>Go!</button>
//                             </a>
                            
                        
//                         </form>
//                     </div>
//                 <div>
//                 </div>
//                     <button onClick={()=> handleCreateNewRoom()}>Create new room</button>
//                 </div>
//             }
//             <Routes>
//                 {/* <Route element={showChat && <Chat roomNumber={roomNumber}/>} /> */}
//                 <Route path='jam-room/:id' element={showChat && <Chat />} />

                
//             </Routes>

export default Home