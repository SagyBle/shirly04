import React from "react";
import { useState } from "react";

import { Route, Routes } from "react-router-dom";
import GetARoom from "./GetARoom";
import Test from "./Test";

function Home(props) {
  return (
    <>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <GetARoom
                uid={props.uid}
                isLoading={props.isLoading}
                setIsLoading={props.setIsLoading}
              />
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default Home;
