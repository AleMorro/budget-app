import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/** Reindirizza alla sezione account nelle impostazioni */
function AccountSettings() {
   const navigate = useNavigate();
   useEffect(() => {
      navigate("/app/settings#settings-account", { replace: true });
   }, [navigate]);
   return null;
}

export default AccountSettings;
