import React from 'react'

import { useGlobalContext } from '../../../../context/globalContext';

import '../../styles/RecentTab.css'

function RecentIncTab( { items } ) {

   const { deleteIncome } = useGlobalContext();

   return (
      
      <table className="table table-borderless datatable">
         <thead className="table-light">
            <tr>
               <th scope="col">Category</th>
               <th scope="col">Date</th>
               <th scope="col">Description</th>
               <th scope="col">Amount</th>
               <th scope='col'>Delete</th>
            </tr>
         </thead>
      
         <tbody id='myTable'>
            {items &&
               items.length > 0 &&
               items.map(item => (
                  <tr key={item.id}>
                     <th scope="row">
                        {item.category}
                     </th>
                     <td>{item.date}</td>
                     <td>{item.description}</td>
                     <td>
                        <span className='badge bg-success'>
                           €{item.amount.toFixed(2)}
                        </span>
                     </td>
                     <td>
                        <i class="bi bi-trash" id='trash-icon' onClick={ () => deleteIncome(item.id) }></i>
                     </td>
                  </tr>
               ))}
         </tbody>
      </table>
   );
}
export default RecentIncTab;