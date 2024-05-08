import React, { useState, useEffect } from 'react';

function Dashboard() {

   const [cards, setCards] = useState([])
   // da implementare fetch data from backend

   return (
      <section className="dashboard section">
         <div className="row">
            <div className="col-lg-8">
               <div className="row">

               </div>
            </div>
            <div className="col-lg-4">

            </div>
         </div>
      </section>
   )
}

export default Dashboard