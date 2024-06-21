import React from 'react'
// import stylesheet
import './styles/Logo.css'

function Logo() {
   // functions to handle the open and close of the sidebar
   const handleToggleSideBar = () => {
      document.body.classList.toggle('toggle-sidebar');
   }

   return (
      <div className="d-flex align-items-center justify-content-between">
         <a href="/app" className='logo d-flex align-items-center'>
            <span className='d-none d-lg-block'>Budget-app</span>
         </a>
         <i
            className='bi bi-list toggle-sidebar-btn'
            onClick={handleToggleSideBar}
         ></i>
      </div>
   )
}

export default Logo