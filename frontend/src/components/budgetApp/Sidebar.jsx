import React from "react";
import { Link } from "react-router-dom";
import { SidebarData } from "./data/SidebarData";
import { IconContext } from "react-icons";

import "./styles/Sidebar.css"

function Sidebar() {

   return(
      <IconContext.Provider value={{ color: "undefined"}}>
         <aside id="sidebar" className="sidebar">

            <ul className="sidebar-nav" id="sidebar-nav">
               {SidebarData.map((item, index) => {
                  return (
                     <li key={index} className={item.cName}>
                        <a className="nav-link collapsed">
                           <Link to={item.path} className="icon">
                              <i>{item.icon}</i> 
                              <span>{item.title}</span>
                           </Link>
                        </a>
                     </li>
                  )
               })}
            </ul>
            
         </aside>
      </IconContext.Provider>
   )
}

export default Sidebar