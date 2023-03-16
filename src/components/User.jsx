import React from "react";
import "./User.css";
import { db } from "../firebase";
import {
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// fixed uid, rid

function User(props) {
  const rid = props.rid;
  const uid = props.user.id;

  console.log("props.user.id, uid:", uid);
  console.log("props.myuid:", props.myuid);
  console.log(uid === props.myuid);

  const navigate = useNavigate();

  // const currUser = auth.currentUser;
  // console.log(currUser);

  const handleButtonX = async () => {
    console.log(`X pressed by admin: Ban ${props.user.name}!`);
    const docref = doc(db, `rooms/room${rid}/users`, uid);

    // get doc to see if he exists (so we can add his full profile to banned users) already left
    const docSnap = await getDoc(docref);

    if (docSnap.exists()) {
      const roomRef = doc(db, `rooms/room${rid}`);
      await updateDoc(roomRef, {
        bannedUsersA: arrayUnion(uid),
      });
      alert(`user id: ${uid} was banned from room ${rid}`);
    } else {
      console.log(``);
    }
  };

  const hadnleButtonAdmin = async () => {
    console.log(
      `Admin pressed by admin: make ${props.user.name} a boss ahusharnuta!`
    );
    const data = { isAdmin: true };
    const docRef = doc(db, `rooms/room${rid}/users/${props.user.uid}`);
    await updateDoc(docRef, data);
  };

  // const tryFuncUser = async () => {
  //   console.log("tryFuncUser started");
  //   const roomRef = doc(db, `rooms/room${rid}`);
  //   await updateDoc(roomRef, {
  //       bannedUsersA: arrayUnion("added now")
  //   });
  //   console.log("tryFuncUser ended");

  // }

  return (
    <div>
      <div className="userline">
        <img
          src={props.user.photoURL}
          alt="profile-pic"
          className="profile-pic"
        />
        {props.amIAdmin && (
          <img
            src="https://image.shutterstock.com/image-vector/businessman-icon-600w-564112600.jpg"
            alt=""
            className="admin-icon"
            onClick={hadnleButtonAdmin}
          />
        )}
        {props.amIAdmin && (
          <img
            className="x-icon"
            onClick={handleButtonX}
            src="https://uxwing.com/wp-content/themes/uxwing/download/checkmark-cross/red-x-icon.png"
            alt=""
          />
        )}
        <p className="para">{props.user.name}</p>
        {uid === props.myuid && <p> &nbsp;(me)</p>}
        {props.user.isAdmin && <p> &nbsp;(admin)</p>}
      </div>
    </div>
  );
}

export default User;
