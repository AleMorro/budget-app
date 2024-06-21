import React from 'react'
// import components
import NavAvatar from './NavAvatar'

// import stylesheet
import './styles/Nav.css'

function Nav() {

   return (
      <nav className='header-nav ms-auto'>
         <ul className='d-flex align-items-center'>
            <NavAvatar />
         </ul>
      </nav>
   )
}

export default Nav