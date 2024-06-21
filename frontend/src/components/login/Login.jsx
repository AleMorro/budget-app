import React, { useState } from 'react'
import './styles/Login.css'

import { useNavigate } from 'react-router-dom'

import { useGlobalContext } from '../../context/globalContext';
import ToastMsg from './ToastMsg';

function Login() {

   const { doLogin, doRegistration } = useGlobalContext()

   const [action, setAction] = useState("Sign Up");
   const [isLoggedIn, setIsLoggedIn] = useState(false)
   const [error, setError] = useState(null);
   const [isRegistered, setIsRegistered] = useState(null)

   let navigate = useNavigate()

   const handleSubmit = async (e) => {
      const form = e.target;

      if(action === 'Login') {
         
         e.preventDefault();
   
         const email = form.email.value;
         const password = form.password.value;
   
         if (form.checkValidity()) {
            try {
               const user = await doLogin(email, password);
               navigate("/app");
            } catch (error) {
               setError(error.message);
            }
         }
      } else {

         e.preventDefault()
   
         const user = {
            name: form.name.value,
            email: form.email.value,
            password: form.password.value
         }
         
         if (form.checkValidity()) {
            try {
               await doRegistration(user);
               navigate("/")
               //setIsRegistered("You're successfully registered!")
            } catch (error) {
               setError(error.message);
            }
         }
      }
   };

   const handleDemo = () => {
      const email = "user@demo.com";
      const password = "demo";

      try {
         const user = doLogin(email, password);
         navigate("/app");
      } catch (error) {
         setError(error.message);
      }
      
   }

   return (
      <>
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
                  <div className="demo-btn" onClick={() => {handleDemo()}}>Demo</div>
               </div>

            </div>
         </form>
         {error && <ToastMsg message={error} onClose={() => setError(null)} />}
         {isRegistered && <ToastMsg message={isRegistered} onClose={() => setIsRegistered(null)} />}
      </>
   )
}

export default Login