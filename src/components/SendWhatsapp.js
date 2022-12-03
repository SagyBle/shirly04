import React, { useState } from "react";


function SendWhatsapp(props) {
  const [showSendLink, setShowSendLink] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('05');

  const rid = props.rid;

  //  https://wa.me/919234567812?text=%7B0%7D+Balaji+CTest
  // {0} Balaji CTest
  // https://wa.me/919234567812?text=+Balaji+CTest
  

  const send  = () => {

    let linkToRoom = `https://shirly04.netlify.app/jam-room/${rid}`
    let text = 'hey!+join+our+jam+in+this+link+:'
    let phoneNumberPlus = `+9725${phoneNumber.substring(2)}`
    let wa = `https://wa.me/${phoneNumberPlus}?text=${text}${linkToRoom}`;

    console.log("send is running");
    console.log(phoneNumber === '');

    if (phoneNumber === ''){
      console.log("got in the if");
      wa = `https://wa.me/`
    }

    const win = window.open(wa, '_blank');
    if (win != null) {
      win.focus();
    }

    setShowSendLink(false);
  }
    const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };


  return (
   <div>
    {showSendLink? 
      <div>

        <form>
          <label>Enter Phone Number: </label>
          <input
            onChange={handlePhoneNumberChange}
            type="text"
            placeholder="05..."
            value={phoneNumber}
          > 
          </input>
        </form>
        <button onClick={send}>Send!</button>
        <button onClick={()=>setShowSendLink(false)}>Nevermind</button>
    </div>
      : 
        <button onClick={()=>setShowSendLink(true)}>Send Link via Whatsapp</button>
    }
   </div>
  )
}

export default SendWhatsapp
