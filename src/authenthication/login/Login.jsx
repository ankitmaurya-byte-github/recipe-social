import React, { useState } from "react";
import "./style.scss";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { getDocs } from "firebase/firestore";
function Login() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [notfill, setnotfill] = useState(false);
  const [loading, setloading] = useState(false);
  const [wrongpassword, setWrongpassword] = useState(false);
  const navigate = useNavigate();

  const handellogin = async () => {
    if (password == "" || username == "") {
      setnotfill(true);
      return;
    }

    if (username.includes("@")) {
      try {
        setloading(true);
        await signInWithEmailAndPassword(auth, username, password);
        navigate("/");
      } catch (err) {
        console.log(err);
        setWrongpassword(true);
      } finally {
        setloading(false);
      }
    } else {
      try {
        setloading(true);
        const q = query(
          collection(db, "users"),
          where("displayName", "==", username)
        );
        const doc = await getDocs(q);
        await signInWithEmailAndPassword(
          auth,
          doc.docs[0].data().email,
          password
        );
        navigate("/");
      } catch (err) {
        console.log(err);
        setWrongpassword(true);
      } finally {
        setloading(false);
      }
    }
  };
  return (
    <div className="login">
      {!loading ? (
        <section>
          <h1>Login</h1>
          <div class="login-form">
            <h4
              className={`${
                wrongpassword || (notfill && username == "") ? "red" : ""
              }`}
            >
              Username
            </h4>
            <div
              class={`username-input ${
                wrongpassword || (notfill && username == "") ? "red" : ""
              }`}
            >
              <i class="fas fa-user"></i>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Type your username"
              />
            </div>

            <h4
              className={`${
                wrongpassword || (notfill && password == "") ? "red" : ""
              }`}
            >
              Password
            </h4>
            <div
              class={`password-input ${
                wrongpassword || (notfill && password == "") ? "red" : ""
              }`}
            >
              <i class="fas fa-lock"></i>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type your password"
              />
            </div>
            <p>Forgot password?</p>
          </div>
          <button onClick={handellogin} class="login-btn">
            LOGIN
          </button>
          <div class="alternative-signup">
            <p>
              Not a member?{" "}
              <span>
                <Link to="/register">Sign-up</Link>
              </span>
            </p>
          </div>
        </section>
      ) : (
        <div class="centered-flex">
          <div class="red-shadow">
            <div id="sharingan" class="centered-flex">
              <div id="inner-circle" class="centered-flex">
                <span class="tomoe"></span>
                <span class="tomoe"></span>
                <span class="tomoe"></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
