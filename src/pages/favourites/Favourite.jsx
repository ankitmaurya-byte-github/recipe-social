import React, { useState } from "react";
import Header from "../home/head/Header";
import { getDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../authenthication/firebase";
import { useEffect } from "react";
import { updateDoc } from "firebase/firestore";
import { fetchData } from "../../service/service";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { changedata } from "../../store/recipeSlice";
import "./style.scss";
import { useParams } from "react-router-dom";
import { collection } from "firebase/firestore";
import { where } from "firebase/firestore";
import { query } from "firebase/firestore";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
function Favourite() {
  const [likedDish, setlikedDish] = useState([]);
  const navigate = useNavigate();
  const { username } = useParams();
  const user = useSelector((state) => state.user.currentuser);
  const dispatch = useDispatch();
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  console.log(likedDish);
  const handellike = async (item) => {
    try {
      const filterdarr = likedDish.filter((element) => {
        if (element.hits[0].recipe.uri == item.uri) {
          return false;
        }
        return true;
      });
      const response = await getDoc(doc(db, "likes", user.uid));
      const filteredDBarray = response.data().uri.filter((element) => {
        if (element.urilink == item.uri) {
          return false;
        }
        return true;
      });
      await setDoc(doc(db, "likes", user.uid), {
        uri: filteredDBarray,
      });
      setlikedDish([...filterdarr]);
    } catch (err) {
      console.log(err);
    }
  };
  const handelNavigate = (type) => {
    let url = "https://www.google.com";
    switch (type) {
      case "f":
        url = "https://www.facebook.com";
        break;
      case "i":
        url = "https://www.instagram.com/ankit_maury_a/";
        break;
      case "t":
        url = "https://twitter.com/AnkitMa10709657";
        break;
      case "l":
        url = "https://www.linkedin.com/in/ankit-maurya-a9497924a/";
        break;
    }
    window.open(url, "_blank");
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

  const handelclick = async (e, item) => {
    if (
      e.target.className == "material-symbols-rounded " ||
      e.target.className == "material-symbols-rounded black" ||
      e.target.className == "cuisineType" ||
      e.target.className == "label"
    ) {
      return;
    }
    try {
      const q = query(
        collection(db, "users"),
        where("displayName", "==", username)
      );
      const res = await getDocs(q);
      const result = res.docs[0].data().uid;
      await updateDoc(doc(db, "users", result), {
        dishDetail: item,
      });
      dispatch(changedata(item));
      navigate(`/${username}/detail/${item.label}`);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    let unsub = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("displayName", "==", username)
        );
        const res = await getDocs(q);
        const data = res.docs[0].data().uid;
        const result = await getDoc(doc(db, "likes", data));
        if (result.exists()) {
          const uriData = await Promise.all(
            result.data().uri.map(async (item) => {
              return await fetchData(item.urilink.split("_")[1], "details");
            })
          );
          if (Array.isArray(uriData)) {
            setlikedDish(uriData.reverse());
          } else {
            setlikedDish([]);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    unsub();
    return () => {
      unsub();
    };
  }, []);
  return (
    <>
      {user?.uid && <Header />}
      {!user?.uid && (
        <div className={`detailhead ${show}`}>
          <div className="navigate">
            <div
              onClick={() => navigate(`/favourites/${username}`)}
              className="navigatefavourities"
            >
              Favourites{" "}
              <span class="material-symbols-rounded">heart_check</span>
            </div>
            <div
              onClick={() => navigate(`/profile/${username}`)}
              className="navigateprofile"
            >
              Profile <span class="material-symbols-rounded">contact_page</span>
            </div>
          </div>
          <div className="socialIcons">
            <span className="icon" onClick={() => handelNavigate("i")}>
              <FaInstagram />
            </span>
            <span className="icon" onClick={() => handelNavigate("t")}>
              <FaTwitter />
            </span>
            <span className="icon" onClick={() => handelNavigate("l")}>
              <FaLinkedin />
            </span>
            <span className="icon" onClick={() => handelNavigate("f")}>
              <FaFacebookF />
            </span>
          </div>
        </div>
      )}
      <div className="favourities">
        <div className="name">
          Favourities<span class="material-symbols-rounded">heart_check</span>
        </div>
        <div className="container">
          {likedDish.map((item, index) => {
            console.log(item);
            if (!item) return <p>somthing wrong</p>;
            let object = item?.hits[0].recipe;
            return (
              <div
                key={index}
                onClick={(e) => handelclick(e, object)}
                className="carouselItem"
              >
                <img src={object?.image} alt="" />
                <p className="label">{object?.label}</p>
                <p className="cuisineType">{object?.cuisineType[0]}</p>
                {user?.displayName == username && (
                  <span
                    onClick={() => handellike(object)}
                    class={`material-symbols-rounded black`}
                  >
                    delete
                  </span>
                )}
                <div className="shadow"></div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Favourite;
