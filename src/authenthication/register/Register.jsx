import React, { useEffect, useState } from 'react'
import './style.scss'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { db } from '../firebase'
import { updateProfile } from "firebase/auth";
import { collection, addDoc,doc, setDoc } from "firebase/firestore"; 
import { useSelector } from 'react-redux'

function Register() {
  const navigate=useNavigate()
  const [password,setPassword]=useState("")
  const [username,setUsername]=useState("")
  const [confirmPassword,setConfirmPassword]=useState("")
  const [email,setEmail]=useState("")
  const [notfill,setnotfill]=useState(false)
  const [loading,setLoading]=useState(false)
  const [wrongpassword,setWrongpassword]=useState(false)
  const [err,seterr]=useState(false)
  useEffect(()=>{
    if(password!='' && username!='' && confirmPassword!='' && email!=''){
      setnotfill(false)
    }
  },[password,username,confirmPassword,email])

  const handelLogin=async()=>{
    console.log(password,username,confirmPassword,email);
    if(err || wrongpassword || notfill)return
    if(password=='' || username=='' || confirmPassword=='' || email==''){
      setnotfill(true)
      return;
    }
    if(password!=confirmPassword){
      setWrongpassword(true)
      return
    }

    try{
      setLoading(true)
      const res=await createUserWithEmailAndPassword(auth,email,password)
      await updateProfile(res.user,{
        displayName:username,
        email,
        photoURL:"https://i.pinimg.com/564x/ac/fd/47/acfd47a5e4fa3dce75136fd24c7b8600.jpg"
      })
    
      await setDoc(doc(db, "likes", res.user.uid),{uri:[]})
      await setDoc(doc(db, "users", res.user.uid),{
        uid:res.user.uid,
        email,
        displayName:username,
        password,
        bio:"welcome🙏, write something about yourself 😀"
      });
      seterr(false)
      navigate('/')
    }catch(err){
      console.log(err);
      seterr(true)
    }finally{
      setLoading(false)
    }
  }



  return (
    <div className='register'>
    {!loading ?
           <section>
    <h1>Register</h1>
    <div class="login-form">

      <h4 className={`${notfill && username==='' ?'red':''}`}>Username</h4>
      <div class={`username-input ${notfill && username=='' ?'red':''}`}>
        <i class="fas fa-user"></i>
        <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Type your username"/>
      </div>

      <h4 className={`${(err || (notfill && email=='' ))?'red':''}`}>Email</h4>
      <div class={`username-input ${(err || (notfill && email=='')) ?'red':''}`}>
        <i class="fas fa-user"></i>
        <input type="text" value={email} onChange={(e)=>{
          seterr(false)
          setEmail(e.target.value)}} placeholder='Type your Email'/>
      </div>
      
      <h4 className={`${(wrongpassword || (notfill && password==''))?'red':''}`}>Password</h4>
      <div class={`password-input ${(wrongpassword || (notfill && password==''))?'red':''}`}>
        <i class="fas fa-lock"></i>
        <input type="text" value={password} onChange={(e)=>{
          setWrongpassword(false)
          setPassword(e.target.value)}} placeholder="Type your password"/>
      </div>


      <h4 className={`${(wrongpassword || (notfill && password=='')) ?'red':''}`}>Confirm Password</h4>
      <div class={`password-input ${(wrongpassword || (notfill && password=='')) ?'red':''}`}>
        <i class="fas fa-lock"></i>
        <input type="text" value={confirmPassword} onChange={(e)=>{
          setWrongpassword(false)
          setConfirmPassword(e.target.value)}} placeholder="Confirm your password"/>
      </div>

      <p>Forgot password?</p>
    </div>
    <button onClick={handelLogin} class="login-btn">
      REGISTER
    </button>
    <div class="alternative-signup">
      <p>Not a member? <span><Link to='/login'>Sign-in</Link></span></p>
    </div>
  </section>
   : <div class="centered-flex">
  <div class="red-shadow">
    <div id="sharingan" class="centered-flex">
      <div id="inner-circle" class="centered-flex">
        <span class="tomoe"></span>
        <span class="tomoe"></span>
        <span class="tomoe"></span>
      </div>
    </div>
  </div>
</div>}
</div> 
    
  )
}

export default Register