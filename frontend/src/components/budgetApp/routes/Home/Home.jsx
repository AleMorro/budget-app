import PageTitle from "../PageTitle";

import '../../styles/Main.css';
import Dashboard from "./Dashboard";

function Home() {

   return(
      <main id='main' className='main'>
         <PageTitle page="Home"/>
         <Dashboard />
      </main>
   )
}

export default Home;