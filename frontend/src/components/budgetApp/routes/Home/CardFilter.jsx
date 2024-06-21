import React from "react"


/**
 * function to handle the filter change of the drop-down menu on the left
 * of the card
 */
function CardFilter( {filterChange} ) {

   return (
      <div className="filter">
         <a className="icon" data-bs-toggle="dropdown">
            <i className='bi bi-three-dots' id="icon-dots"></i>
         </a>
         <ul className='dropdown-menu dropdown-menu-end dropdown-menu-arrow'>
            <li className='dropdown-header texts-start'>
               <h6>Filter</h6>
            </li>
            <li>
               <
                  a className="dropdown-item" 
                  onClick={() => filterChange('This Week')}
               >
                  This Week
               </a>
            </li>
            <li>
               <a
                  className="dropdown-item"
                  onClick={() => filterChange('This Month')}
               >
                  This Month
               </a>
            </li>
            <li>
               <a
                  className="dropdown-item"
                  onClick={() => filterChange('This Year')}
               >
                  This Year
               </a>
            </li>
         </ul>
      </div>
   )
}

export default CardFilter