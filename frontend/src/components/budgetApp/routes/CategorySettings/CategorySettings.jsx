import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/** Reindirizza alla sezione categorie nelle impostazioni */
function CategorySettings() {
   const navigate = useNavigate();
   useEffect(() => {
      navigate("/app/settings#settings-categories", { replace: true });
   }, [navigate]);
   return null;
}

export default CategorySettings;
