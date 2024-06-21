import React from 'react'
// import stylesheet
import './styles/Footer.css'

function Footer() {
   return (
      <footer id='footer' className='footer'>
         <div className="copyright">
            &copy; Copyright{' '}
            <strong>
               <span>Morro Technology</span>
            </strong>
            . All Rights Reserved
         </div>
         <div className="credits">
            Designed by Alex
         </div>
      </footer>
   )
}

export default Footer