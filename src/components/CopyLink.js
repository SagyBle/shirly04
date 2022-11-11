import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

function CopyLink(props) {
  const url = `https://shirly04.netlify.app/jam-room/${props.rid}`;
  return (
    <div>
      <p>room link: {url}</p>
      <CopyToClipboard
        text={url}
      >
        <button onClick={()=>alert('Room link has been copied to clipboard')}>Copy link to clipboard</button>
      </CopyToClipboard>
    </div>
  )
}

export default CopyLink

// import React from 'react'
// import { CopyToClipboard } from 'react-copy-to-clipboard'

// function CopyURLToClipboard(props) {

//   const copy = async() => {
//   console.log("copyURLToClipboard running");
//   alert("The link has been copied to the clipboard");
//   }

//   return (
//     <div>
//       <CopyToClipboard text={`https://shirly04.netlify.app/jam-room/${props.rid}`}>
//         <button onClick={copy}>Copy Link To Clipboard</button>
//       </CopyToClipboard>
//     </div>
//   )
// }

// export default CopyURLToClipboard

