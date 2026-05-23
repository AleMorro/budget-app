import React from "react";

function ToastMsg({ message, onClose, variant = "danger" }) {
   const bg = variant === "success" ? "text-bg-success" : "text-bg-danger";

   return (
      <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }}>
         <div className={`toast show ${bg}`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
               <strong className="me-auto">
                  {variant === "success" ? "Operazione riuscita" : "Attenzione"}
               </strong>
               <button
                  type="button"
                  className="btn-close"
                  aria-label="Chiudi"
                  onClick={onClose}
               />
            </div>
            <div className="toast-body">{message}</div>
         </div>
      </div>
   );
}

export default ToastMsg;
