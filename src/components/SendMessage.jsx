import React from 'react'
// import './AutoCompleteText.css'
import { auth, db } from '../firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

import './styles/SendMessage.css'
import Plus from "./styles/icons/add-plus.png"



export default class SendMessage extends React.Component {
  constructor(props) {
    super(props);
    // Locate here all songs' titles.
    this.items = [
      "אהבתיה - שלמה ארצי",
      "אם הייתי יכול - חנן בן ארי",
      "אור הירח - אביב גפן",
      "בוא - עברי לידר",
      "גן סגור - הכבש השישה עשר",
      "דובשנייה - שחר סיאול ונורוז",
      "הינך יפה רעייתי - עידן רייכל",
      "ואולי - עברי לידר",
    ];
    this.state = {
      suggestions: [],
      text: '',
      enableSend: false,
      index: '',
    }
    
  }
  onTextChange = (e) => {
    const value = e.target.value;
    let suggestions = [];
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, 'i');
      suggestions = this.items.sort().filter(v => regex.test(v));
      
    }

    this.setState(() => ({ suggestions, text: value, enableSend: false }));

  }

  suggestionSelected(value) {
    this.setState(() => ({
      text: value,
      suggestions: [],
      enableSend: true,
    }))
    console.log("printing value:");
    console.log(this.state.text);
  }

  handleHistory = (message, index, item) => {
    if (message.text === item){
      this.index = index
      return true;
    }
    return false;
  }

  handleChat = (item) => {
    return (this.props.messages && this.props.messages.include(item)) 
  }

  splitSongArtist = (item) => {
    
    const array = item.split(" - ");
    return {songName: array[0], artistName: array[1]}
  }


  renderSuggestions() {
    const { suggestions } = this.state;
    if (suggestions.length === 0) {
      return null;
    }
    return (

      // <ul className='song-suggestions-container'>
      //   {suggestions.map((item) => 
        
      //   <li className='song-line' onClick={() => this.suggestionSelected(item)}>
      //     <div>
      //       <div className='song-name'><p>{this.splitSongArtist(item).songName}</p></div>
      //       <div className='artist-name'><p>{this.splitSongArtist(item).artistName}</p></div>
            
      //     </div>
      //     <div>
      //       {this.props.history &&
      //     this.props.history.some((message, index)=>this.handleHistory(message, index, item)) && <p>played {(this.props.history.length) - (this.index)} songs ago</p>}
      //     </div>
      //     <div>
      //       {this.props.messages.some(message=> message.text === item) && <p>song is about to be played...</p>}
      //     </div>
      //     </li>)}
      // </ul>
      
      suggestions.map((item)=> 
        <div className="suggestion-line-div">
          <div className="suggestion-add-song-div">
            <button className="suggestion-add-song-button"><img className="suggestion-add-song-icon" src={Plus} alt="" /></button>
            <div className="suggestion-was-before-div">{this.props.messages.some(message=> message.text === item) && <p>song is about to be played...</p> || this.props.history && this.props.history.some((message, index)=>this.handleHistory(message, index, item)) &&  <p className="suggestion-was-before-p">נוגן לפני כמה שירים</p>}  </div>
          </div>
          <div className="suggestion-song-info-div">
            <div className="suggestion-song-name-div"><h6 className="suggestion-song-name-h6">{this.splitSongArtist(item).songName}</h6></div>
            <div className="suggestion-author-name-div"><p className="suggestion-author-name-p">{this.splitSongArtist(item).artistName}</p></div>
          </div>
        </div>
      )
  
    )

  }

  sendMessage = async (e) => {
    e.preventDefault();
    const { suggestions } = this.state;
    const { uid, displayName } = auth.currentUser;
    // TODO: PROBLEM: hardcoded as shit
    await addDoc(collection(db, `rooms/room${this.props.rid}/messages`), {
      text: this.state.text,
      name: displayName,
      uid,
      likes: 0,
      timestamp: serverTimestamp()
    })
    this.setState(() => ({ suggestions, text: '', enableSend: false }))
    const element = this.element.nativeElement;
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }

  render() {
    const { text } = this.state;
    return (
      <form className="search-song-form" onSubmit={this.sendMessage}>
        <input className="search-song-box" placeholder="הקלידו ובחרו מהשירים הקיימים" value={text} onChange={this.onTextChange} type='text' />
        {this.renderSuggestions()}
        {this.state.enableSend && <button type="submit">Send</button>}
      </form>


    )

  }
}