import React from "react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { changeuser } from "../store/slice";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useSelector } from "react-redux";
function Authenthication({ children }) {
  const user = useSelector((state) => state.user.currentuser);
  const dispatch = useDispatch();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (res) => {
      console.log("userchanged");
      dispatch(changeuser(res));
      console.log(res);
    });
    return () => {
      unsub();
    };
  }, []);

  return <div>{children}</div>;
}

export default Authenthication;
