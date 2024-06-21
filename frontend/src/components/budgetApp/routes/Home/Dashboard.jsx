import React from 'react';

import { CardsData } from '../../data/CardsData';
// import components
import Card from './Card';
import Reports from './Reports';
import Pie from './Pie';
// import stylesheet
import '../../styles/Dashboard.css'

function Dashboard() {
   
   return (
      <section className="dashboard section">
         <div className="row">
            <div className="col-lg-12 col-md-12">
               <div className="row">
                  {
                     CardsData.map(card => <Card key={card.id} card={card} />)
                  }
                  <div className="col-8">
                     <Reports />
                  </div>
                  <div className="col-4">
                     <Pie />
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}

export default Dashboard