import React from 'react'
// import components
import Logo from './Logo'
import Nav from './Nav'

// import stylesheet
import './styles/Header.css'

function Header() {
   return (
      <header id='header' className='header fixed-top d-flex align-items-center'>
         <Logo />
         <Nav />
      </header>
   )
}

export default Header