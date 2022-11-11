import React, {useState, useEffect} from "react";
import Navbar from "./components/Navbar";

import { auth } from './firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

import {Link, Route, Routes} from 'react-router-dom'
import Error from "./components/Error";
import Chat from "./components/Chat";


const style = {
  appContainer: `max-w-[728px] mx-auto text-center`,
  sectionContainer: `flex flex-col h-[30vh] bg-gray-100 mt-10 shaddow-xl border relative`,
}


function App() {

  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(()=>{
    console.log("isLoading from app: " + isLoading);
  },[isLoading]);

  return (
    <> 
      <Routes>
        <Route path='/' element={
          <div className={style.appContainer}>
            <Navbar isLoading={isLoading} setIsLoading={setIsLoading}/>
          </div>
        }/>
        <Route path="/jam-room/:id" element={<Chat isLoading={isLoading} setIsLoading={setIsLoading}/>} />
        <Route path="*" element={<Error/>}/>
          
      </Routes>
    </>
  );
}

export default App;
