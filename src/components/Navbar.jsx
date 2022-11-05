import React, { useState, useTransition } from 'react'
import { auth } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import Signin from './Signin'
import LogOut from './LogOut'
import Home from './Home'
import {Link, Route, Routes} from 'react-router-dom'



const style = {
    nav: `bg-gray-800 h-20 flex justify-between items-center p-4`,
    heading: `text-white text-3xl`
}

function Navbar() {
    const [user] = useAuthState(auth);

    // console.log("from navbar this uid:");
    // console.log(user.uid)
    return ( 
        <>
            <div>
                <div className={style.nav}>
                    {(!user) && <Signin />}
                    { user && <h1 className={style.heading}>Hello {user.displayName}</h1>}

                    {user && <LogOut/>}
                </div>
                {/* <Routes> */}
                        {user && <Home uid={user.uid}/>}
                    <div>
                        
                    </div>
                {/* </Routes> */}
            </div>
        </>
  )
}

export default Navbar
