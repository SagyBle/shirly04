import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

function CopyLink(props) {
  const rid = props.rid;
  const url = `https://shirly04.netlify.app/jam-room/${rid}`;
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
