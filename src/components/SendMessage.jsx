import React from 'react'
// import './AutoCompleteText.css'
import { auth, db } from '../firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

const style = {
  form: `h-14 w-full max-w-[728px]  flex text-xl absolute bottom-0`,
  input: `w-full text-xl p-3 bg-gray-900 text-white outline-none border-none`,
  button: `bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`,
  renderSuggestions: `w-full text-xl p-3 bg-gray-900 text-white outline-none border-none`,
};

// fixed rid, uid

export default class SendMessage extends React.Component {
  constructor(props) {
    super(props);
    // Locate here all songs' titles.
    this.items = [
      "אהבתיה - שלמה ארצי",
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


  renderSuggestions() {
    const { suggestions } = this.state;
    if (suggestions.length === 0) {
      return null;
    }
    return (

      <ul className={style.renderSuggestions}>
        {suggestions.map((item) => <li onClick={() => this.suggestionSelected(item)}>
          {item}
          {this.props.history &&
          this.props.history.some((message, index)=>this.handleHistory(message, index, item)) && <p>played {(this.props.history.length) - (this.index)} songs ago</p>}
          {this.props.messages.some(message=> message.text === item) && <p>song is about to be played...</p>}
          </li>)}
      </ul>

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
      <form onSubmit={this.sendMessage}>
        <input className={style.input} placeholder="הקלידו ובחרו מהשירים הקיימים" value={text} onChange={this.onTextChange} type='text' />
        {this.renderSuggestions()}
        {this.state.enableSend && <button className={style.button} type="submit">Send</button>}
      </form>
    )

  }
}