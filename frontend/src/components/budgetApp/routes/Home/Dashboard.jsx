import React from 'react';

import { CardsData } from '../../data/CardsData';

import Card from './Card';

import '../../styles/Dashboard.css'
import Reports from './Reports';

function Dashboard() {
   
   return (
      <section className="dashboard section">
         <div className="row">
            <div className="col-lg-12">
               <div className="row">
                  {
                     CardsData.map(card => <Card key={card.id} card={card} />)
                  }
                  <div className="col-9">
                     <Reports />
                  </div>
               </div>
            </div>
            <div className="col-lg-4">

            </div>
         </div>
      </section>
   )
}

export default Dashboard