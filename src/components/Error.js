import React from 'react'
import { useNavigate } from "react-router-dom";


const style = {
  button: `bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`,
  home: `bg-purple-100 hover:bg-purple-300 text-black  py-2 px-2 rounded`,
};

function Error() {

  const navigate = useNavigate();

  return (
    <div>
      <h1>Error 404</h1>
      <img src="http://www.yo-yoo.co.il/photo_meme/wp-content/uploads/2018/02/mememe_f646a922ea2732e8b69f019d14d5d8fb-1.jpg" alt="" />
       <button className={style.button}
      onClick={()=>navigate("/")}
      >Come Back Home</button>

    </div>
  )
}

export default Error
