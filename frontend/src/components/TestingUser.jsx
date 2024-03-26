import React, { useState } from 'react';
import { useGlobalContext } from '../context/globalContext';
import '../styles/TestingUser.css';

function TestingUser() {
   const { getUsers, users, error } = useGlobalContext();
   const [isLoading, setIsLoading] = useState(false);

   const handleUpdateClick = () => {
      setIsLoading(true);
      getUsers()
         .then(() => setIsLoading(false))
         .catch(error => {
            console.error('Error fetching users:', error);
            setIsLoading(false);
         });
   };

   // Dati fittizi per l'avvio dell'applicazione
   const initialUsers = [
      { id: 1, email: "@test1", password: "pass1" },
      { id: 2, email: "@test2", password: "pass2" },
      { id: 3, email: "@test3", password: "pass3" }
   ];

   return (
      <div className="App">
         <h1>List of Users</h1>
         <button onClick={handleUpdateClick} disabled={isLoading} className='button-test'>
            {isLoading ? 'Loading...' : 'Update Users'}
         </button>
         {error && <p>Error fetching users: {error.message}</p>}
         <ul>
            {(users.length > 0 ? users : initialUsers).map(user => (
               <li key={user.id} className='list-test'>
                  <div>
                     <strong>ID:</strong> {user.id}
                  </div>
                  <div>
                     <strong>Email:</strong> {user.email}
                  </div>
                  <div>
                     <strong>Password:</strong> {user.password}
                  </div>
               </li>
            ))}
         </ul>
      </div>
   )
}

export default TestingUser
