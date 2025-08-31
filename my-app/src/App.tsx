import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Signup from './components/Signup'
import Login from './components/Login'
import { Routes, Route, Link } from "react-router-dom";
import Welcome from './components/Welcome'
import dd from "../public/top.png"
import col from "../public/right-column.png"
    import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  
  return (
    <>
    {
        location.pathname === "/welcome" ? null : <div className='main'>
      <img style={{width:"3rem",height:"2rem"}} src={dd} alt="" />
      <p style={{marginTop:"0.008rem"}}>HD</p>
      </div>
      }
    
      <Routes>
        <Route path="/" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/welcome" element={<Welcome/>} />
      </Routes>
      {
        location.pathname === "/welcome" ? null : <div ><img  className='displaycol' src={col} alt="" /></div>
      }
      
    </>
  )
}


export default App
