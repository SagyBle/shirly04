import React from 'react'
import { useNavigate } from "react-router-dom";


const style = {
  button: `bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`,
  home: `bg-purple-100 hover:bg-purple-300 text-black  py-2 px-2 rounded`,
};

function Banned() {

  const navigate = useNavigate();

  return (
    <div>
      <h1>You're Out!</h1>
      <img src="https://media.tenor.com/Jz7_L0eCuZUAAAAC/umpire-ejection.gif" alt="" />
      <p>Sorry, but it seems like you are banned from this room.</p>
      <button className={style.button}
      onClick={()=>navigate("/")}
      >Come Back Home</button>
    </div>
  )
}

export default Banned
