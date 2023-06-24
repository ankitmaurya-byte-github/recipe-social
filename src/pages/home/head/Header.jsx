import React, { useState } from 'react'
import './style.scss'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../../authenthication/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { changeuser } from '../../../store/slice';
function Header() {
  const [show,setShow]=useState('top')
  const [menu,setmenu]=useState(false)
  const user=useSelector(state=>state.user.currentuser)
  const [lastScrollY,setLastScrollY]=useState(0)
  const navigate = useNavigate()
  const dispatch=useDispatch()
  useEffect(()=>{
    const unsub=async()=>{
      if(user.BGimgUrl && user.PFPimgUrl && user.bio)return
      try{
      const data=await getDoc(doc(db,'users',user.uid))
        if(!user.bio){

          dispatch(changeuser({...user,bio:data.data().bio}))
        }
      if(data.data().PFPimgUrl && data.data().BGimgUrl && !user.BGimgUrl && !user.PFPimgUrl){
        dispatch(changeuser({...user,PFPimgUrl:data.data().PFPimgUrl,BGimgUrl:data.data().BGimgUrl}))
      }else if(data.data().PFPimgUrl && !user.PFPimgUrl){
        dispatch(changeuser({...user,PFPimgUrl:data.data().PFPimgUrl}))
      }else if(data.data().BGimgUrl && !user.BGimgUrl){
        dispatch(changeuser({...user,BGimgUrl:data.data().BGimgUrl}))
      }
      }catch(err){
        console.log(err);
      }
    }
    
     user?.uid &&  unsub()
},[user])
  const handellogout=()=>{
    signOut(auth)
    navigate('/')
  }
  const handelScroll=()=>{
    if(window.scrollY>200){
        if(lastScrollY<window.scrollY ){
            setShow('hide')
        }else{
            setShow('show')
        }
    }else{
        setShow('top')
    }
    setLastScrollY(window.scrollY)
  }
  useEffect(()=>{
    window.addEventListener('scroll',handelScroll)
  },[lastScrollY])

  return (
    <>
    {user?.uid?<div className={`header ${show}`}>
        <div className="logo" onClick={()=>navigate('/')}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg" alt="" />
        </div>
        <div className="content">
            <img onClick={()=>navigate(`/profile/${user.displayName}`)} src={user.PFPimgUrl?user.PFPimgUrl:user.photoURL} />
            
            {menu? <span class="material-symbols-outlined" onClick={()=>setmenu(false)}>
close
</span>:
            <span onClick={()=>setmenu(true)} class="material-symbols-outlined">widgets</span>}
        </div>


        {menu && <div className={`menu ${show}`}>
          <div className="profile" onClick={()=>{
            setmenu(false)
            navigate(`/profile/${user.displayName}`)}}>
          <span class="material-symbols-outlined">
person_apron
</span>Profile</div>
          <div className="logout" onClick={handellogout}><span class="material-symbols-outlined">
move_item
</span>Logout</div>
          <div className="favourites" onClick={()=>{
            setmenu(false)
            navigate(`/favourites/${user.displayName}`)}}><span class="material-symbols-outlined">
favorite
</span>Favourite</div>
        </div>}
    </div>:""}
    </>
  )
}

export default Header