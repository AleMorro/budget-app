// globalContext.js

import React, { createContext, useContext, useState } from "react";
import axios from 'axios';

const BASE_URL = "http://localhost:5000/api/";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
   
   const [users, setUsers] = useState([]);
   const [error, setError] = useState(null);

   const getUsers = async () => {
      try {
         const res = await axios.get(`${BASE_URL}users`);
         setUsers(res.data);
         console.log(res.data);
      } catch (error) {
         console.error('Error fetching users:', error);
         setError(error);
      }
   };

   return (
      <GlobalContext.Provider value={{ users, getUsers, error }}>
         {children}
      </GlobalContext.Provider>
   );
};

export const useGlobalContext = () => {
   return useContext(GlobalContext);
};
