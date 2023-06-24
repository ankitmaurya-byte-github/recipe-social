import React from 'react'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { changeuser } from '../store/slice'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { getDoc,doc } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { db } from './firebase'
function Authenthication({children}) {
  const user=useSelector(state=>state.user.currentuser)
    const dispatch=useDispatch()
    useEffect(()=>{
        const unsub=onAuthStateChanged(auth,res=>{
          console.log("userchanged");
            dispatch(changeuser(res))
            console.log(res);
        })
    return ()=>{
        unsub()
    }
    },[])
  

    
  return (
    <div>{children}</div>
  )
}

export default Authenthication