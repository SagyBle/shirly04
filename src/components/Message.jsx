import React, { useState } from "react";
import { auth } from "../firebase";
import DeleteMessage from "./DeleteMessage";
import { db } from "../firebase";
import { doc, updateDoc, onSnapshot, increment } from "firebase/firestore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import Heart from "./styles/icons/heart.png";
import RedHeart from "./styles/icons/heart-red.png";

const style = {
  message: `flex items-center shadow-xl m-4 py-2 rounded-tl-full rounded-tr-full`,
  name: `fixed mt-[-4rem] text-gray-600 `,
  sent: `bg-[#bababa] text-black flex-row-reverse text-end float-left rounded-bl-full`,
  received: `bg-[#e5e5ea] text-black float-left rounded-br-full`,
  button: `w-[20%] bg-red-300 border border-solid`,
  buttonLike: `bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`,
  buttonDelete: `bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`,
};

const Message = ({ message }) => {
  const { id } = useParams();
  const rid = id;

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState("");

  // Subscrive to likes
  useEffect(() => {
    onSnapshot(
      doc(db, `rooms/room${rid}/messages/${message.id}`),
      (snapshot) => {
        setLikes(snapshot.data().likes);
      }
    );
  }, []);

  // Add like to likes field im messages document
  const likeMessage = async (likesToAdd) => {
    const docref = doc(db, `rooms/room${rid}/messages/${message.id}`);
    await updateDoc(docref, { likes: increment(likesToAdd) });
    setLiked(!liked);
  };

  const splitSongArtist = (item) => {
    const array = item.split(" - ");
    return { songName: array[0], artistName: array[1] };
  };

  return (
    <div className="history-song-div">
      <div>
        {message.uid === auth.currentUser.uid && (
          <DeleteMessage message={message} />
        )}
        {message.uid !== auth.currentUser.uid && !liked && (
          <div className="trash-bin-icon-div">
            <img
              onClick={() => likeMessage(1)}
              className="trash-bin-icon"
              src={Heart}
              alt=""
            />
          </div>
        )}

        {message.uid !== auth.currentUser.uid && liked && (
          <div className="trash-bin-icon-div">
            <img
              onClick={() => likeMessage(-1)}
              className="trash-bin-icon"
              src={RedHeart}
              alt=""
            />
          </div>
        )}

        {likes > 0 && (
          <div className="trash-bin-icon-div number-of-likes">
            <p className="number-of-likes-p">{likes} likes</p>
          </div>
        )}
      </div>

      <div className="history-song-info-div">
        <div className="history-song-header-div">
          <p className="song-header-p"></p>
          {splitSongArtist(message.text).songName}
        </div>
        <div className="history-song-author-div">
          <p className="song-author-p">
            {splitSongArtist(message.text).artistName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Message;
