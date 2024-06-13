import React, { useState } from 'react'
import './styles/Login.css'
import { Navigate, Route, redirect, useHistory, useNavigate } from 'react-router-dom'

function Login() {

   const[action, setAction] = useState("Sign Up");
   const[isLoggedIn, setIsLoggedIn] = useState(false)

   let navigate = useNavigate()

   const handleSubmit = async(e) => {
      e.preventDefault()
      navigate("/app")
   }

   return (

      <form method='POST' className="login-form" onSubmit={handleSubmit}>
         <div className="title-header">
            <div className="text">{action}</div>
            <div className="underline"></div>
         </div>
         <div className="inputs">
            {
             action === "Login" ? 
               <div></div> : 
               <div className="input">
                  <i className="bi bi-person-add"></i>
                  <input type="text" name='name' placeholder='Name' required/>
               </div>
            }
            
            <div className="input">
               <i className="bi bi-person"></i>
               <input type="email" name='email' placeholder='Email' required/>
            </div>
            <div className="input">
               <i className="bi bi-file-earmark-lock"></i>
               <input type="password" name='password' placeholder='Password' required/>
            </div>
            <div className="submit-container">
               <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => {setAction("Sign Up")}}>Sign Up</div>
               <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => {setAction("Login")}}>Login</div>
            </div>
            <div className="submit-btn">
               <button className="submit" type='submit'>
                  Submit
               </button>
            </div>
         </div>
      </form>
   )
}

export default Login