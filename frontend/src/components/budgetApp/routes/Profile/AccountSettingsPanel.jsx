import React, { useState } from "react";
import { useGlobalContext } from "../../../../context/globalContext";

const MAX_AVATAR_BYTES = 512 * 1024;

function AccountSettingsPanel() {
   const { userProfile, updateUserProfile, loggedUser } = useGlobalContext();
   const [name, setName] = useState(userProfile.displayName || loggedUser?.name || "");
   const [saved, setSaved] = useState(false);
   const [avatarError, setAvatarError] = useState(null);

   const handleSaveName = (e) => {
      e.preventDefault();
      updateUserProfile({ displayName: name.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
   };

   const handleAvatar = (e) => {
      setAvatarError(null);
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
         setAvatarError("Seleziona un file immagine (JPG, PNG, …).");
         return;
      }
      if (file.size > MAX_AVATAR_BYTES) {
         setAvatarError("Immagine troppo grande (max 512 KB).");
         return;
      }
      const reader = new FileReader();
      reader.onload = () => updateUserProfile({ avatarDataUrl: reader.result });
      reader.readAsDataURL(file);
   };

   return (
      <>
         <div className="mb-4">
            <h6 className="mb-2">Foto profilo</h6>
            <div className="d-flex align-items-center gap-3 flex-wrap">
               {userProfile.avatarDataUrl ? (
                  <img
                     src={userProfile.avatarDataUrl}
                     alt=""
                     className="rounded-circle border"
                     width={72}
                     height={72}
                     style={{ objectFit: "cover" }}
                  />
               ) : (
                  <i className="bi bi-person-circle fs-1 text-primary" aria-hidden />
               )}
               <div>
                  <input
                     type="file"
                     className="form-control form-control-sm"
                     accept="image/*"
                     onChange={handleAvatar}
                  />
                  {avatarError && <p className="text-danger small mb-0 mt-1">{avatarError}</p>}
                  {userProfile.avatarDataUrl && (
                     <button
                        type="button"
                        className="btn btn-link btn-sm p-0 mt-1"
                        onClick={() => updateUserProfile({ avatarDataUrl: null })}
                     >
                        Rimuovi foto
                     </button>
                  )}
               </div>
            </div>
         </div>
         <div>
            <h6 className="mb-2">Nome visualizzato</h6>
            <form onSubmit={handleSaveName} className="row g-2 align-items-end">
               <div className="col-sm-8">
                  <input
                     className="form-control form-control-sm"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     placeholder={loggedUser?.name || "Nome"}
                     maxLength={80}
                  />
               </div>
               <div className="col-sm-4">
                  <button type="submit" className="btn btn-primary btn-sm w-100">
                     Salva nome
                  </button>
               </div>
            </form>
            {saved && <p className="text-success small mb-0 mt-2">Nome aggiornato.</p>}
            <p className="text-muted small mt-2 mb-0">
               Email: <strong>{loggedUser?.email}</strong>
            </p>
         </div>
      </>
   );
}

export default AccountSettingsPanel;
