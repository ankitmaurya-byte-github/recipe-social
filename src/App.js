import logo from './logo.svg';
import './App.css';
import { BrowserRouter,Navigate,Routes, Route, Switch, Link, Redirect, useNavigate } from 'react-router-dom';
import Home from './pages/home/Home';
import Register from './authenthication/register/Register';
import Login from './authenthication/login/Login';
import PageNotFound from './pages/pageNotFound/PageNotFound';
import { useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { changeuser } from './store/slice';
import { auth } from './authenthication/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Detail from './pages/recipe/Detail';
import Profile from './pages/profile/Profile';
import Header from './pages/home/head/Header';
import Favourite from './pages/favourites/Favourite';
import { getDoc,doc } from 'firebase/firestore'
import { db } from './authenthication/firebase';
function App() {
  const dispatch=useDispatch()
  const user=useSelector(state=>state.user.currentuser)

const Protector=({children})=>{
  if(user){
    return children
  }else{
    return <Navigate to='/login'/>
  }
}

  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Protector><Home/></Protector>}/>
          <Route path='/:username/detail/:name' element={<Detail/>}/>
          <Route path='/detail/:name' element={<Protector><Detail/></Protector>}/>
          <Route path='/profile/:username' element={<Profile/>}/>
          <Route path='/favourites/:username' element={<Favourite/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='*' element={<PageNotFound/>}/>
        </Routes>
      
      </BrowserRouter>
  );
}

export default App;
