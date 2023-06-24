import React from 'react'
import Header from './head/Header'
import Banner from './banner/Banner'
import Body from './body/Body'
import Footer from './foot/Footer'
import './style.scss'
import { getDoc,doc } from 'firebase/firestore'
import { db } from '../../authenthication/firebase'
import { changeuser } from '../../store/slice'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
function Home() {
  const user=useSelector(state=>state.user.currentuser)
  const dispatch=useDispatch()
  

  return (
    <div className='home'>
        <Header/>
        <Banner/>
        <Body/>
        <Footer/>
    </div>
  )
}

export default Home