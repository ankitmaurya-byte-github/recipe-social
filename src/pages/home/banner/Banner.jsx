import React, { useState } from "react";
import "./style.scss";
import back from './back.jpg'
import Img from "../../../component/lasyLoading/Lasyloding";
import { changeuser } from "../../../store/slice";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";

function Banner() {
  const [query, setquery] = useState("");
  const dispatch = useDispatch();
  const ref=useRef()
  const [loading, setloading] = useState(false);
  const [background, setbackground] = useState(back);
  const user=useSelector(state=>state.user.currentuser)
  const searchQueryHandler=(e)=>{
    if(e.key=='Enter'){
      dispatch(changeuser({...user,search:e.target.value}))
      console.log("clicked");
      setquery("")
    }
  };
  const searchQueryHandlerClick=()=>{
    dispatch(changeuser({...user,search:ref.current.value}))
    setquery("")
  }
  return (
    <div className="banner">
      <div className="backdrop_img">{!loading && <Img src={background} />}</div>

      <div className="heroBannerContent">
        <span className="title">Welcome</span>
        <span className="subtitle">let's make some dishes</span>
        <div class="wrapper">
          <div class="container">
            <form role="search" method="get" class="search-form form" action="">
              <label>
                <span class="screen-reader-text">Search for...</span>
                <input
                  type="text"
                  value={query}
                  ref={ref}
                  onChange={(e) => setquery(e.target.value)}
                  onKeyDown={(e)=>searchQueryHandler(e)}
                  placeholder="search movie ...."
                  class="search-field"
                  name="s"
                  title=""
                />
              </label>
              <input onClick={searchQueryHandlerClick}
                class="search-submit button"
                value="Search"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
