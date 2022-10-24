import React from "react";
import Navbar from "./components/Navbar";

import { auth } from './firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

const style = {
  appContainer: `max-w-[728px] mx-auto text-center`,
  sectionContainer: `flex flex-col h-[30vh] bg-gray-100 mt-10 shaddow-xl border relative`,
}


function App() {

  const [user] = useAuthState(auth);
  // console.log(user)

  return (
    
    <div className={style.appContainer}>
        
      <Navbar />
      
    </div>
  );
}

export default App;
