import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import Room from "./Room";
import Loading from "./Loading";

function ListOfRooms({
  setQueryRoomName,
  queryRoomName,
  user,
  isLoading,
  setIsLoading,
}) {
  const [rooms, setRooms] = useState([]);

  // Get cuurent active rooms
  useEffect(() => {
    const q = query(collection(db, `rooms`), orderBy("roomNumber"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let rooms = [];
      querySnapshot.forEach((doc) => {
        rooms.push({ ...doc.data(), id: doc.id });
      });
      setRooms(rooms);
    });
    return () => unsubscribe();
  }, []);
  return (
    <div className={`left-side-get-a-room search-room`}>
      <input
        type="text"
        className="search-room-input"
        placeholder="חיפוש"
        onChange={(e) => setQueryRoomName(e.target.value)}
      />
      <h4 className="active-rooms-header">חדרים פעילים</h4>
      <div className="list-of-rooms-div">
        <ul className="listtttt">
          {rooms ? (
            rooms
              .filter(
                (room) =>
                  room.roomName
                    .toLowerCase()
                    .includes(queryRoomName.toLocaleLowerCase()) ||
                  room.roomNumber
                    .toString()
                    .includes(queryRoomName.toLocaleLowerCase())
              )
              .map((room) => (
                <Room
                  key={room.roomNumber}
                  room={room}
                  user={user}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              ))
          ) : (
            <Loading />
          )}
        </ul>

        {rooms.filter(
          (room) =>
            room.roomName
              .toLowerCase()
              .includes(queryRoomName.toLocaleLowerCase()) ||
            room.roomNumber
              .toString()
              .includes(queryRoomName.toLocaleLowerCase())
        ).length === 0 ? (
          <h4 className="not-found-room">לא נמצאו תוצאות לחיפוש זה</h4>
        ) : null}
      </div>
    </div>
  );
}

export default ListOfRooms;
