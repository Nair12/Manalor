import "bootstrap/dist/css/bootstrap.min.css";
import './css/App.css'
import Header from './Components/Header'
import Footer from './Components/Footer'
import { Router,Routes, Route } from 'react-router-dom';
import Login from './Pages/Login'
import Register from './Pages/Register'
import Profile from './Pages/Profile'
import Gallery from './Pages/Gallery'
import Upload from './Pages/Upload';
import Details from './Pages/Details';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { GetUserData } from './Redux/UserSlice';
import Loader from './Components/Loader';
import Policy from './Pages/Policy';
import CookieAccept from './Components/CookieAccept';
import Cookies from 'js-cookie';
import AnotherProfile from './Pages/AnotherProfile';
import Confirm from './Pages/Confirm';



function App() {

  const dispatch = useDispatch();

  const[cookieAccept,setAccept] = useState(false)

  useEffect(() => {
   
    const cookieAccept = Cookies.get("CookieAccept")
    
    if(cookieAccept != null){
      setAccept(true)
    }
    dispatch(GetUserData());
  }, []);


  return (
    <div className='min-h-screen'>
   
  <Header/> 
    {cookieAccept?null:<CookieAccept setAccept={setAccept}/>}
  <Routes>
     <Route path="/" element = {<Gallery/>}/>
    <Route path= "/Login" element = {<Login/>}/>
    <Route path="/Register" element = {<Register/>}/>
    <Route path="/Profile" element = {<Profile/>}/>
    <Route path="/UserProfile/:name" element={<AnotherProfile/>}/>
    <Route path="/Upload"element={<Upload/>}/>
    <Route path="/Details/:id" element = {<Details/>}/>
    <Route path="/Policy" element = {<Policy/>}/>
    <Route path='/EmailConfirm' element = {<Confirm/>}/>
    
  </Routes>
   
    </div>
  )
}

export default App
