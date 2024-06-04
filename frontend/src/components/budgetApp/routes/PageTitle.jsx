import React from 'react'
import { SidebarData } from '../data/SidebarData';

import "../styles/PageTitle.css"

function PageTitle({ page }) {

   // filter SideBarData based on the page title
   const filteredData = SidebarData.filter(item => item.title === page);
   const { title, icon, path } = filteredData[0];

   return (
      <div className="pagetitle">
         <nav>
            <ol className="breadcrumb">
               <li className="breadcrumb-item">
                     <a href={path}>
                        <i className="icon">{icon}</i>
                     </a>
               </li>
               <li className="breadcrumb-item active">{title}</li>
            </ol>
         </nav>
      </div>
   );
   
}

export default PageTitle;