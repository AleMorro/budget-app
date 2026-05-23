import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarNavItems, SettingsNavGroup } from "./data/SidebarData";
import { IconContext } from "react-icons";
import "./styles/Sidebar.css";

function pathMatches(pathname, itemPath) {
   if (itemPath.includes("#")) {
      return pathname === itemPath.split("#")[0];
   }
   if (itemPath === "/app") return pathname === "/app";
   return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}

function Sidebar() {
   const location = useLocation();
   const [settingsOpen, setSettingsOpen] = useState(() =>
      location.pathname.startsWith("/app/settings") ||
      location.pathname === "/app/category-settings"
   );

   const settingsActive =
      location.pathname.startsWith("/app/settings") ||
      location.pathname === "/app/category-settings";

   return (
      <IconContext.Provider value={{ color: "undefined" }}>
         <aside id="sidebar" className="sidebar">
            <ul className="sidebar-nav" id="sidebar-nav">
               {SidebarNavItems.map((item, index) => {
                  const active = pathMatches(location.pathname, item.path);
                  return (
                     <li key={index} className={item.cName}>
                        <Link
                           to={item.path}
                           className={`nav-link ${active ? "" : "collapsed"}`}
                        >
                           <i>{item.icon}</i>
                           <span>{item.title}</span>
                        </Link>
                     </li>
                  );
               })}

               <li className={SettingsNavGroup.cName}>
                  <div className="settings-row-wrap">
                     <Link
                        to="/app/settings#settings-theme"
                        className={`nav-link flex-grow-1 ${settingsActive ? "" : "collapsed"}`}
                        onClick={() => setSettingsOpen(true)}
                     >
                        <i>{SettingsNavGroup.icon}</i>
                        <span>{SettingsNavGroup.title}</span>
                     </Link>
                     <button
                        type="button"
                        className={`nav-link border-0 px-2 ${settingsActive && settingsOpen ? "" : "collapsed"}`}
                        onClick={() => setSettingsOpen((o) => !o)}
                        aria-expanded={settingsOpen}
                        aria-label="Espandi impostazioni"
                     >
                        <i className="bi bi-chevron-down sidebar-chevron" aria-hidden />
                     </button>
                  </div>
                  {settingsOpen && (
                     <ul className="nav-content">
                        {SettingsNavGroup.children.map((child) => {
                           const childActive =
                              `${location.pathname}${location.hash || ""}` === child.path;
                           return (
                              <li key={child.path}>
                                 <Link
                                    to={child.path}
                                    className={childActive ? "fw-bold text-primary" : ""}
                                 >
                                    <i>{child.icon}</i>
                                    <span>{child.title}</span>
                                 </Link>
                              </li>
                           );
                        })}
                     </ul>
                  )}
               </li>
            </ul>
         </aside>
      </IconContext.Provider>
   );
}

export default Sidebar;
