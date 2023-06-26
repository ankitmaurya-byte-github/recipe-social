import React, { useEffect } from "react";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../authenthication/firebase";
import { useState } from "react";
import axios from "axios";
import UseFetch from "../../hooks/UseFetch";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import Img from "../../component/lasyLoading/Lasyloding";
import Header from "../home/head/Header";
import { Link, useNavigate, useParams } from "react-router-dom";
function Detail() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [shrink, setshrink] = useState([]);
  const user = useSelector((state) => state.user.currentuser);
  const data = useSelector((state) => state.dishdata.data);
  const [totalnutrients, settotalnutrients] = useState(false);
  const [healthlabel, sethealthlabel] = useState(false);
  const navigate = useNavigate();
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
  const handelshrink = (index) => {
    const filterd = shrink.filter((idx) => idx != index);
    if (filterd.length != shrink.length) {
      setshrink(filterd);
    } else {
      setshrink([...filterd, index]);
    }
  };
  const shouldopen = (index) => {
    for (let i = 0; i < shrink.length; i++) {
      if (index == shrink[i]) {
        return false;
      }
    }
    return true;
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
      <div className="detail">
        <div className="container ">
          <div className="details">
            <div className="info">
              <Img src={data?.images?.REGULAR?.url} />
              <div className="types">
                <div className="mealtype">
                  <h3>mealType</h3>
                  <div className="test">
                    {data?.mealType?.map((type, index) => (
                      <p key={index}>{type}</p>
                    ))}
                  </div>
                </div>
                <div className="cuisinetype">
                  <h3>cuisineType</h3>
                  <div className="test">
                    {data?.cuisineType?.map((type, index) => (
                      <p key={index}>{type}</p>
                    ))}
                  </div>
                </div>
                <div className="dishtype">
                  <h3>dishType</h3>
                  <div className="test">
                    {data?.dishType?.map((type, index) => (
                      <p key={index}>{type}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="content">
              <div className="label">{data?.label}</div>

              <div className="dietelabel">
                {data?.dietLabels?.length > 0 && <h3>Diet Label</h3>}
                <div className="dietitems">
                  {data?.dietLabels?.map((item, index) => {
                    return <p key={index}>{item}</p>;
                  })}
                </div>
              </div>
              <div className="caution">
                {data?.cautions?.length > 0 && <h3>Caution</h3>}
                <div className="cautionitems">
                  {data?.cautions?.map((item, index) => {
                    return <p key={index}>{item}</p>;
                  })}
                </div>
              </div>
              <div
                onClick={() => settotalnutrients(!totalnutrients)}
                className={`totalnutrients ${totalnutrients ? "strech" : ""}`}
              >
                <h2>Total-nutrients</h2>
                <span class="material-symbols-rounded">lists</span>
                {totalnutrients &&
                  data?.totalNutrients &&
                  Object.entries(data.totalNutrients).map(([key, value]) => {
                    return <p>{key}</p>;
                  })}
              </div>
              <div
                onClick={() => sethealthlabel(!healthlabel)}
                className={`healthlabel ${healthlabel ? "strech" : ""}`}
              >
                <h2>Health-label</h2>
                <span class="material-symbols-rounded">lists</span>
                {healthlabel &&
                  data?.healthLabels?.map((health) => {
                    return <p>{health}</p>;
                  })}
              </div>
              <div className="ingredientsline">
                <h1>Ingredient-Lines</h1>
                <div className="lines">
                  {data?.ingredientLines?.map((line, index) => {
                    return (
                      <div className="lineitems">
                        {" "}
                        <span class="material-symbols-rounded">
                          mediation
                        </span>{" "}
                        <p key={index}>{line}</p> <br />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="recipe">
            <div className="ingredients">
              <h2>Ingredients</h2>
              {data?.ingredients?.map((item, itemIndex) => (
                <div
                  className={`items ${shouldopen(itemIndex) ? "" : "shrink"}`}
                  key={item.id}
                >
                  {shouldopen(itemIndex) ? (
                    Object.entries(item).map(([key, value], index) => (
                      <div className="item">
                        {index == 0 && (
                          <span
                            onClick={() => handelshrink(itemIndex)}
                            class="material-symbols-rounded"
                          >
                            unfold_more
                          </span>
                        )}
                        <h4>{key}:</h4>
                        <p>{value}</p>
                        <hr className="short" />
                      </div>
                    ))
                  ) : (
                    <span
                      onClick={() => handelshrink(itemIndex)}
                      class="material-symbols-rounded"
                    >
                      unfold_more
                    </span>
                  )}
                  <hr className="long" />
                </div>
              ))}
            </div>
          </div>
          <div className="source">
            <h2>Source : </h2>
            <p>
              <Link to={data?.url}>{data?.source}</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Detail;
