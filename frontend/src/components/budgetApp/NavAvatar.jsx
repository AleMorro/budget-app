import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context/globalContext";

function NavAvatar() {
   const { doLogout, displayName, userProfile } = useGlobalContext();
   const navigate = useNavigate();

   const handleLogout = () => {
      doLogout();
      navigate("/");
   };

   return (
      <li className="nav-item dropdown pe-3">
         <a
            className="nav-link nav-profile d-flex align-items-center pe-0"
            href="#"
            data-bs-toggle="dropdown"
            onClick={(e) => e.preventDefault()}
         >
            {userProfile.avatarDataUrl ? (
               <img
                  src={userProfile.avatarDataUrl}
                  alt=""
                  className="rounded-circle nav-profile-img"
                  width={36}
                  height={36}
               />
            ) : (
               <i className="bi bi-person-circle" id="icon-profile" aria-hidden />
            )}
         </a>

         <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
            <li className="dropdown-header">
               <h6>{displayName}</h6>
               <span>Account personale</span>
            </li>
            <li>
               <hr className="dropdown-divider" />
            </li>
            <li>
               <Link className="dropdown-item d-flex align-items-center" to="/app/profile">
                  <i className="bi bi-person" />
                  <span>My Profile</span>
               </Link>
            </li>
            <li>
               <hr className="dropdown-divider" />
            </li>
            <li>
               <Link className="dropdown-item d-flex align-items-center" to="/app/settings#settings-account">
                  <i className="bi bi-gear" />
                  <span>Account</span>
               </Link>
            </li>
            <li>
               <hr className="dropdown-divider" />
            </li>
            <li>
               <Link className="dropdown-item d-flex align-items-center" to="/app/help">
                  <i className="bi bi-question-circle" />
                  <span>Need Help?</span>
               </Link>
            </li>
            <li>
               <hr className="dropdown-divider" />
            </li>
            <li>
               <button
                  type="button"
                  className="dropdown-item d-flex align-items-center border-0 bg-transparent w-100"
                  onClick={handleLogout}
               >
                  <i className="bi bi-box-arrow-right" />
                  <span>Sign Out</span>
               </button>
            </li>
         </ul>
      </li>
   );
}

export default NavAvatar;
