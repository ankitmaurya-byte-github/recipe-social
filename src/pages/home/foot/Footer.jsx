import React from "react";
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaLinkedin,
} from "react-icons/fa";
import "./style.scss";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate=useNavigate()
    const handelNavigate=(type)=>{
        let url = "https://www.google.com";
        switch(type){
            case 'f':
                url="https://www.facebook.com"
                break
                case 'i':
                    url="https://www.instagram.com/ankit_maury_a/"
                    break
                    case 't':
                        url="https://twitter.com/AnkitMa10709657"
                        break
                        case 'l':
                            url="https://www.linkedin.com/in/ankit-maurya-a9497924a/"
                            break
        }
        window.open(url, "_blank");
    }
    return (
        <footer className="footer">
                <ul className="menuItems">
                    <li className="menuItem">Terms Of Use</li>
                    <li className="menuItem">Privacy-Policy</li>
                    <li className="menuItem">About</li>
                    <li className="menuItem">Blog</li>
                    <li className="menuItem">FAQ</li>
                </ul>
                <div className="infoText">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur.
                </div>
                <div className="socialIcons">
                    
                    <span className="icon" onClick={()=>handelNavigate('i')}>
                        <FaInstagram />
                    </span>
                    <span className="icon" onClick={()=>handelNavigate('t')}>
                        <FaTwitter />
                    </span>
                    <span className="icon" onClick={()=>handelNavigate('l')}>
                        <FaLinkedin />
                    </span>
                    <span className="icon" onClick={()=>handelNavigate('f')}>
                        <FaFacebookF />
                    </span>
                </div>
        </footer>
    );
};

export default Footer;
