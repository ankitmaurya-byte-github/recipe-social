import React, { useState } from "react";
import "./style.scss";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../../../authenthication/firebase";
import { useDispatch, useSelector } from "react-redux";
import { collection, getDocs } from "firebase/firestore";
import { changeuser } from "../../../store/slice";
import { memo } from "react";
function Header() {
  const [show, setShow] = useState("top");
  const [menu, setmenu] = useState(false);
  const { username } = useParams();
  const user = useSelector((state) => state.user.currentuser);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const changingInitialState = async () => {
      try {
        const res = await getDocs(collection(db, "users"));
        const result = res.docs.reduce(
          (object, data) => {
            console.log("gfhhffhh");
            if (
              username
                ? data.data().displayName == username
                : data.data().uid == user.uid
            ) {
              object.currentuser = data.data();
              console.log(object.currentuser);
            }
            object.userslist.push(data.data());
            return object;
          },
          { userslist: [], currentuser: {} }
        );
        if (username == user.displayName || !username) {
          console.log({
            ...user,
            userslist: result.userslist,
            ...result.currentuser,
            visiteduser: {},
            render: 1,
          });
          dispatch(
            changeuser({
              ...user,
              userslist: result.userslist,
              ...result.currentuser,
              visiteduser: {},
              render: 1,
            })
          );
        } else {
          dispatch(
            changeuser({
              ...user,
              userslist: result.userslist,
              visiteduser: result.currentuser,
              render: 1,
            })
          );
        }
      } catch (err) {
        console.log(err);
      }
    };
    console.log(user);
    !user?.render && changingInitialState();
  }, [user]);
  const handellogout = () => {
    signOut(auth);
    navigate("/");
  };
  const handelScroll = () => {
    if (window.scrollY > 200) {
      if (lastScrollY < window.scrollY) {
        setShow("hide");
      } else {
        setShow("show");
      }
    } else {
      setShow("top");
    }
    setLastScrollY(window.scrollY);
  };
  useEffect(() => {
    window.addEventListener("scroll", handelScroll);
  }, [lastScrollY]);

  return (
    <>
      {user?.uid ? (
        <div className={`header ${show}`}>
          <div className="logo" onClick={() => navigate("/")}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg"
              alt=""
            />
          </div>
          <div className="content">
            <img
              onClick={() => {
                dispatch(changeuser({ ...user, visiteduser: {} }));
                navigate(`/profile/${user.displayName}`);
              }}
              src={user.PFPimgUrl ? user.PFPimgUrl : user.photoURL}
            />

            {menu ? (
              <span
                class="material-symbols-outlined"
                onClick={() => setmenu(false)}
              >
                close
              </span>
            ) : (
              <span
                onClick={() => setmenu(true)}
                class="material-symbols-outlined"
              >
                widgets
              </span>
            )}
          </div>

          {menu && (
            <div className={`menu ${show}`}>
              <div
                className="profile"
                onClick={() => {
                  setmenu(false);
                  dispatch(changeuser({ ...user, visiteduser: {} }));
                  navigate(`/profile/${user.displayName}`);
                }}
              >
                <span class="material-symbols-outlined">person_apron</span>
                Profile
              </div>
              <div className="logout" onClick={handellogout}>
                <span class="material-symbols-outlined">move_item</span>Logout
              </div>
              <div
                className="favourites"
                onClick={() => {
                  navigate(`/favourites/${user.displayName}`);
                }}
              >
                <span class="material-symbols-outlined">favorite</span>Favourite
              </div>
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default memo(Header);
