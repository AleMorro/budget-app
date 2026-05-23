import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context/globalContext";

function RequireAuth({ children }) {
   const { loggedUser, loading } = useGlobalContext();
   const navigate = useNavigate();

   useEffect(() => {
      if (!loading && !loggedUser?.user_id) {
         navigate("/", { replace: true });
      }
   }, [loading, loggedUser, navigate]);

   if (loading) {
      return (
         <main id="main" className="main">
            <p className="text-muted p-4">Verifica sessione…</p>
         </main>
      );
   }

   if (!loggedUser?.user_id) {
      return null;
   }

   return children;
}

export default RequireAuth;
