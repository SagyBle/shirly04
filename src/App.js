import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";

import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { Link, Route, Routes } from "react-router-dom";
import Error from "./components/Error";
import Chat from "./components/Chat";
import Banned from "./components/Banned";
import Button from "react-bootstrap/Button";
import Loading from "./components/Loading";
import Test from "./components/Test";
import Header from "./components/Header";
import InvitationPage from "./components/InvitationPage";
import QRGenerator from "./components/QRGenerator";
import Signin from "./components/Signin";
import GetARoom from "./components/GetARoom";

// const style = {
//   appContainer: `max-w-[728px] mx-auto text-center`,
//   sectionContainer: `flex flex-col h-[30vh] bg-gray-100 mt-10 shaddow-xl border relative`,
// }

function App() {
  const [user, loading] = useAuthState(auth);

  useState(() => {
    console.log("user is changed::");
    console.log(user);
  }, [user]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("isLoading from app: " + isLoading);
  }, [isLoading]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <div>{!user && <Signin />}</div>
              {user && (
                <>
                  {isLoading && <Loading />}

                  <GetARoom
                    uid={user.uid}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                  />
                </>
              )}
            </div>
          }
        />
        <Route
          path="/try"
          element={
            <div>
              <h1>try try try!!!!!!</h1>
            </div>
          }
        />
        <Route path="/invitation/:rid" element={<InvitationPage />} />
        <Route path="/qrcode/:rid" element={<QRGenerator />} />

        <Route
          path="/jam-room/:id"
          element={<Chat isLoading={isLoading} setIsLoading={setIsLoading} />}
        />
        <Route path="/Banned" element={<Banned />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
