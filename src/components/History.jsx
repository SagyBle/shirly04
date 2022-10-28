import React, { useState } from 'react'
import Message from './Message'

function History(props) {
    
    
    return (
        <div>

          {props.history &&
          props.history.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </div>

    )
}

export default History