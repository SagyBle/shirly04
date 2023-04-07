import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import IDCard from "./styles/icons/id-card.png";
import "./styles/Signin.css";

function SigninEmail() {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth();

  const signup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  const signin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  const handleSubmitSignup = (event) => {
    event.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    signup();
  };

  return (
    <div>
      {showForm ? (
        <div>
          <div>
            {/* <p>הירשמו</p> */}
            <form className="" onSubmit={handleSubmitSignup}>
              <label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
              </label>
              <br />
              <label>
                <input
                  className="email-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </label>
              <br />
              <button className="login-button" type="submit">
                כניסה לרשומים
              </button>
              <button className="login-button" type="submit">
                הירשמו לשירלי
              </button>
            </form>
          </div>
          <div>{/* <p>היכנסו</p> */}</div>
          <button onClick={() => setShowForm(false)}>cancel</button>
        </div>
      ) : (
        <div className="login-div">
          <button className="login-button" onClick={() => setShowForm(true)}>
            <div className="block">
              <img className="button-image-google" src={IDCard} alt="" />
              <p className="button-text-google">התחברו בדרך אחרת </p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export default SigninEmail;

// import React, { useState } from "react";
// import { auth } from "../firebase";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   getAuth,
// } from "firebase/auth";
// import IDCard from "./styles/icons/id-card.png";
// import "./styles/Signin.css";

// function SigninEmail() {
//   const [showForm, setShowForm] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const auth = getAuth();

//   const signup = (event) => {
//     event.preventDefault();
//     createUserWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         // Signed in
//         const user = userCredential.user;
//         // ...
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         // ..
//       });
//   };

//   const signin = (event) => {
//     event.preventDefault();
//     signInWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         // Signed in
//         const user = userCredential.user;
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//       });
//   };

//   // const handleSubmitSignin = (event) => {
//   //   console.log("Email:", email);
//   //   console.log("Password:", password);
//   //   // Add logic to send the email and password to your server here
//   //   signup();
//   // };

//   return (
//     <div>
//       {showForm ? (
//         <div>
//           <div>
//             <div className="login-div">
//               <button
//                 className="login-button"
//                 onClick={() => setShowForm(!showForm)}
//               >
//                 <div className="block">
//                   <img className="button-image-google" src={IDCard} alt="" />
//                   <p
//                     className={`button-text-google ${
//                       showForm ? "marked" : null
//                     }`}
//                   >
//                     התחברו בדרך אחרת{" "}
//                   </p>
//                 </div>
//               </button>
//             </div>
//             {/* <p>הירשמו</p> */}
//             <form className="">
//               <div className="email-input-div">
//                 <input
//                   className="email-input"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Email"
//                 />
//               </div>
//               <br />
//               <div className="email-input-div">
//                 <input
//                   className="email-input"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Password"
//                 />
//               </div>
//               <br />
//               <div className="email-input-div">
//                 <button
//                   className="login-button login-button-small"
//                   type="submit"
//                   onClick={() => signup()}
//                 >
//                   הירשמו לשירלי
//                 </button>
//                 <button
//                   className="login-button login-button-small"
//                   type="submit"
//                   onClick={() => signin()}
//                 >
//                   כניסה לרשומים
//                 </button>
//               </div>
//             </form>
//           </div>
//           <div>{/* <p>היכנסו</p> */}</div>
//           {/* <button onClick={() => setShowForm(false)}>cancel</button> */}
//         </div>
//       ) : (
//         <div className="login-div">
//           <button className="login-button" onClick={() => setShowForm(true)}>
//             <div className="block">
//               <img className="button-image-google" src={IDCard} alt="" />
//               <p className="button-text-google">התחברו בדרך אחרת </p>
//             </div>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SigninEmail;

// // {showForm ? (

// //       ) : (

// //       )}
// import React, { useState } from "react";
// import { auth } from "../firebase";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   getAuth,
// } from "firebase/auth";
// import IDCard from "./styles/icons/id-card.png";
// import "./styles/Signin.css";

// function SigninEmail() {
//   const [showForm, setShowForm] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const auth = getAuth();

//   const signup = (event) => {
//     event.preventDefault();
//     createUserWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         // Signed in
//         const user = userCredential.user;
//         // ...
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         // ..
//       });
//   };

//   const signin = (event) => {
//     event.preventDefault();
//     signInWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         // Signed in
//         const user = userCredential.user;
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//       });
//   };

//   // const handleSubmitSignin = (event) => {
//   //   console.log("Email:", email);
//   //   console.log("Password:", password);
//   //   // Add logic to send the email and password to your server here
//   //   signup();
//   // };

//   return (
//     <div>
//       {showForm ? (
//         <div>
//           <div>
//             <div className="login-div">
//               <button
//                 className="login-button"
//                 onClick={() => setShowForm(!showForm)}
//               >
//                 <div className="block">
//                   <img className="button-image-google" src={IDCard} alt="" />
//                   <p
//                     className={`button-text-google ${
//                       showForm ? "marked" : null
//                     }`}
//                   >
//                     התחברו בדרך אחרת{" "}
//                   </p>
//                 </div>
//               </button>
//             </div>
//             {/* <p>הירשמו</p> */}
//             <form className="">
//               <div className="email-input-div">
//                 <input
//                   className="email-input"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Email"
//                 />
//               </div>
//               <br />
//               <div className="email-input-div">
//                 <input
//                   className="email-input"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Password"
//                 />
//               </div>
//               <br />
//               <div className="email-input-div">
//                 <button
//                   className="login-button login-button-small"
//                   type="submit"
//                   onClick={() => signup()}
//                 >
//                   הירשמו לשירלי
//                 </button>
//                 <button
//                   className="login-button login-button-small"
//                   type="submit"
//                   onClick={() => signin()}
//                 >
//                   כניסה לרשומים
//                 </button>
//               </div>
//             </form>
//           </div>
//           <div>{/* <p>היכנסו</p> */}</div>
//           {/* <button onClick={() => setShowForm(false)}>cancel</button> */}
//         </div>
//       ) : (
//         <div className="login-div">
//           <button className="login-button" onClick={() => setShowForm(true)}>
//             <div className="block">
//               <img className="button-image-google" src={IDCard} alt="" />
//               <p className="button-text-google">התחברו בדרך אחרת </p>
//             </div>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SigninEmail;

// // {showForm ? (

// //       ) : (

// //       )}
