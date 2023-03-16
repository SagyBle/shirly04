import React from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Signin from "./Signin";
import Home from "./Home";
import Loading from "./Loading";

function Navbar({ isLoading, setIsLoading }) {
  const [user, loading] = useAuthState(auth);

  return (
    <>
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div>
          <div>{!user && <Signin />}</div>
          {user && (
            <Home
              uid={user.uid}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;
