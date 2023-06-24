import React, { useEffect, useRef, useState } from 'react'
import './style.scss'
import Img from '../../component/lasyLoading/Lasyloding'
import { useDispatch, useSelector } from 'react-redux'
import { db } from '../../authenthication/firebase'
import { getDoc ,doc, collection, getDocs, updateDoc, setDoc} from 'firebase/firestore'
import { getStorage, ref,getDownloadURL,uploadBytesResumable } from "firebase/storage";
import {useNavigate, useParams } from 'react-router-dom'
import { app } from '../../authenthication/firebase'
import fallbackbgimg from './download.jpg'
import { changeuser } from '../../store/slice'
import pfpimage from './acfd47a5e4fa3dce75136fd24c7b8600.jpg'
import Header from '../home/head/Header'
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import { query ,where } from 'firebase/firestore'
function Profile() {
  const storage=getStorage(app)
  const [about,setabout]=useState("write your bio here , tell us about yourself")
  const pfpimg=useRef()
  const bgimg=useRef()
  const dispatch=useDispatch()
  const [isfocus,setisfocus]=useState(false)
  const {username}=useParams()
  const txtref=useRef()
  const user=useSelector(state=>state.user.currentuser)
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
  const handelsave=async()=>{
    await updateDoc(doc(db,'users',user.uid),{
      bio:txtref.current.innerText
    })
    dispatch(changeuser({...user,bio:txtref.current.innerText}))
    setisfocus(false)
  }
  const handeldelete=()=>{
    txtref.current.innerText=user.bio?user.bio:''
    setisfocus(false)
  }
  // const handelAboutChange=async (event)=>{
  //   console.log("Dsda");
  //   setabout(event.target.innerText);
  //   await updateDoc(doc(db,'users',user.uid),{
  //     bio:about
  //   })
  // }
  console.log(user);
  useEffect(()=>{
    window.scrollTo(0,0)
    const unsub=async()=>{
      console.log(user);
      const q=query(collection(db,'users'),where("displayName","==",username))
            const res=await getDocs(q)
            const result=res.docs[0].data();
            const data={}
            data.bio=result.bio
            data.displayName=result.displayName
            if(result.BGimgUrl)data.BGimgUrl=result.BGimgUrl
            if(result.PFPimgUrl)data.PFPimgUrl=result.PFPimgUrl
            dispatch(changeuser({...data}))
    }
   !user && unsub()
   txtref.current.innerText=user?.bio?user.bio:''
  },[user])
  const handlepfpChange = async () => {
    
    try {
      const storageRef = ref(storage, username + '1');
      const file = pfpimg.current.files[0];
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        (error) => {
          console.log('onuploading pfp error', error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  
            await updateDoc(doc(db, 'users', user.uid), {
              PFPimgUrl: downloadURL,
            });
  
            dispatch(changeuser({ ...user, PFPimgUrl: downloadURL }));
          } catch (err) {
            console.log(err);
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  
  
 const handlebgChange = async () => {
  try {
    const storageRef = ref(storage, username + '2');
    const file = bgimg.current.files[0];
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      (error) => {
        console.log('onuploading pfp error', error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          await updateDoc(doc(db, 'users', user.uid), {
            BGimgUrl: downloadURL,
          });

          dispatch(changeuser({ ...user, BGimgUrl: downloadURL }));
          
        } catch (err) {
          console.log(err);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

  return (
    <>
    {user?.uid && <Header/>}
    <div className='profile'>
      <div className="container">
        <div className="banner">
          <Img src={user?.BGimgUrl?user.BGimgUrl:fallbackbgimg}/>
          <div className="image">
          {user?.uid && <> <input ref={bgimg} onChange={handlebgChange} type="file" id="bgfile" className='file' />
          <label className='bglabel' htmlFor="bgfile"><span class="material-symbols-rounded">
save_as
</span></label></>}
          
            <input ref={pfpimg} onChange={handlepfpChange} type="file"  id="pfpfile" className='file' />
            <label className='pfplabel' htmlFor={`${user?.uid?'pfpfile':''}`}>

            <div className={`circle ${user?.uid?'user':''}`}>
              <Img src={user?.PFPimgUrl?user.PFPimgUrl:pfpimage}/>
            </div>
            </label>
            <div onClick={()=>navigate(`/favourites/${username}`)} className="favoutries">Favouties<span class="material-symbols-rounded">
arrow_forward
</span></div>
          </div>


          <div className="content">
          <span onClick={handelsave} class={`material-symbols-rounded save ${isfocus?'':'hide'}`}>
sync_saved_locally
</span>
<span onClick={handeldelete} class={`material-symbols-rounded delete ${isfocus?'':'hide'}`}>
remove_selection
</span>
            <div className="name">
              {user?.displayName}
            </div>
            <div onClick={(e)=>{
              if(user.uid){
                setisfocus(true)
              }
              }} ref={txtref} contentEditable={user?.uid? 'true' : 'false'} spellCheck="false" className="bio"></div>

            <div  className="contact">Contact<span class="material-symbols-rounded">
phone_in_talk
</span></div>
          </div>
        </div>



        <div className="socialmedia">
        <span className='gohome' onClick={()=>{
          if(user?.uid){
            navigate('/')
          }else{
            navigate('/login')
          }
          }} class="material-symbols-rounded">
home
</span>
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
      </div>
    </div>
    </>
  )
}

export default Profile