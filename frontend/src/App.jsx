import React, {useState} from 'react';
import './App.css';

function App() {
   
   const [emails, setEmails] = useState([{id:1, email:"@test1", password: "pass1"},
                                         {id:2, email:"@test2", password: "pass2"},
                                         {id:3, email:"@test3", password: "pass3"}])
   
   function renderEmails(){
      return emails.map(email => (
         <li key={email.id}>
            <div>
               <strong>ID:</strong> {email.id}
            </div>
            <div>
               <strong>Email:</strong> {email.email}
            </div>
            <div>
               <strong>Password:</strong> {email.password}
            </div>
         </li>
      ))
      //let allLis = emails.map( n=> <li key={n}>{}</li>)
      // return allLis
   }
   
   function handleClick() {
      fetch('/api/users')
         .then(res => {
            if(!res.ok) {
               throw new Error('Network response was not ok')
            }
            return res.json();
         })
         .then(data => {
            // Verifica che i dati ricevuti siano un array
            if (Array.isArray(data)) {
              // Verifica che ogni elemento nell'array abbia le proprietà id, email e password
              const isValidData = data.every(item => ('id' in item && 'email' in item && 'password' in item));
              if (isValidData) {
                // Imposta i nuovi dati ricevuti da API a emails
                setEmails(data);
              } else {
                console.error('Received data is not in the correct format');
              }
            } else {
              console.error('Received data is not an array');
            }
         })
         .catch(error => {
            console.error('Error fetching data:', error);
         })
   }

  return (
   <div className="App">
      <h1>List of Users</h1>
      <ul>
         {renderEmails()}
      </ul>
      <button onClick={handleClick}>Update emails</button>
   </div>
  ); 


} 

export default App;
