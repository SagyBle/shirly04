import React from "react";
import { auth, db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import "./styles/SendMessage.css";
import Plus from "./styles/icons/add-plus.png";

import { songs } from "../data/preview.jsx";

export default class SendMessage extends React.Component {
  constructor(props) {
    super(props);

    this.items = songs.map((elem) => `${elem.song_name} - ${elem.artist}`);

    this.state = {
      suggestions: [],
      text: "",
      enableSend: false,
      index: "",
    };
  }

  onTextChange = (e) => {
    let value = e.target.value;
    console.log("this is value:");
    console.log(value);
    let suggestions = [];
    if (value.length > 0) {
      // const regex = new RegExp(`^${value}`, "i");
      const regex = new RegExp(`^${value}|\\s[a-z]*${value}`, "i");
      suggestions = this.items.sort().filter((v) => regex.test(v));
    }
    this.setState(() => ({ suggestions, text: value, enableSend: false }));
  };

  suggestionSelected(value) {
    this.setState(() => ({
      text: value,
      suggestions: [],
      enableSend: true,
    }));
    console.log("printing value:");
    console.log(this.state.text);
  }

  handleHistory = (message, index, item) => {
    if (message.text === item) {
      this.index = index;
      return true;
    }
    return false;
  };

  handleChat = (item) => {
    return this.props.messages && this.props.messages.include(item);
  };

  splitSongArtist = (item) => {
    const array = item.split(" - ");
    return { songName: array[0], artistName: array[1] };
  };

  renderSuggestions() {
    const { suggestions } = this.state;
    if (suggestions.length === 0) {
      return null;
    }
    return (
      <div>
        {suggestions.map((item) => (
          <div>
            <div className="suggestion-line-div">
              <div className="suggestion-add-song-div">
                <button
                  onClick={() => this.sendMessage(item)}
                  className="suggestion-add-song-button"
                >
                  <img className="suggestion-add-song-icon" src={Plus} alt="" />
                </button>
                <div className="suggestion-was-before-div">
                  {(this.props.messages.some(
                    (message) => message.text === item
                  ) && (
                    <p className="suggestion-was-before-p">עומד להתנגן בקרוב</p>
                  )) ||
                    (this.props.history &&
                      this.props.history.some((message, index) =>
                        this.handleHistory(message, index, item)
                      ) && (
                        <p className="suggestion-was-before-p">
                          נוגן לפני כמה שירים
                        </p>
                      ))}{" "}
                </div>
              </div>
              <div className="suggestion-song-info-div">
                <div className="suggestion-song-name-div">
                  <h6 className="suggestion-song-name-h6">
                    {this.splitSongArtist(item).songName}
                  </h6>
                </div>
                <div className="suggestion-author-name-div">
                  <p className="suggestion-author-name-p">
                    {this.splitSongArtist(item).artistName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="suggestion-hide-everything"></div>
      </div>
    );
  }

  sendMessage = async (item) => {
    const { suggestions } = this.state;
    const { uid, displayName } = auth.currentUser;

    await addDoc(collection(db, `rooms/room${this.props.rid}/messages`), {
      text: item,
      name: displayName,
      uid,
      likes: 0,
      timestamp: serverTimestamp(),
    });
    this.setState(() => ({ suggestions: [], text: "", enableSend: false }));
    const element = this.element.nativeElement;
    element.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  render() {
    const { text } = this.state;
    return (
      <div className="search-song-form">
        {this.props.addRequests ? (
          <input
            className="search-song-box"
            placeholder="הקלידו ובחרו מהשירים הקיימים"
            value={text}
            onChange={this.onTextChange}
            type="text"
          />
        ) : (
          <input
            className="search-song-box"
            placeholder="הוספת שירים כרגע מושהת ע״י מנהלי החדר"
            value=""
          />
        )}
        {this.renderSuggestions()}
      </div>
    );
  }
}
