import React from 'react'

function RecentIncTab( { items } ) {
   return (
      
      <table className="table table-borderless datatable">
         <thead className="table-light">
            <tr>
               <th scope="col">Category</th>
               <th scope="col">Date</th>
               <th scope="col">Description</th>
               <th scope="col">Amount</th>
            </tr>
         </thead>
      
            <tbody>
               {items &&
                  items.length > 0 &&
                  items.map(item => (
                     <tr key={item.id}>
                        <th scope="row">
                           <a href="#">{item.category}</a>
                        </th>
                        <td>{item.date}</td>
                        <td>
                           <a href="#" className="text-primary">
                              {item.description}
                           </a> 
                        </td>
                        <td>${item.amount.toFixed(2)}</td>
                     </tr>
                  ))}
            </tbody>
         </table>
   );
}
export default RecentIncTab;