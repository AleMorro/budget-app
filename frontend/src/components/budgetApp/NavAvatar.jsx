import React from 'react'

import { useGlobalContext } from '../../context/globalContext'

import { useNavigate } from 'react-router-dom'

function NavAvatar() {

   const { doLogout, loggedUser } = useGlobalContext()

   let navigate = useNavigate()

   const handleLogout = () => {
      doLogout()
      navigate('/')
   }

   return(
      <li className='nav-item dropdown pe-3'>
         <a 
            className='nav-link nav-profile d-flex align-items-center pe-0'
            href='#'
            data-bs-toggle="dropdown"
         >
            <i className="bi bi-person-square" id='icon-profile'></i>
            <span className='badge bg-success badge-number'></span>
         </a>

         <ul className='dropdown-menu dropdown-menu-end dropdown-menu-arrow profile'>
            <li className='dropdown-header'>
               <h6>{loggedUser.name}</h6>
               <span>Web developer</span>
            </li>
            <li>
               <hr className='dropdown-divider' />
            </li>

            <li>
               <a 
                  className='dropdown-item d-flex align-items-center'
                  href="users-profile.html"
               >
                  <i className='bi bi-person'></i>
                  <span>My Profile</span>
               </a>
            </li>
            <li>
               <hr className='dropdown-divider'/>
            </li>

            <li>
               <a 
                  className='dropdown-item d-flex align-items-center'
                  href="users-profile.html"
               >
                  <i className='bi bi-gear'></i>
                  <span>Account</span>
               </a>
            </li>
            <li>
               <hr className='dropdown-divider'/>
            </li>

            <li>
               <a 
                  className='dropdown-item d-flex align-items-center'
                  href="pages-faq.html"
               >
                  <i className='bi bi-question-circle'></i>
                  <span>Need Help?</span>
               </a>
            </li>
            <li>
               <hr className='dropdown-divider'/>
            </li>

            <li>
               <a className='dropdown-item d-flex align-items-center' 
                  onClick={handleLogout}
               >
                  <i className='bi bi-box-arrow-right'></i>
                  <span>Sign Out</span>
               </a>
            </li>
         </ul>
      </li>
   )
}

export default NavAvatar