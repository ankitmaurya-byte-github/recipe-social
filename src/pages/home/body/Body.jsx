import React, { useEffect } from 'react'
import './style.scss'
import Carousels from '../../../component/carousels/Carousels'
import UseFetch from '../../../hooks/UseFetch'
import { useSelector } from 'react-redux'
function Body() {
  const user=useSelector(state=>state.user.currentuser)
  const search1=user.search?user.search:"popular"
  const search2=user.search?("indian "+user.search):"indian"
  const {loading:loading2,data:data2}=UseFetch(search2,'')
  const {loading:loading1,data:data1}=UseFetch(search1,'')
  return (
    <div className='body'>
      
      <Carousels loading={loading2} data={data2?.hits}/>
      <Carousels loading={loading1} data={data1?.hits}/>

    </div>
  )
}

export default Body