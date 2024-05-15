import { CardsData } from '../../data/CardsData';

import Card from './Card';

import '../../styles/Dashboard.css'

function Dashboard() {
   
   return (
      <section className="dashboard section">
         <div className="row">
            <div className="col-lg-12">
               <div className="row">
                  {
                     CardsData.map(card => <Card key={card.id} card={card} />)
                  }
               </div>
            </div>
            <div className="col-lg-4">

            </div>
         </div>
      </section>
   )
}

export default Dashboard