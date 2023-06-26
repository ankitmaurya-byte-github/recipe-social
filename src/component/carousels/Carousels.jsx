import React, { useEffect, useState } from "react";
import "./style.scss";
import { changedata } from "../../store/recipeSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Timestamp,
  arrayUnion,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { doc } from "firebase/firestore";
import { query } from "firebase/firestore";
import { where } from "firebase/firestore";
import { useRef } from "react";
import { db } from "../../authenthication/firebase";

function Carousels({ loading, data }) {
  const [liked, setliked] = useState([]);
  const user = useSelector((state) => state.user.currentuser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef();
  const { username } = useParams();
  const handelscroll = (direction) => {
    const container = ref.current;
    const scrollAmount =
      direction == "left"
        ? container.scrollLeft - container.offsetWidth
        : container.scrollLeft + container.offsetWidth;
    container.scrollTo({ left: scrollAmount, behavior: "smooth" });
  };
  const handellike = async (item) => {
    try {
      const filterdarr = liked.filter((element) => {
        if (element.urilink == item.uri) {
          return false;
        }
        return true;
      });
      if (filterdarr.length != liked.length) {
        await setDoc(doc(db, "likes", user.uid), {
          uri: filterdarr,
        });
      } else {
        await updateDoc(doc(db, "likes", user.uid), {
          uri: arrayUnion({
            urilink: item?.uri,
            data: Timestamp.now(),
            cuisineType: item?.cuisineType,
            label: item?.label,
          }),
        });
        filterdarr.push({
          urilink: item?.uri,
          data: Timestamp.now(),
          cuisineType: item?.cuisineType,
          label: item?.label,
        });
      }
      setliked([...filterdarr]);
    } catch (err) {
      console.log(err);
    }
  };
  const isliked = (item) => {
    for (let i = 0; i < liked.length; i++) {
      if (liked[i].urilink == item.uri) {
        return true;
      }
    }
    return false;
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    let unsub = async () => {
      try {
        if (user.uid) {
          const result = await getDoc(doc(db, "likes", user.uid));
          if (result.exists()) {
            const uriData = result.data().uri;
            if (Array.isArray(uriData)) {
              setliked(uriData);
            } else {
              setliked(liked);
            }
          } else {
            setliked(liked);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    unsub();
  }, [user]);

  const handelclick = async (e, item) => {
    if (
      e.target.className == "material-symbols-rounded " ||
      e.target.className == "material-symbols-rounded red" ||
      e.target.className == "cuisineType" ||
      e.target.className == "label"
    ) {
      return;
    }
    try {
      if (username) {
        await updateDoc(
          query(db, "users", where("displayName", "==", username)),
          {
            dishDetail: item,
          }
        );
      } else {
        await updateDoc(doc(db, "users", user.uid), {
          dishDetail: item,
        });
      }
      dispatch(changedata(item));
      navigate(`/detail/${item.label}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="carousel">
      <span
        onClick={() => handelscroll("left")}
        class="material-symbols-rounded"
      >
        arrow_circle_left
      </span>
      <span
        onClick={() => handelscroll("right")}
        class="material-symbols-rounded"
      >
        arrow_circle_right
      </span>
      <div ref={ref} className="carouselsItems">
        {!loading &&
          data?.map((item, index) => {
            let object = item?.recipe;
            return (
              <div
                key={index}
                onClick={(e) => handelclick(e, item.recipe)}
                className="carouselItem"
              >
                <img src={object?.image} alt="" />
                <p className="label">{object?.label}</p>
                <p className="cuisineType">{object?.cuisineType[0]}</p>
                <span
                  onClick={() => handellike(item.recipe)}
                  class={`material-symbols-rounded ${
                    isliked(item.recipe) ? "red" : ""
                  }`}
                >
                  favorite
                </span>
                <div className="shadow"></div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Carousels;
